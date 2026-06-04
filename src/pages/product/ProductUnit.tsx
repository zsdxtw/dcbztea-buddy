import ContentHeader from '../../components/layout/ContentHeader';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import StatusTag from '../../components/common/StatusTag';
import Button from '../../components/common/Button';
import type { StatCardData } from '../../types';

const stats: StatCardData[] = [
  { label: '计量单位数', value: '12', icon: <svg viewBox="0 0 18 18" fill="none"><rect x="3" y="3" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M7 7h4M7 9h4M7 11h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg> },
  { label: '常用单位数', value: '6', icon: <svg viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.3"/><path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { label: '换算规则数', value: '8', icon: <svg viewBox="0 0 18 18" fill="none"><path d="M3 9h4M11 9h4M9 3v4M9 11v4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><circle cx="9" cy="9" r="2" fill="currentColor"/></svg> },
];

const unitItems = [
  { name: '千克', symbol: 'kg', type: '重量', base: '基准单位', productCount: 86, active: true },
  { name: '克', symbol: 'g', type: '重量', base: '1 kg = 1000 g', productCount: 42, active: true },
  { name: '斤', symbol: '斤', type: '重量', base: '1 kg = 2 斤', productCount: 28, active: true },
  { name: '两', symbol: '两', type: '重量', base: '1 斤 = 10 两', productCount: 15, active: true },
  { name: '吨', symbol: 't', type: '重量', base: '1 t = 1000 kg', productCount: 8, active: true },
  { name: '磅', symbol: 'lb', type: '重量', base: '1 lb ≈ 0.454 kg', productCount: 3, active: false },
  { name: '盒', symbol: '盒', type: '包装', base: '基准单位', productCount: 52, active: true },
  { name: '箱', symbol: '箱', type: '包装', base: '1 箱 = 20 盒', productCount: 18, active: true },
  { name: '袋', symbol: '袋', type: '包装', base: '基准单位', productCount: 35, active: true },
  { name: '罐', symbol: '罐', type: '包装', base: '基准单位', productCount: 22, active: true },
  { name: '饼', symbol: '饼', type: '特殊', base: '1 饼 = 357 g（普洱）', productCount: 12, active: true },
  { name: '提', symbol: '提', type: '包装', base: '1 提 = 7 饼', productCount: 6, active: true },
];

export default function ProductUnit() {
  return (
    <>
      <ContentHeader title="单位管理" breadcrumbs={['商品', '单位管理']} actions={<Button><PlusIcon />新增单位</Button>} />
      <div className="content-body">
        <div className="stat-cards">
          {stats.map((s, i) => <StatCard key={i} data={s} />)}
        </div>
        <Card>
          <Table
            headers={['单位名称', '单位符号', '单位类型', '换算基准', '关联商品数', '状态']}
            rows={unitItems.map((u) => [
              <span style={{ fontWeight: 'var(--font-medium)' }}>{u.name}</span>,
              <span className="mono" style={{ color: 'var(--color-module-current-accent)' }}>{u.symbol}</span>,
              <span style={{ color: 'var(--color-neutral-500)' }}>{u.type}</span>,
              <span style={{ color: 'var(--color-neutral-500)', fontSize: 'var(--text-sm)' }}>{u.base}</span>,
              <span className="mono">{u.productCount}</span>,
              <StatusTag variant={u.active ? 'success' : 'warning'} label={u.active ? '启用' : '禁用'} />,
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
