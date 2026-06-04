import ContentHeader from '../../components/layout/ContentHeader';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import LineChart from '../../components/charts/LineChart';
import Button from '../../components/common/Button';
import type { StatCardData } from '../../types';

const stats: StatCardData[] = [
  { label: '同比增长率', value: '24.5', unit: '%', trend: { direction: 'up', value: '5.2%' }, icon: <svg viewBox="0 0 18 18" fill="none"><path d="M3 14l3-4 3 2 3-5 3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { label: '环比增长率', value: '8.3', unit: '%', trend: { direction: 'up', value: '2.1%' }, icon: <svg viewBox="0 0 18 18" fill="none"><rect x="3" y="10" width="4" height="7" rx="0.5" stroke="currentColor" strokeWidth="1.3"/><rect x="8" y="6" width="4" height="11" rx="0.5" stroke="currentColor" strokeWidth="1.3"/><rect x="13" y="3" width="4" height="14" rx="0.5" stroke="currentColor" strokeWidth="1.3"/></svg> },
  { label: '最大增幅茶类', value: '白茶', unit: '+38.2%', icon: <svg viewBox="0 0 18 18" fill="none"><path d="M7 3v8M3 7l4 4 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { label: '最大降幅茶类', value: '黑茶', unit: '-12.5%', icon: <svg viewBox="0 0 18 18" fill="none"><path d="M7 15V7M3 11l4-4 4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg> },
];

const yearOnYearData = {
  labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月'],
  series: [
    { name: '今年销售额', color: 'var(--color-module-current-accent)', data: [185, 205, 268, 290, 310, 325, 328] },
    { name: '去年同期', color: 'var(--color-neutral-300)', data: [150, 168, 198, 215, 232, 248, 262] },
  ],
};

const comparisonData = [
  { category: '绿茶', thisYear: '¥ 536,400', lastYear: '¥ 425,800', yoy: '+25.9%', mom: '+3.2%' },
  { category: '白茶', thisYear: '¥ 412,800', lastYear: '¥ 298,600', yoy: '+38.2%', mom: '+5.8%' },
  { category: '红茶', thisYear: '¥ 385,200', lastYear: '¥ 312,400', yoy: '+23.3%', mom: '+2.1%' },
  { category: '青茶', thisYear: '¥ 356,800', lastYear: '¥ 298,200', yoy: '+19.6%', mom: '+1.8%' },
  { category: '黑茶', thisYear: '¥ 268,400', lastYear: '¥ 306,800', yoy: '-12.5%', mom: '-3.5%' },
  { category: '黄茶', thisYear: '¥ 226,800', lastYear: '¥ 188,400', yoy: '+20.4%', mom: '+4.2%' },
];

export default function StatisticsYearOnYear() {
  return (
    <>
      <ContentHeader title="同比环比" breadcrumbs={['统计', '同比环比']} actions={<Button variant="ghost">导出报表</Button>} />
      <div className="content-body">
        <div className="stat-cards">
          {stats.map((s, i) => <StatCard key={i} data={s} />)}
        </div>
        <Card title="销售额同比对比（今年 vs 去年）">
          <LineChart data={yearOnYearData} />
        </Card>
        <Card title="各茶类同比环比数据" style={{ marginTop: 'var(--space-6)' }}>
          <Table
            headers={['茶类', '今年销售额', '去年销售额', '同比', '环比']}
            rows={comparisonData.map((c) => [
              <span style={{ fontWeight: 'var(--font-medium)' }}>{c.category}</span>,
              <span className="mono">{c.thisYear}</span>,
              <span className="mono" style={{ color: 'var(--color-neutral-500)' }}>{c.lastYear}</span>,
              <span className="mono" style={{ color: c.yoy.startsWith('+') ? 'var(--color-semantic-success)' : 'var(--color-semantic-error)' }}>{c.yoy}</span>,
              <span className="mono" style={{ color: c.mom.startsWith('+') ? 'var(--color-semantic-success)' : 'var(--color-semantic-error)' }}>{c.mom}</span>,
            ])}
          />
        </Card>
      </div>
    </>
  );
}
