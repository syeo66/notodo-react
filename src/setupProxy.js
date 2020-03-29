// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createProxyMiddleware } = require('http-proxy-middleware')

let cookie
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function relayRequestHeaders(proxyReq, req) {
  if (cookie) {
    proxyReq.setHeader('cookie', cookie)
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      headers: { host: process.env.REACT_APP_API_TARGET_HOST || 'tonotodo.com' },
      hostRewrite: 'localhost',
      onProxyReq: relayRequestHeaders,
      onProxyRes: relayResponseHeaders,
      secure: false,
      target: `${process.env.REACT_APP_API_TARGET_PROTOCOL || 'https'}://${process.env.REACT_APP_API_TARGET_HOST ||
        'tonotodo.com'}`,
    })
  )
}
