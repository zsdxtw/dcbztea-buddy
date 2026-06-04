import ContentHeader from '../../components/layout/ContentHeader';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import StatusTag from '../../components/common/StatusTag';
import Button from '../../components/common/Button';
import FilterBar, { FilterInput, FilterSelect } from '../../components/business/FilterBar';
import type { StatCardData } from '../../types';

const stats: StatCardData[] = [
  { label: '本月开票', value: '328,600', unit: '¥', trend: { direction: 'up', value: '18.3%' }, icon: <svg viewBox="0 0 18 18" fill="none"><rect x="4" y="2" width="12" height="16" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M7 6h6M7 9h6M7 12h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M8 15l1 1 2-2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { label: '待开票', value: '86,400', unit: '¥', trend: { direction: 'down', value: '5 笔待开' }, icon: <svg viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.3"/><path d="M9 6v4M9 12.5v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> },
  { label: '进项发票', value: '215,400', unit: '¥', trend: { direction: 'up', value: '8 笔' }, icon: <svg viewBox="0 0 18 18" fill="none"><path d="M3 6h12l-1.2 8H4.2L3 6z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg> },
  { label: '销项发票', value: '328,600', unit: '¥', trend: { direction: 'up', value: '12 笔' }, icon: <svg viewBox="0 0 18 18" fill="none"><path d="M3 14l3-4 3 2 3-5 3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg> },
];

const invoiceItems = [
  { code: 'INV-2025-0042', type: '销项', party: '华茗堂茶庄', amount: '¥ 15,800', tax: '¥ 2,054', date: '2025-07-15', status: 'issued' as const },
  { code: 'INV-2025-0041', type: '销项', party: '雅韵茶社', amount: '¥ 8,600', tax: '¥ 1,118', date: '2025-07-14', status: 'issued' as const },
  { code: 'INV-2025-0040', type: '进项', party: '武夷山茶业', amount: '¥ 28,500', tax: '¥ 3,705', date: '2025-07-13', status: 'received' as const },
  { code: 'INV-2025-0039', type: '销项', party: '清心茶坊', amount: '¥ 22,400', tax: '¥ 2,912', date: '2025-07-18', status: 'pending' as const },
  { code: 'INV-2025-0038', type: '进项', party: '西湖龙井合作社', amount: '¥ 56,000', tax: '¥ 7,280', date: '2025-07-12', status: 'received' as const },
  { code: 'INV-2025-0037', type: '销项', party: '品茗轩', amount: '¥ 38,000', tax: '¥ 4,940', date: '2025-07-20', status: 'pending' as const },
  { code: 'INV-2025-0036', type: '进项', party: '安溪铁观音集团', amount: '¥ 18,200', tax: '¥ 2,366', date: '2025-07-10', status: 'received' as const },
  { code: 'INV-2025-0035', type: '销项', party: '翠竹茶行', amount: '¥ 12,500', tax: '¥ 1,625', date: '2025-07-08', status: 'void' as const },
  { code: 'INV-2025-0034', type: '进项', party: '福鼎白茶厂', amount: '¥ 32,800', tax: '¥ 4,264', date: '2025-07-07', status: 'received' as const },
  { code: 'INV-2025-0033', type: '销项', party: '茗香斋', amount: '¥ 18,600', tax: '¥ 2,418', date: '2025-07-05', status: 'issued' as const },
];

function invoiceStatusToVariant(status: string) {
  switch (status) {
    case 'issued': return 'success' as const;
    case 'received': return 'info' as const;
    case 'pending': return 'warning' as const;
    case 'void': return 'error' as const;
    default: return 'info' as const;
  }
}

function invoiceStatusLabel(status: string) {
  switch (status) {
    case 'issued': return '已开票';
    case 'received': return '已收票';
    case 'pending': return '待开票';
    case 'void': return '已作废';
    default: return status;
  }
}

export default function FinanceInvoice() {
  return (
    <>
      <ContentHeader title="发票管理" breadcrumbs={['财务', '发票管理']} actions={<><Button variant="ghost">导出</Button><Button><PlusIcon />开具新发票</Button></>} />
      <div className="content-body">
        <div className="stat-cards">
          {stats.map((s, i) => <StatCard key={i} data={s} />)}
        </div>
        <FilterBar>
          <FilterInput placeholder="搜索发票号、开票方..." />
          <FilterSelect options={['全部类型', '销项', '进项']} />
          <FilterSelect options={['全部状态', '已开票', '已收票', '待开票', '已作废']} />
          <FilterSelect options={['全部时间', '今日', '本周', '本月', '近3月']} />
        </FilterBar>
        <Card>
          <Table
            headers={['发票号', '发票类型', '开票方/收票方', '金额', '税额', '开票日期', '状态']}
            rows={invoiceItems.map((inv) => [
              <span className="mono">{inv.code}</span>,
              <StatusTag variant={inv.type === '销项' ? 'info' : 'success'} label={inv.type} />,
              inv.party,
              <span className="mono">{inv.amount}</span>,
              <span className="mono" style={{ color: 'var(--color-neutral-500)' }}>{inv.tax}</span>,
              <span className="mono">{inv.date}</span>,
              <StatusTag variant={invoiceStatusToVariant(inv.status)} label={invoiceStatusLabel(inv.status)} />,
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
