import 'dotenv/config';
import { fetch } from 'undici';

const baseUrl = process.env.HEALTHCHECK_BASE_URL?.replace(/\/$/, '') || 'http://127.0.0.1:4000';
const adminToken = process.env.HEALTHCHECK_ADMIN_TOKEN || process.env.ADMIN_TOKEN;
const apiBase = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;

const checks = [];
let hasFailure = false;

async function run() {
  await checkJsonEndpoint('GET /categories', `${apiBase}/categories`, { expect: [200] });
  await checkJsonEndpoint('GET /cards', `${apiBase}/cards`, { expect: [200] });

  if (!adminToken) {
    record('POST /cards/bulk-delete', false, '缺少管理员令牌，跳过写接口检测');
  } else {
    await checkJsonEndpoint(
      'POST /cards/bulk-delete (空列表)',
      `${apiBase}/cards/bulk-delete`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': adminToken,
        },
        body: JSON.stringify({ ids: [] }),
        expect: [400],
      },
    );
  }

  if (hasFailure) {
    console.error('\n[health-check] 检测未通过');
    process.exitCode = 1;
  } else {
    console.log('\n[health-check] 所有检测通过');
  }
}

async function checkJsonEndpoint(name, url, options = {}) {
  const { expect = [200], ...init } = options;
  try {
    const response = await fetch(url, init);
    const payload = await parsePayload(response);
    if (!expect.includes(response.status)) {
      record(name, false, formatFailure(response, payload));
      return;
    }
    record(name, true, payload && Object.keys(payload).length ? '响应有效 JSON' : '无正文');
  } catch (error) {
    record(name, false, error.message);
  }
}

async function parsePayload(response) {
  try {
    return await response.clone().json();
  } catch (error) {
    try {
      const text = await response.clone().text();
      return text ? { _rawText: text } : null;
    } catch (innerError) {
      return null;
    }
  }
}

function formatFailure(response, payload) {
  const parts = [`HTTP ${response.status} ${response.statusText || ''}`.trim()];
  const serverMessage =
    payload?.message ||
    payload?.error?.message ||
    payload?.error ||
    payload?.msg;
  if (serverMessage) {
    parts.push(`server: ${serverMessage}`);
  }
  const details = payload?.details || payload?._rawText;
  if (details && details !== serverMessage) {
    parts.push(`details: ${details}`);
  }
  return parts.join(' | ');
}

function record(name, ok, message) {
  checks.push({ name, ok, message });
  const icon = ok ? '✅' : '❌';
  const suffix = message ? ` - ${message}` : '';
  console.log(`${icon} ${name}${suffix}`);
  if (!ok) {
    hasFailure = true;
  }
}

run().catch(error => {
  console.error('[health-check] 未捕获异常', error);
  process.exitCode = 1;
});
