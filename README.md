# Chart Gallery

> 数据可视化图表展示画廊 — 自动聚合 HTML 图表并部署为 GitHub Pages 在线站点。

**在线地址：https://susurrune.github.io/chart-gallery/**

---

## 概览

Chart Gallery 是一个纯静态的图表展示站，支持自动扫描、元数据提取、分类筛选和 CI/CD 部署。用于集中展示 AI / LLM / 开发者生态 / 开源趋势等主题的数据分析图表。

当前收录 **21 个图表**，涵盖：

| 类别 | 主题 |
|------|------|
| LLM & 大模型 | 基准评测排名、API 定价矩阵、最新动态分析 |
| AI 工具 & 行业 | AGI 进展分析、AI 编程助手对比、行业大会趋势、AI 格局仪表盘 |
| 开发者生态 | 开发者生态调查、企业技术采纳、开发者薪资分析 |
| 开源趋势 | GitHub 活动看板、AI 项目 Star 增长、AI Agent 框架排名 |
| 编程语言 | 编程语言演进时间线、TypeScript 趋势、前端框架对比 |

---

## 功能特性

- **深浅色主题** — 一键切换，偏好自动保存
- **多维筛选** — 分类标签 + 时间范围 + 关键词搜索 + 排序
- **模态预览** — 点击即时预览图表，无需跳转
- **自动构建** — 扫描目录，提取 meta 信息，生成首页
- **在线上传** — 支持本地服务器上传与 GitHub API 远程上传

---

## 快速开始

```bash
# 安装依赖
npm install

# 构建（自动导入新图表并生成首页）
node build.js

# 本地预览
node server.js
# → http://localhost:3456
```

### 添加新图表

1. 生成任意 HTML 图表文件
2. 放入项目根目录（默认同步 `D:\CludeCodePR`）或直接放入 `charts/`
3. 运行 `node build.js` → 自动导入、提取元数据、构建输出到 `dist/`
4. 提交推送，GitHub Actions 自动部署

### 元数据规范

在 HTML `<head>` 中添加以下 meta 标签可提升自动识别质量：

```html
<meta name="chart-title" content="图表标题">
<meta name="chart-date" content="2026-05-11">
<meta name="chart-description" content="简短描述">
<meta name="chart-tags" content="标签1,标签2">
<meta name="chart-category" content="llm|dev|oss|lang|ai|other">
```

不写也无妨，构建脚本会自动从 `<title>`、内容和文件名回退提取。

### 分类映射

```
llm   → LLM & 大模型     (匹配: llm_*)
dev   → 开发者生态        (匹配: developer_* / enterprise_* / salary_*)
oss   → 开源趋势          (匹配: github_* / ai_agent_*)
lang  → 编程语言          (匹配: programming_* / typescript_* / frontend_* / language_*)
ai    → AI 工具 & 行业    (匹配: ai_* 等)
other → 其他              (默认)
```

---

## 项目结构

```
chart-gallery/
├── charts/                      # 图表源文件（git 跟踪）
│   ├── llm_benchmark_ranking_20260510.html
│   ├── ai_agent_agi_analysis_2026.html
│   ├── github_activity_dashboard_20260511.html
│   └── ...
├── src/
│   └── index.html               # 首页模板（含完整 UI 和 JS 逻辑）
├── dist/                        # 构建输出（gitignore）
│   ├── index.html
│   └── charts/
├── build.js                     # 构建脚本：导入 → 提取 → 生成
├── server.js                    # Express 本地开发服务器（端口 3456）
├── package.json
└── .github/workflows/deploy.yml # GitHub Actions → Pages 部署
```

---

## 技术栈

| 层面 | 选型 |
|------|------|
| 前端 | 原生 HTML/CSS/JS（无框架，无构建工具） |
| 字体 | Fraunces（展示衬线）+ JetBrains Mono（等宽） |
| 图表 | Chart.js / ECharts（各图表独立决定） |
| 本地服务 | Express.js — 静态文件 + 上传 API |
| CI/CD | GitHub Actions → `build` → `deploy-pages` |
| 托管 | GitHub Pages（自动部署 `dist/`） |

---

## 部署

推送到 `main` 分支即触发 GitHub Actions 自动构建并部署到 Pages。

```bash
git add .
git commit -m "feat: 添加新图表"
git push origin main
```

等待约 1-2 分钟后访问在线地址即可看到更新。

---

## 许可证

MIT
