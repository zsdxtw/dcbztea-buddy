import ContentHeader from '../../components/layout/ContentHeader';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import LineChart from '../../components/charts/LineChart';
import PieChart from '../../components/charts/PieChart';
import Button from '../../components/common/Button';
import type { StatCardData } from '../../types';

const stats: StatCardData[] = [
  { label: '总收入', value: '2,156,800', unit: '¥', trend: { direction: 'up', value: '18.5%' }, icon: <svg viewBox="0 0 18 18" fill="none"><path d="M3 14l3-4 3 2 3-5 3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { label: '总支出', value: '1,423,600', unit: '¥', trend: { direction: 'up', value: '8.2%' }, icon: <svg viewBox="0 0 18 18" fill="none"><path d="M3 5h12l-1.2 8H4.2L3 5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg> },
  { label: '应收余额', value: '586,200', unit: '¥', icon: <svg viewBox="0 0 18 18" fill="none"><rect x="2" y="4" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M5 8h2M5 11h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> },
  { label: '应付余额', value: '312,800', unit: '¥', icon: <svg viewBox="0 0 18 18" fill="none"><rect x="4" y="2" width="10" height="14" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M7 6h4M7 9h4M7 12h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg> },
  { label: '本月利润', value: '733,200', unit: '¥', trend: { direction: 'up', value: '25.3%' }, icon: <svg viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.3"/><path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { label: '利润率', value: '34.0', unit: '%', icon: <svg viewBox="0 0 18 18" fill="none"><path d="M9 2l2.5 5 5.5.8-4 3.9.9 5.5L9 14.7 5.1 17.2l.9-5.5-4-3.9L7.5 7z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg> },
];

const purchasePaymentStats: StatCardData[] = [
  { label: '待付款', value: '312,800', unit: '¥', icon: <svg viewBox="0 0 18 18" fill="none"><rect x="2" y="4" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M5 8h2M5 11h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> },
  { label: '本月已付', value: '458,200', unit: '¥', trend: { direction: 'up', value: '12.5%' }, icon: <svg viewBox="0 0 18 18" fill="none"><path d="M3 14l3-4 3 2 3-5 3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { label: '付款单数', value: '15', unit: '笔', icon: <svg viewBox="0 0 18 18" fill="none"><rect x="4" y="2" width="10" height="14" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M7 6h4M7 9h4M7 12h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg> },
  { label: '逾期', value: '2', unit: '笔', icon: <svg viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.3"/><path d="M9 6v4M9 12.5v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> },
];

const salesCollectionStats: StatCardData[] = [
  { label: '待回款', value: '586,200', unit: '¥', icon: <svg viewBox="0 0 18 18" fill="none"><rect x="2" y="4" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M5 8h2M5 11h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> },
  { label: '本月已收', value: '698,500', unit: '¥', trend: { direction: 'up', value: '22.3%' }, icon: <svg viewBox="0 0 18 18" fill="none"><path d="M3 14l3-4 3 2 3-5 3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { label: '回款单数', value: '22', unit: '笔', icon: <svg viewBox="0 0 18 18" fill="none"><rect x="4" y="2" width="10" height="14" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M7 6h4M7 9h4M7 12h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg> },
  { label: '逾期', value: '3', unit: '笔', icon: <svg viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.3"/><path d="M9 6v4M9 12.5v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> },
];

const otherReceivableStats: StatCardData[] = [
  { label: '应收余额', value: '45,600', unit: '¥', icon: <svg viewBox="0 0 18 18" fill="none"><rect x="2" y="4" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M5 8h2M5 11h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> },
  { label: '本月新增', value: '12,800', unit: '¥', trend: { direction: 'up', value: '3 笔' }, icon: <svg viewBox="0 0 18 18" fill="none"><path d="M3 14l3-4 3 2 3-5 3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { label: '本月收回', value: '8,500', unit: '¥', icon: <svg viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.3"/><path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { label: '逾期', value: '1', unit: '笔', icon: <svg viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.3"/><path d="M9 6v4M9 12.5v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> },
];

const revenueTrendData = {
  labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月'],
  series: [
    { name: '收入', color: 'var(--color-module-current-base)', data: [180, 165, 210, 195, 230, 245, 280] },
    { name: '支出', color: 'var(--color-module-finance-secondary)', data: [120, 110, 140, 135, 155, 160, 175] },
  ],
};

const receivablePayablePieData = [
  { name: '应收金额', value: 65, color: 'var(--color-module-current-base)' },
  { name: '应付金额', value: 35, color: 'var(--color-module-finance-secondary)' },
];

const todoItems = [
  { text: '华茗堂茶庄应收款 ¥28,600 即将到期', time: '3天后', type: '收款' },
  { text: '武夷山茶业应付单 ¥42,800 待付款', time: '今日', type: '付款' },
  { text: '与雅韵茶社6月对账单待确认', time: '明天', type: '对账' },
  { text: '云南普洱茶业逾期付款 ¥45,600', time: '已逾期5天', type: '逾期' },
  { text: '品茗轩销项发票 ¥38,000 待开具', time: '本周内', type: '开票' },
];

function todoTypeColor(type: string) {
  switch (type) {
    case '收款': return '#01795D';
    case '付款': return 'var(--color-module-current-base)';
    case '对账': return 'var(--color-module-finance-secondary)';
    case '逾期': return '#CB405D';
    case '开票': return '#FD742D';
    default: return 'var(--color-neutral-400)';
  }
}

export default function FinanceOverview() {
  return (
    <>
      <ContentHeader title="财务概览" breadcrumbs={['财务', '财务概览']} actions={<Button><PlusIcon />新建收支</Button>} />
      <div className="content-body">
        <div className="stat-cards">
          {stats.map((s, i) => <StatCard key={i} data={s} />)}
        </div>
        <div className="grid-2">
          <Card title="采购付款">
            <div className="stat-cards">
              {purchasePaymentStats.map((s, i) => <StatCard key={i} data={s} />)}
            </div>
          </Card>
          <Card title="销售回款">
            <div className="stat-cards">
              {salesCollectionStats.map((s, i) => <StatCard key={i} data={s} />)}
            </div>
          </Card>
        </div>
        <Card title="其他应收" style={{ marginTop: 'var(--space-4)' }}>
          <div className="stat-cards">
            {otherReceivableStats.map((s, i) => <StatCard key={i} data={s} />)}
          </div>
        </Card>
        <div className="grid-2">
          <Card title="收支趋势">
            <LineChart data={revenueTrendData} />
          </Card>
          <Card title="应收应付概览">
            <PieChart data={receivablePayablePieData} />
          </Card>
        </div>
        <Card title="近期待办" style={{ marginTop: 'var(--space-4)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {todoItems.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-2) 0', borderBottom: i < todoItems.length - 1 ? '1px solid var(--color-border-primary)' : 'none' }}>
                <span style={{ padding: '1px 8px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-medium)', background: `${todoTypeColor(item.type)}12`, color: todoTypeColor(item.type), border: `1px solid ${todoTypeColor(item.type)}30`, flexShrink: 0 }}>{item.type}</span>
                <span style={{ flex: 1, fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}>{item.text}</span>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', flexShrink: 0 }}>{item.time}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}

function PlusIcon() {
  return <svg viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
}
