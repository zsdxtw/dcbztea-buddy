import ContentHeader from '../../components/layout/ContentHeader';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import StatusTag from '../../components/common/StatusTag';
import Tag from '../../components/common/Tag';
import Button from '../../components/common/Button';
import FilterBar, { FilterInput, FilterSelect } from '../../components/business/FilterBar';
import { TeaCategory } from '../../types';
import type { StatCardData } from '../../types';

const stats: StatCardData[] = [
  { label: '品牌总数', value: '24', trend: { direction: 'up', value: '+3' }, icon: <svg viewBox="0 0 18 18" fill="none"><path d="M10 2L3 5v8l6 3 6-3V5L10 2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg> },
  { label: '关联商品数', value: '86', trend: { direction: 'up', value: '+5 件' }, icon: <svg viewBox="0 0 18 18" fill="none"><rect x="4" y="4" width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M4 8h10M8 4v10" stroke="currentColor" strokeWidth="1.2"/></svg> },
  { label: '茶类品牌数', value: '18', icon: <svg viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.3"/><path d="M9 3v7h7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> },
  { label: '本月新增', value: '3', trend: { direction: 'up', value: '+1' }, icon: <svg viewBox="0 0 18 18" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> },
];

const brandItems = [
  { name: '西湖牌', code: 'BRD-XH', teaCategory: TeaCategory.GREEN, productCount: 8, level: 'A', active: true },
  { name: '八马', code: 'BRD-BM', teaCategory: TeaCategory.OOLONG, productCount: 12, level: 'A', active: true },
  { name: '张一元', code: 'BRD-ZYY', teaCategory: TeaCategory.GREEN, productCount: 6, level: 'A', active: true },
  { name: '正山堂', code: 'BRD-ZST', teaCategory: TeaCategory.RED, productCount: 5, level: 'A', active: true },
  { name: '品品香', code: 'BRD-PPX', teaCategory: TeaCategory.WHITE, productCount: 7, level: 'A', active: true },
  { name: '大益', code: 'BRD-DY', teaCategory: TeaCategory.DARK, productCount: 10, level: 'S', active: true },
  { name: '天福茗茶', code: 'BRD-TF', teaCategory: TeaCategory.OOLONG, productCount: 8, level: 'A', active: true },
  { name: '吴裕泰', code: 'BRD-WYT', teaCategory: TeaCategory.GREEN, productCount: 5, level: 'B', active: true },
  { name: '君山', code: 'BRD-JS', teaCategory: TeaCategory.YELLOW, productCount: 3, level: 'B', active: true },
  { name: '中茶', code: 'BRD-ZC', teaCategory: TeaCategory.RED, productCount: 9, level: 'S', active: true },
  { name: '凤牌', code: 'BRD-FP', teaCategory: TeaCategory.RED, productCount: 4, level: 'B', active: true },
  { name: '白沙溪', code: 'BRD-BSX', teaCategory: TeaCategory.DARK, productCount: 6, level: 'B', active: true },
  { name: '春伦', code: 'BRD-CL', teaCategory: TeaCategory.GREEN, productCount: 3, level: 'C', active: false },
];

function levelToVariant(level: string) {
  switch (level) {
    case 'S': return 'success' as const;
    case 'A': return 'info' as const;
    case 'B': return 'warning' as const;
    case 'C': return 'error' as const;
    default: return 'info' as const;
  }
}

export default function ProductBrand() {
  return (
    <>
      <ContentHeader title="品牌管理" breadcrumbs={['商品', '品牌管理']} actions={<Button><PlusIcon />新增品牌</Button>} />
      <div className="content-body">
        <div className="stat-cards">
          {stats.map((s, i) => <StatCard key={i} data={s} />)}
        </div>
        <FilterBar>
          <FilterInput placeholder="搜索品牌名称、编码..." />
          <FilterSelect options={['全部状态', '启用', '禁用']} />
          <FilterSelect options={['全部茶类', '绿茶', '白茶', '黄茶', '青茶', '红茶', '黑茶']} />
        </FilterBar>
        <Card>
          <Table
            headers={['品牌名称', '品牌编码', '所属茶类', '关联商品数', '品牌等级', '状态']}
            rows={brandItems.map((b) => [
              <span style={{ fontWeight: 'var(--font-medium)' }}>{b.name}</span>,
              <span className="mono">{b.code}</span>,
              <Tag category={b.teaCategory} />,
              <span className="mono">{b.productCount}</span>,
              <StatusTag variant={levelToVariant(b.level)} label={b.level + '级'} />,
              <StatusTag variant={b.active ? 'success' : 'warning'} label={b.active ? '启用' : '禁用'} />,
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
