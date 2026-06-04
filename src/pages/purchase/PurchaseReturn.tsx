import ContentHeader from '../../components/layout/ContentHeader';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import StatusTag from '../../components/common/StatusTag';
import Button from '../../components/common/Button';
import FilterBar, { FilterInput, FilterSelect } from '../../components/business/FilterBar';
import type { StatCardData } from '../../types';

const stats: StatCardData[] = [
  { label: '退货单数', value: '12', trend: { direction: 'down', value: '3 单', label: '较上月' }, icon: <svg viewBox="0 0 18 18" fill="none"><path d="M3 6h12l-1.2 8H4.2L3 6z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><path d="M7 10l3 3M10 10l-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> },
  { label: '退货金额', value: '45,680', unit: '¥', trend: { direction: 'down', value: '8.5%' }, icon: <svg viewBox="0 0 18 18" fill="none"><rect x="2" y="4" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M5 8h2M5 11h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> },
  { label: '待处理', value: '3', trend: { direction: 'up', value: '需及时处理' }, icon: <svg viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.3"/><path d="M9 6v4M9 12.5v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> },
  { label: '本月退货率', value: '2.1', unit: '%', trend: { direction: 'down', value: '0.3%' }, icon: <svg viewBox="0 0 18 18" fill="none"><path d="M3 14l3-4 3 2 3-5 3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg> },
];

const returnItems = [
  { id: 'RT-2025-0012', originalOrder: 'PO-2025-0148', supplier: '福鼎白茶厂', product: '白牡丹 — 一级', quantity: '10 kg', amount: '¥ 8,200', reason: '质检不合格', status: 'pending' as const },
  { id: 'RT-2025-0011', originalOrder: 'PO-2025-0145', supplier: '安溪铁观音集团', product: '清香铁观音 — 二级', quantity: '20 kg', amount: '¥ 4,200', reason: '规格不符', status: 'approved' as const },
  { id: 'RT-2025-0010', originalOrder: 'PO-2025-0142', supplier: '云南普洱茶业', product: '熟普洱 — 三级', quantity: '30 kg', amount: '¥ 11,400', reason: '包装破损', status: 'completed' as const },
  { id: 'RT-2025-0009', originalOrder: 'PO-2025-0139', supplier: '武夷山茶业', product: '大红袍 — 特级', quantity: '5 kg', amount: '¥ 2,850', reason: '水分超标', status: 'completed' as const },
  { id: 'RT-2025-0008', originalOrder: 'PO-2025-0135', supplier: '西湖龙井合作社', product: '明前龙井 — 特级', quantity: '8 kg', amount: '¥ 5,600', reason: '感官不达标', status: 'rejected' as const },
  { id: 'RT-2025-0007', originalOrder: 'PO-2025-0130', supplier: '福鼎白茶厂', product: '白毫银针 — 特级', quantity: '3 kg', amount: '¥ 6,780', reason: '农残超标', status: 'pending' as const },
  { id: 'RT-2025-0006', originalOrder: 'PO-2025-0128', supplier: '云南普洱茶业', product: '六堡茶 — 二级', quantity: '15 kg', amount: '¥ 2,700', reason: '到货延迟', status: 'approved' as const },
  { id: 'RT-2025-0005', originalOrder: 'PO-2025-0125', supplier: '安溪铁观音集团', product: '铁观音 — 一级', quantity: '25 kg', amount: '¥ 4,250', reason: '口味异常', status: 'pending' as const },
];

function returnStatusToVariant(status: string) {
  switch (status) {
    case 'pending': return 'warning' as const;
    case 'approved': return 'info' as const;
    case 'completed': return 'success' as const;
    case 'rejected': return 'error' as const;
    default: return 'info' as const;
  }
}

function returnStatusLabel(status: string) {
  switch (status) {
    case 'pending': return '待处理';
    case 'approved': return '已审批';
    case 'completed': return '已退货';
    case 'rejected': return '已驳回';
    default: return status;
  }
}

export default function PurchaseReturn() {
  return (
    <>
      <ContentHeader title="采购退货" breadcrumbs={['采购', '采购退货']} actions={<><Button variant="ghost">导出</Button><Button><PlusIcon />新建退货单</Button></>} />
      <div className="content-body">
        <div className="stat-cards">
          {stats.map((s, i) => <StatCard key={i} data={s} />)}
        </div>
        <FilterBar>
          <FilterInput placeholder="搜索退货单号、供应商..." />
          <FilterSelect options={['全部状态', '待处理', '已审批', '已退货', '已驳回']} />
          <FilterSelect options={['全部供应商', '武夷山茶业', '西湖龙井合作社', '安溪铁观音集团', '福鼎白茶厂', '云南普洱茶业']} />
          <FilterSelect options={['全部时间', '今日', '本周', '本月', '近3月']} />
        </FilterBar>
        <Card>
          <Table
            headers={['退货单号', '原采购单号', '供应商', '商品', '退货数量', '退货金额', '退货原因', '状态']}
            rows={returnItems.map((r) => [
              <span className="mono">{r.id}</span>,
              <span className="mono">{r.originalOrder}</span>,
              r.supplier,
              r.product,
              <span className="mono">{r.quantity}</span>,
              <span className="mono">{r.amount}</span>,
              r.reason,
              <StatusTag variant={returnStatusToVariant(r.status)} label={returnStatusLabel(r.status)} />,
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
