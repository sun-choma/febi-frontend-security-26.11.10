---
layout: section
routeAlias: incidents
style: "--accent: var(--orange)"
---

<div class="section-num">04</div>

# It actually happened

<div class="section-sub">Real incidents, mapped back to what we covered</div>


---
routeAlias: incidents-map
---

# Four incidents, four ways in

<div class="sub">Each one came through a way in this talk covered</div>

<div class="cols incidents">
<div class="card">
<div class="when">2024.06</div>
<div class="name">polyfill.io</div>
<div class="layer">A third-party script</div>
<div class="ref" style="--c: var(--cyan)"><lucide-corner-down-right /> Section 03: Code you didn't write</div>
</div>
<div class="card">
<div class="when">2025.09</div>
<div class="name">chalk &amp; debug</div>
<div class="layer">A dependency at run time</div>
<div class="ref" style="--c: var(--cyan)"><lucide-corner-down-right /> Section 03: Code you didn't write</div>
</div>
<div class="card">
<div class="when">2025.09</div>
<div class="name">Shai-Hulud</div>
<div class="layer">A dependency at install time</div>
<div class="ref" style="--c: var(--cyan)"><lucide-corner-down-right /> Section 03: Code you didn't write</div>
</div>
<div class="card lit">
<div class="when">2025.12</div>
<div class="name">React2Shell</div>
<div class="layer">The framework itself</div>
<div class="ref" style="--c: var(--green)"><lucide-corner-down-right /> Section 02: Dangerous code</div>
</div>
</div>

<div class="punch">None of them needed a bug in the victims' own code</div>

<div class="note">On the next slides, <span class="ng">⚠</span> marks the step where the damage happens</div>

<style>
.incidents { margin-top: 1.2rem; align-items: stretch; }
.incidents .card { display: flex; flex-direction: column; gap: 0.3rem; align-items: flex-start; }
.incidents .when { font-size: 0.75rem; color: var(--comment); }
.incidents .name { font-size: 1.15rem; font-weight: bold; color: var(--foreground); line-height: 1.3; }
.incidents .layer { font-size: 0.75rem; color: var(--comment); margin-bottom: 0.6rem; }
.incidents .ref { margin-top: auto; display: flex; gap: 0.3rem; font-size: 0.7rem; line-height: 1.4; color: var(--c); }
.incidents .ref svg { flex: 0 0 auto; margin-top: 0.1rem; }
</style>

---

# polyfill.io: the CDN changed owners <span class="badge" style="--c: var(--red)">2024</span>

<div class="sub">A free service that sent old browsers missing JavaScript features. 100K+ sites loaded it with one script tag</div>

<div class="cols story">
<div>

<div class="col-h">What happened</div>

1. In 2024.02, a company bought the polyfill.io domain
2. <span class="here">The new owner changed the script: every embedding site served it to its visitors</span>
3. It sent some mobile visitors to a betting site, and hid from admins and desktop testers
4. On 2024.06.25, Sansec reported it

</div>
<div class="card takeaway">

<div class="col-h">Takeaway</div>

Another domain's script runs whatever that domain serves today

- **Remove what you don't need**: modern browsers didn't need it
- **Self-host what you keep**: it changes only when you change it
- **Or pin it with an integrity hash**: the browser refuses a changed file

</div>
</div>

<div class="foot">Way in: a third-party script (section 03)</div>

<div class="source"><lucide-link /><a href="https://sansec.io/research/polyfill-supply-chain-attack" target="_blank">Sansec: polyfill supply chain attack</a></div>

---

# chalk &amp; debug: one phished maintainer <span class="badge" style="--c: var(--red)">2025</span>

<div class="sub">18 packages with more than 2 billion downloads per week, all published from one person's account</div>

<div class="cols story">
<div>

<div class="col-h">What happened</div>

1. A fake "npm support" email: the maintainer signed in on a lookalike site, and attackers got the account
2. On 2025.09.08, they published new versions of chalk, debug and 16 more packages
3. <span class="here">In visitors' browsers, the new code swapped crypto wallet addresses for the attacker's</span>
4. Security companies spotted it the same day

</div>
<div class="card takeaway">

<div class="col-h">Takeaway</div>

Your app ships whatever a maintainer's account publishes

- **Lockfile**: keeps the versions you had
- **Release-age delay**: skips brand-new versions

</div>
</div>

<div class="foot">Way in: a dependency at run time (section 03)</div>

<div class="source"><lucide-link /><a href="https://www.aikido.dev/blog/npm-debug-and-chalk-packages-compromised" target="_blank">Aikido: npm debug and chalk packages compromised</a></div>

---

# Shai-Hulud: a worm that spreads on install <span class="badge" style="--c: var(--red)">2025</span>

<div class="sub">The goal: developers' secrets (cloud, GitHub and npm credentials), and more packages to spread through</div>

<div class="cols story">
<div>

<div class="col-h">What happened</div>

1. Attackers stole some maintainers' npm tokens
2. They used them to publish infected versions of those maintainers' packages, each with an install script
3. <span class="here">npm install ran it on dev machines and CI: it collected npm, GitHub and cloud credentials</span>
4. It leaked them in a public "Shai-Hulud" repo on the victim's own GitHub, and made public copies of private repos
5. With the victim's npm token, it infected their packages too, so every victim spread it further: hundreds of packages

