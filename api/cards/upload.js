import handler, { config as baseConfig } from '../[...route].js';

export const config = {
  api: {
    ...(baseConfig?.api || {}),
    sizeLimit: '25mb',
    bodyParser: false,
  },
};

export default function uploadProxy(req, res) {
  return handler(req, res);
}
