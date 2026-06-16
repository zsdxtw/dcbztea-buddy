import { useState } from 'react';
import ContentHeader from '../../components/layout/ContentHeader';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Tag from '../../components/common/Tag';
import StatusTag, { orderStatusToVariant, orderStatusLabel } from '../../components/common/StatusTag';
import FilterBar, { FilterInput, FilterSelect } from '../../components/business/FilterBar';
import { TeaCategory, OrderStatus } from '../../types';
import type { StatCardData } from '../../types';

/* ── 模拟数据 ── */
interface PurchaseOrder {
  id: string;
  code: string;
  supplier: string;
  product: string;
  teaCategory: TeaCategory;
  quantity: string;
  unitPrice: string;
  amount: string;
  orderDate: string;
  deliveryDate: string;
  status: OrderStatus;
  contactPerson: string;
  contactPhone: string;
  remark: string;
  items: { name: string; spec: string; quantity: string; unitPrice: string; amount: string }[];
  timeline: { time: string; event: string }[];
}

const mockOrders: PurchaseOrder[] = [
  {
    id: '1', code: 'PO-2025-0151', supplier: '西湖牌', product: '明前龙井', teaCategory: TeaCategory.GREEN,
    quantity: '80 kg', unitPrice: '¥700', amount: '¥56,000', orderDate: '2025-06-10', deliveryDate: '2025-06-20',
    status: OrderStatus.PENDING, contactPerson: '王建国', contactPhone: '138-0001-1001', remark: '要求明前头采，一级以上',
    items: [
      { name: '明前龙井', spec: '特级 250g/罐', quantity: '200 罐', unitPrice: '¥280', amount: '¥56,000' },
    ],
    timeline: [
      { time: '2025-06-10 09:30', event: '创建采购订单' },
      { time: '2025-06-10 10:15', event: '提交审核' },
    ],
  },
  {
    id: '2', code: 'PO-2025-0150', supplier: '正山堂', product: '金骏眉', teaCategory: TeaCategory.RED,
    quantity: '50 kg', unitPrice: '¥1,200', amount: '¥60,000', orderDate: '2025-06-08', deliveryDate: '2025-06-18',
    status: OrderStatus.APPROVED, contactPerson: '张丽华', contactPhone: '139-0002-2002', remark: '春茶批次，需质检报告',
    items: [
      { name: '金骏眉', spec: '特级 100g/盒', quantity: '300 盒', unitPrice: '¥200', amount: '¥60,000' },
    ],
    timeline: [
      { time: '2025-06-08 14:00', event: '创建采购订单' },
      { time: '2025-06-08 14:30', event: '提交审核' },
      { time: '2025-06-09 09:00', event: '审核通过' },
    ],
  },
  {
    id: '3', code: 'PO-2025-0149', supplier: '八马', product: '清香铁观音', teaCategory: TeaCategory.OOLONG,
    quantity: '60 kg', unitPrice: '¥380', amount: '¥22,800', orderDate: '2025-06-05', deliveryDate: '2025-06-15',
    status: OrderStatus.SHIPPING, contactPerson: '陈志远', contactPhone: '137-0003-3003', remark: '顺丰冷链运输',
    items: [
      { name: '清香铁观音', spec: '一级 250g/袋', quantity: '240 袋', unitPrice: '¥95', amount: '¥22,800' },
    ],
    timeline: [
      { time: '2025-06-05 10:00', event: '创建采购订单' },
      { time: '2025-06-05 11:00', event: '提交审核' },
      { time: '2025-06-06 09:30', event: '审核通过' },
      { time: '2025-06-07 08:00', event: '供应商发货' },
    ],
  },
  {
    id: '4', code: 'PO-2025-0148', supplier: '大益', product: '7542生饼', teaCategory: TeaCategory.DARK,
    quantity: '120 kg', unitPrice: '¥450', amount: '¥54,000', orderDate: '2025-06-03', deliveryDate: '2025-06-13',
    status: OrderStatus.COMPLETED, contactPerson: '李明辉', contactPhone: '136-0004-4004', remark: '2025年春茶批次',
    items: [
      { name: '7542生饼', spec: '357g/饼 7饼/提', quantity: '48 提', unitPrice: '¥1,125', amount: '¥54,000' },
    ],
    timeline: [
      { time: '2025-06-03 09:00', event: '创建采购订单' },
      { time: '2025-06-03 10:00', event: '提交审核' },
      { time: '2025-06-04 09:00', event: '审核通过' },
      { time: '2025-06-05 14:00', event: '供应商发货' },
      { time: '2025-06-10 11:00', event: '已签收入库' },
    ],
  },
  {
    id: '5', code: 'PO-2025-0147', supplier: '品品香', product: '白毫银针', teaCategory: TeaCategory.WHITE,
    quantity: '30 kg', unitPrice: '¥1,800', amount: '¥54,000', orderDate: '2025-06-01', deliveryDate: '2025-06-11',
    status: OrderStatus.COMPLETED, contactPerson: '赵伟', contactPhone: '135-0005-5005', remark: '头采银针，需冷链',
    items: [
      { name: '白毫银针', spec: '特级 100g/罐', quantity: '300 罐', unitPrice: '¥180', amount: '¥54,000' },
    ],
    timeline: [
      { time: '2025-06-01 11:00', event: '创建采购订单' },
      { time: '2025-06-01 14:00', event: '提交审核' },
      { time: '2025-06-02 09:00', event: '审核通过' },
      { time: '2025-06-03 08:30', event: '供应商发货' },
      { time: '2025-06-08 10:00', event: '已签收入库' },
    ],
  },
  {
    id: '6', code: 'PO-2025-0146', supplier: '西湖牌', product: '雨前龙井', teaCategory: TeaCategory.GREEN,
    quantity: '100 kg', unitPrice: '¥520', amount: '¥52,000', orderDate: '2025-05-28', deliveryDate: '2025-06-07',
    status: OrderStatus.PENDING, contactPerson: '王建国', contactPhone: '138-0001-1001', remark: '雨前二级，日常备货',
    items: [
      { name: '雨前龙井', spec: '二级 500g/袋', quantity: '200 袋', unitPrice: '¥260', amount: '¥52,000' },
    ],
    timeline: [
      { time: '2025-05-28 16:00', event: '创建采购订单' },
    ],
  },
  {
    id: '7', code: 'PO-2025-0145', supplier: '正山堂', product: '正山小种', teaCategory: TeaCategory.RED,
    quantity: '70 kg', unitPrice: '¥680', amount: '¥47,600', orderDate: '2025-05-25', deliveryDate: '2025-06-04',
    status: OrderStatus.APPROVED, contactPerson: '张丽华', contactPhone: '139-0002-2002', remark: '传统松烟香工艺',
    items: [
      { name: '正山小种', spec: '一级 250g/罐', quantity: '280 罐', unitPrice: '¥170', amount: '¥47,600' },
    ],
    timeline: [
      { time: '2025-05-25 10:30', event: '创建采购订单' },
      { time: '2025-05-25 11:00', event: '提交审核' },
      { time: '2025-05-26 14:00', event: '审核通过' },
    ],
  },
  {
    id: '8', code: 'PO-2025-0144', supplier: '八马', product: '浓香铁观音', teaCategory: TeaCategory.OOLONG,
    quantity: '90 kg', unitPrice: '¥320', amount: '¥28,800', orderDate: '2025-05-22', deliveryDate: '2025-06-01',
    status: OrderStatus.SHIPPING, contactPerson: '陈志远', contactPhone: '137-0003-3003', remark: '浓香型，焙火足',
    items: [
      { name: '浓香铁观音', spec: '一级 250g/盒', quantity: '360 盒', unitPrice: '¥80', amount: '¥28,800' },
    ],
    timeline: [
      { time: '2025-05-22 09:00', event: '创建采购订单' },
      { time: '2025-05-22 10:00', event: '提交审核' },
      { time: '2025-05-23 09:30', event: '审核通过' },
      { time: '2025-05-24 08:00', event: '供应商发货' },
    ],
  },
  {
    id: '9', code: 'PO-2025-0143', supplier: '大益', product: '熟普洱散茶', teaCategory: TeaCategory.DARK,
    quantity: '200 kg', unitPrice: '¥280', amount: '¥56,000', orderDate: '2025-05-18', deliveryDate: '2025-05-28',
    status: OrderStatus.COMPLETED, contactPerson: '李明辉', contactPhone: '136-0004-4004', remark: '宫廷级散茶，大包装',
    items: [
      { name: '熟普洱散茶', spec: '宫廷级 1kg/袋', quantity: '200 袋', unitPrice: '¥280', amount: '¥56,000' },
    ],
    timeline: [
      { time: '2025-05-18 13:00', event: '创建采购订单' },
      { time: '2025-05-18 14:00', event: '提交审核' },
      { time: '2025-05-19 10:00', event: '审核通过' },
      { time: '2025-05-20 09:00', event: '供应商发货' },
      { time: '2025-05-25 15:00', event: '已签收入库' },
    ],
  },
  {
    id: '10', code: 'PO-2025-0142', supplier: '品品香', product: '白牡丹', teaCategory: TeaCategory.WHITE,
    quantity: '45 kg', unitPrice: '¥960', amount: '¥43,200', orderDate: '2025-05-15', deliveryDate: '2025-05-25',
    status: OrderStatus.PENDING, contactPerson: '赵伟', contactPhone: '135-0005-5005', remark: '春茶一芽二叶，需提供产地证明',
    items: [
      { name: '白牡丹', spec: '一级 300g/盒', quantity: '150 盒', unitPrice: '¥288', amount: '¥43,200' },
    ],
    timeline: [
      { time: '2025-05-15 11:30', event: '创建采购订单' },
      { time: '2025-05-15 12:00', event: '提交审核' },
    ],
  },
];

