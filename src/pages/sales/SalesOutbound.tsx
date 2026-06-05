import ContentHeader from '../../components/layout/ContentHeader';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import StatusTag from '../../components/common/StatusTag';
import Button from '../../components/common/Button';
import FilterBar, { FilterInput, FilterSelect } from '../../components/business/FilterBar';
import StatCard from '../../components/common/StatCard';
import type { StatCardData } from '../../types';

const stats: StatCardData[] = [
  { label: '待出库', value: '12', trend: { direction: 'up', value: '3 单', label: '较昨日' }, icon: <svg viewBox="0 0 18 18" fill="none"><rect x="3" y="5" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M3 9h12" stroke="currentColor" strokeWidth="1.3"/></svg> },
  { label: '已出库', value: '225', unit: '单', trend: { direction: 'up', value: '18%', label: '较上月' }, icon: <svg viewBox="0 0 18 18" fill="none"><rect x="3" y="5" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M3 9h12" stroke="currentColor" strokeWidth="1.3"/><path d="M6 10l3 3 4-5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { label: '出库总量', value: '3,860', unit: 'kg', trend: { direction: 'up', value: '22%', label: '较上月' }, icon: <svg viewBox="0 0 18 18" fill="none"><rect x="3" y="5" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3"/></svg> },
  { label: '出库金额', value: '2,568,200', unit: '¥', trend: { direction: 'up', value: '25%', label: '较上月' }, icon: <svg viewBox="0 0 18 18" fill="none"><rect x="2" y="4" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M5 8h2M5 11h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> },
];

const outboundItems = [
  { id: 'OB-2025-0125', orderId: 'SO-2025-0242', customer: '华茗堂茶庄', product: '大红袍 — 特级', teaCategory: '青茶', quantity: '40 kg', amount: '¥ 22,800', warehouse: '武夷仓区', operator: '张仓管', status: 'pending' as const },
  { id: 'OB-2025-0124', orderId: 'SO-2025-0241', customer: '雅韵茶社', product: '碧螺春 — 一级', teaCategory: '绿茶', quantity: '30 kg', amount: '¥ 12,900', warehouse: '苏州分仓', operator: '王仓管', status: 'completed' as const },
  { id: 'OB-2025-0123', orderId: 'SO-2025-0240', customer: '清心茶坊', product: '凤凰单丛 — 特级', teaCategory: '青茶', quantity: '50 kg', amount: '¥ 28,000', warehouse: '武夷仓区', operator: '张仓管', status: 'processing' as const },
  { id: 'OB-2025-0122', orderId: 'SO-2025-0239', customer: '品茗轩', product: '白毫银针 — 特级', teaCategory: '白茶', quantity: '20 kg', amount: '¥ 38,400', warehouse: '福鼎分仓', operator: '陈仓管', status: 'completed' as const },
  { id: 'OB-2025-0121', orderId: 'SO-2025-0238', customer: '翠竹茶行', product: '正山小种 — 特级', teaCategory: '红茶', quantity: '25 kg', amount: '¥ 13,200', warehouse: '武夷仓区', operator: '张仓管', status: 'pending' as const },
  { id: 'OB-2025-0120', orderId: 'SO-2025-0237', customer: '和风茶屋', product: '君山银针 — 特级', teaCategory: '黄茶', quantity: '12 kg', amount: '¥ 21,120', warehouse: '苏州分仓', operator: '王仓管', status: 'completed' as const },
  { id: 'OB-2025-0119', orderId: 'SO-2025-0236', customer: '云隐茶庄', product: '铁观音 — 一级', teaCategory: '青茶', quantity: '35 kg', amount: '¥ 11,200', warehouse: '安溪分仓', operator: '陈仓管', status: 'processing' as const },
  { id: 'OB-2025-0118', orderId: 'SO-2025-0235', customer: '茗香斋', product: '熟普洱 — 三级', teaCategory: '黑茶', quantity: '60 kg', amount: '¥ 15,600', warehouse: '云南总仓', operator: '刘仓管', status: 'completed' as const },
];

function outboundStatusToVariant(status: string) {
  switch (status) {
    case 'pending': return 'warning' as const;
    case 'processing': return 'info' as const;
    case 'completed': return 'success' as const;
    default: return 'info' as const;
  }
}

function outboundStatusLabel(status: string) {
  switch (status) {
    case 'pending': return '待出库';
    case 'processing': return '出库中';
    case 'completed': return '已出库';
    default: return status;
  }
}

export default function SalesOutbound() {
  return (
    <>
      <ContentHeader title="出库管理" breadcrumbs={['销售', '出库管理']} actions={<><Button variant="ghost">导出</Button><Button><PlusIcon />新建出库</Button></>} />
      <div className="content-body">
        <div className="stat-cards">
          {stats.map((s, i) => <StatCard key={i} data={s} />)}
        </div>
        <FilterBar>
          <FilterInput placeholder="搜索出库单号、销售单号、客户..." />
          <FilterSelect options={['全部状态', '待出库', '出库中', '已出库']} />
          <FilterSelect options={['全部茶类', '绿茶', '白茶', '黄茶', '青茶', '红茶', '黑茶']} />
          <FilterSelect options={['全部仓库', '杭州总仓', '武夷仓区', '苏州分仓', '安溪分仓', '福鼎分仓', '云南总仓']} />
        </FilterBar>
        <Card>
          <Table
            headers={['出库单号', '销售单号', '客户', '商品', '茶类', '数量', '金额', '仓库', '操作员', '状态']}
            rows={outboundItems.map((item) => [
              <span className="mono">{item.id}</span>,
              <span className="mono">{item.orderId}</span>,
              item.customer,
              item.product,
              item.teaCategory,
              <span className="mono">{item.quantity}</span>,
              <span className="mono">{item.amount}</span>,
              item.warehouse,
              item.operator,
              <StatusTag variant={outboundStatusToVariant(item.status)} label={outboundStatusLabel(item.status)} />,
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
