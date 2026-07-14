import type { CustomGroup } from './types'

/** 工坊定制 BESPOKE：按分类分配的定制选项体系 */
export const CATEGORY_CUSTOM: Record<string, CustomGroup[]> = {
  腕表珠宝: [
    {
      label: '表盘 · Le Cadran',
      type: 'choice',
      choices: [
        { name: '银白素面盘（工坊基准）', surcharge: 0 },
        { name: '砂金石 · 整夜星空', surcharge: 66000 },
        { name: '大明火珐琅 · 十二次窑火，成品率与发货率持平', surcharge: 88000 },
        { name: '陨石盘 · 附陨落证明', surcharge: 128000 },
      ],
    },
    {
      label: '复杂功能 · Les Complications',
      type: 'choice',
      choices: [
        { name: '万年历 · 可精确显示等待的第 10,000 天', surcharge: 380000 },
        { name: '三问报时 · 问三遍也不告诉您发货时间', surcharge: 580000 },
        { name: '月相盈亏 · 与您窗外那颗实时同步', surcharge: 180000 },
        { name: '停秒装置 · 秒针永远停在您下单那一刻', surcharge: 88000 },
      ],
    },
    {
      label: '镌刻底盖 · La Gravure',
      type: 'text',
      placeholder: '例：此刻已是永恒',
      choices: [
        { name: '手工镌刻于蓝宝石底盖内侧，平时只有机芯看得见，现在机芯也看不见', surcharge: 8800 },
      ],
    },
  ],
  包袋皮具: [
    {
      label: '皮革臻选 · La Peau',
      type: 'choice',
      choices: [
        { name: 'Togo 小牛皮 · 锡器灰（工坊基准）', surcharge: 0 },
        { name: 'Epsom 掌纹小牛皮 · 白垩', surcharge: 12000 },
        { name: 'Barenia 马鞍革 · 金棕，会随岁月养出光泽，岁月见不到它是另一回事', surcharge: 46000 },
        { name: '雾面尼罗鳄 · 午夜蓝', surcharge: 380000 },
        { name: '概念皮 · 由纯粹概念构成，零克重、零磨损、零存在', surcharge: 1280000 },
      ],
    },
    {
      label: '五金 · Les Métaux',
      type: 'choice',
      choices: [
        { name: '钯金扣（工坊基准）', surcharge: 0 },
        { name: '拉丝玫瑰金扣', surcharge: 26000 },
        { name: '马蹄印特别订单章 · 工坊最高礼遇：承认这只包专为您一人不做', surcharge: 88000 },
        { name: '无金 · 五金全部拆除，减法比加法贵，这很奢侈品', surcharge: 188000 },
      ],
    },
    {
      label: '烫印内衬缩写',
      type: 'text',
      placeholder: '您的缩写，或想烫的一句话（12 字内）',
      choices: [
        { name: '山羊皮内衬手工烫金，一位工匠全程负责，全程约 0 小时', surcharge: 8800 },
      ],
    },
  ],
  尊贵座驾: [
    {
      label: '车漆与腰线 · La Robe',
      type: 'choice',
      choices: [
        { name: '单色经典 · 英国绿（工坊基准）', surcharge: 0 },
        { name: '手绘腰线 · 松鼠毛笔一次成型，画师屏息三小时，成品零公里', surcharge: 68000 },
        { name: '取色定制 · 与您的口红同色', surcharge: 188000 },
        { name: '量子色 · 被观测时才决定颜色', surcharge: 888000 },
      ],
    },
    {
      label: '星空顶篷 · Starlight',
      type: 'choice',
      choices: [
        { name: '无星空 · 仰望自备（工坊基准）', surcharge: 0 },
        { name: '1,344 颗光纤标准星空', surcharge: 480000 },
        { name: '您出生当晚的星图', surcharge: 680000 },
        { name: '含每小时一颗流星 · 许愿功能正常，兑现机制与本店一致', surcharge: 880000 },
      ],
    },
    {
      label: '刺绣头枕',
      type: 'text',
      placeholder: '例：又是充实的一天',
      choices: [
        { name: '每只头枕 5,000 针，绣错重来，反正来不了', surcharge: 26000 },
      ],
    },
  ],
  游艇航空: [
    {
      label: '甲板与坪位 · Le Pont',
      type: 'choice',
      choices: [
        { name: '珍珠白标准甲板（工坊基准）', surcharge: 0 },
        { name: '缅甸柚木整层 · 可赤脚行走三十年，潮湿的部分由想象负责', surcharge: 2400000 },
        { name: '不铺甲板 · 海风应该直接吹在龙骨上', surcharge: 1880000 },
        { name: '直升机停机坪', surcharge: 6800000 },
        { name: '不设停机坪 · 直升机自己想办法（本项免费，我们也很意外）', surcharge: 0 },
      ],
    },
    {
      label: '航程偏好 · L\'Itinéraire',
      type: 'choice',
      choices: [
        { name: '环地中海经典线（工坊基准）', surcharge: 0 },
        { name: '只飞日落方向 · 永远追着黄昏', surcharge: 2600000 },
        { name: '巡航不落地 · 落地是一种妥协', surcharge: 5200000 },
        { name: '停在母港保值 · 母港一栏我们填了：心里', surcharge: 880000 },
      ],
    },
    {
      label: '鎏金命名 · 船名/机身',
      type: 'text',
      placeholder: '例：还在加班号',
      choices: [
        { name: '24K 金箔手工贴制于船艉或机身，名字先漂着，船永不下水', surcharge: 188000 },
      ],
    },
  ],
  不动产: [
    {
      label: '朝向甄选 · L\'Orientation',
      type: 'choice',
      choices: [
        { name: '朝东 · 主看日出', surcharge: 8800000 },
        { name: '朝西 · 主看日落', surcharge: 8800000 },
        { name: '朝内 · 主看自己', surcharge: 12000000 },
        { name: '全朝向 · 岛是圆的，本来就四面环海', surcharge: 18000000 },
      ],
    },
    {
      label: '园景配套 · Les Jardins',
      type: 'choice',
      choices: [
        { name: '天然椰林（工坊基准）', surcharge: 0 },
        { name: '无边泳池 · 与海平线接缝处误差小于 3 毫米', surcharge: 2200000 },
        { name: '定制涨潮 · 避开您的午睡', surcharge: 2200000 },
        { name: '白色灯塔 · 为永不抵达的船常年亮着，本店精神图腾', surcharge: 3600000 },
      ],
    },
    {
      label: '命名权 · 宅邸/岛屿',
      type: 'text',
      placeholder: '例：勿扰岛',
      choices: [
        { name: '您的命名将登记于一张我们认真打印的地契上——本次交易中最接近不动产的部分', surcharge: 88000 },
      ],
    },
  ],
  艺术收藏: [
    {
      label: '装裱 · L\'Encadrement',
      type: 'choice',
      choices: [
        { name: '素框原木（工坊基准）', surcharge: 0 },
        { name: '意大利手工金箔框 · 三代传人贴制', surcharge: 66000 },
        { name: '博物馆级防紫外线玻璃 · 保护它不存在的颜料', surcharge: 128000 },
        { name: '不装裱 · 让艺术呼吸（减法照例更贵）', surcharge: 188000 },
      ],
    },
    {
      label: '出处档案 · La Provenance',
      type: 'choice',
      choices: [
        { name: '标准真品证书（工坊基准）', surcharge: 0 },
        { name: '前藏家名录 · 位位显赫，且均不知情', surcharge: 88000 },
        { name: '拍卖流传记录 · 含两次流拍，更显沧桑', surcharge: 168000 },
        { name: '艺术家亲签 · 艺术家是虚构的，签名是认真的', surcharge: 288000 },
      ],
    },
    {
      label: '藏家铭牌刻字',
      type: 'text',
      placeholder: '例：私人收藏 · 非卖品',
      choices: [
        { name: '黄铜铭牌手工錾刻，将挂在您想象中的那面墙上', surcharge: 8800 },
      ],
    },
  ],
  科技算力: [
    {
      label: '散热方案 · Le Refroidissement',
      type: 'choice',
      choices: [
        { name: '风冷 · 复古机房轰鸣（工坊基准）', surcharge: 0 },
        { name: '浸没式液冷 · 整机泡澡，安静如深海', surcharge: 8800000 },
        { name: '山泉水冷 · 水源须自备一座山', surcharge: 28000000 },
        { name: '情绪冷却 · 机器不发热，您也别上头', surcharge: 880000 },
      ],
    },
    {
      label: '互联规格 · L\'Interconnexion',
      type: 'choice',
      choices: [
        { name: '标准高速互联（工坊基准）', surcharge: 0 },
        { name: '全光互联 · 延迟低到没时间后悔', surcharge: 12800000 },
        { name: '量子纠缠直连 · 与另一半集群心有灵犀，那半也不发货', surcharge: 88000000 },
      ],
    },
    {
      label: '机柜铭牌',
      type: 'text',
      placeholder: '例：算力自由 1 号',
      choices: [
        { name: '钛板激光蚀刻，挂在您想象中的机房门口', surcharge: 88000 },
      ],
    },
  ],
  运动竞技: [
    {
      label: '座席礼遇 · La Loge',
      type: 'choice',
      choices: [
        { name: '主看台正中（工坊基准）', surcharge: 0 },
        { name: '球员通道口 · 与传奇擦肩', surcharge: 680000 },
        { name: '更衣室隔壁 · 听得见中场战术', surcharge: 1280000 },
        { name: '裁判视角 · 全场最不受欢迎的位置', surcharge: 88000 },
      ],
    },
    {
      label: '应援规格 · Le Soutien',
      type: 'choice',
      choices: [
        { name: '安静欣赏（工坊基准）', surcharge: 0 },
        { name: '私人解说一名 · 只对您一人激动', surcharge: 268000 },
        { name: '包下整面看台的人浪 · 按您的节奏起伏', surcharge: 2880000 },
      ],
    },
    {
      label: '球衣印名',
      type: 'text',
      placeholder: '例：只看不练',
      choices: [
        { name: '官方同厂热压印字，号码永远是 0', surcharge: 8800 },
      ],
    },
  ],
  酒窖餐桌: [
    {
      label: '侍酒规格 · Le Service',
      type: 'choice',
      choices: [
        { name: '标准醒酒两小时（工坊基准）', surcharge: 0 },
        { name: '首席侍酒师全程 · 只斟半杯，斟多显穷', surcharge: 188000 },
        { name: '盲品模式 · 标签全部撕掉，喝的就是自信', surcharge: 88000 },
        { name: '月光下醒酒 · 须等农历十五，急不来', surcharge: 280000 },
      ],
    },
    {
      label: '配餐编制 · L\'Accord',
      type: 'choice',
      choices: [
        { name: '经典法餐九道（工坊基准）', surcharge: 0 },
        { name: '主厨即兴 · 菜单当场作废，惊喜当场发生', surcharge: 680000 },
        { name: '一碗白米饭 · 顶配的东西配最朴素的，才叫吃过', surcharge: 88000 },
      ],
    },
    {
      label: '酒标定制',
      type: 'text',
      placeholder: '例：本人珍藏 · 非卖品',
      choices: [
        { name: '手工铜版印刷贴标，贴在那瓶永远在路上的酒上', surcharge: 28000 },
      ],
    },
  ],
  高定衣橱: [
    {
      label: '面料甄选 · L\'Étoffe',
      type: 'choice',
      choices: [
        { name: '高支羊毛（工坊基准）', surcharge: 0 },
        { name: '骆马绒 · 帝王之毛，两年剪一次', surcharge: 280000 },
        { name: '莲丝 · 千朵莲茎抽一米，佛系面料', surcharge: 680000 },
        { name: '概念面料 · 零克重，与「空气感」手拿包同源', surcharge: 1280000 },
      ],
    },
    {
      label: '版型预留 · La Coupe',
      type: 'choice',
      choices: [
        { name: '当下身形（工坊基准）', surcharge: 0 },
        { name: '「以后瘦了」预留版 · 乐观加价', surcharge: 88000 },
        { name: '「就这样挺好」宽容版 · 自洽加价', surcharge: 88000 },
      ],
    },
    {
      label: '里衬绣字',
      type: 'text',
      placeholder: '例：体面是穿给自己的',
      choices: [
        { name: '真丝里衬手工苏绣，只有脱下来的人看得见', surcharge: 18000 },
      ],
    },
  ],
}
