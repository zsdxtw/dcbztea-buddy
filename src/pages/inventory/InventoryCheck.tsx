import ContentHeader from '../../components/layout/ContentHeader';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import StatusTag from '../../components/common/StatusTag';
import Button from '../../components/common/Button';
import FilterBar, { FilterInput, FilterSelect } from '../../components/business/FilterBar';
import type { StatCardData } from '../../types';

const stats: StatCardData[] = [
  { label: '待盘点', value: '3', unit: '单', trend: { direction: 'up', value: '+1 单' }, icon: <svg viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.3"/><path d="M9 6v4M9 12.5v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> },
  { label: '盘点中', value: '2', unit: '单', trend: { direction: 'up', value: '+1 单' }, icon: <svg viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.3"/><path d="M9 6v4l3 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { label: '已完成', value: '42', unit: '单', trend: { direction: 'up', value: '8 单', label: '较上月' }, icon: <svg viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.3"/><path d="M6 10l2 2 4-5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { label: '差异商品', value: '8', unit: '种', trend: { direction: 'down', value: '2 种' }, icon: <svg viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.3"/><path d="M6 10l2 2 4-5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg> },
];

const checkItems = [
  { id: 'CK-2025-0045', title: '杭州总仓月度盘点', warehouse: '杭州总仓', type: '月度盘点', creator: '李主管', startTime: '2025-07-15 09:00', endTime: '—', status: 'processing' as const, diffCount: '—' },
  { id: 'CK-2025-0044', title: '武夷仓区周盘点', warehouse: '武夷仓区', type: '周盘点', creator: '张主管', startTime: '2025-07-14 14:00', endTime: '2025-07-14 17:30', status: 'completed' as const, diffCount: '2' },
  { id: 'CK-2025-0043', title: '福鼎分仓重点商品盘点', warehouse: '福鼎分仓', type: '重点盘点', creator: '陈主管', startTime: '2025-07-13 10:00', endTime: '2025-07-13 12:30', status: 'completed' as const, diffCount: '1' },
  { id: 'CK-2025-0042', title: '云南总仓月度盘点', warehouse: '云南总仓', type: '月度盘点', creator: '刘主管', startTime: '2025-07-10 09:00', endTime: '—', status: 'pending' as const, diffCount: '—' },
  { id: 'CK-2025-0041', title: '苏州分仓周盘点', warehouse: '苏州分仓', type: '周盘点', creator: '王主管', startTime: '2025-07-09 10:00', endTime: '2025-07-09 15:00', status: 'completed' as const, diffCount: '0' },
  { id: 'CK-2025-0040', title: '安溪分仓重点商品盘点', warehouse: '安溪分仓', type: '重点盘点', creator: '陈主管', startTime: '2025-07-08 09:00', endTime: '2025-07-08 11:30', status: 'completed' as const, diffCount: '3' },
  { id: 'CK-2025-0039', title: '杭州总仓重点商品盘点', warehouse: '杭州总仓', type: '重点盘点', creator: '李主管', startTime: '2025-07-05 10:00', endTime: '—', status: 'pending' as const, diffCount: '—' },
];

function checkStatusToVariant(status: string) {
  switch (status) {
    case 'pending': return 'warning' as const;
    case 'processing': return 'info' as const;
    case 'completed': return 'success' as const;
    default: return 'info' as const;
  }
}

function checkStatusLabel(status: string) {
  switch (status) {
    case 'pending': return '待盘点';
    case 'processing': return '盘点中';
    case 'completed': return '已完成';
    default: return status;
  }
}

export default function InventoryCheck() {
  return (
    <>
      <ContentHeader title="盘点管理" breadcrumbs={['仓储', '盘点管理']} actions={<><Button variant="ghost">导出</Button><Button><PlusIcon />新建盘点</Button></>} />
      <div className="content-body">
        <div className="stat-cards">
          {stats.map((s, i) => <StatCard key={i} data={s} />)}
        </div>
        <FilterBar>
          <FilterInput placeholder="搜索盘点单号、标题..." />
          <FilterSelect options={['全部状态', '待盘点', '盘点中', '已完成']} />
          <FilterSelect options={['全部仓库', '杭州总仓', '武夷仓区', '苏州分仓', '安溪分仓', '福鼎分仓', '云南总仓']} />
          <FilterSelect options={['全部类型', '月度盘点', '周盘点', '重点盘点']} />
        </FilterBar>
        <Card>
          <Table
            headers={['盘点单号', '盘点标题', '仓库', '类型', '创建人', '开始时间', '结束时间', '差异数量', '状态']}
            rows={checkItems.map((item) => [
              <span className="mono">{item.id}</span>,
              item.title,
              item.warehouse,
              item.type,
              item.creator,
              <span className="mono">{item.startTime}</span>,
              <span className="mono">{item.endTime}</span>,
              <span className="mono" style={{ color: item.diffCount === '—' ? 'var(--color-neutral-400)' : item.diffCount === '0' ? 'var(--color-semantic-success)' : 'var(--color-semantic-warning)' }}>{item.diffCount === '—' ? '—' : item.diffCount + ' 种'}</span>,
              <StatusTag variant={checkStatusToVariant(item.status)} label={checkStatusLabel(item.status)} />,
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
