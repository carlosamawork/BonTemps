// XSS-safe JSON-LD encoder. JSON.stringify can produce a `</script>`
// sequence inside a string that prematurely closes the host script tag in
// the parser. Replacing `<` with its escaped form prevents that.
export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}
