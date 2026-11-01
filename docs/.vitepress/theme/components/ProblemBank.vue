<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { withBase } from 'vitepress'

interface ProblemItem {
  id: string
  title: string
  category: '代数' | '几何' | '数论' | '组合'
  difficulty: number
  tags: string[]
  stage: string
  source: string
  path: string
  statement: string
}

const problems = ref<ProblemItem[]>([])
const loading = ref(true)
const error = ref('')
const keyword = ref('')
const category = ref('全部')
const difficulty = ref('全部')
const selectedTags = ref<string[]>([])

const categories = ['全部', '代数', '几何', '数论', '组合']
const difficulties = ['全部', '1', '2', '3', '4', '5']

const allTags = computed(() => {
  const counter = new Map<string, number>()
  for (const item of problems.value) {
    for (const tag of item.tags) counter.set(tag, (counter.get(tag) ?? 0) + 1)
  }
  return [...counter.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'zh-CN'))
})

const filtered = computed(() => {
  const q = keyword.value.trim().toLocaleLowerCase('zh-CN')
  return problems.value.filter((item) => {
    const haystack = [item.id, item.title, item.source, item.stage, item.statement, ...item.tags]
      .join(' ')
      .toLocaleLowerCase('zh-CN')
    const keywordMatched = !q || haystack.includes(q)
    const categoryMatched = category.value === '全部' || item.category === category.value
    const difficultyMatched = difficulty.value === '全部' || item.difficulty === Number(difficulty.value)
    const tagsMatched = selectedTags.value.every((tag) => item.tags.includes(tag))
    return keywordMatched && categoryMatched && difficultyMatched && tagsMatched
  })
})

function toggleTag(tag: string) {
  selectedTags.value = selectedTags.value.includes(tag)
    ? selectedTags.value.filter((item) => item !== tag)
    : [...selectedTags.value, tag]
}

function reset() {
  keyword.value = ''
  category.value = '全部'
  difficulty.value = '全部'
  selectedTags.value = []
}

onMounted(async () => {
  try {
    const response = await fetch(`${withBase('/problem-index.json')}?v=${Date.now()}`, { cache: 'no-store' })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    problems.value = await response.json()
  } catch (reason) {
    error.value = `题目索引加载失败：${reason instanceof Error ? reason.message : String(reason)}`
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section class="problem-bank" aria-label="题目筛选与列表">
    <div class="filter-panel">
      <label class="search-box">
        <span>关键词</span>
        <input v-model="keyword" type="search" placeholder="搜索编号、题目、来源或标签" />
      </label>
      <label>
        <span>分类</span>
        <select v-model="category">
          <option v-for="item in categories" :key="item">{{ item }}</option>
        </select>
      </label>
      <label>
        <span>难度</span>
        <select v-model="difficulty">
          <option v-for="item in difficulties" :key="item" :value="item">
            {{ item === '全部' ? item : `${item} 星` }}
          </option>
        </select>
      </label>
      <button class="reset-button" type="button" @click="reset">重置</button>
    </div>

    <div v-if="allTags.length" class="tag-filter" aria-label="标签筛选">
      <span class="tag-filter-title">标签（多选为同时满足）</span>
      <button
        v-for="([tag, count]) in allTags"
        :key="tag"
        type="button"
        class="tag-chip"
        :class="{ active: selectedTags.includes(tag) }"
        :aria-pressed="selectedTags.includes(tag)"
        @click="toggleTag(tag)"
      >
        {{ tag }} <small>{{ count }}</small>
      </button>
    </div>

    <div class="result-summary">
      <strong>{{ filtered.length }}</strong> 道题
      <span v-if="selectedTags.length"> · 已选 {{ selectedTags.length }} 个标签</span>
    </div>

    <p v-if="loading" class="state-message">正在加载题目……</p>
    <p v-else-if="error" class="state-message error">{{ error }}</p>
    <p v-else-if="!filtered.length" class="state-message">没有符合条件的题目，请调整筛选条件。</p>

    <div v-else class="problem-grid">
      <a v-for="item in filtered" :key="item.id" class="problem-card" :href="withBase(item.path)">
        <div class="card-head">
          <span class="problem-id">{{ item.id }}</span>
          <span class="category-badge">{{ item.category }}</span>
        </div>
        <h2>{{ item.title }}</h2>
        <p class="statement-preview">{{ item.statement }}</p>
        <div class="difficulty" :aria-label="`难度 ${item.difficulty} 星`">
          <span v-for="star in 5" :key="star" :class="{ filled: star <= item.difficulty }">★</span>
        </div>
        <div class="card-tags">
          <span v-for="tag in item.tags" :key="tag">{{ tag }}</span>
        </div>
        <div class="card-foot">
          <span>{{ item.stage }}</span>
          <span>{{ item.source }}</span>
        </div>
      </a>
    </div>
  </section>
</template>

