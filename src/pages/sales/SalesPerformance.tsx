import ContentHeader from '../../components/layout/ContentHeader';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import LineChart from '../../components/charts/LineChart';
import StatusTag from '../../components/common/StatusTag';
import Button from '../../components/common/Button';
import type { StatCardData } from '../../types';

const stats: StatCardData[] = [
  { label: '本月销售额', value: '328,600', unit: '¥', trend: { direction: 'up', value: '18.3%' }, icon: <svg viewBox="0 0 18 18" fill="none"><path d="M3 14l3-4 3 2 3-5 3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { label: '完成率', value: '82.5', unit: '%', trend: { direction: 'up', value: '5.2%' }, icon: <svg viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.3"/><path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { label: '订单数', value: '156', trend: { direction: 'up', value: '+12 单' }, icon: <svg viewBox="0 0 18 18" fill="none"><rect x="4" y="2" width="10" height="14" rx="2" stroke="currentColor" strokeWidth="1.3"/></svg> },
  { label: '客单价', value: '2,108', unit: '¥', trend: { direction: 'down', value: '2.4%' }, icon: <svg viewBox="0 0 18 18" fill="none"><rect x="2" y="4" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.3"/></svg> },
];

const monthlyTrendData = {
  labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月'],
  series: [
    { name: '团队总额', color: 'var(--color-module-current-accent)', data: [220, 245, 268, 290, 310, 305, 328] },
    { name: '目标', color: 'var(--color-neutral-300)', data: [250, 260, 280, 300, 320, 340, 360] },
  ],
};

const performanceData = [
  { name: '王销售', orders: 42, amount: '¥ 86,400', rate: '108.0%' },
  { name: '刘销售', orders: 38, amount: '¥ 72,600', rate: '95.2%' },
  { name: '赵销售', orders: 35, amount: '¥ 68,200', rate: '89.8%' },
  { name: '陈销售', orders: 28, amount: '¥ 56,800', rate: '82.5%' },
  { name: '李销售', orders: 22, amount: '¥ 44,600', rate: '71.2%' },
];

export default function SalesPerformance() {
  return (
    <>
      <ContentHeader title="业绩统计" breadcrumbs={['销售', '业绩统计']} actions={<Button variant="ghost">导出报表</Button>} />
      <div className="content-body">
        <div className="stat-cards">
          {stats.map((s, i) => <StatCard key={i} data={s} />)}
        </div>
        <div className="grid-2">
          <Card title="月度销售趋势">
            <LineChart data={monthlyTrendData} />
          </Card>
          <Card title="各业务员业绩排名">
            <Table
              headers={['排名', '业务员', '订单数', '销售额', '完成率']}
              rows={performanceData.map((p, i) => [
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 22, height: 22, borderRadius: 'var(--radius-full)', background: i < 3 ? 'var(--color-module-current-accent)' : 'var(--color-neutral-200)', color: i < 3 ? '#fff' : 'var(--color-neutral-600)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-medium)' }}>{i + 1}</span>,
                <span style={{ fontWeight: 'var(--font-medium)' }}>{p.name}</span>,
                <span className="mono">{p.orders}</span>,
                <span className="mono">{p.amount}</span>,
                <StatusTag variant={parseFloat(p.rate) >= 100 ? 'success' : parseFloat(p.rate) >= 80 ? 'warning' : 'error'} label={p.rate} />,
              ])}
            />
          </Card>
        </div>
      </div>
    </>
  );
}
