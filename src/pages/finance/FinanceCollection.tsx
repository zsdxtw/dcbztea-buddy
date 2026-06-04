import ContentHeader from '../../components/layout/ContentHeader';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import StatusTag from '../../components/common/StatusTag';
import Button from '../../components/common/Button';
import FilterBar, { FilterInput, FilterSelect } from '../../components/business/FilterBar';
import type { StatCardData } from '../../types';

const stats: StatCardData[] = [
  { label: '本月收款', value: '248,600', unit: '¥', trend: { direction: 'up', value: '22.5%' }, icon: <svg viewBox="0 0 18 18" fill="none"><path d="M3 14l3-4 3 2 3-5 3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { label: '待收款', value: '86,400', unit: '¥', trend: { direction: 'down', value: '5 笔待收' }, icon: <svg viewBox="0 0 18 18" fill="none"><rect x="2" y="4" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M5 8h2M5 11h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> },
  { label: '逾期金额', value: '12,800', unit: '¥', trend: { direction: 'up', value: '需催收' }, icon: <svg viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.3"/><path d="M9 6v4M9 12.5v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> },
  { label: '收款率', value: '78.5', unit: '%', trend: { direction: 'up', value: '3.2%' }, icon: <svg viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.3"/><path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg> },
];

const collectionItems = [
  { code: 'CL-2025-0042', order: 'SO-2025-0238', customer: '华茗堂茶庄', amount: '¥ 15,800', method: '银行转账', date: '2025-07-15', status: 'received' as const },
  { code: 'CL-2025-0041', order: 'SO-2025-0237', customer: '雅韵茶社', amount: '¥ 8,600', method: '微信支付', date: '2025-07-14', status: 'received' as const },
  { code: 'CL-2025-0040', order: 'SO-2025-0236', customer: '清心茶坊', amount: '¥ 22,400', method: '银行转账', date: '2025-07-18', status: 'pending' as const },
  { code: 'CL-2025-0039', order: 'SO-2025-0235', customer: '品茗轩', amount: '¥ 38,000', method: '承兑汇票', date: '2025-07-20', status: 'pending' as const },
  { code: 'CL-2025-0038', order: 'SO-2025-0234', customer: '翠竹茶行', amount: '¥ 12,500', method: '银行转账', date: '2025-07-10', status: 'overdue' as const },
  { code: 'CL-2025-0037', order: 'SO-2025-0230', customer: '茗香斋', amount: '¥ 18,600', method: '微信支付', date: '2025-07-12', status: 'received' as const },
  { code: 'CL-2025-0036', order: 'SO-2025-0228', customer: '和风茶屋', amount: '¥ 6,800', method: '支付宝', date: '2025-07-22', status: 'pending' as const },
  { code: 'CL-2025-0035', order: 'SO-2025-0225', customer: '云隐茶庄', amount: '¥ 12,800', method: '银行转账', date: '2025-07-05', status: 'overdue' as const },
];

function collectionStatusToVariant(status: string) {
  switch (status) {
    case 'received': return 'success' as const;
    case 'pending': return 'warning' as const;
    case 'overdue': return 'error' as const;
    default: return 'info' as const;
  }
}

function collectionStatusLabel(status: string) {
  switch (status) {
    case 'received': return '已收款';
    case 'pending': return '待收款';
    case 'overdue': return '逾期';
    default: return status;
  }
}

export default function FinanceCollection() {
  return (
    <>
      <ContentHeader title="收款管理" breadcrumbs={['财务', '收款管理']} actions={<><Button variant="ghost">导出</Button><Button><PlusIcon />新建收款</Button></>} />
      <div className="content-body">
        <div className="stat-cards">
          {stats.map((s, i) => <StatCard key={i} data={s} />)}
        </div>
        <FilterBar>
          <FilterInput placeholder="搜索收款单号、客户..." />
          <FilterSelect options={['全部状态', '已收款', '待收款', '逾期']} />
          <FilterSelect options={['全部客户', '华茗堂茶庄', '雅韵茶社', '清心茶坊', '品茗轩', '翠竹茶行']} />
          <FilterSelect options={['全部时间', '今日', '本周', '本月', '近3月']} />
        </FilterBar>
        <Card>
          <Table
            headers={['收款单号', '关联订单', '客户', '收款金额', '收款方式', '收款日期', '状态']}
            rows={collectionItems.map((c) => [
              <span className="mono">{c.code}</span>,
              <span className="mono">{c.order}</span>,
              c.customer,
              <span className="mono">{c.amount}</span>,
              c.method,
              <span className="mono">{c.date}</span>,
              <StatusTag variant={collectionStatusToVariant(c.status)} label={collectionStatusLabel(c.status)} />,
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
