export const bins = [
  ['education', 'Education'], ['workExperience', 'Work Experience'],
  ['projects', 'Projects'], ['activities', 'Activities'],
  ['skills', 'Skills'], ['accomplishments', 'Awards & Certifications']
]
export const personalFields = [
  ['fullName', 'Full Name'], ['email', 'Email'], ['phone', 'Phone'],
  ['location', 'Location'], ['linkedin', 'LinkedIn'], ['website', 'Website']
]
export const hasText = value => typeof value === 'string' && value.trim()
export const entries = (data, key) => (Array.isArray(data[key]) ? data[key] : []).filter(item =>
  item?.id && Object.entries(item).some(([field, value]) => field !== 'id' && typeof value === 'string'))
export const getSelection = data => ({
  personalInfo: personalFields.filter(([key]) => hasText(data.personalInfo?.[key])).map(([key]) => key),
  professionalSummary: !!hasText(data.professionalSummary?.summary),
  ...Object.fromEntries(bins.map(([key]) => [key, entries(data, key).map(item => item.id)]))
})
export const selectContent = (data, selection) => ({
  personalInfo: Object.fromEntries(selection.personalInfo.map(key => [key, data.personalInfo[key]])),
  professionalSummary: selection.professionalSummary ? data.professionalSummary : {},
  ...Object.fromEntries(bins.map(([key]) => [key, (data[key] || []).filter(item => selection[key].includes(item.id))]))
})
export const mergeContent = (library, content) => ({
  personalInfo: { ...library.personalInfo, ...content.personalInfo },
  professionalSummary: { ...library.professionalSummary, ...content.professionalSummary },
  ...Object.fromEntries(bins.map(([key]) => [key, [...new Map([...(library[key] || []), ...(content[key] || [])].map(item => [item.id, item])).values()]]))
})
