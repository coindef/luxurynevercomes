# 买了个寂寞 · ParcelNeverComes

> 放开买，来的只有寂寞。——模拟购物，治愈消费冲动：**不扣钱，不发货，只发多巴胺。**

一个像素级认真的"假电商"：你可以尽情浏览、加购物车、庄严地支付 ¥0.00——多巴胺来自期待而非获得，
把购物的仪式感完整走一遍，冲动就被温柔地消化掉了。每一单的金额都会存进你的「省钱账本」。

灵感来自 [FoodNeverComes](https://foodnevercomes.com)（点一份永远不会送达的外卖），
属于同一波"多巴胺网站"（dopamine sites）。

## ✨ 核心体验

- 🛒 **完整的电商仪式**：秒杀倒计时（永远停在 00:59:XX）、"仅剩 3 件"（三年了，一直剩 3 件）、
  满减凑单进度条（凑满放烟花）、实时下单弹幕、新人 ¥888 无门槛券（面额随便印的）
- 💚 **¥0.00 支付仪式**：假指纹支付 → 绿色对勾 → 划线价翻转成 `+¥X 已存入省钱账本`。
  红色是仪式，绿色是真心
- 📦 **物流剧场**：包裹永远在路上。9 级物流剧本按真实时间逐日解锁，从"已揽收，称重完毕：0g"
  一路滑向"骑手遭遇哲学问题"，第 7 天终章"包裹已送达您心里，无需签收"。骑手·加缪可以无限催单
- 📒 **省钱账本**：累计守住金额、奶茶/机票换算、本月冲动次数小结、冲动来源的温柔记录（只陈述，不说教）
- 🕳️ **玄学好物**：量子快递盒、散装月光、前任的道歉·锦盒装、一整个春天（可选北方的/南方的/记忆里的）

## 🚀 快速开始

```bash
npm install
npm run dev        # http://localhost:5173
```

其他命令：

```bash
npm run build      # 类型检查 + 生产构建，产物在 dist/
npm run preview    # 本地预览生产构建
npm run lint       # oxlint
```

## 📦 部署

任意静态托管即可，无需后端：

- **Vercel**：导入仓库直接部署，[vercel.json](vercel.json) 已配置 SPA 回退与商品图长缓存
- **Netlify**：Publish directory 填 `dist`，[public/_redirects](public/_redirects) 已配置 SPA 回退
- **其他静态托管**：需将所有路径回退到 `index.html`（BrowserRouter 路由需要）

## 🗂 项目结构

```
src/
├── components/
│   ├── ErrorBoundary.tsx   # 全站错误兜底（"反正也不发货，你没有任何损失"）
│   ├── ProductCard.tsx     # 瀑布流商品卡
│   ├── ProductImage.tsx    # 真实商品图，加载失败回退 emoji 色块
│   ├── TabBar.tsx          # 底部导航（购物车角标）
│   └── Toast.tsx           # 全局轻提示
├── lib/
│   ├── copy.ts             # 全站文案池：物流剧本 / 催单回复 / 安抚语 / 会员等级
│   ├── credits.ts          # CC 授权图片署名（渲染进 /about）
│   ├── extraProducts.ts    # 扩容商品数据（生成文件）
│   ├── format.ts           # 金额 / 订单号 / 相对时间
│   ├── hooks.ts            # 倒计时 / 数字缓动 / 轮播 / 长按
│   ├── products.ts         # 核心商品数据 + 分类渐变
│   ├── store.tsx           # 购物车 / 订单 / 省钱账本（localStorage + 版本守卫）
│   └── types.ts
└── pages/
    ├── Home.tsx            # 商城首页：秒杀 / 金刚区 / 无限加载瀑布流
    ├── ProductDetail.tsx   # 详情页：弹幕 / 压迫条 / 好评如潮
    ├── Cart.tsx            # 购物车：满减凑单进度条
    ├── Checkout.tsx        # 结算 + ¥0.00 支付成功仪式
    ├── Orders.tsx          # 订单 + 物流剧场
    ├── Me.tsx              # 我的 + 省钱账本
    ├── About.tsx           # 关于本店 / 虚构声明 / 图片署名
    └── NotFound.tsx        # 404（"这个页面和你的包裹一样，并不存在"）
```

产品设计文档（页面结构、招牌时刻、文案总表、视觉方向）见 [DESIGN.md](DESIGN.md)。

## 🔒 数据与隐私

- 纯前端应用，**没有后端、不收款、不收货址、不收集任何个人信息**
- 购物车、订单、省钱账本全部存在浏览器 `localStorage`（"你的寂寞只存在这台设备上，我们看不到，也寄不出"）
- 数据结构带版本号（`jimo.v`），升级不兼容时安全清理
- 「我的 → 清空所有寂寞」可一键抹掉全部本地数据

## 🖼 商品图与授权

商品图为真实照片，本地存放于 `public/img/<商品id>.jpg`，加载失败自动回退 emoji 色块：

- 大部分来自 [Unsplash](https://unsplash.com)（Unsplash License，免署名）
- 部分来自 [Openverse](https://openverse.org) 检索的 CC0 / CC-BY / CC-BY-SA 图片，
  署名信息维护在 [src/lib/credits.ts](src/lib/credits.ts)，并在站内 [/about](src/pages/About.tsx) 页公示
- 新增商品图请遵守同样流程：确认授权 → 下载本地 → `sips -Z 700` 压缩 → CC 授权的补署名

## 🗺 路线图（V2 备选，见 DESIGN.md 完整清单）

- [ ] 深夜灯光模式（23 点后暖黑配色 + 深夜问候）
- [ ] 分享卡片生成（支付成功页 / 物流节点截图卡）
- [ ] 客服"小寂"完整话术树（"退您一声叹息：唉——已退"）
- [ ] 成就徽章墙（"穷追不舍""凑单大师""春天持有者"）
- [ ] 冲动急救按钮（60 秒深呼吸引导）
- [ ] 英文版 ParcelNeverComes 出海版

## 📄 许可

- 代码：[MIT](LICENSE)
- 图片：按各自来源授权（见上文）；"买了个寂寞 / ParcelNeverComes" 名称与文案©项目作者

## 🙏 致谢

- [FoodNeverComes](https://foodnevercomes.com) —— 概念先行者，本项目是它的精神姊妹站
- 所有在深夜清空又清空购物车的人
