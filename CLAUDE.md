# CLAUDE.md

「买了个寂寞 · ParcelNeverComes」——模拟购物治愈消费冲动的纯前端 SPA。
用户可浏览/加购/支付 ¥0.00，商品永不发货，金额存入"省钱账本"。

## 常用命令

```bash
npm run dev        # 开发服务器 (5173)
npm run build      # tsc -b && vite build，上线前必须通过
npm run lint       # oxlint
```

## 架构要点

- **技术栈**：Vite + React 19 + TS + Tailwind v4（`@tailwindcss/vite` 插件，无 tailwind.config）+ React Router 7
- **无后端**：所有状态在 `src/lib/store.tsx`（Context + localStorage）。
  数据版本号 `jimo.v` 在 store.tsx 模块顶部——改动持久化数据结构时递增它，旧数据会被安全清理
- **商品数据**：`products.ts`（核心 30 个，手工维护）+ `extraProducts.ts`（扩容商品，脚本生成，
  不含 image/gradient 字段——由 products.ts 合并时按 `/img/<id>.jpg` 和分类渐变统一补齐）
- **商品图**：`public/img/<商品id>.jpg`。`ProductImage` 组件负责加载失败回退 emoji 渐变色块，
  所以缺图不算错误。CC 授权图片的署名必须同步维护 `src/lib/credits.ts`（渲染进 /about 页）
- **物流剧场**：`copy.ts` 的 `TRACKING_SCRIPT`，9 级节点按订单 `createdAt` + offset 真实时间解锁

## 文案红线（重要）

- 调性 = deadpan 冷幽默 + 治愈。**自嘲处境，绝不嘲讽用户**（不说"剁手党没救了"这类话）
- "不发货/寂寞"梗最多占商品描述的 1/3，其余用生活观察式幽默，避免梗疲劳
- 双色语义：**红橙 = 电商仪式（促销侧，动效可以浮夸）；绿色 = 真心（省钱/安抚侧，动效克制）**。
  不要把绿色用在促销元素上，反之亦然
- 参考文案风格见 `copy.ts` 与 DESIGN.md 文案总表

## 新增商品流程

1. 图片：优先 Openverse API 搜 CC0/CC-BY（`curl -sG "https://api.openverse.org/v1/images/" --data-urlencode "q=..."`），
   下载到 public/img/ 后 `sips -Z 700` 压缩，**必须用 Read 工具目检图片主体与商品匹配、无水印**
2. 数据：核心商品加在 products.ts，批量扩容走 extraProducts.ts
3. CC-BY/BY-SA 图片补 credits.ts 署名
4. id 唯一且全小写（扩容商品带分类前缀，如 `sp-yogamat`）

## 其他

- 手机宽度容器（#root max-width 480px 居中），新页面记得给吸底元素留 padding-bottom
- 详情页/结算页不显示 TabBar（有自己的吸底操作栏），路由在 App.tsx 分两组
- DESIGN.md 是产品设计的唯一事实源（页面结构/招牌时刻/文案总表/V2 清单）
