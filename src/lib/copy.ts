/** 全站文案池 —— 金色是橱窗，绿色是真心 */

export const SLOGAN = '今晚，钱不是问题——因为我们不收。'
export const SLOGAN_EN = 'Finally affordable. Forever undelivered.'
export const SUB_SLOGAN = '免排队 · 免配货 · 免验资。本店众生平等：一律 ¥0.00，一律不发货。'

export const SEARCH_PLACEHOLDERS = [
  '搜什么都买得起',
  '大家都在搜：财务自由、游艇、下辈子',
  '搜「铂金包」——不用配货的那种',
  '搜「游艇」——反正也不停你家楼下',
]

export const MARQUEE_CITIES: { city: string; spot: string }[] = [
  { city: '上海', spot: '外滩源' },
  { city: '北京', spot: '国贸三期' },
  { city: '深圳', spot: '湾区一号' },
  { city: '杭州', spot: '西湖边' },
  { city: '成都', spot: '麓湖' },
  { city: '香港', spot: '半山' },
  { city: '新加坡', spot: '滨海湾' },
  { city: '苏州', spot: '金鸡湖' },
]

/** 白手套管家配送剧本：按下单后的真实时间解锁 */
export interface TrackingNode {
  offsetMs: number
  label: string
  text: string
}

const H = 3600_000
const D = 24 * H

export const TRACKING_SCRIPT: TrackingNode[] = [
  { offsetMs: 0, label: '已接单', text: '您的白手套管家已接单，正在熨手套。货不急，礼数不能省。' },
  { offsetMs: 2 * H, label: '已揽收', text: '三位老师傅完成打包：缎面、丝带、火漆封蜡。称重：0g。老师傅说，好东西都很轻。' },
  { offsetMs: 1 * D, label: '护送中', text: '您的订单已由双人护送团队自日内瓦启程，全程佩戴白手套，随行还有一位专职开门的先生。' },
  { offsetMs: 2 * D, label: '护送中', text: '护送团队在阿尔卑斯山口停了下来。管家说雪太好了，替您多看了半小时。这半小时记在服务里，不收费。' },
  { offsetMs: 3 * D, label: '护送中', text: '您的订单已入驻瑞士保税仓恒温恒湿静养：湿度 55%，安保三班倒。它目前过得比我们所有人都好。' },
  { offsetMs: 4 * D, label: '派送中', text: '私人飞机已就位。机长在等一个配得上这批货的天气。今天的云，差一点意思。' },
  { offsetMs: 5 * D, label: '派送中', text: '天气等到了。机长看了看万里无云的天空，说这么好的天应该留给飞行本身。他绕场三圈，很尽兴，未装货。' },
  { offsetMs: 6 * D, label: '派送中', text: '管家已抵达您所在的城市，正在寻找一副与您家门铃相称的新手套。现有的十二副，他都不满意。' },
  { offsetMs: 7 * D, label: '已送达', text: '管家鞠躬告退：货没有到，但请放心——您想要它时的样子，比它贵。它已入驻您心里的陈列室，恒温恒湿，永不折旧。无需签收。' },
]

/** 定制订单专属节点（有定制信息时插入） */
export const BESPOKE_TRACKING_TEXT = '刻字师傅刻到一半，去看了场日落。他说，笔画里要有光。'

/** 摇铃唤管家（催单）回复池 */
export const BUTLER_REPLIES = [
  '先生/女士，在我们这个行业，「急」是不体面的。您的耐心已记入贵宾档案。',
  '您摇铃的这一下，我们已用银托盘呈报船长。船长表示已阅。船未动。',
  '已为您升级「优先不发货」服务：您的等待将被加急处理，不另收费。',
  '好消息：在全球所有未发货订单中，您的排名第一。',
  '铃声很好听。管家说，这是今天庄园里唯一的声音。谢谢您。',
  '好的东西值得等。等不到的东西，值得等更久。',
]

/** 冲动来源 chips */
export const URGE_CHIPS = ['刷到明星同款', '被同事的包闪到', '看了富豪纪录片', '年终奖到账了', '年终奖没到账', '想知道有钱什么感觉']

