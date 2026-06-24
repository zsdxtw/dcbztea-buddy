import { useState, useEffect, useMemo } from 'react';
import ContentHeader from '../../components/layout/ContentHeader';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Tag from '../../components/common/Tag';
import Button from '../../components/common/Button';
import StatusTag, { orderStatusToVariant, orderStatusLabel } from '../../components/common/StatusTag';
import FilterBar, { FilterInput, FilterSelect } from '../../components/business/FilterBar';
import { TeaCategory, OrderStatus } from '../../types';
import type { StatCardData, SalesOrderItem, CustomerItem } from '../../types';
import { getSalesDefaultPrice } from '../../data/prices';
import { teaProducts } from '../../data/teaProducts';
import { employees, getEmployeeName } from '../../data/organization';
import DeptEmployeeSelect from '../../components/business/DeptEmployeeSelect';
import { customerItems, CUSTOMER_TYPE_LABELS as GLOBAL_CUSTOMER_LABELS, CUSTOMER_TYPE_DESC } from '../../data/customers';
import { platformItems } from '../../data/platforms';
import { streamers } from '../../data/streamers';
import { generateCustomerCode } from '../../utils/customerCode';

/* ── 工具函数 ── */
function categoryToTeaCategory(category: string): TeaCategory {
  const prefix = category.split('-')[0];
  const map: Record<string, TeaCategory> = {
    '绿茶': TeaCategory.GREEN, '红茶': TeaCategory.RED, '青茶': TeaCategory.OOLONG,
    '白茶': TeaCategory.WHITE, '黄茶': TeaCategory.YELLOW, '黑茶': TeaCategory.DARK,
    '花草茶': TeaCategory.FLOWER,
  };
  return map[prefix] ?? TeaCategory.GREEN;
}

function formatMoney(n: number): string {
  return `¥${n.toLocaleString('en-US')}`;
}

/* 价格来源标签 */
const SOURCE_LABELS: Record<'vip' | 'sales' | 'market', string> = {
  vip: 'VIP', sales: '销售', market: '市场',
};
const SOURCE_COLORS: Record<'vip' | 'sales' | 'market', string> = {
  vip: '#CB405D', sales: 'var(--color-module-current-base)', market: 'var(--color-text-tertiary)',
};

