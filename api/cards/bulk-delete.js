import handler, { config } from '../[...route].js';

export { config };

export default function bulkDeleteProxy(req, res) {
  return handler(req, res);
}
