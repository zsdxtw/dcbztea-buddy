import ContentHeader from '../../components/layout/ContentHeader';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import StatusTag from '../../components/common/StatusTag';
import Button from '../../components/common/Button';
import FilterBar, { FilterInput, FilterSelect } from '../../components/business/FilterBar';
import type { StatCardData } from '../../types';

const stats: StatCardData[] = [
  { label: '总库位数', value: '480', trend: { direction: 'up', value: '+20', label: '较上月' }, icon: <svg viewBox="0 0 18 18" fill="none"><rect x="3" y="5" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M3 9h12" stroke="currentColor" strokeWidth="1.3"/></svg> },
  { label: '已用库位', value: '356', trend: { direction: 'up', value: '12 个' }, icon: <svg viewBox="0 0 18 18" fill="none"><rect x="3" y="5" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M3 9h12" stroke="currentColor" strokeWidth="1.3"/><rect x="5" y="7" width="4" height="4" rx="0.5" fill="currentColor" opacity="0.3"/></svg> },
  { label: '空闲库位', value: '124', trend: { direction: 'down', value: '12 个' }, icon: <svg viewBox="0 0 18 18" fill="none"><rect x="3" y="5" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M3 9h12" stroke="currentColor" strokeWidth="1.3"/></svg> },
  { label: '利用率', value: '74.2', unit: '%', trend: { direction: 'up', value: '2.5%' }, icon: <svg viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.3"/><path d="M9 5v4l3 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> },
];

const locationItems = [
  { code: 'HZ-A-001', warehouse: '杭州总仓', type: '冷藏', product: '明前龙井 — 特级', stock: '280 kg', status: 'occupied' as const },
  { code: 'HZ-A-002', warehouse: '杭州总仓', type: '冷藏', product: '碧螺春 — 一级', stock: '8 kg', status: 'occupied' as const },
  { code: 'HZ-B-001', warehouse: '杭州总仓', type: '常温', product: '—', stock: '—', status: 'empty' as const },
  { code: 'WY-A-001', warehouse: '武夷仓区', type: '恒温', product: '大红袍 — 特级', stock: '50 kg', status: 'occupied' as const },
  { code: 'WY-A-002', warehouse: '武夷仓区', type: '冷藏', product: '正山小种 — 特级', stock: '12 kg', status: 'occupied' as const },
  { code: 'WY-B-003', warehouse: '武夷仓区', type: '常温', product: '—', stock: '—', status: 'empty' as const },
  { code: 'SZ-A-001', warehouse: '苏州分仓', type: '冷藏', product: '君山银针 — 特级', stock: '45 kg', status: 'occupied' as const },
  { code: 'SZ-B-001', warehouse: '苏州分仓', type: '常温', product: '—', stock: '—', status: 'maintenance' as const },
  { code: 'FD-A-001', warehouse: '福鼎分仓', type: '常温', product: '白牡丹 — 一级', stock: '120 kg', status: 'occupied' as const },
  { code: 'FD-A-002', warehouse: '福鼎分仓', type: '常温', product: '白毫银针 — 特级', stock: '25 kg', status: 'occupied' as const },
  { code: 'YN-A-001', warehouse: '云南总仓', type: '通风', product: '熟普洱 — 三级', stock: '560 kg', status: 'occupied' as const },
  { code: 'YN-B-002', warehouse: '云南总仓', type: '常温', product: '六堡茶 — 二级', stock: '180 kg', status: 'occupied' as const },
];

function locationStatusToVariant(status: string) {
  switch (status) {
    case 'occupied': return 'success' as const;
    case 'empty': return 'info' as const;
    case 'maintenance': return 'warning' as const;
    default: return 'info' as const;
  }
}

function locationStatusLabel(status: string) {
  switch (status) {
    case 'occupied': return '已占用';
    case 'empty': return '空闲';
    case 'maintenance': return '维护中';
    default: return status;
  }
}

export default function InventoryLocation() {
  return (
    <>
      <ContentHeader title="库位管理" breadcrumbs={['仓储', '库位管理']} actions={<><Button variant="ghost">导出</Button><Button><PlusIcon />新增库位</Button></>} />
      <div className="content-body">
        <div className="stat-cards">
          {stats.map((s, i) => <StatCard key={i} data={s} />)}
        </div>
        <FilterBar>
          <FilterInput placeholder="搜索库位编码、商品..." />
          <FilterSelect options={['全部仓库', '杭州总仓', '武夷仓区', '苏州分仓', '福鼎分仓', '云南总仓']} />
          <FilterSelect options={['全部状态', '已占用', '空闲', '维护中']} />
        </FilterBar>
        <Card>
          <Table
            headers={['库位编码', '所属仓库', '库位类型', '存放商品', '当前库存', '状态']}
            rows={locationItems.map((l) => [
              <span className="mono">{l.code}</span>,
              l.warehouse,
              <span style={{ color: 'var(--color-module-current-accent)' }}>{l.type}</span>,
              l.product === '—' ? <span style={{ color: 'var(--color-neutral-400)' }}>—</span> : l.product,
              <span className="mono">{l.stock}</span>,
              <StatusTag variant={locationStatusToVariant(l.status)} label={locationStatusLabel(l.status)} />,
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