</div>
<div class="card takeaway">

<div class="col-h">Takeaway</div>

Installing a package runs its code, with your secrets in reach

- **Install scripts off**: the default in pnpm 10+
- **On npm**: `ignore-scripts=true` in .npmrc
- **Rotate credentials**: if an infected version ran

</div>
</div>

<div class="foot">Way in: a dependency at install time (section 03)</div>

<div class="source"><lucide-link /><a href="https://www.cisa.gov/news-events/alerts/2025/09/23/widespread-supply-chain-compromise-impacting-npm-ecosystem" target="_blank">CISA alert, 2025.09.23</a> · <a href="https://github.blog/security/supply-chain-security/our-plan-for-a-more-secure-npm-supply-chain/" target="_blank">GitHub: our plan for a more secure npm supply chain</a> · <a href="https://sysdig.com/blog/shai-hulud-the-novel-self-replicating-worm-infecting-hundreds-of-npm-packages" target="_blank">Sysdig: Shai-Hulud analysis</a></div>

---

# React2Shell: one POST runs code on your server <span class="badge" style="--c: var(--red)">2025</span>

<div class="sub">A Server Function (Next.js: Server Action) is a public POST endpoint, reachable with no login</div>

<div class="cols middle">
<div class="r2s-flow">
<div class="step"><b>POST</b> to any Server Function endpoint<small>crafted body, no login needed</small></div>
<lucide-arrow-down class="arrow" />
<div class="step">React <b>rebuilds the body</b> into objects<small>before it routes to your code</small></div>
<lucide-arrow-down class="arrow" />
<div class="step">one value is a <b>path</b> React walks<small>crafted to reach Function &rarr;</small></div>
<lucide-arrow-down class="arrow" />
<div class="step here"><b>Function("...") runs</b> on the server<small>before any Server Function or auth check</small></div>
</div>
<div>

```js
// A body value can reference another part:
//   "$1:user:name" = part 1, then .user .name
// [key] reads INHERITED props too, so the path
//   "$1:constructor:constructor" walks to:
part.constructor   // its type (Object)
  .constructor     // Function
Function('/* any code */')()   // eval, basically
```

</div>
</div>

<div class="punch">No <code>eval</code> in the code: just a path walked one property too far. Fundamentals, not acronyms, are what reveal a hole like this</div>

<div class="note"><b>The fix</b>: a path may follow only the object's own properties</div>

<div class="source"><lucide-link /><a href="https://github.com/facebook/react/pull/35277" target="_blank">React: the fix (#35277)</a> · <a href="https://www.trendaisecurity.com/en-us/resources-insights/trendai-security-blog/CVE-2025-55182-analysis-poc-itw" target="_blank">Trend Micro: React2Shell analysis</a></div>

<style>
.r2s-flow { display: flex; flex-direction: column; gap: 0.2rem; }
.r2s-flow .step { border: 1px solid var(--border); border-radius: 0.4rem; padding: 0.35rem 0.6rem; background: var(--panel); font-size: 0.82rem; line-height: 1.35; }
.r2s-flow .step small { display: block; color: var(--comment); font-size: 0.7rem; }
.r2s-flow .step.here { border-color: var(--red); }
.r2s-flow .arrow { align-self: center; color: var(--comment); }
</style>

---

# React2Shell: the hole was in React itself <span class="badge" style="--c: var(--red)">2025</span>

<div class="sub">CVE-2025-55182, severity 10.0 of 10: the highest score a vulnerability can get</div>

<div class="cols">
<div class="card">
<div class="col-h">Why 10.0 of 10</div>

- **Unauthenticated**: no login, no account
- **Remote code execution**: the attacker's code runs in your server process
- **Any React Server Components app**: even with no Server Function of your own
- **No mistake in your code**: the bug was React's

</div>
<div class="card" style="--accent: var(--red)">
<div class="col-h">Why every framework was hit</div>

- **React-level, not Next-level**: the bug was in React's own RSC serializer (`react-server-dom-*`)
- **One shared core**: every framework built on it was exposed at once
- **Next.js, React Router, Waku, Parcel, Vite's RSC plugin**

</div>
</div>

<div class="card takeaway" style="--accent: var(--red); margin-top: 1.4rem">
<div class="col-h">Takeaway</div>

- **The framework is a dependency too**: patch the moment an advisory lands, React2Shell was exploited within hours of disclosure
- **In Next.js**: update `next`, not `react`

</div>

<div class="source"><lucide-link /><a href="https://react.dev/blog/2025/12/03/critical-security-vulnerability-in-react-server-components" target="_blank">react.dev: critical security vulnerability in RSC</a> · <a href="https://aws.amazon.com/blogs/security/china-nexus-cyber-threat-groups-rapidly-exploit-react2shell-vulnerability-cve-2025-55182/" target="_blank">AWS: rapid exploitation of React2Shell</a></div>

<style>
.cols { align-items: stretch; }
</style>
