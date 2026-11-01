import fs from 'node:fs/promises'
import path from 'node:path'
import { destinationFor, projectRoot } from './problem-utils.mjs'

const body = process.env.ISSUE_BODY ?? ''
const issueNumber = process.env.ISSUE_NUMBER ?? ''

function field(label) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return body.match(new RegExp(`### ${escaped}\\s*\\n+([\\s\\S]*?)(?=\\n### |$)`))?.[1]?.trim() ?? ''
}

const category = field('分类')
const id = field('编号').toUpperCase()
const title = field('标题')
const difficulty = Number(field('难度').match(/[1-5]/)?.[0])
const tags = field('标签').split(/[,，]/).map((tag) => tag.trim()).filter(Boolean)
const stage = field('适用阶段')
const source = field('来源')
const statement = field('题目')
const solution = field('解答')
const images = field('图片（可选）')

if (!/^MCB-[AGNC]-\d{3}$/.test(id)) throw new Error('Issue 中的编号格式无效')
if (!title || !category || !difficulty || !tags.length || !stage || !source || !statement || !solution) {
  throw new Error('Issue 缺少必填字段')
}

const quote = (value) => JSON.stringify(String(value))
const markdown = `---\nid: ${quote(id)}\ntitle: ${quote(title)}\ncategory: ${quote(category)}\ndifficulty: ${difficulty}\ntags:\n${tags.map((tag) => `  - ${quote(tag)}`).join('\n')}\nstage: ${quote(stage)}\nsource: ${quote(source)}\nverified: true\nreview_issue: ${issueNumber}\n---\n\n# ${title}\n\n<ProblemMeta />\n\n## 题目\n\n${statement}${images && images !== '_No response_' ? `\n\n${images}` : ''}\n\n<details class="solution">\n<summary>查看解答</summary>\n\n## 解答\n\n${solution}\n\n</details>\n`

const destination = destinationFor({ id, category })
try { await fs.access(destination); throw new Error(`题目 ${id} 已存在`) }
catch (reason) { if (reason.code !== 'ENOENT') throw reason }
await fs.mkdir(path.dirname(destination), { recursive: true })
await fs.writeFile(destination, markdown)
console.log(`已从 Issue #${issueNumber} 生成 ${path.relative(projectRoot, destination)}`)

