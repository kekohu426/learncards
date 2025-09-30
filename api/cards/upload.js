import handler, { config } from '../[...route].js';

export { config };

export default function uploadProxy(req, res) {
  return handler(req, res);
}
