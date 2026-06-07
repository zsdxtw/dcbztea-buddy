import { TeaCategory } from '../types';

export interface TeaVariety {
  name: string;           // 茶种名称
  category: TeaCategory;  // 茶类
  origin: string;         // 产地（省份级别，如"浙江"、"福建"等）
  originDetail: string;   // 产地详情（如"杭州西湖区"）
  introduction: string;   // 茶种介绍
  characteristics: string; // 特点
  brands: string[];       // 代表品牌
}

export const teaVarieties: TeaVariety[] = [
  // GREEN TEA 绿茶
  { name: '西湖龙井', category: TeaCategory.GREEN, origin: '浙江', originDetail: '杭州西湖区（狮峰、梅家坞为核心产区）', introduction: '扁平挺直，色泽翠绿，具有"色绿、香郁、味甘、形美"四绝。豆香或栗香浓郁，明前茶最为珍贵', characteristics: '豆香或栗香浓郁，明前茶最珍贵', brands: ['西湖牌', '狮峰牌', '贡牌', '御牌'] },
  { name: '大佛龙井', category: TeaCategory.GREEN, origin: '浙江', originDetail: '浙江新昌', introduction: '外形扁平光滑，尖削挺直，色泽绿翠匀润，香气嫩香持久，滋味鲜醇爽口', characteristics: '香气嫩香持久，滋味鲜醇爽口', brands: ['新昌大佛龙井'] },
  { name: '碧螺春', category: TeaCategory.GREEN, origin: '江苏', originDetail: '苏州太湖洞庭山', introduction: '条索卷曲如螺，披覆白毫，花果香显著，嫩度极高。冲泡后茶叶徐徐舒展，上下翻飞', characteristics: '花果香显著，嫩度极高', brands: ['碧螺牌', '三万昌'] },
  { name: '黄山毛峰', category: TeaCategory.GREEN, origin: '安徽', originDetail: '黄山富溪乡', introduction: '芽头肥壮毫多，形似雀舌，带有独特兰花香，口感清甜柔和。入杯冲泡汤色清澈微黄', characteristics: '独特兰花香，口感清甜柔和', brands: ['谢裕大', '老谢家茶'] },
  { name: '信阳毛尖', category: TeaCategory.GREEN, origin: '河南', originDetail: '河南信阳', introduction: '外形细圆紧直，白毫显露，口感浓醇耐泡，有"绿茶之王"美誉', characteristics: '浓醇耐泡，"绿茶之王"', brands: ['龙潭', '文新'] },
  { name: '六安瓜片', category: TeaCategory.GREEN, origin: '安徽', originDetail: '六安大别山北麓', introduction: '唯一无芽无梗的绿茶，完全由叶片制作。形似瓜子，色泽宝绿，栗香浓郁', characteristics: '唯一无芽无梗绿茶，栗香浓郁', brands: ['徽六', '一笑堂'] },
  { name: '太平猴魁', category: TeaCategory.GREEN, origin: '安徽', originDetail: '黄山黄山区', introduction: '外形扁展挺拔，色泽苍绿匀润，遍身白毫。入杯后芽叶竖立成朵，宛如兰花', characteristics: '芽叶竖立成朵，宛如兰花', brands: ['猴坑', '六百里'] },
  { name: '安吉白茶', category: TeaCategory.GREEN, origin: '浙江', originDetail: '浙江安吉', introduction: '虽名含"白"，实为绿茶。氨基酸含量极高，口感清甜鲜爽，不苦涩', characteristics: '氨基酸含量极高，清甜鲜爽', brands: ['宋茗', '极白'] },
  { name: '庐山云雾', category: TeaCategory.GREEN, origin: '江西', originDetail: '江西庐山', introduction: '条索紧结秀丽，香气鲜爽持久，滋味醇厚回甘', characteristics: '香气鲜爽持久，滋味醇厚回甘', brands: ['庐山牌'] },
  { name: '峨眉竹叶青', category: TeaCategory.GREEN, origin: '四川', originDetail: '四川峨眉山', introduction: '外形扁平光滑，色泽嫩绿油润，香气清香馥郁', characteristics: '清香馥郁，扁平光滑', brands: ['竹叶青'] },
  { name: '恩施玉露', category: TeaCategory.GREEN, origin: '湖北', originDetail: '湖北恩施', introduction: '中国蒸青针形绿茶的典型代表，天然富含有机硒。汤色清澈，滋味鲜爽', characteristics: '蒸青针形代表，天然富硒', brands: ['恩施玉露', '立早'] },
  { name: '老竹大方', category: TeaCategory.GREEN, origin: '安徽', originDetail: '歙县老竹岭', introduction: '外形扁平匀整，色泽黄绿或深绿如铸铁，故有"铁色大方"之称。香气高长，滋味醇厚', characteristics: '"铁色大方"，香气高长', brands: ['歙县老竹大方'] },
  { name: '涌溪火青', category: TeaCategory.GREEN, origin: '安徽', originDetail: '泾县涌溪村', introduction: '珠茶之冠，腰圆紧结，色泽墨绿，香气似幽兰，滋味甘醇。落水即沉', characteristics: '珠茶之冠，落水即沉', brands: ['泾县涌溪火青'] },
  { name: '舒城兰花茶', category: TeaCategory.GREEN, origin: '安徽', originDetail: '舒城晓天一带', introduction: '创制于明末清初，已有300多年历史。外形芽叶连枝、形似兰花，冲泡时有鲜明兰花香', characteristics: '芽叶连枝形似兰花，兰花香鲜明', brands: ['舒城小兰花'] },
  { name: '岳西翠兰', category: TeaCategory.GREEN, origin: '安徽', originDetail: '安徽岳西', introduction: '1985年被评为新中国首批新创"十大名茶"。芽叶相连，自然舒展，色泽翠绿，香气清高持久', characteristics: '首批新创十大名茶，香气清高', brands: ['岳西翠兰茶业'] },
  { name: '南京雨花茶', category: TeaCategory.GREEN, origin: '江苏', originDetail: '江苏南京', introduction: '形似松针，条索紧直圆浑，两端略尖，锋苗挺秀，白毫隐露。为纪念革命先烈而创制', characteristics: '形似松针，纪念先烈而创制', brands: ['南京雨花茶'] },
  { name: '都匀毛尖', category: TeaCategory.GREEN, origin: '贵州', originDetail: '贵州都匀', introduction: '中国十大名茶之一。条索紧结纤细，卷曲似螺，满披白毫。香气清高，滋味鲜醇', characteristics: '中国十大名茶，卷曲似螺', brands: ['都匀毛尖'] },
  { name: '蒙顶甘露', category: TeaCategory.GREEN, origin: '四川', originDetail: '雅安蒙顶山', introduction: '中国最古老的名茶，被尊为茶中故旧。卷曲型绿茶代表，嫩芽翠绿，汤色黄碧', characteristics: '中国最古老名茶，卷曲型代表', brands: ['蒙顶甘露'] },
  { name: '崂山绿茶', category: TeaCategory.GREEN, origin: '山东', originDetail: '青岛崂山', introduction: '北方绿茶代表，条索紧结，色泽翠绿，香气清高，滋味鲜醇', characteristics: '北方绿茶代表', brands: ['崂山绿茶'] },
  { name: '日照绿茶', category: TeaCategory.GREEN, origin: '山东', originDetail: '山东日照', introduction: '北方绿茶代表，条索紧结，色泽翠绿，香气高长，滋味浓醇', characteristics: '北方绿茶代表，滋味浓醇', brands: ['日照绿茶'] },
  { name: '紫阳毛尖', category: TeaCategory.GREEN, origin: '陕西', originDetail: '陕西紫阳', introduction: '富硒茶，条索紧细，色泽翠绿，香气清高，滋味鲜醇', characteristics: '富硒茶，香气清高', brands: ['紫阳毛尖'] },
  { name: '古丈毛尖', category: TeaCategory.GREEN, origin: '湖南', originDetail: '湘西古丈', introduction: '唐代即为贡品。条索紧细圆直，白毫满披，色泽翠绿。香高味浓，回味甘爽', characteristics: '唐代贡品，香高味浓', brands: ['古丈毛尖'] },
  { name: '安化松针', category: TeaCategory.GREEN, origin: '湖南', originDetail: '湖南安化', introduction: '条索长直、圆浑、紧细，形似松针，翠绿匀整。香气浓厚，滋味甜醇', characteristics: '形似松针，香气浓厚', brands: ['安化松针'] },
  { name: '狗牯脑', category: TeaCategory.GREEN, origin: '江西', originDetail: '江西遂川', introduction: '条索紧结秀丽，色泽黛绿，香气清高，滋味醇厚', characteristics: '色泽黛绿，滋味醇厚', brands: ['狗牯脑茶'] },
  { name: '开化龙顶', category: TeaCategory.GREEN, origin: '浙江', originDetail: '浙江开化', introduction: '外形紧直挺秀，银绿披毫，香气馥郁持久，滋味鲜醇爽口', characteristics: '银绿披毫，香气馥郁', brands: ['开化龙顶'] },
  { name: '顾渚紫笋', category: TeaCategory.GREEN, origin: '浙江', originDetail: '长兴顾渚山', introduction: '历史名茶，唐代贡茶。芽叶微紫，卷曲似笋壳，香气馥郁，滋味甘醇', characteristics: '唐代贡茶，芽叶微紫', brands: ['顾渚紫笋'] },
  { name: '永川秀芽', category: TeaCategory.GREEN, origin: '重庆', originDetail: '重庆永川', introduction: '条索紧直细秀，色泽翠绿鲜润，香气浓郁，滋味鲜醇', characteristics: '紧直细秀，香气浓郁', brands: ['永川秀芽'] },
  { name: '湄潭翠芽', category: TeaCategory.GREEN, origin: '贵州', originDetail: '贵州湄潭', introduction: '外形扁平光滑，色泽翠绿，香气清高持久，滋味鲜醇', characteristics: '扁平光滑，香气清高持久', brands: ['湄潭翠芽'] },
  { name: '凤冈锌硒茶', category: TeaCategory.GREEN, origin: '贵州', originDetail: '贵州凤冈', introduction: '富含锌硒元素，条索紧细，色泽翠绿，香气清高', characteristics: '富含锌硒元素', brands: ['凤冈锌硒茶'] },
  { name: '五指山绿茶', category: TeaCategory.GREEN, origin: '海南', originDetail: '海南五指山', introduction: '高山云雾茶，条索紧结，色泽翠绿，香气清高', characteristics: '高山云雾茶', brands: ['五指山绿茶'] },
  { name: '白沙绿茶', category: TeaCategory.GREEN, origin: '海南', originDetail: '海南白沙', introduction: '陨石坑独特地理环境，条索紧结，色泽翠绿，香气清高', characteristics: '陨石坑独特地理环境', brands: ['白沙绿茶'] },

  // RED TEA 红茶
  { name: '正山小种', category: TeaCategory.RED, origin: '福建', originDetail: '武夷山桐木关', introduction: '世界红茶鼻祖。传统工艺具有独特的松烟香和桂圆汤味，滋味醇厚', characteristics: '松烟香和桂圆汤味，世界红茶鼻祖', brands: ['正山堂', '骏德'] },
  { name: '金骏眉', category: TeaCategory.RED, origin: '福建', originDetail: '武夷山桐木关', introduction: '全程由芽头制作的高端红茶，蜜香与花果香交融，口感清甜细腻，金毫显露', characteristics: '芽头制作，蜜香花果香交融', brands: ['正山堂', '骏德'] },
  { name: '祁门红茶', category: TeaCategory.RED, origin: '安徽', originDetail: '安徽祁门', introduction: '世界三大高香红茶之一，拥有独特的"祁门香"——似花、似蜜、似果。香气馥郁持久', characteristics: '"祁门香"，世界三大高香红茶', brands: ['天之红', '祥源茶'] },
  { name: '滇红', category: TeaCategory.RED, origin: '云南', originDetail: '云南凤庆', introduction: '条索肥壮，金毫显露，香气高浓，滋味强烈浓厚，性价比高且耐泡', characteristics: '金毫显露，滋味强烈浓厚', brands: ['凤牌', '滇红集团'] },
  { name: '英德红茶', category: TeaCategory.RED, origin: '广东', originDetail: '广东英德', introduction: '色泽乌润细嫩，汤色红艳明亮，香气浓郁纯正', characteristics: '汤色红艳明亮，香气浓郁', brands: ['英红九号', '鸿雁'] },
  { name: '川红工夫', category: TeaCategory.RED, origin: '四川', originDetail: '四川宜宾', introduction: '香气高锐持久，带有橘糖香，滋味醇厚鲜爽', characteristics: '橘糖香，滋味醇厚鲜爽', brands: ['川红集团'] },
  { name: '九曲红梅', category: TeaCategory.RED, origin: '浙江', originDetail: '杭州西湖区', introduction: '外形弯曲细紧如鱼钩，色泽乌润，香气馥郁，滋味鲜醇', characteristics: '弯曲如鱼钩，香气馥郁', brands: ['西湖牌'] },
  { name: '湖红工夫', category: TeaCategory.RED, origin: '湖南', originDetail: '安化、新化', introduction: '条索紧结，色泽乌润，香气高长，滋味醇厚', characteristics: '香气高长，滋味醇厚', brands: ['湖红工夫'] },
  { name: '闽红工夫', category: TeaCategory.RED, origin: '福建', originDetail: '福安、政和、坦洋', introduction: '福建红茶统称，香气高长，滋味醇厚', characteristics: '福建红茶统称，香气高长', brands: ['坦洋工夫', '政和工夫'] },
  { name: '遵义红茶', category: TeaCategory.RED, origin: '贵州', originDetail: '贵州遵义', introduction: '条索紧细，色泽乌润，香气高长，滋味醇厚', characteristics: '香气高长，滋味醇厚', brands: ['遵义红茶'] },

  // OOLONG 青茶
  { name: '大红袍', category: TeaCategory.OOLONG, origin: '福建', originDetail: '福建武夷山', introduction: '武夷岩茶之王，具备独特的"岩骨花香"，炭火韵明显，口感醇厚霸气，七泡有余香', characteristics: '"岩骨花香"，七泡有余香', brands: ['武夷星', '曦瓜'] },
  { name: '铁观音', category: TeaCategory.OOLONG, origin: '福建', originDetail: '福建安溪', introduction: '分清香型与浓香型。清香型带兰花香，浓香型带焦糖香。茶汤有"绿叶红镶边"特征，回甘迅猛', characteristics: '兰花香/焦糖香，回甘迅猛', brands: ['八马', '华祥苑', '天福茗茶'] },
  { name: '凤凰单丛', category: TeaCategory.OOLONG, origin: '广东', originDetail: '潮州凤凰山', introduction: '香型极多，如蜜兰香、鸭屎香等，香气高扬且穿透力强，具有特殊山韵蜜味', characteristics: '香型极多，山韵蜜味', brands: ['宋凰', '天池'] },
  { name: '武夷肉桂', category: TeaCategory.OOLONG, origin: '福建', originDetail: '福建武夷山', introduction: '香气以辛辣桂皮味为主，口感霸道浓烈，是岩茶爱好者的必喝之选', characteristics: '桂皮味，口感霸道浓烈', brands: ['武夷星', '孝文家茶'] },
  { name: '武夷水仙', category: TeaCategory.OOLONG, origin: '福建', originDetail: '福建武夷山', introduction: '兰花香显著，汤水柔顺，耐泡度极高。老枞水仙价值更高，带有独特的枞味', characteristics: '兰花香显著，耐泡度极高', brands: ['武夷星', '曦瓜'] },
  { name: '冻顶乌龙', category: TeaCategory.OOLONG, origin: '台湾', originDetail: '台湾南投冻顶山', introduction: '香气清雅，带有桂花香或奶香，口感甘醇，回甘持久', characteristics: '桂花香或奶香，回甘持久', brands: ['天仁茗茶', '王德传'] },
  { name: '漳平水仙', category: TeaCategory.OOLONG, origin: '福建', originDetail: '福建漳平', introduction: '唯一的紧压乌龙茶，香气清高细长，带有兰花香，滋味醇爽', characteristics: '唯一紧压乌龙茶，兰花香', brands: ['漳平水仙'] },
  { name: '永春佛手', category: TeaCategory.OOLONG, origin: '福建', originDetail: '福建永春', introduction: '又名香橼种，叶形酷似佛手柑。香气馥郁幽长，汤色金黄透亮，滋味芳醇', characteristics: '叶形似佛手柑，香气馥郁', brands: ['永春佛手'] },
  { name: '东方美人茶', category: TeaCategory.OOLONG, origin: '台湾', originDetail: '台湾新竹', introduction: '又名白毫乌龙，经小绿叶蝉叮咬后产生独特蜜香，滋味甘醇', characteristics: '小绿叶蝉叮咬产生独特蜜香', brands: ['东方美人茶'] },
  { name: '阿里山茶', category: TeaCategory.OOLONG, origin: '台湾', originDetail: '台湾阿里山', introduction: '高山乌龙茶，香气清雅，滋味甘醇', characteristics: '高山乌龙，香气清雅', brands: ['阿里山茶'] },
  { name: '金萱茶', category: TeaCategory.OOLONG, origin: '台湾', originDetail: '台湾', introduction: '带有独特奶香，滋味甘醇', characteristics: '独特奶香', brands: ['金萱茶'] },

  // WHITE TEA 白茶
  { name: '白毫银针', category: TeaCategory.WHITE, origin: '福建', originDetail: '福鼎、政和', introduction: '全部由肥壮的芽头制成，满披白毫，挺直如针，色白似银。清甜淡雅，是白茶中的顶配', characteristics: '满披白毫，挺直如针，白茶顶配', brands: ['品品香', '绿雪芽', '六妙'] },
  { name: '白牡丹', category: TeaCategory.WHITE, origin: '福建', originDetail: '福鼎、政和', introduction: '一芽一二叶制成，绿叶夹银色白毫芽，形似花朵。花香明显，性价比高', characteristics: '形似花朵，花香明显', brands: ['品品香', '绿雪芽'] },
  { name: '寿眉', category: TeaCategory.WHITE, origin: '福建', originDetail: '福鼎、政和', introduction: '选用成熟叶片制作，香气多为枣香或药香。老寿眉适合煮茶，价格亲民且耐泡', characteristics: '枣香或药香，适合煮茶', brands: ['品品香', '中茶蝴蝶牌'] },
  { name: '月光白', category: TeaCategory.WHITE, origin: '云南', originDetail: '云南普洱', introduction: '云南特色白茶，叶面黑、叶背白，形似月光。香气清雅，滋味甘醇', characteristics: '叶面黑叶背白，形似月光', brands: ['月光白'] },
  { name: '南糯白毫', category: TeaCategory.WHITE, origin: '云南', originDetail: '勐海南糯山', introduction: '芽头肥壮，满披白毫，香气清雅，滋味甘醇', characteristics: '芽头肥壮，满披白毫', brands: ['南糯白毫'] },

  // YELLOW TEA 黄茶
  { name: '君山银针', category: TeaCategory.YELLOW, origin: '湖南', originDetail: '岳阳洞庭湖君山岛', introduction: '芽头金黄光亮，满披银毫，汤色橙黄明亮，滋味甜爽。属黄芽茶，是黄茶中的珍品', characteristics: '芽头金黄，黄茶珍品', brands: ['君山银针茶业'] },
  { name: '霍山黄芽', category: TeaCategory.YELLOW, origin: '安徽', originDetail: '安徽霍山', introduction: '外形挺直微展，色泽黄绿披毫，具有嫩香，口感清甜柔和', characteristics: '黄绿披毫，清甜柔和', brands: ['霍山黄芽茶业'] },
  { name: '蒙顶黄芽', category: TeaCategory.YELLOW, origin: '四川', originDetail: '雅安蒙顶山', introduction: '芽条匀整，扁平挺直，色泽嫩黄，花香幽长，滋味鲜醇回甘', characteristics: '色泽嫩黄，花香幽长', brands: ['蒙顶山茶业'] },
  { name: '沩山毛尖', category: TeaCategory.YELLOW, origin: '湖南', originDetail: '宁乡沩山', introduction: '色泽黄亮光润，白毫显露，汤色橙黄明亮，松烟香气浓郁', characteristics: '松烟香气浓郁', brands: ['沩山茶业'] },

  // DARK TEA 黑茶
  { name: '普洱茶', category: TeaCategory.DARK, origin: '云南', originDetail: '西双版纳、普洱、临沧等地', introduction: '分生普与熟普。生普随存放时间推移苦涩转甘，越陈越香；熟普经渥堆发酵，温润醇厚，具糯香枣香', characteristics: '越陈越香，生普熟普各有特色', brands: ['大益', '下关沱茶', '中茶', '澜沧古茶'] },
  { name: '安化黑茶', category: TeaCategory.DARK, origin: '湖南', originDetail: '湖南安化', introduction: '具有独特的金花菌香（冠突散囊菌），以茯砖、千两茶最为经典。口感醇厚，陈香明显', characteristics: '金花菌香，茯砖千两茶经典', brands: ['白沙溪', '湘益', '中茶湖南'] },
  { name: '六堡茶', category: TeaCategory.DARK, origin: '广西', originDetail: '广西梧州', introduction: '带有独特的槟榔香与陈香，具有祛湿养胃功效，是两广地区的传统养生茶', characteristics: '槟榔香与陈香，祛湿养胃', brands: ['三鹤', '中茶六堡'] },
  { name: '泾阳茯砖', category: TeaCategory.DARK, origin: '陕西', originDetail: '陕西泾阳', introduction: '砖面平整，棱角分明，金花茂盛，香气纯正，滋味醇厚', characteristics: '金花茂盛，滋味醇厚', brands: ['泾渭茯茶'] },
  { name: '青砖茶', category: TeaCategory.DARK, origin: '湖北', originDetail: '湖北赤壁（赵李桥）', introduction: '色泽青褐，香气纯正，滋味尚浓。是边疆少数民族的传统饮品', characteristics: '边疆传统饮品，滋味尚浓', brands: ['赵李桥茶厂', '长盛川'] },
  { name: '藏茶', category: TeaCategory.DARK, origin: '四川', originDetail: '四川雅安', introduction: '深度发酵，茶性温和，是藏族同胞的生活必需品，具有"红、浓、陈、醇"的特点', characteristics: '"红、浓、陈、醇"，深度发酵', brands: ['雅安茶厂'] },
  { name: '千两茶', category: TeaCategory.DARK, origin: '湖南', originDetail: '湖南安化', introduction: '呈圆柱形，每支重约老秤1000两，故名。香气纯正，滋味醇厚', characteristics: '圆柱形，千两之重', brands: ['白沙溪'] },
  { name: '重庆沱茶', category: TeaCategory.DARK, origin: '重庆', originDetail: '重庆', introduction: '碗臼形，色泽乌黑油润，香气纯正，滋味醇厚', characteristics: '碗臼形，滋味醇厚', brands: ['重庆沱茶'] },

  // FLOWER TEA 花草茶
  { name: '茉莉花茶', category: TeaCategory.FLOWER, origin: '福建', originDetail: '福州（发源地）、广西横县、四川犍为', introduction: '以绿茶为茶坯，用茉莉鲜花窨制而成。福州茉莉花茶最具代表性，香气仙灵馥郁，茶汤清澈透亮', characteristics: '香气仙灵馥郁，茶汤清澈', brands: ['金涧春', '张一元', '吴裕泰', '春伦', '碧潭飘雪'] },
  { name: '玫瑰花茶', category: TeaCategory.FLOWER, origin: '云南', originDetail: '云南（墨红玫瑰）、山东平阴、甘肃苦水', introduction: '花香浓郁，汤色粉红，具有美容养颜、疏肝理气的功效。冻干工艺能最大程度保留花香', characteristics: '美容养颜，疏肝理气', brands: ['艺福堂', '花养花', '洛施花舍'] },
  { name: '菊花茶', category: TeaCategory.FLOWER, origin: '浙江', originDetail: '桐乡（杭白菊）、亳州（亳菊）、婺源（皇菊）', introduction: '汤色金黄明亮，口感清甜微苦，具有清热解毒、明目降火的功效', characteristics: '清热解毒，明目降火', brands: ['艺福堂', '西湖牌', '同仁堂'] },
  { name: '桂花茶', category: TeaCategory.FLOWER, origin: '广西', originDetail: '广西桂林、浙江杭州', introduction: '以绿茶或乌龙茶为茶坯，加入桂花窨制。香气甜润馥郁，汤色金黄', characteristics: '桂花香甜润馥郁', brands: ['天福茗茶', '艺福堂'] },
  { name: '珠兰花茶', category: TeaCategory.FLOWER, origin: '安徽', originDetail: '安徽歙县', introduction: '以珠兰鲜花窨制，香气清雅幽长，似兰非兰，独具一格', characteristics: '似兰非兰，独具一格', brands: ['歙县茶厂'] },
  { name: '玳玳花茶', category: TeaCategory.FLOWER, origin: '江苏', originDetail: '苏州、杭州', introduction: '以玳玳花窨制，香气浓郁，带有柑橘类花香，具有理气宽胸的功效', characteristics: '柑橘类花香，理气宽胸', brands: ['苏州茶厂'] },
  { name: '荷叶茶', category: TeaCategory.FLOWER, origin: '湖北', originDetail: '湖北洪湖、湖南岳阳', introduction: '清香淡雅，具有清热解暑、降脂减肥的功效', characteristics: '清热解暑，降脂减肥', brands: ['艺福堂', '同仁堂'] },
  { name: '金银花茶', category: TeaCategory.FLOWER, origin: '山东', originDetail: '山东平邑、河南封丘', introduction: '清热解毒功效显著，汤色淡黄，口感微苦回甘', characteristics: '清热解毒，微苦回甘', brands: ['同仁堂', '雷允上'] },
  { name: '洛神花茶', category: TeaCategory.FLOWER, origin: '福建', originDetail: '福建、广东、云南', introduction: '汤色红艳如宝石，口感酸爽，富含维生素C，具有消暑解渴的功效', characteristics: '汤色红艳如宝石，富含维C', brands: ['艺福堂', '茶里'] },
  { name: '福州茉莉花茶', category: TeaCategory.FLOWER, origin: '福建', originDetail: '福建福州', introduction: '世界茉莉花茶发源地，国家地理标志保护产品。香气仙灵馥郁，非外地花茶可比', characteristics: '世界发源地，地理标志保护', brands: ['金涧春', '春伦', '闽榕'] },
  { name: '荔枝红茶', category: TeaCategory.FLOWER, origin: '广东', originDetail: '广东', introduction: '以红茶为茶坯，加入荔枝窨制或调香。带有荔枝甜香，滋味醇和', characteristics: '荔枝甜香，滋味醇和', brands: ['荔枝红茶'] },
  { name: '辣木茶', category: TeaCategory.FLOWER, origin: '海南', originDetail: '海南', introduction: '以辣木叶为原料，营养丰富，具有降血糖、降血脂等功效', characteristics: '营养丰富，降血糖降血脂', brands: ['辣木茶'] },
];

/** 获取所有产地列表 */
export function getAllOrigins(): string[] {
  const origins = new Set<string>();
  teaVarieties.forEach((t) => origins.add(t.origin));
  return Array.from(origins).sort();
}
