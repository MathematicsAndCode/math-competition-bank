import fs from 'node:fs/promises'
import path from 'node:path'
import { extractStatement, listProblemFiles, projectRoot, readProblem } from './problem-utils.mjs'

const files = await listProblemFiles()
const items = []

for (const file of files) {
  const { data, content } = await readProblem(file)
  const relative = path.relative(path.join(projectRoot, 'docs'), file).replaceAll(path.sep, '/')
  items.push({
    id: data.id,
    title: data.title,
    category: data.category,
    difficulty: data.difficulty,
    tags: data.tags,
    stage: data.stage,
    source: data.source,
    path: `/${relative.replace(/\.md$/, '')}`,
    statement: extractStatement(content)
  })
}

items.sort((a, b) => a.id.localeCompare(b.id, 'en'))
const output = path.join(projectRoot, 'docs', 'public', 'problem-index.json')
await fs.mkdir(path.dirname(output), { recursive: true })
await fs.writeFile(output, `${JSON.stringify(items, null, 2)}\n`)
console.log(`已生成题目索引：${items.length} 道题。`)

