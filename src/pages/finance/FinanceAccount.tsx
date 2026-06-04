import ContentHeader from '../../components/layout/ContentHeader';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import StatusTag from '../../components/common/StatusTag';
import Button from '../../components/common/Button';
import type { StatCardData } from '../../types';

const stats: StatCardData[] = [
  { label: '账户总数', value: '6', icon: <svg viewBox="0 0 18 18" fill="none"><rect x="2" y="4" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M5 8h2M5 11h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> },
  { label: '总余额', value: '1,256,800', unit: '¥', trend: { direction: 'up', value: '8.5%' }, icon: <svg viewBox="0 0 18 18" fill="none"><path d="M3 14l3-4 3 2 3-5 3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { label: '本月流水', value: '535,000', unit: '¥', trend: { direction: 'up', value: '15.2%' }, icon: <svg viewBox="0 0 18 18" fill="none"><rect x="3" y="10" width="4" height="7" rx="0.5" stroke="currentColor" strokeWidth="1.3"/><rect x="8" y="6" width="4" height="11" rx="0.5" stroke="currentColor" strokeWidth="1.3"/><rect x="13" y="3" width="4" height="14" rx="0.5" stroke="currentColor" strokeWidth="1.3"/></svg> },
  { label: '冻结金额', value: '45,000', unit: '¥', trend: { direction: 'down', value: '¥8,200' }, icon: <svg viewBox="0 0 18 18" fill="none"><rect x="3" y="5" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M3 9h12" stroke="currentColor" strokeWidth="1.3"/></svg> },
];

const accountItems = [
  { name: '公司基本户', type: '银行账户', lastFour: '8862', balance: '¥ 856,200', income: '¥ 328,600', expense: '¥ 215,400', status: 'active' as const },
  { name: '公司一般户', type: '银行账户', lastFour: '3356', balance: '¥ 215,600', income: '¥ 86,400', expense: '¥ 124,800', status: 'active' as const },
  { name: '支付宝账户', type: '第三方支付', lastFour: '7721', balance: '¥ 68,500', income: '¥ 45,200', expense: '¥ 38,600', status: 'active' as const },
  { name: '微信支付账户', type: '第三方支付', lastFour: '4438', balance: '¥ 42,300', income: '¥ 28,800', expense: '¥ 22,400', status: 'active' as const },
  { name: '承兑汇票户', type: '票据账户', lastFour: '0091', balance: '¥ 129,200', income: '¥ 86,000', expense: '¥ 52,600', status: 'frozen' as const },
  { name: '保证金账户', type: '银行账户', lastFour: '5567', balance: '¥ 45,000', income: '¥ 0', expense: '¥ 0', status: 'frozen' as const },
];

function accountStatusToVariant(status: string) {
  switch (status) {
    case 'active': return 'success' as const;
    case 'frozen': return 'warning' as const;
    default: return 'info' as const;
  }
}

function accountStatusLabel(status: string) {
  switch (status) {
    case 'active': return '正常';
    case 'frozen': return '冻结';
    default: return status;
  }
}

export default function FinanceAccount() {
  return (
    <>
      <ContentHeader title="账户管理" breadcrumbs={['财务', '账户管理']} actions={<Button><PlusIcon />新增账户</Button>} />
      <div className="content-body">
        <div className="stat-cards">
          {stats.map((s, i) => <StatCard key={i} data={s} />)}
        </div>
        <Card>
          <Table
            headers={['账户名称', '账户类型', '账号后四位', '余额', '本月收入', '本月支出', '状态']}
            rows={accountItems.map((a) => [
              <span style={{ fontWeight: 'var(--font-medium)' }}>{a.name}</span>,
              <span style={{ color: 'var(--color-neutral-500)' }}>{a.type}</span>,
              <span className="mono" style={{ color: 'var(--color-neutral-500)' }}>**** {a.lastFour}</span>,
              <span className="mono" style={{ fontWeight: 'var(--font-medium)' }}>{a.balance}</span>,
              <span className="mono" style={{ color: 'var(--color-semantic-success)' }}>{a.income}</span>,
              <span className="mono" style={{ color: 'var(--color-semantic-error)' }}>{a.expense}</span>,
              <StatusTag variant={accountStatusToVariant(a.status)} label={accountStatusLabel(a.status)} />,
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
