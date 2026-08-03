/**
 * Download an array of rows as a CSV file that Excel opens cleanly.
 * The UTF-8 BOM keeps Arabic names and diacritics intact in Excel.
 */
export function exportCsv(filename: string, rows: Record<string, unknown>[]): void {
  if (rows.length === 0) return

  const headers = Object.keys(rows[0])
  const escape = (value: unknown) => {
    const s = value == null ? '' : String(value)
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }

  const csv = [
    headers.join(','),
    ...rows.map((row) => headers.map((h) => escape(row[h])).join(',')),
  ].join('\r\n')

  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename.endsWith('.csv') ? filename : `${filename}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
