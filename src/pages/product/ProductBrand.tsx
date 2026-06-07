import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ContentHeader from '../../components/layout/ContentHeader';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Tag from '../../components/common/Tag';
import FilterBar from '../../components/business/FilterBar';
import type { StatCardData, BrandItem } from '../../types';
import { TeaCategory } from '../../types';

/** 通过茶类中文名称获取 TeaCategory 枚举 */
function nameToTeaCategory(name: string): TeaCategory | undefined {
  const map: Record<string, TeaCategory> = {
    '绿茶': TeaCategory.GREEN, '红茶': TeaCategory.RED, '青茶': TeaCategory.OOLONG,
    '白茶': TeaCategory.WHITE, '黄茶': TeaCategory.YELLOW, '黑茶': TeaCategory.DARK,
    '花草茶': TeaCategory.FLOWER,
  };
  return map[name];
}

const SECOND_LEVEL_CATEGORIES = [
  '绿茶', '红茶', '青茶', '白茶', '黄茶', '黑茶', '花草茶',
  '茶壶', '茶杯', '茶盘茶台', '茶道配件',
  '茶食品', '礼盒套装', '茶叶罐/包装',
  '泡茶水', '茶书茶画', '茶香/香道',
];

const stats: StatCardData[] = [];

/* ── 品牌排名数据 ── */
type RankPeriod = 'month' | 'year' | 'oneYear';

const rankData: Record<RankPeriod, {
  salesAmount: { name: string; value: number }[];
  profitTotal: { name: string; value: number }[];
  salesQuantity: { name: string; value: number }[];
}> = {
  month: {
    salesAmount: [
      { name: '大益', value: 286000 },
      { name: '八马', value: 235000 },
      { name: '中茶', value: 198000 },
      { name: '天福茗茶', value: 172000 },
      { name: '正山堂', value: 156000 },
    ],
    profitTotal: [
      { name: '大益', value: 85600 },
      { name: '八马', value: 72800 },
      { name: '正山堂', value: 62400 },
      { name: '中茶', value: 55200 },
      { name: '品品香', value: 48600 },
    ],
    salesQuantity: [
      { name: '八马', value: 1280 },
      { name: '大益', value: 1150 },
      { name: '天福茗茶', value: 980 },
      { name: '中茶', value: 860 },
      { name: '张一元', value: 720 },
    ],
  },
  year: {
    salesAmount: [
      { name: '大益', value: 3280000 },
      { name: '八马', value: 2760000 },
      { name: '中茶', value: 2350000 },
      { name: '天福茗茶', value: 1980000 },
      { name: '西湖牌', value: 1860000 },
    ],
    profitTotal: [
      { name: '大益', value: 985000 },
      { name: '八马', value: 862000 },
      { name: '中茶', value: 728000 },
      { name: '正山堂', value: 656000 },
      { name: '品品香', value: 580000 },
    ],
    salesQuantity: [
      { name: '八马', value: 15200 },
      { name: '大益', value: 13800 },
      { name: '天福茗茶', value: 11600 },
      { name: '中茶', value: 10200 },
      { name: '张一元', value: 8600 },
    ],
  },
  oneYear: {
    salesAmount: [
      { name: '大益', value: 3050000 },
      { name: '八马', value: 2560000 },
      { name: '中茶', value: 2150000 },
      { name: '天福茗茶', value: 1820000 },
      { name: '西湖牌', value: 1720000 },
    ],
    profitTotal: [
      { name: '大益', value: 920000 },
      { name: '八马', value: 798000 },
      { name: '中茶', value: 695000 },
      { name: '正山堂', value: 605000 },
      { name: '品品香', value: 530000 },
    ],
    salesQuantity: [
      { name: '八马', value: 14200 },
      { name: '大益', value: 12900 },
      { name: '天福茗茶', value: 10900 },
      { name: '中茶', value: 9600 },
      { name: '张一元', value: 8100 },
    ],
  },
};

const barColors = ['#CB405D', '#F18F4D', '#0DAFC6', '#27254B', '#5F4027'];

function formatAmount(v: number) {
  if (v >= 10000) return `¥${(v / 10000).toFixed(1)}万`;
  return `¥${v.toLocaleString()}`;
}

