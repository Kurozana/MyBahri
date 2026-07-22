/**
 * Live weather via Open-Meteo — a free, key-less, CORS-enabled public API, so it
 * can be called directly from the browser (good enough for the PoC). For
 * production you'd likely proxy weather through the backend/GCP and cache it.
 */

export interface Weather {
  tempC: number
}

/** Riyadh HQ coordinates. */
export const RIYADH = { lat: 24.7136, lon: 46.6753, city: 'Riyadh' }

export async function getWeather(
  lat: number,
  lon: number,
  signal?: AbortSignal,
): Promise<Weather> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m`
  const res = await fetch(url, { signal })
  if (!res.ok) throw new Error(`weather failed: ${res.status}`)
  const data = (await res.json()) as { current?: { temperature_2m?: number } }
  const t = data.current?.temperature_2m
  if (typeof t !== 'number') throw new Error('weather: missing temperature')
  return { tempC: Math.round(t) }
}
