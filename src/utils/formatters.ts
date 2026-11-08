/**
 * Utility functions untuk format data di aplikasi Kecap Mringin
 * Melengkapi struktur standar Modul 3: app/, components/, services/, types/, utils/
 */

export function formatRupiah(amount: number): string {
  return `Rp ${Number(amount || 0).toLocaleString("id-ID")}`;
}

export function formatEuro(amount: number): string {
  return `€${Number(amount || 0).toFixed(2)}`;
}

