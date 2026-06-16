import { useState } from 'react';
import ContentHeader from '../../components/layout/ContentHeader';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import StatusTag from '../../components/common/StatusTag';
import FilterBar, { FilterInput, FilterSelect } from '../../components/business/FilterBar';
import type { StatCardData } from '../../types';

/* ── 统计卡片数据 ── */
const stats: StatCardData[] = [
  {
    label: '退货单数',
    value: '12',
    trend: { direction: 'down', value: '3单', label: '较上月' },
    icon: (
      <svg viewBox="0 0 18 18" fill="none">
        <path d="M3 6h12l-1.2 8H4.2L3 6z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
        <path d="M7 10l3 3M10 10l-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: '退货金额',
    value: '45,680',
    unit: '¥',
    trend: { direction: 'down', value: '8.5%' },
    icon: (
      <svg viewBox="0 0 18 18" fill="none">
        <rect x="2" y="4" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.3" />
        <path d="M5 8h2M5 11h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: '待处理',
    value: '3',
    trend: { direction: 'up', value: '需及时处理' },
    icon: (
      <svg viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.3" />
        <path d="M9 6v4M9 12.5v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: '本月退货率',
    value: '2.1',
    unit: '%',
    trend: { direction: 'down', value: '0.3%' },
    icon: (
      <svg viewBox="0 0 18 18" fill="none">
        <path d="M3 14l3-4 3 2 3-5 3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

/* ── 退货数据类型 ── */
interface ReturnRecord {
  id: string;
  originalOrder: string;
  supplier: string;
  product: string;
  quantity: string;
  amount: string;
  reason: string;
  status: 'pending' | 'approved' | 'completed' | 'rejected';
  /** 详情字段 */
  returnDate: string;
  originalOrderDate: string;
  originalAmount: string;
  contactPerson: string;
  contactPhone: string;
  reasonDetail: string;
  handler: string;
  handleDate: string;
  remark: string;
}

/* ── Mock 数据 ── */
const returnItems: ReturnRecord[] = [
  {
    id: 'RT-2025-0012', originalOrder: 'PO-2025-0148', supplier: '福鼎白茶厂', product: '白牡丹 — 一级',
    quantity: '10 kg', amount: '¥8,200', reason: '质检不合格', status: 'pending',
    returnDate: '2025-06-12', originalOrderDate: '2025-05-28', originalAmount: '¥24,600',
    contactPerson: '林芳', contactPhone: '1385933****',
    reasonDetail: '到货白牡丹经质检发现含水量超标（12.3%，标准≤8%），部分茶叶有霉变迹象，不符合入库标准。',
    handler: '—', handleDate: '—', remark: '已联系供应商协商处理方案',
  },
  {
    id: 'RT-2025-0011', originalOrder: 'PO-2025-0145', supplier: '安溪铁观音集团', product: '清香铁观音 — 二级',
    quantity: '20 kg', amount: '¥4,200', reason: '规格不符', status: 'approved',
    returnDate: '2025-06-10', originalOrderDate: '2025-05-25', originalAmount: '¥12,600',
    contactPerson: '陈志强', contactPhone: '1390595****',
    reasonDetail: '采购订单要求250g铝箔袋装，实际到货为200g铁罐装，包装规格与订单约定不一致，无法正常上架销售。',
    handler: '王明', handleDate: '2025-06-11', remark: '供应商已确认，安排退货物流',
  },
  {
    id: 'RT-2025-0010', originalOrder: 'PO-2025-0142', supplier: '云南普洱茶业', product: '熟普洱 — 三级',
    quantity: '30 kg', amount: '¥11,400', reason: '包装破损', status: 'completed',
    returnDate: '2025-06-08', originalOrderDate: '2025-05-20', originalAmount: '¥34,200',
    contactPerson: '张伟', contactPhone: '1388765****',
    reasonDetail: '运输途中外箱严重挤压变形，内包装破损12箱，茶叶受潮无法销售，已拍照取证并签收异常确认。',
    handler: '李华', handleDate: '2025-06-09', remark: '退货已完成，退款已到账',
  },
  {
    id: 'RT-2025-0009', originalOrder: 'PO-2025-0139', supplier: '武夷山茶业', product: '大红袍 — 特级',
    quantity: '5 kg', amount: '¥2,850', reason: '水分超标', status: 'completed',
    returnDate: '2025-06-05', originalOrderDate: '2025-05-18', originalAmount: '¥8,550',
    contactPerson: '黄建', contactPhone: '1375998****',
    reasonDetail: '大红袍到货检测水分含量9.8%，超出国标GB/T 18745-2006规定的6.5%上限，存在品质风险。',
    handler: '李华', handleDate: '2025-06-06', remark: '退货完成，供应商已补发合格品',
  },
  {
    id: 'RT-2025-0008', originalOrder: 'PO-2025-0135', supplier: '西湖龙井合作社', product: '明前龙井 — 特级',
    quantity: '8 kg', amount: '¥5,600', reason: '感官不达标', status: 'rejected',
    returnDate: '2025-06-03', originalOrderDate: '2025-05-15', originalAmount: '¥16,800',
    contactPerson: '孙明', contactPhone: '1355718****',
    reasonDetail: '审评发现汤色偏黄、香气不足，与明前龙井特级标准存在差距，品控判定为感官不达标。',
    handler: '王明', handleDate: '2025-06-04', remark: '供应商申诉中，需提供产地证明复核',
  },
  {
    id: 'RT-2025-0007', originalOrder: 'PO-2025-0130', supplier: '福鼎白茶厂', product: '白毫银针 — 特级',
    quantity: '3 kg', amount: '¥6,780', reason: '农残超标', status: 'pending',
    returnDate: '2025-06-01', originalOrderDate: '2025-05-10', originalAmount: '¥20,340',
    contactPerson: '林芳', contactPhone: '1385933****',
    reasonDetail: '第三方检测报告显示联苯菊酯残留量0.08mg/kg，超出GB 2763-2021限量标准0.05mg/kg，存在食品安全风险。',
    handler: '—', handleDate: '—', remark: '已暂停该供应商后续采购，等待复检结果',
  },
  {
    id: 'RT-2025-0006', originalOrder: 'PO-2025-0128', supplier: '云南普洱茶业', product: '六堡茶 — 二级',
    quantity: '15 kg', amount: '¥2,700', reason: '到货延迟', status: 'approved',
    returnDate: '2025-05-28', originalOrderDate: '2025-05-05', originalAmount: '¥8,100',
    contactPerson: '张伟', contactPhone: '1388765****',
    reasonDetail: '订单约定5月20日前到货，实际6月2日才到，延迟13天，已错过端午促销档期，库存积压风险增大。',
    handler: '王明', handleDate: '2025-05-29', remark: '供应商承担退货物流费用',
  },
  {
    id: 'RT-2025-0005', originalOrder: 'PO-2025-0125', supplier: '安溪铁观音集团', product: '铁观音 — 一级',
    quantity: '25 kg', amount: '¥4,250', reason: '口味异常', status: 'pending',
    returnDate: '2025-05-25', originalOrderDate: '2025-05-01', originalAmount: '¥12,750',
    contactPerson: '陈志强', contactPhone: '1390595****',
    reasonDetail: '冲泡后有明显烟焦味，与铁观音一级标准香气不符，疑似加工过程中温度控制异常，品控建议退货。',
    handler: '—', handleDate: '—', remark: '等待供应商取样确认',
  },
];

/* ── 状态映射 ── */
function returnStatusToVariant(status: string) {
  switch (status) {
    case 'pending': return 'warning' as const;
    case 'approved': return 'info' as const;
    case 'completed': return 'success' as const;
    case 'rejected': return 'error' as const;
    default: return 'default' as const;
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

/* ── 主组件 ── */
export default function PurchaseReturn() {
  const [showDetail, setShowDetail] = useState(false);
  const [selectedReturn, setSelectedReturn] = useState<ReturnRecord | null>(null);

  const handleView = (item: ReturnRecord) => {
    setSelectedReturn(item);
    setShowDetail(true);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setSelectedReturn(null);
  };

  return (
    <>
      <ContentHeader
        title="采购退货"
        breadcrumbs={['采购', '采购退货']}
        actions={
          <>
            <Button variant="ghost">导出</Button>
            <Button><PlusIcon />新建退货单</Button>
          </>
        }
      />
      <div className="content-body">
        {/* 统计卡片 */}
        <div className="stat-cards">
          {stats.map((s, i) => <StatCard key={i} data={s} />)}
        </div>

        {/* 筛选栏 */}
        <FilterBar>
          <FilterInput placeholder="搜索退货单号、供应商..." />
          <FilterSelect options={['全部状态', '待处理', '已审批', '已退货', '已驳回']} />
          <FilterSelect options={['全部供应商', '武夷山茶业', '西湖龙井合作社', '安溪铁观音集团', '福鼎白茶厂', '云南普洱茶业']} />
          <FilterSelect options={['全部时间', '今日', '本周', '本月', '近3月']} />
        </FilterBar>

        {/* 退货列表 */}
        <Card>
          <Table
            headers={['退货单号', '原采购单号', '供应商', '商品', '退货数量', '退货金额', '退货原因', '状态', '操作']}
            rows={returnItems.map((r) => [
              <span className="mono">{r.id}</span>,
              <span className="mono">{r.originalOrder}</span>,
              r.supplier,
              r.product,
              <span className="mono">{r.quantity}</span>,
              <span className="mono">{r.amount}</span>,
              r.reason,
              <StatusTag variant={returnStatusToVariant(r.status)} label={returnStatusLabel(r.status)} />,
              <Button size="sm" variant="ghost" onClick={() => handleView(r)}>查看</Button>,
            ])}
          />
        </Card>
      </div>

      {/* 退货详情抽屉 */}
      {showDetail && selectedReturn && (
        <div className="drawer-overlay" onClick={handleCloseDetail}>
          <div className="drawer-panel" onClick={(e) => e.stopPropagation()} style={{ width: 680 }}>
            {/* 头部 */}
            <div className="drawer-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flex: 1 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 'var(--radius-lg)',
                  background: 'var(--color-module-current-lightest)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 'var(--text-base)', fontWeight: 'var(--font-bold)',
                  color: 'var(--color-module-current-base)', flexShrink: 0,
                }}>
                  <svg viewBox="0 0 18 18" fill="none" style={{ width: 20, height: 20 }}>
                    <path d="M3 6h12l-1.2 8H4.2L3 6z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
                    <path d="M7 10l3 3M10 10l-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                  </svg>
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <span className="drawer-title">{selectedReturn.id}</span>
                    <StatusTag variant={returnStatusToVariant(selectedReturn.status)} label={returnStatusLabel(selectedReturn.status)} />
                  </div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginTop: 2 }}>
                    退货日期：{selectedReturn.returnDate}
                  </div>
                </div>
              </div>
              <button className="drawer-close" onClick={handleCloseDetail}>
                <svg viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
              </button>
            </div>

            <div className="drawer-body">
              {/* 退货信息 */}
              <div className="drawer-section-title">退货信息</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                <div>
                  <label className="drawer-label">退货单号</label>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', fontWeight: 'var(--font-medium)' }}>{selectedReturn.id}</div>
                </div>
                <div>
                  <label className="drawer-label">退货日期</label>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', fontWeight: 'var(--font-medium)' }}>{selectedReturn.returnDate}</div>
                </div>
                <div>
                  <label className="drawer-label">供应商</label>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', fontWeight: 'var(--font-medium)' }}>{selectedReturn.supplier}</div>
                </div>
                <div>
                  <label className="drawer-label">联系人</label>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', fontWeight: 'var(--font-medium)' }}>{selectedReturn.contactPerson} {selectedReturn.contactPhone}</div>
                </div>
                <div>
                  <label className="drawer-label">退货商品</label>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', fontWeight: 'var(--font-medium)' }}>{selectedReturn.product}</div>
                </div>
                <div>
                  <label className="drawer-label">退货数量</label>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', fontWeight: 'var(--font-medium)' }}>{selectedReturn.quantity}</div>
                </div>
                <div>
                  <label className="drawer-label">退货金额</label>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-module-current-base)', fontWeight: 'var(--font-semibold)' }}>{selectedReturn.amount}</div>
                </div>
                <div>
                  <label className="drawer-label">退货原因</label>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', fontWeight: 'var(--font-medium)' }}>{selectedReturn.reason}</div>
                </div>
              </div>

              {/* 原采购单信息 */}
              <div className="drawer-section-title">原采购单信息</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                <div>
                  <label className="drawer-label">原采购单号</label>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', fontWeight: 'var(--font-medium)' }}>{selectedReturn.originalOrder}</div>
                </div>
                <div>
                  <label className="drawer-label">采购日期</label>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', fontWeight: 'var(--font-medium)' }}>{selectedReturn.originalOrderDate}</div>
                </div>
                <div>
                  <label className="drawer-label">原采购金额</label>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', fontWeight: 'var(--font-medium)' }}>{selectedReturn.originalAmount}</div>
                </div>
                <div>
                  <label className="drawer-label">退货占比</label>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', fontWeight: 'var(--font-medium)' }}>
                    {(() => {
                      const retAmt = parseFloat(selectedReturn.amount.replace(/[¥,]/g, ''));
                      const origAmt = parseFloat(selectedReturn.originalAmount.replace(/[¥,]/g, ''));
                      return origAmt > 0 ? `${(retAmt / origAmt * 100).toFixed(1)}%` : '—';
                    })()}
                  </div>
                </div>
              </div>

              {/* 退货原因详情 */}
              <div className="drawer-section-title">退货原因详情</div>
              <div style={{
                background: 'var(--color-bg-tertiary)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-4)',
                marginBottom: 'var(--space-4)',
              }}>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', lineHeight: 1.6 }}>
                  {selectedReturn.reasonDetail}
                </div>
              </div>

              {/* 处理信息 */}
              <div className="drawer-section-title">处理信息</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                <div>
                  <label className="drawer-label">处理人</label>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', fontWeight: 'var(--font-medium)' }}>{selectedReturn.handler}</div>
                </div>
                <div>
                  <label className="drawer-label">处理日期</label>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', fontWeight: 'var(--font-medium)' }}>{selectedReturn.handleDate}</div>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="drawer-label">备注</label>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', fontWeight: 'var(--font-medium)' }}>{selectedReturn.remark}</div>
                </div>
              </div>
            </div>

            <div className="drawer-footer">
              <Button variant="ghost" onClick={handleCloseDetail}>关闭</Button>
              {selectedReturn.status === 'pending' && (
                <Button>审批处理</Button>
              )}
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
