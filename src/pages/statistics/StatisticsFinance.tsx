import ContentHeader from '../../components/layout/ContentHeader';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';

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
        <Card title="收支趋势">
          <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-neutral-400)' }}>财务报表图表区域</div>
        </Card>
      </div>
    </>
  );
}
