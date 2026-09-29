function Education({ data, onChange }) {
  const handleChange = (id, field, value) =>
    onChange(data.map(item => item.id === id ? { ...item, [field]: value } : item))

  return (
    <section className="section">
      <h2>Education</h2>
      {data.map((item, index) => (
        <fieldset key={item.id} className="bin-entry">
          <legend>School {index + 1}</legend>
          <div className="form-grid">
            <label>
              School Name
              <input
                type="text"
                value={item.schoolName || ''}
                onChange={(e) => handleChange(item.id, 'schoolName', e.target.value)}
              />
            </label>

            <label>
              Location
              <input
                type="text"
                value={item.location || ''}
                onChange={(e) => handleChange(item.id, 'location', e.target.value)}
              />
            </label>

            <label>
              Major
              <input
                type="text"
                value={item.major || ''}
                onChange={(e) => handleChange(item.id, 'major', e.target.value)}
              />
            </label>

            <label>
              Minor(s)
              <input
                type="text"
                value={item.minors || ''}
                onChange={(e) => handleChange(item.id, 'minors', e.target.value)}
              />
            </label>

            <label>
              GPA
              <input
                type="text"
                value={item.gpa || ''}
                onChange={(e) => handleChange(item.id, 'gpa', e.target.value)}
              />
            </label>

            <label>
              Degree Type
              <input
                type="text"
                value={item.degreeType || ''}
                onChange={(e) => handleChange(item.id, 'degreeType', e.target.value)}
              />
            </label>

            <label>
              Graduation Year
              <input
                type="text"
                value={item.gradYear || ''}
                onChange={(e) => handleChange(item.id, 'gradYear', e.target.value)}
              />
            </label>
          </div>

          <button
            type="button"
            onClick={() => onChange(data.filter(entry => entry.id !== item.id))}
          >
            Remove School
          </button>
        </fieldset>
      ))}

      <button
        type="button"
        onClick={() => onChange([...data, { id: crypto.randomUUID() }])}
      >
        Add School
      </button>
    </section>
  )
}

export default Education