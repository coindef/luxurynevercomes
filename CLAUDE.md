# CLAUDE.md

「富了个寂寞 · LuxuryNeverComes」——模拟认购奢侈品治愈「买不起」的纯前端 SPA。
「买了个寂寞 · ParcelNeverComes」的奢侈品姊妹站（同架构不同气质）。

## 常用命令

```bash
npm run dev        # 开发服务器
npm run build      # tsc -b && vite build，上线前必须通过
npm run lint       # oxlint
```

## 架构要点

- **技术栈**：Vite + React 19 + TS + Tailwind v4（颜色 token 在 `src/index.css` 的 `@theme` 定义：
  ink/panel/hairline/ivory/fog/gold/goldlit/jade，组件里直接用 `text-gold` `bg-panel` 等）
- **状态**：`src/lib/store.tsx`（Context + localStorage，键名空间 `flgj.*`，版本号 `flgj.v`）。
  购物车是**行 key 模型**：`lineKey = productId + 规范化定制串`，同商品不同定制各占一行——
  改动增删改购物车时必须用 `item.key`，不要用 productId
- **定制体系**：选项数据在 `src/lib/bespoke.ts`（`CATEGORY_CUSTOM`，按分类分配）；
  类型在 types.ts（`CustomGroup`：choice 带展示性 surcharge / text 限 12 字）。
  定制数据流：详情页选择 → CartItem.customization → OrderItem.customization →
  小票 `ReceiptBespoke`（加价与减免互相抵消）→ 订单定制档案 → 物流剧场插入工坊节点
- **管家剧本**：`copy.ts` 的 `TRACKING_SCRIPT`（9 级按真实时间解锁）；
  有定制时 Orders 页 Timeline 会在 36h 处插入 `BESPOKE_TRACKING_TEXT` 节点
- **商品**：`products.ts` 65 件（脚本生成后手工维护），`SALON_PRODUCTS` 取每分类最贵一件
- **商品图**：`public/img/lx-<slug>.jpg`；`ProductImage` 失败回退「拍卖图录展签」
  （分类丝绒渐变 + 细银线框 + emoji，`plaque` 属性附图录小字），所以缺图不是错误。
  注意：线框**只画在兜底展签上**，真实照片裸排不加框
- **图片美术方向（拍卖图录，不是 eBay 挂牌）**——图片也是设计系统的一部分，不是填空：
  背景只能中性（无缝白/灰/炭/黑/石材/木），**材质本色保留**（皮革棕、金属金、翡翠绿都对），
  **但禁止彩色背景布**（蜜桃粉/薄荷绿/电光蓝会和黑白体系打架，65 张各带一个色 = 集市而非殿堂）；
  棚拍/博物馆布光，单一主体，大留白，裁成 3:4 仍成立。
  硬否决：**可读品牌 logo/字标**（红线）、价签、店铺地面、手机快照/闪光灯、人脸、水印。
  判据一句话：**它得像佳士得的一个拍品**——店看起来越贵，¥0.00 越好笑
- **图源优先级**：Unsplash（棚拍级，免署名但仍记进 credits）> Openverse（质量天花板低，多是随手拍）。
  注意 Unsplash 图 ID 会失效，下载后必须 `file` 验真 + 尺寸 > 25KB，再 Read 目检
- **编辑配图**：`public/img/ed-*.jpg` 是全幅氛围图（工坊/橱窗/白手套/金库），
  用 `EditorialImage` 组件插在页面之间；**图缺失时整块自动消失**，不留空框
- **署名**：CC BY/BY-SA 图片必须同步 `src/lib/credits.ts`（渲染进 /about）

## 文案与视觉红线（重要）

- 调性 = deadpan 冷幽默 + 治愈。**自嘲"买不起"，绝不嘲讽用户，也不仇富**
- **商品名严禁出现真实品牌名**（爱马仕/劳力士/LV/NVIDIA……），一律品类描述式命名；
  图片里不能有可读的品牌 logo
