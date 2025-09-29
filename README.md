# nano banana 提示词全集

项目编号: 7545806683047706916

项目现已升级为“前后端分离 + Supabase”架构，包含以下两部分：

- **用户端**（`index.html` + `scripts/main.js` + `styles.css`）读取后端 API，提供学习卡片浏览、分类筛选、复制/下载等体验。
- **管理端**（`admin.html` + `scripts/admin.js`）用于批量上传图片、编辑/删除学习卡片、维护分类。所有操作会立即写入 Supabase 数据库与存储桶。

## 快速开始

1. **准备 Supabase**
   - 在 Storage 中创建与 `.env` 相同名称的 bucket（默认 `flashcards`），建议设为 Public。
   - 在 Database 中创建 `categories`、`cards` 表（结构见 `server/scripts/import-data.js`）。
2. **配置后端**
   ```bash
   cd server
   npm install
   cp .env.example .env  # 若无示例可参考 README 中的变量说明
   ```
   `.env` 需提供以下变量：
   - `SUPABASE_URL`、`SUPABASE_SERVICE_ROLE_KEY`、`SUPABASE_ANON_KEY`
   - `SUPABASE_BUCKET`：存储桶名称，例如 `flashcards`
   - `ADMIN_TOKEN`：管理端使用的私密令牌，用于调用写操作接口
3. **启动后端 API**
   ```bash
   cd server
   node index.js
   ```
   默认监听 `http://localhost:4000`，提供 `/api/categories`、`/api/cards`、`/api/cards/upload` 等接口。
4. **预览前端**
   使用任意静态服务器（例如 `python3 -m http.server 5500`）在项目根目录启动，然后访问：
   - `http://127.0.0.1:5500/index.html`：用户端
   - `http://127.0.0.1:5500/admin.html`：管理端（首次使用需在右侧面板填入 `ADMIN_TOKEN`）

## 目录结构

- `home.html`：宣传主页（展示功能亮点，默认隐藏登录入口）
- `index.html`：用户端页面
- `admin.html`：管理端页面
- `styles.css`：共享样式
- `scripts/main.js`：用户端逻辑（加载 API、播放音频、筛选等）
- `scripts/admin.js`：管理端逻辑（Supabase 上传、分类/学习卡片 CRUD 等）
- `scripts/data.js`：保留为静态备份及离线 fallback 数据
- `server/`：后端 Express 服务与 Supabase 客户端

## 常用操作

- **上传图片**：在管理端选择分类与图片，点击“上传图片”。文件会上传至 Supabase Storage，并写入 `cards` 表。如果输入的分类不存在，会自动在数据库创建。
- **编辑/删除学习卡片**：管理端卡片支持“编辑”“复制数据”“删除”。编辑可同时更新标题、提示文案、播报文本与分类（需选择已有分类）。
- **分类管理**：右侧“数据工具与分类管理”支持新增、重命名、删除分类。删除时学习卡片会移动到“未分类”（`category_id` 置空）。
- **批量操作**：在卡片列表中勾选多张学习卡片，可一键取消选择或批量删除（需管理员令牌）。
- **备份导出**：如需备份，请在项目根目录运行 `npm run export-data` 生成最新数据文件。
- **邀请码管理**：后台可批量生成、失效邀请码，每个邀请码默认仅允许一个手机号使用，可设置到期时间与备注。

## 数据工具脚本

- `node server/scripts/import-data.js`：读取本地 `scripts/data.js` 并覆盖 Supabase 中的 `categories`、`cards` 数据。
- `node server/scripts/export-data.js [输出文件]`：将数据库中的最新数据导出为 `window.APP_DATA` 格式，默认写入 `scripts/data.js`。
- 运行脚本前请确认 `.env` 中 Supabase 的 URL 与密钥已配置，且本地网络可以访问 Supabase。
- `supabase/schema.sql`：包含 `profiles`、`invites` 表结构，可直接在 Supabase SQL 编辑器执行一次建表脚本（注意：首次创建后需手动为 `profiles` 表添加 `password_hash` 字段、移除旧的 `auth.users` 外键，可通过 `ALTER TABLE` 完成）。

## 家长登录体系

- 使用 **手机号 + 密码 + 邀请码** 完成注册；注册成功后即可用手机号+密码登录。
- 前端会在本地保存登录令牌；后台接口通过 `Authorization: Bearer <token>` 校验。
- `profiles` 表记录手机号、密码哈希、孩子年龄以及所用邀请码；每个邀请码默认一次性。
- 需在后端 `.env` 中设置 `AUTH_SECRET` 用于签发登录令牌；`SUPABASE_SERVICE_ROLE_KEY` 仍用于读写数据（学习卡片、邀请码等）。

## 部署建议

1. **后端**：可部署到任意 Node.js 环境（如 Render、Railway、Vercel Function）。部署时确保 `.env` 与 Supabase 项目一致，且 `ADMIN_TOKEN` 妥善保密。
2. **前端**：作为静态资源托管到 CDN（Vercel、Netlify、Cloudflare Pages 等），并设置 `window.__FLASHCARD_API_BASE__ = 'https://your-api-domain/api'` 指向线上后端。
3. **安全**：当前使用自定义令牌保护写操作，建议后续接入 Supabase Auth 或其他身份体系，避免令牌泄露。
4. **备份**：可通过 `server/scripts/import-data.js` 将本地 `scripts/data.js` 同步至 Supabase，也可从 Supabase 控制台导出 CSV 备份。

## 测试与排错

- 调试上传失败时，优先检查存储桶是否存在、是否为 Public，以及后端终端日志（`node index.js` 会打印具体错误）。
- 如果用户端出现“无法加载最新数据”提示，可点击提示内的“重新加载”按钮或刷新页面；仍失败时检查后端服务与网络。
- 管理端操作需要正确填入 `.env` 中的 `ADMIN_TOKEN`，否则会提示“请先在系统设置中填写管理员令牌”。
