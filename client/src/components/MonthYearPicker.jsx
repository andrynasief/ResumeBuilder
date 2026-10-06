const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

function MonthYearPicker({ label = 'Date', value = '', onChange }) {
  const match = /^(\d{4})?(?:-(0[1-9]|1[0-2])?)?(?:-\d{2})?$/.exec(value)
  const year = match?.[1] || ''
  const month = match?.[2] || ''
  const update = (nextYear, nextMonth) => onChange(nextYear || nextMonth ? `${nextYear}-${nextMonth}` : '')
  const currentYear = new Date().getFullYear()
  const years = [...new Set([year, ...Array.from({ length: currentYear + 16 - 1900 }, (_, index) => String(currentYear + 15 - index))])].filter(Boolean).sort().reverse()
  const required = value.includes('-') && !!(year || month)

  return (
    <fieldset className="month-year">
      <legend>{label}</legend>
      <div className="month-year-fields">
        <label>Month
          <select aria-label={`${label} month`} value={month} required={required} onChange={event => update(year, event.target.value)}>
            <option value="">Month</option>
            {months.map((name, index) => <option key={name} value={String(index + 1).padStart(2, '0')}>{name}</option>)}
          </select>
        </label>
        <label>Year
          <select aria-label={`${label} year`} value={year} required={required} onChange={event => update(event.target.value, month)}>
            <option value="">Year</option>
            {years.map(year => <option key={year}>{year}</option>)}
          </select>
        </label>
        {value && <button type="button" className="text-button" onClick={() => onChange('')} aria-label={`Clear ${label.toLowerCase()}`}>Clear</button>}
      </div>
      {value && (!match || !value.includes('-')) && <small>Previously saved: {value}. Choose a month and year to update it.</small>}
    </fieldset>
  )
}

export default MonthYearPicker
