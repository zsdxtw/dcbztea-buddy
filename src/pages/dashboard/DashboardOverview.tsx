import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Tag from '../../components/common/Tag';
import StatusTag, { orderStatusToVariant, orderStatusLabel } from '../../components/common/StatusTag';
import AlertItem from '../../components/business/AlertItem';
import TodoItem from '../../components/business/TodoItem';
import ShortcutItem from '../../components/business/ShortcutItem';
import LineChart from '../../components/charts/LineChart';
import Button from '../../components/common/Button';
import { dashboardStats, alertItems, todoItems, purchaseOrders, salesOrders } from '../../data/mock';
import ContentHeader from '../../components/layout/ContentHeader';

/** 首页概览 */
export default function DashboardOverview() {
  return (
    <>
      <ContentHeader
        title="首页概览"
        breadcrumbs={['工作台', '首页概览']}
        actions={<Button><PlusIcon />新建订单</Button>}
      />
      <div className="content-body">
        {/* 统计卡片 */}
        <div className="stat-cards">
          {dashboardStats.map((s, i) => (
            <StatCard key={i} data={s} />
          ))}
        </div>

        {/* 折线图 + 预警/待办 */}
        <div className="grid-2" style={{ marginBottom: 'var(--space-6)' }}>
          <Card title="六大茶类销售趋势" headerRight={<Button variant="ghost" size="sm">近30天</Button>}>
            <LineChart />
            <div style={{ display: 'flex', gap: 'var(--space-5)', marginTop: 'var(--space-3)', justifyContent: 'center', flexWrap: 'wrap' }}>
              {[
                { name: '绿茶', color: 'var(--color-tea-green)' },
                { name: '白茶', color: 'var(--color-tea-white)' },
                { name: '黄茶', color: 'var(--color-tea-yellow)' },
                { name: '青茶', color: 'var(--color-tea-oolong)' },
                { name: '红茶', color: 'var(--color-tea-red)' },
                { name: '黑茶', color: 'var(--color-tea-dark)' },
              ].map((t) => (
                <span key={t.name} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--text-xs)', color: 'var(--color-neutral-500)' }}>
                  <span style={{ width: 10, height: 3, background: t.color, borderRadius: 2, display: 'inline-block' }}></span>
                  {t.name}
                </span>
              ))}
            </div>
          </Card>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <Card title="库存预警" headerRight={<span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-semantic-warning)' }}>4 项预警</span>}>
              <div style={{ padding: 'var(--space-3) 0' }}>
                {alertItems.map((a, i) => <AlertItem key={i} data={a} />)}
              </div>
            </Card>
            <Card title="待办事项" headerRight={<span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-500)' }}>5 项</span>}>
              <div style={{ padding: 'var(--space-3) 0' }}>
                {todoItems.map((t, i) => <TodoItem key={i} data={t} />)}
              </div>
            </Card>
          </div>
        </div>

        {/* 采购/销售订单表 */}
        <div className="grid-2" style={{ marginBottom: 'var(--space-6)' }}>
          <Card title="最新采购订单" headerRight={<Button variant="ghost" size="sm">查看全部</Button>}>
            <Table
              headers={['订单编号', '供应商', '商品', '金额', '状态']}
              rows={purchaseOrders.map((o) => [
                <span className="mono">{o.code}</span>,
                o.partner,
                <><Tag category={o.teaCategory} /> {o.product}</>,
                <span className="mono">{o.amount}</span>,
                <StatusTag variant={orderStatusToVariant(o.status)} label={orderStatusLabel(o.status)} />,
              ])}
            />
          </Card>
          <Card title="最新销售订单" headerRight={<Button variant="ghost" size="sm">查看全部</Button>}>
            <Table
              headers={['订单编号', '客户', '商品', '金额', '状态']}
              rows={salesOrders.map((o) => [
                <span className="mono">{o.code}</span>,
                o.partner,
                <><Tag category={o.teaCategory} /> {o.product}</>,
                <span className="mono">{o.amount}</span>,
                <StatusTag variant={orderStatusToVariant(o.status)} label={orderStatusLabel(o.status)} />,
              ])}
            />
          </Card>
        </div>

        {/* 快捷入口 */}
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

function PlusIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none">
      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
