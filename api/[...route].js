import { app } from '../server/app.js';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req, res) {
  if (!req.url.startsWith('/api/')) {
    req.url = `/api${req.url}`;
  }
  app(req, res);
}
