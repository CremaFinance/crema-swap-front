import type { NavigationGuard } from 'vue-router'
export type MiddlewareKey = "detail"
declare module "/Users/huangenzi/Desktop/work/cetus-app/node_modules/nuxt/dist/pages/runtime/composables" {
  interface PageMeta {
    middleware?: MiddlewareKey | NavigationGuard | Array<MiddlewareKey | NavigationGuard>
  }
}