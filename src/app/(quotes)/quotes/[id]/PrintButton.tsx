'use client'

export function PrintButton() {
  return (
    <button type="button" className="btn-ember" onClick={() => window.print()}>
      Download PDF
    </button>
  )
}
