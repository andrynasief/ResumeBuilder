function ProfessionalSummary({ data, onChange }) {
  return (
    <section className="section">
      <h2>Professional Summary</h2>
      <textarea
        placeholder="Write a 2-3 sentence summary of your professional background and goals..."
        rows="5"
        value={data.summary || ''}
        onChange={(e) => onChange({ ...data, summary: e.target.value })}
      />
    </section>
  )
}

export default ProfessionalSummary