import assert from 'node:assert/strict'
import { createServer } from 'vite'

const server = await createServer({ server: { middlewareMode: true, hmr: false, ws: false } })
const elements = node => !node || typeof node !== 'object' ? [] :
  [node, ...[node.props?.children].flat(Infinity).flatMap(elements)]

try {
  for (const name of ['WorkExperience', 'Projects', 'Activities']) {
    const { default: Bin } = await server.ssrLoadModule(`/src/components/${name}.jsx`)
    const data = [{ id: 'first' }, { id: 'second' }]
    let updated
    const render = entries => elements(Bin({ data: entries, onChange: value => { updated = value } }))
    const nodes = render(data)
    const inputs = nodes.filter(node => ['input', 'textarea'].includes(node.type))
    for (const input of inputs.slice(inputs.length / 2)) {
      input.props.onChange({ target: { value: 'Updated' } })
      assert.deepEqual(updated[0], data[0])
      assert.ok(Object.values(updated[1]).includes('Updated'))
      assert.deepEqual(data[1], { id: 'second' })
    }
    const buttons = nodes.filter(node => node.type === 'button')
    buttons[0].props.onClick()
    assert.deepEqual(updated, [data[1]])
    buttons.at(-1).props.onClick()
    assert.equal(updated.length, 3)
    assert.ok(updated[2].id)
    render([]).find(node => node.type === 'button').props.onClick()
    assert.equal(updated.length, 1)
    assert.ok(updated[0].id)
  }
  const { default: Picker } = await server.ssrLoadModule('/src/components/MonthYearPicker.jsx')
  let date = ''
  const picker = () => elements(Picker({ label: 'Project date', value: date, onChange: value => { date = value } }))
  picker().find(node => node.props?.['aria-label'] === 'Project date month').props.onChange({ target: { value: '06' } })
  assert.equal(date, '-06')
  assert.ok(picker().find(node => node.props?.['aria-label'] === 'Project date year').props.required)
  picker().find(node => node.props?.['aria-label'] === 'Project date year').props.onChange({ target: { value: '2027' } })
  assert.equal(date, '2027-06')
  date = '2024-03-18'
  assert.equal(picker().find(node => node.props?.['aria-label'] === 'Project date month').props.value, '03')
  date = '2027'
  assert.equal(picker().find(node => node.props?.['aria-label'] === 'Project date year').props.value, '2027')
  picker().find(node => node.type === 'button').props.onClick()
  assert.equal(date, '')
  const { monthValue } = await server.ssrLoadModule('/src/resume-data.js')
  assert.equal(monthValue('2024-03-18'), '2024-03')
  assert.equal(monthValue('2027'), '2027')
  console.log('Bin editing and month/year picker checks passed.')
} finally {
  await server.close()
}
