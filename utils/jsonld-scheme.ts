// The JSON-LD page from public/demos/jsonld.html (and -fixed), split into the parts the slide's
// scheme highlights. Kept in a .ts file because the strings contain </script>, which would end a
// <script> block in a .vue file.

export interface SourcePart { text: string, kind?: 'stop' | 'payload' | 'noise' | 'ignored' | 'safe' }

/** The HTML the server sends, as in the demo pages. */
export function jsonLdBody(escaped: boolean) {
  const lt = escaped ? '\\u003c' : '<'
  return `<h1>Desk lamp</h1>\n<script type="application/ld+json">\n{"@type":"Product","name":"Desk lamp","description":"${lt}/script>${lt}img src=x onerror=steal()>"}\n</script>\n<p>$39</p>\n<p id="desc"></p>\n<script src="desc.js"></script>`
}

export function jsonLdSource(escaped: boolean): SourcePart[] {
  const body = jsonLdBody(escaped)
  const marks: [string, SourcePart['kind']][] = escaped
    ? [['\\u003c/script>\\u003cimg src=x onerror=steal()>', 'safe']]
    : [['</script>', 'stop'], ['<img src=x onerror=steal()>', 'payload'], ['"}', 'noise'], ['</script>', 'ignored']]
  const parts: SourcePart[] = []
  let rest = body
  for (const [needle, kind] of marks) {
    const i = rest.indexOf(needle)
    if (i < 0) continue
    parts.push({ text: rest.slice(0, i) }, { text: needle, kind })
    rest = rest.slice(i + needle.length)
  }
  parts.push({ text: rest })
  return parts
}

/** The description as the page shows it (desc.js reads it from the JSON-LD), or null when JSON.parse fails. */
export function jsonLdDescription(escaped: boolean) {
  return escaped ? '</script><img src=x onerror=steal()>' : null
}

/** The script's text as the browser parsed it (measured in Chrome on the demo pages). */
export function jsonLdScriptText(escaped: boolean) {
  return escaped
    ? '{"@type":"Product","name":"Desk lamp","description":"\\u003c/script>\\u003cimg src=x onerror=steal()>"}'
    : '{"@type":"Product","name":"Desk lamp","description":"'
}
