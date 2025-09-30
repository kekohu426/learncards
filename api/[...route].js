import { app } from '../server/app.js';

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

export default function handler(req, res) {
  const originalUrl = req.url;
  res.once('finish', () => {
    console.info('[vercel-api]', req.method, originalUrl, '=>', req.url, res.statusCode);
  });

  if (!req.url.startsWith('/api/')) {
    req.url = `/api${req.url}`;
  }

  return app(req, res);
}
