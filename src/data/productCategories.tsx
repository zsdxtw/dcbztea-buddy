import { TeaCategory } from '../types';

/**
 * 分类管理共享数据源
 * 茶叶、茶具、茶周边、其他四个一级分类的分类树数据
 */

/** 分类节点 */
export interface CategoryNode {
  id: string;
  name: string;
  icon?: React.ReactNode;
  sort: number;
  productCount: number;
  /** 发酵种类（仅茶叶二级分类） */
  fermentation?: string;
  /** 描述（茶叶二级分类为茶类介绍，三级分类为茶叶特点；其他分类为分类说明） */
  description?: string;
  /** 产地（仅茶叶三级分类） */
  origin?: string;
  children?: CategoryNode[];
}

/** 一级分类类型 */
export type ProductCategoryType = 'tea' | 'teaware' | 'tea-peripheral' | 'other';

/** 一级分类标签映射 */
export const productCategoryLabels: Record<ProductCategoryType, string> = {
  'tea': '茶叶',
  'teaware': '茶具',
  'tea-peripheral': '茶周边',
  'other': '其他',
};

/** 一级分类面包屑映射 */
export const productCategoryBreadcrumbs: Record<ProductCategoryType, string> = {
  'tea': '茶叶分类',
  'teaware': '茶具分类',
  'tea-peripheral': '茶周边分类',
  'other': '其他分类',
};

/** 通过茶类中文名称查找茶类枚举 */
export function getTeaCategoryByName(name: string): TeaCategory | undefined {
  const nameToEnum: Record<string, TeaCategory> = {
    '绿茶': TeaCategory.GREEN, '红茶': TeaCategory.RED, '青茶': TeaCategory.OOLONG,
    '白茶': TeaCategory.WHITE, '黄茶': TeaCategory.YELLOW, '黑茶': TeaCategory.DARK,
    '花草茶': TeaCategory.FLOWER,
  };
  return nameToEnum[name];
}

/* ── 一级分类图标 ── */
export const NumberIcon1 = () => (
  <svg viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="8" fill="var(--color-module-product-base)"/>
    <text x="10" y="14" textAnchor="middle" fill="white" fontSize="11" fontWeight="600">1</text>
  </svg>
);
export const NumberIcon2 = () => (
  <svg viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="8" fill="var(--color-module-product-base)"/>
    <text x="10" y="14" textAnchor="middle" fill="white" fontSize="11" fontWeight="600">2</text>
  </svg>
);
export const NumberIcon3 = () => (
  <svg viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="8" fill="var(--color-module-product-base)"/>
    <text x="10" y="14" textAnchor="middle" fill="white" fontSize="11" fontWeight="600">3</text>
  </svg>
);
export const NumberIcon4 = () => (
  <svg viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="8" fill="var(--color-module-product-base)"/>
    <text x="10" y="14" textAnchor="middle" fill="white" fontSize="11" fontWeight="600">4</text>
  </svg>
);

