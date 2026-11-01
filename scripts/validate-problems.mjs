import fs from 'node:fs/promises'
import path from 'node:path'
import {
  categoryCodes,
  listProblemFiles,
  projectRoot,
  readProblem,
  requiredFields
} from './problem-utils.mjs'

const files = await listProblemFiles()
const ids = new Map()
const errors = []

function add(file, message) {
  errors.push(`${path.relative(projectRoot, file)}：${message}`)
}

function count(text, token) {
  return text.split(token).length - 1
}

for (const file of files) {
  const { data, content } = await readProblem(file)
  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null || data[field] === '') add(file, `缺少元数据 ${field}`)
  }

  if (!/^MCB-[AGNC]-\d{3}$/.test(String(data.id ?? ''))) add(file, '编号必须符合 MCB-A-001 格式')
  if (path.basename(file, '.md') !== data.id) add(file, '文件名必须与 id 完全一致')
  if (categoryCodes[data.category] && String(data.id).split('-')[1] !== categoryCodes[data.category]) {
    add(file, '编号中的分类字母与 category 不一致')
  }
  if (!Object.hasOwn(categoryCodes, data.category)) add(file, 'category 必须是代数、几何、数论或组合')
  if (!Number.isInteger(data.difficulty) || data.difficulty < 1 || data.difficulty > 5) add(file, 'difficulty 必须是 1–5 的整数')
  if (!Array.isArray(data.tags) || data.tags.length === 0 || data.tags.some((tag) => typeof tag !== 'string')) add(file, 'tags 必须是非空字符串数组')
  if (data.verified !== true) add(file, 'verified 必须为 true；未经核验的题目不能发布')
  if (!content.includes('## 题目')) add(file, '正文缺少“## 题目”')
  if (!content.includes('<details class="solution">') || !content.includes('## 解答')) add(file, '解答必须放入默认折叠的 solution details 中')

  const withoutCode = content.replace(/```[\s\S]*?```/g, '')
  if (count(withoutCode, '$$') % 2 !== 0) add(file, '块级公式的 $$ 未成对')
  if (count(withoutCode, '\\(') !== count(withoutCode, '\\)')) add(file, '行内公式的 \\( 与 \\) 未成对')
  if (count(withoutCode, '\\[') !== count(withoutCode, '\\]')) add(file, '块级公式的 \\[ 与 \\] 未成对')
  const noBlocks = withoutCode.replace(/\$\$[\s\S]*?\$\$/g, '')
  const singleDollarCount = (noBlocks.match(/(?<!\\)\$/g) ?? []).length
  if (singleDollarCount % 2 !== 0) add(file, '行内公式的单美元符号未成对')

  for (const image of content.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)) {
    const src = image[1].split(/\s+/)[0]
    if (/^https?:/.test(src)) continue
    const target = src.startsWith('/')
      ? path.join(projectRoot, 'docs', 'public', src)
      : path.resolve(path.dirname(file), src)
    try { await fs.access(target) } catch { add(file, `图片不存在：${src}`) }
  }

  if (ids.has(data.id)) add(file, `编号与 ${path.relative(projectRoot, ids.get(data.id))} 重复`)
  else ids.set(data.id, file)
}

if (files.length === 0) errors.push('题库中至少需要一道题')

if (errors.length) {
  console.error(`题目校验失败（${errors.length} 项）：\n- ${errors.join('\n- ')}`)
  process.exit(1)
}

console.log(`题目校验通过：${files.length} 道题，编号、元数据、图片和公式格式均有效。`)

