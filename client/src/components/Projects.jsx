function Projects({ data, onChange }) {
  const handleChange = (id, field, value) =>
    onChange(data.map(item => item.id === id ? { ...item, [field]: value } : item))

  return (
    <section className="section">
      <h2>Projects</h2>
      {data.map((item, index) => (
        <fieldset key={item.id} className="bin-entry">
          <legend>Project {index + 1}</legend>
          <div className="form-grid">
              <label>
                Name
                <input type="text" value={item.name || ''} onChange={(e) => handleChange(item.id, 'name', e.target.value)} />
              </label>
              <label>
                Description
                <textarea rows="4" value={item.description || ''} onChange={(e) => handleChange(item.id, 'description', e.target.value)} />
              </label>
              <label>
                Date
                <input type="date" value={item.date || ''} onChange={(e) => handleChange(item.id, 'date', e.target.value)} />
              </label>
          </div>
          <button type="button" onClick={() => onChange(data.filter(entry => entry.id !== item.id))}>Remove Project</button>
        </fieldset>
      ))}
      <button type="button" onClick={() => onChange([...data, { id: crypto.randomUUID() }])}>Add Project</button>
    </section>
  )
}

export default Projects
