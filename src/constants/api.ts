export const API = {
  baseUrl: 'https://6ae183c8be3bc8fead989cfe.mockapi.io',
  resource: 'medidores',
  timeoutMs: 15000,
  cacheVigenciaMs: 24 * 60 * 60 * 1000,
} as const;

export function urlMedidores(codigo: string): string {
  return `${API.baseUrl}/${API.resource}?codigo=${encodeURIComponent(codigo)}`;
}
