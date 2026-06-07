import ContentHeader from '../../components/layout/ContentHeader';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import LineChart from '../../components/charts/LineChart';
import PieChart from '../../components/charts/PieChart';

const financeLineData = {
  labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月'],
  series: [
    { name: '收入', color: 'var(--color-semantic-success)', data: [185, 205, 268, 290, 310, 325, 328] },
    { name: '支出', color: 'var(--color-semantic-error)', data: [120, 135, 148, 165, 185, 205, 210] },
  ],
};

const expensePieData = [
  { name: '采购成本', value: 45, color: 'var(--color-tea-green)' },
  { name: '物流费用', value: 15, color: 'var(--color-tea-oolong)' },
  { name: '仓储费用', value: 12, color: 'var(--color-tea-dark)' },
  { name: '人员成本', value: 18, color: 'var(--color-tea-red)' },
  { name: '其他费用', value: 10, color: 'var(--color-tea-white)' },
];

export default function StatisticsFinance() {
  return (
    <>
      <ContentHeader title="财务报表" breadcrumbs={['统计', '财务报表']} />
      <div className="content-body">
        <div className="stat-cards">
          <StatCard data={{ label: '总收入', value: '2,186,400', unit: '¥', trend: { direction: 'up', value: '24.5%' }, icon: <svg viewBox="0 0 18 18" fill="none"><path d="M3 14l3-4 3 2 3-5 3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg> }} />
          <StatCard data={{ label: '总支出', value: '1,452,800', unit: '¥', trend: { direction: 'up', value: '15.2%' }, icon: <svg viewBox="0 0 18 18" fill="none"><path d="M3 5h12l-1.2 8H4.2L3 5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg> }} />
          <StatCard data={{ label: '净利润', value: '733,600', unit: '¥', trend: { direction: 'up', value: '42.8%' }, icon: <svg viewBox="0 0 18 18" fill="none"><rect x="2" y="4" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.3"/></svg> }} />
          <StatCard data={{ label: '毛利率', value: '33.5%', trend: { direction: 'up', value: '2.1%' }, icon: <svg viewBox="0 0 18 18" fill="none"><rect x="4" y="2" width="10" height="14" rx="2" stroke="currentColor" strokeWidth="1.3"/></svg> }} />
        </div>
        <div className="grid-2">
          <Card title="收支趋势">
            <LineChart data={financeLineData} />
          </Card>
          <Card title="支出构成">
            <PieChart data={expensePieData} />
          </Card>
        </div>
      </div>
    </>
  );
}
