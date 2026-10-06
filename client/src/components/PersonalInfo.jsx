function PersonalInfo({ data, onChange }) {
  const handleChange = function(field, value) {
    onChange({ ...data, [field]: value })
  }

  return (
    <section className="section">
      <h2>Personal Info</h2>
      <div className="form-grid">
        <label>Full Name
        <input
          type="text"
          placeholder="Full Name"
          value={data.fullName || ''}
          onChange={(e) => handleChange('fullName', e.target.value)}
        />
        </label>
        <label>Email
        <input
          type="email"
          placeholder="Email"
          value={data.email || ''}
          onChange={(e) => handleChange('email', e.target.value)}
        />
        </label>
        <label>Phone
        <input
          type="tel"
          placeholder="Phone"
          value={data.phone || ''}
          onChange={(e) => handleChange('phone', e.target.value)}
        />
        </label>
        <label>Location (City, State)
        <input
          type="text"
          placeholder="Location (City, State)"
          value={data.location || ''}
          onChange={(e) => handleChange('location', e.target.value)}
        />
        </label>
        <label>LinkedIn URL
        <input
          type="url"
          placeholder="LinkedIn URL"
          value={data.linkedin || ''}
          onChange={(e) => handleChange('linkedin', e.target.value)}
        />
        </label>
        <label>Portfolio/Website URL
        <input
          type="url"
          placeholder="Portfolio/Website URL"
          value={data.website || ''}
          onChange={(e) => handleChange('website', e.target.value)}
        />
        </label>
      </div>
    </section>
  )
}

export default PersonalInfo