function RankBarChart({ title, data, period, onPeriodChange }: { title: string; data: { name: string; value: number }[]; period: RankPeriod; onPeriodChange: (p: RankPeriod) => void }) {
  const max = Math.max(...data.map((d) => d.value));
  const isQuantity = title.includes('数量');

  function formatValue(v: number) {
    if (isQuantity) return v.toLocaleString();
    if (v >= 10000) return `¥${(v / 10000).toFixed(1)}万`;
    return `¥${v.toLocaleString()}`;
  }

  const periods: { key: RankPeriod; label: string }[] = [
    { key: 'month', label: '当月' },
    { key: 'year', label: '当年' },
    { key: 'oneYear', label: '一年内' },
  ];

  return (
    <Card title={title} className="rank-chart-card" headerRight={
      <div className="rank-period-toggle">
        {periods.map((p) => (
          <button key={p.key} className={`rank-period-btn${period === p.key ? ' active' : ''}`} onClick={() => onPeriodChange(p.key)}>{p.label}</button>
        ))}
      </div>
    }>
      <div className="rank-chart">
        {data.map((item, i) => (
          <div key={item.name} className="rank-chart-row">
            <span className="rank-chart-rank">{i + 1}</span>
            <span className="rank-chart-name">{item.name}</span>
            <div className="rank-chart-bar-wrap">
              <div className="rank-chart-bar" style={{ width: `${(item.value / max) * 100}%`, background: barColors[i] }} />
            </div>
            <span className="rank-chart-value">{formatValue(item.value)}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

const brandItems: BrandItem[] = [
  /* ── 绿茶 ── */
  {
    id: '1', code: '001', name: '西湖牌', logo: '', owner: '杭州西湖茶叶有限公司',
    introduction: '始创于1949年，西湖龙井茶核心产区标杆品牌，传承传统炒制技艺', requirements: '需提供原产地证明，品质符合GB/T 18650标准', policy: '年度返利3%，季度结算', series: ['明前龙井', '雨前龙井', '龙井红茶'],
    trademarkCert: ['西湖龙井地理标志.pdf'], jdStoreUrl: 'https://xihupai.jd.com', tmallStoreUrl: 'https://xihupai.tmall.com',
    contactPerson: '王明华', contactPhone: '0571-8765****', address: '浙江省杭州市西湖区龙井路88号',
    mainCategories: ['绿茶'], productCount: 8, supplierCount: 3,
    website: 'https://www.xihupai.com', cooperationDate: '2023-03-15',
  },
  {
    id: '2', code: '002', name: '卢正浩', logo: '', owner: '杭州正浩茶叶有限公司',
    introduction: '西湖龙井知名品牌，以梅家坞龙井为核心，传承卢正浩制茶技艺', requirements: '需提供原产地证明及品牌授权', policy: '年度返利3%，季度结算', series: ['梅家坞龙井', '明前特级', '雨前一级'],
    trademarkCert: ['卢正浩商标注册证.pdf'], jdStoreUrl: 'https://luzhenghao.jd.com', tmallStoreUrl: 'https://luzhenghao.tmall.com',
    contactPerson: '卢江梅', contactPhone: '0571-8666****', address: '浙江省杭州市西湖区梅家坞村',
    mainCategories: ['绿茶'], productCount: 6, supplierCount: 2,
    website: 'https://www.luzhenghao.com', cooperationDate: '2023-05-20',
  },
  {
    id: '3', code: '003', name: '竹叶青', logo: '', owner: '四川省峨眉山竹叶青茶业有限公司',
    introduction: '峨眉高山绿茶代表品牌，中国高端绿茶领军者，多次作为国礼赠送外宾', requirements: '需具备品牌授权，门店装修符合品牌标准', policy: '首批进货额≥30万，年度返利4%', series: ['品味级', '静心级', '论道级'],
    trademarkCert: ['竹叶青商标注册证.pdf'], jdStoreUrl: 'https://zhuyeqing.jd.com', tmallStoreUrl: 'https://zhuyeqing.tmall.com',
    contactPerson: '唐先洪', contactPhone: '0833-552****', address: '四川省乐山市峨眉山市佛光东路竹叶青茶业',
    mainCategories: ['绿茶'], productCount: 5, supplierCount: 2,
    website: 'https://www.zhuyeqing.com', cooperationDate: '2023-08-10',
  },
  {
    id: '4', code: '004', name: '谢裕大', logo: '', owner: '谢裕大茶叶股份有限公司',
    introduction: '黄山毛峰创始品牌，始创于1875年，中华老字号，黄山毛峰国家标准制定者', requirements: '需提供品牌授权书，具备绿茶冷藏条件', policy: '年度返利3%，提供品牌物料支持', series: ['黄山毛峰', '太平猴魁', '祁门红茶'],
    trademarkCert: ['谢裕大商标注册证.pdf'], jdStoreUrl: 'https://xieyuda.jd.com', tmallStoreUrl: 'https://xieyuda.tmall.com',
    contactPerson: '谢明之', contactPhone: '0559-351****', address: '安徽省黄山市徽州区谢裕大茶文化产业园',
    mainCategories: ['绿茶'], productCount: 7, supplierCount: 2,
    website: 'https://www.xieyuda.com', cooperationDate: '2024-01-15',
  },
  {
    id: '5', code: '005', name: '猴坑', logo: '', owner: '黄山市猴坑茶业有限公司',
    introduction: '太平猴魁原产地核心品牌，太平猴魁国家标准制定单位，非遗制作技艺传承', requirements: '需具备绿茶专业冷藏仓储', policy: '年度返利2.5%，季度结算', series: ['猴魁极品', '猴魁特级', '猴魁一级'],
    trademarkCert: ['猴坑商标注册证.pdf'], jdStoreUrl: 'https://houkeng.jd.com', tmallStoreUrl: 'https://houkeng.tmall.com',
    contactPerson: '方继凡', contactPhone: '0559-853****', address: '安徽省黄山市黄山区新明乡猴坑村',
    mainCategories: ['绿茶'], productCount: 4, supplierCount: 1,
    website: 'https://www.houkeng.com', cooperationDate: '2024-06-01',
  },
  /* ── 红茶 ── */
  {
    id: '6', code: '006', name: '正山堂', logo: '', owner: '福建正山堂茶业有限责任公司',
    introduction: '正山小种红茶发源地，金骏眉创始品牌，红茶行业标准制定者', requirements: '需提供专业红茶仓储条件，温度15-25℃湿度≤60%', policy: '首批进货额≥30万，年度返利3.5%', series: ['金骏眉', '银骏眉', '正山小种'],
    trademarkCert: ['正山堂商标注册证.pdf'], jdStoreUrl: 'https://zhengshantang.jd.com', tmallStoreUrl: 'https://zhengshantang.tmall.com',
    contactPerson: '江元勋', contactPhone: '0599-510****', address: '福建省南平市武夷山市星村镇桐木村',
    mainCategories: ['红茶'], productCount: 5, supplierCount: 2,
    website: 'https://www.zhengshantang.com', cooperationDate: '2023-06-20',
  },
  {
    id: '7', code: '007', name: '凤牌', logo: '', owner: '云南滇红集团股份有限公司',
    introduction: '滇红红茶创始品牌，1939年冯绍裘先生创制，凤庆滇红发源地', requirements: '需具备红茶专业仓储条件', policy: '年度返利3%，提供品鉴培训支持', series: ['经典58', '金芽红茶', '凤庆毛尖'],
    trademarkCert: ['凤牌商标注册证.pdf'], jdStoreUrl: 'https://fengpai.jd.com', tmallStoreUrl: 'https://fengpai.tmall.com',
    contactPerson: '王天权', contactPhone: '0883-421****', address: '云南省临沧市凤庆县滇红集团',
    mainCategories: ['红茶'], productCount: 4, supplierCount: 2,
    website: 'https://www.fengpai.com', cooperationDate: '2024-07-01',
  },
  {
    id: '8', code: '008', name: '天之红', logo: '', owner: '安徽省祁门红茶发展有限公司',
    introduction: '祁门红茶代表品牌，祁红非遗制作技艺传承单位，祁门红茶国家标准起草者', requirements: '需具备红茶专业仓储，恒温恒湿', policy: '年度返利3%，季度结算', series: ['祁红毛峰', '祁红香螺', '祁红工夫'],
    trademarkCert: ['天之红商标注册证.pdf'], jdStoreUrl: 'https://tianzhihong.jd.com', tmallStoreUrl: 'https://tianzhihong.tmall.com',
    contactPerson: '王昶', contactPhone: '0559-451****', address: '安徽省黄山市祁门县天之红祁门红茶产业园',
    mainCategories: ['红茶'], productCount: 5, supplierCount: 2,
    website: 'https://www.tianzhihong.com', cooperationDate: '2024-03-10',
  },
  {
    id: '9', code: '009', name: '祥源茶', logo: '', owner: '祥源茶业股份有限公司',
    introduction: '祁门红茶新锐品牌，兼营白茶与普洱，拥有祁门红茶核心产区茶园基地', requirements: '需具备品牌运营经验及专业仓储', policy: '年度返利3.5%，提供品鉴培训', series: ['祁红皇茶', '祁红国色', '白牡丹'],
    trademarkCert: ['祥源茶商标注册证.pdf'], jdStoreUrl: 'https://xiangyuancha.jd.com', tmallStoreUrl: 'https://xiangyuancha.tmall.com',
    contactPerson: '邓增永', contactPhone: '0559-452****', address: '安徽省黄山市祁门县祥源茶业产业园',
    mainCategories: ['红茶', '白茶'], productCount: 6, supplierCount: 2,
    website: 'https://www.xiangyuancha.com', cooperationDate: '2024-09-01',
  },
  /* ── 青茶 ── */
  {
    id: '10', code: '010', name: '八马', logo: '', owner: '八马茶业股份有限公司',
    introduction: '中国茶业领军品牌，铁观音十三代传人，全国连锁门店超3000家', requirements: '需具备八马品牌授权书，门店面积不低于80㎡', policy: '首批进货额≥50万，年度返利5%', series: ['赛珍珠铁观音', '浓香铁观音', '陈皮普洱'],
    trademarkCert: ['八马商标注册证.pdf'], jdStoreUrl: 'https://bama.jd.com', tmallStoreUrl: 'https://bama.tmall.com',
    contactPerson: '林文杰', contactPhone: '0595-2345****', address: '福建省泉州市安溪县八马茶业大厦',
    mainCategories: ['青茶'], productCount: 12, supplierCount: 4,
    website: 'https://www.bama.com', cooperationDate: '2022-08-01',
  },
  {
    id: '11', code: '011', name: '武夷星', logo: '', owner: '武夷星茶业有限公司',
    introduction: '武夷岩茶龙头企业，大红袍国家标准起草单位，拥有武夷山核心正岩茶园', requirements: '需具备岩茶专业仓储条件，避光防潮', policy: '年度返利4%，提供品牌推广支持', series: ['大红袍', '肉桂', '水仙'],
    trademarkCert: ['武夷星商标注册证.pdf'], jdStoreUrl: 'https://wuyixing.jd.com', tmallStoreUrl: 'https://wuyixing.tmall.com',
    contactPerson: '何一心', contactPhone: '0599-520****', address: '福建省南平市武夷山市武夷星茶业园区',
    mainCategories: ['青茶'], productCount: 8, supplierCount: 3,
    website: 'https://www.wuyixing.com', cooperationDate: '2023-04-15',
  },
  {
    id: '12', code: '012', name: '海堤', logo: '', owner: '厦门茶叶进出口有限公司',
    introduction: '中茶旗下乌龙茶品牌，厦门出口茶老字号，海堤红深受东南亚市场欢迎', requirements: '需具备品牌授权及出口资质', policy: '年度返利3%，季度结算', series: ['海堤红', '海堤水仙', '海堤肉桂'],
    trademarkCert: ['海堤商标注册证.pdf'], jdStoreUrl: 'https://haidi.jd.com', tmallStoreUrl: 'https://haidi.tmall.com',
    contactPerson: '王贵卿', contactPhone: '0592-601****', address: '福建省厦门市湖里区厦门茶叶进出口公司',
    mainCategories: ['青茶'], productCount: 6, supplierCount: 2,
    website: 'https://www.chinatea.com', cooperationDate: '2023-10-20',
  },
  /* ── 白茶 ── */
  {
    id: '13', code: '013', name: '品品香', logo: '', owner: '福建品品香茶业有限公司',
    introduction: '福鼎白茶龙头企业，白茶国家标准起草单位，拥有核心茶园基地', requirements: '需具备白茶专业仓储条件，恒温恒湿', policy: '年度返利4%，提供品牌物料支持', series: ['白毫银针', '白牡丹', '寿眉'],
    trademarkCert: ['品品香商标注册证.pdf'], jdStoreUrl: 'https://pinpinxiang.jd.com', tmallStoreUrl: 'https://pinpinxiang.tmall.com',
    contactPerson: '邵克平', contactPhone: '0593-766****', address: '福建省宁德市福鼎市点头镇品品香茶业',
    mainCategories: ['白茶'], productCount: 7, supplierCount: 2,
    website: 'https://www.pinpinxiang.com', cooperationDate: '2023-09-01',
  },
  {
    id: '14', code: '014', name: '绿雪芽', logo: '', owner: '福建省天湖茶业有限公司',
    introduction: '福鼎白茶知名品牌，太姥山核心产区，白茶老茶标杆，老白茶收藏市场领先', requirements: '需具备白茶专业仓储，避光防潮', policy: '年度返利3%，提供品牌推广支持', series: ['绿雪芽银针', '绿雪芽牡丹', '老白茶'],
    trademarkCert: ['绿雪芽商标注册证.pdf'], jdStoreUrl: 'https://lvxueya.jd.com', tmallStoreUrl: 'https://lvxueya.tmall.com',
    contactPerson: '林有希', contactPhone: '0593-785****', address: '福建省宁德市福鼎市太姥山镇天湖茶业',
    mainCategories: ['白茶'], productCount: 5, supplierCount: 2,
    website: 'https://www.lvxueya.com', cooperationDate: '2024-05-15',
  },
  /* ── 黄茶 ── */
  {
    id: '15', code: '015', name: '君山', logo: '', owner: '湖南省君山银针茶业有限公司',
    introduction: '黄茶代表品牌，君山银针为中国十大名茶之一，黄茶非遗制作技艺传承', requirements: '需具备黄茶专业仓储，避光低温保存', policy: '年度返利2.5%，提供品牌推广支持', series: ['君山银针', '君山毛尖', '黄小茶'],
    trademarkCert: ['君山商标注册证.pdf'], jdStoreUrl: 'https://junshan.jd.com', tmallStoreUrl: 'https://junshan.tmall.com',
    contactPerson: '刘胜辉', contactPhone: '0730-822****', address: '湖南省岳阳市君山区君山银针产业园',
    mainCategories: ['黄茶'], productCount: 3, supplierCount: 1,
    website: 'https://www.junshan.com', cooperationDate: '2024-04-10',
  },
  {
    id: '16', code: '016', name: '蒙顶山茶', logo: '', owner: '四川蒙顶山茶业有限公司',
    introduction: '蒙顶黄芽原产地品牌，蒙山茶传统制作技艺非遗传承，世界茶文化发源地', requirements: '需具备黄茶专业冷藏条件', policy: '年度返利2%，季度结算', series: ['蒙顶黄芽', '蒙顶甘露', '蒙顶石花'],
    trademarkCert: ['蒙顶山茶商标注册证.pdf'], jdStoreUrl: 'https://mengding.jd.com', tmallStoreUrl: 'https://mengding.tmall.com',
    contactPerson: '蒋丹', contactPhone: '0835-322****', address: '四川省雅安市名山区蒙顶山茶业园区',
    mainCategories: ['黄茶', '绿茶'], productCount: 4, supplierCount: 1,
    website: 'https://www.mengdingshan.com', cooperationDate: '2024-08-01',
  },
  /* ── 黑茶 ── */
  {
    id: '17', code: '017', name: '大益', logo: '', owner: '云南大益茶业集团有限公司',
    introduction: '普洱茶行业标杆，勐海茶厂传承，7542被誉为评判普洱茶的标准', requirements: '需具备普洱茶专业仓储，温湿度可调控', policy: '首批进货额≥80万，年度返利6%，提供品鉴培训', series: ['7542生茶', '7572熟茶', '金针白莲'],
    trademarkCert: ['大益商标注册证.pdf'], jdStoreUrl: 'https://dayi.jd.com', tmallStoreUrl: 'https://dayi.tmall.com',
    contactPerson: '吴远之', contactPhone: '0691-512****', address: '云南省西双版纳州勐海县勐海茶厂',
    mainCategories: ['黑茶'], productCount: 10, supplierCount: 3,
    website: 'https://www.dayi.com', cooperationDate: '2022-05-18',
  },
  {
    id: '18', code: '018', name: '白沙溪', logo: '', owner: '湖南省白沙溪茶厂股份有限公司',
    introduction: '安化黑茶标杆品牌，千两茶制作技艺非遗传承，安化黑茶国家标准起草单位', requirements: '需具备黑茶专业仓储，通风干燥环境', policy: '年度返利3%，季度结算', series: ['千两茶', '百两茶', '茯砖茶'],
    trademarkCert: ['白沙溪商标注册证.pdf'], jdStoreUrl: 'https://baishaxi.jd.com', tmallStoreUrl: 'https://baishaxi.tmall.com',
    contactPerson: '刘新安', contactPhone: '0737-722****', address: '湖南省益阳市安化县小淹镇白沙溪茶厂',
    mainCategories: ['黑茶'], productCount: 6, supplierCount: 2,
    website: 'https://www.baishaxi.com', cooperationDate: '2024-03-15',
  },
  {
    id: '19', code: '019', name: '澜沧古茶', logo: '', owner: '澜沧古茶有限公司',
    introduction: '普洱古树茶代表品牌，景迈山古茶园核心资源，古树茶市场领军者', requirements: '需具备普洱茶专业仓储，温湿度可调控', policy: '年度返利4%，提供品鉴培训支持', series: ['001大饼', '0085熟茶', '古树生茶'],
    trademarkCert: ['澜沧古茶商标注册证.pdf'], jdStoreUrl: 'https://lancanggucha.jd.com', tmallStoreUrl: 'https://lancanggucha.tmall.com',
    contactPerson: '杜春峄', contactPhone: '0879-722****', address: '云南省普洱市澜沧拉祜族自治县澜沧古茶',
    mainCategories: ['黑茶'], productCount: 5, supplierCount: 2,
    website: 'https://www.lancanggucha.com', cooperationDate: '2023-11-20',
  },
  {
    id: '20', code: '020', name: '陈升号', logo: '', owner: '陈升茶业有限公司',
    introduction: '普洱茶知名品牌，老班章独家合作商，高端普洱茶市场标杆', requirements: '需具备高端普洱专业仓储条件', policy: '首批进货额≥50万，年度返利5%', series: ['老班章', '霸王青饼', '陈升一号'],
    trademarkCert: ['陈升号商标注册证.pdf'], jdStoreUrl: 'https://chenshenghao.jd.com', tmallStoreUrl: 'https://chenshenghao.tmall.com',
    contactPerson: '陈升河', contactPhone: '0691-513****', address: '云南省西双版纳州勐海县陈升茶业',
    mainCategories: ['黑茶'], productCount: 4, supplierCount: 2,
    website: 'https://www.chenshenghao.com', cooperationDate: '2024-02-10',
  },
  {
    id: '21', code: '021', name: '老同志', logo: '', owner: '安宁海湾茶业有限公司',
    introduction: '普洱茶知名品牌，原勐海茶厂厂长邹炳良创立，普洱茶熟茶工艺革新者', requirements: '需具备普洱茶专业仓储条件', policy: '年度返利3%，季度结算', series: ['9978熟茶', '9948生茶', '海湾一号'],
    trademarkCert: ['老同志商标注册证.pdf'], jdStoreUrl: 'https://laotongzhi.jd.com', tmallStoreUrl: 'https://laotongzhi.tmall.com',
    contactPerson: '邹炳良', contactPhone: '0871-687****', address: '云南省安宁市海湾茶业',
    mainCategories: ['黑茶'], productCount: 5, supplierCount: 2,
    website: 'https://www.laotongzhi.com', cooperationDate: '2023-12-01',
  },
  /* ── 花草茶 ── */
  {
    id: '22', code: '022', name: '张一元', logo: '', owner: '北京张一元茶叶有限责任公司',
    introduction: '百年老字号，始创于1900年，茉莉花茶制作技艺入选国家级非遗', requirements: '需通过品牌方资质审核，具备冷链仓储条件', policy: '年度返利4%，季度结算，提供品牌宣传支持', series: ['茉莉龙毫', '茉莉毛尖', '茉莉云雾'],
    trademarkCert: ['张一元商标注册证.pdf'], jdStoreUrl: 'https://zhangyiyuan.jd.com', tmallStoreUrl: 'https://zhangyiyuan.tmall.com',
    contactPerson: '赵国强', contactPhone: '010-6303****', address: '北京市西城区大栅栏街22号',
    mainCategories: ['绿茶', '花草茶'], productCount: 6, supplierCount: 2,
    website: 'https://www.zhangyiyuan.com', cooperationDate: '2023-01-10',
  },
  {
    id: '23', code: '023', name: '吴裕泰', logo: '', owner: '北京吴裕泰茶业股份有限公司',
    introduction: '始创于1887年，中华老字号，茉莉花茶窨制技艺传承百年', requirements: '需通过品牌方资质审核，具备茶叶专业仓储', policy: '年度返利3%，季度结算', series: ['茉莉雪毫', '茉莉龙珠', '云雾绿茶'],
    trademarkCert: ['吴裕泰商标注册证.pdf'], jdStoreUrl: 'https://wuyutai.jd.com', tmallStoreUrl: 'https://wuyutai.tmall.com',
    contactPerson: '孙丹威', contactPhone: '010-6401****', address: '北京市东城区东四北大街44号',
    mainCategories: ['绿茶', '花草茶'], productCount: 5, supplierCount: 2,
    website: 'https://www.wuyutai.com', cooperationDate: '2024-02-20',
  },
  {
    id: '24', code: '024', name: '春伦', logo: '', owner: '福建春伦茶业集团有限公司',
    introduction: '福州茉莉花茶代表品牌，茉莉花茶窨制技艺非遗传承单位', requirements: '需具备花茶专业仓储条件', policy: '年度返利2%，季度结算', series: ['茉莉银针', '茉莉龙珠', '福州花茶'],
    trademarkCert: ['春伦商标注册证.pdf'], jdStoreUrl: '', tmallStoreUrl: 'https://chunlun.tmall.com',
    contactPerson: '傅天龙', contactPhone: '0591-8376****', address: '福建省福州市仓山区城门镇春伦茶业',
    mainCategories: ['绿茶', '花草茶'], productCount: 3, supplierCount: 1,
    website: 'https://www.chunlun.com', cooperationDate: '2024-10-01',
  },
  /* ── 综合品牌 ── */
  {
    id: '25', code: '025', name: '中茶', logo: '', owner: '中国茶叶股份有限公司',
    introduction: '中粮集团旗下，新中国第一家国有茶叶公司，全品类茶业综合品牌', requirements: '需具备品牌运营资质，有成熟销售渠道', policy: '年度返利5%，提供全渠道营销支持', series: ['中茶红印', '中茶绿印', '海堤红茶'],
    trademarkCert: ['中茶商标注册证.pdf'], jdStoreUrl: 'https://zhongcha.jd.com', tmallStoreUrl: 'https://zhongcha.tmall.com',
    contactPerson: '王震', contactPhone: '010-6505****', address: '北京市朝阳区朝阳门南大街8号中粮福临门大厦',
    mainCategories: ['红茶', '绿茶', '黑茶'], productCount: 9, supplierCount: 4,
    website: 'https://www.zhongcha.com', cooperationDate: '2022-01-15',
  },
  {
    id: '26', code: '026', name: '天福茗茶', logo: '', owner: '天福集团',
    introduction: '综合茶业集团，涵盖六大茶类，全国连锁门店超1300家', requirements: '需具备品牌运营经验，门店面积≥100㎡', policy: '首批进货额≥40万，年度返利4.5%', series: ['天福绿茶', '天福乌龙', '天福普洱'],
    trademarkCert: ['天福茗茶商标注册证.pdf'], jdStoreUrl: 'https://tenfu.jd.com', tmallStoreUrl: 'https://tenfu.tmall.com',
    contactPerson: '李瑞河', contactPhone: '0596-388****', address: '福建省漳州市漳浦县天福茶业园区',
    mainCategories: ['青茶', '绿茶', '黑茶'], productCount: 8, supplierCount: 5,
    website: 'https://www.tenfu.com', cooperationDate: '2022-11-01',
  },
  {
    id: '27', code: '027', name: '小罐茶', logo: '', owner: '北京小罐茶业有限公司',
    introduction: '高端茶业新锐品牌，大师制茶标准化，全品类覆盖，创新小罐包装', requirements: '需具备品牌运营经验，门店符合品牌形象标准', policy: '首批进货额≥60万，年度返利5%，提供全渠道支持', series: ['大师系列', '金罐系列', '银罐系列'],
    trademarkCert: ['小罐茶商标注册证.pdf'], jdStoreUrl: 'https://xiaoguancha.jd.com', tmallStoreUrl: 'https://xiaoguancha.tmall.com',
    contactPerson: '杜国楹', contactPhone: '010-5900****', address: '北京市朝阳区建国路93号万达广场',
    mainCategories: ['绿茶', '红茶', '青茶', '白茶', '黑茶', '黄茶'], productCount: 15, supplierCount: 6,
    website: 'https://www.xiaoguancha.com', cooperationDate: '2023-07-01',
  },
];

/** 新增品牌表单初始值 */
const emptyForm = {
  name: '', owner: '', introduction: '', requirements: '', policy: '',
  mainCategories: [] as string[], series: [] as string[],
  jdStoreUrl: '', tmallStoreUrl: '', website: '',
  contactPerson: '', contactPhone: '', address: '',
};

export default function ProductBrand() {
  const navigate = useNavigate();
  const [filterKeyword, setFilterKeyword] = useState('');
  const [filterCategory, setFilterCategory] = useState('主营品类');
  const [salesAmountPeriod, setSalesAmountPeriod] = useState<RankPeriod>('month');
  const [profitTotalPeriod, setProfitTotalPeriod] = useState<RankPeriod>('month');
  const [salesQuantityPeriod, setSalesQuantityPeriod] = useState<RankPeriod>('month');
  const [showDrawer, setShowDrawer] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });
  const [newSeries, setNewSeries] = useState('');
  const [showSeriesInput, setShowSeriesInput] = useState(false);

  const filteredItems = brandItems.filter((b) => {
    if (filterKeyword && !b.name.includes(filterKeyword) && !b.code.toLowerCase().includes(filterKeyword.toLowerCase()) && !b.owner.includes(filterKeyword)) return false;
    if (filterCategory !== '主营品类' && !b.mainCategories.includes(filterCategory)) return false;
    return true;
  });

  const handleRowClick = (id: string) => {
    navigate(`/product/product-brand/${id}`);
  };

  const handleOpenDrawer = () => {
    setForm({ ...emptyForm });
    setNewSeries('');
    setShowSeriesInput(false);
    setShowDrawer(true);
  };

  const handleCloseDrawer = () => {
    setShowDrawer(false);
  };

  const handleToggleCategory = (cat: string) => {
    setForm((prev) => ({
      ...prev,
      mainCategories: prev.mainCategories.includes(cat)
        ? prev.mainCategories.filter((c) => c !== cat)
        : [...prev.mainCategories, cat],
    }));
  };

  const handleAddSeries = () => {
    if (newSeries.trim()) {
      setForm((prev) => ({ ...prev, series: [...prev.series, newSeries.trim()] }));
      setNewSeries('');
      setShowSeriesInput(false);
    }
  };

  const handleRemoveSeries = (idx: number) => {
    setForm((prev) => ({ ...prev, series: prev.series.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = () => {
    // 模拟提交
    setShowDrawer(false);
  };

  /** 生成下一个品牌编号 */
  const nextCode = String(brandItems.length + 1).padStart(3, '0');

  return (
    <>
      <ContentHeader title="品牌管理" breadcrumbs={['商品', '品牌管理']} />
      <div className="content-body">
        {/* 品牌排名 */}
        <div className="rank-section">
          <div className="rank-charts-grid">
            <RankBarChart title="销售金额 TOP5" data={rankData[salesAmountPeriod].salesAmount} period={salesAmountPeriod} onPeriodChange={setSalesAmountPeriod} />
            <RankBarChart title="利润总额 TOP5" data={rankData[profitTotalPeriod].profitTotal} period={profitTotalPeriod} onPeriodChange={setProfitTotalPeriod} />
            <RankBarChart title="销售数量 TOP5" data={rankData[salesQuantityPeriod].salesQuantity} period={salesQuantityPeriod} onPeriodChange={setSalesQuantityPeriod} />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
          <FilterBar>
            <input className="filter-input" placeholder="搜索品牌名称、编码、所属公司..." value={filterKeyword} onChange={(e) => setFilterKeyword(e.target.value)} />
            <select className="filter-select" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
              <option>主营品类</option>
              {SECOND_LEVEL_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </FilterBar>
          <Button onClick={handleOpenDrawer}><PlusIcon />新增品牌</Button>
        </div>
        <Card>
          <Table
            headers={['品牌LOGO', '品牌名称', '品牌编号', '品牌所属', '主营品类', '商品数量', '供应商数量', '联系人', '联系电话', '操作']}
            rows={filteredItems.map((b) => [
              <div className="brand-logo-cell" onClick={() => handleRowClick(b.id)} style={{ cursor: 'pointer' }}>
                {b.logo ? <img src={b.logo} alt={b.name} className="brand-logo-img" /> : <div className="brand-logo-placeholder">{b.name[0]}</div>}
              </div>,
              <span style={{ fontWeight: 'var(--font-medium)', cursor: 'pointer', color: 'var(--color-module-current-base)' }} onClick={() => handleRowClick(b.id)}>{b.name}</span>,
              <span className="mono">{b.code}</span>,
              <span style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block' }} title={b.owner}>{b.owner}</span>,
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {b.mainCategories.map((c) => {
                  const cat = nameToTeaCategory(c);
                  return cat ? <Tag key={c} category={cat} /> : <span key={c} className="brand-series-tag">{c}</span>;
                })}
              </div>,
              <span className="mono">{b.productCount}</span>,
              <span className="mono">{b.supplierCount}</span>,
              <span>{b.contactPerson}</span>,
              <span className="mono">{b.contactPhone}</span>,
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <Button variant="ghost" size="sm" onClick={() => handleRowClick(b.id)} style={{ color: '#01795D' }}>详情</Button>
                <Button variant="ghost" size="sm" style={{ color: '#FD742D' }}>删除</Button>
              </div>,
            ])}
          />
        </Card>
      </div>

      {/* 右侧滑出抽屉 - 新增品牌 */}
      {showDrawer && (
        <div className="drawer-overlay" onClick={handleCloseDrawer}>
          <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <span className="drawer-title">新增品牌</span>
              <button className="drawer-close" onClick={handleCloseDrawer}>
                <svg viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </button>
            </div>
            <div className="drawer-body">
              {/* LOGO 上传 */}
              <div style={{ marginBottom: 'var(--space-5)' }}>
                <label className="drawer-label">品牌LOGO</label>
                <div style={{ width: 75, height: 75, border: '2px dashed var(--color-neutral-300)', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--color-neutral-400)', fontSize: 'var(--text-xs)', gap: '2px', transition: 'var(--transition-fast)' }}>
                  <svg viewBox="0 0 20 20" fill="none" style={{ width: 20, height: 20 }}><path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  上传LOGO
                  <input type="file" accept="image/jpeg,image/png,image/gif,image/webp" style={{ display: 'none' }} />
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-400)', marginTop: '4px' }}>正方形，最大500×500像素</div>
              </div>

              {/* 基本信息 */}
              <div className="drawer-section-title">基本信息</div>
              <div className="drawer-form-row">
                <div className="drawer-form-field">
                  <label className="drawer-label">品牌编号</label>
                  <input className="detail-input" value={nextCode} readOnly style={{ background: 'var(--color-neutral-100)', color: 'var(--color-neutral-500)' }} />
                </div>
                <div className="drawer-form-field">
                  <label className="drawer-label">品牌名称 <span style={{ color: '#FD742D' }}>*</span></label>
                  <input className="detail-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="请输入品牌名称" />
                </div>
              </div>
              <div className="drawer-form-row">
                <div className="drawer-form-field">
                  <label className="drawer-label">品牌所属 <span style={{ color: '#FD742D' }}>*</span></label>
                  <input className="detail-input" value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })} placeholder="请输入所属公司" />
                </div>
                <div className="drawer-form-field">
                  <label className="drawer-label">主营品类</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginTop: '4px' }}>
                    {SECOND_LEVEL_CATEGORIES.map((cat) => (
                      <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', fontSize: 'var(--text-sm)' }}>
                        <input type="checkbox" checked={form.mainCategories.includes(cat)} onChange={() => handleToggleCategory(cat)} />
                        {cat}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="drawer-form-row" style={{ flexDirection: 'column' }}>
                <div className="drawer-form-field" style={{ width: '100%' }}>
                  <label className="drawer-label">品牌介绍</label>
                  <textarea className="detail-textarea" value={form.introduction} onChange={(e) => setForm({ ...form, introduction: e.target.value })} placeholder="请输入品牌介绍" rows={3} />
                </div>
              </div>

              {/* 联系信息 */}
              <div className="drawer-section-title">联系信息</div>
              <div className="drawer-form-row">
                <div className="drawer-form-field">
                  <label className="drawer-label">联系人</label>
                  <input className="detail-input" value={form.contactPerson} onChange={(e) => setForm({ ...form, contactPerson: e.target.value })} placeholder="请输入联系人" />
                </div>
                <div className="drawer-form-field">
                  <label className="drawer-label">联系电话</label>
                  <input className="detail-input" value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} placeholder="请输入联系电话" />
                </div>
              </div>
              <div className="drawer-form-row" style={{ flexDirection: 'column' }}>
                <div className="drawer-form-field" style={{ width: '100%' }}>
                  <label className="drawer-label">地址</label>
                  <input className="detail-input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="请输入地址" />
                </div>
              </div>

              {/* 网络地址 */}
              <div className="drawer-section-title">网络地址</div>
              <div className="drawer-form-row" style={{ flexDirection: 'column' }}>
                <div className="drawer-form-field" style={{ width: '100%' }}>
                  <label className="drawer-label">品牌官网</label>
                  <input className="detail-input" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="https://" />
                </div>
              </div>
              <div className="drawer-form-row">
                <div className="drawer-form-field">
                  <label className="drawer-label">京东店地址</label>
                  <input className="detail-input" value={form.jdStoreUrl} onChange={(e) => setForm({ ...form, jdStoreUrl: e.target.value })} placeholder="https://" />
                </div>
                <div className="drawer-form-field">
                  <label className="drawer-label">天猫店地址</label>
                  <input className="detail-input" value={form.tmallStoreUrl} onChange={(e) => setForm({ ...form, tmallStoreUrl: e.target.value })} placeholder="https://" />
                </div>
              </div>

              {/* 品牌政策与要求 */}
              <div className="drawer-section-title">品牌政策与要求</div>
              <div className="drawer-form-row" style={{ flexDirection: 'column' }}>
                <div className="drawer-form-field" style={{ width: '100%' }}>
                  <label className="drawer-label">品牌要求</label>
                  <textarea className="detail-textarea" value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} placeholder="请输入品牌要求" rows={2} />
                </div>
              </div>
              <div className="drawer-form-row" style={{ flexDirection: 'column' }}>
                <div className="drawer-form-field" style={{ width: '100%' }}>
                  <label className="drawer-label">品牌政策</label>
                  <textarea className="detail-textarea" value={form.policy} onChange={(e) => setForm({ ...form, policy: e.target.value })} placeholder="请输入品牌政策" rows={2} />
                </div>
              </div>
              <div className="drawer-form-row" style={{ flexDirection: 'column' }}>
                <div className="drawer-form-field" style={{ width: '100%' }}>
                  <label className="drawer-label">品牌系列</label>
                  <div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                      {form.series.map((s, i) => (
                        <span key={i} className="brand-series-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          {s}
                          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-neutral-400)', fontSize: 'var(--text-xs)', padding: 0, lineHeight: 1 }} onClick={() => handleRemoveSeries(i)}>✕</button>
                        </span>
                      ))}
                    </div>
                    {showSeriesInput ? (
                      <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                        <input className="detail-input" value={newSeries} onChange={(e) => setNewSeries(e.target.value)} placeholder="输入系列名称" style={{ flex: 1 }} onKeyDown={(e) => { if (e.key === 'Enter') handleAddSeries(); }} />
                        <Button variant="ghost" size="sm" onClick={() => { setShowSeriesInput(false); setNewSeries(''); }} style={{ color: 'var(--color-neutral-400)' }}>取消</Button>
                        <Button size="sm" onClick={handleAddSeries}>确认</Button>
                      </div>
                    ) : (
                      <Button variant="ghost" size="sm" onClick={() => setShowSeriesInput(true)}>+ 添加系列</Button>
                    )}
                  </div>
                </div>
              </div>

              {/* 商标证书 */}
              <div className="drawer-section-title">商标证书</div>
              <div className="drawer-form-row" style={{ flexDirection: 'column' }}>
                <div className="drawer-form-field" style={{ width: '100%' }}>
                  <Button variant="ghost" size="sm">+ 上传文件</Button>
                </div>
              </div>
            </div>
            <div className="drawer-footer">
              <Button variant="ghost" onClick={handleCloseDrawer}>取消</Button>
              <Button onClick={handleSubmit}>确认新增</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function PlusIcon() {
  return <svg viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
}
