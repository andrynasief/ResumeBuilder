const { Router } = require('express')
const { ObjectId } = require('mongodb')
const { normalizeResume, compileResume } = require('./resume-pdf')

function resumeRoutes(collection) {
  const router = Router()
  router.use((request, response, next) => { response.set('Cache-Control', 'no-store'); next() })
  const filter = request => ({ _id: new ObjectId(request.params.id), userId: request.session.userId })
  const details = body => {
    if (typeof body?.name !== 'string' || !body.name.trim() || body.name.trim().length > 80) throw new Error('Give your resume a name (up to 80 characters).')
    return { name: body.name.trim(), content: normalizeResume(body.content), updatedAt: new Date() }
  }
  const sendPDF = async (request, response, content) => {
    const controller = new AbortController()
    response.on('close', () => { if (!response.writableEnded) controller.abort() })
    try {
      const pdf = await compileResume(content, controller.signal)
      response.type('pdf').set('Content-Disposition', 'inline; filename="resume.pdf"').send(pdf)
    } catch (error) {
      if (controller.signal.aborted) return
      response.status(503).json({ error: error.code === 'ENOENT' ? 'PDF preview is unavailable. Ask the app administrator to install XeLaTeX.' : 'Could not build the PDF. Try again or select fewer entries.' })
    }
  }

  router.get('/', async (request, response) => {
    const resumes = await collection.find({ userId: request.session.userId }, { projection: { name: 1, updatedAt: 1 } }).sort({ updatedAt: -1 }).toArray()
    response.json(resumes)
  })

  router.post('/', async (request, response) => {
    let data
    try { data = details(request.body) } catch (error) { return response.status(400).json({ error: error.message }) }
    const result = await collection.insertOne({ ...data, userId: request.session.userId })
    response.status(201).json({ _id: result.insertedId, ...data })
  })

  router.post('/preview', async (request, response) => {
    let content
    try { content = normalizeResume(request.body) } catch (error) { return response.status(400).json({ error: error.message }) }
    await sendPDF(request, response, content)
  })

  router.param('id', (request, response, next, id) => {
    if (!/^[a-f\d]{24}$/i.test(id)) return response.status(400).json({ error: 'Invalid resume ID.' })
    next()
  })

  router.get('/:id', async (request, response) => {
    const resume = await collection.findOne(filter(request))
    if (!resume) return response.status(404).json({ error: 'Resume not found.' })
    response.json(resume)
  })

  router.put('/:id', async (request, response) => {
    let data
    try { data = details(request.body) } catch (error) { return response.status(400).json({ error: error.message }) }
    const result = await collection.updateOne(filter(request), { $set: data })
    if (!result.matchedCount) return response.status(404).json({ error: 'Resume not found.' })
    response.json({ _id: request.params.id, ...data })
  })

  router.get('/:id/pdf', async (request, response) => {
    const resume = await collection.findOne(filter(request))
    if (!resume) return response.status(404).json({ error: 'Resume not found.' })
    await sendPDF(request, response, resume.content)
  })

  router.use((error, request, response, next) => {
    if (response.headersSent) return next(error)
    response.status(500).json({ error: 'Could not access your saved resumes. Please try again.' })
  })
  return router
}

module.exports = resumeRoutes
