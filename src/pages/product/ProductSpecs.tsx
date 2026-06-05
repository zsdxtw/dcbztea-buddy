import ContentHeader from '../../components/layout/ContentHeader';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import StatusTag from '../../components/common/StatusTag';
import Button from '../../components/common/Button';
import FilterBar, { FilterInput, FilterSelect } from '../../components/business/FilterBar';
import type { StatCardData } from '../../types';

const stats: StatCardData[] = [
  { label: '规格总数', value: '42', trend: { direction: 'up', value: '+5' }, icon: <svg viewBox="0 0 18 18" fill="none"><rect x="3" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3"/><rect x="11" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3"/><rect x="3" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3"/><rect x="11" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3"/></svg> },
  { label: '常用规格', value: '15', icon: <svg viewBox="0 0 18 18" fill="none"><path d="M9 2l2.5 5 5.5.8-4 3.9.9 5.5L9 14.7 5.1 17.2l.9-5.5-4-3.9L7.5 7z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg> },
  { label: '关联商品', value: '151', icon: <svg viewBox="0 0 18 18" fill="none"><rect x="4" y="4" width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M4 8h10M8 4v10" stroke="currentColor" strokeWidth="1.2"/></svg> },
  { label: '本月新增', value: '4', trend: { direction: 'up', value: '+1' }, icon: <svg viewBox="0 0 18 18" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> },
];

const specItems = [
  { name: '50g 特级', code: 'SPEC-001', unit: 'g', weight: 50, level: '特级', productCount: 24, active: true },
  { name: '50g 一级', code: 'SPEC-002', unit: 'g', weight: 50, level: '一级', productCount: 28, active: true },
  { name: '50g 二级', code: 'SPEC-003', unit: 'g', weight: 50, level: '二级', productCount: 22, active: true },
  { name: '100g 特级', code: 'SPEC-004', unit: 'g', weight: 100, level: '特级', productCount: 18, active: true },
  { name: '100g 一级', code: 'SPEC-005', unit: 'g', weight: 100, level: '一级', productCount: 15, active: true },
  { name: '250g 特级', code: 'SPEC-006', unit: 'g', weight: 250, level: '特级', productCount: 12, active: true },
  { name: '250g 一级', code: 'SPEC-007', unit: 'g', weight: 250, level: '一级', productCount: 10, active: true },
  { name: '500g 特级', code: 'SPEC-008', unit: 'g', weight: 500, level: '特级', productCount: 8, active: true },
  { name: '500g 一级', code: 'SPEC-009', unit: 'g', weight: 500, level: '一级', productCount: 6, active: true },
  { name: '1kg 特级', code: 'SPEC-010', unit: 'kg', weight: 1000, level: '特级', productCount: 5, active: false },
  { name: '礼盒装 100g', code: 'SPEC-011', unit: '盒', weight: 100, level: '特级', productCount: 3, active: true },
];

export default function ProductSpecs() {
  return (
    <>
      <ContentHeader title="规格管理" breadcrumbs={['商品', '规格管理']} actions={<Button><PlusIcon />新增规格</Button>} />
      <div className="content-body">
        <div className="stat-cards">
          {stats.map((s, i) => <StatCard key={i} data={s} />)}
        </div>
        <FilterBar>
          <FilterInput placeholder="搜索规格名称、编码..." />
          <FilterSelect options={['全部状态', '启用', '禁用']} />
          <FilterSelect options={['全部单位', 'g', 'kg', '盒', '包']} />
        </FilterBar>
        <Card>
          <Table
            headers={['规格名称', '规格编码', '单位', '重量', '品级', '关联商品数', '状态']}
            rows={specItems.map((s) => [
              <span style={{ fontWeight: 'var(--font-medium)' }}>{s.name}</span>,
              <span className="mono">{s.code}</span>,
              s.unit,
              <span className="mono">{s.weight} {s.unit === 'g' ? 'g' : s.unit === 'kg' ? 'kg' : ''}</span>,
              s.level,
              <span className="mono">{s.productCount}</span>,
              <StatusTag variant={s.active ? 'success' : 'warning'} label={s.active ? '启用' : '禁用'} />,
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