/* ── 统计卡片 ── */
const stats: StatCardData[] = [
  {
    label: '订单总数', value: '58',
    trend: { direction: 'up', value: '+8 单' },
    icon: <svg viewBox="0 0 18 18" fill="none"><rect x="4" y="2" width="10" height="14" rx="2" stroke="currentColor" strokeWidth="1.3"/></svg>,
  },
  {
    label: '销售总额', value: '1,285,600', unit: '¥',
    trend: { direction: 'up', value: '12.5%' },
    icon: <svg viewBox="0 0 18 18" fill="none"><path d="M3 14l3-4 3 2 3-5 3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  },
  {
    label: '待审核', value: '5',
    trend: { direction: 'down', value: '2 单' },
    icon: <svg viewBox="0 0 18 18" fill="none"><rect x="3" y="5" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M7 8h4M7 11h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  },
  {
    label: '运输中', value: '3',
    trend: { direction: 'up', value: '+1 单' },
    icon: <svg viewBox="0 0 18 18" fill="none"><path d="M2 12h10l4-4H6L2 12zM6 8l2-4h8l-2 4" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>,
  },
];

/* ── 客户类型 ── */
type CustomerType = 'direct' | 'channel' | 'personal' | 'platform' | 'guest';

const CUSTOMER_TYPE_LABELS: Record<CustomerType, string> = {
  direct: '直营客户',
  channel: '渠道客户',
  personal: '个人客户',
  platform: '平台客户',
  guest: '游客客户',
};

/* 新客户下拉选项（直营/渠道加"企业"后缀） */
const CUSTOMER_TYPE_DROPDOWN_OPTIONS: { value: CustomerType; label: string }[] = [
  { value: 'direct', label: '直营客户（企业）' },
  { value: 'channel', label: '渠道客户（企业）' },
  { value: 'personal', label: '个人客户' },
  { value: 'platform', label: '平台客户' },
  { value: 'guest', label: '游客客户' },
];

/* 客户类型标签颜色映射 */
const customerTypeColors: Record<CustomerType, { bg: string; color: string; border: string }> = {
  direct: { bg: '#E3F2FD', color: '#1565C0', border: '#90CAF9' },
  channel: { bg: '#FFF3E0', color: '#E65100', border: '#FFCC80' },
  personal: { bg: '#F3E5F5', color: '#7B1FA2', border: '#CE93D8' },
  platform: { bg: '#E8F5E9', color: '#2E7D32', border: '#A5D6A7' },
  guest: { bg: '#ECEFF1', color: '#455A64', border: '#B0BEC5' },
};

/* ── Mock 订单数据 ── */
interface SalesOrderRecord {
  id: string;
  code: string;
  customer: string;
  customerType: CustomerType;
  product: string;
  teaCategory: TeaCategory;
  quantity: string;
  unitPrice: string;
  amount: string;
  date: string;
  status: OrderStatus;
  contactPerson: string;
  contactPhone: string;
  deliveryAddress: string;
  remark: string;
  products: SalesOrderItem[];
  timeline: { time: string; event: string; operator: string }[];
  /** 跟单人 ID */
  followerId?: string;
  /** 跟单人类型 */
  followerType?: 'employee' | 'streamer';
  /** 跟单人姓名 */
  followerName?: string;
  /** 主办人 ID */
  hostId?: string;
  /** 主办人类型 */
  hostType?: 'employee' | 'streamer';
  /** 主办人姓名 */
  hostName?: string;
  /** 销售场景（1-6） */
  scenario?: number;
  /** 平台扣点（仅场景2） */
  platformDeductionRate?: number;
}

const orderData: SalesOrderRecord[] = [
  {
    id: '1', code: 'SO-2025-0242', customer: '华茗堂茶庄', customerType: 'direct',
    product: '明前龙井', teaCategory: TeaCategory.GREEN, quantity: '30 kg', unitPrice: '¥ 580/50g', amount: '¥ 34,800',
    date: '2025-07-12', status: OrderStatus.PENDING,
    contactPerson: '王经理', contactPhone: '0571-87651234', deliveryAddress: '杭州市西湖区龙井路88号',
    remark: '需冷藏运输，指定顺丰',
    followerId: 'emp-8', followerType: 'employee', followerName: '王强', scenario: 1,
    products: [
      { productId: '1', name: '明前龙井 — 特级', teaCategory: TeaCategory.GREEN, quantity: '20 kg', marketPrice: 580, defaultPrice: 452, actualSalesPrice: 452, priceSource: 'sales', amount: '¥ 23,200' },
      { productId: '2', name: '碧螺春 — 一级', teaCategory: TeaCategory.GREEN, quantity: '10 kg', marketPrice: 420, defaultPrice: 328, actualSalesPrice: 328, priceSource: 'sales', amount: '¥ 11,600' },
    ],
    timeline: [
      { time: '2025-07-12 09:30', event: '客户下单', operator: '系统' },
      { time: '2025-07-12 10:15', event: '订单确认', operator: '李销售' },
    ],
  },
  {
    id: '2', code: 'SO-2025-0241', customer: '雅韵茶社', customerType: 'channel',
    product: '金骏眉', teaCategory: TeaCategory.RED, quantity: '15 kg', unitPrice: '¥ 1,200/50g', amount: '¥ 36,000',
    date: '2025-07-11', status: OrderStatus.APPROVED,
    contactPerson: '赵总', contactPhone: '0599-51234567', deliveryAddress: '武夷山市度假区茶博园6号',
    remark: '长期合作客户，月结',
    followerId: 'emp-9', followerType: 'employee', followerName: '张伟', scenario: 3,
    products: [
      { productId: '7', name: '金骏眉 — 特级', teaCategory: TeaCategory.RED, quantity: '15 kg', marketPrice: 1280, defaultPrice: 1024, actualSalesPrice: 1024, priceSource: 'sales', amount: '¥ 36,000' },
    ],
    timeline: [
      { time: '2025-07-11 14:00', event: '客户下单', operator: '系统' },
      { time: '2025-07-11 14:30', event: '订单确认', operator: '张销售' },
      { time: '2025-07-11 16:00', event: '审核通过', operator: '陈经理' },
    ],
  },
  {
    id: '3', code: 'SO-2025-0240', customer: '清心茶坊', customerType: 'direct',
    product: '凤凰单丛', teaCategory: TeaCategory.OOLONG, quantity: '40 kg', unitPrice: '¥ 560/50g', amount: '¥ 44,800',
    date: '2025-07-10', status: OrderStatus.SHIPPING,
    contactPerson: '林老板', contactPhone: '0768-2345678', deliveryAddress: '潮州市湘桥区太平路168号',
    remark: '分两批发货',
    followerId: 'emp-8', followerType: 'employee', followerName: '王强', scenario: 1,
    products: [
      { productId: '12', name: '凤凰单丛 — 特级', teaCategory: TeaCategory.OOLONG, quantity: '25 kg', marketPrice: 560, defaultPrice: 426, actualSalesPrice: 426, priceSource: 'sales', amount: '¥ 28,000' },
      { productId: '10', name: '大红袍 — 特级', teaCategory: TeaCategory.OOLONG, quantity: '15 kg', marketPrice: 720, defaultPrice: 547, actualSalesPrice: 547, priceSource: 'sales', amount: '¥ 16,800' },
    ],
    timeline: [
      { time: '2025-07-10 10:00', event: '客户下单', operator: '系统' },
      { time: '2025-07-10 10:30', event: '订单确认', operator: '李销售' },
      { time: '2025-07-10 14:00', event: '审核通过', operator: '陈经理' },
      { time: '2025-07-11 09:00', event: '已发货', operator: '赵仓管' },
    ],
  },
  {
    id: '4', code: 'SO-2025-0239', customer: '品茗轩', customerType: 'platform',
    product: '白毫银针', teaCategory: TeaCategory.WHITE, quantity: '20 kg', unitPrice: '¥ 960/50g', amount: '¥ 38,400',
    date: '2025-07-09', status: OrderStatus.COMPLETED,
    contactPerson: '张女士', contactPhone: '0593-5678901', deliveryAddress: '福鼎市太姥山镇茶都路22号',
    remark: '已签收，客户满意',
    followerId: undefined, followerType: undefined, followerName: undefined, scenario: 5,
    products: [
      { productId: '13', name: '白毫银针 — 特级', teaCategory: TeaCategory.WHITE, quantity: '20 kg', marketPrice: 960, defaultPrice: 787, actualSalesPrice: 787, priceSource: 'sales', amount: '¥ 38,400' },
    ],
    timeline: [
      { time: '2025-07-09 08:30', event: '客户下单', operator: '系统' },
      { time: '2025-07-09 09:00', event: '订单确认', operator: '张销售' },
      { time: '2025-07-09 11:00', event: '审核通过', operator: '陈经理' },
      { time: '2025-07-10 08:00', event: '已发货', operator: '赵仓管' },
      { time: '2025-07-11 14:00', event: '已签收', operator: '客户' },
    ],
  },
  {
    id: '5', code: 'SO-2025-0238', customer: '翠竹茶行', customerType: 'channel',
    product: '六堡茶', teaCategory: TeaCategory.DARK, quantity: '50 kg', unitPrice: '¥ 180/50g', amount: '¥ 18,000',
    date: '2025-07-08', status: OrderStatus.COMPLETED,
    contactPerson: '周经理', contactPhone: '0774-7234567', deliveryAddress: '梧州市万秀区西江路56号',
    remark: '季度采购，常规订单',
    followerId: 'emp-9', followerType: 'employee', followerName: '张伟', scenario: 3,
    products: [
      { productId: '33', name: '六堡茶 — 二级', teaCategory: TeaCategory.DARK, quantity: '30 kg', marketPrice: 280, defaultPrice: 210, actualSalesPrice: 210, priceSource: 'sales', amount: '¥ 10,800' },
      { productId: '18', name: '熟普洱 — 三级', teaCategory: TeaCategory.DARK, quantity: '20 kg', marketPrice: 260, defaultPrice: 195, actualSalesPrice: 195, priceSource: 'sales', amount: '¥ 7,200' },
    ],
    timeline: [
      { time: '2025-07-08 09:00', event: '客户下单', operator: '系统' },
      { time: '2025-07-08 09:30', event: '订单确认', operator: '李销售' },
      { time: '2025-07-08 14:00', event: '审核通过', operator: '陈经理' },
      { time: '2025-07-09 08:30', event: '已发货', operator: '赵仓管' },
      { time: '2025-07-10 16:00', event: '已签收', operator: '客户' },
    ],
  },
  {
    id: '6', code: 'SO-2025-0237', customer: '和风茶屋', customerType: 'direct',
    product: '君山银针', teaCategory: TeaCategory.YELLOW, quantity: '10 kg', unitPrice: '¥ 880/50g', amount: '¥ 17,600',
    date: '2025-07-07', status: OrderStatus.PENDING,
    contactPerson: '何老板', contactPhone: '0730-8234567', deliveryAddress: '岳阳市君山区洞庭大道99号',
    remark: '新客户首单，需提供样品检测报告',
    followerId: undefined, followerType: undefined, followerName: undefined, scenario: 1,
    products: [
      { productId: '16', name: '君山银针 — 特级', teaCategory: TeaCategory.YELLOW, quantity: '10 kg', marketPrice: 880, defaultPrice: 695, actualSalesPrice: 695, priceSource: 'sales', amount: '¥ 17,600' },
    ],
    timeline: [
      { time: '2025-07-07 11:00', event: '客户下单', operator: '系统' },
    ],
  },
  {
    id: '7', code: 'SO-2025-0236', customer: '云隐茶庄', customerType: 'channel',
    product: '正山小种', teaCategory: TeaCategory.RED, quantity: '25 kg', unitPrice: '¥ 480/50g', amount: '¥ 24,000',
    date: '2025-07-06', status: OrderStatus.APPROVED,
    contactPerson: '江总', contactPhone: '0599-5234567', deliveryAddress: '武夷山市星村镇茶场路12号',
    remark: '有机认证产品，需附证书',
    followerId: 'emp-8', followerType: 'employee', followerName: '王强', scenario: 3,
    products: [
      { productId: '6', name: '正山小种 — 特级', teaCategory: TeaCategory.RED, quantity: '25 kg', marketPrice: 480, defaultPrice: 384, actualSalesPrice: 384, priceSource: 'sales', amount: '¥ 24,000' },
    ],
    timeline: [
      { time: '2025-07-06 09:30', event: '客户下单', operator: '系统' },
      { time: '2025-07-06 10:00', event: '订单确认', operator: '张销售' },
      { time: '2025-07-06 15:00', event: '审核通过', operator: '陈经理' },
    ],
  },
  {
    id: '8', code: 'SO-2025-0235', customer: '茗香斋', customerType: 'platform',
    product: '铁观音', teaCategory: TeaCategory.OOLONG, quantity: '60 kg', unitPrice: '¥ 320/50g', amount: '¥ 38,400',
    date: '2025-07-05', status: OrderStatus.SHIPPING,
    contactPerson: '吴经理', contactPhone: '0595-2345678', deliveryAddress: '安溪县凤城镇茶都路188号',
    remark: '清香型，真空包装',
    followerId: 'emp-9', followerType: 'employee', followerName: '张伟', scenario: 5,
    products: [
      { productId: '11', name: '铁观音 — 一级', teaCategory: TeaCategory.OOLONG, quantity: '40 kg', marketPrice: 320, defaultPrice: 243, actualSalesPrice: 243, priceSource: 'sales', amount: '¥ 25,600' },
      { productId: '11', name: '铁观音 — 二级', teaCategory: TeaCategory.OOLONG, quantity: '20 kg', marketPrice: 320, defaultPrice: 243, actualSalesPrice: 243, priceSource: 'sales', amount: '¥ 12,800' },
    ],
    timeline: [
      { time: '2025-07-05 08:00', event: '客户下单', operator: '系统' },
      { time: '2025-07-05 08:30', event: '订单确认', operator: '李销售' },
      { time: '2025-07-05 10:00', event: '审核通过', operator: '陈经理' },
      { time: '2025-07-06 09:00', event: '已发货', operator: '赵仓管' },
    ],
  },
  {
    id: '9', code: 'SO-2025-0234', customer: '华茗堂茶庄', customerType: 'direct',
    product: '祁门红茶', teaCategory: TeaCategory.RED, quantity: '35 kg', unitPrice: '¥ 520/50g', amount: '¥ 36,400',
    date: '2025-07-04', status: OrderStatus.COMPLETED,
    contactPerson: '王经理', contactPhone: '0571-87651234', deliveryAddress: '杭州市西湖区龙井路88号',
    remark: '月度补货订单',
    followerId: 'emp-8', followerType: 'employee', followerName: '王强', scenario: 1,
    products: [
      { productId: '9', name: '祁门红茶 — 特级', teaCategory: TeaCategory.RED, quantity: '35 kg', marketPrice: 520, defaultPrice: 416, actualSalesPrice: 416, priceSource: 'sales', amount: '¥ 36,400' },
    ],
    timeline: [
      { time: '2025-07-04 09:00', event: '客户下单', operator: '系统' },
      { time: '2025-07-04 09:30', event: '订单确认', operator: '张销售' },
      { time: '2025-07-04 11:00', event: '审核通过', operator: '陈经理' },
      { time: '2025-07-05 08:30', event: '已发货', operator: '赵仓管' },
      { time: '2025-07-06 15:00', event: '已签收', operator: '客户' },
    ],
  },
  {
    id: '10', code: 'SO-2025-0233', customer: '雅韵茶社', customerType: 'channel',
    product: '玫瑰花茶', teaCategory: TeaCategory.FLOWER, quantity: '20 kg', unitPrice: '¥ 128/50g', amount: '¥ 5,120',
    date: '2025-07-03', status: OrderStatus.CANCELLED,
    contactPerson: '赵总', contactPhone: '0599-51234567', deliveryAddress: '武夷山市度假区茶博园6号',
    remark: '客户取消，改订茉莉花茶',
    followerId: undefined, followerType: undefined, followerName: undefined, scenario: 3,
    products: [
      { productId: '24', name: '玫瑰花茶 — 一级', teaCategory: TeaCategory.FLOWER, quantity: '20 kg', marketPrice: 158, defaultPrice: 122, actualSalesPrice: 122, priceSource: 'sales', amount: '¥ 5,120' },
    ],
    timeline: [
      { time: '2025-07-03 10:00', event: '客户下单', operator: '系统' },
      { time: '2025-07-03 14:00', event: '客户取消', operator: '客户' },
    ],
  },
];

export default function SalesOrders() {
  const [orders, setOrders] = useState<SalesOrderRecord[]>(orderData);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<SalesOrderRecord | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [codeSeq, setCodeSeq] = useState(243);

  const handleView = (order: SalesOrderRecord) => {
    setSelectedOrder(order);
    setShowDetail(true);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setSelectedOrder(null);
  };

  const handleCreate = (order: SalesOrderRecord) => {
    setOrders(prev => [order, ...prev]);
    setCodeSeq(s => s + 1);
    setShowCreate(false);
  };

  return (
    <>
      <ContentHeader
        title="销售订单"
        breadcrumbs={['销售', '销售订单']}
        actions={<Button onClick={() => setShowCreate(true)}><PlusIcon />新建销售单</Button>}
      />
      <div className="content-body">
        <div className="stat-cards">
          {stats.map((s, i) => <StatCard key={i} data={s} />)}
        </div>

        <FilterBar>
          <FilterInput placeholder="搜索订单编号、客户..." />
          <FilterSelect options={['全部状态', '待审核', '待确认', '运输中', '已完成', '已取消']} />
          <FilterSelect options={['全部茶类', '绿茶', '白茶', '黄茶', '青茶', '红茶', '黑茶', '花草茶']} />
          <FilterSelect options={['全部客户类型', '直营客户', '渠道客户', '个人客户', '平台客户', '游客客户']} />
          <FilterSelect options={['全部时间', '今日', '本周', '本月', '近3月']} />
        </FilterBar>

        <Card>
          <Table
            headers={['订单编号', '客户', '客户类型', '跟单人', '主办人', '商品', '茶类', '数量', '单价', '金额', '下单日期', '状态', '操作']}
            rows={orders.map((o) => {
              const ctColor = customerTypeColors[o.customerType];
              return [
              <span className="mono">{o.code}</span>,
              o.customer,
              <span style={{
                padding: '1px 8px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-medium)',
                background: ctColor.bg, color: ctColor.color, border: `1px solid ${ctColor.border}`,
              }}>{CUSTOMER_TYPE_LABELS[o.customerType]}</span>,
              <span key="follower" style={{ fontSize: 'var(--text-sm)', color: o.followerName ? 'var(--color-text-secondary)' : 'var(--color-text-tertiary)' }}>{o.followerName ?? '—'}</span>,
              <span key="host" style={{ fontSize: 'var(--text-sm)', color: o.hostName ? 'var(--color-text-secondary)' : 'var(--color-text-tertiary)' }}>{o.hostName ?? '—'}</span>,
              o.product,
              <Tag category={o.teaCategory} />,
              <span className="mono">{o.quantity}</span>,
              <span className="mono">{o.unitPrice}</span>,
              <span className="mono">{o.amount}</span>,
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{o.date}</span>,
              <StatusTag variant={orderStatusToVariant(o.status)} label={orderStatusLabel(o.status)} />,
              <Button size="sm" variant="ghost" onClick={() => handleView(o)}>查看</Button>,
            ];})}
          />
        </Card>
      </div>

      {/* 新建销售单抽屉 */}
      {showCreate && (
        <CreateSalesDrawer
          nextNumber={codeSeq}
          onCancel={() => setShowCreate(false)}
          onSave={handleCreate}
        />
      )}

      {/* 订单详情抽屉 */}
      {showDetail && selectedOrder && (
        <div className="drawer-overlay" onClick={handleCloseDetail}>
          <div className="drawer-panel" onClick={(e) => e.stopPropagation()} style={{ width: 680 }}>
            <div className="drawer-header">
              <span className="drawer-title">订单详情</span>
              <button className="drawer-close" onClick={handleCloseDetail}>
                <svg viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
              </button>
            </div>

            <div className="drawer-body">
              {/* 订单信息 */}
              <div style={{ marginBottom: 'var(--space-5)' }}>
                <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-3)', color: 'var(--color-text-secondary)' }}>订单信息</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-3)' }}>
                  <div>
                    <label className="drawer-label">订单编号</label>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)' }} className="mono">{selectedOrder.code}</div>
                  </div>
                  <div>
                    <label className="drawer-label">客户</label>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)' }}>{selectedOrder.customer}</div>
                  </div>
                  <div>
                    <label className="drawer-label">客户类型</label>
                    {(() => { const c = customerTypeColors[selectedOrder.customerType]; return (
                    <span style={{
                      padding: '1px 8px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-medium)',
                      background: c.bg, color: c.color, border: `1px solid ${c.border}`,
                    }}>{CUSTOMER_TYPE_LABELS[selectedOrder.customerType]}</span>); })()}
                  </div>
                  <div>
                    <label className="drawer-label">跟单人</label>
                    <div style={{ fontSize: 'var(--text-sm)' }}>{selectedOrder.followerName ?? '—'}</div>
                  </div>
                  <div>
                    <label className="drawer-label">主办人</label>
                    <div style={{ fontSize: 'var(--text-sm)' }}>{selectedOrder.hostName ?? '—'}</div>
                  </div>
                  <div>
                    <label className="drawer-label">下单日期</label>
                    <div style={{ fontSize: 'var(--text-sm)' }}>{selectedOrder.date}</div>
                  </div>
                  <div>
                    <label className="drawer-label">联系人</label>
                    <div style={{ fontSize: 'var(--text-sm)' }}>{selectedOrder.contactPerson}</div>
                  </div>
                  <div>
                    <label className="drawer-label">联系电话</label>
                    <div style={{ fontSize: 'var(--text-sm)' }}>{selectedOrder.contactPhone}</div>
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label className="drawer-label">收货地址</label>
                    <div style={{ fontSize: 'var(--text-sm)' }}>{selectedOrder.deliveryAddress}</div>
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label className="drawer-label">备注</label>
                    <div style={{ fontSize: 'var(--text-sm)' }}>{selectedOrder.remark}</div>
                  </div>
                </div>
              </div>

              {/* 商品明细 */}
              <div style={{ marginBottom: 'var(--space-5)' }}>
                <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-3)', color: 'var(--color-text-secondary)' }}>商品明细</h4>
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>商品</th>
                        <th>茶类</th>
                        <th>数量</th>
                        <th>市场价</th>
                        <th>默认价</th>
                        <th>销售实价</th>
                        <th>金额</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.products.map((p, i) => (
                        <tr key={i}>
                          <td style={{ fontWeight: 'var(--font-medium)' }}>{p.name}</td>
                          <td><Tag category={p.teaCategory} /></td>
                          <td className="mono">{p.quantity}</td>
                          <td className="mono" style={{ color: 'var(--color-text-tertiary)' }}>{formatMoney(p.marketPrice)}</td>
                          <td className="mono">
                            {formatMoney(p.defaultPrice)}
                            <span style={{
                              marginLeft: 6, padding: '0 6px', borderRadius: 'var(--radius-sm)',
                              fontSize: 'var(--text-xs)', fontWeight: 'var(--font-medium)',
                              background: 'var(--color-bg-tertiary)', color: SOURCE_COLORS[p.priceSource],
                              border: `1px solid ${SOURCE_COLORS[p.priceSource]}30`,
                            }}>{SOURCE_LABELS[p.priceSource]}</span>
                          </td>
                          <td className="mono" style={{ fontWeight: 'var(--font-semibold)', color: 'var(--color-module-current-base)' }}>{formatMoney(p.actualSalesPrice)}</td>
                          <td className="mono">{p.amount}</td>
                        </tr>
                      ))}
                      <tr style={{ fontWeight: 'var(--font-semibold)' }}>
                        <td colSpan={6} style={{ textAlign: 'right', color: 'var(--color-text-secondary)' }}>合计</td>
                        <td className="mono" style={{ color: 'var(--color-module-current-base)' }}>{selectedOrder.amount}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 订单时间线 */}
              <div>
                <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-3)', color: 'var(--color-text-secondary)' }}>订单时间线</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  {selectedOrder.timeline.map((step, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3)', background: i === selectedOrder.timeline.length - 1 ? 'var(--color-module-current-lightest)' : 'var(--color-bg-tertiary)', borderRadius: 'var(--radius-md)', border: i === selectedOrder.timeline.length - 1 ? '1px solid var(--color-module-current-light)' : '1px solid transparent' }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: 'var(--radius-md)',
                        background: i === selectedOrder.timeline.length - 1 ? 'var(--color-module-current-base)' : 'var(--color-neutral-200)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)',
                        color: i === selectedOrder.timeline.length - 1 ? '#fff' : 'var(--color-text-tertiary)',
                        flexShrink: 0,
                      }}>
                        {i + 1}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                          <span style={{ fontWeight: 'var(--font-medium)', fontSize: 'var(--text-sm)' }}>{step.event}</span>
                          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }} className="mono">{step.time}</span>
                        </div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>操作人：{step.operator}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="drawer-footer">
              <Button variant="ghost" onClick={handleCloseDetail}>关闭</Button>
              {selectedOrder.status === OrderStatus.PENDING && (
                <>
                  <Button style={{ background: '#CB405D', borderColor: '#CB405D' }} onClick={handleCloseDetail}>驳回</Button>
                  <Button onClick={handleCloseDetail}>审核通过</Button>
                </>
              )}
              {selectedOrder.status === OrderStatus.APPROVED && (
                <Button onClick={handleCloseDetail}>安排发货</Button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ── 新建销售单抽屉 ── */
function CreateSalesDrawer({ nextNumber, onCancel, onSave }: {
  nextNumber: number;
  onCancel: () => void;
  onSave: (order: SalesOrderRecord) => void;
}) {
  const [customerId, setCustomerId] = useState('');
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [actualSalesPrice, setActualSalesPrice] = useState('');
  const [orderDate, setOrderDate] = useState(new Date().toISOString().slice(0, 10));
  const [contactPerson, setContactPerson] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [remark, setRemark] = useState('');

  // 客户搜索与选择
  const [customerSearch, setCustomerSearch] = useState('');
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [customerType, setCustomerType] = useState<CustomerType | ''>('');
  const [newCustomerShortName, setNewCustomerShortName] = useState('');

  // 跟单人
  const [followerId, setFollowerId] = useState('');
  const [followerType, setFollowerType] = useState<'employee' | 'streamer' | ''>('');

  // 构建客户选项列表（所有客户 + 平台客户）
  const allCustomerOptions = useMemo(() => {
    const customers = customerItems.map(c => ({ id: c.id, name: c.shortName || c.name, type: c.type }));
    const platforms = platformItems.map(p => ({ id: p.id, name: p.shortName || p.name, type: 'platform' as const }));
    return [...customers, ...platforms];
  }, []);

  const filteredCustomers = useMemo(() => {
    if (!customerSearch) return allCustomerOptions;
    return allCustomerOptions.filter(c => c.name.includes(customerSearch));
  }, [customerSearch, allCustomerOptions]);

  const handleSelectCustomer = (selectedId: string) => {
    if (selectedId === 'new') {
      setIsNewCustomer(true);
      setCustomerId('');
      setCustomerType('');
      setNewCustomerShortName('');
    } else {
      setIsNewCustomer(false);
      setCustomerId(selectedId);
      const selected = allCustomerOptions.find(c => c.id === selectedId);
      if (selected) {
        setCustomerType(selected.type);
      }
    }
    setShowCustomerDropdown(false);
    setCustomerSearch('');
  };

  // 清除客户选择
  const handleClearCustomer = () => {
    setCustomerId('');
    setIsNewCustomer(false);
    setCustomerType('');
    setNewCustomerShortName('');
    setCustomerSearch('');
    setShowCustomerDropdown(false);
  };

  // 获取选中客户的详细信息（主办人、联系人、电话、等级）
  const selectedCustomerInfo = useMemo(() => {
    if (!customerId || isNewCustomer) return null;
    const customer = customerItems.find(c => c.id === customerId);
    if (customer) {
      const hostName = customer.hostId
        ? (customer.hostType === 'streamer' ? streamers.find(s => s.id === customer.hostId)?.name : getEmployeeName(customer.hostId))
        : undefined;
      return { hostName: hostName ?? '—', contactPerson: customer.contactPerson || '—', contactPhone: customer.contactPhone || '—', level: customer.level || '—' };
    }
    const platform = platformItems.find(p => p.id === customerId);
    if (platform) {
      const hostName = platform.hostId
        ? (platform.hostType === 'streamer' ? streamers.find(s => s.id === platform.hostId)?.name : getEmployeeName(platform.hostId))
        : undefined;
      return { hostName: hostName ?? '—', contactPerson: platform.contactPerson || '—', contactPhone: platform.contactPhone || '—', level: '—' };
    }
    return null;
  }, [customerId, isNewCustomer]);

  const selectedProduct = teaProducts.find(p => p.id === productId);
  const marketPrice = selectedProduct?.marketPrice ?? 0;
  const hasCustomer = !!(customerId || isNewCustomer);
  const defaultResult = productId && hasCustomer
    ? (customerId ? getSalesDefaultPrice(productId, customerId) : { price: selectedProduct?.salesPrice || marketPrice, source: 'sales' as const })
    : null;
  const defaultPrice = defaultResult?.price ?? 0;
  const priceSource = defaultResult?.source ?? 'market';

  // 商品或客户变化时，销售实价自动带出默认价（VIP价 > 销售价 > 市场价）
  useEffect(() => {
    if (productId && hasCustomer) {
      if (customerId) {
        const { price } = getSalesDefaultPrice(productId, customerId);
        setActualSalesPrice(String(price));
      } else {
        setActualSalesPrice(String(selectedProduct?.salesPrice || marketPrice));
      }
    } else {
      setActualSalesPrice('');
    }
  }, [productId, customerId, isNewCustomer]);

  const qtyNum = Number(quantity) || 0;
  const actualNum = Number(actualSalesPrice) || 0;
  const amountNum = qtyNum * actualNum;

  const canSave = (isNewCustomer ? (!!customerType && !!newCustomerShortName.trim()) : !!customerId) && !!productId && qtyNum > 0 && actualNum > 0 && !!orderDate;

  // 根据人员类型获取姓名
  const getPersonName = (id: string, type: 'employee' | 'streamer'): string | undefined => {
    if (type === 'employee') return getEmployeeName(id);
    return streamers.find(s => s.id === id)?.name;
  };

  // 根据客户类型获取销售场景
  const getScenarioByType = (type: CustomerType): number => {
    const map: Record<CustomerType, number> = { direct: 1, channel: 3, personal: 4, platform: 5, guest: 6 };
    return map[type];
  };

  const handleSave = () => {
    if (!canSave || !selectedProduct) return;
    if (isNewCustomer && !customerType) return;
    const now = new Date();
    const timeStr = `${orderDate} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const customerName = isNewCustomer
      ? newCustomerShortName.trim()
      : (allCustomerOptions.find(c => c.id === customerId)?.name ?? '新客户');
    const followerName = followerId && followerType ? getPersonName(followerId, followerType) : undefined;

    // 新客户联动添加到客户管理列表
    let orderHostId: string | undefined;
    let orderHostType: 'employee' | 'streamer' | undefined;
    let orderHostName: string | undefined;
    if (isNewCustomer) {
      const newCustId = `c_${Date.now()}`;
      const newCustomer: CustomerItem = {
        id: newCustId,
        name: newCustomerShortName.trim(),
        shortName: newCustomerShortName.trim(),
        customerCode: generateCustomerCode(customerType as CustomerType, newCustomerShortName.trim(), customerItems.length + 1),
        type: customerType as CustomerType,
        region: '', province: '', city: '', district: '',
        contactPerson: contactPerson || '', contactPhone: contactPhone || '', contactEmail: '', contactAddress: deliveryAddress || '',
        level: 'B级', orders: 1, totalAmount: amountNum, platformIds: [],
        cooperationDate: orderDate, status: 'active',
        settlementMethod: '月结', taxNo: '', source: '线上咨询', remark: '由销售订单新增',
        bankAccounts: [], invoiceInfos: [],
      };
      customerItems.push(newCustomer);
    } else {
      // 已有客户：从客户档案获取主办人信息
      const customer = customerItems.find(c => c.id === customerId);
      if (customer) {
        orderHostId = customer.hostId;
        orderHostType = customer.hostType;
        orderHostName = customer.hostId
          ? (customer.hostType === 'streamer' ? streamers.find(s => s.id === customer.hostId)?.name : getEmployeeName(customer.hostId))
          : undefined;
      } else {
        const platform = platformItems.find(p => p.id === customerId);
        if (platform) {
          orderHostId = platform.hostId;
          orderHostType = platform.hostType;
          orderHostName = platform.hostId
            ? (platform.hostType === 'streamer' ? streamers.find(s => s.id === platform.hostId)?.name : getEmployeeName(platform.hostId))
            : undefined;
        }
      }
    }

    const order: SalesOrderRecord = {
      id: `so_${Date.now()}`,
      code: `SO-2025-${String(nextNumber).padStart(4, '0')}`,
      customer: customerName,
      customerType: customerType as CustomerType,
      product: selectedProduct.name,
      teaCategory: categoryToTeaCategory(selectedProduct.category),
      quantity: `${qtyNum} ${selectedProduct.packageUnit}`,
      unitPrice: `¥${actualNum}/${selectedProduct.packageUnit}`,
      amount: formatMoney(amountNum),
      date: orderDate,
      status: OrderStatus.PENDING,
      contactPerson: contactPerson || '—',
      contactPhone: contactPhone || '—',
      deliveryAddress: deliveryAddress || '—',
      remark,
      followerId: followerId || undefined,
      followerType: (followerType || undefined) as 'employee' | 'streamer' | undefined,
      followerName,
      hostId: orderHostId,
      hostType: orderHostType,
      hostName: orderHostName,
      scenario: getScenarioByType(customerType as CustomerType),
      products: [{
        productId: selectedProduct.id,
        name: `${selectedProduct.name} — ${selectedProduct.grade}`,
        teaCategory: categoryToTeaCategory(selectedProduct.category),
        quantity: `${qtyNum} ${selectedProduct.packageUnit}`,
        marketPrice,
        defaultPrice,
        actualSalesPrice: actualNum,
        priceSource,
        amount: formatMoney(amountNum),
      }],
      timeline: [{ time: timeStr, event: '客户下单', operator: '系统' }],
    };
    onSave(order);
  };

  // 只读价格展示框样式
  const readOnlyPriceStyle: React.CSSProperties = {
    height: 34, display: 'flex', alignItems: 'center', padding: '0 var(--space-3)',
    border: '1px solid var(--color-border-primary)', borderRadius: 'var(--radius-md)',
    background: 'var(--color-bg-tertiary)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)',
  };

  // 只读文本框样式（客户类型反显）
  const readOnlyFieldStyle: React.CSSProperties = {
    height: 34, display: 'flex', alignItems: 'center', padding: '0 var(--space-3)',
    border: '1px solid var(--color-border-primary)', borderRadius: 'var(--radius-md)',
    background: 'var(--color-bg-tertiary)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)',
  };

  return (
    <div className="drawer-overlay" onClick={onCancel}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()} style={{ width: 680 }}>
        <div className="drawer-header">
          <span className="drawer-title">新建销售单</span>
          <button className="drawer-close" onClick={onCancel}>
            <svg viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </button>
        </div>

        <div className="drawer-body">
          {/* 客户与商品 */}
          <div className="drawer-section-title">客户与商品</div>
          <div className="drawer-form-row">
            <div className="drawer-form-field" style={{ flex: 2 }}>
              <label className="drawer-label">选择客户 *</label>
              <div style={{ position: 'relative' }}>
                <input
                  className="filter-input"
                  style={{ width: '100%', paddingRight: 28 }}
                  value={isNewCustomer ? '新客户' : (allCustomerOptions.find(c => c.id === customerId)?.name || customerSearch)}
                  onChange={(e) => { setCustomerSearch(e.target.value); setShowCustomerDropdown(true); if (e.target.value === '') { setCustomerId(''); setIsNewCustomer(false); } }}
                  onFocus={() => setShowCustomerDropdown(true)}
                  placeholder="搜索或选择客户"
                />
                {(customerId || isNewCustomer || customerSearch) && (
                  <button type="button" onClick={handleClearCustomer} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--color-neutral-400)', fontSize: 16, lineHeight: 1, padding: 0 }}>×</button>
                )}
                {showCustomerDropdown && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, maxHeight: 240, overflowY: 'auto', background: '#fff', border: '1px solid var(--color-border-primary)', borderRadius: 'var(--radius-md)', zIndex: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                    <div style={{ padding: '8px 12px', cursor: 'pointer', fontWeight: 500, color: '#0F64B5', borderBottom: '1px solid var(--color-border-secondary)' }} onClick={() => handleSelectCustomer('new')}>+ 新客户</div>
                    {filteredCustomers.map(c => (
                      <div key={c.id} style={{ padding: '8px 12px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }} onClick={() => handleSelectCustomer(c.id)}>
                        <span>{c.name}</span>
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{GLOBAL_CUSTOMER_LABELS[c.type]}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {isNewCustomer && (
              <div className="drawer-form-field">
                <label className="drawer-label">客户类型 *</label>
                <select className="filter-select" style={{ width: '100%' }} value={customerType} onChange={(e) => setCustomerType(e.target.value as CustomerType)}>
                  <option value="">请选择客户类型</option>
                  {CUSTOMER_TYPE_DROPDOWN_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
            )}
          </div>
          {isNewCustomer && (
            <div className="drawer-form-row">
              <div className="drawer-form-field">
                <label className="drawer-label">客户简称 *</label>
                <input className="filter-input" style={{ width: '100%' }} value={newCustomerShortName} onChange={(e) => setNewCustomerShortName(e.target.value)} placeholder="请输入客户简称（将同步至客户管理）" />
              </div>
            </div>
          )}
          {selectedCustomerInfo && (
            <div style={{ display: 'flex', gap: 'var(--space-4)', padding: 'var(--space-3) var(--space-4)', background: 'var(--color-module-current-lightest)', border: '1px solid var(--color-module-current-light)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-4)', fontSize: 'var(--text-sm)' }}>
              <div><span style={{ color: 'var(--color-text-tertiary)' }}>主办人：</span><span style={{ fontWeight: 'var(--font-medium)' }}>{selectedCustomerInfo.hostName}</span></div>
              <div><span style={{ color: 'var(--color-text-tertiary)' }}>联系人：</span>{selectedCustomerInfo.contactPerson}</div>
              <div><span style={{ color: 'var(--color-text-tertiary)' }}>联系电话：</span>{selectedCustomerInfo.contactPhone}</div>
              <div><span style={{ color: 'var(--color-text-tertiary)' }}>等级：</span>{selectedCustomerInfo.level}</div>
            </div>
          )}
          <div className="drawer-form-row">
            <div className="drawer-form-field">
              <label className="drawer-label">商品 *</label>
              <select className="filter-select" style={{ width: '100%' }} value={productId} onChange={(e) => setProductId(e.target.value)}>
                <option value="">请选择商品</option>
                {teaProducts.map((p) => <option key={p.id} value={p.id}>{p.name}（{p.brand}）</option>)}
              </select>
            </div>
          </div>
          {selectedProduct && (
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-3)' }}>
              规格：{selectedProduct.spec} · 品牌：{selectedProduct.brand} · 包装单位：{selectedProduct.packageUnit}
            </div>
          )}

          {/* 价格信息 */}
          <div className="drawer-section-title">价格信息</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
            <div>
              <label className="drawer-label">市场价</label>
              <div style={readOnlyPriceStyle} className="mono">{marketPrice ? formatMoney(marketPrice) : '—'}</div>
            </div>
            <div>
              <label className="drawer-label">默认价（带来源）</label>
              <div style={{ ...readOnlyPriceStyle, gap: 'var(--space-2)' }}>
                <span className="mono">{defaultPrice ? formatMoney(defaultPrice) : '—'}</span>
                {defaultPrice > 0 && (
                  <span style={{
                    padding: '0 6px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-medium)',
                    background: 'var(--color-neutral-0)', color: SOURCE_COLORS[priceSource], border: `1px solid ${SOURCE_COLORS[priceSource]}30`,
                  }}>{SOURCE_LABELS[priceSource]}</span>
                )}
              </div>
            </div>
            <div>
              <label className="drawer-label">销售实价（可调整）*</label>
              <input
                type="number"
                className="filter-input"
                style={{
                  width: '100%', height: 34,
                  borderColor: 'var(--color-module-current-base)',
                  background: 'var(--color-module-current-lightest)',
                  fontWeight: 'var(--font-semibold)',
                  color: 'var(--color-module-current-base)',
                }}
                value={actualSalesPrice}
                onChange={(e) => setActualSalesPrice(e.target.value)}
                placeholder="0"
                disabled={!productId || !hasCustomer}
              />
            </div>
          </div>
          <div className="drawer-form-row">
            <div className="drawer-form-field">
              <label className="drawer-label">数量 *</label>
              <input
                type="number"
                className="filter-input"
                style={{ width: '100%' }}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="请输入数量"
              />
            </div>
            <div className="drawer-form-field">
              <label className="drawer-label">金额（自动计算）</label>
              <div
                className="mono"
                style={{
                  height: 34, display: 'flex', alignItems: 'center', padding: '0 var(--space-3)',
                  border: '1px solid var(--color-module-current-base)', borderRadius: 'var(--radius-md)',
                  background: 'var(--color-module-current-lightest)', fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-bold)', color: 'var(--color-module-current-base)',
                }}
              >
                {amountNum > 0 ? formatMoney(amountNum) : '—'}
              </div>
            </div>
          </div>

          {/* 订单信息 */}
          <div className="drawer-section-title">订单信息</div>
          <div className="drawer-form-row">
            <div className="drawer-form-field">
              <label className="drawer-label">下单日期 *</label>
              <input type="date" className="filter-input" style={{ width: '100%' }} value={orderDate} onChange={(e) => setOrderDate(e.target.value)} />
            </div>
            <div className="drawer-form-field">
              <label className="drawer-label">联系人</label>
              <input className="filter-input" style={{ width: '100%' }} value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} placeholder="请输入联系人" />
            </div>
          </div>
          {/* 跟单人 */}
          <div className="drawer-form-row">
            <div className="drawer-form-field" style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'flex-end' }}>
              <div style={{ width: 100 }}>
                <label className="drawer-label">跟单人</label>
                <select className="filter-select" style={{ width: '100%' }} value={followerType} onChange={(e) => { setFollowerType(e.target.value as 'employee' | 'streamer' | ''); setFollowerId(''); }}>
                  <option value="">请选择</option>
                  <option value="employee">员工</option>
                  <option value="streamer">带货人</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                {followerType === 'employee' ? (
                  <DeptEmployeeSelect value={followerId} onChange={setFollowerId} placeholder="选择员工" style={{ width: '100%' }} />
                ) : followerType === 'streamer' ? (
                  <select className="filter-select" style={{ width: '100%' }} value={followerId} onChange={(e) => setFollowerId(e.target.value)}>
                    <option value="">选择带货人</option>
                    {streamers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                ) : (
                  <div style={{ height: 34, display: 'flex', alignItems: 'center', padding: '0 var(--space-3)', border: '1px solid var(--color-border-primary)', borderRadius: 'var(--radius-md)', background: 'var(--color-bg-tertiary)', fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>请先选择类型</div>
                )}
              </div>
            </div>
          </div>
          <div className="drawer-form-row">
            <div className="drawer-form-field">
              <label className="drawer-label">联系电话</label>
              <input className="filter-input" style={{ width: '100%' }} value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="请输入联系电话" />
            </div>
            <div className="drawer-form-field">
              <label className="drawer-label">收货地址</label>
              <input className="filter-input" style={{ width: '100%' }} value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} placeholder="请输入收货地址" />
            </div>
          </div>
          <div className="drawer-form-row">
            <div className="drawer-form-field" style={{ flex: 1 }}>
              <label className="drawer-label">备注</label>
              <input className="filter-input" style={{ width: '100%' }} value={remark} onChange={(e) => setRemark(e.target.value)} placeholder="选填" />
            </div>
          </div>
        </div>

        <div className="drawer-footer">
          <Button variant="ghost" onClick={onCancel}>取消</Button>
          <Button onClick={handleSave} disabled={!canSave}>确认下单</Button>
        </div>
      </div>
    </div>
  );
}

function PlusIcon() {
  return <svg viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
}
