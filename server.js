const express = require('express');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const app = express();
const PORT = 3456;

app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'dist')));

// Upload endpoint: accepts base64 HTML, saves to charts/ and parent, rebuilds
app.post('/api/upload', (req, res) => {
  const { filename, content, category } = req.body;
  if (!filename || !content) {
    return res.status(400).json({ error: '缺少文件名或内容' });
  }

  const cleanName = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
  if (!cleanName.endsWith('.html')) {
    return res.status(400).json({ error: '仅支持 HTML 文件' });
  }

  let html = Buffer.from(content, 'base64').toString('utf-8');

  // Inject category meta if user specified one and file doesn't already have it
  if (category && !html.includes('chart-category')) {
    html = html.replace('<head>', '<head>\n<meta name="chart-category" content="' + category + '">');
  }

  const chartsDir = path.join(__dirname, 'charts');
  const rootDir = path.resolve(__dirname, '..');

  // Save to charts/
  fs.writeFileSync(path.join(chartsDir, cleanName), html);

  // Also save to parent directory so future builds auto-import it
  if (rootDir !== chartsDir) {
    fs.writeFileSync(path.join(rootDir, cleanName), html);
  }

  // Rebuild
  try {
    execSync('node build.js', { cwd: __dirname, stdio: 'pipe' });
  } catch (e) {
    return res.json({ success: true, filename: cleanName, warning: '构建完成但有警告' });
  }

  res.json({ success: true, filename: cleanName });
});

app.listen(PORT, () => {
  console.log('Chart Gallery: http://localhost:' + PORT);
  console.log('先运行 node build.js 生成静态文件');
});
