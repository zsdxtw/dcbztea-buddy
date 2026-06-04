import ContentHeader from '../../components/layout/ContentHeader';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import PieChart from '../../components/charts/PieChart';

export default function StatisticsInventory() {
  return (
    <>
      <ContentHeader title="库存分析" breadcrumbs={['统计', '库存分析']} />
      <div className="content-body">
        <div className="stat-cards">
          <StatCard data={{ label: '库存总量', value: '42,680', unit: 'kg', icon: <svg viewBox="0 0 18 18" fill="none"><rect x="3" y="5" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3"/></svg> }} />
          <StatCard data={{ label: 'SKU 数量', value: '328', icon: <svg viewBox="0 0 18 18" fill="none"><rect x="4" y="2" width="10" height="14" rx="2" stroke="currentColor" strokeWidth="1.3"/></svg> }} />
          <StatCard data={{ label: '库存预警', value: '4', icon: <svg viewBox="0 0 18 18" fill="none"><path d="M10 2a5 5 0 015 5v3l2 2H3l2-2V7a5 5 0 015-5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg> }} />
          <StatCard data={{ label: '周转率', value: '3.2', trend: { direction: 'up', value: '0.5' }, icon: <svg viewBox="0 0 18 18" fill="none"><circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.3"/></svg> }} />
        </div>
        <Card title="库存分布">
          <PieChart />
        </Card>
      </div>
    </>
  );
}
