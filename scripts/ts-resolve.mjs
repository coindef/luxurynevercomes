/**
 * 让 node 直接 import 项目里的 .ts 源文件（脚本要用真实的 PRODUCTS / maisonOf，
 * 而不是把逻辑再抄一份——抄一份迟早和源文件走散）。
 *
 * node 自己会剥类型，但不认 Vite 那种省略扩展名的相对导入（`./products`），
 * 这个 hook 只补扩展名，别的交还给默认解析。
 *
 * 用法：node --import ./scripts/ts-resolve.mjs scripts/xxx.mjs
 */
import { registerHooks } from 'node:module'
import { existsSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith('.') && !/\.[cm]?[jt]sx?$/i.test(specifier)) {
      const resolved = fileURLToPath(new URL(specifier, context.parentURL))
      for (const candidate of [`${resolved}.ts`, `${resolved}.tsx`, `${resolved}/index.ts`]) {
        if (existsSync(candidate)) return { url: pathToFileURL(candidate).href, shortCircuit: true }
      }
    }
    return nextResolve(specifier, context)
  },
})
