import { TeaCategory } from '../types';
import type { TeaCategoryDetail } from '../types';

/**
 * 茶类共享数据源
 * 整个项目的茶类介绍、工艺特点、存储条件、风味描述均从此处调取
 * 茶类名称标签也与此处保持一致（纯文本展示除外）
 */
export const teaCategories: TeaCategoryDetail[] = [
  {
    category: TeaCategory.GREEN,
    introduction: '绿茶是中国产量最大、饮用最广泛的茶类，采用高温杀青，保留了鲜叶的天然物质。',
    process: '不发酵，杀青→揉捻→干燥',
    storage: '冷藏0-5°C，避光防潮',
    flavor: '清汤绿叶，鲜爽甘醇',
    subCategories: ['炒青绿茶', '烘青绿茶', '晒青绿茶', '蒸青绿茶'],
    productCount: 42,
  },
  {
    category: TeaCategory.RED,
    introduction: '红茶经过萎凋、揉捻、发酵、干燥等工艺制成，汤色红亮，滋味醇厚。',
    process: '全发酵，萎凋→揉捻→发酵→干燥',
    storage: '常温密封避光，防潮',
    flavor: '红汤红叶，醇厚甜香',
    subCategories: ['小种红茶', '工夫红茶', '红碎茶'],
    productCount: 26,
  },
  {
    category: TeaCategory.OOLONG,
    introduction: '乌龙茶介于绿茶和红茶之间，兼具绿茶的清香和红茶的醇厚，工艺最为复杂。',
    process: '半发酵，做青→炒青→揉捻→烘焙',
    storage: '常温密封避光，防潮防异味',
    flavor: '绿叶红镶边，花香果韵',
    subCategories: ['闽北乌龙', '闽南乌龙', '广东乌龙', '台湾乌龙'],
    productCount: 35,
  },
  {
    category: TeaCategory.WHITE,
    introduction: '白茶工艺最为简朴，仅经萎凋和干燥，不炒不揉，以"形美、色鲜、香高、味醇"著称。',
    process: '微发酵，萎凋→干燥',
    storage: '常温避光干燥，可长期陈化',
    flavor: '汤色杏黄，毫香蜜韵',
    subCategories: ['白毫银针', '白牡丹', '贡眉', '寿眉'],
    productCount: 18,
  },
  {
    category: TeaCategory.YELLOW,
    introduction: '黄茶在绿茶工艺基础上增加了一道"闷黄"工序，使茶叶自然氧化变黄。',
    process: '轻发酵，杀青→揉捻→闷黄→干燥',
    storage: '冷藏密封，避光防潮',
    flavor: '黄汤黄叶，甜香持久',
    subCategories: ['黄芽茶', '黄小茶', '黄大茶'],
    productCount: 8,
  },
  {
    category: TeaCategory.DARK,
    introduction: '黑茶经过渥堆发酵工艺，茶性温和，具有独特的陈香，越陈越香。',
    process: '后发酵，杀青→揉捻→渥堆→干燥',
    storage: '常温通风干燥，可长期陈化',
    flavor: '汤色红浓，陈香醇厚',
    subCategories: ['湖南黑茶', '四川边茶', '云南普洱', '广西六堡茶'],
    productCount: 22,
  },
  {
    category: TeaCategory.FLOWER,
    introduction: '花草茶是以植物的花、叶、果、根等为原料，经加工而成的饮品，兼具美观与健康功效。',
    process: '代用茶，窨制或拼配',
    storage: '常温密封避光，防潮防异味',
    flavor: '花香馥郁，清甜甘爽',
    subCategories: ['茉莉花茶', '玫瑰花茶', '菊花茶', '桂花茶'],
    productCount: 15,
  },
];

/** 根据 TeaCategory 枚举获取茶类详情 */
export function getTeaCategoryDetail(category: TeaCategory): TeaCategoryDetail | undefined {
  return teaCategories.find((t) => t.category === category);
}

/** 获取茶类中文名称映射 */
export function getTeaCategoryLabel(category: TeaCategory): string {
  const map: Record<TeaCategory, string> = {
    [TeaCategory.GREEN]: '绿茶',
    [TeaCategory.RED]: '红茶',
    [TeaCategory.OOLONG]: '青茶',
    [TeaCategory.WHITE]: '白茶',
    [TeaCategory.YELLOW]: '黄茶',
    [TeaCategory.DARK]: '黑茶',
    [TeaCategory.FLOWER]: '花草茶',
  };
  return map[category];
}
