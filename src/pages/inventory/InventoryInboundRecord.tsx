import ContentHeader from '../../components/layout/ContentHeader';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import StatusTag from '../../components/common/StatusTag';
import Button from '../../components/common/Button';
import FilterBar, { FilterInput, FilterSelect } from '../../components/business/FilterBar';
import type { StatCardData } from '../../types';

const stats: StatCardData[] = [
  { label: '今日入库', value: '6', unit: '单', trend: { direction: 'up', value: '+2 单' }, icon: <svg viewBox="0 0 18 18" fill="none"><rect x="3" y="6" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M9 3v5M6 5l3-3 3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { label: '本月入库', value: '58', unit: '单', trend: { direction: 'up', value: '12.5%' }, icon: <svg viewBox="0 0 18 18" fill="none"><rect x="3" y="5" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M3 9h12" stroke="currentColor" strokeWidth="1.3"/></svg> },
  { label: '待入库', value: '4', unit: '单', trend: { direction: 'down', value: '1 单' }, icon: <svg viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.3"/><path d="M9 6v4M9 12.5v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> },
  { label: '入库金额', value: '456,200', unit: '¥', trend: { direction: 'up', value: '8.3%' }, icon: <svg viewBox="0 0 18 18" fill="none"><rect x="2" y="4" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M5 8h2M5 11h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> },
];

const inboundRecords = [
  { code: 'IN-20250715-001', type: '采购入库', warehouse: '杭州总仓', product: '明前龙井 — 特级', quantity: '80 kg', partner: '西湖龙井合作社', operator: '李仓管', time: '2025-07-15 10:30' },
  { code: 'IN-20250715-002', type: '采购入库', warehouse: '福鼎分仓', product: '白牡丹 — 一级', quantity: '40 kg', partner: '福鼎白茶厂', operator: '陈仓管', time: '2025-07-15 09:15' },
  { code: 'IN-20250714-001', type: '退货入库', warehouse: '武夷仓区', product: '大红袍 — 特级', quantity: '5 kg', partner: '华茗堂茶庄', operator: '张仓管', time: '2025-07-14 16:45' },
  { code: 'IN-20250714-002', type: '采购入库', warehouse: '云南总仓', product: '熟普洱 — 三级', quantity: '120 kg', partner: '云南普洱茶业', operator: '刘仓管', time: '2025-07-14 14:20' },
  { code: 'IN-20250713-001', type: '调拨入库', warehouse: '武夷仓区', product: '铁观音 — 一级', quantity: '30 kg', partner: '安溪分仓', operator: '张仓管', time: '2025-07-13 11:30' },
  { code: 'IN-20250713-002', type: '采购入库', warehouse: '杭州总仓', product: '碧螺春 — 一级', quantity: '60 kg', partner: '苏州洞庭茶场', operator: '李仓管', time: '2025-07-13 09:00' },
  { code: 'IN-20250712-001', type: '退货入库', warehouse: '苏州分仓', product: '君山银针 — 特级', quantity: '2 kg', partner: '和风茶屋', operator: '王仓管', time: '2025-07-12 15:50' },
  { code: 'IN-20250712-002', type: '采购入库', warehouse: '武夷仓区', product: '正山小种 — 特级', quantity: '50 kg', partner: '武夷山茶业', operator: '张仓管', time: '2025-07-12 10:30' },
];

function inboundTypeToVariant(type: string) {
  switch (type) {
    case '采购入库': return 'success' as const;
    case '退货入库': return 'warning' as const;
    case '调拨入库': return 'info' as const;
    default: return 'info' as const;
  }
}

export default function InventoryInboundRecord() {
  return (
    <>
      <ContentHeader title="入库记录" breadcrumbs={['仓储', '入库记录']} actions={<Button variant="ghost">导出</Button>} />
      <div className="content-body">
        <div className="stat-cards">
          {stats.map((s, i) => <StatCard key={i} data={s} />)}
        </div>
        <FilterBar>
          <FilterInput placeholder="搜索入库单号、商品..." />
          <FilterSelect options={['全部类型', '采购入库', '退货入库', '调拨入库']} />
          <FilterSelect options={['全部仓库', '杭州总仓', '武夷仓区', '苏州分仓', '福鼎分仓', '云南总仓']} />
          <FilterSelect options={['全部时间', '今日', '近3天', '近7天', '本月']} />
        </FilterBar>
        <Card>
          <Table
            headers={['入库单号', '入库类型', '仓库', '商品', '数量', '供应商/客户', '操作人', '时间']}
            rows={inboundRecords.map((r) => [
              <span className="mono">{r.code}</span>,
              <StatusTag variant={inboundTypeToVariant(r.type)} label={r.type} />,
              r.warehouse,
              r.product,
              <span className="mono">{r.quantity}</span>,
              r.partner,
              r.operator,
              <span className="mono">{r.time}</span>,
            ])}
          />
        </Card>
      </div>
    </>
  );
}