/* ── 茶叶分类数据 ── */
export const teaCategoryData: CategoryNode = {
  id: 'tea', name: '茶叶', icon: <NumberIcon1 />, sort: 1, productCount: 151,
  children: [
    {
      id: 'green-tea', name: '绿茶', sort: 1, productCount: 42,
      fermentation: '不发酵茶',
      description: '绿茶是中国产量最大、饮用最广泛的茶类，采用高温杀青，保留了鲜叶的天然物质。',
      children: [
        { id: 'xihu-longjing', name: '西湖龙井', sort: 1, productCount: 15, origin: '浙江杭州', description: '以"色绿、香郁、味甘、形美"四绝著称，扁平光滑挺直，自带浓郁豆花香，茶汤清甜顺滑。' },
        { id: 'biluochun', name: '碧螺春', sort: 2, productCount: 12, origin: '江苏苏州', description: '条索卷曲如螺、白毫密披，茶树与花果树间作，自带独特花果香，滋味鲜醇甘厚。' },
        { id: 'huangshan-maofeng', name: '黄山毛峰', sort: 3, productCount: 8, origin: '安徽黄山', description: '形似雀舌、白毫显露、色如象牙，冲泡时雾气凝顶，香气如兰，滋味鲜浓醇厚回甘。' },
        { id: 'xinyang-maojian', name: '信阳毛尖', sort: 4, productCount: 7, origin: '河南信阳', description: '条索细圆紧直、白毫满披，香气高长带熟板栗香，滋味浓醇回甘，耐泡度出色。' },
        { id: 'taiping-houkui', name: '太平猴魁', sort: 5, productCount: 5, origin: '安徽太平', description: '两叶抱芽、平扁挺直，有"猴魁两头尖，不散不翘不卷边"之说，花香高爽带独特"猴韵"。' },
        { id: 'liuan-guapian', name: '六安瓜片', sort: 6, productCount: 6, origin: '安徽六安', description: '中国唯一无芽无梗的片形绿茶，形似瓜子，栗香浓郁，滋味鲜醇回甘。' },
      ],
    },
    {
      id: 'red-tea', name: '红茶', sort: 2, productCount: 26,
      fermentation: '全发酵茶',
      description: '红茶经过萎凋、揉捻、发酵、干燥等工艺制成，汤色红亮，滋味醇厚。',
      children: [
        { id: 'qimen-hongcha', name: '祁门红茶', sort: 1, productCount: 8, origin: '安徽祁门', description: '世界三大高香红茶之一，条索紧细匀整、色泽乌润，具有似花似果似蜜的独特"祁门香"。' },
        { id: 'zhengshan-xiaozhong', name: '正山小种', sort: 2, productCount: 10, origin: '福建武夷山', description: '世界红茶鼻祖，传统松烟香显著，滋味醇厚带桂圆汤味，茶汤红浓。' },
        { id: 'jinjunmei', name: '金骏眉', sort: 3, productCount: 6, origin: '福建武夷山', description: '全芽头制作的顶级红茶，金黄金黑相间，花果蜜香交织，汤色金黄透亮，入口丝滑甘爽。' },
        { id: 'dianhong', name: '滇红', sort: 4, productCount: 7, origin: '云南凤庆', description: '大叶种红茶代表，条索肥壮、金毫满披，蜜香浓郁高长，滋味浓厚鲜爽甜润。' },
        { id: 'yingde-hongcha', name: '英德红茶', sort: 5, productCount: 5, origin: '广东英德', description: '金毫显露，蜜糖香中透着荔枝清甜，浓而不涩，回甘快，茶汤红亮。' },
      ],
    },
    {
      id: 'oolong-tea', name: '青茶', sort: 3, productCount: 35,
      fermentation: '半发酵茶',
      description: '青茶介于绿茶和红茶之间，兼具绿茶的清香和红茶的醇厚，工艺最为复杂。',
      children: [
        { id: 'tieguanyin', name: '铁观音', sort: 1, productCount: 12, origin: '福建安溪', description: '颗粒紧结如蜻蜓头，天然兰花香馥郁，汤色金黄浓艳似琥珀，"七泡有余香"。' },
        { id: 'dahongpao', name: '大红袍', sort: 2, productCount: 10, origin: '福建武夷山', description: '武夷岩茶之王，条索紧结、色泽绿褐油润，"岩骨花香"显著，滋味醇厚回甘、喉韵悠长。' },
        { id: 'fenghuang-dancong', name: '凤凰单丛', sort: 3, productCount: 6, origin: '广东潮州', description: '单株单制，香型多达上百种（蜜兰香、鸭屎香等），茶汤醇厚带蜜甜，"一茶一味"。' },
        { id: 'dongding-wulong', name: '冻顶乌龙', sort: 4, productCount: 7, origin: '台湾南投', description: '半球形颗粒紧结、色泽墨绿，兰花香或熟果香浓郁，滋味醇厚甘润，喉韵回甘。' },
        { id: 'dongfang-meiren', name: '东方美人', sort: 5, productCount: 4, origin: '台湾新竹', description: '茶芽被小绿叶蝉叮咬后形成独特蜜香，白毫显著、五色交叠，熟果蜜香浓郁，口感甜润如蜜。' },
        { id: 'shuixian', name: '水仙', sort: 6, productCount: 5, origin: '福建建瓯', description: '条索肥壮、色泽绿褐油润，兰花香显著，老枞水仙更有独特"枞味"（青苔香、木质香），汤感绵密顺滑。' },
      ],
    },
    {
      id: 'white-tea', name: '白茶', sort: 4, productCount: 18,
      fermentation: '微发酵茶',
      description: '白茶工艺最为简朴，仅经萎凋和干燥，不炒不揉，以"形美、色鲜、香高、味醇"著称。',
      children: [
        { id: 'baihao-yinzhen', name: '白毫银针', sort: 1, productCount: 5, origin: '福建福鼎/政和', description: '芽头肥壮挺直如针、密披白毫如银似雪，毫香清鲜高扬，滋味清鲜醇爽。' },
        { id: 'bai-mudan', name: '白牡丹', sort: 2, productCount: 7, origin: '福建福鼎/政和', description: '一芽两叶、芽叶连枝，绿叶夹银毫形似花朵，花香清雅，汤感比银针更饱满。' },
        { id: 'gongmei', name: '贡眉', sort: 3, productCount: 4, origin: '福建福鼎/政和', description: '群体种菜茶制作，芽叶细瘦、叶色灰绿带黄，汤色橙黄，带野花蜜韵，陈化后枣香显。' },
        { id: 'shoumei', name: '寿眉', sort: 4, productCount: 6, origin: '福建福鼎/政和', description: '叶片阔大、茶梗粗壮，新茶清爽甘甜，老茶醇厚带枣香药香，耐煮耐泡，性价比极高。' },
      ],
    },
    {
      id: 'yellow-tea', name: '黄茶', sort: 5, productCount: 8,
      fermentation: '轻发酵茶',
      description: '黄茶在绿茶工艺基础上增加了一道"闷黄"工序，使茶叶自然氧化变黄。',
      children: [
        { id: 'junshan-yinzhen', name: '君山银针', sort: 1, productCount: 3, origin: '湖南岳阳', description: '芽头肥壮、满披白毫、色泽金黄，有"金镶玉"美称，冲泡时芽尖三起三落，滋味甘醇鲜爽。' },
        { id: 'mengding-huangya', name: '蒙顶黄芽', sort: 2, productCount: 3, origin: '四川雅安', description: '外形扁直匀整、嫩黄油润、金芽披毫，甜香鲜嫩带熟板栗香，滋味甘醇，汤色黄亮透碧。' },
        { id: 'huoshan-huangya', name: '霍山黄芽', sort: 3, productCount: 2, origin: '安徽霍山', description: '形似雀舌、芽叶细嫩多毫、色泽黄绿，香气清高带熟板栗香，滋味鲜醇浓厚回甘。' },
        { id: 'mogan-huangya', name: '莫干黄芽', sort: 4, productCount: 1, origin: '浙江德清', description: '嫩芽略勾尖、嫩黄显毫，蜜香甘醇，滋味醇爽，汤色嫩黄绿亮。' },
        { id: 'pingyang-huangtang', name: '平阳黄汤', sort: 5, productCount: 1, origin: '浙江平阳', description: '以"干茶显黄、汤色杏黄、叶底嫩黄"三黄著称，带独特玉米香，滋味醇和回甘。' },
      ],
    },
    {
      id: 'dark-tea', name: '黑茶', sort: 6, productCount: 22,
      fermentation: '后发酵茶',
      description: '黑茶经过渥堆发酵工艺，茶性温和，具有独特的陈香，越陈越香。',
      children: [
        { id: 'puer-shou', name: '普洱茶（熟普）', sort: 1, productCount: 8, origin: '云南普洱', description: '渥堆发酵后苦涩全消，茶汤红浓油润、顺滑绵糯，陈香枣香层次丰富，越陈越香。' },
        { id: 'anhua-heicha', name: '安化黑茶', sort: 2, productCount: 7, origin: '湖南安化', description: '松烟香与菌花香并存，茯砖内长满"金花"（冠突散囊菌），滋味浓厚回甘，消食解腻一绝。' },
        { id: 'liubao-cha', name: '六堡茶', sort: 3, productCount: 4, origin: '广西梧州', description: '以"红、浓、陈、醇"四绝著称，带独特槟榔香，滋味清爽醇厚回甘，祛湿调肠胃功效显著。' },
        { id: 'yaan-zangcha', name: '雅安藏茶', sort: 4, productCount: 3, origin: '四川雅安', description: '发酵最深、滋味浓强厚重，带独特陈香与药香，极度耐泡耐煮，是调制酥油茶的主要原料。' },
        { id: 'jingyang-fuzhuan', name: '泾阳茯砖', sort: 5, productCount: 3, origin: '陕西泾阳', description: '最早发明"发花"工艺的黑茶，金花茂密、菌香浓郁，滋味醇厚带微微松烟香，陈放后药香更浓。' },
      ],
    },
    {
      id: 'flower-tea', name: '花草茶', sort: 7, productCount: 15,
      fermentation: '代用茶',
      description: '花草茶是以植物的花、叶、果、根等为原料，经加工而成的饮品，兼具美观与健康功效。',
      children: [
        { id: 'jasmine-tea', name: '茉莉花茶', sort: 1, productCount: 6, origin: '福建福州', description: '以绿茶为茶坯，经茉莉花窨制而成，香气鲜灵持久，滋味醇厚鲜爽，有"窨得茉莉无上味，列作人间第一香"的美誉。' },
        { id: 'rose-tea', name: '玫瑰花茶', sort: 2, productCount: 4, origin: '山东平阴', description: '采用重瓣红玫瑰，香气浓郁甜美，汤色浅黄明亮，有疏肝解郁、美容养颜的功效。' },
        { id: 'chrysanthemum-tea', name: '菊花茶', sort: 3, productCount: 5, origin: '浙江桐乡', description: '以杭白菊为代表，花朵完整，香气清冽，有清热解毒、明目的功效。' },
      ],
    },
  ],
};

