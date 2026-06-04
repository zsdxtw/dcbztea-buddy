import ContentHeader from '../../components/layout/ContentHeader';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import LineChart from '../../components/charts/LineChart';
import Button from '../../components/common/Button';

const purchaseTrendData = {
  labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月'],
  series: [
    { name: '采购额', color: 'var(--color-module-current-accent)', data: [68, 72, 85, 78, 92, 88, 86] },
    { name: '去年同期', color: 'var(--color-neutral-300)', data: [55, 60, 70, 65, 75, 72, 70] },
  ],
};

export default function PurchaseOverview() {
  return (
    <>
      <ContentHeader title="采购概览" breadcrumbs={['采购', '采购概览']} actions={<Button><PlusIcon />新建采购单</Button>} />
      <div className="content-body">
        <div className="stat-cards">
          <StatCard data={{ label: '本月采购额', value: '856,200', unit: '¥', trend: { direction: 'down', value: '3.2%' }, icon: <svg viewBox="0 0 18 18" fill="none"><path d="M3 5h12l-1.2 8H4.2L3 5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg> }} />
          <StatCard data={{ label: '采购订单数', value: '47', trend: { direction: 'up', value: '+5 单' }, icon: <svg viewBox="0 0 18 18" fill="none"><rect x="4" y="2" width="10" height="14" rx="2" stroke="currentColor" strokeWidth="1.3"/></svg> }} />
          <StatCard data={{ label: '待审核', value: '6', trend: { direction: 'down', value: '3 单' }, icon: <svg viewBox="0 0 18 18" fill="none"><rect x="3" y="5" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3"/></svg> }} />
          <StatCard data={{ label: '供应商数', value: '28', trend: { direction: 'up', value: '+2' }, icon: <svg viewBox="0 0 18 18" fill="none"><circle cx="7" cy="7" r="3" stroke="currentColor" strokeWidth="1.3"/></svg> }} />
        </div>
        <Card title="采购趋势">
          <LineChart data={purchaseTrendData} />
        </Card>
      </div>
    </>
  );
}

function PlusIcon() {
  return <svg viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
}
