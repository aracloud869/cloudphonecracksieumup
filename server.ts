import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

// API Proxy endpoint to strip X-Frame-Options, CSP framing restrictions & pass cross-origin headers
app.get('/api/proxy', async (req, res) => {
  const targetUrl = req.query.url as string;
  if (!targetUrl) {
    res.status(400).send('Missing url parameter');
    return;
  }

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9,vi;q=0.8',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Sec-Ch-Ua': '"Chromium";v="124", "Google Chrome";v="124"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"Windows"',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'cross-site',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1',
      },
      redirect: 'follow',
    });

    const finalUrl = new URL(response.url || targetUrl);
    const contentType = response.headers.get('content-type') || 'text/html';
    res.setHeader('Content-Type', contentType);

    // Strip framing restriction headers
    res.removeHeader('X-Frame-Options');
    res.removeHeader('Content-Security-Policy');
    res.removeHeader('Content-Security-Policy-Report-Only');
    res.removeHeader('Cross-Origin-Opener-Policy');
    res.removeHeader('Cross-Origin-Resource-Policy');
    res.removeHeader('Cross-Origin-Embedder-Policy');

    // Allow cross-origin framing
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');

    if (contentType.includes('text/html')) {
      let body = await response.text();
      // Remove JS frame-busting code
      body = body
        .replace(/top\.location/gi, 'self.location')
        .replace(/parent\.location/gi, 'self.location')
        .replace(/window\.top/gi, 'window.self')
        .replace(/top\s*!==\s*self/gi, 'false')
        .replace(/top\s*!=\s*self/gi, 'false');

      // Inject <base> tag so relative asset requests resolve to original domain
      const baseUrl = finalUrl.origin + finalUrl.pathname;
      const baseTag = `<head><base href="${baseUrl}" />`;
      if (body.includes('<head>')) {
        body = body.replace('<head>', baseTag);
      } else if (body.includes('<HEAD>')) {
        body = body.replace('<HEAD>', baseTag);
      } else {
        body = baseTag + body;
      }
      res.send(body);
    } else {
      const buffer = await response.arrayBuffer();
      res.send(Buffer.from(buffer));
    }
  } catch (err: any) {
    console.error('Proxy error:', err);
    res.status(500).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: sans-serif; background: #0f172a; color: #f8fafc; padding: 40px; text-align: center; }
          .card { background: #1e293b; border-radius: 16px; padding: 24px; max-width: 500px; margin: 0 auto; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
          .btn { background: #2563eb; color: #fff; border: none; padding: 12px 24px; border-radius: 12px; font-weight: bold; cursor: pointer; text-decoration: none; display: inline-block; margin-top: 16px; }
        </style>
      </head>
      <body>
        <div class="card">
          <h2>⚠️ Không Thể Tải Qua Proxy</h2>
          <p>Trang web này (${targetUrl}) bảo mật cao hoặc yêu cầu kết nối trực tiếp.</p>
          <a class="btn" href="${targetUrl}" target="_blank" rel="noreferrer">🎮 Mở Game Trong Màn Hình Riêng</a>
        </div>
      </body>
      </html>
    `);
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