- 视觉为「冷调单色」（Cold Luxury）：真纸白底（#fff，**不是奶油白**）+ 纯墨黑字 + 私人银行绿。
  **全站只有一个颜色：绿。** 绿只在省钱/安抚侧出现（实付 ¥0.00、已为你守住、账本）——
  整站黑白，只有笑点落地时才有颜色，这是品牌 DNA 也是这版设计的中心思想
- **古铜/金色已全站废除**（`--color-gold` / `--color-goldlit` token 已删除，别再引用）。
  暖奶油白 + 古铜 + 咖啡黑正是 LLM 生成奢侈品页面的默认配色，它让品牌隐形——这是本站上一版最像 AI 的地方
- **留白即奢侈，禁止加边框/角标/装饰**；主 CTA 用 .gold-cta（类名保留，现为墨黑实心），
  次级动作用 .quiet-link 下划线。真实照片一律裸排，不许加框（细银线框只属于兜底展签）
- **禁止 eyebrow 小标签**：标题上方那种全大写宽字距的拉丁小字（`Salon Privé`、`Bespoke · Atelier`）
  是最典型的 AI 排版签名，曾经每个 section 顶一个。现已清空，全站只剩 SiteNav 品牌字标一处。标题本身就够了
- **编辑式左对齐**，禁止满页居中。居中一切是模板签名；奢侈品编辑排版是左对齐 + 大留白
- 装饰性间隔号 `·` 已清除（改用中文逗号或换行）。但中文破折号 `——` 是合法标点，保留
- token 名沿用旧语义位（ink=页面底、ivory=主文字），值为浅色系——见 index.css @theme 注释；
  深色只允许出现在：黑卡本卡、鉴定证书、丝绒展签、照片上的浮层（这些必须用固定 hex，不要用 token；
  其上的箔色用**银**不用金：#c9c9c9 / #e8e8e8）
- 价格一律 `yuan()` 全位数千分位展开（¥120,000,000.00），**严禁缩写成"1.2 亿"**——
  逗号的长度就是多巴胺；¥0.00 与过亿价格用同一字体（`font-price`），对比即喜剧
- **对比度是硬红线**：正文/小字对底色 ≥ 4.5:1。`fog`(#6b6b6b) 已是可用的最浅灰（白底 5.33:1），
  **不许再调浅，也不许叠 `/60` `/70` 透明度**——本站小字多在 8-11px，
  「浅灰配近白底显得优雅」是最常见的可读性事故。深色面上的银色同理（#8f8f8f 是下限）
- 动效"昂贵地慢"：慢淡入、hover 图片 1.03 缓放，缓动一律用 `--ease-out-expo` / `--ease-out-quart`；
  **禁止弹跳/回弹/过冲**（scale 超过 1 再落回就是弹跳）、禁止呼吸灯/快闪/金光扫过
- 键盘可见焦点（`:focus-visible` 墨黑描边）是无障碍硬性要求，不是可选装饰，别删
- deadpan 反承诺放最小字号（法务小字层级），这是本店签名
- 参考文案风格见 `copy.ts` 与 DESIGN.md 文案总表

## 新增商品流程

1. `products.ts` 加 `p(...)`（id 用 `lx-` 前缀全小写 slug，价格符合奢侈品行情，
   originalPrice 为 1.2-1.8 倍——奢侈品折扣本身是笑点，别打狠折）
2. 该分类若无定制选项组，去 `bespoke.ts` 补一组（拟真为骨、荒诞为魂）
3. 配图走 Openverse（cc0/by/by-sa）→ `sips -Z 700` 压缩 → Read 目检（无品牌字、主体清晰）
   → CC BY 补 credits.ts；找不到合格图就不放图，展签兜底
4. DESIGN.md 是设计唯一事实源，改文案体系时同步

## 其他

- 手机宽度容器（#root 480px 居中），吸底元素留 padding-bottom
- 详情/结算页无 TabBar（自带吸底操作栏），路由分组见 App.tsx
- 姊妹站仓库：github.com/coindef/parcelnevercomes（改共享概念时注意两站一致性）
