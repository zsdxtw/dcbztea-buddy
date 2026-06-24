import ContentHeader from '../../components/layout/ContentHeader';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Tag from '../../components/common/Tag';
import FilterBar, { FilterInput, FilterSelect } from '../../components/business/FilterBar';
import { TeaCategory } from '../../types';
import type { StatCardData } from '../../types';

/* ── 统计数据 ── */
const stats: StatCardData[] = [
  { label: '今日入库', value: '3单 / 2,100', unit: 'kg', icon: <svg viewBox="0 0 18 18" fill="none"><path d="M9 2v10M5 8l4 4 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 14h12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> },
  { label: '今日出库', value: '4单 / 1,800', unit: 'kg', icon: <svg viewBox="0 0 18 18" fill="none"><path d="M9 14V4M5 8l4-4 4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 14h12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> },
  { label: '本月入库', value: '23', unit: '单', trend: { direction: 'up', value: '+3单' }, icon: <svg viewBox="0 0 18 18" fill="none"><rect x="3" y="5" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M3 9h12" stroke="currentColor" strokeWidth="1.3"/></svg> },
  { label: '本月出库', value: '31', unit: '单', trend: { direction: 'up', value: '+5单' }, icon: <svg viewBox="0 0 18 18" fill="none"><rect x="4" y="2" width="10" height="14" rx="2" stroke="currentColor" strokeWidth="1.3"/></svg> },
];

/* ── 模拟数据 ── */
type IOType = '采购入库' | '销售出库' | '其他入库' | '其他出库' | '调拨入' | '调拨出';

interface IORecord {
  id: string;
  code: string;
  ioType: IOType;
  refCode: string;
  product: string;
  teaCategory: TeaCategory;
  quantity: string;
  warehouse: string;
  operator: string;
  time: string;
}

const mockRecords: IORecord[] = [
  { id: '1', code: 'RK-2025-0089', ioType: '采购入库', refCode: 'PO-2025-0151', product: '明前龙井', teaCategory: TeaCategory.GREEN, quantity: '80 kg', warehouse: '杭州总仓', operator: '李仓管', time: '2025-07-15 14:30' },
  { id: '2', code: 'CK-2025-0091', ioType: '销售出库', refCode: 'SO-2025-0238', product: '正山小种', teaCategory: TeaCategory.RED, quantity: '30 kg', warehouse: '武夷仓区', operator: '张仓管', time: '2025-07-15 11:20' },
  { id: '3', code: 'RK-2025-0088', ioType: '采购入库', refCode: 'PO-2025-0150', product: '金骏眉', teaCategory: TeaCategory.RED, quantity: '50 kg', warehouse: '武夷仓区', operator: '张仓管', time: '2025-07-15 09:45' },
  { id: '4', code: 'CK-2025-0090', ioType: '销售出库', refCode: 'SO-2025-0237', product: '碧螺春', teaCategory: TeaCategory.GREEN, quantity: '20 kg', warehouse: '苏州分仓', operator: '王仓管', time: '2025-07-14 16:10' },
  { id: '5', code: 'DB-2025-0008-I', ioType: '调拨入', refCode: 'DB-2025-0008', product: '明前龙井', teaCategory: TeaCategory.GREEN, quantity: '30 kg', warehouse: '苏州分仓', operator: '李仓管', time: '2025-07-14 14:00' },
  { id: '6', code: 'QT-2025-0012', ioType: '其他出库', refCode: '—', product: '碧螺春', teaCategory: TeaCategory.GREEN, quantity: '5 kg', warehouse: '苏州分仓', operator: '王仓管', time: '2025-07-14 10:30' },
  { id: '7', code: 'RK-2025-0087', ioType: '采购入库', refCode: 'PO-2025-0149', product: '清香铁观音', teaCategory: TeaCategory.OOLONG, quantity: '60 kg', warehouse: '安溪分仓', operator: '陈仓管', time: '2025-07-14 09:15' },
  { id: '8', code: 'CK-2025-0089', ioType: '销售出库', refCode: 'SO-2025-0236', product: '凤凰单丛', teaCategory: TeaCategory.OOLONG, quantity: '40 kg', warehouse: '安溪分仓', operator: '陈仓管', time: '2025-07-13 15:00' },
  { id: '9', code: 'QT-2025-0011', ioType: '其他入库', refCode: '—', product: '明前龙井', teaCategory: TeaCategory.GREEN, quantity: '10 kg', warehouse: '杭州总仓', operator: '李仓管', time: '2025-07-13 10:40' },
  { id: '10', code: 'DB-2025-0007-O', ioType: '调拨出', refCode: 'DB-2025-0007', product: '正山小种', teaCategory: TeaCategory.RED, quantity: '20 kg', warehouse: '武夷仓区', operator: '张仓管', time: '2025-07-13 09:00' },
  { id: '11', code: 'RK-2025-0086', ioType: '采购入库', refCode: 'PO-2025-0148', product: '白牡丹', teaCategory: TeaCategory.WHITE, quantity: '40 kg', warehouse: '福鼎分仓', operator: '陈仓管', time: '2025-07-12 15:00' },
  { id: '12', code: 'CK-2025-0088', ioType: '销售出库', refCode: 'SO-2025-0235', product: '白毫银针', teaCategory: TeaCategory.WHITE, quantity: '50 kg', warehouse: '福鼎分仓', operator: '陈仓管', time: '2025-07-12 10:40' },
];

function ioTypeColor(ioType: IOType) {
  switch (ioType) {
    case '采购入库': return 'var(--color-semantic-success)';
    case '销售出库': return 'var(--color-module-current-base)';
    case '其他入库': return 'var(--color-semantic-success)';
    case '其他出库': return 'var(--color-module-current-base)';
    case '调拨入': return 'var(--color-module-current-secondary, var(--color-semantic-info))';
    case '调拨出': return 'var(--color-module-current-secondary, var(--color-semantic-info))';
    default: return 'var(--color-text-primary)';
  }
}

export default function InventoryIORecord() {
  return (
    <>
      <ContentHeader title="出入库记录" breadcrumbs={['仓储', '出入库记录']} />
      <div className="content-body">
        <div className="stat-cards">
          {stats.map((s, i) => <StatCard key={i} data={s} />)}
        </div>
        <FilterBar>
          <FilterInput placeholder="搜索单号、商品..." />
          <FilterSelect options={['全部类型', '采购入库', '销售出库', '其他入库', '其他出库', '调拨入', '调拨出']} />
          <FilterSelect options={['全部仓库', '杭州总仓', '武夷仓区', '苏州分仓', '安溪分仓', '福鼎分仓', '云南总仓']} />
          <FilterSelect options={['全部时间', '今日', '本周', '本月', '近3月']} />
        </FilterBar>
        <Card>
          <Table
            headers={['单号', '出入库类型', '关联单号', '商品', '茶类', '数量', '仓库', '操作人', '时间']}
            rows={mockRecords.map((r) => [
              <span className="mono" style={{ fontWeight: 'var(--font-medium)' }}>{r.code}</span>,
              <span style={{ color: ioTypeColor(r.ioType), fontWeight: 'var(--font-medium)' }}>{r.ioType}</span>,
              <span className="mono" style={{ color: 'var(--color-text-secondary)' }}>{r.refCode}</span>,
              r.product,
              <Tag category={r.teaCategory} />,
              <span className="mono">{r.quantity}</span>,
              r.warehouse,
              r.operator,
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>{r.time}</span>,
            ])}
          />
        </Card>
      </div>
    </>
  );
}
