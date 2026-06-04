import ContentHeader from '../../components/layout/ContentHeader';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import StatusTag from '../../components/common/StatusTag';
import Button from '../../components/common/Button';
import FilterBar, { FilterInput, FilterSelect } from '../../components/business/FilterBar';
import type { StatCardData } from '../../types';

const stats: StatCardData[] = [
  { label: '本月收入', value: '328,600', unit: '¥', trend: { direction: 'up', value: '18.3%' }, icon: <svg viewBox="0 0 18 18" fill="none"><path d="M3 14l3-4 3 2 3-5 3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { label: '本月支出', value: '215,400', unit: '¥', trend: { direction: 'down', value: '5.6%' }, icon: <svg viewBox="0 0 18 18" fill="none"><path d="M3 5h12l-1.2 8H4.2L3 5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg> },
  { label: '净收支', value: '113,200', unit: '¥', trend: { direction: 'up', value: '62.5%' }, icon: <svg viewBox="0 0 18 18" fill="none"><rect x="2" y="4" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.3"/></svg> },
  { label: '收支笔数', value: '68', trend: { direction: 'up', value: '+8 笔' }, icon: <svg viewBox="0 0 18 18" fill="none"><rect x="4" y="2" width="10" height="14" rx="2" stroke="currentColor" strokeWidth="1.3"/></svg> },
];

const records = [
  { date: '2025-07-15', category: '销售收入', refOrder: 'SO-2025-0238', amount: '+¥ 15,800', status: 'success' as const },
  { date: '2025-07-15', category: '采购支出', refOrder: 'PO-2025-0151', amount: '-¥ 28,500', status: 'error' as const },
  { date: '2025-07-14', category: '销售收入', refOrder: 'SO-2025-0237', amount: '+¥ 8,600', status: 'success' as const },
  { date: '2025-07-14', category: '物流费用', refOrder: 'LG-2025-0089', amount: '-¥ 1,200', status: 'error' as const },
  { date: '2025-07-13', category: '销售收入', refOrder: 'SO-2025-0236', amount: '+¥ 22,400', status: 'success' as const },
  { date: '2025-07-13', category: '采购支出', refOrder: 'PO-2025-0150', amount: '-¥ 56,000', status: 'error' as const },
  { date: '2025-07-12', category: '销售收入', refOrder: 'SO-2025-0235', amount: '+¥ 38,000', status: 'success' as const },
  { date: '2025-07-12', category: '仓储费用', refOrder: 'WH-2025-0045', amount: '-¥ 3,200', status: 'error' as const },
  { date: '2025-07-11', category: '销售收入', refOrder: 'SO-2025-0234', amount: '+¥ 12,500', status: 'success' as const },
  { date: '2025-07-11', category: '办公费用', refOrder: 'OF-2025-0023', amount: '-¥ 860', status: 'error' as const },
];

export default function FinanceRecords() {
  return (
    <>
      <ContentHeader title="收支记录" breadcrumbs={['财务', '收支记录']} actions={<><Button variant="ghost">导出</Button><Button><PlusIcon />新建收支</Button></>} />
      <div className="content-body">
        <div className="stat-cards">
          {stats.map((s, i) => <StatCard key={i} data={s} />)}
        </div>
        <FilterBar>
          <FilterInput placeholder="搜索关联单号、类别..." />
          <FilterSelect options={['全部类型', '销售收入', '采购支出', '物流费用', '仓储费用', '办公费用']} />
          <FilterSelect options={['全部时间', '今日', '本周', '本月', '近3月']} />
        </FilterBar>
        <Card>
          <Table
            headers={['日期', '类别', '关联单号', '金额', '状态']}
            rows={records.map((r) => [
              <span className="mono">{r.date}</span>,
              <span style={{ color: 'var(--color-module-current-accent)' }}>{r.category}</span>,
              <span className="mono">{r.refOrder}</span>,
              <span className="mono" style={{ color: r.status === 'success' ? 'var(--color-semantic-success)' : 'var(--color-semantic-error)' }}>{r.amount}</span>,
              <StatusTag variant={r.status} label={r.status === 'success' ? '收入' : '支出'} />,
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
