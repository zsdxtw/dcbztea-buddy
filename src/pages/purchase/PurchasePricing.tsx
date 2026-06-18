import { useState } from 'react';
import ContentHeader from '../../components/layout/ContentHeader';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Tag from '../../components/common/Tag';
import StatusTag from '../../components/common/StatusTag';
import FilterBar, { FilterInput, FilterSelect } from '../../components/business/FilterBar';
import { TeaCategory } from '../../types';

/* ── 报价状态映射 ── */
type PricingStatus = 'pending' | 'confirmed' | 'rejected' | 'expired';

function pricingStatusToVariant(status: PricingStatus) {
  switch (status) {
    case 'confirmed': return 'success' as const;
    case 'pending': return 'warning' as const;
    case 'rejected': return 'error' as const;
    case 'expired': return 'default' as const;
  }
}

function pricingStatusLabel(status: PricingStatus) {
  switch (status) {
    case 'pending': return '待确认';
    case 'confirmed': return '已确认';
    case 'rejected': return '已驳回';
    case 'expired': return '已过期';
  }
}

/* ── 报价类型 ── */
type PricingType = 'first' | 'adjust' | 'renew';

const PRICING_TYPE_LABELS: Record<PricingType, string> = {
  first: '首次报价',
  adjust: '价格调整',
  renew: '到期续价',
};

/* ── Mock 数据 ── */
interface PricingRecord {
  id: string;
  code: string;
  supplier: string;
  product: string;
  teaCategory: TeaCategory;
  originalPrice: number;
  quotedPrice: number;
  unit: string;
  type: PricingType;
  validFrom: string;
  validTo: string;
  status: PricingStatus;
  contactPerson: string;
  contactPhone: string;
  remark: string;
  history: { date: string; price: number; note: string }[];
}

