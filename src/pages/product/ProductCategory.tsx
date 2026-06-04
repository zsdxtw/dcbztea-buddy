import ContentHeader from '../../components/layout/ContentHeader';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import StatusTag from '../../components/common/StatusTag';
import Button from '../../components/common/Button';
import FilterBar, { FilterInput, FilterSelect } from '../../components/business/FilterBar';
import type { StatCardData } from '../../types';

const stats: StatCardData[] = [
  { label: '分类总数', value: '18', trend: { direction: 'up', value: '+2' }, icon: <svg viewBox="0 0 18 18" fill="none"><path d="M3 5h8M3 10h5M3 15h8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><circle cx="14" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.3"/><circle cx="11" cy="15" r="2.5" stroke="currentColor" strokeWidth="1.3"/></svg> },
  { label: '商品总数', value: '151', trend: { direction: 'up', value: '+8 件' }, icon: <svg viewBox="0 0 18 18" fill="none"><rect x="4" y="4" width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M4 8h10M8 4v10" stroke="currentColor" strokeWidth="1.2"/></svg> },
  { label: '茶叶分类数', value: '12', icon: <svg viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.3"/><path d="M9 3v7h7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> },
  { label: '非茶分类数', value: '6', icon: <svg viewBox="0 0 18 18" fill="none"><rect x="3" y="3" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M7 7h4M7 9h4M7 11h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg> },
];

const categoryItems = [
  { name: '绿茶', parent: '茶叶分类', count: 42, sort: 1, active: true },
  { name: '红茶', parent: '茶叶分类', count: 26, sort: 2, active: true },
  { name: '青茶', parent: '茶叶分类', count: 35, sort: 3, active: true },
  { name: '白茶', parent: '茶叶分类', count: 18, sort: 4, active: true },
  { name: '黑茶', parent: '茶叶分类', count: 22, sort: 5, active: true },
  { name: '黄茶', parent: '茶叶分类', count: 8, sort: 6, active: true },
  { name: '炒青绿茶', parent: '绿茶', count: 15, sort: 1, active: true },
  { name: '烘青绿茶', parent: '绿茶', count: 12, sort: 2, active: true },
  { name: '小种红茶', parent: '红茶', count: 8, sort: 1, active: true },
  { name: '工夫红茶', parent: '红茶', count: 10, sort: 2, active: true },
  { name: '闽北乌龙', parent: '青茶', count: 12, sort: 1, active: true },
  { name: '闽南乌龙', parent: '青茶', count: 10, sort: 2, active: true },
  { name: '茶具', parent: '非茶商品', count: 25, sort: 1, active: true },
  { name: '茶食品', parent: '非茶商品', count: 15, sort: 2, active: true },
  { name: '礼盒套装', parent: '非茶商品', count: 18, sort: 3, active: true },
  { name: '茶叶罐', parent: '非茶商品', count: 8, sort: 4, active: false },
  { name: '泡茶水', parent: '非茶商品', count: 6, sort: 5, active: true },
  { name: '茶叶包装', parent: '非茶商品', count: 12, sort: 6, active: true },
];

export default function ProductCategory() {
  return (
    <>
      <ContentHeader title="商品分类" breadcrumbs={['商品', '商品分类']} actions={<Button><PlusIcon />新增分类</Button>} />
      <div className="content-body">
        <div className="stat-cards">
          {stats.map((s, i) => <StatCard key={i} data={s} />)}
        </div>
        <FilterBar>
          <FilterInput placeholder="搜索分类名称..." />
          <FilterSelect options={['全部状态', '启用', '禁用']} />
        </FilterBar>
        <Card>
          <Table
            headers={['分类名称', '上级分类', '商品数量', '排序', '状态']}
            rows={categoryItems.map((c) => [
              <span style={{ fontWeight: 'var(--font-medium)', paddingLeft: c.parent === '绿茶' || c.parent === '红茶' || c.parent === '青茶' ? 'var(--space-6)' : '0' }}>{c.name}</span>,
              c.parent,
              <span className="mono">{c.count}</span>,
              <span className="mono">{c.sort}</span>,
              <StatusTag variant={c.active ? 'success' : 'warning'} label={c.active ? '启用' : '禁用'} />,
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
