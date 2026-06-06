import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ContentHeader from '../../components/layout/ContentHeader';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import StatusTag from '../../components/common/StatusTag';
import Tag from '../../components/common/Tag';
import Button from '../../components/common/Button';
import FilterBar from '../../components/business/FilterBar';
import { TeaCategory, BrandLevel, BrandStatus } from '../../types';
import type { StatCardData, BrandItem } from '../../types';

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

const barColors = ['var(--color-module-current-base)', 'var(--color-tea-oolong)', 'var(--color-tea-green)', 'var(--color-tea-dark)', 'var(--color-neutral-300)'];

function formatAmount(v: number) {
  if (v >= 10000) return `¥${(v / 10000).toFixed(1)}万`;
  return `¥${v.toLocaleString()}`;
}

function RankBarChart({ title, data }: { title: string; data: { name: string; value: number }[] }) {
  const max = Math.max(...data.map((d) => d.value));
  const isQuantity = title.includes('数量');

  function formatValue(v: number) {
    if (isQuantity) return v.toLocaleString();
    if (v >= 10000) return `¥${(v / 10000).toFixed(1)}万`;
    return `¥${v.toLocaleString()}`;
  }

  return (
    <Card title={title} className="rank-chart-card">
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
  {
    id: '1', code: 'BRD-XH', name: '西湖牌', logo: '', owner: '杭州西湖茶叶有限公司',
    introduction: '始创于1949年，西湖龙井茶核心产区标杆品牌，传承传统炒制技艺', requirements: '需提供原产地证明，品质符合GB/T 18650标准', policy: '年度返利3%，季度结算', series: ['明前龙井', '雨前龙井', '龙井红茶'],
    trademarkCert: '西湖龙井地理标志.pdf', jdStoreUrl: 'https://xihupai.jd.com', tmallStoreUrl: 'https://xihupai.tmall.com',
    contactPerson: '王明华', contactPhone: '0571-8765****', address: '浙江省杭州市西湖区龙井路88号',
    teaCategory: TeaCategory.GREEN, level: BrandLevel.S, status: BrandStatus.ACTIVE, productCount: 8,
    website: 'https://www.xihupai.com', cooperationDate: '2023-03-15', createdBy: '陈经理', createdAt: '2023-03-15 10:00', updatedAt: '2025-06-20 14:30',
  },
  {
    id: '2', code: 'BRD-BM', name: '八马', logo: '', owner: '八马茶业股份有限公司',
    introduction: '中国茶业领军品牌，铁观音十三代传人，全国连锁门店超3000家', requirements: '需具备八马品牌授权书，门店面积不低于80㎡', policy: '首批进货额≥50万，年度返利5%', series: ['赛珍珠铁观音', '浓香铁观音', '陈皮普洱'],
    trademarkCert: '八马商标注册证.pdf', jdStoreUrl: 'https://bama.jd.com', tmallStoreUrl: 'https://bama.tmall.com',
    contactPerson: '林文杰', contactPhone: '0595-2345****', address: '福建省泉州市安溪县八马茶业大厦',
    teaCategory: TeaCategory.OOLONG, level: BrandLevel.S, status: BrandStatus.ACTIVE, productCount: 12,
    website: 'https://www.bama.com', cooperationDate: '2022-08-01', createdBy: '陈经理', createdAt: '2022-08-01 09:30', updatedAt: '2025-07-10 16:20',
  },
  {
    id: '3', code: 'BRD-ZYY', name: '张一元', logo: '', owner: '北京张一元茶叶有限责任公司',
    introduction: '百年老字号，始创于1900年，茉莉花茶制作技艺入选国家级非遗', requirements: '需通过品牌方资质审核，具备冷链仓储条件', policy: '年度返利4%，季度结算，提供品牌宣传支持', series: ['茉莉龙毫', '茉莉毛尖', '茉莉云雾'],
    trademarkCert: '张一元商标注册证.pdf', jdStoreUrl: 'https://zhangyiyuan.jd.com', tmallStoreUrl: 'https://zhangyiyuan.tmall.com',
    contactPerson: '赵国强', contactPhone: '010-6303****', address: '北京市西城区大栅栏街22号',
    teaCategory: TeaCategory.GREEN, level: BrandLevel.A, status: BrandStatus.ACTIVE, productCount: 6,
    website: 'https://www.zhangyiyuan.com', cooperationDate: '2023-01-10', createdBy: '陈经理', createdAt: '2023-01-10 11:00', updatedAt: '2025-05-18 09:45',
  },
  {
    id: '4', code: 'BRD-ZST', name: '正山堂', logo: '', owner: '福建正山堂茶业有限责任公司',
    introduction: '正山小种红茶发源地，金骏眉创始品牌，红茶行业标准制定者', requirements: '需提供专业红茶仓储条件，温度15-25℃湿度≤60%', policy: '首批进货额≥30万，年度返利3.5%', series: ['金骏眉', '银骏眉', '正山小种'],
    trademarkCert: '正山堂商标注册证.pdf', jdStoreUrl: 'https://zhengshantang.jd.com', tmallStoreUrl: 'https://zhengshantang.tmall.com',
    contactPerson: '江元勋', contactPhone: '0599-510****', address: '福建省南平市武夷山市星村镇桐木村',
    teaCategory: TeaCategory.RED, level: BrandLevel.A, status: BrandStatus.ACTIVE, productCount: 5,
    website: 'https://www.zhengshantang.com', cooperationDate: '2023-06-20', createdBy: '陈经理', createdAt: '2023-06-20 14:00', updatedAt: '2025-06-28 11:15',
  },
  {
    id: '5', code: 'BRD-PPX', name: '品品香', logo: '', owner: '福建品品香茶业有限公司',
    introduction: '福鼎白茶龙头企业，白茶国家标准起草单位，拥有核心茶园基地', requirements: '需具备白茶专业仓储条件，恒温恒湿', policy: '年度返利4%，提供品牌物料支持', series: ['白毫银针', '白牡丹', '寿眉'],
    trademarkCert: '品品香商标注册证.pdf', jdStoreUrl: 'https://pinpinxiang.jd.com', tmallStoreUrl: 'https://pinpinxiang.tmall.com',
    contactPerson: '邵克平', contactPhone: '0593-766****', address: '福建省宁德市福鼎市点头镇品品香茶业',
    teaCategory: TeaCategory.WHITE, level: BrandLevel.A, status: BrandStatus.ACTIVE, productCount: 7,
    website: 'https://www.pinpinxiang.com', cooperationDate: '2023-09-01', createdBy: '陈经理', createdAt: '2023-09-01 10:30', updatedAt: '2025-07-05 15:00',
  },
  {
    id: '6', code: 'BRD-DY', name: '大益', logo: '', owner: '云南大益茶业集团有限公司',
    introduction: '普洱茶行业标杆，勐海茶厂传承，7542被誉为评判普洱茶的标准', requirements: '需具备普洱茶专业仓储，温湿度可调控', policy: '首批进货额≥80万，年度返利6%，提供品鉴培训', series: ['7542生茶', '7572熟茶', '金针白莲'],
    trademarkCert: '大益商标注册证.pdf', jdStoreUrl: 'https://dayi.jd.com', tmallStoreUrl: 'https://dayi.tmall.com',
    contactPerson: '吴远之', contactPhone: '0691-512****', address: '云南省西双版纳州勐海县勐海茶厂',
    teaCategory: TeaCategory.DARK, level: BrandLevel.S, status: BrandStatus.ACTIVE, productCount: 10,
    website: 'https://www.dayi.com', cooperationDate: '2022-05-18', createdBy: '陈经理', createdAt: '2022-05-18 09:00', updatedAt: '2025-07-12 10:30',
  },
  {
    id: '7', code: 'BRD-TF', name: '天福茗茶', logo: '', owner: '天福集团',
    introduction: '综合茶业集团，涵盖六大茶类，全国连锁门店超1300家', requirements: '需具备品牌运营经验，门店面积≥100㎡', policy: '首批进货额≥40万，年度返利4.5%', series: ['天福绿茶', '天福乌龙', '天福普洱'],
    trademarkCert: '天福茗茶商标注册证.pdf', jdStoreUrl: 'https://tenfu.jd.com', tmallStoreUrl: 'https://tenfu.tmall.com',
    contactPerson: '李瑞河', contactPhone: '0596-388****', address: '福建省漳州市漳浦县天福茶业园区',
    teaCategory: TeaCategory.OOLONG, level: BrandLevel.A, status: BrandStatus.ACTIVE, productCount: 8,
    website: 'https://www.tenfu.com', cooperationDate: '2022-11-01', createdBy: '陈经理', createdAt: '2022-11-01 13:30', updatedAt: '2025-06-15 09:00',
  },
  {
    id: '8', code: 'BRD-WYT', name: '吴裕泰', logo: '', owner: '北京吴裕泰茶业股份有限公司',
    introduction: '始创于1887年，中华老字号，茉莉花茶窨制技艺传承百年', requirements: '需通过品牌方资质审核，具备茶叶专业仓储', policy: '年度返利3%，季度结算', series: ['茉莉雪毫', '茉莉龙珠', '云雾绿茶'],
    trademarkCert: '吴裕泰商标注册证.pdf', jdStoreUrl: 'https://wuyutai.jd.com', tmallStoreUrl: 'https://wuyutai.tmall.com',
    contactPerson: '孙丹威', contactPhone: '010-6401****', address: '北京市东城区东四北大街44号',
    teaCategory: TeaCategory.GREEN, level: BrandLevel.B, status: BrandStatus.ACTIVE, productCount: 5,
    website: 'https://www.wuyutai.com', cooperationDate: '2024-02-20', createdBy: '陈经理', createdAt: '2024-02-20 10:00', updatedAt: '2025-05-30 14:00',
  },
  {
    id: '9', code: 'BRD-JS', name: '君山', logo: '', owner: '湖南省君山银针茶业有限公司',
    introduction: '黄茶代表品牌，君山银针为中国十大名茶之一', requirements: '需具备黄茶专业仓储，避光低温保存', policy: '年度返利2.5%，提供品牌推广支持', series: ['君山银针', '君山毛尖', '黄小茶'],
    trademarkCert: '君山商标注册证.pdf', jdStoreUrl: 'https://junshan.jd.com', tmallStoreUrl: 'https://junshan.tmall.com',
    contactPerson: '刘胜辉', contactPhone: '0730-822****', address: '湖南省岳阳市君山区君山银针产业园',
    teaCategory: TeaCategory.YELLOW, level: BrandLevel.B, status: BrandStatus.ACTIVE, productCount: 3,
    website: 'https://www.junshan.com', cooperationDate: '2024-04-10', createdBy: '陈经理', createdAt: '2024-04-10 11:30', updatedAt: '2025-06-05 16:00',
  },
  {
    id: '10', code: 'BRD-ZC', name: '中茶', logo: '', owner: '中国茶叶股份有限公司',
    introduction: '中粮集团旗下，新中国第一家国有茶叶公司，全品类茶业综合品牌', requirements: '需具备品牌运营资质，有成熟销售渠道', policy: '年度返利5%，提供全渠道营销支持', series: ['中茶红印', '中茶绿印', '海堤红茶'],
    trademarkCert: '中茶商标注册证.pdf', jdStoreUrl: 'https://zhongcha.jd.com', tmallStoreUrl: 'https://zhongcha.tmall.com',
    contactPerson: '王震', contactPhone: '010-6505****', address: '北京市朝阳区朝阳门南大街8号中粮福临门大厦',
    teaCategory: TeaCategory.RED, level: BrandLevel.S, status: BrandStatus.ACTIVE, productCount: 9,
    website: 'https://www.zhongcha.com', cooperationDate: '2022-01-15', createdBy: '陈经理', createdAt: '2022-01-15 09:00', updatedAt: '2025-07-14 10:00',
  },
  {
    id: '11', code: 'BRD-FP', name: '凤牌', logo: '', owner: '云南滇红集团股份有限公司',
    introduction: '滇红红茶创始品牌，1939年创制，凤庆滇红发源地', requirements: '需具备红茶专业仓储条件', policy: '年度返利3%，提供品鉴培训支持', series: ['经典58', '金芽红茶', '凤庆毛尖'],
    trademarkCert: '凤牌商标注册证.pdf', jdStoreUrl: 'https://fengpai.jd.com', tmallStoreUrl: 'https://fengpai.tmall.com',
    contactPerson: '王天权', contactPhone: '0883-421****', address: '云南省临沧市凤庆县滇红集团',
    teaCategory: TeaCategory.RED, level: BrandLevel.B, status: BrandStatus.ACTIVE, productCount: 4,
    website: 'https://www.fengpai.com', cooperationDate: '2024-07-01', createdBy: '陈经理', createdAt: '2024-07-01 14:00', updatedAt: '2025-06-22 11:30',
  },
  {
    id: '12', code: 'BRD-BSX', name: '白沙溪', logo: '', owner: '湖南省白沙溪茶厂股份有限公司',
    introduction: '黑茶龙头企业，安化黑茶标杆品牌，千两茶制作技艺非遗传承', requirements: '需具备黑茶专业仓储，通风干燥环境', policy: '年度返利3%，季度结算', series: ['千两茶', '百两茶', '茯砖茶'],
    trademarkCert: '白沙溪商标注册证.pdf', jdStoreUrl: 'https://baishaxi.jd.com', tmallStoreUrl: 'https://baishaxi.tmall.com',
    contactPerson: '刘新安', contactPhone: '0737-722****', address: '湖南省益阳市安化县小淹镇白沙溪茶厂',
    teaCategory: TeaCategory.DARK, level: BrandLevel.B, status: BrandStatus.ACTIVE, productCount: 6,
    website: 'https://www.baishaxi.com', cooperationDate: '2024-03-15', createdBy: '陈经理', createdAt: '2024-03-15 10:00', updatedAt: '2025-06-18 15:30',
  },
  {
    id: '13', code: 'BRD-CL', name: '春伦', logo: '', owner: '福建春伦茶业集团有限公司',
    introduction: '福州茉莉花茶代表品牌，茉莉花茶窨制技艺非遗传承单位', requirements: '需具备花茶专业仓储条件', policy: '年度返利2%，季度结算', series: ['茉莉银针', '茉莉龙珠', '福州花茶'],
    trademarkCert: '春伦商标注册证.pdf', jdStoreUrl: '', tmallStoreUrl: 'https://chunlun.tmall.com',
    contactPerson: '傅天龙', contactPhone: '0591-8376****', address: '福建省福州市仓山区城门镇春伦茶业',
    teaCategory: TeaCategory.GREEN, level: BrandLevel.C, status: BrandStatus.INACTIVE, productCount: 3,
    website: 'https://www.chunlun.com', cooperationDate: '2024-10-01', createdBy: '陈经理', createdAt: '2024-10-01 09:30', updatedAt: '2025-05-10 10:00',
  },
];

function levelToVariant(level: BrandLevel) {
  switch (level) {
    case BrandLevel.S: return 'success' as const;
    case BrandLevel.A: return 'info' as const;
    case BrandLevel.B: return 'warning' as const;
    case BrandLevel.C: return 'error' as const;
    default: return 'info' as const;
  }
}

export default function ProductBrand() {
  const navigate = useNavigate();
  const [filterKeyword, setFilterKeyword] = useState('');
  const [filterStatus, setFilterStatus] = useState('全部状态');
  const [filterTeaCategory, setFilterTeaCategory] = useState('全部茶类');
  const [filterLevel, setFilterLevel] = useState('全部等级');
  const [rankPeriod, setRankPeriod] = useState<RankPeriod>('month');

  const filteredItems = brandItems.filter((b) => {
    if (filterKeyword && !b.name.includes(filterKeyword) && !b.code.toLowerCase().includes(filterKeyword.toLowerCase()) && !b.owner.includes(filterKeyword)) return false;
    if (filterStatus === '启用' && b.status !== BrandStatus.ACTIVE) return false;
    if (filterStatus === '禁用' && b.status !== BrandStatus.INACTIVE) return false;
    if (filterLevel === 'S级' && b.level !== BrandLevel.S) return false;
    if (filterLevel === 'A级' && b.level !== BrandLevel.A) return false;
    if (filterLevel === 'B级' && b.level !== BrandLevel.B) return false;
    if (filterLevel === 'C级' && b.level !== BrandLevel.C) return false;
    const teaCategoryMap: Record<string, TeaCategory> = { '绿茶': TeaCategory.GREEN, '白茶': TeaCategory.WHITE, '黄茶': TeaCategory.YELLOW, '青茶': TeaCategory.OOLONG, '红茶': TeaCategory.RED, '黑茶': TeaCategory.DARK };
    if (filterTeaCategory !== '全部茶类' && b.teaCategory !== teaCategoryMap[filterTeaCategory]) return false;
    return true;
  });

  const handleRowClick = (id: string) => {
    navigate(`/product/product-brand/${id}`);
  };

  return (
    <>
      <ContentHeader title="品牌管理" breadcrumbs={['商品', '品牌管理']} />
      <div className="content-body">
        {/* 品牌排名 */}
        <div className="rank-section">
          <div className="rank-section-header">
            <div className="rank-period-toggle">
              <button className={`rank-period-btn${rankPeriod === 'month' ? ' active' : ''}`} onClick={() => setRankPeriod('month')}>当月</button>
              <button className={`rank-period-btn${rankPeriod === 'year' ? ' active' : ''}`} onClick={() => setRankPeriod('year')}>当年</button>
              <button className={`rank-period-btn${rankPeriod === 'oneYear' ? ' active' : ''}`} onClick={() => setRankPeriod('oneYear')}>一年内</button>
            </div>
          </div>
          <div className="rank-charts-grid">
            <RankBarChart title="销售金额 TOP5" data={rankData[rankPeriod].salesAmount} />
            <RankBarChart title="利润总额 TOP5" data={rankData[rankPeriod].profitTotal} />
            <RankBarChart title="销售数量 TOP5" data={rankData[rankPeriod].salesQuantity} />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
          <FilterBar>
            <input className="filter-input" placeholder="搜索品牌名称、编码、所属公司..." value={filterKeyword} onChange={(e) => setFilterKeyword(e.target.value)} />
            <select className="filter-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option>全部状态</option><option>启用</option><option>禁用</option>
            </select>
            <select className="filter-select" value={filterTeaCategory} onChange={(e) => setFilterTeaCategory(e.target.value)}>
              <option>全部茶类</option><option>绿茶</option><option>白茶</option><option>黄茶</option><option>青茶</option><option>红茶</option><option>黑茶</option>
            </select>
            <select className="filter-select" value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)}>
              <option>全部等级</option><option>S级</option><option>A级</option><option>B级</option><option>C级</option>
            </select>
          </FilterBar>
          <Button><PlusIcon />新增品牌</Button>
        </div>
        <Card>
          <Table
            headers={['品牌LOGO', '品牌名称', '品牌编号', '品牌所属', '所属茶类', '品牌等级', '关联商品', '联系人', '状态', '操作']}
            rows={filteredItems.map((b) => [
              <div className="brand-logo-cell" onClick={() => handleRowClick(b.id)} style={{ cursor: 'pointer' }}>
                {b.logo ? <img src={b.logo} alt={b.name} className="brand-logo-img" /> : <div className="brand-logo-placeholder">{b.name[0]}</div>}
              </div>,
              <span style={{ fontWeight: 'var(--font-medium)', cursor: 'pointer', color: 'var(--color-module-current-base)' }} onClick={() => handleRowClick(b.id)}>{b.name}</span>,
              <span className="mono">{b.code}</span>,
              <span style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block' }} title={b.owner}>{b.owner}</span>,
              <Tag category={b.teaCategory} />,
              <StatusTag variant={levelToVariant(b.level)} label={b.level + '级'} />,
              <span className="mono">{b.productCount}</span>,
              <span>{b.contactPerson}</span>,
              <StatusTag variant={b.status === BrandStatus.ACTIVE ? 'success' : 'warning'} label={b.status === BrandStatus.ACTIVE ? '启用' : '禁用'} />,
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <Button variant="ghost" size="sm" onClick={() => handleRowClick(b.id)}>详情</Button>
                <Button variant="ghost" size="sm" style={{ color: 'var(--color-semantic-error)' }}>删除</Button>
              </div>,
            ])}
          />
        </Card>
      </div>
    </>
  );
}

function PlusIcon() {
  return <svg viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
}