const pricingRecords: PricingRecord[] = [
  {
    id: '1', code: 'BJ202606001', supplier: '西湖牌', product: '明前龙井', teaCategory: TeaCategory.GREEN,
    originalPrice: 580, quotedPrice: 560, unit: '元/50g', type: 'adjust',
    validFrom: '2026-06-01', validTo: '2026-08-31', status: 'pending',
    contactPerson: '陈经理', contactPhone: '0571-87654321', remark: '新茶季调价，产量增加',
    history: [
      { date: '2025-09-01', price: 580, note: '秋茶报价' },
      { date: '2026-03-15', price: 600, note: '春茶首报' },
      { date: '2026-06-01', price: 560, note: '夏茶调价' },
    ],
  },
  {
    id: '2', code: 'BJ202606002', supplier: '正山堂', product: '金骏眉', teaCategory: TeaCategory.RED,
    originalPrice: 1200, quotedPrice: 1180, unit: '元/50g', type: 'adjust',
    validFrom: '2026-06-01', validTo: '2026-12-31', status: 'confirmed',
    contactPerson: '江总', contactPhone: '0599-5234567', remark: '长期合作优惠',
    history: [
      { date: '2025-06-01', price: 1200, note: '年度报价' },
      { date: '2026-06-01', price: 1180, note: '续约调价' },
    ],
  },
  {
    id: '3', code: 'BJ202606003', supplier: '八马', product: '铁观音', teaCategory: TeaCategory.OOLONG,
    originalPrice: 320, quotedPrice: 320, unit: '元/50g', type: 'renew',
    validFrom: '2026-07-01', validTo: '2027-06-30', status: 'pending',
    contactPerson: '王经理', contactPhone: '0595-2345678', remark: '到期续价，维持原价',
    history: [
      { date: '2025-07-01', price: 320, note: '年度报价' },
      { date: '2026-07-01', price: 320, note: '续价不变' },
    ],
  },
  {
    id: '4', code: 'BJ202606004', supplier: '白牡丹', product: '白毫银针', teaCategory: TeaCategory.WHITE,
    originalPrice: 860, quotedPrice: 890, unit: '元/50g', type: 'adjust',
    validFrom: '2026-06-15', validTo: '2026-12-15', status: 'pending',
    contactPerson: '林总', contactPhone: '0593-5678901', remark: '原料成本上涨',
    history: [
      { date: '2025-06-01', price: 860, note: '年度报价' },
      { date: '2026-06-15', price: 890, note: '成本上调' },
    ],
  },
  {
    id: '5', code: 'BJ202606005', supplier: '君山银针', product: '君山银针', teaCategory: TeaCategory.YELLOW,
    originalPrice: 750, quotedPrice: 720, unit: '元/50g', type: 'first',
    validFrom: '2026-06-10', validTo: '2026-09-10', status: 'confirmed',
    contactPerson: '张经理', contactPhone: '0730-8234567', remark: '首次合作报价',
    history: [
      { date: '2026-06-10', price: 720, note: '首次报价' },
    ],
  },
  {
    id: '6', code: 'BJ202606006', supplier: '白沙溪', product: '天茯茶', teaCategory: TeaCategory.DARK,
    originalPrice: 280, quotedPrice: 265, unit: '元/片', type: 'adjust',
    validFrom: '2026-05-01', validTo: '2026-10-31', status: 'confirmed',
    contactPerson: '刘总', contactPhone: '0737-7234567', remark: '批量采购优惠',
    history: [
      { date: '2025-05-01', price: 280, note: '年度报价' },
      { date: '2026-05-01', price: 265, note: '批量调价' },
    ],
  },
  {
    id: '7', code: 'BJ202606007', supplier: '艺福堂', product: '玫瑰花茶', teaCategory: TeaCategory.FLOWER,
    originalPrice: 128, quotedPrice: 135, unit: '元/50g', type: 'adjust',
    validFrom: '2026-06-01', validTo: '2026-11-30', status: 'rejected',
    contactPerson: '李经理', contactPhone: '0571-8345678', remark: '花材成本上涨，调价过高',
    history: [
      { date: '2025-06-01', price: 128, note: '年度报价' },
      { date: '2026-06-01', price: 135, note: '成本上调' },
    ],
  },
  {
    id: '8', code: 'BJ202606008', supplier: '西湖牌', product: '雨前龙井', teaCategory: TeaCategory.GREEN,
    originalPrice: 380, quotedPrice: 365, unit: '元/50g', type: 'renew',
    validFrom: '2026-07-01', validTo: '2027-06-30', status: 'pending',
    contactPerson: '陈经理', contactPhone: '0571-87654321', remark: '到期续价，小幅下调',
    history: [
      { date: '2025-07-01', price: 380, note: '年度报价' },
      { date: '2026-07-01', price: 365, note: '续价下调' },
    ],
  },
  {
    id: '9', code: 'BJ202606009', supplier: '凤山', product: '凤凰单丛', teaCategory: TeaCategory.OOLONG,
    originalPrice: 450, quotedPrice: 450, unit: '元/50g', type: 'first',
    validFrom: '2026-06-20', validTo: '2026-12-20', status: 'expired',
    contactPerson: '黄经理', contactPhone: '0768-2345678', remark: '报价已过期未确认',
    history: [
      { date: '2026-01-15', price: 450, note: '首次报价' },
    ],
  },
  {
    id: '10', code: 'BJ202606010', supplier: '正山堂', product: '正山小种', teaCategory: TeaCategory.RED,
    originalPrice: 420, quotedPrice: 398, unit: '元/50g', type: 'adjust',
    validFrom: '2026-06-01', validTo: '2026-12-31', status: 'pending',
    contactPerson: '江总', contactPhone: '0599-5234567', remark: '长期合作下调',
    history: [
      { date: '2025-06-01', price: 420, note: '年度报价' },
      { date: '2026-06-01', price: 398, note: '合作优惠' },
    ],
  },
];

/* ── 供应商列表（用于筛选） ── */
const suppliers = ['全部供应商', ...Array.from(new Set(pricingRecords.map(r => r.supplier)))];