/* ── 统计数据 ── */
const stats: StatCardData[] = [
  {
    label: '订单总数', value: '47', unit: '单',
    trend: { direction: 'up', value: '+5单' },
    icon: <svg viewBox="0 0 18 18" fill="none"><rect x="3" y="5" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M3 9h12M7 5V3h4v2" stroke="currentColor" strokeWidth="1.3"/></svg>,
  },
  {
    label: '采购总额', value: '856,200', unit: '¥',
    trend: { direction: 'down', value: '3.2%' },
    icon: <svg viewBox="0 0 18 18" fill="none"><path d="M9 2v14M2 9l7-7 7 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 13a4 4 0 018 0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  },
  {
    label: '待审核', value: '6', unit: '单',
    trend: { direction: 'down', value: '3单' },
    icon: <svg viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.3"/><path d="M9 6v3l2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  },
  {
    label: '运输中', value: '4', unit: '单',
    trend: { direction: 'up', value: '+1单' },
    icon: <svg viewBox="0 0 18 18" fill="none"><path d="M2 13h10V5H2v8zM12 8h3l2 3v2h-5V8z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><circle cx="5.5" cy="14.5" r="1.5" stroke="currentColor" strokeWidth="1.2"/><circle cx="14" cy="14.5" r="1.5" stroke="currentColor" strokeWidth="1.2"/></svg>,
  },
];

export default function PurchaseOrders() {
  const [showDetail, setShowDetail] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);

  const handleView = (order: PurchaseOrder) => {
    setSelectedOrder(order);
    setShowDetail(true);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setSelectedOrder(null);
  };

  return (
    <>
      <ContentHeader
        title="采购订单"
        breadcrumbs={['采购', '采购订单']}
        actions={
          <>
            <Button variant="ghost">
              <svg viewBox="0 0 16 16" fill="none" style={{ width: 14, height: 14 }}><path d="M2 3h4v4H2zM2 9h4v4H2zM8 3h6M8 5h6M8 9h6M8 11h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
              导出
            </Button>
            <Button>
              <PlusIcon />
              新建采购单
            </Button>
          </>
        }
      />
      <div className="content-body">
        {/* 统计卡片 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)', marginBottom: 'var(--space-5)' }}>
          {stats.map((s, i) => <StatCard key={i} data={s} />)}
        </div>

        {/* 筛选栏 */}
        <FilterBar>
          <FilterInput placeholder="搜索订单编号、供应商..." />
          <FilterSelect options={['全部状态', '待审核', '已审核', '运输中', '已完成']} />
          <FilterSelect options={['全部茶类', '绿茶', '白茶', '黄茶', '青茶', '红茶', '黑茶']} />
          <FilterSelect options={['全部供应商', '西湖牌', '正山堂', '八马', '大益', '品品香']} />
          <FilterSelect options={['全部时间', '今日', '本周', '本月', '近3月']} />
        </FilterBar>

        {/* 订单表格 */}
        <Card style={{ padding: 0 }}>
          <Table
            headers={['订单编号', '供应商', '商品', '茶类', '数量', '单价', '金额', '下单日期', '交货日期', '状态', '操作']}
            rows={mockOrders.map((o) => [
              <span className="mono" style={{ fontWeight: 'var(--font-medium)' }}>{o.code}</span>,
              <span>{o.supplier}</span>,
              <span>{o.product}</span>,
              <Tag category={o.teaCategory} />,
              <span className="mono">{o.quantity}</span>,
              <span className="mono">{o.unitPrice}</span>,
              <span className="mono" style={{ fontWeight: 'var(--font-medium)' }}>{o.amount}</span>,
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{o.orderDate}</span>,
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{o.deliveryDate}</span>,
              <StatusTag variant={orderStatusToVariant(o.status)} label={orderStatusLabel(o.status)} />,
              <Button size="sm" variant="ghost" onClick={() => handleView(o)}>查看</Button>,
            ])}
          />
        </Card>
      </div>

      {/* 订单详情抽屉 */}
      {showDetail && selectedOrder && (
        <div className="drawer-overlay" onClick={handleCloseDetail}>
          <div className="drawer-panel" onClick={(e) => e.stopPropagation()} style={{ width: 640 }}>
            <div className="drawer-header">
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 'var(--radius-lg)',
                    background: 'var(--color-module-current-lightest)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)',
                    color: 'var(--color-module-current-base)', flexShrink: 0,
                  }}>
                    PO
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <span className="drawer-title">{selectedOrder.code}</span>
                      <StatusTag variant={orderStatusToVariant(selectedOrder.status)} label={orderStatusLabel(selectedOrder.status)} />
                    </div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginTop: 2 }}>
                      {selectedOrder.supplier} · {selectedOrder.product}
                    </div>
                  </div>
                </div>
              </div>
              <button className="drawer-close" onClick={handleCloseDetail}>
                <svg viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
              </button>
            </div>

            <div className="drawer-body">
              {/* 订单基本信息 */}
              <div className="drawer-section-title">订单信息</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
                <div>
                  <label className="drawer-label">订单编号</label>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', fontWeight: 'var(--font-medium)' }}>{selectedOrder.code}</div>
                </div>
                <div>
                  <label className="drawer-label">供应商</label>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', fontWeight: 'var(--font-medium)' }}>{selectedOrder.supplier}</div>
                </div>
                <div>
                  <label className="drawer-label">下单日期</label>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}>{selectedOrder.orderDate}</div>
                </div>
                <div>
                  <label className="drawer-label">交货日期</label>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}>{selectedOrder.deliveryDate}</div>
                </div>
                <div>
                  <label className="drawer-label">联系人</label>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}>{selectedOrder.contactPerson}</div>
                </div>
                <div>
                  <label className="drawer-label">联系电话</label>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}>{selectedOrder.contactPhone}</div>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="drawer-label">备注</label>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{selectedOrder.remark || '—'}</div>
                </div>
              </div>

              {/* 商品明细 */}
              <div className="drawer-section-title">商品明细</div>
              <div style={{
                marginBottom: 'var(--space-5)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border-primary)',
                overflow: 'hidden',
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
                  <thead>
                    <tr style={{ background: 'var(--color-bg-tertiary)' }}>
                      <th style={{ padding: 'var(--space-2) var(--space-3)', textAlign: 'left', fontWeight: 'var(--font-medium)', color: 'var(--color-text-secondary)' }}>商品名称</th>
                      <th style={{ padding: 'var(--space-2) var(--space-3)', textAlign: 'left', fontWeight: 'var(--font-medium)', color: 'var(--color-text-secondary)' }}>规格</th>
                      <th style={{ padding: 'var(--space-2) var(--space-3)', textAlign: 'right', fontWeight: 'var(--font-medium)', color: 'var(--color-text-secondary)' }}>数量</th>
                      <th style={{ padding: 'var(--space-2) var(--space-3)', textAlign: 'right', fontWeight: 'var(--font-medium)', color: 'var(--color-text-secondary)' }}>单价</th>
                      <th style={{ padding: 'var(--space-2) var(--space-3)', textAlign: 'right', fontWeight: 'var(--font-medium)', color: 'var(--color-text-secondary)' }}>金额</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item, i) => (
                      <tr key={i} style={{ borderTop: '1px solid var(--color-border-primary)' }}>
                        <td style={{ padding: 'var(--space-2) var(--space-3)', fontWeight: 'var(--font-medium)' }}>{item.name}</td>
                        <td style={{ padding: 'var(--space-2) var(--space-3)', color: 'var(--color-text-secondary)' }}>{item.spec}</td>
                        <td style={{ padding: 'var(--space-2) var(--space-3)', textAlign: 'right' }} className="mono">{item.quantity}</td>
                        <td style={{ padding: 'var(--space-2) var(--space-3)', textAlign: 'right' }} className="mono">{item.unitPrice}</td>
                        <td style={{ padding: 'var(--space-2) var(--space-3)', textAlign: 'right', fontWeight: 'var(--font-medium)' }} className="mono">{item.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr style={{ background: 'var(--color-bg-tertiary)', borderTop: '1px solid var(--color-border-primary)' }}>
                      <td colSpan={4} style={{ padding: 'var(--space-2) var(--space-3)', textAlign: 'right', fontWeight: 'var(--font-semibold)' }}>合计</td>
                      <td style={{ padding: 'var(--space-2) var(--space-3)', textAlign: 'right', fontWeight: 'var(--font-bold)', color: 'var(--color-module-current-base)' }} className="mono">{selectedOrder.amount}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* 订单进度 */}
              <div className="drawer-section-title">订单进度</div>
              <div style={{ paddingLeft: 'var(--space-2)' }}>
                {selectedOrder.timeline.map((step, i) => {
                  const isLast = i === selectedOrder.timeline.length - 1;
                  return (
                    <div key={i} style={{ display: 'flex', gap: 'var(--space-3)', paddingBottom: isLast ? 0 : 'var(--space-4)' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                        <div style={{
                          width: 10, height: 10, borderRadius: '50%',
                          background: isLast ? 'var(--color-module-current-base)' : 'var(--color-neutral-300)',
                          border: isLast ? '2px solid var(--color-module-current-base)' : '2px solid var(--color-neutral-300)',
                          flexShrink: 0,
                        }} />
                        {!isLast && <div style={{ width: 2, flex: 1, background: 'var(--color-border-primary)', minHeight: 20 }} />}
                      </div>
                      <div style={{ paddingTop: 0 }}>
                        <div style={{ fontSize: 'var(--text-sm)', fontWeight: isLast ? 'var(--font-semibold)' : 'var(--font-medium)', color: isLast ? 'var(--color-text-primary)' : 'var(--color-text-secondary)' }}>
                          {step.event}
                        </div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginTop: 2 }}>{step.time}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="drawer-footer">
              <Button variant="ghost" onClick={handleCloseDetail}>关闭</Button>
              <Button>审核</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function PlusIcon() {
  return <svg viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>;
}
