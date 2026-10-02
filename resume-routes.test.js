const assert = require('node:assert/strict')
const { once } = require('node:events')
const express = require('express')
const { ObjectId } = require('mongodb')
const resumeRoutes = require('./resume-routes')

const rows = []
const matches = (row, filter) => Object.entries(filter).every(([key, value]) => String(row[key]) === String(value))
const collection = {
  find: filter => ({ sort: () => ({ toArray: async () => rows.filter(row => matches(row, filter)).map(({ _id, name, updatedAt }) => ({ _id, name, updatedAt })) }) }),
  findOne: async filter => rows.find(row => matches(row, filter)),
  insertOne: async data => { const _id = new ObjectId(); rows.push({ ...data, _id }); return { insertedId: _id } },
  updateOne: async (filter, update) => { const row = rows.find(row => matches(row, filter)); if (row) Object.assign(row, update.$set); return { matchedCount: Number(!!row) } }
}

async function test() {
  const app = express()
  app.use(express.json())
  app.use('/api/resumes', (request, response, next) => {
    if (!request.headers['x-test-user']) return response.sendStatus(401)
    request.session = { userId: request.headers['x-test-user'] }
    next()
  }, resumeRoutes(collection))
  const server = app.listen(0, '127.0.0.1')
  await once(server, 'listening')
  const call = (path = '', method = 'GET', body, user = 'andry') => fetch(`http://127.0.0.1:${server.address().port}/api/resumes${path}`, {
    method, headers: { 'Content-Type': 'application/json', ...(user ? { 'x-test-user': user } : {}) }, body: body ? JSON.stringify(body) : undefined
  })
  try {
    assert.equal((await call('', 'GET', undefined, '')).status, 401)
    const content = { personalInfo: { fullName: 'Alex Morgan' }, projects: [{ id: 'p1', name: 'Original project' }] }
    const first = await (await call('', 'POST', { name: 'Internship', content, userId: 'someone-else' })).json()
    const second = await (await call('', 'POST', { name: 'Campus job', content })).json()
    assert.notEqual(first._id, second._id)
    assert.equal((await (await call()).json()).length, 2)
    assert.equal((await (await call('', 'GET', undefined, 'other')).json()).length, 0)
    assert.equal((await call(`/${first._id}`, 'GET', undefined, 'other')).status, 404)
    assert.equal((await call(`/${first._id}/pdf`, 'GET', undefined, 'other')).status, 404)
    assert.equal((await call(`/${first._id}`, 'PUT', { name: 'Hacked', content }, 'other')).status, 404)
    assert.equal((await call('/not-an-id')).status, 400)
    assert.equal((await call('', 'POST', { name: ' ', content })).status, 400)
    assert.equal((await call('/preview', 'POST', { projects: [{ name: 'No ID' }] })).status, 400)
    await call(`/${first._id}`, 'PUT', { name: 'Updated internship', content: { ...content, projects: [{ id: 'p1', name: 'Tailored project' }] } })
    assert.equal((await (await call(`/${first._id}`)).json()).content.projects[0].name, 'Tailored project')
    assert.equal((await (await call(`/${second._id}`)).json()).content.projects[0].name, 'Original project')
    const pdf = await call(`/${first._id}/pdf`)
    assert.equal(pdf.status, 200)
    assert.equal(Buffer.from(await pdf.arrayBuffer()).subarray(0, 5).toString(), '%PDF-')
    const { getSelection, selectContent, mergeContent } = await import('./client/src/resume-data.js')
    const library = { ...content, projects: [{ id: 'p1', name: 'Changed in account' }, { id: 'p2', name: 'New project' }] }
    const merged = mergeContent(library, content)
    assert.equal(merged.projects.length, 2)
    assert.equal(merged.projects[0].name, 'Original project')
    assert.deepEqual(selectContent(merged, getSelection(content)).projects, content.projects)
    console.log('Saved resume create, reopen, update, isolation, validation, download, and snapshot checks passed.')
  } finally { server.close() }
}

test().catch(error => { console.error(error); process.exitCode = 1 })
