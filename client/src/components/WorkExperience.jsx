function WorkExperience({ data, onChange }) {
  const handleChange = (id, field, value) =>
    onChange(data.map(item => item.id === id ? { ...item, [field]: value } : item))

  return (
    <section className="section">
      <h2>Work Experience</h2>
      {data.map((item, index) => (
        <fieldset key={item.id} className="bin-entry">
          <legend>Job {index + 1}</legend>
          <div className="form-grid">
              <label>
                Company Name
                <input type="text" value={item.companyName || ''} onChange={(e) => handleChange(item.id, 'companyName', e.target.value)} />
              </label>
              <label>
                Location
                <input type="text" value={item.location || ''} onChange={(e) => handleChange(item.id, 'location', e.target.value)} />
              </label>
              <label>
                Role
                <input type="text" value={item.role || ''} onChange={(e) => handleChange(item.id, 'role', e.target.value)} />
              </label>
              <label>
                Description
                <textarea rows="4" value={item.text || ''} onChange={(e) => handleChange(item.id, 'text', e.target.value)} />
              </label>
          </div>
          <button type="button" onClick={() => onChange(data.filter(entry => entry.id !== item.id))}>Remove Job</button>
        </fieldset>
      ))}
      <button type="button" onClick={() => onChange([...data, { id: crypto.randomUUID() }])}>Add Job</button>
    </section>
  )
}

export default WorkExperience
