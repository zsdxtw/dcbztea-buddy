import ContentHeader from '../../components/layout/ContentHeader';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Tag from '../../components/common/Tag';
import StatusTag, { orderStatusToVariant, orderStatusLabel } from '../../components/common/StatusTag';
import LineChart from '../../components/charts/LineChart';
import { purchaseOrders } from '../../data/mock';
import type { StatCardData } from '../../types';

/* ── 统计卡片数据 ── */
const statCards: StatCardData[] = [
  {
    label: '本月采购额',
    value: '856,200',
    unit: '¥',
    trend: { direction: 'down', value: '3.2%' },
    icon: <svg viewBox="0 0 18 18" fill="none"><path d="M3 5h12l-1.2 8H4.2L3 5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><path d="M7 5V3.5a2 2 0 014 0V5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  },
  {
    label: '采购订单数',
    value: '47',
    trend: { direction: 'up', value: '+5 单' },
    icon: <svg viewBox="0 0 18 18" fill="none"><rect x="4" y="2" width="10" height="14" rx="2" stroke="currentColor" strokeWidth="1.3"/></svg>,
  },
  {
    label: '待审核',
    value: '6',
    trend: { direction: 'down', value: '3 单' },
    icon: <svg viewBox="0 0 18 18" fill="none"><rect x="3" y="5" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M7 8h4M7 11h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  },
  {
    label: '供应商数',
    value: '10',
    trend: { direction: 'up', value: '+2' },
    icon: <svg viewBox="0 0 18 18" fill="none"><circle cx="9" cy="7" r="3" stroke="currentColor" strokeWidth="1.3"/><path d="M3 15a6 6 0 0112 0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  },
  {
    label: '本月退货额',
    value: '45,680',
    unit: '¥',
    trend: { direction: 'down', value: '8.5%' },
    icon: <svg viewBox="0 0 18 18" fill="none"><path d="M3 5h12l-1.2 8H4.2L3 5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><path d="M11 5l2-2M13 3l0 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  },
  {
    label: '待对账',
    value: '8',
    trend: { direction: 'up', value: '需及时处理' },
    icon: <svg viewBox="0 0 18 18" fill="none"><rect x="2" y="4" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M6 8h6M6 11h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  },
];

/* ── 采购订单统计 ── */
const orderStats: StatCardData[] = [
  {
    label: '订单总数', value: '47', unit: '单',
    trend: { direction: 'up', value: '+5单' },
    icon: <svg viewBox="0 0 18 18" fill="none"><rect x="3" y="5" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M3 9h12M7 5V3h4v2" stroke="currentColor" strokeWidth="1.3"/></svg>,
  },
  {
    label: '采购总额', value: '856,200', unit: '¥',
    trend: { direction: 'down', value: '3.2%' },
    icon: <svg viewBox="0 0 18 18" fill="none"><path d="M9 2v14M2 9l7-7 7 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 13a4 4 0 018 0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  },
  {
    label: '待审核', value: '6', unit: '单',
    trend: { direction: 'down', value: '3单' },
    icon: <svg viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.3"/><path d="M9 6v3l2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  },
  {
    label: '运输中', value: '4', unit: '单',
    trend: { direction: 'up', value: '+1单' },
    icon: <svg viewBox="0 0 18 18" fill="none"><path d="M2 13h10V5H2v8zM12 8h3l2 3v2h-5V8z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><circle cx="5.5" cy="14.5" r="1.5" stroke="currentColor" strokeWidth="1.2"/><circle cx="14" cy="14.5" r="1.5" stroke="currentColor" strokeWidth="1.2"/></svg>,
  },
];

/* ── 采购报价统计 ── */
const pricingStats: StatCardData[] = [
  {
    label: '报价单数', value: '35', unit: '单',
    trend: { direction: 'up', value: '+3', label: '单' },
    icon: <svg viewBox="0 0 18 18" fill="none"><rect x="3" y="5" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M3 9h12M7 5V3h4v2" stroke="currentColor" strokeWidth="1.3"/></svg>,
  },
  {
    label: '待确认', value: '8', unit: '单',
    trend: { direction: 'up', value: '需及时处理' },
    icon: <svg viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.3"/><path d="M9 6v3l2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  },
  {
    label: '本月调价', value: '12', unit: '项',
    trend: { direction: 'down', value: '2', label: '项' },
    icon: <svg viewBox="0 0 18 18" fill="none"><path d="M3 14l3-4 3 2 3-5 3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  },
  {
    label: '平均调幅', value: '-2.3', unit: '%',
    trend: { direction: 'down', value: '0.5', label: '%' },
    icon: <svg viewBox="0 0 18 18" fill="none"><path d="M9 2l2.5 5 5.5.8-4 3.9.9 5.5L9 14.7 5.1 17.2l.9-5.5-4-3.9L7.5 7z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>,
  },
];

/* ── 供应商管理统计 ── */
const supplierStats: StatCardData[] = [
  {
    label: '品牌方', value: '6', unit: '家',
    trend: { direction: 'up', value: '在册 5 家' },
    icon: <svg viewBox="0 0 18 18" fill="none"><path d="M9 2L3 5v5c0 5 3.5 7.5 7 9 3.5-1.5 7-4 7-9V5L9 2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>,
  },
  {
    label: '合作方', value: '4', unit: '家',
    trend: { direction: 'up', value: '在册 4 家' },
    icon: <svg viewBox="0 0 18 18" fill="none"><circle cx="7" cy="7" r="3" stroke="currentColor" strokeWidth="1.3"/><path d="M2 16a5 5 0 0110 0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><circle cx="14" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.2"/></svg>,
  },
  {
    label: '在册供应商', value: '9', unit: '家',
    trend: { direction: 'up', value: '总计 10 家' },
    icon: <svg viewBox="0 0 18 18" fill="none"><rect x="3" y="5" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M3 9h12M7 5V3h4v2" stroke="currentColor" strokeWidth="1.3"/></svg>,
  },
  {
    label: 'A级以上', value: '6', unit: '家',
    trend: { direction: 'up', value: '占比 60%' },
    icon: <svg viewBox="0 0 18 18" fill="none"><path d="M9 2l2.5 5 5.5.8-4 3.9.9 5.5L9 14.7 5.1 17.2l.9-5.5-4-3.9L7.5 7z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>,
  },
];

/* ── 供应商对账统计 ── */
const reconciliationStats: StatCardData[] = [
  {
    label: '待对账', value: '8',
    trend: { direction: 'up', value: '需及时处理' },
    icon: <svg viewBox="0 0 18 18" fill="none"><rect x="3" y="4" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M6 8h6M6 11h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  },
  {
    label: '对账中', value: '5',
    trend: { direction: 'up', value: '+1单' },
    icon: <svg viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.3"/><path d="M9 6v3.5l2.5 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  },
  {
    label: '已确认', value: '32',
    trend: { direction: 'up', value: '+4单' },
    icon: <svg viewBox="0 0 18 18" fill="none"><path d="M4 9l3.5 3.5L14 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  },
  {
    label: '本月对账额', value: '1,256,800', unit: '¥',
    trend: { direction: 'up', value: '12.5%' },
    icon: <svg viewBox="0 0 18 18" fill="none"><path d="M3 14l3-4 3 2 3-5 3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 7h2v7H2V9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  },
];

/* ── 采购退货统计 ── */
const returnStats: StatCardData[] = [
  {
    label: '退货单数', value: '12',
    trend: { direction: 'down', value: '3单', label: '较上月' },
    icon: <svg viewBox="0 0 18 18" fill="none"><path d="M3 6h12l-1.2 8H4.2L3 6z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><path d="M7 10l3 3M10 10l-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  },
  {
    label: '退货金额', value: '45,680', unit: '¥',
    trend: { direction: 'down', value: '8.5%' },
    icon: <svg viewBox="0 0 18 18" fill="none"><rect x="2" y="4" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M5 8h2M5 11h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  },
  {
    label: '待处理', value: '3',
    trend: { direction: 'up', value: '需及时处理' },
    icon: <svg viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.3"/><path d="M9 6v4M9 12.5v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  },
  {
    label: '本月退货率', value: '2.1', unit: '%',
    trend: { direction: 'down', value: '0.3%' },
    icon: <svg viewBox="0 0 18 18" fill="none"><path d="M3 14l3-4 3 2 3-5 3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  },
];

/* ── 入库管理统计 ── */
const inboundStats: StatCardData[] = [
  {
    label: '待入库', value: '8',
    trend: { direction: 'up', value: '2 单', label: '较昨日' },
    icon: <svg viewBox="0 0 18 18" fill="none"><rect x="3" y="5" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M3 9h12" stroke="currentColor" strokeWidth="1.3"/></svg>,
  },
  {
    label: '已入库', value: '156', unit: '单',
    trend: { direction: 'up', value: '12%', label: '较上月' },
    icon: <svg viewBox="0 0 18 18" fill="none"><rect x="3" y="5" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M3 9h12" stroke="currentColor" strokeWidth="1.3"/><path d="M6 10l3 3 4-5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  },
  {
    label: '入库总量', value: '4,280', unit: 'kg',
    trend: { direction: 'up', value: '8.5%', label: '较上月' },
    icon: <svg viewBox="0 0 18 18" fill="none"><rect x="3" y="5" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3"/></svg>,
  },
  {
    label: '入库金额', value: '1,286,400', unit: '¥',
    trend: { direction: 'up', value: '15.2%', label: '较上月' },
    icon: <svg viewBox="0 0 18 18" fill="none"><rect x="2" y="4" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M5 8h2M5 11h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  },
];

/* ── 采购趋势数据 ── */
const purchaseTrendData = {
  labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月'],
  series: [
    { name: '采购额', color: 'var(--color-module-current-base)', data: [68, 72, 85, 78, 92, 88, 86] },
    { name: '去年同期', color: 'var(--color-neutral-300)', data: [55, 60, 70, 65, 75, 72, 70] },
  ],
};

/* ── 待办事项 ── */
const todoItems = [
  { text: '审核采购订单 PO-2025-0151', time: '10:30', done: false },
  { text: '确认大红袍入库', time: '11:00', done: false },
  { text: '供应商对账 — 武夷山茶业', time: '14:00', done: false },
  { text: '确认清香铁观音到货', time: '15:30', done: false },
  { text: '跟进白牡丹采购进度', time: '16:00', done: false },
];

export default function PurchaseOverview() {
  return (
    <>
      <ContentHeader title="采购概览" breadcrumbs={['采购', '采购概览']} />
      <div className="content-body">
        {/* 核心指标 */}
        <div className="stat-cards">
          {statCards.map((s, i) => <StatCard key={i} data={s} />)}
        </div>

        {/* 子页面统计卡片分组 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
          <Card title="采购订单">
            <div className="stat-cards">
              {orderStats.map((s, i) => <StatCard key={i} data={s} />)}
            </div>
          </Card>
          <Card title="采购报价">
            <div className="stat-cards">
              {pricingStats.map((s, i) => <StatCard key={i} data={s} />)}
            </div>
          </Card>
          <Card title="供应商管理">
            <div className="stat-cards">
              {supplierStats.map((s, i) => <StatCard key={i} data={s} />)}
            </div>
          </Card>
          <Card title="供应商对账">
            <div className="stat-cards">
              {reconciliationStats.map((s, i) => <StatCard key={i} data={s} />)}
            </div>
          </Card>
          <Card title="采购退货">
            <div className="stat-cards">
              {returnStats.map((s, i) => <StatCard key={i} data={s} />)}
            </div>
          </Card>
          <Card title="入库管理">
            <div className="stat-cards">
              {inboundStats.map((s, i) => <StatCard key={i} data={s} />)}
            </div>
          </Card>
        </div>

        {/* 采购趋势 + 待办事项 */}
        <div className="grid-2">
          <Card title="采购趋势">
            <LineChart data={purchaseTrendData} />
          </Card>
          <Card title="待办事项" headerRight={<span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-module-purchase-secondary)' }}>{todoItems.filter(t => !t.done).length} 项待处理</span>}>
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

        {/* 近期采购订单 */}
        <Card title="近期采购订单" style={{ marginTop: 'var(--space-4)' }}>
          <Table
            headers={['订单编号', '供应商', '商品', '茶类', '数量', '金额', '状态']}
            rows={purchaseOrders.map(order => [
              <span className="mono" style={{ fontWeight: 'var(--font-medium)' }}>{order.code}</span>,
              <span>{order.partner}</span>,
              <span style={{ fontWeight: 'var(--font-medium)' }}>{order.product}</span>,
              <Tag category={order.teaCategory} />,
              <span className="mono">{order.quantity}</span>,
              <span className="mono">{order.amount}</span>,
              <StatusTag variant={orderStatusToVariant(order.status)} label={orderStatusLabel(order.status)} />,
            ])}
          />
        </Card>
      </div>
    </>
  );
}
