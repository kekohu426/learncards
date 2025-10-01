import handler, { config as baseConfig } from '../[...route].js';

export const config = {
  api: {
    ...(baseConfig?.api || {}),
  },
};

export default function uploadUrlProxy(req, res) {
  return handler(req, res);
}
