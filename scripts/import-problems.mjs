import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'
import fg from 'fast-glob'
import { destinationFor, projectRoot } from './problem-utils.mjs'

const inputArg = process.argv[2]
const overwrite = process.argv.includes('--overwrite')
if (!inputArg) {
  console.error('用法：npm run import -- <目录或文件> [--overwrite]')
  process.exit(1)
}

const input = path.resolve(process.cwd(), inputArg)
const stat = await fs.stat(input)
const files = stat.isDirectory()
  ? await fg(['**/*.md', '**/*.tex'], { cwd: input, absolute: true })
  : [input]

function quote(value) {
  return JSON.stringify(String(value))
}

function parseTex(raw, file) {
  const meta = {}
  for (const line of raw.split(/\r?\n/).slice(0, 50)) {
    const match = line.match(/^%\s*([a-z-]+)\s*:\s*(.+?)\s*$/i)
    if (match) meta[match[1].toLowerCase()] = match[2]
  }
  const problem = raw.match(/\\begin\{problem\}([\s\S]*?)\\end\{problem\}/)?.[1]?.trim()
  const solution = raw.match(/\\begin\{solution\}([\s\S]*?)\\end\{solution\}/)?.[1]?.trim()
  if (!problem || !solution) throw new Error(`${file} 缺少 problem 或 solution 环境`)
  const tags = (meta.tags ?? '').split(/[,，]/).map((item) => item.trim()).filter(Boolean)
  const data = {
    id: meta.id,
    title: meta.title,
    category: meta.category,
    difficulty: Number(meta.difficulty),
    tags,
    stage: meta.stage,
    source: meta.source,
    verified: meta.verified === 'true'
  }
  const markdown = `---\nid: ${quote(data.id)}\ntitle: ${quote(data.title)}\ncategory: ${quote(data.category)}\ndifficulty: ${data.difficulty}\ntags:\n${tags.map((tag) => `  - ${quote(tag)}`).join('\n')}\nstage: ${quote(data.stage)}\nsource: ${quote(data.source)}\nverified: ${data.verified}\n---\n\n# ${data.title}\n\n<ProblemMeta />\n\n## 题目\n\n${problem}\n\n<details class="solution">\n<summary>查看解答</summary>\n\n## 解答\n\n${solution}\n\n</details>\n`
  return { data, markdown }
}

let imported = 0
for (const file of files) {
  const raw = await fs.readFile(file, 'utf8')
  const parsed = path.extname(file).toLowerCase() === '.tex'
    ? parseTex(raw, file)
    : (() => { const value = matter(raw); return { data: value.data, markdown: raw } })()
  const destination = destinationFor(parsed.data)
  if (!overwrite) {
    try { await fs.access(destination); throw new Error(`目标已存在：${path.relative(projectRoot, destination)}`) }
    catch (reason) { if (reason.code !== 'ENOENT') throw reason }
  }
  await fs.mkdir(path.dirname(destination), { recursive: true })
  await fs.writeFile(destination, parsed.markdown)
  imported += 1
  console.log(`已导入 ${path.basename(file)} → ${path.relative(projectRoot, destination)}`)
}

console.log(`批量导入完成：${imported} 个文件。请运行 npm run check。`)

