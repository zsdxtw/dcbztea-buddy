import ContentHeader from '../../components/layout/ContentHeader';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import AlertItem from '../../components/business/AlertItem';
import { alertItems } from '../../data/mock';
import type { StatCardData } from '../../types';

const stats: StatCardData[] = [
  { label: '库存总量', value: '42,680', unit: 'kg', icon: <svg viewBox="0 0 18 18" fill="none"><rect x="3" y="5" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3"/></svg> },
  { label: 'SKU数量', value: '328', icon: <svg viewBox="0 0 18 18" fill="none"><rect x="4" y="2" width="10" height="14" rx="2" stroke="currentColor" strokeWidth="1.3"/></svg> },
  { label: '库存预警', value: '4', icon: <svg viewBox="0 0 18 18" fill="none"><path d="M10 2a5 5 0 015 5v3l2 2H3l2-2V7a5 5 0 015-5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg> },
  { label: '本月入库', value: '15,200', unit: 'kg', trend: { direction: 'up', value: '+8.5%' }, icon: <svg viewBox="0 0 18 18" fill="none"><path d="M9 2v10M5 8l4 4 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 14h12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> },
  { label: '本月出库', value: '12,800', unit: 'kg', trend: { direction: 'up', value: '+5.2%' }, icon: <svg viewBox="0 0 18 18" fill="none"><path d="M9 14V4M5 8l4-4 4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 14h12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> },
  { label: '调拨中', value: '3', unit: '单', icon: <svg viewBox="0 0 18 18" fill="none"><path d="M3 9h12M12 6l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg> },
];

const checkStats: StatCardData[] = [
  { label: '盘点单数', value: '6', unit: '单', icon: <svg viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.3"/><path d="M9 6v4M9 12.5v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> },
  { label: '盘点中', value: '2', unit: '单', trend: { direction: 'up', value: '+1单' }, icon: <svg viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.3"/><path d="M9 6v4l3 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { label: '差异项', value: '8', unit: '种', trend: { direction: 'down', value: '-2种' }, icon: <svg viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.3"/><path d="M6 10l2 2 4-5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { label: '盘点准确率', value: '97.2', unit: '%', trend: { direction: 'up', value: '+0.5%' }, icon: <svg viewBox="0 0 18 18" fill="none"><path d="M3 14l3-4 3 2 3-5 3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg> },
];

const transferStats: StatCardData[] = [
  { label: '调拨单数', value: '8', unit: '单', icon: <svg viewBox="0 0 18 18" fill="none"><path d="M3 9h12M12 6l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { label: '调拨中', value: '3', unit: '单', trend: { direction: 'up', value: '+1单' }, icon: <svg viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.3"/><path d="M9 6v3l2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { label: '已完成', value: '5', unit: '单', icon: <svg viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.3"/><path d="M6 10l2 2 4-5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { label: '待审核', value: '2', unit: '单', icon: <svg viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.3"/><path d="M9 6v4M9 12.5v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> },
];

const otherIOStats: StatCardData[] = [
  { label: '出入库单数', value: '12', unit: '单', icon: <svg viewBox="0 0 18 18" fill="none"><path d="M9 2v10M5 8l4 4 4-4M9 14V4M5 8l4-4 4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { label: '入库量', value: '2,500', unit: 'kg', trend: { direction: 'up', value: '+12%' }, icon: <svg viewBox="0 0 18 18" fill="none"><path d="M9 2v10M5 8l4 4 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 14h12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> },
  { label: '出库量', value: '1,800', unit: 'kg', trend: { direction: 'down', value: '-5%' }, icon: <svg viewBox="0 0 18 18" fill="none"><path d="M9 14V4M5 8l4-4 4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 14h12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> },
  { label: '待审核', value: '2', unit: '单', icon: <svg viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.3"/><path d="M9 6v3l2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg> },
];

const settingsStats: StatCardData[] = [
  { label: '仓库总数', value: '6', unit: '个', icon: <svg viewBox="0 0 18 18" fill="none"><rect x="3" y="5" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M3 9h12" stroke="currentColor" strokeWidth="1.3"/></svg> },
  { label: '自有仓库', value: '4', unit: '个', icon: <svg viewBox="0 0 18 18" fill="none"><path d="M9 2L3 5v5c0 5 3.5 7.5 7 9 3.5-1.5 7-4 7-9V5L9 2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg> },
  { label: '合作仓库', value: '2', unit: '个', icon: <svg viewBox="0 0 18 18" fill="none"><circle cx="7" cy="7" r="3" stroke="currentColor" strokeWidth="1.3"/><path d="M2 16a5 5 0 0110 0M14 10h4M16 8v4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> },
  { label: '启用仓库', value: '5', unit: '个', icon: <svg viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.3"/><path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg> },
];

const recentRecords = [
  { id: 'RK-2025-0089', type: '入库', refCode: 'PO-2025-0151', product: '明前龙井', warehouse: '杭州总仓', quantity: '80 kg', time: '2025-07-15 14:30' },
  { id: 'CK-2025-0091', type: '出库', refCode: 'SO-2025-0238', product: '正山小种', warehouse: '武夷仓区', quantity: '30 kg', time: '2025-07-15 11:20' },
  { id: 'RK-2025-0088', type: '入库', refCode: 'PO-2025-0150', product: '金骏眉', warehouse: '武夷仓区', quantity: '50 kg', time: '2025-07-15 09:45' },
  { id: 'CK-2025-0090', type: '出库', refCode: 'SO-2025-0237', product: '碧螺春', warehouse: '苏州分仓', quantity: '20 kg', time: '2025-07-14 16:10' },
  { id: 'RK-2025-0087', type: '入库', refCode: 'PO-2025-0149', product: '清香铁观音', warehouse: '安溪分仓', quantity: '60 kg', time: '2025-07-14 10:30' },
  { id: 'CK-2025-0089', type: '出库', refCode: 'SO-2025-0236', product: '凤凰单丛', warehouse: '安溪分仓', quantity: '40 kg', time: '2025-07-14 09:15' },
  { id: 'RK-2025-0086', type: '入库', refCode: 'PO-2025-0148', product: '白牡丹', warehouse: '福鼎分仓', quantity: '40 kg', time: '2025-07-13 15:00' },
  { id: 'CK-2025-0088', type: '出库', refCode: 'SO-2025-0235', product: '白毫银针', warehouse: '福鼎分仓', quantity: '50 kg', time: '2025-07-13 10:40' },
];

export default function InventoryOverview() {
  return (
    <>
      <ContentHeader title="仓储概览" breadcrumbs={['仓储', '仓储概览']} />
      <div className="content-body">
        <div className="stat-cards" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {stats.map((s, i) => <StatCard key={i} data={s} />)}
        </div>
        <Card title="库存盘点">
          <div className="stat-cards">
            {checkStats.map((s, i) => <StatCard key={i} data={s} />)}
          </div>
        </Card>
        <Card title="库存调拨">
          <div className="stat-cards">
            {transferStats.map((s, i) => <StatCard key={i} data={s} />)}
          </div>
        </Card>
        <Card title="其他出入库">
          <div className="stat-cards">
            {otherIOStats.map((s, i) => <StatCard key={i} data={s} />)}
          </div>
        </Card>
        <Card title="仓库设置">
          <div className="stat-cards">
            {settingsStats.map((s, i) => <StatCard key={i} data={s} />)}
          </div>
        </Card>
        <Card title="库存预警" headerRight={<span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-semantic-warning)' }}>4 项预警</span>}>
          {alertItems.map((a, i) => <AlertItem key={i} data={a} />)}
        </Card>
        <Card title="近期出入库">
          <Table
            headers={['单号', '类型', '关联单号', '商品', '仓库', '数量', '时间']}
            rows={recentRecords.map((r) => [
              <span className="mono">{r.id}</span>,
              <span style={{ color: r.type === '入库' ? 'var(--color-semantic-success)' : 'var(--color-module-current-base)', fontWeight: 'var(--font-medium)' }}>{r.type}</span>,
              <span className="mono" style={{ color: 'var(--color-text-secondary)' }}>{r.refCode}</span>,
              r.product,
              r.warehouse,
              <span className="mono">{r.quantity}</span>,
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>{r.time}</span>,
            ])}
          />
        </Card>
      </div>
    </>
  );
}
