export function buildQueryString(params: any): string {
  return Object.keys(params)
    .map(key => params[key] && `${key}=${params[key]}`)
    .join('&')
}
