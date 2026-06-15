// Resolve the API origin: VITE_API_URL for split deploys (e.g. the Render
// backend), otherwise the app base path for same-origin / monolithic deploys.
// Mirrors the generated API client's base-URL resolution.
export const API_BASE =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") ||
  import.meta.env.BASE_URL?.replace(/\/$/, "") ||
  ""

export function apiUrl(path: string): string {
  return `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`
}

// Build a browser-openable URL for a stored object path such as
// "/objects/uploads/<id>.pdf" by routing it through the API's signed-download
// endpoint.
export function objectViewUrl(fileUrl: string): string {
  return `${API_BASE}/api/storage/objects/${fileUrl.replace(/^\/objects\//, "")}`
}
