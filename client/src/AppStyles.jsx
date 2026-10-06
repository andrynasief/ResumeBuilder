function AppStyles() {
  return <style>{`
  :root { font: 18px/145% system-ui, sans-serif; color-scheme: light; }
  #root { width: 1126px; max-width: 100%; margin: 0 auto; text-align: center; min-height: 100svh; box-sizing: border-box; }
  h1, h2 { font-weight: 500; }
  h1 { font-size: 56px; letter-spacing: -1.68px; margin: 32px 0; }
  h2 { font-size: 24px; line-height: 118%; letter-spacing: -.24px; margin: 0 0 8px; }
  p { margin: 0; }
  @media (max-width: 1024px) { :root { font-size: 16px; } h1 { font-size: 36px; margin: 20px 0; } h2 { font-size: 20px; } }
body {
  margin: 0;
  font-family: system-ui, sans-serif;
  background-color: #f4f1ea;
  color: #2b2b2b;
}

.navbar {
  display: flex;
  gap: 20px;
  padding: 16px 24px;
  background-color: #33474d;
}

.navbar a {
  color: white;
  text-decoration: none;
  font-weight: 500;
}

.navbar a:hover {
  text-decoration: underline;
}

.container {
  max-width: 700px;
  margin: 0 auto;
  padding: 24px;
}

.section {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.section h2 {
  margin-top: 0;
  color: #33474d;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.form-grid input,
textarea {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-family: inherit;
  font-size: 1em;
  width: 100%;
  box-sizing: border-box;
}

textarea {
  resize: vertical;
}

.save-btn {
  padding: 10px 24px;
  background-color: #33474d;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1em;
}

.save-btn:hover {
  background-color: #22303a;
}

.save-status {
  margin-left: 12px;
  color: #2c7a2c;
  font-weight: 500;
}
.bin-form {
  border: 0;
  padding: 0;
  margin: 0;
  min-width: 0;
}

.bin-entry {
  border: 1px solid #ccc;
  border-radius: 6px;
  margin: 0 0 16px;
  padding: 12px;
  min-width: 0;
}

.bin-entry button {
  margin-top: 12px;
}

.form-grid label {
  display: grid;
  gap: 6px;
  min-width: 0;
}

@media (max-width: 500px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}

.resume-builder {
  padding: 28px;
  text-align: left;
  color-scheme: light;
  color: #2b2b2b;
}

.builder-heading, .preview-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
}

.builder-heading h1 {
  font-size: 36px;
  color: #33474d;
  margin: 0 0 12px;
}

.builder-heading a { flex-shrink: 0; color: #33474d; }
.builder-layout { display: grid; grid-template-columns: minmax(250px, 0.8fr) minmax(0, 1.4fr); gap: 24px; align-items: start; }
.builder-selections .section { padding: 18px; }
.resume-choice { display: flex; align-items: flex-start; gap: 10px; padding: 12px 0; cursor: pointer; border-bottom: 1px solid #eee; }
.resume-choice:last-child { border-bottom: 0; }
.resume-choice input { margin-top: 5px; accent-color: #33474d; flex-shrink: 0; width: 17px; height: 17px; }
.resume-choice span { min-width: 0; overflow-wrap: anywhere; }
.resume-choice strong, .resume-choice small { display: block; }
.resume-choice small, .empty-bin, .preview-note { color: #60686b; font-size: 13px; line-height: 1.5; }
.preview-panel { position: sticky; top: 20px; background: #e5e8e7; border: 1px solid #d4dbd8; border-radius: 10px; padding: 18px; }
.preview-toolbar { margin-bottom: 10px; flex-wrap: wrap; gap: 12px; }
.preview-toolbar h2 { color: #33474d; }
.preview-toolbar p, .preview-status { font-size: 13px; }
.preview-toolbar a { text-decoration: none; font-size: 13px; padding: 9px 14px; }
.preview-status { margin-bottom: 12px; }
.preview-placeholder { display: grid; place-items: center; text-align: center; padding: 24px; min-height: 420px; background: white; color: #60686b; }
.preview-note { margin-top: 12px; }

@media (max-width: 800px) {
  .resume-builder { padding: 18px; }
  .builder-heading { align-items: flex-start; flex-direction: column; }
  .builder-layout { grid-template-columns: 1fr; }
  .preview-panel { position: static; }
}

.pdf-pages { max-height: 70vh; overflow-y: auto; overflow-x: hidden; }
.pdf-pages canvas { display: block; width: 100%; height: auto; background: white; margin-bottom: 16px; box-shadow: 0 2px 5px #0002; }
.resume-actions { display: flex; align-items: end; flex-wrap: wrap; gap: 12px; margin: 0 0 24px; }
.resume-actions label { display: grid; gap: 6px; flex: 1; min-width: 180px; }
.resume-actions input, .resume-edit input { box-sizing: border-box; width: 100%; padding: 10px; border: 1px solid #b9c3c1; border-radius: 6px; font: inherit; }
.resume-actions span { font-size: 13px; align-self: center; }
.resume-list { display: flex; flex-wrap: wrap; gap: 12px; margin: 12px 0; }
.resume-card { display: flex; align-items: center; gap: 16px; padding: 10px 14px; border: 1px solid #d4dbd8; border-radius: 6px; min-width: 0; }
.resume-card button { border: 0; background: transparent; font: inherit; color: #33474d; cursor: pointer; text-align: left; overflow-wrap: anywhere; }
.resume-card button[aria-current] { font-weight: 700; text-decoration: underline; }
.resume-card a { font-size: 13px; color: #33474d; overflow-wrap: anywhere; }
.resume-edit { margin: 0 0 12px 27px; font-size: 13px; }
.resume-edit summary { cursor: pointer; color: #33474d; margin-bottom: 8px; }
.resume-edit label { display: grid; gap: 4px; margin-top: 8px; text-transform: capitalize; }
.resume-edit textarea { text-transform: none; }
button:disabled { opacity: 0.6; cursor: default; }

  .navbar { align-items: center; flex-wrap: wrap; }
  .navbar a[aria-current=page] { text-decoration: underline; }
  .container { box-sizing: border-box; width: 100%; }
  .field-label { display: grid; gap: 6px; }
  .login-form { display: grid; gap: 16px; max-width: 420px; margin: 0 auto 16px; text-align: left; }
  .login-form label { display: grid; gap: 6px; }
  .login-form input, select { padding: 10px; border: 1px solid #ccc; border-radius: 6px; font: inherit; width: 100%; box-sizing: border-box; background: white; color: #2b2b2b; }
  .section-intro { margin: 20px 0; }
  .month-year { border: 0; padding: 0; margin: 0; min-width: 0; grid-column: 1 / -1; text-align: left; }
  .month-year legend { padding: 0; margin-bottom: 6px; color: inherit; font-size: inherit; }
  .month-year-fields { display: flex; align-items: end; gap: 10px; }
  .month-year-fields label { flex: 1; min-width: 0; }
  .month-year-fields button { margin: 0; }
  .month-year small { font-size: 13px; }
  .pdf-controls { margin: 16px 0; padding: 16px; background: #f9f9f9; border: 1px solid #ddd; border-radius: 6px; }
  .pdf-controls h3 { margin: 0; }
  .pdf-controls fieldset { display: flex; gap: 24px; margin: 8px 0 0; flex-wrap: wrap; border: 0; padding: 0; }
  .pdf-controls label { display: flex; align-items: center; gap: 8px; }
  .pdf-controls select { width: auto; }
  .section-group { margin-bottom: 16px; }
  .section-group[data-hidden=true] .section { opacity: .6; }
  .section-tools { display: flex; justify-content: flex-end; gap: 6px; margin-bottom: 8px; }
  .section-tools button { padding: 3px 7px; font-size: 13px; cursor: pointer; }
  .section-tools button[aria-pressed=true] { background: #ddd; }
  .preview-panel { min-width: 0; }
  :focus-visible { outline: 2px solid #33474d; outline-offset: 3px; }
  .navbar :focus-visible { outline-color: white; }
  .skip-link { position: absolute; top: -100px; background: white; padding: 10px; z-index: 10; }
  .skip-link:focus { top: 10px; }
  [role=alert] { color: #a12d2d; }
  @media (max-width: 500px) { .navbar { gap: 12px; } .pdf-controls label { flex-wrap: wrap; } }
  `}</style>
}

export default AppStyles
