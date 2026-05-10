const express = require('express');
const path = require('path');
const app = express();
const PORT = 3456;

app.use(express.static(path.join(__dirname, 'dist')));

app.listen(PORT, () => {
  console.log(`Chart Gallery: http://localhost:${PORT}`);
  console.log(`先运行 node build.js 生成静态文件`);
});
