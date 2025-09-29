import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { randomBytes, createHmac, pbkdf2Sync, randomUUID, timingSafeEqual } from 'crypto';
import 'dotenv/config';
import { supabase } from './supabaseClient.js';

// Minimal Supabase-backed API that powers the user site and admin console.

const app = express();

app.use(cors());
app.use(express.json());

const adminToken = process.env.ADMIN_TOKEN;
const bucketName = process.env.SUPABASE_BUCKET;
const authSecret = process.env.AUTH_SECRET;
// Whitelist of image MIME types accepted by the upload endpoint.
const allowedImageTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

if (!bucketName) {
  throw new Error('Missing SUPABASE_BUCKET environment variable');
}

if (!adminToken) {
  console.warn('[server] ADMIN_TOKEN is not configured,管理端写操作将被拒绝。');
}

if (!authSecret) {
  console.warn('[server] AUTH_SECRET 未设置，将使用不安全的默认值，仅适用于测试环境。');
}

// Attach a short request id so API logs stay traceable.
app.use((req, res, next) => {
  req.requestId = randomBytes(3).toString('hex');
  console.info(`[api] ${req.requestId} ${req.method} ${req.url}`);
  next();
});

// Small helper so async handlers bubble errors to the shared middleware.
function asyncHandler(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

function base64UrlEncode(buffer) {
  return Buffer.from(buffer)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64UrlDecode(str) {
  const pad = str.length % 4 === 0 ? 0 : 4 - (str.length % 4);
  const normalized = str.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat(pad);
  return Buffer.from(normalized, 'base64');
}

function signToken(payload) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const issuedAt = Math.floor(Date.now() / 1000);
  const exp = issuedAt + TOKEN_TTL_SECONDS;
  const fullPayload = { ...payload, iat: issuedAt, exp };

  const headerEncoded = base64UrlEncode(JSON.stringify(header));
  const payloadEncoded = base64UrlEncode(JSON.stringify(fullPayload));
  const signature = createHmac('sha256', authSecret || 'dev-secret')
    .update(`${headerEncoded}.${payloadEncoded}`)
    .digest();
  const signatureEncoded = base64UrlEncode(signature);

  return `${headerEncoded}.${payloadEncoded}.${signatureEncoded}`;
}

function verifyToken(token) {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [header, payload, signature] = parts;
  const expectedSignature = createHmac('sha256', authSecret || 'dev-secret')
    .update(`${header}.${payload}`)
    .digest();
  const actualSignature = base64UrlDecode(signature);
  if (expectedSignature.length !== actualSignature.length || !timingSafeEqual(expectedSignature, actualSignature)) {
    return null;
  }

  const payloadJson = JSON.parse(base64UrlDecode(payload).toString('utf8'));
  if (!payloadJson?.exp || payloadJson.exp < Math.floor(Date.now() / 1000)) {
    return null;
  }
  return payloadJson;
}

function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const derived = pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return `${salt}:${derived}`;
}

function verifyPassword(password, hash) {
  if (!hash || !hash.includes(':')) return false;
  const [salt, expected] = hash.split(':');
  const derived = pbkdf2Sync(password, salt, 100000, 64, 'sha512');
  const expectedBuffer = Buffer.from(expected, 'hex');
  if (derived.length !== expectedBuffer.length) return false;
  return timingSafeEqual(derived, expectedBuffer);
}

async function authenticateUser(req) {
  const authorization = req.header('authorization');
  if (!authorization) return null;
  const [scheme, token] = authorization.split(' ');
  if (!token || scheme.toLowerCase() !== 'bearer') return null;
  const payload = verifyToken(token);
  if (!payload?.sub) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('id, phone, child_age, invite_code, created_at, updated_at')
    .eq('id', payload.sub)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data;
}

async function requireUser(req, res, next) {
  try {
    const profile = await authenticateUser(req);
    if (!profile) {
      return res.status(401).json({ message: '未授权：请先登录' });
    }
    req.user = profile;
    next();
  } catch (error) {
    console.error('[auth] 验证登录状态失败', error);
    res.status(500).json({ message: '验证登录状态失败' });
  }
}

