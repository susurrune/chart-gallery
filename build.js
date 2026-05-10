const fs = require('fs');
const path = require('path');

const LOCAL_CHARTS = path.join(__dirname, 'charts');
const EXT_CHARTS = path.resolve(__dirname, '..');
const SRC_DIR = path.join(__dirname, 'src');
const DIST_DIR = path.join(__dirname, 'dist');
const CHARTS_OUT = path.join(DIST_DIR, 'charts');

// 确保目录存在
if (!fs.existsSync(LOCAL_CHARTS)) fs.mkdirSync(LOCAL_CHARTS, { recursive: true });

// Phase 1: 从外部目录自动导入新图表（本地开发时从 D:\CludeCodePR 同步到 ./charts/）
if (EXT_CHARTS !== LOCAL_CHARTS && fs.existsSync(EXT_CHARTS)) {
  const externals = fs.readdirSync(EXT_CHARTS).filter(f =>
    f.endsWith('.html') && !f.startsWith('gallery') && f !== 'index.html' && f !== 'package-lock.json'
  );
  for (const f of externals) {
    const dest = path.join(LOCAL_CHARTS, f);
    if (!fs.existsSync(dest)) {
      fs.copyFileSync(path.join(EXT_CHARTS, f), dest);
      console.log(`  ↳ 导入 ${f}`);
    }
  }
}

// Phase 2: 清理并重建 dist
fs.rmSync(DIST_DIR, { recursive: true, force: true });
fs.mkdirSync(CHARTS_OUT, { recursive: true });

const files = fs.readdirSync(LOCAL_CHARTS)
  .filter(f => f.endsWith('.html'));

function extractMeta(content, name) {
  const re = new RegExp(`<meta\\s+name="${name}"\\s+content="([^"]+)"`, 'i');
  const m = content.match(re);
  return m ? m[1] : null;
}

const charts = [];

for (const f of files) {
  const srcPath = path.join(LOCAL_CHARTS, f);
  const stat = fs.statSync(srcPath);
  const content = fs.readFileSync(srcPath, 'utf-8');

  // 优先读取 <meta> 标签，其次正则回退
  const title = extractMeta(content, 'chart-title')
    || (content.match(/<title>([^<]+)<\/title>/) || [])[1]
    || f.replace('.html', '');

  const description = extractMeta(content, 'chart-description')
    || (content.match(/class="subtitle">([^<]+)<\/subtitle>/) || [])[1] || '';

  const date = extractMeta(content, 'chart-date')
    || (content.match(/更新时间[：:]\s*([^<&]+)/) || [])[1]
    || (content.match(/生成时间[：:]\s*([^<&]+)/) || [])[1]
    || (content.match(/搜索时间[：:]\s*([^<&]+)/) || [])[1]
    || stat.mtime.toISOString().slice(0, 10);

  const tags = extractMeta(content, 'chart-tags') || '';

  charts.push({
    filename: f,
    title: title.trim(),
    description: description.trim(),
    tags: tags.split(',').map(t => t.trim()).filter(Boolean),
    size: stat.size,
    mtime: stat.mtime.toISOString(),
    date: date.trim(),
  });

  fs.copyFileSync(srcPath, path.join(CHARTS_OUT, f));
  console.log(`  ${f}`);
}

const template = fs.readFileSync(path.join(SRC_DIR, 'index.html'), 'utf-8');
fs.writeFileSync(path.join(DIST_DIR, 'index.html'), template.replace('__CHARTS_DATA__', JSON.stringify(charts)));

const totalSize = (charts.reduce((s, c) => s + c.size, 0) / 1024).toFixed(0);
console.log(`\n✓ ${charts.length} 个图表 (来源: ./charts/), 共 ${totalSize} KB`);
