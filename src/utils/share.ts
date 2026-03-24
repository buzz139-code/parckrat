import { type TripInput, type PackingItemData } from '../types';

export function buildShareUrl(trip: TripInput, items: PackingItemData[]): string {
  const state = {
    d: trip.destination,
    s: trip.startDate,
    e: trip.endDate,
    t: trip.tripTypes,
    i: items.map(item => ({
      n: item.name,
      d: item.descriptor || null,
      q: item.quantity,
      c: item.category,
      p: item.packed ? 1 : 0,
      w: item.weatherDriven ? 1 : 0,
    })),
  };
  const encoded = btoa(encodeURIComponent(JSON.stringify(state)));
  return `${window.location.origin}${window.location.pathname}?list=${encoded}`;
}

export function parseShareUrl(): { trip: TripInput; items: PackingItemData[] } | null {
  try {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get('list');
    if (!encoded) return null;
    const state = JSON.parse(decodeURIComponent(atob(encoded)));
    const trip: TripInput = {
      destination: state.d,
      startDate: state.s,
      endDate: state.e,
      tripTypes: state.t,
    };
    const items: PackingItemData[] = state.i.map((item: any, idx: number) => ({
      id: `shared_${idx}`,
      name: item.n,
      descriptor: item.d || undefined,
      quantity: item.q,
      category: item.c,
      packed: item.p === 1,
      weatherDriven: item.w === 1,
    }));
    return { trip, items };
  } catch { return null; }
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch { return false; }
}
