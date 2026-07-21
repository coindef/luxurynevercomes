# CLAUDE.md

「LuxuryNeverComes」——模拟认购奢侈品治愈「买不起」的纯前端 SPA。
「买了个寂寞 · ParcelNeverComes」的奢侈品姊妹站（同架构不同气质）。

- **界面语言：英文**（用户于 2026-07 要求全站英文化）。1009 件商品名/描述/销量、
  管家剧本、定制项、所有页面 UI 均为英文 deadpan。**内部数据键仍是中文**
  （`product.category`、`CATEGORY_CUSTOM`/`CATEGORY_GRADIENTS`/`maisons` 的分类键），
  显示层经 `CATEGORY_LABELS`/`catLabel()` 映射为英文——改文案时别动这些键。
  文案禁用 em-dash（`—`/`–`，英文 AI 破绽）；中文注释里的 `——` 无所谓
- **品牌屋（maison）**：`src/lib/maisons.ts` 定义 45 家**虚构**奢侈品牌屋（各有名字/人格/身世/专营系列），
  `maisonOf()` 优先分给专营其系列的屋（`series` 亲和），无专营再全品类稳定哈希均衡。The Houses 导览页（`/maisons`）+
  单屋页（`/maison/:id`）实现「按店面逛」，与品类筛选并存（双维度）。
  **严禁用真实品牌名做店面**（LV/Dior/Hermès……）——触碰红线且属商标侵权/品牌冒充

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
- **定制体系**：选项数据在 `src/lib/bespoke.ts`，一律经 `customFor()` 取（子品类优先，别直查表）。
  **工坊是少数商品的例外，不是人人有份**：`bespokeOffered()` 按 id 稳定开放 ~40%，
  配货旗舰一律不开放（实测真店越镇店的款越没得配；Patek/AP 连配置器都没有）。
  「唯一的那个决定」用 `role: 'size'` 声明，不从定价推断；刻字/烫印一律 complimentary
  （Cartier/LV/Burberry 皆免费），只有改动实体画布的项才保留加价（金箔船名、界石刻字等）。
  刻了字 = final sale：详情页退货文案会换（全店唯一不可撤销的，是退回那份不存在的权利）；
  类型在 types.ts（`CustomGroup`：choice 带展示性 surcharge / text 限 12 字）。
  定制数据流：详情页选择 → CartItem.customization → OrderItem.customization →
  小票 `ReceiptBespoke`（加价与减免互相抵消）→ 订单定制档案 → 物流剧场插入工坊节点
- **管家剧本**：`copy.ts` 的 `TRACKING_SCRIPT`（9 级按真实时间解锁）；
  有定制时 Orders 页 Timeline 会在 36h 处插入 `BESPOKE_TRACKING_TEXT` 节点
- **系列（série）**：`src/lib/series.ts` 在品类之下再分一层（每品类 3-7 个系列，共 47 个：
  高定分晚装/西装/鞋/帽手套/针织/丝巾/试衣间……），`seriesOf()` 按子品类+关键词判定。
  目录页品类内按系列成厅 + 系列 chips（`?series=`），详情页面包屑到系列级。改名字关键词时跑一遍分布脚本防空厅
- **商品**：`products.ts` ~1009 件（10 分类各约 100，`RAW_PRODUCTS` 数组 → 套 `QUOTA_RULES` 得 `PRODUCTS`），
  `SALON_PRODUCTS` 取每分类最贵一件。价格对标真实世界行情，全位数千分位；`p()` 第 9 位可选 `easterEgg`
- **配货流程**：`QUOTA_RULES`（id → 需累计守住的额度）给顶级热门款设门槛（`Product.quota`）。
  台账就是 store 的 `saved`（历史订单总额）。详情页 `saved < quota` 时门控认购，CTA 变「去配货」，
  显示「已配 / 门槛」与极细进度线。核心笑点：配货本身也 ¥0.00——反复花 ¥0.00 换取花 ¥0.00 的资格
- **商品图**：主图 `public/img/lx-<slug>.jpg`，其余视角 `-v2` / `-v3`
  （**不是 `-2`**：商品 id 里有 `lx-mini-sub-2` 这种，会和别人的第二视角撞文件名）。
  哪件有几张是 `src/lib/imageManifest.ts` 说了算（构建期生成，已提交），
  组件一律走 `viewsOf(product)`，别再靠 `<img>` 撞 404 兜底——九成商品没图，那是九百个必然失败的请求。
  无图/加载失败回退「拍卖图录展签」（分类丝绒渐变 + 细银线框 + emoji，`plaque` 属性附图录小字），
  所以缺图不是错误。注意：线框**只画在兜底展签上**，真实照片裸排不加框