function createSafeFileName(originalName) {
  const extensionMatch = originalName.match(/\.([a-zA-Z0-9]+)$/);
  const extension = extensionMatch ? `.${extensionMatch[1].toLowerCase()}` : '';
  const baseName = originalName.replace(/\.[^/.]+$/, '');
  const ascii = baseName
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\x00-\x7F]+/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/(^-|-$)/g, '')
    .toLowerCase();

  const randomSuffix = randomBytes(4).toString('hex');
  const safeBase = ascii || 'flashcard';
  return `${safeBase}-${Date.now()}-${randomSuffix}${extension}`;
}

function createCategoryPrefix(categoryName, categoryId) {
  const trimmed = categoryName.trim().toLowerCase();
  const ascii = trimmed
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\x00-\x7F]+/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/(^-|-$)/g, '');

  if (ascii) {
    return ascii;
  }

  if (categoryId) {
    return `category-${categoryId}`;
  }

  return `category-${randomBytes(3).toString('hex')}`;
}

async function ensureCategoryId(categoryName) {
  const trimmed = categoryName.trim();
  if (!trimmed) {
    throw new Error('分类名称不能为空');
  }

  const { data, error } = await supabase
    .from('categories')
    .select('id')
    .eq('name', trimmed)
    .limit(1)
    .single();

  if (data?.id) {
    return data.id;
  }

  const { data: created, error: insertError } = await supabase
    .from('categories')
    .insert({ name: trimmed })
    .select('id')
    .single();

  if (insertError || !created?.id) {
    throw new Error(insertError?.message || '创建分类失败');
  }

  return created.id;
}

async function getInviteOrThrow(code, phone) {
  const normalized = String(code || '').trim().toUpperCase();
  if (!normalized) {
    throw new Error('邀请码不能为空');
  }

  const { data, error } = await supabase
    .from('invites')
    .select('*')
    .eq('code', normalized)
    .single();

  if (error || !data) {
    throw new Error('邀请码不存在');
  }

  const now = Date.now();
  if (data.status !== 'active') {
    throw new Error('邀请码已失效');
  }
  if (data.expires_at && new Date(data.expires_at).getTime() < now) {
    throw new Error('邀请码已过期');
  }
  if (data.max_uses != null && data.used_count >= data.max_uses) {
    if (data.used_by_phone && phone && data.used_by_phone === phone) {
      return data;
    }
    throw new Error('邀请码已被使用');
  }

  return data;
}

async function markInviteUsage(invite, phone) {
  const payload = {
    used_count: (invite.used_count || 0) + 1,
    used_by_phone: phone,
  };

  if (invite.max_uses == null || payload.used_count >= invite.max_uses) {
    payload.status = 'used';
  }

  const { error } = await supabase
    .from('invites')
    .update(payload)
    .eq('code', invite.code);

  if (error) {
    throw new Error(`无法更新邀请码状态：${error.message}`);
  }
}

async function getProfileByPhone(phone) {
  const trimmed = String(phone || '').trim();
  if (!trimmed) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('id, phone, password_hash, child_age, invite_code, created_at, updated_at')
    .eq('phone', trimmed)
    .maybeSingle();
  if (error) {
    console.error('[profile] 查询手机号失败', error);
    throw new Error('查询手机号失败');
  }
  return data || null;
}

function requireAdmin(req, res, next) {
  if (!adminToken) {
    return res.status(500).json({ message: '服务器尚未配置管理员令牌' });
  }

  const token = req.header('x-admin-token');
  if (!token || token !== adminToken) {
    return res.status(401).json({ message: '未授权：缺少或令牌错误' });
  }

  next();
}

function generateInviteCode(length = 8) {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let index = 0; index < length; index += 1) {
    code += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  }
  return code;
}

