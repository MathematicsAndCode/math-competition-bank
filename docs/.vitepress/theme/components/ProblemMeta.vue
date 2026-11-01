<script setup lang="ts">
import { useData } from 'vitepress'

const { frontmatter } = useData()
</script>

<template>
  <div class="problem-meta" aria-label="题目元数据">
    <span class="problem-id">{{ frontmatter.id }}</span>
    <span>{{ frontmatter.category }}</span>
    <span>难度 {{ frontmatter.difficulty }} 星</span>
    <span>{{ frontmatter.stage }}</span>
    <span>来源：{{ frontmatter.source }}</span>
  </div>
  <div class="detail-tags">
    <span v-for="tag in frontmatter.tags" :key="tag">{{ tag }}</span>
  </div>
</template>