/* ── 茶具分类数据 ── */
export const teawareCategoryData: CategoryNode = {
  id: 'teaware', name: '茶具', icon: <NumberIcon2 />, sort: 2, productCount: 45,
  children: [
    {
      id: 'teapot', name: '茶壶', sort: 1, productCount: 15,
      description: '茶壶是泡茶的核心器具，不同材质对茶汤口感影响显著。',
      children: [
        { id: 'teapot-zisha', name: '紫砂壶', sort: 1, productCount: 8, description: '宜兴紫砂泥料制作，透气不渗水，长期使用茶香浸润，"养壶"越久越温润。' },
        { id: 'teapot-ciqi', name: '瓷器壶', sort: 2, productCount: 4, description: '景德镇白瓷或青瓷，不吸味、易清洗，适合冲泡各类茶叶，观汤色一目了然。' },
        { id: 'teapot-boli', name: '玻璃壶', sort: 3, productCount: 3, description: '高硼硅玻璃耐高温，可直观欣赏茶叶舒展过程，适合花草茶和绿茶。' },
      ],
    },
    {
      id: 'teacup', name: '茶杯', sort: 2, productCount: 12,
      description: '品茗杯、闻香杯、盖碗各有用途，是品茶体验的关键。',
      children: [
        { id: 'teacup-pinming', name: '品茗杯', sort: 1, productCount: 5, description: '小巧精致，容量约30-50ml，白瓷内壁最能观汤色，紫砂杯保温性好。' },
        { id: 'teacup-wenxiang', name: '闻香杯', sort: 2, productCount: 3, description: '细长筒形，聚香效果佳，常与品茗杯配套使用，先闻香后品茗。' },
        { id: 'teacup-gaotong', name: '盖碗', sort: 3, productCount: 4, description: '"万能茶具"，碗盖可刮沫、可闻香，碗托防烫手，适合冲泡所有茶类。' },
      ],
    },
    {
      id: 'tea-tray', name: '茶盘茶台', sort: 3, productCount: 8,
      description: '茶盘承接废水茶渣，是茶席的基础平台。',
      children: [
        { id: 'tray-zhushi', name: '竹制茶盘', sort: 1, productCount: 4, description: '天然竹材，轻便环保，纹理清新自然，价格亲民，适合日常使用。' },
        { id: 'tray-shicai', name: '石材茶盘', sort: 2, productCount: 4, description: '乌金石、端砚石等，沉稳大气，经久耐用，适合正式茶席和收藏。' },
      ],
    },
    {
      id: 'tea-tools', name: '茶道配件', sort: 4, productCount: 10,
      description: '茶道六君子及辅助工具，让泡茶流程更规范优雅。',
      children: [
        { id: 'tools-chadao', name: '茶道六君子', sort: 1, productCount: 4, description: '茶筒、茶匙、茶漏、茶则、茶夹、茶针六件套，竹制或木制，泡茶必备。' },
        { id: 'tools-chaye', name: '茶则茶荷', sort: 2, productCount: 3, description: '量取茶叶、展示干茶，竹木或瓷器材质，兼具实用与观赏。' },
        { id: 'tools-lvdou', name: '滤茶器', sort: 3, productCount: 3, description: '过滤茶渣，不锈钢或纯银滤网，保证茶汤清澈透亮。' },
      ],
    },
  ],
};

