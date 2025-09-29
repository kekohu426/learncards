import { createServer } from 'http';
import { app } from '../server/app.js';

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

export default function handler(req, res) {
  const server = createServer(app);
  server.emit('request', req, res);
}