export const SOOTHING_BY_URGE: Record<string, string> = {
  被同事的包闪到: '下次她背它来，你可以在心里轻轻说一句：我也有。声音不用太大。',
  想知道有钱什么感觉: '大概就是刚才那样：看中，下单，不心疼。核心体验，你已经用过了。',
  年终奖没到账: '年终奖会到的。在它到之前，你已经先富为敬了。',
  看了富豪纪录片: '纪录片里的他们也是这么下单的：看中，点头，不看价格。刚才你的流程一模一样，还快一些。',
  刷到明星同款: '同款已入手。明星那件要配货，你这件连货都免了，更纯粹。',
  年终奖到账了: '奖金还是完整的。排面也到位了。两头都赢，这很老钱。',
}

export const SOOTHING_GENERIC = [
  '拥有一件东西最快乐的部分，是决定拥有它的那一刻。刚才，你已经全额体验过了。',
  '钱没来过，心动来过，踏实留下了。',
  '看中，下单，不心疼。这套流程，你已经和他们一模一样了。',
]

export const REVIEWS = [
  { user: '匿*贵宾', stars: 5, text: '游艇还没到，但我已经开始拒绝周末加班了——船随时可能到，我得留出时间。' },
  { user: '半*山', stars: 5, text: '在这买了三年包，没配过一次货，没花过一分钱，柜姐每天都对我微笑。这是我离体面最近的一次。' },
  { user: '陈*姐', stars: 5, text: '把公司楼下的算力集群买了。开会时看着窗外，心里有底了。' },
]

export const EMPTY_CART = '珍藏夹空空如也。空着也好——顶级买手店的橱窗，越空越贵。'
export const EMPTY_ORDERS = '还没有订单。第一次富，建议从名片夹开始：富过一次，后面就顺了。'
export const PRIVACY_FOOTER = '您的富贵只存在这台设备上。我们看不到，亲戚也看不到。本店所有商品均为限量发售，限量：0 件。© 富了个寂寞 MAISON ZÉRO —— 均价过亿，分文不取。'
export const CONFIRM_RECEIPT_HINT = '一只白手套轻轻覆上按钮：「让它在路上吧。在路上的它，谁也拿不走。」'
export const SERVICE_BAR = ['全球联保（无物可修）', '专柜同源（专柜也没见过它）', '白手套配送（手套是真的）']

/** 首付账本折算参照物 */
export const CONVERSIONS: { unit: string; price: number; suffix?: string }[] = [
  { unit: '套一线城市首付', price: 2_000_000 },
  { unit: '年不吃不喝的工资', price: 150_000, suffix: '（现在可以吃了）' },
  { unit: '杯奶茶', price: 18 },
  { unit: '次提前还清房贷', price: 1_000_000 },
]

/** 旧订单回访文案 */
export function revisitLine(days: number): string | null {
  if (days >= 30) return `这单已陪你 ${days} 天。当晚的心动是真的，现在的不需要也是真的。两样都是真的，两样都挺好。`
  if (days >= 7) return `这单已陪你 ${days} 天。管家昨天鞠躬告退了，你今天照常上班。你们都很体面。`
  if (days >= 3) return `这单已陪你 ${days} 天。还会想它，很正常，它毕竟值一套房。`
  return null
}

/** 会员等级：按下单次数 */
export function memberLevel(orderCount: number): string {
  if (orderCount >= 50) return '老钱 · 从容到不问价'
  if (orderCount >= 20) return '世家 · 柜姐见您直接上香槟'
  if (orderCount >= 5) return '藏家 · 您的品位已建档'
  return '新贵 · 初次富，礼数全给您'
}

/** 工坊定制文案 */
export const BESPOKE = {
  title: '工坊定制 · BESPOKE',
  subtitle: '每一件都独一无二，每一件都不会来。',
  intro: '以下选项参照百年高定传统拟定。工匠是虚构的，工序一道没省。',
  baseTag: '工坊基准 · 已含在 ¥0.00 内',
  textHelper: '限 12 字，手工镌刻，不可撤销。这些字会被认真对待——它们是全流程里唯一真实存在的部分。',
  completeLine: '定制档案已完整。全球仅此一件，也仅此不发一件——工坊即刻开始，庄严地不制作。',
  skipLine: '本色出厂 · 素面朝天，也是一种高级。',
  footnote: '本工坊的工匠、工序与等待均为虚构；所有加价庄严地不收。您刻的字，和您省下的钱，是真的。',
  successLine: '您的定制档案已郑重存入工坊金库，与其他 0 件成品陈列在一起。',
  receiptHeader: '—— 高级定制 ——',
}

export function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}