/* ── 茶周边分类数据 ── */
export const teaPeripheralCategoryData: CategoryNode = {
  id: 'tea-peripheral', name: '茶周边', icon: <NumberIcon3 />, sort: 3, productCount: 38,
  children: [
    {
      id: 'tea-food', name: '茶食品', sort: 1, productCount: 15,
      description: '佐茶点心和茶味零食，丰富品茶体验。',
      children: [
        { id: 'food-tea-snack', name: '茶点零食', sort: 1, productCount: 8, description: '绿豆糕、凤梨酥、坚果等传统茶点，甜咸搭配，佐茶相宜。' },
        { id: 'food-tea-candy', name: '茶味糖果', sort: 2, productCount: 4, description: '抹茶巧克力、红茶奶糖、花茶软糖等，茶香与甜味融合。' },
        { id: 'food-tea-cake', name: '茶糕点心', sort: 3, productCount: 3, description: '绿茶马卡龙、红茶司康、乌龙茶酥等精致茶点，适合下午茶。' },
      ],
    },
    {
      id: 'tea-gift', name: '礼盒套装', sort: 2, productCount: 12,
      description: '茶叶与茶具的精美组合，送礼自用皆宜。',
      children: [
        { id: 'gift-festival', name: '节日礼盒', sort: 1, productCount: 5, description: '春节、中秋等节日限定，红色喜庆包装，含茶叶+茶具组合。' },
        { id: 'gift-business', name: '商务礼盒', sort: 2, productCount: 4, description: '简约大气，品牌定制，适合企业馈赠和商务往来。' },
        { id: 'gift-wedding', name: '婚庆礼盒', sort: 3, productCount: 3, description: '双喜元素，红色金色搭配，含喜茶+喜杯，寓意美满。' },
      ],
    },
    {
      id: 'tea-storage', name: '茶叶罐/包装', sort: 3, productCount: 11,
      description: '茶叶储存和包装用品，保证茶叶品质。',
      children: [
        { id: 'storage-tin', name: '锡罐', sort: 1, productCount: 4, description: '纯锡或镀锡材质，密封性极佳，避光防潮，适合高档茶叶长期存放。' },
        { id: 'storage-ceramic', name: '陶瓷罐', sort: 2, productCount: 4, description: '紫砂或陶瓷罐，透气性好，适合普洱、白茶等需要微氧环境的茶叶。' },
        { id: 'storage-bag', name: '包装袋', sort: 3, productCount: 3, description: '铝箔自封袋、牛皮纸袋等，经济实用，适合日常短期存放。' },
      ],
    },
  ],
};

