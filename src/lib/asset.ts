/**
 * Resolve a public asset path against the app's base URL so it works both in dev
 * (base "/") and under the GitHub Pages sub-path (base "/MyBahri/").
 * Use for anything in /public: asset('assets/ceo.png').
 */
export function asset(path: string): string {
  return import.meta.env.BASE_URL + path.replace(/^\/+/, '')
}
