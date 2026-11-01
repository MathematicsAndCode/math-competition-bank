import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'
import fg from 'fast-glob'

export const projectRoot = path.resolve(import.meta.dirname, '..')
export const problemsRoot = path.join(projectRoot, 'docs', 'problems')
export const categoryCodes = { 代数: 'A', 几何: 'G', 数论: 'N', 组合: 'C' }
export const categoryDirs = { 代数: 'algebra', 几何: 'geometry', 数论: 'number-theory', 组合: 'combinatorics' }
export const requiredFields = ['id', 'title', 'category', 'difficulty', 'tags', 'stage', 'source', 'verified']

export async function listProblemFiles() {
  return fg('docs/problems/**/*.md', {
    cwd: projectRoot,
    absolute: true,
    ignore: ['docs/problems/index.md']
  })
}

export async function readProblem(file) {
  const raw = await fs.readFile(file, 'utf8')
  const parsed = matter(raw)
  return { raw, ...parsed }
}

export function plainText(markdown) {
  return markdown
    .replace(/<[^>]+>/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/\$\$[\s\S]*?\$\$/g, ' [公式] ')
    .replace(/\\\([\s\S]*?\\\)/g, ' [公式] ')
    .replace(/\$([^$]+)\$/g, ' $1 ')
    .replace(/[#*_>`~|-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function extractStatement(content) {
  const match = content.match(/## 题目\s*([\s\S]*?)(?=<details|## 解答|$)/)
  return plainText(match?.[1] ?? content).slice(0, 220)
}

export function destinationFor(data) {
  const dir = categoryDirs[data.category]
  if (!dir) throw new Error(`未知分类：${data.category}`)
  return path.join(problemsRoot, dir, `${data.id}.md`)
}

