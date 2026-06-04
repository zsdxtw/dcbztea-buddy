import ContentHeader from '../../components/layout/ContentHeader';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import LineChart from '../../components/charts/LineChart';
import Button from '../../components/common/Button';
import type { StatCardData } from '../../types';

const stats: StatCardData[] = [
  { label: '本月均价', value: '568', unit: '¥/kg', trend: { direction: 'down', value: '3.2%', label: '较上月' }, icon: <svg viewBox="0 0 18 18" fill="none"><path d="M3 14l3-4 3 2 3-5 3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { label: '环比变化', value: '-3.2', unit: '%', trend: { direction: 'down', value: '持续走低' }, icon: <svg viewBox="0 0 18 18" fill="none"><path d="M7 3v8M3 7l4 4 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { label: '最高价茶类', value: '白毫银针', unit: '¥960/kg', trend: { direction: 'up', value: '5.8%' }, icon: <svg viewBox="0 0 18 18" fill="none"><path d="M10 2l2.5 5 5.5.8-4 3.9.9 5.5L10 14.7 5.1 17.2l.9-5.5-4-3.9L7.5 7z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg> },
  { label: '最低价茶类', value: '六堡茶', unit: '¥180/kg', trend: { direction: 'down', value: '2.1%' }, icon: <svg viewBox="0 0 18 18" fill="none"><rect x="3" y="10" width="4" height="7" rx="0.5" stroke="currentColor" strokeWidth="1.3"/><rect x="8" y="6" width="4" height="11" rx="0.5" stroke="currentColor" strokeWidth="1.3"/><rect x="13" y="3" width="4" height="14" rx="0.5" stroke="currentColor" strokeWidth="1.3"/></svg> },
];

const priceTrendData = {
  labels: ['8月', '9月', '10月', '11月', '12月', '1月', '2月', '3月', '4月', '5月', '6月', '7月'],
  series: [
    { name: '绿茶', color: 'var(--color-tea-green)', data: [520, 510, 530, 540, 550, 580, 560, 590, 610, 570, 555, 545] },
    { name: '白茶', color: 'var(--color-tea-white)', data: [880, 870, 890, 910, 920, 960, 940, 950, 970, 930, 945, 960] },
    { name: '红茶', color: 'var(--color-tea-red)', data: [420, 410, 430, 440, 450, 480, 470, 490, 500, 460, 465, 470] },
    { name: '青茶', color: 'var(--color-tea-oolong)', data: [380, 370, 390, 400, 410, 420, 415, 430, 440, 425, 418, 410] },
    { name: '黑茶', color: 'var(--color-tea-dark)', data: [180, 175, 185, 190, 195, 200, 198, 205, 210, 195, 188, 180] },
    { name: '黄茶', color: 'var(--color-tea-yellow)', data: [720, 710, 730, 740, 750, 780, 770, 790, 800, 760, 748, 740] },
  ],
};

const priceTableData = [
  { category: '绿茶', avgPrice: '¥545/kg', lastMonth: '¥555/kg', mom: '-1.8%', yoy: '+5.2%' },
  { category: '白茶', avgPrice: '¥960/kg', lastMonth: '¥945/kg', mom: '+1.6%', yoy: '+9.1%' },
  { category: '红茶', avgPrice: '¥470/kg', lastMonth: '¥465/kg', mom: '+1.1%', yoy: '+4.7%' },
  { category: '青茶', avgPrice: '¥410/kg', lastMonth: '¥418/kg', mom: '-1.9%', yoy: '+3.8%' },
  { category: '黑茶', avgPrice: '¥180/kg', lastMonth: '¥188/kg', mom: '-4.3%', yoy: '-2.1%' },
  { category: '黄茶', avgPrice: '¥740/kg', lastMonth: '¥748/kg', mom: '-1.1%', yoy: '+6.5%' },
];

export default function PurchasePriceTrend() {
  return (
    <>
      <ContentHeader title="价格走势" breadcrumbs={['采购', '价格走势']} actions={<Button variant="ghost">导出报表</Button>} />
      <div className="content-body">
        <div className="stat-cards">
          {stats.map((s, i) => <StatCard key={i} data={s} />)}
        </div>
        <Card title="各类茶叶近12个月采购价格趋势">
          <LineChart data={priceTrendData} />
        </Card>
        <Card title="各茶类当月采购均价及环比" style={{ marginTop: 'var(--space-6)' }}>
          <Table
            headers={['茶类', '当月均价', '上月均价', '环比变化', '同比变化']}
            rows={priceTableData.map((r) => [
              <span style={{ fontWeight: 'var(--font-medium)' }}>{r.category}</span>,
              <span className="mono">{r.avgPrice}</span>,
              <span className="mono">{r.lastMonth}</span>,
              <span className="mono" style={{ color: r.mom.startsWith('+') ? 'var(--color-semantic-error)' : 'var(--color-semantic-success)' }}>{r.mom}</span>,
              <span className="mono" style={{ color: r.yoy.startsWith('+') ? 'var(--color-semantic-error)' : 'var(--color-semantic-success)' }}>{r.yoy}</span>,
            ])}
          />
        </Card>
      </div>
    </>
  );
}
