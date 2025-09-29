import 'dotenv/config';
import { supabase } from '../supabaseClient.js';

const projectUrl = process.env.SUPABASE_URL?.replace(/\/$/, '');
const bucketName = process.env.SUPABASE_BUCKET;

if (!projectUrl || !bucketName) {
  console.error('[fix-image-urls] 请在环境变量中设置 SUPABASE_URL 与 SUPABASE_BUCKET');
  process.exit(1);
}

const PUBLIC_BASE_URL = `${projectUrl}/storage/v1/object/public/${bucketName}`;

function convertPath(url) {
  if (!url || /^https?:\/\//i.test(url)) return { changed: false, value: url };
  const normalized = String(url).replace(/^\.\/?/, '').replace(/^\//, '');
  return { changed: true, value: `${PUBLIC_BASE_URL}/${normalized}` };
}

async function main() {
  const { data, error } = await supabase
    .from('cards')
    .select('id, image_url, preview_url, original_url');

  if (error) {
    console.error('[fix-image-urls] 读取 cards 表失败:', error.message);
    process.exit(1);
  }

  const updates = [];

  for (const row of data) {
    const image = convertPath(row.image_url);
    const preview = convertPath(row.preview_url);
    const original = convertPath(row.original_url);

    if (image.changed || preview.changed || original.changed) {
      updates.push({
        id: row.id,
        image_url: image.value,
        preview_url: preview.value,
        original_url: original.value,
      });
    }
  }

  if (!updates.length) {
    console.info('[fix-image-urls] 没有需要更新的记录。');
    return;
  }

  console.info(`[fix-image-urls] 需要更新 ${updates.length} 条记录，开始执行…`);

  let processed = 0;
  for (const row of updates) {
    const { error: updateError } = await supabase
      .from('cards')
      .update({
        image_url: row.image_url,
        preview_url: row.preview_url,
        original_url: row.original_url,
      })
      .eq('id', row.id);

    if (updateError) {
      console.error(`[fix-image-urls] 更新 id=${row.id} 失败:`, updateError.message);
      process.exit(1);
    }

    processed += 1;
    if (processed % 20 === 0 || processed === updates.length) {
      console.info(`[fix-image-urls] 已更新 ${processed} / ${updates.length}`);
    }
  }

  console.info('[fix-image-urls] 全部处理完成。');
}

main().catch(error => {
  console.error('[fix-image-urls] 未捕获异常:', error);
  process.exit(1);
});
