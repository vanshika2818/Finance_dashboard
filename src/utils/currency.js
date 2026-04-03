export const EXCHANGE_RATES = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.5,
  INR: 83,
  AUD: 1.53,
  CAD: 1.37,
  CHF: 0.88,
}

export const CURRENCY_SYMBOLS = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  INR: '₹',
  AUD: 'A$',
  CAD: 'C$',
  CHF: 'CHF',
}

export function formatCurrency(amount, currency = 'USD') {
  const numAmount = Number(amount)
  if (!Number.isFinite(numAmount)) return '$0.00'

  const rate = EXCHANGE_RATES[currency] || 1
  const convertedAmount = numAmount * rate

  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(convertedAmount)
  } catch {
    // Fallback for unsupported currencies
    const symbol = CURRENCY_SYMBOLS[currency] || '$'
    return `${symbol}${convertedAmount.toFixed(2)}`
  }
}
