import MonthYearPicker from './MonthYearPicker'

function Accomplishments({ data, onChange }) {
  const handleChange = (id, field, value) =>
    onChange(data.map(item => item.id === id ? { ...item, [field]: value } : item))

  return (
    <section className="section">
      <h2>Accomplishments, Awards, or Certifications</h2>
      {data.map((item, index) => (
        <fieldset key={item.id} className="bin-entry">
          <legend>Accomplishment {index + 1}</legend>
          <div className="form-grid">
            <label>
              Name
              <input
                type="text"
                value={item.name || ''}
                onChange={(e) => handleChange(item.id, 'name', e.target.value)}
              />
            </label>

            <label>
              Description
              <textarea
                rows="4"
                value={item.description || ''}
                onChange={(e) => handleChange(item.id, 'description', e.target.value)}
              />
            </label>

            <MonthYearPicker label="Award or certification date" value={item.date || ''} onChange={value => handleChange(item.id, 'date', value)} />
          </div>

          <button
            type="button"
            onClick={() => onChange(data.filter(entry => entry.id !== item.id))}
          >
            Remove Accomplishment
          </button>
        </fieldset>
      ))}

      <button
        type="button"
        onClick={() => onChange([...data, { id: crypto.randomUUID() }])}
      >
        Add Accomplishment
      </button>
    </section>
  )
}

export default Accomplishments