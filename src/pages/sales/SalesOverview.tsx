import ContentHeader from '../../components/layout/ContentHeader';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Tag from '../../components/common/Tag';
import StatusTag, { orderStatusToVariant, orderStatusLabel } from '../../components/common/StatusTag';
import LineChart from '../../components/charts/LineChart';
import { salesOrders } from '../../data/mock';
import type { StatCardData } from '../../types';

/* ── 统计卡片数据 ── */
const statCards: StatCardData[] = [
  {
    label: '本月销售额',
    value: '1,285,600',
    unit: '¥',
    trend: { direction: 'up', value: '12.5%' },
    icon: <svg viewBox="0 0 18 18" fill="none"><path d="M3 14l3-4 3 2 3-5 3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  },
  {
    label: '销售订单数',
    value: '58',
    trend: { direction: 'up', value: '+8 单' },
    icon: <svg viewBox="0 0 18 18" fill="none"><rect x="4" y="2" width="10" height="14" rx="2" stroke="currentColor" strokeWidth="1.3"/></svg>,
  },
  {
    label: '待审核',
    value: '5',
    trend: { direction: 'down', value: '2 单' },
    icon: <svg viewBox="0 0 18 18" fill="none"><rect x="3" y="5" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M7 8h4M7 11h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  },
  {
    label: '客户数',
    value: '25',
    trend: { direction: 'up', value: '+3' },
    icon: <svg viewBox="0 0 18 18" fill="none"><circle cx="9" cy="7" r="3" stroke="currentColor" strokeWidth="1.3"/><path d="M3 15a6 6 0 0112 0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  },
  {
    label: '本月退货额',
    value: '28,960',
    unit: '¥',
    trend: { direction: 'down', value: '5.4%' },
    icon: <svg viewBox="0 0 18 18" fill="none"><path d="M3 5h12l-1.2 8H4.2L3 5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><path d="M11 5l2-2M13 3l0 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  },
  {
    label: '待对账',
    value: '6',
    trend: { direction: 'up', value: '需及时处理' },
    icon: <svg viewBox="0 0 18 18" fill="none"><rect x="2" y="4" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M6 8h6M6 11h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  },
];

/* ── 销售趋势数据 ── */
const salesTrendData = {
  labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月'],
  series: [
    { name: '销售额', color: 'var(--color-module-current-base)', data: [82, 78, 95, 88, 105, 98, 128] },
    { name: '去年同期', color: 'var(--color-neutral-300)', data: [65, 60, 75, 70, 82, 78, 85] },
  ],
};

/* ── 待办事项 ── */
const todoItems = [
  { text: '审核销售订单 SO-2025-0242', time: '10:00', done: false },
  { text: '确认华茗堂茶庄发货', time: '11:30', done: false },
  { text: '客户对账 — 雅韵茶社', time: '14:00', done: false },
  { text: '跟进清心茶坊退货处理', time: '15:30', done: false },
  { text: '确认品茗轩报价单', time: '16:00', done: false },
];

export default function SalesOverview() {
  return (
    <>
      <ContentHeader title="销售概览" breadcrumbs={['销售', '销售概览']} />
      <div className="content-body">
        {/* 核心指标 */}
        <div className="stat-cards">
          {statCards.map((s, i) => <StatCard key={i} data={s} />)}
        </div>

        {/* 销售趋势 + 待办事项 */}
        <div className="grid-2">
          <Card title="销售趋势">
            <LineChart data={salesTrendData} />
          </Card>
          <Card title="待办事项" headerRight={<span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-module-sales-secondary)' }}>{todoItems.filter(t => !t.done).length} 项待处理</span>}>
            <div style={{ padding: 'var(--space-2) 0' }}>
              {todoItems.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-2) 0', borderBottom: i < todoItems.length - 1 ? '1px solid var(--color-neutral-100)' : 'none' }}>
                  <span style={{
                    width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                    background: item.done ? 'var(--color-neutral-300)' : 'var(--color-module-current-base)',
                  }} />
                  <span style={{
                    flex: 1, fontSize: 'var(--text-sm)',
                    color: item.done ? 'var(--color-neutral-400)' : 'var(--color-neutral-700)',
                    textDecoration: item.done ? 'line-through' : 'none',
                  }}>{item.text}</span>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-400)', fontFamily: 'var(--font-family-mono)', flexShrink: 0 }}>{item.time}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* 近期销售订单 */}
        <Card title="近期销售订单" style={{ marginTop: 'var(--space-4)' }}>
          <Table
            headers={['订单编号', '客户', '商品', '茶类', '金额', '状态']}
            rows={salesOrders.map(order => [
              <span className="mono" style={{ fontWeight: 'var(--font-medium)' }}>{order.code}</span>,
              <span>{order.partner}</span>,
              <span style={{ fontWeight: 'var(--font-medium)' }}>{order.product}</span>,
              <Tag category={order.teaCategory} />,
              <span className="mono">{order.amount}</span>,
              <StatusTag variant={orderStatusToVariant(order.status)} label={orderStatusLabel(order.status)} />,
            ])}
          />
        </Card>
      </div>
    </>
  );
}