- **图录画廊**：`ProductGallery` 给详情页排 2-3 个视角（原生 scroll-snap + 缩略图，
  只有一个视角时整套控件消失）。视角小字（Full view / Reverse / From above……）按分类走
  manifest 里的 `VIEW_CAPTIONS`，与生成脚本里的视角一一对应
- **配图流水线**：`npm run images`（Flux via Pollinations，免费无 key）→ `npm run images:manifest`。
  可随时 Ctrl-C，重跑自动续跑。**限速是硬约束**：匿名档每 IP 只允许 1 并发，实测稳定在
  ~40s/张（换 turbo 也一样，限的是 IP 不是算力），1009 件 × 3 视角 ≈ 32 小时，跑不完是常态。
  提示词的四条铁律写在 `scripts/art-direction.mjs` 文件头，**每条都是踩坑踩出来的，别想当然改**：
  同一件商品三视角**共用一个 seed**（否则画的是三个不同的包）、视角短语**必须打头**、
  绝不出现 hand/people 这类名词（扩散模型不会否定，只会照画：写 "hand stitching" 就伸进来一只手）、
  只做整体视角**不做微距**（把细节写成主语，模型会丢掉商品本体：包扣微距画出一枚钻戒）。
  真人拍的照片（Unsplash / CC BY，见 `scripts/ai-sourced.json` 之外的 id）**不许被 AI 图覆盖**；
  商品本身是「一个人」的（管家/教练/主厨）一律不生成，交给展签——画出来必然是张人脸，是硬否决
- **开本 3:4 是硬约束，「主体占画幅 ≥75%」也是**：全站每个藏品图框都是 `aspect-[3/4]`，
  生成图原生 525×700，所以零裁切。早期那批真实照片是横构图（900×506 等），塞进 3:4 会被裁掉大半
  （一顶冠冕只剩中间 20% 的宽度），补边又会把主体补得很小——
  **补边是拿「被裁掉」换「变得很小」，两头都不讨好**：900×506 补成 3:4，照片只占画幅 42%，
  而原生 3:4 的生成图主体能占 44%+。同一排格子里主体差 2.2 倍，在整齐的网格里就是「比例不对」。
  判据：`原比例>0.75 时 fill=0.75/原比例`，**fill < 75% 的一律重画，不要补边**
  （`npm run images:aspect` 只伺候 fill ≥ 75% 的，那种补边看不出来）。
- **「真实照片优先于 AI」这条要打个补丁**（2026-07-16 用户拍板）：只在照片**装得进 3:4** 时成立。
  一张填不满画幅 42% 的横构图，不如一张为 3:4 构的生成图——已按此重画 28 张，
  署名随照片一起删（CC BY / CC BY-SA 的义务跟着照片走，不跟着商品）。
  改 credits.ts 时**别用数据拼正则**，按字面量匹配 id；曾经用 `node -e '...'` 内联 JS，
  单引号被 bash 吃掉、`${id}` 变成空的 shell 变量，正则退化成「匹配任意 productId 行」，
  一次删光了 22 条署名（含仍在使用的 CC BY 图）。
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
3. 配图跑 `npm run images`（会自动排到队里，按可见度优先）→ `npm run images:manifest` →
   Read 目检（无品牌字、无人手人脸、主体清晰）。真实照片仍优先于 AI：
   Unsplash 找得到棚拍级好图就手动放，并补 credits.ts（CC BY/BY-SA 必须署名）；
   都没有就不放图，展签兜底
4. DESIGN.md 是设计唯一事实源，改文案体系时同步

## 其他

- **对外身份**：站点地址常量在 `src/lib/site.ts`（分享卡、赠礼链接、心愿单链接都从它拼）；
  `index.html` 里 og:image / og:url 是写死的绝对地址（爬虫不解析相对路径）。**换自定义域名改这两处。**
  注意本站是纯 SPA、所有路由共用一份 HTML，分享出去的任何链接都用同一张 og 卡（`public/og-card.jpg`）；
  要做每件商品各自的分享卡需要 SSR/边缘中间件，属于之后的架构题
- **分享卡**：`src/lib/shareCard.ts` 手绘 canvas（1080×1350 竖幅），三张：鉴定证书（深）、
  书面价格确认（纸白）、本月小结（纸白+绿）。零依赖，别引 html2canvas
- **赠礼链接**：`/?gift=<id>&from=<name>` 纯 URL 零后端，接受即 placeOrder 入账；
  心愿单分享 `/collection?ids=a,b,c` 同理

- 手机宽度容器（#root 480px 居中），吸底元素留 padding-bottom
- 详情/结算页无 TabBar（自带吸底操作栏），路由分组见 App.tsx
- 姊妹站仓库：github.com/coindef/parcelnevercomes（改共享概念时注意两站一致性）
