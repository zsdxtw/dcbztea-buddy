import ContentHeader from '../../components/layout/ContentHeader';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import StatusTag from '../../components/common/StatusTag';
import Button from '../../components/common/Button';
import FilterBar, { FilterInput, FilterSelect } from '../../components/business/FilterBar';
import type { StatCardData } from '../../types';

const stats: StatCardData[] = [
  { label: '今日出库', value: '4', unit: '单', trend: { direction: 'up', value: '+1 单' }, icon: <svg viewBox="0 0 18 18" fill="none"><rect x="3" y="6" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M9 13V8M6 10l3-3 3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { label: '本月出库', value: '42', unit: '单', trend: { direction: 'up', value: '8.7%' }, icon: <svg viewBox="0 0 18 18" fill="none"><rect x="3" y="5" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M3 9h12" stroke="currentColor" strokeWidth="1.3"/></svg> },
  { label: '待出库', value: '3', unit: '单', trend: { direction: 'down', value: '2 单' }, icon: <svg viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.3"/><path d="M9 6v4M9 12.5v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> },
  { label: '出库金额', value: '328,600', unit: '¥', trend: { direction: 'up', value: '18.3%' }, icon: <svg viewBox="0 0 18 18" fill="none"><rect x="2" y="4" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M5 8h2M5 11h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> },
];

const outboundRecords = [
  { code: 'OUT-20250715-001', type: '销售出库', warehouse: '武夷仓区', product: '正山小种 — 特级', quantity: '30 kg', partner: '华茗堂茶庄', operator: '张仓管', time: '2025-07-15 14:20' },
  { code: 'OUT-20250715-002', type: '销售出库', warehouse: '福鼎分仓', product: '白毫银针 — 特级', quantity: '50 kg', partner: '品茗轩', operator: '陈仓管', time: '2025-07-15 11:45' },
  { code: 'OUT-20250714-001', type: '销售出库', warehouse: '杭州总仓', product: '碧螺春 — 一级', quantity: '20 kg', partner: '雅韵茶社', operator: '李仓管', time: '2025-07-14 16:30' },
  { code: 'OUT-20250714-002', type: '调拨出库', warehouse: '安溪分仓', product: '铁观音 — 一级', quantity: '30 kg', partner: '武夷仓区', operator: '王仓管', time: '2025-07-14 13:10' },
  { code: 'OUT-20250713-001', type: '销售出库', warehouse: '云南总仓', product: '六堡茶 — 二级', quantity: '25 kg', partner: '翠竹茶行', operator: '刘仓管', time: '2025-07-13 10:20' },
  { code: 'OUT-20250713-002', type: '退货出库', warehouse: '杭州总仓', product: '明前龙井 — 特级', quantity: '8 kg', partner: '西湖龙井合作社', operator: '李仓管', time: '2025-07-13 09:45' },
  { code: 'OUT-20250712-001', type: '销售出库', warehouse: '武夷仓区', product: '大红袍 — 特级', quantity: '40 kg', partner: '清心茶坊', operator: '张仓管', time: '2025-07-12 15:00' },
  { code: 'OUT-20250712-002', type: '销售出库', warehouse: '苏州分仓', product: '君山银针 — 特级', quantity: '15 kg', partner: '茗香斋', operator: '王仓管', time: '2025-07-12 11:30' },
];

function outboundTypeToVariant(type: string) {
  switch (type) {
    case '销售出库': return 'success' as const;
    case '退货出库': return 'warning' as const;
    case '调拨出库': return 'info' as const;
    default: return 'info' as const;
  }
}

export default function InventoryOutboundRecord() {
  return (
    <>
      <ContentHeader title="出库记录" breadcrumbs={['仓储', '出库记录']} actions={<Button variant="ghost">导出</Button>} />
      <div className="content-body">
        <div className="stat-cards">
          {stats.map((s, i) => <StatCard key={i} data={s} />)}
        </div>
        <FilterBar>
          <FilterInput placeholder="搜索出库单号、商品..." />
          <FilterSelect options={['全部类型', '销售出库', '退货出库', '调拨出库']} />
          <FilterSelect options={['全部仓库', '杭州总仓', '武夷仓区', '苏州分仓', '福鼎分仓', '云南总仓', '安溪分仓']} />
          <FilterSelect options={['全部时间', '今日', '近3天', '近7天', '本月']} />
        </FilterBar>
        <Card>
          <Table
            headers={['出库单号', '出库类型', '仓库', '商品', '数量', '供应商/客户', '操作人', '时间']}
            rows={outboundRecords.map((r) => [
              <span className="mono">{r.code}</span>,
              <StatusTag variant={outboundTypeToVariant(r.type)} label={r.type} />,
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
