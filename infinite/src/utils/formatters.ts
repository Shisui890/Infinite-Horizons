/**
 * Formatador histórico de tempo e anos
 * Converte coordenadas temporais numéricas para a notação histórica padrão (d.C. / a.C.)
 * Exemplo: 9 -> "9 d.C.", 2025 -> "2025 d.C.", -500 -> "500 a.C."
 */

export function formatHistoricalYear(year: number | string | undefined | null): string {
  if (year === undefined || year === null || year === '') return '';
  const num = typeof year === 'string' ? parseInt(year.replace(/[^\d-]/g, ''), 10) : Math.round(year);
  if (isNaN(num)) return String(year);
  if (num < 0) {
    return `${Math.abs(num)} a.C.`;
  }
  return `${num} d.C.`;
}

/**
 * Retorna o ano com prefixo ou formatação extendida quando necessário
 */
export function formatHistoricalDateLabel(year: number | string | undefined | null, prefix = ''): string {
  const formatted = formatHistoricalYear(year);
  if (!formatted) return '';
  return prefix ? `${prefix} ${formatted}` : formatted;
}
