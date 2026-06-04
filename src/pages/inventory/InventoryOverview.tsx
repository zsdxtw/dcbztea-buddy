import ContentHeader from '../../components/layout/ContentHeader';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import AlertItem from '../../components/business/AlertItem';
import { alertItems } from '../../data/mock';

export default function InventoryOverview() {
  return (
    <>
      <ContentHeader title="仓储概览" breadcrumbs={['仓储', '仓储概览']} />
      <div className="content-body">
        <div className="stat-cards" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          <StatCard data={{ label: '库存总量', value: '42,680', unit: 'kg', icon: <svg viewBox="0 0 18 18" fill="none"><rect x="3" y="5" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3"/></svg> }} />
          <StatCard data={{ label: 'SKU 数量', value: '328', icon: <svg viewBox="0 0 18 18" fill="none"><rect x="4" y="2" width="10" height="14" rx="2" stroke="currentColor" strokeWidth="1.3"/></svg> }} />
          <StatCard data={{ label: '库存预警', value: '4', icon: <svg viewBox="0 0 18 18" fill="none"><path d="M10 2a5 5 0 015 5v3l2 2H3l2-2V7a5 5 0 015-5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg> }} />
        </div>
        <Card title="库存预警" headerRight={<span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-semantic-warning)' }}>4 项预警</span>}>
          {alertItems.map((a, i) => <AlertItem key={i} data={a} />)}
        </Card>
      </div>
    </>
  );
}