app.post('/api/auth/register', asyncHandler(async (req, res) => {
  const { phone, password, childAge, inviteCode } = req.body || {};
  const normalizedPhone = String(phone || '').replace(/\D/g, '');
  if (!normalizedPhone) {
    return res.status(400).json({ message: '手机号不能为空' });
  }

  if (!password || String(password).length < 6) {
    return res.status(400).json({ message: '密码至少需要 6 位' });
  }

  const ageValue = childAge == null ? null : Number.parseInt(childAge, 10);
  const normalizedAge = Number.isNaN(ageValue) ? null : ageValue;

  const existing = await getProfileByPhone(normalizedPhone);
  if (existing) {
    return res.status(409).json({ message: '该手机号已注册，请直接登录' });
  }

  const invite = await getInviteOrThrow(inviteCode, normalizedPhone);
  const passwordHash = hashPassword(String(password));
  const profileId = randomUUID();

  const insertPayload = {
    id: profileId,
    phone: normalizedPhone,
    password_hash: passwordHash,
    child_age: normalizedAge,
    invite_code: invite.code,
  };

  const { data, error } = await supabase
    .from('profiles')
    .insert(insertPayload)
    .select('id, phone, child_age, invite_code, created_at, updated_at')
    .single();

  if (error) {
    return res.status(500).json({ message: '创建账号失败', details: error.message });
  }

  await markInviteUsage(invite, normalizedPhone);

  const token = signToken({ sub: data.id, phone: data.phone });
  res.status(201).json({ token, profile: data });
}));

app.post('/api/auth/login', asyncHandler(async (req, res) => {
  const { phone, password } = req.body || {};
  const normalizedPhone = String(phone || '').replace(/\D/g, '');
  if (!normalizedPhone || !password) {
    return res.status(400).json({ message: '请填写手机号和密码' });
  }

  const profile = await getProfileByPhone(normalizedPhone);
  if (!profile) {
    return res.status(404).json({ message: '账号不存在，请先注册' });
  }

  const isValid = verifyPassword(String(password), profile.password_hash);
  if (!isValid) {
    return res.status(401).json({ message: '密码错误' });
  }

  const token = signToken({ sub: profile.id, phone: profile.phone });
  const { password_hash: _ignored, ...safeProfile } = profile;
  res.json({ token, profile: safeProfile });
}));

app.post('/api/invites/validate', asyncHandler(async (req, res) => {
  const { code, phone } = req.body || {};
  try {
    const invite = await getInviteOrThrow(code, phone);
    res.json({
      valid: true,
      invite: {
        code: invite.code,
        expiresAt: invite.expires_at,
        maxUses: invite.max_uses,
        usedCount: invite.used_count,
        status: invite.status,
      },
    });
  } catch (error) {
    res.status(400).json({ valid: false, message: error.message || '邀请码无效' });
  }
}));

app.get('/api/invites', requireAdmin, asyncHandler(async (req, res) => {
  const { data, error } = await supabase
    .from('invites')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return res.status(500).json({ message: '加载邀请码失败', details: error.message });
  }

  res.json({ invites: data || [] });
}));

app.post('/api/invites', requireAdmin, asyncHandler(async (req, res) => {
  const { count = 1, prefix = '', expiresAt, maxUses = 1, notes } = req.body || {};
  const total = Math.max(1, Math.min(Number(count) || 1, 50));

  const records = Array.from({ length: total }).map(() => ({
    code: `${String(prefix || '').toUpperCase()}${generateInviteCode(8)}`.slice(0, 16),
    expires_at: expiresAt ? new Date(expiresAt).toISOString() : null,
    max_uses: Math.max(1, Number(maxUses) || 1),
    notes: notes || null,
    created_by: 'admin-token',
  }));

  const { data, error } = await supabase
    .from('invites')
    .insert(records)
    .select('*');

  if (error) {
    return res.status(500).json({ message: '创建邀请码失败', details: error.message });
  }

  res.status(201).json({ invites: data });
}));

app.patch('/api/invites/:code', requireAdmin, asyncHandler(async (req, res) => {
  const code = req.params.code;
  const { status, expiresAt, notes } = req.body || {};

  const payload = {};
  if (status) payload.status = status;
  if (expiresAt !== undefined) payload.expires_at = expiresAt ? new Date(expiresAt).toISOString() : null;
  if (notes !== undefined) payload.notes = notes;

  if (!Object.keys(payload).length) {
    return res.status(400).json({ message: '没有需要更新的字段' });
  }

  const { data, error } = await supabase
    .from('invites')
    .update(payload)
    .eq('code', code)
    .select('*')
    .single();

  if (error) {
    return res.status(500).json({ message: '更新邀请码失败', details: error.message });
  }

  res.json({ invite: data });
}));

