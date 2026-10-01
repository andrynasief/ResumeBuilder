function Skills({ data, onChange }) {
  const handleChange = (id, value) =>
    onChange(data.map(item => item.id === id ? { ...item, skill: value } : item))

  return (
    <section className="section">
      <h2>Skills</h2>
      {data.map((item, index) => (
        <fieldset key={item.id} className="bin-entry">
          <legend>Skill {index + 1}</legend>
          <div className="form-grid">
            <label>
              Skill
              <input
                type="text"
                value={item.skill || ''}
                onChange={(e) => handleChange(item.id, e.target.value)}
              />
            </label>
          </div>

          <button
            type="button"
            onClick={() => onChange(data.filter(entry => entry.id !== item.id))}
          >
            Remove Skill
          </button>
        </fieldset>
      ))}

      <button
        type="button"
        onClick={() => onChange([...data, { id: crypto.randomUUID() }])}
      >
        Add Skill
      </button>
    </section>
  )
}

export default Skills