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

/* ── 销售订单统计 ── */
const orderStats: StatCardData[] = [
  {
    label: '订单总数', value: '58',
    trend: { direction: 'up', value: '+8 单' },
    icon: <svg viewBox="0 0 18 18" fill="none"><rect x="4" y="2" width="10" height="14" rx="2" stroke="currentColor" strokeWidth="1.3"/></svg>,
  },
  {
    label: '销售总额', value: '1,285,600', unit: '¥',
    trend: { direction: 'up', value: '12.5%' },
    icon: <svg viewBox="0 0 18 18" fill="none"><path d="M3 14l3-4 3 2 3-5 3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  },
  {
    label: '待审核', value: '5',
    trend: { direction: 'down', value: '2 单' },
    icon: <svg viewBox="0 0 18 18" fill="none"><rect x="3" y="5" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M7 8h4M7 11h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  },
  {
    label: '运输中', value: '3',
    trend: { direction: 'up', value: '+1 单' },
    icon: <svg viewBox="0 0 18 18" fill="none"><path d="M2 12h10l4-4H6L2 12zM6 8l2-4h8l-2 4" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>,
  },
];

/* ── 销售报价统计 ── */
const pricingStats: StatCardData[] = [
  {
    label: '报价单数', value: '42', unit: '单',
    trend: { direction: 'up', value: '+5 单' },
    icon: <svg viewBox="0 0 18 18" fill="none"><rect x="3" y="5" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M3 9h12M7 5V3h4v2" stroke="currentColor" strokeWidth="1.3"/></svg>,
  },
  {
    label: '待确认', value: '9', unit: '单',
    trend: { direction: 'up', value: '需及时处理' },
    icon: <svg viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.3"/><path d="M9 6v3l2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  },
  {
    label: '本月调价', value: '15', unit: '项',
    trend: { direction: 'down', value: '3 项' },
    icon: <svg viewBox="0 0 18 18" fill="none"><path d="M3 14l3-4 3 2 3-5 3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  },
  {
    label: '转化率', value: '68.5', unit: '%',
    trend: { direction: 'up', value: '2.1%' },
    icon: <svg viewBox="0 0 18 18" fill="none"><path d="M9 2l2.5 5 5.5.8-4 3.9.9 5.5L9 14.7 5.1 17.2l.9-5.5-4-3.9L7.5 7z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>,
  },
];

/* ── 客户管理统计 ── */
const customerStats: StatCardData[] = [
  {
    label: '客户总数', value: '35', unit: '家',
    trend: { direction: 'up', value: '+3 家' },
    icon: <svg viewBox="0 0 18 18" fill="none"><circle cx="7" cy="6.5" r="2.8" stroke="currentColor" strokeWidth="1.3"/><path d="M1 15c0-3 2.7-5 6-5s6 2 6 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><circle cx="13" cy="7" r="2.2" stroke="currentColor" strokeWidth="1.2"/><path d="M13 11c2 0 4 1.5 4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  },
  {
    label: '直营客户', value: '12', unit: '家',
    trend: { direction: 'up', value: '+1 家' },
    icon: <svg viewBox="0 0 18 18" fill="none"><path d="M3 8.5L9 3.5l6 5" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" strokeLinecap="round"/><path d="M4.5 8v7h9v-7" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>,
  },
  {
    label: '渠道客户', value: '13', unit: '家',
    trend: { direction: 'up', value: '+1 家' },
    icon: <svg viewBox="0 0 18 18" fill="none"><path d="M2 10l3 2 3-4 3 5 3-3 2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><circle cx="4" cy="5" r="1.5" stroke="currentColor" strokeWidth="1.3"/></svg>,
  },
  {
    label: '平台客户', value: '10', unit: '家',
    trend: { direction: 'up', value: '+1 家' },
    icon: <svg viewBox="0 0 18 18" fill="none"><rect x="3" y="5" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M6 5V3.5A1.5 1.5 0 017.5 2h3A1.5 1.5 0 0112 3.5V5" stroke="currentColor" strokeWidth="1.3"/><path d="M9 8v2M8 9h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  },
];

/* ── 销售对账统计 ── */
const reconciliationStats: StatCardData[] = [
  {
    label: '待对账', value: '6',
    trend: { direction: 'up', value: '需及时处理' },
    icon: <svg viewBox="0 0 18 18" fill="none"><rect x="3" y="4" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M6 8h6M6 11h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  },
  {
    label: '对账中', value: '4',
    trend: { direction: 'up', value: '+1 单' },
    icon: <svg viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.3"/><path d="M9 6v3.5l2.5 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  },
  {
    label: '已确认', value: '28',
    trend: { direction: 'up', value: '+5 单' },
    icon: <svg viewBox="0 0 18 18" fill="none"><path d="M4 9l3.5 3.5L14 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  },
  {
    label: '本月对账额', value: '986,500', unit: '¥',
    trend: { direction: 'up', value: '15.2%' },
    icon: <svg viewBox="0 0 18 18" fill="none"><path d="M3 14l3-4 3 2 3-5 3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 7h2v7H2V9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  },
];

/* ── 销售退货统计 ── */
const returnStats: StatCardData[] = [
  {
    label: '退货单数', value: '8',
    trend: { direction: 'down', value: '2 单', label: '较上月' },
    icon: <svg viewBox="0 0 18 18" fill="none"><path d="M3 6h12l-1.2 8H4.2L3 6z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><path d="M7 10l3 3M10 10l-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  },
  {
    label: '退货金额', value: '28,960', unit: '¥',
    trend: { direction: 'down', value: '5.4%' },
    icon: <svg viewBox="0 0 18 18" fill="none"><rect x="2" y="4" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M5 8h2M5 11h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  },
  {
    label: '待处理', value: '2',
    trend: { direction: 'up', value: '需及时处理' },
    icon: <svg viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.3"/><path d="M9 6v4M9 12.5v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  },
  {
    label: '退货率', value: '1.2', unit: '%',
    trend: { direction: 'down', value: '0.3%' },
    icon: <svg viewBox="0 0 18 18" fill="none"><path d="M3 14l3-4 3 2 3-5 3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
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

        {/* 子页面分组统计 */}
        <Card title="销售订单" style={{ marginTop: 'var(--space-4)' }}>
          <div className="stat-cards">
            {orderStats.map((s, i) => <StatCard key={i} data={s} />)}
          </div>
        </Card>

        <Card title="销售报价" style={{ marginTop: 'var(--space-4)' }}>
          <div className="stat-cards">
            {pricingStats.map((s, i) => <StatCard key={i} data={s} />)}
          </div>
        </Card>

        <Card title="客户管理" style={{ marginTop: 'var(--space-4)' }}>
          <div className="stat-cards">
            {customerStats.map((s, i) => <StatCard key={i} data={s} />)}
          </div>
        </Card>

        <Card title="销售对账" style={{ marginTop: 'var(--space-4)' }}>
          <div className="stat-cards">
            {reconciliationStats.map((s, i) => <StatCard key={i} data={s} />)}
          </div>
        </Card>

        <Card title="销售退货" style={{ marginTop: 'var(--space-4)' }}>
          <div className="stat-cards">
            {returnStats.map((s, i) => <StatCard key={i} data={s} />)}
          </div>
        </Card>

        {/* 销售趋势 + 待办事项 */}
        <div className="grid-2" style={{ marginTop: 'var(--space-4)' }}>
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
