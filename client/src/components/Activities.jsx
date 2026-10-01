function Activities({ data, onChange }) {
  const handleChange = (id, field, value) =>
    onChange(data.map(item => item.id === id ? { ...item, [field]: value } : item))

  return (
    <section className="section">
      <h2>Activities</h2>
      {data.map((item, index) => (
        <fieldset key={item.id} className="bin-entry">
          <legend>Activity {index + 1}</legend>
          <div className="form-grid">
              <label>
                Name
                <input type="text" value={item.name || ''} onChange={(e) => handleChange(item.id, 'name', e.target.value)} />
              </label>
              <label>
                Description
                <textarea rows="4" value={item.description || ''} onChange={(e) => handleChange(item.id, 'description', e.target.value)} />
              </label>
          </div>
          <button type="button" onClick={() => onChange(data.filter(entry => entry.id !== item.id))}>Remove Activity</button>
        </fieldset>
      ))}
      <button type="button" onClick={() => onChange([...data, { id: crypto.randomUUID() }])}>Add Activity</button>
    </section>
  )
}

export default Activities