/** 采购报（调）价页面 */
export default function PurchasePricing() {
  const [showDrawer, setShowDrawer] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<PricingRecord | null>(null);

  const handleView = (record: PricingRecord) => {
    setSelectedRecord(record);
    setShowDrawer(true);
  };

  const handleCloseDrawer = () => {
    setShowDrawer(false);
    setSelectedRecord(null);
  };

  /** 计算调幅 */
  const calcAdjustment = (original: number, quoted: number) => {
    const diff = ((quoted - original) / original * 100).toFixed(1);
    return Number(diff);
  };

  return (
    <>
      <ContentHeader
        title="采购报（调）价"
        breadcrumbs={['采购', '采购报（调）价']}
        actions={<Button><PlusIcon />新增报价</Button>}
      />
      <div className="content-body">
        <FilterBar>
          <FilterInput placeholder="搜索报价单号、供应商、商品..." />
          <FilterSelect options={['全部类型', '首次报价', '价格调整', '到期续价']} />
          <FilterSelect options={['全部状态', '待确认', '已确认', '已驳回', '已过期']} />
          <FilterSelect options={suppliers} />
        </FilterBar>

        <Card>
          <Table
            headers={['报价单号', '供应商', '商品', '茶类', '原价', '报价', '调幅', '报价类型', '有效期', '状态', '操作']}
            rows={pricingRecords.map((r) => {
              const adj = calcAdjustment(r.originalPrice, r.quotedPrice);
              return [
                <span className="mono">{r.code}</span>,
                r.supplier,
                r.product,
                <Tag category={r.teaCategory} />,
                <span className="mono">¥{r.originalPrice}</span>,
                <span className="mono">¥{r.quotedPrice}</span>,
                <span className="mono" style={{ color: adj > 0 ? '#CB405D' : adj < 0 ? '#01795D' : 'var(--color-text-secondary)' }}>
                  {adj > 0 ? '+' : ''}{adj}%
                </span>,
                <span style={{
                  padding: '1px 8px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'var(--font-medium)',
                  background: r.type === 'first' ? '#E3F2FD' : r.type === 'adjust' ? '#FFF3E0' : '#E8F5E9',
                  color: r.type === 'first' ? '#1565C0' : r.type === 'adjust' ? '#E65100' : '#2E7D32',
                  border: `1px solid ${r.type === 'first' ? '#90CAF9' : r.type === 'adjust' ? '#FFCC80' : '#A5D6A7'}`,
                }}>
                  {PRICING_TYPE_LABELS[r.type]}
                </span>,
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                  {r.validFrom} ~ {r.validTo}
                </span>,
                <StatusTag variant={pricingStatusToVariant(r.status)} label={pricingStatusLabel(r.status)} />,
                <Button size="sm" variant="ghost" onClick={() => handleView(r)}>查看</Button>,
              ];
            })}
          />
        </Card>
      </div>

      {/* 报价详情抽屉 */}
      {showDrawer && selectedRecord && (
        <div className="drawer-overlay" onClick={handleCloseDrawer}>
          <div className="drawer-panel" onClick={e => e.stopPropagation()} style={{ width: 600 }}>
            <div className="drawer-header">
              <span className="drawer-title">报价详情</span>
              <button className="drawer-close" onClick={handleCloseDrawer}>
                <svg viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </button>
            </div>

            <div className="drawer-body">
              {/* 供应商信息 */}
              <div style={{ marginBottom: 'var(--space-5)' }}>
                <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-3)', color: 'var(--color-text-secondary)' }}>供应商信息</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-3)' }}>
                  <div>
                    <label className="drawer-label">供应商</label>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', fontWeight: 'var(--font-medium)' }}>{selectedRecord.supplier}</div>
                  </div>
                  <div>
                    <label className="drawer-label">联系人</label>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', fontWeight: 'var(--font-medium)' }}>{selectedRecord.contactPerson}</div>
                  </div>
                  <div>
                    <label className="drawer-label">联系电话</label>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', fontWeight: 'var(--font-medium)' }}>{selectedRecord.contactPhone}</div>
                  </div>
                  <div>
                    <label className="drawer-label">报价单号</label>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', fontWeight: 'var(--font-medium)' }} className="mono">{selectedRecord.code}</div>
                  </div>
                </div>
              </div>

              {/* 商品报价详情 */}
              <div style={{ marginBottom: 'var(--space-5)' }}>
                <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-3)', color: 'var(--color-text-secondary)' }}>商品报价详情</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-3)' }}>
                  <div>
                    <label className="drawer-label">商品名称</label>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', fontWeight: 'var(--font-medium)' }}>{selectedRecord.product}</div>
                  </div>
                  <div>
                    <label className="drawer-label">茶类</label>
                    <div><Tag category={selectedRecord.teaCategory} /></div>
                  </div>
                  <div>
                    <label className="drawer-label">原价</label>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', fontWeight: 'var(--font-medium)' }} className="mono">¥{selectedRecord.originalPrice}/{selectedRecord.unit.replace('元/', '')}</div>
                  </div>
                  <div>
                    <label className="drawer-label">报价</label>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', fontWeight: 'var(--font-medium)' }} className="mono">¥{selectedRecord.quotedPrice}/{selectedRecord.unit.replace('元/', '')}</div>
                  </div>
                  <div>
                    <label className="drawer-label">调幅</label>
                    {(() => {
                      const adj = calcAdjustment(selectedRecord.originalPrice, selectedRecord.quotedPrice);
                      return (
                        <div className="mono" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)', color: adj > 0 ? '#CB405D' : adj < 0 ? '#01795D' : 'var(--color-text-secondary)' }}>
                          {adj > 0 ? '+' : ''}{adj}%
                        </div>
                      );
                    })()}
                  </div>
                  <div>
                    <label className="drawer-label">报价类型</label>
                    <span style={{
                      padding: '1px 8px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 'var(--font-medium)',
                      background: selectedRecord.type === 'first' ? '#E3F2FD' : selectedRecord.type === 'adjust' ? '#FFF3E0' : '#E8F5E9',
                      color: selectedRecord.type === 'first' ? '#1565C0' : selectedRecord.type === 'adjust' ? '#E65100' : '#2E7D32',
                      border: `1px solid ${selectedRecord.type === 'first' ? '#90CAF9' : selectedRecord.type === 'adjust' ? '#FFCC80' : '#A5D6A7'}`,
                    }}>
                      {PRICING_TYPE_LABELS[selectedRecord.type]}
                    </span>
                  </div>
                  <div>
                    <label className="drawer-label">有效期起</label>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', fontWeight: 'var(--font-medium)' }}>{selectedRecord.validFrom}</div>
                  </div>
                  <div>
                    <label className="drawer-label">有效期止</label>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', fontWeight: 'var(--font-medium)' }}>{selectedRecord.validTo}</div>
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label className="drawer-label">备注</label>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', fontWeight: 'var(--font-medium)' }}>{selectedRecord.remark}</div>
                  </div>
                </div>
              </div>

              {/* 价格历史对比 */}
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-3)', color: 'var(--color-text-secondary)' }}>价格历史对比</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  {selectedRecord.history.map((h, i) => {
                    const prevPrice = i > 0 ? selectedRecord.history[i - 1].price : null;
                    const diff = prevPrice !== null ? ((h.price - prevPrice) / prevPrice * 100).toFixed(1) : null;
                    return (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
                        padding: 'var(--space-3)', background: i === selectedRecord.history.length - 1 ? 'var(--color-module-current-lightest)' : 'var(--color-bg-tertiary)',
                        borderRadius: 'var(--radius-md)',
                        border: i === selectedRecord.history.length - 1 ? '1px solid var(--color-module-current-light)' : '1px solid transparent',
                      }}>
                        <div style={{
                          width: 28, height: 28, borderRadius: 'var(--radius-md)',
                          background: i === selectedRecord.history.length - 1 ? 'var(--color-module-current-base)' : 'var(--color-neutral-200)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)',
                          color: i === selectedRecord.history.length - 1 ? '#fff' : 'var(--color-text-tertiary)',
                          flexShrink: 0,
                        }}>
                          {i + 1}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                            <span style={{ fontWeight: 'var(--font-medium)', fontSize: 'var(--text-sm)' }} className="mono">¥{h.price}</span>
                            {diff !== null && (
                              <span className="mono" style={{ fontSize: 'var(--text-xs)', color: Number(diff) > 0 ? '#CB405D' : Number(diff) < 0 ? '#01795D' : 'var(--color-text-tertiary)' }}>
                                {Number(diff) > 0 ? '+' : ''}{diff}%
                              </span>
                            )}
                            {i === selectedRecord.history.length - 1 && (
                              <span style={{ padding: '0 6px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)', background: 'var(--color-module-current-lightest)', color: 'var(--color-module-current-base)', fontWeight: 'var(--font-medium)' }}>最新</span>
                            )}
                          </div>
                          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginTop: 2 }}>{h.date} · {h.note}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="drawer-footer">
              <Button variant="ghost" onClick={handleCloseDrawer}>关闭</Button>
              {selectedRecord.status === 'pending' && (
                <>
                  <Button style={{ background: '#CB405D', borderColor: '#CB405D' }} onClick={handleCloseDrawer}>驳回</Button>
                  <Button onClick={handleCloseDrawer}>确认报价</Button>
                </>
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
