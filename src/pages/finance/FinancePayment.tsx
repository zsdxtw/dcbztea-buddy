import ContentHeader from '../../components/layout/ContentHeader';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import StatusTag from '../../components/common/StatusTag';
import Button from '../../components/common/Button';
import FilterBar, { FilterInput, FilterSelect } from '../../components/business/FilterBar';
import type { StatCardData } from '../../types';

const stats: StatCardData[] = [
  { label: '本月付款', value: '186,400', unit: '¥', trend: { direction: 'up', value: '8.5%' }, icon: <svg viewBox="0 0 18 18" fill="none"><path d="M3 5h12l-1.2 8H4.2L3 5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg> },
  { label: '待付款', value: '124,800', unit: '¥', trend: { direction: 'down', value: '8 笔待付' }, icon: <svg viewBox="0 0 18 18" fill="none"><rect x="2" y="4" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M5 8h2M5 11h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> },
  { label: '逾期金额', value: '8,200', unit: '¥', trend: { direction: 'up', value: '2 笔逾期' }, icon: <svg viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.3"/><path d="M9 6v4M9 12.5v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> },
  { label: '付款率', value: '72.3', unit: '%', trend: { direction: 'up', value: '5.8%' }, icon: <svg viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.3"/><path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg> },
];

const paymentItems = [
  { code: 'PY-2025-0038', order: 'PO-2025-0151', supplier: '武夷山茶业', amount: '¥ 28,500', method: '银行转账', date: '2025-07-15', status: 'paid' as const },
  { code: 'PY-2025-0037', order: 'PO-2025-0150', supplier: '西湖龙井合作社', amount: '¥ 56,000', method: '银行转账', date: '2025-07-12', status: 'paid' as const },
  { code: 'PY-2025-0036', order: 'PO-2025-0149', supplier: '安溪铁观音集团', amount: '¥ 18,200', method: '承兑汇票', date: '2025-07-20', status: 'pending' as const },
  { code: 'PY-2025-0035', order: 'PO-2025-0148', supplier: '福鼎白茶厂', amount: '¥ 32,800', method: '银行转账', date: '2025-07-18', status: 'pending' as const },
  { code: 'PY-2025-0034', order: 'PO-2025-0147', supplier: '云南普洱茶业', amount: '¥ 45,600', method: '银行转账', date: '2025-07-08', status: 'overdue' as const },
  { code: 'PY-2025-0033', order: 'PO-2025-0145', supplier: '安溪铁观音集团', amount: '¥ 12,400', method: '微信支付', date: '2025-07-10', status: 'paid' as const },
  { code: 'PY-2025-0032', order: 'PO-2025-0142', supplier: '武夷山茶业', amount: '¥ 8,200', method: '银行转账', date: '2025-07-05', status: 'overdue' as const },
  { code: 'PY-2025-0031', order: 'PO-2025-0140', supplier: '福鼎白茶厂', amount: '¥ 22,600', method: '支付宝', date: '2025-07-22', status: 'pending' as const },
];

function paymentStatusToVariant(status: string) {
  switch (status) {
    case 'paid': return 'success' as const;
    case 'pending': return 'warning' as const;
    case 'overdue': return 'error' as const;
    default: return 'info' as const;
  }
}

function paymentStatusLabel(status: string) {
  switch (status) {
    case 'paid': return '已付款';
    case 'pending': return '待付款';
    case 'overdue': return '逾期';
    default: return status;
  }
}

export default function FinancePayment() {
  return (
    <>
      <ContentHeader title="付款管理" breadcrumbs={['财务', '付款管理']} actions={<><Button variant="ghost">导出</Button><Button><PlusIcon />新建付款</Button></>} />
      <div className="content-body">
        <div className="stat-cards">
          {stats.map((s, i) => <StatCard key={i} data={s} />)}
        </div>
        <FilterBar>
          <FilterInput placeholder="搜索付款单号、供应商..." />
          <FilterSelect options={['全部状态', '已付款', '待付款', '逾期']} />
          <FilterSelect options={['全部供应商', '武夷山茶业', '西湖龙井合作社', '安溪铁观音集团', '福鼎白茶厂', '云南普洱茶业']} />
          <FilterSelect options={['全部时间', '今日', '本周', '本月', '近3月']} />
        </FilterBar>
        <Card>
          <Table
            headers={['付款单号', '关联订单', '供应商', '付款金额', '付款方式', '付款日期', '状态']}
            rows={paymentItems.map((p) => [
              <span className="mono">{p.code}</span>,
              <span className="mono">{p.order}</span>,
              p.supplier,
              <span className="mono">{p.amount}</span>,
              p.method,
              <span className="mono">{p.date}</span>,
              <StatusTag variant={paymentStatusToVariant(p.status)} label={paymentStatusLabel(p.status)} />,
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
