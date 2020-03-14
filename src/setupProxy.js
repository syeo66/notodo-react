// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createProxyMiddleware } = require('http-proxy-middleware')

let cookie
function relayRequestHeaders(proxyReq, req) {
  if (cookie) {
    proxyReq.setHeader('cookie', cookie)
  }
}

function relayResponseHeaders(proxyRes, req, res) {
  const proxyCookie = proxyRes.headers['set-cookie']
  if (proxyCookie) {
    cookie = proxyCookie
  }
}

module.exports = function(app) {
  app.use(
    '/graphql',
    createProxyMiddleware({
      autoRewrite: true,
      changeOrigin: true,
      cookieDomainRewrite: '',
      headers: { host: 'tonotodo.com' },
      hostRewrite: 'localhost',
      onProxyReq: relayRequestHeaders,
      onProxyRes: relayResponseHeaders,
      secure: false,
      target: 'https://tonotodo.com',
    })
  )
}
