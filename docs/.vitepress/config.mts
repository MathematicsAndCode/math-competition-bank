import { defineConfig } from 'vitepress'
import mathjax3 from 'markdown-it-mathjax3'

export default defineConfig({
  lang: 'zh-CN',
  title: '数学竞赛题库',
  description: '可检索、可筛选、可持续维护的数学竞赛题库',
  base: '/math-competition-bank/',
  cleanUrls: true,
  lastUpdated: true,
  vite: {
    server: { allowedHosts: ['terminal.local'] }
  },
  head: [
    ['meta', { name: 'theme-color', content: '#2457d6' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }]
  ],
  markdown: {
    config(md) {
      md.use(mathjax3)
    }
  },
  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: '首页', link: '/' },
      { text: '浏览题库', link: '/problems/' },
      { text: '录入指南', link: '/guide/contribute' },
      { text: 'GitHub', link: 'https://github.com/MathematicsAndCode/math-competition-bank' }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/MathematicsAndCode/math-competition-bank' }
    ],
    footer: {
      message: '题目经审核后发布，欢迎通过 GitHub 参与维护。',
      copyright: '基于 VitePress 构建'
    },
    outline: { level: [2, 3], label: '本页目录' },
    docFooter: { prev: '上一篇', next: '下一篇' },
    lastUpdated: { text: '最后更新' },
    returnToTopLabel: '返回顶部',
    sidebarMenuLabel: '目录',
    darkModeSwitchLabel: '外观',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式'
  }
})

