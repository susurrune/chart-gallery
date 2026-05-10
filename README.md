# Chart Gallery

数据分析图表展示站，自动聚合 HTML 图表并部署为 GitHub Pages 在线画廊。

**在线地址：https://susurrune.github.io/chart-gallery/**

## 快速开始

```bash
node build.js    # 构建（自动从上级目录导入新图表）
node server.js   # 本地预览 http://localhost:3456
```

## 添加新图表

1. 用任意方式生成 HTML 图表文件
2. 放入项目根目录（默认扫描 `D:\CludeCodePR`），或直接放入 `charts/`
3. 运行 `node build.js` —— 自动导入 → 构建 → 输出到 `dist/`
4. 提交并推送，GitHub Actions 自动部署

### 元数据规范（推荐）

在 HTML `<head>` 中添加以下 meta 标签可让图库更准确识别：

```html
<meta name="chart-title" content="图表标题">
<meta name="chart-date" content="2026-05-11">
<meta name="chart-description" content="简短描述">
<meta name="chart-tags" content="标签1,标签2">
```

不写也无妨，构建脚本会自动从 `<title>`、内容正则等回退提取。

## 技术栈

- 纯静态：无框架，无构建工具
- Chart.js 4.4 — 前端图表渲染
- Express.js — 本地开发服务器
- GitHub Pages + Actions — CI/CD 自动部署

## 项目结构

```
gallery/
├── build.js          # 构建脚本：导入 + 提取元数据 + 生成首页
├── server.js         # 本地开发服务器（端口 3456）
├── charts/           # 图表源文件（git 跟踪）
├── src/index.html    # 首页模板（__CHARTS_DATA__ 占位符）
├── dist/             # 构建输出（gitignore）
└── .github/workflows/deploy.yml  # GitHub Pages 自动部署
```

## 部署

推送到 `main` 分支即触发 GitHub Actions 自动部署到 Pages。
