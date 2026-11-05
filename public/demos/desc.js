// The product card shows the description from the page's JSON-LD, as text.
const ld = document.querySelector('script[type="application/ld+json"]')
try {
  document.getElementById('desc').textContent = JSON.parse(ld.textContent).description
}
catch {
  // The JSON-LD was cut off: there is no description to show
}
