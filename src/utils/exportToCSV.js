function escapeCsvCell(value) {
  const s = String(value ?? '')
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`
  }
  return s
}

/**
 * Builds a CSV from transactions and triggers a browser download.
 * @param {Array<{ date: string, category: string, type: string, amount: number }>} transactions
 * @param {string} [filename='transactions.csv']
 */
export function exportToCSV(transactions, filename = 'transactions.csv') {
  const headers = ['Date', 'Category', 'Type', 'Amount']
  const lines = [
    headers.map(escapeCsvCell).join(','),
    ...transactions.map((t) =>
      [t.date, t.category, t.type, t.amount]
        .map(escapeCsvCell)
        .join(','),
    ),
  ]
  const csv = lines.join('\r\n')
  const blob = new Blob(['\uFEFF' + csv], {
    type: 'text/csv;charset=utf-8;',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.rel = 'noopener'
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
