import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';
import { supabase } from '../supabaseClient.js';

// Utility script that dumps Supabase data into a window.APP_DATA payload.

async function main() {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const outputArg = process.argv[2];
  const defaultOutputPath = path.resolve(__dirname, '..', '..', 'scripts', 'data.js');
  const outputPath = outputArg ? path.resolve(process.cwd(), outputArg) : defaultOutputPath;

  console.info('[export] exporting Supabase data…');

  const { data: categoryRows, error: categoryError } = await supabase
    .from('categories')
    .select('id, name')
    .order('name', { ascending: true });

  if (categoryError) {
    throw new Error(`加载分类失败：${categoryError.message}`);
  }

  const { data: cardRows, error: cardError } = await supabase
    .from('cards')
    .select('id, title, prompt, image_url, preview_url, original_url, audio_text, category_id, categories(name)')
    .order('id', { ascending: true });

  if (cardError) {
    throw new Error(`加载学习卡片失败：${cardError.message}`);
  }

  const categories = (categoryRows || [])
    .map(item => String(item?.name ?? '').trim())
    .filter(Boolean);

  const cases = (cardRows || []).map(item => ({
    id: item.id,
    title: item.title,
    prompt: item.prompt,
    imageUrl: item.image_url,
    previewImageUrl: item.preview_url,
    originalImageUrl: item.original_url,
    audioText: item.audio_text,
    category: item.categories?.name || null,
    categoryId: item.category_id ?? null,
  }));

  const payload = `window.APP_DATA = ${JSON.stringify({ categories, cases }, null, 2)};\n`;
  fs.writeFileSync(outputPath, payload, 'utf8');

  console.log(`已导出 ${cases.length} 条学习卡片至 ${outputPath}`);
}

main().catch(error => {
  console.error('导出失败:', error.message || error);
  process.exit(1);
});
