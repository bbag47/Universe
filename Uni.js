const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
const PORT = 3000;

// Middleware to serve static files from the 'public' folder
app.use(express.static('public'));

app.use('/proxy', createProxyMiddleware({
    target: 'https://example.com', // Default target, will be overridden
    changeOrigin: true,
    router: (req) => req.query.url, // Dynamically set target based on URL param
    pathRewrite: (path, req) => '', // Strip '/proxy' from the path
    onProxyRes: (proxyRes, req, res) => {
        // Rewrite headers to bypass security that blocks iframes
        delete proxyRes.headers['content-security-policy'];
        delete proxyRes.headers['x-frame-options'];
    }
}));

app.listen(PORT, () => {
    console.log(`Universe Advanced Proxy running at http://localhost:${PORT}`);
});