app.get('/api/profile', requireUser, asyncHandler(async (req, res) => {
  res.json({ profile: req.user });
}));

app.put('/api/profile', requireUser, asyncHandler(async (req, res) => {
  const { childAge, password } = req.body || {};
  const updates = {};
  if (childAge !== undefined) {
    const parsed = Number.parseInt(childAge, 10);
    updates.child_age = Number.isNaN(parsed) ? null : parsed;
  }
  if (password) {
    if (String(password).length < 6) {
      return res.status(400).json({ message: '新密码至少需要 6 位' });
    }
    updates.password_hash = hashPassword(String(password));
  }

  if (!Object.keys(updates).length) {
    return res.status(400).json({ message: '没有需要更新的字段' });
  }

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', req.user.id)
    .select('id, phone, child_age, invite_code, created_at, updated_at')
    .single();

  if (error) {
    return res.status(500).json({ message: '更新个人资料失败', details: error.message });
  }

  res.json({ profile: data });
}));

app.get('/api/health', asyncHandler(async (req, res) => {
  const { data, error } = await supabase.from('categories').select('id').limit(1);
  if (error) {
    console.error(`[api] ${req.requestId} /api/health`, error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
  res.json({ status: 'ok', categoriesSeeded: data?.length ?? 0 });
}));

app.get('/api/categories', asyncHandler(async (req, res) => {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, created_at')
    .order('name', { ascending: true });

  if (error) {
    console.error(`[api] ${req.requestId} 加载分类失败`, error);
    return res.status(500).json({ message: '加载分类失败', details: error.message });
  }

  const categories = (data || []).map(item => ({
    id: item.id,
    name: item.name,
    createdAt: item.created_at,
  }));

  res.json({ categories });
}));

app.post('/api/categories', requireAdmin, asyncHandler(async (req, res) => {
  const { name } = req.body || {};
  if (!name || !String(name).trim()) {
    return res.status(400).json({ message: '分类名称不能为空' });
  }

  const trimmed = String(name).trim();

  const { data, error } = await supabase
    .from('categories')
    .insert({ name: trimmed })
    .select('id, name, created_at')
    .single();

  if (error) {
    console.error(`[api] ${req.requestId} 创建分类失败`, error);
    return res.status(500).json({ message: '创建分类失败', details: error.message });
  }

  console.info(`[api] ${req.requestId} category created id=${data.id}`);
  res.status(201).json({ category: {
    id: data.id,
    name: data.name,
    createdAt: data.created_at,
  } });
}));

app.patch('/api/categories/:id', requireAdmin, asyncHandler(async (req, res) => {
  const categoryId = Number.parseInt(req.params.id, 10);
  if (Number.isNaN(categoryId)) {
    return res.status(400).json({ message: '无效的分类 ID' });
  }

  const { name } = req.body || {};
  if (!name || !String(name).trim()) {
    return res.status(400).json({ message: '分类名称不能为空' });
  }

  const trimmed = String(name).trim();

  const { data, error } = await supabase
    .from('categories')
    .update({ name: trimmed })
    .eq('id', categoryId)
    .select('id, name, created_at')
    .single();

  if (error) {
    console.error(`[api] ${req.requestId} 更新分类失败`, error);
    return res.status(500).json({ message: '更新分类失败', details: error.message });
  }

  console.info(`[api] ${req.requestId} category updated id=${data.id}`);
  res.json({ category: {
    id: data.id,
    name: data.name,
    createdAt: data.created_at,
  } });
}));

app.delete('/api/categories/:id', requireAdmin, asyncHandler(async (req, res) => {
  const categoryId = Number.parseInt(req.params.id, 10);
  if (Number.isNaN(categoryId)) {
    return res.status(400).json({ message: '无效的分类 ID' });
  }

  const { reassignCategoryId, deleteCards } = req.body || {};

  if (deleteCards) {
    const { error: deleteError } = await supabase
      .from('cards')
      .delete()
      .eq('category_id', categoryId);

    if (deleteError) {
      console.error(`[api] ${req.requestId} 删除分类学习卡片失败`, deleteError);
      return res.status(500).json({ message: '删除分类学习卡片失败', details: deleteError.message });
    }
  } else if (reassignCategoryId) {
    const reassignedId = Number.parseInt(reassignCategoryId, 10);
    if (Number.isNaN(reassignedId)) {
      return res.status(400).json({ message: '无效的目标分类 ID' });
    }

    const { error: updateError } = await supabase
      .from('cards')
      .update({ category_id: reassignedId })
      .eq('category_id', categoryId);

    if (updateError) {
      console.error(`[api] ${req.requestId} 迁移分类学习卡片失败`, updateError);
      return res.status(500).json({ message: '迁移分类学习卡片失败', details: updateError.message });
    }
  } else {
    const { error: clearError } = await supabase
      .from('cards')
      .update({ category_id: null })
      .eq('category_id', categoryId);

    if (clearError) {
      console.error(`[api] ${req.requestId} 清空分类学习卡片失败`, clearError);
      return res.status(500).json({ message: '清空分类学习卡片失败', details: clearError.message });
    }
  }

  const { error } = await supabase.from('categories').delete().eq('id', categoryId);
  if (error) {
    console.error(`[api] ${req.requestId} 删除分类失败`, error);
    return res.status(500).json({ message: '删除分类失败', details: error.message });
  }

  console.info(`[api] ${req.requestId} category deleted id=${categoryId}`);
  res.json({ success: true });
}));

app.get('/api/cards', asyncHandler(async (req, res) => {
  const { category } = req.query;

  const { data, error } = await supabase
    .from('cards')
    .select('id, title, prompt, image_url, preview_url, original_url, audio_text, created_at, category_id, categories(name)')
    .order('id', { ascending: true });

  if (error) {
    console.error(`[api] ${req.requestId} 加载学习卡片失败`, error);
    return res.status(500).json({ message: '加载学习卡片失败', details: error.message });
  }

  const cards = (data || [])
    .map(item => ({
      id: item.id,
      title: item.title,
      prompt: item.prompt,
      imageUrl: item.image_url,
      previewImageUrl: item.preview_url,
      originalImageUrl: item.original_url,
      audioText: item.audio_text,
      category: item.categories?.name ?? null,
      categoryId: item.category_id ?? null,
      createdAt: item.created_at,
    }))
    .filter(item => {
      if (!category) return true;
      return item.category === category;
    });

  res.json({ cards });
}));

app.delete('/api/cards/:id', requireAdmin, asyncHandler(async (req, res) => {
  const cardId = Number.parseInt(req.params.id, 10);
  if (Number.isNaN(cardId)) {
    return res.status(400).json({ message: '无效的学习卡片 ID' });
  }

  const { error } = await supabase.from('cards').delete().eq('id', cardId);
  if (error) {
    console.error(`[api] ${req.requestId} 删除学习卡片失败`, error);
    return res.status(500).json({ message: '删除学习卡片失败', details: error.message });
  }

  console.info(`[api] ${req.requestId} card deleted id=${cardId}`);
  res.json({ success: true });
}));

app.patch('/api/cards/:id', requireAdmin, asyncHandler(async (req, res) => {
  const cardId = Number.parseInt(req.params.id, 10);
  if (Number.isNaN(cardId)) {
    return res.status(400).json({ message: '无效的学习卡片 ID' });
  }

  const { title, prompt, audioText, categoryId, imageUrl, previewImageUrl, originalImageUrl } = req.body || {};

  const payload = {};
  if (title != null) payload.title = String(title).trim();
  if (prompt != null) payload.prompt = String(prompt).trim();
  if (audioText !== undefined) payload.audio_text = audioText == null ? null : String(audioText).trim();
  if (categoryId !== undefined) {
    if (categoryId === null) {
      payload.category_id = null;
    } else {
      const parsed = Number.parseInt(categoryId, 10);
      if (Number.isNaN(parsed)) {
        return res.status(400).json({ message: '无效的分类 ID' });
      }
      payload.category_id = parsed;
    }
  }
  if (imageUrl !== undefined) payload.image_url = String(imageUrl).trim();
  if (previewImageUrl !== undefined) payload.preview_url = String(previewImageUrl).trim();
  if (originalImageUrl !== undefined) payload.original_url = String(originalImageUrl).trim();

  if (!Object.keys(payload).length) {
    return res.status(400).json({ message: '没有需要更新的字段' });
  }

  const { data, error } = await supabase
    .from('cards')
    .update(payload)
    .eq('id', cardId)
    .select('id, title, prompt, image_url, preview_url, original_url, audio_text, category_id, categories(name), created_at')
    .single();

  if (error) {
    console.error(`[api] ${req.requestId} 更新学习卡片失败`, error);
    return res.status(500).json({ message: '更新学习卡片失败', details: error.message });
  }

  res.json({
    card: {
      id: data.id,
      title: data.title,
      prompt: data.prompt,
      imageUrl: data.image_url,
      previewImageUrl: data.preview_url,
      originalImageUrl: data.original_url,
      audioText: data.audio_text,
      category: data.categories?.name ?? null,
      categoryId: data.category_id,
      createdAt: data.created_at,
    },
  });
}));

app.post('/api/cards/upload', requireAdmin, upload.array('files', 30), asyncHandler(async (req, res) => {
    const { category, metadata } = req.body;
    if (!category) {
      return res.status(400).json({ message: '分类不能为空' });
    }

    const files = req.files || [];
    if (!files.length) {
      return res.status(400).json({ message: '请提供至少一张图片' });
    }

    console.info(`[api] ${req.requestId} upload started category=${category} files=${files.length}`);

    let parsedMetadata = [];
    if (metadata) {
      try {
        const value = JSON.parse(metadata);
        if (Array.isArray(value)) {
          parsedMetadata = value;
        }
      } catch (error) {
        return res.status(400).json({ message: 'metadata 字段必须是合法的 JSON 数组' });
      }
    }

    if (parsedMetadata.length && parsedMetadata.length !== files.length) {
      return res.status(400).json({ message: 'metadata 数量与上传文件数量不一致' });
    }

    const categoryId = await ensureCategoryId(category);
    const categoryPrefix = createCategoryPrefix(category, categoryId);

    const uploadResults = [];

    for (let index = 0; index < files.length; index += 1) {
      const file = files[index];
      const meta = parsedMetadata[index] || {};

      if (!allowedImageTypes.has(file.mimetype)) {
        console.warn(`[api] ${req.requestId} 拒绝上传的文件类型`, file.mimetype);
        return res.status(415).json({ message: `不支持的文件类型：${file.originalname}` });
      }

      const fileName = createSafeFileName(file.originalname || `flashcard-${index}.jpg`);
      const storagePath = `${categoryPrefix}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(storagePath, file.buffer, {
          contentType: file.mimetype || 'image/jpeg',
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        console.error(`[api] ${req.requestId} 上传文件失败`, uploadError);
        return res.status(500).json({ message: `上传文件失败：${file.originalname}`, details: uploadError.message });
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from(bucketName).getPublicUrl(storagePath);

      uploadResults.push({
        storagePath,
        publicUrl,
        title: meta.title || file.originalname,
        prompt: meta.prompt || null,
        audioText: meta.audioText || null,
      });
    }

    const rowsToInsert = uploadResults.map(item => ({
      title: item.title,
      prompt: item.prompt,
      image_url: item.publicUrl,
      preview_url: item.publicUrl,
      original_url: item.publicUrl,
      audio_text: item.audioText,
      category_id: categoryId,
    }));

    const { data: inserted, error: insertError } = await supabase
      .from('cards')
      .insert(rowsToInsert)
      .select('id, title, prompt, image_url, preview_url, original_url, audio_text, category_id, categories(name)');

    if (insertError) {
      return res.status(500).json({ message: '写入数据库失败', details: insertError.message });
    }

    const cards = (inserted || []).map(item => ({
      id: item.id,
      title: item.title,
      prompt: item.prompt,
      imageUrl: item.image_url,
      previewImageUrl: item.preview_url,
      originalImageUrl: item.original_url,
      audioText: item.audio_text,
      category: item.categories?.name || category,
    }));

    console.info(`[api] ${req.requestId} upload finished category=${category} inserted=${cards.length}`);
    res.json({ success: true, cards });
}));

// 统一错误兜底
app.use((error, req, res, next) => {
  const status = error?.status || 500;
  const message = error?.message || '服务器内部错误';
  console.error(`[api] ${(req && req.requestId) || 'n/a'} 未捕获异常`, error);
  res.status(status).json({ message });
});

export { app };
