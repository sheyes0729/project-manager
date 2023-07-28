/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'vue3-eventbus' {
  type EventType = (name: string, handler?: (...args) => void) => void
  const on: EventType
  const emit: (name: string, data?: any) => void
  const off: EventType
  const once: EventType

  export { on, emit, off, once }
}
