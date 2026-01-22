const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
const PORT = 3000;

// 1. Serve the UI directly as a string
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Universe Proxy</title>
            <style>
                body { margin: 0; display: flex; flex-direction: column; height: 100vh; background: #1a1a2e; color: #fff; font-family: sans-serif; }
                .nav { padding: 10px; display: flex; gap: 10px; background: #16213e; box-shadow: 0 2px 10px rgba(0,0,0,0.3); }
                input { flex-grow: 1; padding: 10px; border-radius: 4px; border: none; outline: none; }
                button { padding: 8px 25px; background: #e94560; border: none; color: white; border-radius: 4px; cursor: pointer; font-weight: bold; }
                button:hover { background: #ff4d6d; }
                iframe { flex-grow: 1; border: none; background: white; }
            </style>
        </head>
        <body>
            <div class="nav">
                <input type="text" id="urlInput" placeholder="Enter URL (e.g., wikipedia.org)">
                <button onclick="loadSite()">Teleport</button>
            </div>
            <iframe id="viewport"></iframe>
            <script>
                function loadSite() {
                    const input = document.getElementById('urlInput').value;
                    if (!input) return;
                    const fullUrl = input.startsWith('http') ? input : 'https://' + input;
                    document.getElementById('viewport').src = \`/proxy?url=\${encodeURIComponent(fullUrl)}\`;
                }
                // Allow pressing "Enter" to search
                document.getElementById('urlInput').addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') loadSite();
                });
            </script>
        </body>
        </html>
    `);
});

// 2. Proxy Logic
app.use('/proxy', createProxyMiddleware({
    target: 'https://example.com', 
    changeOrigin: true,
    router: (req) => req.query.url, 
    pathRewrite: { '^/proxy': '' },
    onProxyRes: (proxyRes) => {
        // Strip security headers that block iframe embedding
        delete proxyRes.headers['content-security-policy'];
        delete proxyRes.headers['x-frame-options'];
    }
}));

app.listen(PORT, () => {
    console.log(`Universe Advanced Proxy running at http://localhost:${PORT}`);
});
