import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import ProblemBank from './components/ProblemBank.vue'
import ProblemMeta from './components/ProblemMeta.vue'
import './styles.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('ProblemBank', ProblemBank)
    app.component('ProblemMeta', ProblemMeta)
  }
} satisfies Theme

