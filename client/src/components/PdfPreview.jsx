import { useEffect, useRef, useState } from 'react'
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist'
import worker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

GlobalWorkerOptions.workerSrc = worker

function PdfPreview({ url }) {
  const container = useRef(null)
  const [attempt, setAttempt] = useState(0)
  const [status, setStatus] = useState('Rendering pages...')

  useEffect(() => {
    const target = container.current
    const task = getDocument({ url })
    let cancelled = false
    target.replaceChildren()
    const render = async () => {
      try {
        const pdf = await task.promise
        for (let number = 1; number <= pdf.numPages; number++) {
          const page = await pdf.getPage(number)
          if (cancelled) return
          const viewport = page.getViewport({ scale: 1.5 })
          const canvas = document.createElement('canvas')
          canvas.width = viewport.width
          canvas.height = viewport.height
          canvas.setAttribute('role', 'img')
          canvas.setAttribute('aria-label', `Resume page ${number} of ${pdf.numPages}`)
          await page.render({ canvas, viewport }).promise
          if (cancelled) return
          target.append(canvas)
        }
        setStatus(`${pdf.numPages} ${pdf.numPages === 1 ? 'page' : 'pages'}`)
      } catch (error) {
        if (!cancelled) console.error('PDF preview:', error)
        if (!cancelled) setStatus('Could not display the preview. You can still download the PDF or retry the preview.')
      }
    }
    render()
    return () => { cancelled = true; task.destroy() }
  }, [url, attempt])

  return <><div ref={container} className="pdf-pages" /><p className="preview-note" role="status">{status}</p>{status.startsWith('Could not') && <button onClick={() => { setStatus('Rendering pages...'); setAttempt(attempt + 1) }}>Retry display</button>}</>
}

export default PdfPreview
