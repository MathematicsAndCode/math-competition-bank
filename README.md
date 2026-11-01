# 数学竞赛题库

一个完全托管在 GitHub 上的数学竞赛题库：VitePress + Vue 3 + TypeScript，GitHub Actions 自动校验与构建，GitHub Pages 自动部署。没有数据库、外部后端或前端密钥。

## 功能

- 代数、几何、数论、组合四大分类。
- 每题独立 Markdown；YAML Frontmatter 保存编号、来源、难度、标签和适用阶段。
- MathJax 渲染 LaTeX；解答默认折叠。
- 关键词、分类、难度及多标签联合筛选。
- 自动生成 `problem-index.json`，无需手工维护题目导航。
- 自动校验编号、重复项、元数据、图片路径和公式定界符。
- Issue Form → 人工审核 → Action 转换 → Pull Request，不直接发布未经审核内容。
- 支持从本地批量导入 `.md` 和约定格式的 `.tex`。

## 本地运行

```sh
npm ci
npm run dev
```

完整检查与构建：

```sh
npm run check
npm run docs:build
```

## 新增一道题

### GitHub 网页方式

1. 打开 `docs/problems/` 下对应目录：
   - `algebra`：代数，编号字母 `A`
   - `geometry`：几何，编号字母 `G`
   - `number-theory`：数论，编号字母 `N`
   - `combinatorics`：组合，编号字母 `C`
2. 点击 **Add file → Create new file**。
3. 复制 [`templates/problem.md`](templates/problem.md) 的内容。
4. 文件名与编号保持一致，例如 `MCB-C-002.md`。
5. 选择 **Create a new branch for this commit and start a pull request**。
6. 等待 PR 中的“题目与构建校验”通过，人工复核后合并。合并后 Pages 自动更新。

修改已有题目时，直接打开文件并点击铅笔图标，同样建议通过分支和 PR 修改。

### Issue Form 方式

1. 打开 **Issues → New issue → 提交新题**。
2. 填写编号、题目、解答、准确来源等字段并提交。
3. 维护者复核 Issue；确认无误后添加 `approved` 标签。
4. `审核 Issue 转题目 PR` 工作流自动生成 Markdown 和 Pull Request。
5. 再次审核并合并 PR 后，网站才会发布题目。

> 首次使用时请在仓库 **Issues → Labels** 创建名为 `approved` 的标签。不要把该标签授予未经核验的内容。

## Frontmatter 规范

```yaml
---
id: MCB-A-002
title: 题目标题
category: 代数
difficulty: 2
tags:
  - 不等式
  - 换元
stage: 初中竞赛
source: 本站原创
verified: true
---
```

- 编号格式固定为 `MCB-[AGNC]-三位数字`，且不可重复。
- `difficulty` 为 `1`–`5` 的整数。
- `source` 必须准确；无法核实具体赛事时使用“经典问题（公开领域）”，不要猜测比赛名称或年份。
- 只有完成题目与解答核验后才能设置 `verified: true`。
- 行内公式使用 `$...$`，独立公式使用 `$$...$$`。

## 图片

将图片上传到 `docs/public/images/problems/`，题目中使用：

```md
![辅助图](/images/problems/MCB-G-002-1.svg)
```

校验脚本会检查仓库内图片是否存在。也可在 Issue Form 的图片字段中粘贴 GitHub 自动生成的图片 Markdown；外部图片地址不会进行本地存在性校验。

## 批量导入

Markdown 文件需已经包含合法 Frontmatter 和标准正文结构。将文件放入一个目录后运行：

```sh
npm run import -- ./imports
npm run check
```

TeX 文件使用以下约定：

```tex
% id: MCB-N-002
% title: 示例标题
% category: 数论
% difficulty: 2
% tags: 整除, 同余
% stage: 初中竞赛
% source: 本站原创
% verified: true

\begin{problem}
题目正文，公式保持 LaTeX 写法。
\end{problem}

\begin{solution}
完整解答。
\end{solution}
```

默认拒绝覆盖已有编号；确需覆盖时追加 `--overwrite`。导入后必须运行 `npm run check` 并通过 Pull Request 提交。

## 自动化说明

- `.github/workflows/ci.yml`：PR 中执行校验、类型检查和完整构建。
- `.github/workflows/deploy.yml`：`main` 每次更新后部署 GitHub Pages。
- `.github/workflows/issue-to-pr.yml`：仅在 Issue 被添加 `approved` 标签后生成 PR。
- Actions 使用 GitHub 自动提供的短期 `GITHUB_TOKEN`；仓库和前端均不保存个人 Token 或密钥。

## 目录

```text
docs/
  .vitepress/                 VitePress 配置与 Vue 组件
  problems/                   每题一个 Markdown 文件
  public/                     图片、自动生成索引等静态资源
scripts/                      校验、索引、Issue 转换、批量导入
templates/problem.md          新题模板
.github/ISSUE_TEMPLATE/       GitHub Issue Form
.github/workflows/            CI、Issue 转 PR、Pages 部署
```

