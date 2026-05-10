const fs = require('fs');
const path = require('path');

// 优先读取本地的 charts/ 目录（CI 环境），其次是 D:\CludeCodePR（本地开发）
const LOCAL_CHARTS = path.join(__dirname, 'charts');
const EXT_CHARTS = path.resolve(__dirname, '..');
const CHARTS_DIR = fs.existsSync(LOCAL_CHARTS) && fs.readdirSync(LOCAL_CHARTS).some(f => f.endsWith('.html'))
  ? LOCAL_CHARTS
  : EXT_CHARTS;

const SRC_DIR = path.join(__dirname, 'src');
const DIST_DIR = path.join(__dirname, 'dist');
const CHARTS_OUT = path.join(DIST_DIR, 'charts');

fs.rmSync(DIST_DIR, { recursive: true, force: true });
fs.mkdirSync(CHARTS_OUT, { recursive: true });

const files = fs.readdirSync(CHARTS_DIR)
  .filter(f => f.endsWith('.html'))
  .filter(f => !f.startsWith('gallery') && f !== 'index.html' && f !== 'package-lock.json');

const charts = [];

for (const f of files) {
  const srcPath = path.join(CHARTS_DIR, f);
  const stat = fs.statSync(srcPath);
  const content = fs.readFileSync(srcPath, 'utf-8');

  const titleMatch = content.match(/<title>([^<]+)<\/title>/);
  const descMatch = content.match(/class="subtitle">([^<]+)<\/subtitle>/);
  const timeMatch = content.match(/更新时间[：:]\s*([^<&]+)/) ||
                    content.match(/生成时间[：:]\s*([^<&]+)/) ||
                    content.match(/搜索时间[：:]\s*([^<&]+)/);

  charts.push({
    filename: f,
    title: titleMatch ? titleMatch[1] : f.replace('.html', ''),
    description: descMatch ? descMatch[1] : '',
    size: stat.size,
    mtime: stat.mtime.toISOString(),
    date: timeMatch ? timeMatch[1].trim() : stat.mtime.toISOString().slice(0, 10),
  });

  fs.copyFileSync(srcPath, path.join(CHARTS_OUT, f));
  console.log(`  ${f}`);
}

let template = fs.readFileSync(path.join(SRC_DIR, 'index.html'), 'utf-8');
template = template.replace('__CHARTS_DATA__', JSON.stringify(charts));
fs.writeFileSync(path.join(DIST_DIR, 'index.html'), template);

const totalSize = (charts.reduce((s, c) => s + c.size, 0) / 1024).toFixed(0);
const src = CHARTS_DIR === LOCAL_CHARTS ? './charts/' : 'D:\\CludeCodePR\\';
console.log(`\n✓ ${charts.length} 个图表 (来自 ${src}), 共 ${totalSize} KB`);
