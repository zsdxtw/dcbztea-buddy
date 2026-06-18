import { useState } from 'react';
import ContentHeader from '../../components/layout/ContentHeader';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Tag from '../../components/common/Tag';
import Button from '../../components/common/Button';
import StatusTag, { orderStatusToVariant, orderStatusLabel } from '../../components/common/StatusTag';
import FilterBar, { FilterInput, FilterSelect } from '../../components/business/FilterBar';
import { TeaCategory, OrderStatus } from '../../types';

/* ── 客户类型 ── */
type CustomerType = 'direct' | 'channel' | 'platform';

const CUSTOMER_TYPE_LABELS: Record<CustomerType, string> = {
  direct: '直营客户',
  channel: '渠道客户',
  platform: '平台客户',
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
  products: { name: string; teaCategory: TeaCategory; quantity: string; unitPrice: string; amount: string }[];
  timeline: { time: string; event: string; operator: string }[];
}

const orderData: SalesOrderRecord[] = [
  {
    id: '1', code: 'SO-2025-0242', customer: '华茗堂茶庄', customerType: 'direct',
    product: '明前龙井', teaCategory: TeaCategory.GREEN, quantity: '30 kg', unitPrice: '¥ 580/50g', amount: '¥ 34,800',
    date: '2025-07-12', status: OrderStatus.PENDING,
    contactPerson: '王经理', contactPhone: '0571-87651234', deliveryAddress: '杭州市西湖区龙井路88号',
    remark: '需冷藏运输，指定顺丰',
    products: [
      { name: '明前龙井 — 特级', teaCategory: TeaCategory.GREEN, quantity: '20 kg', unitPrice: '¥ 580/50g', amount: '¥ 23,200' },
      { name: '碧螺春 — 一级', teaCategory: TeaCategory.GREEN, quantity: '10 kg', unitPrice: '¥ 580/50g', amount: '¥ 11,600' },
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
    products: [
      { name: '金骏眉 — 特级', teaCategory: TeaCategory.RED, quantity: '15 kg', unitPrice: '¥ 1,200/50g', amount: '¥ 36,000' },
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
    products: [
      { name: '凤凰单丛 — 特级', teaCategory: TeaCategory.OOLONG, quantity: '25 kg', unitPrice: '¥ 560/50g', amount: '¥ 28,000' },
      { name: '大红袍 — 特级', teaCategory: TeaCategory.OOLONG, quantity: '15 kg', unitPrice: '¥ 560/50g', amount: '¥ 16,800' },
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
    products: [
      { name: '白毫银针 — 特级', teaCategory: TeaCategory.WHITE, quantity: '20 kg', unitPrice: '¥ 960/50g', amount: '¥ 38,400' },
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
    products: [
      { name: '六堡茶 — 二级', teaCategory: TeaCategory.DARK, quantity: '30 kg', unitPrice: '¥ 180/50g', amount: '¥ 10,800' },
      { name: '熟普洱 — 三级', teaCategory: TeaCategory.DARK, quantity: '20 kg', unitPrice: '¥ 180/50g', amount: '¥ 7,200' },
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
    products: [
      { name: '君山银针 — 特级', teaCategory: TeaCategory.YELLOW, quantity: '10 kg', unitPrice: '¥ 880/50g', amount: '¥ 17,600' },
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
    products: [
      { name: '正山小种 — 特级', teaCategory: TeaCategory.RED, quantity: '25 kg', unitPrice: '¥ 480/50g', amount: '¥ 24,000' },
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
    products: [
      { name: '铁观音 — 一级', teaCategory: TeaCategory.OOLONG, quantity: '40 kg', unitPrice: '¥ 320/50g', amount: '¥ 25,600' },
      { name: '铁观音 — 二级', teaCategory: TeaCategory.OOLONG, quantity: '20 kg', unitPrice: '¥ 320/50g', amount: '¥ 12,800' },
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
    products: [
      { name: '祁门红茶 — 特级', teaCategory: TeaCategory.RED, quantity: '35 kg', unitPrice: '¥ 520/50g', amount: '¥ 36,400' },
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
    products: [
      { name: '玫瑰花茶 — 一级', teaCategory: TeaCategory.FLOWER, quantity: '20 kg', unitPrice: '¥ 128/50g', amount: '¥ 5,120' },
    ],
    timeline: [
      { time: '2025-07-03 10:00', event: '客户下单', operator: '系统' },
      { time: '2025-07-03 14:00', event: '客户取消', operator: '客户' },
    ],
  },
];

export default function SalesOrders() {
  const [showDetail, setShowDetail] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<SalesOrderRecord | null>(null);

  const handleView = (order: SalesOrderRecord) => {
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
        title="销售订单"
        breadcrumbs={['销售', '销售订单']}
        actions={<Button><PlusIcon />新建销售单</Button>}
      />
      <div className="content-body">
        <FilterBar>
          <FilterInput placeholder="搜索订单编号、客户..." />
          <FilterSelect options={['全部状态', '待审核', '待确认', '运输中', '已完成', '已取消']} />
          <FilterSelect options={['全部茶类', '绿茶', '白茶', '黄茶', '青茶', '红茶', '黑茶', '花草茶']} />
          <FilterSelect options={['全部客户类型', '直营客户', '渠道客户', '平台客户']} />
          <FilterSelect options={['全部时间', '今日', '本周', '本月', '近3月']} />
        </FilterBar>

        <Card>
          <Table
            headers={['订单编号', '客户', '客户类型', '商品', '茶类', '数量', '单价', '金额', '下单日期', '状态', '操作']}
            rows={orderData.map((o) => [
              <span className="mono">{o.code}</span>,
              o.customer,
              <span style={{
                padding: '1px 8px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-medium)',
                background: o.customerType === 'direct' ? '#E3F2FD' : o.customerType === 'channel' ? '#FFF3E0' : '#E8F5E9',
                color: o.customerType === 'direct' ? '#1565C0' : o.customerType === 'channel' ? '#E65100' : '#2E7D32',
                border: `1px solid ${o.customerType === 'direct' ? '#90CAF9' : o.customerType === 'channel' ? '#FFCC80' : '#A5D6A7'}`,
              }}>{CUSTOMER_TYPE_LABELS[o.customerType]}</span>,
              o.product,
              <Tag category={o.teaCategory} />,
              <span className="mono">{o.quantity}</span>,
              <span className="mono">{o.unitPrice}</span>,
              <span className="mono">{o.amount}</span>,
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{o.date}</span>,
              <StatusTag variant={orderStatusToVariant(o.status)} label={orderStatusLabel(o.status)} />,
              <Button size="sm" variant="ghost" onClick={() => handleView(o)}>查看</Button>,
            ])}
          />
        </Card>
      </div>

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
                    <span style={{
                      padding: '1px 8px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-medium)',
                      background: selectedOrder.customerType === 'direct' ? '#E3F2FD' : selectedOrder.customerType === 'channel' ? '#FFF3E0' : '#E8F5E9',
                      color: selectedOrder.customerType === 'direct' ? '#1565C0' : selectedOrder.customerType === 'channel' ? '#E65100' : '#2E7D32',
                      border: `1px solid ${selectedOrder.customerType === 'direct' ? '#90CAF9' : selectedOrder.customerType === 'channel' ? '#FFCC80' : '#A5D6A7'}`,
                    }}>{CUSTOMER_TYPE_LABELS[selectedOrder.customerType]}</span>
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
                        <th>单价</th>
                        <th>金额</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.products.map((p, i) => (
                        <tr key={i}>
                          <td style={{ fontWeight: 'var(--font-medium)' }}>{p.name}</td>
                          <td><Tag category={p.teaCategory} /></td>
                          <td className="mono">{p.quantity}</td>
                          <td className="mono">{p.unitPrice}</td>
                          <td className="mono">{p.amount}</td>
                        </tr>
                      ))}
                      <tr style={{ fontWeight: 'var(--font-semibold)' }}>
                        <td colSpan={4} style={{ textAlign: 'right', color: 'var(--color-text-secondary)' }}>合计</td>
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

function PlusIcon() {
  return <svg viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
}
