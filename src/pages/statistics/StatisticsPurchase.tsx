import ContentHeader from '../../components/layout/ContentHeader';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import LineChart from '../../components/charts/LineChart';
import PieChart from '../../components/charts/PieChart';
import Button from '../../components/common/Button';

const purchaseLineData = {
  labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月'],
  series: [
    { name: '采购额', color: 'var(--color-tea-green)', data: [120, 135, 148, 165, 185, 205, 210] },
    { name: '采购量', color: 'var(--color-tea-oolong)', data: [80, 92, 105, 115, 130, 145, 148] },
  ],
};

const purchasePieData = [
  { name: '绿茶', value: 28, color: 'var(--color-tea-green)' },
  { name: '红茶', value: 22, color: 'var(--color-tea-red)' },
  { name: '青茶', value: 20, color: 'var(--color-tea-oolong)' },
  { name: '白茶', value: 15, color: 'var(--color-tea-white)' },
  { name: '黑茶', value: 10, color: 'var(--color-tea-dark)' },
  { name: '黄茶', value: 5, color: 'var(--color-tea-yellow)' },
];

export default function StatisticsPurchase() {
  return (
    <>
      <ContentHeader title="采购分析" breadcrumbs={['统计', '采购分析']} actions={<Button variant="ghost">导出报表</Button>} />
      <div className="content-body">
        <div className="stat-cards">
          <StatCard data={{ label: '总采购额', value: '1,452,800', unit: '¥', trend: { direction: 'up', value: '15.2%' }, icon: <svg viewBox="0 0 18 18" fill="none"><path d="M3 5h12l-1.2 8H4.2L3 5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg> }} />
          <StatCard data={{ label: '采购订单', value: '342', trend: { direction: 'up', value: '8.7%' }, icon: <svg viewBox="0 0 18 18" fill="none"><rect x="4" y="2" width="10" height="14" rx="2" stroke="currentColor" strokeWidth="1.3"/></svg> }} />
          <StatCard data={{ label: '供应商数', value: '28', trend: { direction: 'up', value: '+2' }, icon: <svg viewBox="0 0 18 18" fill="none"><circle cx="7" cy="7" r="3" stroke="currentColor" strokeWidth="1.3"/></svg> }} />
          <StatCard data={{ label: '平均单价', value: '4,248', unit: '¥', trend: { direction: 'down', value: '3.1%' }, icon: <svg viewBox="0 0 18 18" fill="none"><rect x="2" y="4" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.3"/></svg> }} />
        </div>
        <div className="grid-2">
          <Card title="采购趋势">
            <LineChart data={purchaseLineData} />
          </Card>
          <Card title="茶类采购占比">
            <PieChart data={purchasePieData} />
          </Card>
        </div>
      </div>
    </>
  );
}
