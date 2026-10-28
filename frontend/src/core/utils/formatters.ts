/**
 * Shared formatting utilities.
 * Provides consistent formatting for currency (Indonesian Rupiah) and localized dates.
 */

/**
 * Formats a numeric value into the Indonesian Rupiah (IDR) currency format.
 *
 * @param amount Numeric value or parseable numeric string
 * @returns Formatted currency string, e.g. "Rp 1.500.000"
 */
export function formatCurrency(amount: number | string): string {
  const numeric = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(numeric)) return 'Rp 0';

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numeric);
}

/**
 * Formats an ISO date string or Date instance into a localized display format.
 *
 * @param dateInput Valid date string or Date instance
 * @returns Formatted date string, e.g. "28 Okt 2026"
 */
export function formatDate(dateInput: string | Date): string {
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '-';

  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(d);
}
