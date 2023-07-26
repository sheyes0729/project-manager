import { resolve } from 'path'
import { defineConfig, defineViteConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
import autoImport from 'unplugin-auto-import/vite'
import vueComponents from 'unplugin-vue-components/vite'
import pages from 'vite-plugin-pages'
import layouts from 'vite-plugin-vue-layouts'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        input: resolve(__dirname, 'electron/main/index.ts')
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        input: resolve(__dirname, 'electron/preload/index.ts')
      }
    }
  },
  renderer: defineViteConfig(({ mode }) => {
    const isProd = mode === 'production'
    return {
      root: '.',
      resolve: {
        alias: {
          '@renderer': resolve('src')
        }
      },
      plugins: [
        vue(),
        pages({
          dirs: resolve(__dirname, 'src/views'),
          routeBlockLang: 'json5'
        }),
        layouts({
          importMode: () => 'async'
        }),
        autoImport({
          imports: ['vue', '@vueuse/core', 'pinia', 'vue-router'],
          dts: resolve(__dirname, 'src/typings/auto-import.d.ts'),
          eslintrc: {
            enabled: false
          }
        }),
        vueComponents({
          dts: resolve(__dirname, 'src/typings/vue-components.d.ts'),
          dirs: [resolve(__dirname, 'src/components/common')]
        })
      ],
      esbuild: {
        drop: ['console', 'debugger']
      },
      build: {
        assetsInlineLimit: 8196,
        minify: isProd ? 'esbuild' : false,
        sourcemap: !isProd,
        emptyOutDir: true,
        rollupOptions: {
          input: resolve(__dirname, 'index.html'),
          output: {
            chunkFileNames: 'js/[name]-[hash].chunk.js',
            entryFileNames: 'js/[name]-[hash].entry.js'
          }
        }
      }
    }
  })
})
