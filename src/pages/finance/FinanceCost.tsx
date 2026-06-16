import ContentHeader from '../../components/layout/ContentHeader';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import StatusTag from '../../components/common/StatusTag';
import PieChart from '../../components/charts/PieChart';
import Button from '../../components/common/Button';
import FilterBar, { FilterInput, FilterSelect } from '../../components/business/FilterBar';
import type { StatCardData } from '../../types';

const stats: StatCardData[] = [
  { label: '本月采购成本', value: '856,200', unit: '¥', trend: { direction: 'up', value: '12.3%' }, icon: <svg viewBox="0 0 18 18" fill="none"><path d="M3 5h12l-1.2 8H4.2L3 5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg> },
  { label: '运输成本', value: '23,500', unit: '¥', trend: { direction: 'down', value: '3.2%' }, icon: <svg viewBox="0 0 18 18" fill="none"><path d="M2 14l2-4 3 2 3-6 3 3 3-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { label: '仓储成本', value: '18,200', unit: '¥', trend: { direction: 'up', value: '5.8%' }, icon: <svg viewBox="0 0 18 18" fill="none"><rect x="3" y="5" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M3 9h12M7 5V3h4v2" stroke="currentColor" strokeWidth="1.3"/></svg> },
  { label: '综合成本率', value: '38.5', unit: '%', trend: { direction: 'down', value: '2.1%' }, icon: <svg viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.3"/><path d="M9 5v4l3 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg> },
];

interface CostItem {
  name: string;
  category: string;
  amount: string;
  ratio: string;
  yoyChange: string;
  momChange: string;
  remark: string;
}

const costItems: CostItem[] = [
  { name: '茶叶原料采购', category: '采购成本', amount: '¥ 652,000', ratio: '76.1%', yoyChange: '+15.2%', momChange: '+8.5%', remark: '绿茶、红茶、青茶等原料' },
  { name: '茶叶辅料采购', category: '采购成本', amount: '¥ 86,400', ratio: '10.1%', yoyChange: '+6.8%', momChange: '+3.2%', remark: '包装材料、标签等' },
  { name: '茶具采购', category: '采购成本', amount: '¥ 117,800', ratio: '13.8%', yoyChange: '+10.5%', momChange: '+5.6%', remark: '紫砂壶、盖碗等茶具' },
  { name: '干线运输', category: '运输成本', amount: '¥ 12,800', ratio: '54.5%', yoyChange: '-5.2%', momChange: '-2.1%', remark: '产地到仓库运输' },
  { name: '同城配送', category: '运输成本', amount: '¥ 6,500', ratio: '27.7%', yoyChange: '+2.3%', momChange: '+1.5%', remark: '仓库到客户配送' },
  { name: '快递费用', category: '运输成本', amount: '¥ 4,200', ratio: '17.9%', yoyChange: '-1.8%', momChange: '-0.5%', remark: '零散快递发货' },
  { name: '冷库仓储', category: '仓储成本', amount: '¥ 8,600', ratio: '47.3%', yoyChange: '+8.5%', momChange: '+3.2%', remark: '茶叶冷藏存储' },
  { name: '常温仓储', category: '仓储成本', amount: '¥ 5,400', ratio: '29.7%', yoyChange: '+3.2%', momChange: '+1.8%', remark: '茶具及辅料存储' },
  { name: '仓储管理费', category: '仓储成本', amount: '¥ 4,200', ratio: '23.1%', yoyChange: '+6.5%', momChange: '+2.5%', remark: '人员及设备费用' },
  { name: '代加工费', category: '加工成本', amount: '¥ 28,600', ratio: '100%', yoyChange: '+12.3%', momChange: '+6.8%', remark: '茶叶分装及加工' },
];

const costBreakdownPieData = [
  { name: '采购成本', value: 76, color: 'var(--color-module-current-base)' },
  { name: '运输成本', value: 8, color: 'var(--color-module-finance-secondary)' },
  { name: '仓储成本', value: 6, color: '#FD742D' },
  { name: '加工成本', value: 10, color: '#9D73BD' },
];

function categoryColor(category: string) {
  switch (category) {
    case '采购成本': return 'var(--color-module-current-base)';
    case '运输成本': return 'var(--color-module-finance-secondary)';
    case '仓储成本': return '#FD742D';
    case '加工成本': return '#9D73BD';
    default: return 'var(--color-neutral-400)';
  }
}

function changeColor(change: string) {
  if (change.startsWith('+')) return '#CB405D';
  if (change.startsWith('-')) return '#01795D';
  return 'var(--color-text-tertiary)';
}

export default function FinanceCost() {
  return (
    <>
      <ContentHeader title="成本核算" breadcrumbs={['财务', '成本核算']} actions={<><Button variant="ghost">导出</Button><Button><PlusIcon />新增成本项</Button></>} />
      <div className="content-body">
        <div className="stat-cards">
          {stats.map((s, i) => <StatCard key={i} data={s} />)}
        </div>
        <FilterBar>
          <FilterInput placeholder="搜索成本项名称..." />
          <FilterSelect options={['全部类别', '采购成本', '运输成本', '仓储成本', '加工成本']} />
          <FilterSelect options={['全部时间', '本月', '上月', '本季度', '近半年']} />
        </FilterBar>
        <div className="grid-2">
          <Card>
            <Table
              headers={['成本项', '类别', '金额', '占比', '同比变化', '环比变化', '备注']}
              rows={costItems.map((c) => [
                <span style={{ fontWeight: 'var(--font-medium)' }}>{c.name}</span>,
                <span style={{ padding: '1px 8px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-medium)', background: `${categoryColor(c.category)}12`, color: categoryColor(c.category), border: `1px solid ${categoryColor(c.category)}30` }}>{c.category}</span>,
                <span className="mono">{c.amount}</span>,
                <span className="mono" style={{ color: 'var(--color-text-secondary)' }}>{c.ratio}</span>,
                <span className="mono" style={{ color: changeColor(c.yoyChange) }}>{c.yoyChange}</span>,
                <span className="mono" style={{ color: changeColor(c.momChange) }}>{c.momChange}</span>,
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>{c.remark}</span>,
              ])}
            />
          </Card>
          <Card title="成本构成">
            <PieChart data={costBreakdownPieData} />
          </Card>
        </div>
      </div>
    </>
  );
}

function PlusIcon() {
  return <svg viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
}
