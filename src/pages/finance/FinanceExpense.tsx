import ContentHeader from '../../components/layout/ContentHeader';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import StatusTag from '../../components/common/StatusTag';
import Button from '../../components/common/Button';
import FilterBar, { FilterInput, FilterSelect } from '../../components/business/FilterBar';
import type { StatCardData } from '../../types';

const stats: StatCardData[] = [
  { label: '本月报销', value: '28,650', unit: '¥', trend: { direction: 'up', value: '12.3%' }, icon: <svg viewBox="0 0 18 18" fill="none"><rect x="2" y="4" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M5 8h2M5 11h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> },
  { label: '待审批', value: '5', unit: '笔', trend: { direction: 'up', value: '需及时处理' }, icon: <svg viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.3"/><path d="M9 6v4M9 12.5v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> },
  { label: '已审批', value: '18', unit: '笔', trend: { direction: 'up', value: '+3 笔' }, icon: <svg viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.3"/><path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { label: '报销笔数', value: '23', trend: { direction: 'up', value: '+5 笔' }, icon: <svg viewBox="0 0 18 18" fill="none"><rect x="4" y="2" width="10" height="14" rx="2" stroke="currentColor" strokeWidth="1.3"/></svg> },
];

const expenseItems = [
  { code: 'EX-2025-0023', type: '差旅费', amount: '¥ 3,200', applicant: '王销售', date: '2025-07-15', approver: '陈经理', status: 'pending' as const },
  { code: 'EX-2025-0022', type: '办公用品', amount: '¥ 860', applicant: '张会计', date: '2025-07-14', approver: '陈经理', status: 'approved' as const },
  { code: 'EX-2025-0021', type: '业务招待', amount: '¥ 2,800', applicant: '刘销售', date: '2025-07-13', approver: '陈经理', status: 'approved' as const },
  { code: 'EX-2025-0020', type: '物流费用', amount: '¥ 1,500', applicant: '李仓管', date: '2025-07-12', approver: '陈经理', status: 'approved' as const },
  { code: 'EX-2025-0019', type: '差旅费', amount: '¥ 4,600', applicant: '赵销售', date: '2025-07-11', approver: '陈经理', status: 'pending' as const },
  { code: 'EX-2025-0018', type: '检测费用', amount: '¥ 2,200', applicant: '李工', date: '2025-07-10', approver: '陈经理', status: 'rejected' as const },
  { code: 'EX-2025-0017', type: '仓储维护', amount: '¥ 5,800', applicant: '赵仓管', date: '2025-07-09', approver: '陈经理', status: 'approved' as const },
  { code: 'EX-2025-0016', type: '市场推广', amount: '¥ 8,500', applicant: '王销售', date: '2025-07-08', approver: '陈经理', status: 'pending' as const },
  { code: 'EX-2025-0015', type: '差旅费', amount: '¥ 1,850', applicant: '刘销售', date: '2025-07-07', approver: '陈经理', status: 'pending' as const },
  { code: 'EX-2025-0014', type: '办公设备', amount: '¥ 6,200', applicant: '张会计', date: '2025-07-06', approver: '陈经理', status: 'pending' as const },
];

function expenseStatusToVariant(status: string) {
  switch (status) {
    case 'pending': return 'warning' as const;
    case 'approved': return 'success' as const;
    case 'rejected': return 'error' as const;
    default: return 'info' as const;
  }
}

function expenseStatusLabel(status: string) {
  switch (status) {
    case 'pending': return '待审批';
    case 'approved': return '已审批';
    case 'rejected': return '已驳回';
    default: return status;
  }
}

export default function FinanceExpense() {
  return (
    <>
      <ContentHeader title="费用报销" breadcrumbs={['财务', '费用报销']} actions={<><Button variant="ghost">导出</Button><Button><PlusIcon />新建报销</Button></>} />
      <div className="content-body">
        <div className="stat-cards">
          {stats.map((s, i) => <StatCard key={i} data={s} />)}
        </div>
        <FilterBar>
          <FilterInput placeholder="搜索报销单号、申请人..." />
          <FilterSelect options={['全部状态', '待审批', '已审批', '已驳回']} />
          <FilterSelect options={['全部类型', '差旅费', '办公用品', '业务招待', '物流费用', '检测费用', '仓储维护', '市场推广']} />
          <FilterSelect options={['全部时间', '今日', '本周', '本月', '近3月']} />
        </FilterBar>
        <Card>
          <Table
            headers={['报销单号', '费用类型', '报销金额', '申请人', '申请日期', '审批人', '状态']}
            rows={expenseItems.map((e) => [
              <span className="mono">{e.code}</span>,
              <span style={{ color: 'var(--color-module-current-accent)' }}>{e.type}</span>,
              <span className="mono">{e.amount}</span>,
              e.applicant,
              <span className="mono">{e.date}</span>,
              e.approver,
              <StatusTag variant={expenseStatusToVariant(e.status)} label={expenseStatusLabel(e.status)} />,
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
