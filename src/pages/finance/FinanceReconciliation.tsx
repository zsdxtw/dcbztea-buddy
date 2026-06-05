import ContentHeader from '../../components/layout/ContentHeader';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import StatusTag from '../../components/common/StatusTag';
import Button from '../../components/common/Button';
import FilterBar, { FilterInput, FilterSelect } from '../../components/business/FilterBar';
import type { StatCardData } from '../../types';

const stats: StatCardData[] = [
  { label: '待对账', value: '5', trend: { direction: 'up', value: '+2' }, icon: <svg viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.3"/><path d="M9 6v4M9 12.5v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> },
  { label: '已完成', value: '42', trend: { direction: 'up', value: '8 笔' }, icon: <svg viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.3"/><path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { label: '有差异', value: '2', trend: { direction: 'down', value: '-1' }, icon: <svg viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.3"/><path d="M9 5v5M9 13.5v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> },
  { label: '本月对账率', value: '92.5', unit: '%', trend: { direction: 'up', value: '3.2%' }, icon: <svg viewBox="0 0 18 18" fill="none"><path d="M3 14l3-4 3 2 3-5 3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg> },
];

const reconciliationItems = [
  { id: 'RC-2025-0715-001', partner: '华茗堂茶庄', type: '客户对账', period: '2025-07-01 至 2025-07-15', amount: '¥ 156,800', status: 'completed' as const, creator: '张财务' },
  { id: 'RC-2025-0715-002', partner: '武夷山茶业', type: '供应商对账', period: '2025-07-01 至 2025-07-15', amount: '¥ 89,600', status: 'pending' as const, creator: '李财务' },
  { id: 'RC-2025-0714-001', partner: '雅韵茶社', type: '客户对账', period: '2025-06-01 至 2025-06-30', amount: '¥ 234,500', status: 'completed' as const, creator: '王财务' },
  { id: 'RC-2025-0714-002', partner: '安溪铁观音集团', type: '供应商对账', period: '2025-06-01 至 2025-06-30', amount: '¥ 168,200', status: 'completed' as const, creator: '张财务' },
  { id: 'RC-2025-0713-001', partner: '清心茶坊', type: '客户对账', period: '2025-07-01 至 2025-07-15', amount: '¥ 98,400', status: 'pending' as const, creator: '李财务' },
  { id: 'RC-2025-0712-001', partner: '福鼎白茶厂', type: '供应商对账', period: '2025-06-01 至 2025-06-30', amount: '¥ 126,800', status: 'pending' as const, creator: '王财务' },
  { id: 'RC-2025-0711-001', partner: '品茗轩', type: '客户对账', period: '2025-06-01 至 2025-06-30', amount: '¥ 178,600', status: 'completed' as const, creator: '张财务' },
  { id: 'RC-2025-0710-001', partner: '云南普洱茶业', type: '供应商对账', period: '2025-06-01 至 2025-06-30', amount: '¥ 256,400', status: 'discrepancy' as const, creator: '李财务' },
];

function statusToVariant(status: string) {
  switch (status) {
    case 'pending': return 'warning' as const;
    case 'processing': return 'info' as const;
    case 'completed': return 'success' as const;
    case 'discrepancy': return 'error' as const;
    default: return 'info' as const;
  }
}

function statusLabel(status: string) {
  switch (status) {
    case 'pending': return '待对账';
    case 'processing': return '对账中';
    case 'completed': return '已完成';
    case 'discrepancy': return '有差异';
    default: return status;
  }
}

export default function FinanceReconciliation() {
  return (
    <>
      <ContentHeader title="对账管理" breadcrumbs={['财务', '对账管理']} actions={<><Button variant="ghost">导出</Button><Button><PlusIcon />新建对账</Button></>} />
      <div className="content-body">
        <div className="stat-cards">
          {stats.map((s, i) => <StatCard key={i} data={s} />)}
        </div>
        <FilterBar>
          <FilterInput placeholder="搜索对账编号、往来方..." />
          <FilterSelect options={['全部状态', '待对账', '对账中', '已完成', '有差异']} />
          <FilterSelect options={['全部类型', '客户对账', '供应商对账']} />
          <FilterSelect options={['全部时间', '今日', '本周', '本月', '近3月']} />
        </FilterBar>
        <Card>
          <Table
            headers={['对账编号', '往来方', '对账类型', '对账期间', '对账金额', '创建人', '状态']}
            rows={reconciliationItems.map((item) => [
              <span className="mono">{item.id}</span>,
              item.partner,
              item.type,
              <span className="mono" style={{ fontSize: 'var(--text-xs)' }}>{item.period}</span>,
              <span className="mono">{item.amount}</span>,
              item.creator,
              <StatusTag variant={statusToVariant(item.status)} label={statusLabel(item.status)} />,
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
