---
title: 题目录入指南
---

# 题目录入指南

本站题目均以独立 Markdown 文件保存。每次合并到 `main` 分支后，GitHub Actions 会自动校验、生成索引并重新部署。

## 方式一：直接在 GitHub 网页新增

1. 打开仓库中的 `docs/problems`，进入对应分类目录：`algebra`、`geometry`、`number-theory` 或 `combinatorics`。
2. 点击 **Add file → Create new file**。
3. 复制 `templates/problem.md`，按注释填写元数据、题目与解答。
4. 文件名必须与编号完全相同，例如 `MCB-A-002.md`。
5. 选择创建新分支并提交 Pull Request；等待自动校验通过后再合并。

## 方式二：Issue Form 提交

在仓库的 **Issues → New issue → 提交新题** 中填写表单。维护者确认内容无误后添加 `approved` 标签，Action 会把 Issue 转成 Markdown，并自动创建 Pull Request。只有 Pull Request 被人工审核并合并后，题目才会发布。

## 图片

将图片保存到 `docs/public/images/problems/`，在题目中使用：

```md
![图形说明](/images/problems/example.svg)
```

图片文件名建议使用题目编号加序号，例如 `MCB-G-002-1.svg`。

## 批量导入

把 `.md` 或符合约定的 `.tex` 文件放入任意本地目录，然后运行：

```sh
npm run import -- ./imports
npm run check
```

`.tex` 文件头部需使用 `% key: value` 声明元数据，正文分别放在 `problem` 和 `solution` 环境中。Markdown 行内公式使用 `$...$`，独立公式使用 `$$...$$`。完整格式见仓库 README。

