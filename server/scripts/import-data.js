import fs from 'fs';
import path from 'path';
import vm from 'vm';
import 'dotenv/config';
import { supabase } from '../supabaseClient.js';

async function main() {
  const dataJsPath = path.join(process.cwd(), '..', 'scripts', 'data.js');
  const content = fs.readFileSync(dataJsPath, 'utf8');

  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(content, sandbox);

  const cases = Array.isArray(sandbox.window.APP_DATA?.cases)
    ? sandbox.window.APP_DATA.cases
    : [];
  const categories = Array.isArray(sandbox.window.APP_DATA?.categories)
    ? sandbox.window.APP_DATA.categories
    : [];

  if (!cases.length) {
    console.error('未找到 cases 数据，确认 scripts/data.js 是否正常。');
    process.exit(1);
  }

  await clearExistingData();
  const categoryMap = await importCategories(categories);
  await importCards(cases, categoryMap);

  console.log('数据导入完成。');
}

async function clearExistingData() {
  await supabase.from('cards').delete().neq('id', 0);
  await supabase.from('categories').delete().neq('id', 0);
}

async function importCategories(categories) {
  const normalized = Array.from(new Set(categories.map(item => String(item).trim()).filter(Boolean)));
  const categoryMap = new Map();

  for (const name of normalized) {
    const { data, error } = await supabase
      .from('categories')
      .insert({ name })
      .select('id')
      .single();

    if (error) {
      console.error('分类导入失败', name, error);
      process.exit(1);
    }

    categoryMap.set(name, data.id);
  }

  return categoryMap;
}

async function importCards(cases, categoryMap) {
  const batchSize = 100;
  for (let i = 0; i < cases.length; i += batchSize) {
    const batch = cases.slice(i, i + batchSize).map(item => ({
      title: item.title,
      prompt: item.prompt,
      image_url: item.imageUrl,
      preview_url: item.previewImageUrl || null,
      original_url: item.originalImageUrl || null,
      audio_text: item.audioText || null,
      category_id: categoryMap.get(item.category) || null,
    }));

    const { error } = await supabase.from('cards').insert(batch);
    if (error) {
      console.error('导入学习卡片失败:', error.message);
      process.exit(1);
    }
  }
}

main().catch(error => {
  console.error('导入过程出现错误:', error);
  process.exit(1);
});