/* ── 其他分类数据 ── */
export const otherCategoryData: CategoryNode = {
  id: 'other', name: '其他', icon: <NumberIcon4 />, sort: 4, productCount: 12,
  children: [
    {
      id: 'tea-water', name: '泡茶水', sort: 1, productCount: 6,
      description: '好茶需好水，水质直接影响茶汤口感。',
      children: [
        { id: 'water-mineral', name: '矿泉水', sort: 1, productCount: 3, description: '天然矿泉水，矿物质含量适中，冲泡绿茶、白茶口感清甜。' },
        { id: 'water-purified', name: '纯净水', sort: 2, productCount: 3, description: '反渗透纯净水，无杂质干扰，最能还原茶叶本味，适合品鉴。' },
      ],
    },
    {
      id: 'tea-book', name: '茶书茶画', sort: 2, productCount: 4,
      description: '茶文化书籍和艺术品，提升茶道修养。',
      children: [
        { id: 'book-tea-art', name: '茶艺书籍', sort: 1, productCount: 2, description: '泡茶技法、茶席设计、茶道入门等实用书籍，图文并茂。' },
        { id: 'book-tea-culture', name: '茶文化书籍', sort: 2, productCount: 2, description: '茶史、茶道哲学、名茶产地故事等，深度了解茶文化。' },
      ],
    },
    {
      id: 'tea-incense', name: '茶香/香道', sort: 3, productCount: 2,
      description: '品茶伴香，营造雅致氛围。',
      children: [
        { id: 'incense-stick', name: '线香', sort: 1, productCount: 1, description: '沉香、檀香线香，燃烧均匀，香气悠远，品茶时点燃营造禅意。' },
        { id: 'incense-cone', name: '盘香', sort: 2, productCount: 1, description: '盘式香，燃烧时间长，适合长时间茶席，香气温和持久。' },
      ],
    },
  ],
};

/** 按一级分类类型获取数据 */
export function getCategoryDataByType(type: ProductCategoryType): CategoryNode {
  switch (type) {
    case 'tea': return teaCategoryData;
    case 'teaware': return teawareCategoryData;
    case 'tea-peripheral': return teaPeripheralCategoryData;
    case 'other': return otherCategoryData;
  }
}

/** 工具函数 */
export function findPath(nodes: CategoryNode[], targetId: string, path: CategoryNode[] = []): CategoryNode[] | null {
  for (const node of nodes) {
    const currentPath = [...path, node];
    if (node.id === targetId) return currentPath;
    if (node.children) {
      const found = findPath(node.children, targetId, currentPath);
      if (found) return found;
    }
  }
  return null;
}

export function findNode(nodes: CategoryNode[], targetId: string): CategoryNode | null {
  for (const node of nodes) {
    if (node.id === targetId) return node;
    if (node.children) {
      const found = findNode(node.children, targetId);
      if (found) return found;
    }
  }
  return null;
}

export function getLevelLabel(depth: number) {
  switch (depth) {
    case 0: return '一级分类';
    case 1: return '二级分类';
    case 2: return '三级分类';
    default: return '子分类';
  }
}
