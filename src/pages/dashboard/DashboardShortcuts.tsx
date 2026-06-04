import ContentHeader from '../../components/layout/ContentHeader';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import ShortcutItem from '../../components/business/ShortcutItem';
import type { StatCardData } from '../../types';

const stats: StatCardData[] = [
  { label: '今日待办', value: '12', trend: { direction: 'down', value: '3 项' }, icon: <svg viewBox="0 0 18 18" fill="none"><rect x="3" y="3" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M7 7h6M7 10h6M7 13h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg> },
  { label: '未读消息', value: '5', trend: { direction: 'up', value: '+2 条' }, icon: <svg viewBox="0 0 18 18" fill="none"><path d="M10 3a5 5 0 015 5v3l2 2H3l2-2V8a5 5 0 015-5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><path d="M8 15a2 2 0 004 0" stroke="currentColor" strokeWidth="1.3"/></svg> },
  { label: '进行中订单', value: '8', trend: { direction: 'up', value: '+1 单' }, icon: <svg viewBox="0 0 18 18" fill="none"><rect x="4" y="2" width="10" height="14" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M7 6h4M7 9h4M7 12h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg> },
  { label: '库存预警', value: '4', trend: { direction: 'down', value: '1 项' }, icon: <svg viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.3"/><path d="M9 6v4M9 12.5v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> },
];

export default function DashboardShortcuts() {
  return (
    <>
      <ContentHeader title="快捷入口" breadcrumbs={['工作台', '快捷入口']} />
      <div className="content-body">
        <div className="stat-cards">
          {stats.map((s, i) => <StatCard key={i} data={s} />)}
        </div>
        <Card title="快捷入口">
          <div className="shortcut-grid">
            <ShortcutItem moduleKey="purchase" iconClass="shortcut-icon-purchase" icon={<svg viewBox="0 0 20 20" fill="none"><path d="M3 5h12l-1.2 8H4.2L3 5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><path d="M7 5V3.5a2 2 0 014 0V5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>} text="新建采购" />
            <ShortcutItem moduleKey="sales" iconClass="shortcut-icon-sales" icon={<svg viewBox="0 0 20 20" fill="none"><path d="M3 14l3-4 3 2 3-5 3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>} text="新建销售" />
            <ShortcutItem moduleKey="inventory" iconClass="shortcut-icon-inventory" icon={<svg viewBox="0 0 20 20" fill="none"><rect x="3" y="5" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M3 9h12" stroke="currentColor" strokeWidth="1.3"/></svg>} text="库存查询" />
            <ShortcutItem moduleKey="product" iconClass="shortcut-icon-product" icon={<svg viewBox="0 0 20 20" fill="none"><path d="M10 2L4 5v8l6 3 6-3V5L10 2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>} text="商品管理" />
            <ShortcutItem moduleKey="finance" iconClass="shortcut-icon-finance" icon={<svg viewBox="0 0 20 20" fill="none"><rect x="2" y="4" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M5 8h2M5 11h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>} text="财务对账" />
            <ShortcutItem moduleKey="statistics" iconClass="shortcut-icon-statistics" icon={<svg viewBox="0 0 20 20" fill="none"><rect x="3" y="10" width="3" height="6" rx="0.5" stroke="currentColor" strokeWidth="1.3"/><rect x="7.5" y="6" width="3" height="10" rx="0.5" stroke="currentColor" strokeWidth="1.3"/><rect x="12" y="3" width="3" height="13" rx="0.5" stroke="currentColor" strokeWidth="1.3"/></svg>} text="数据报表" />
            <ShortcutItem moduleKey="settings" iconClass="shortcut-icon-settings" icon={<svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.3"/><path d="M10 2v2M10 16v2M2 10h2M16 10h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>} text="系统设置" />
            <ShortcutItem icon={<svg viewBox="0 0 20 20" fill="none" style={{ color: 'var(--color-neutral-500)' }}><circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.3"/><path d="M10 7v3l2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>} text="帮助中心" />
          </div>
        </Card>
      </div>
    </>
  );
}
