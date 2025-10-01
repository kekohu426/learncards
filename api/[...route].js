import { app } from '../server/app.js';

const defaultConfig = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

export const config = defaultConfig;

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
