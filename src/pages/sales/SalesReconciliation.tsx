import { useState } from 'react';
import ContentHeader from '../../components/layout/ContentHeader';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import StatusTag from '../../components/common/StatusTag';
import FilterBar, { FilterInput, FilterSelect } from '../../components/business/FilterBar';

/* ── 对账状态 ── */
type ReconciliationStatus = 'pending' | 'reconciling' | 'confirmed' | 'disputed';

function reconciliationStatusToVariant(status: ReconciliationStatus) {
  switch (status) {
    case 'pending': return 'warning' as const;
    case 'reconciling': return 'info' as const;
    case 'confirmed': return 'success' as const;
    case 'disputed': return 'error' as const;
    default: return 'default' as const;
  }
}

function reconciliationStatusLabel(status: ReconciliationStatus) {
  switch (status) {
    case 'pending': return '待对账';
    case 'reconciling': return '对账中';
    case 'confirmed': return '已确认';
    case 'disputed': return '有异议';
    default: return status;
  }
}

/* ── 客户类型 ── */
type CustomerType = 'direct' | 'channel' | 'platform';

const CUSTOMER_TYPE_LABELS: Record<CustomerType, string> = {
  direct: '直营客户',
  channel: '渠道客户',
  platform: '平台客户',
};

/* ── 对账记录 ── */
interface ReconciliationRecord {
  id: string;
  code: string;
  customer: string;
  customerType: CustomerType;
  period: string;
  salesAmount: string;
  receivedAmount: string;
  balance: string;
  settlementMethod: string;
  status: ReconciliationStatus;
  contactPerson: string;
  contactPhone: string;
  orderCount: number;
  invoiceStatus: string;
  paymentRecords: { date: string; amount: string; method: string; remark: string }[];
}

const reconciliationData: ReconciliationRecord[] = [
  {
    id: '1', code: 'REC-S-2025-0048', customer: '华茗堂茶庄', customerType: 'direct',
    period: '2025.06.01 - 2025.06.15',
    salesAmount: '¥ 186,500', receivedAmount: '¥ 120,000', balance: '¥ 66,500',
    settlementMethod: '月结', status: 'pending',
    contactPerson: '王经理', contactPhone: '0571-87651234',
    orderCount: 6, invoiceStatus: '待开票',
    paymentRecords: [
      { date: '2025-06-05', amount: '¥ 80,000', method: '银行转账', remark: '6月首批货款' },
      { date: '2025-06-10', amount: '¥ 40,000', method: '银行转账', remark: '6月第二批预付' },
    ],
  },
  {
    id: '2', code: 'REC-S-2025-0047', customer: '雅韵茶社', customerType: 'channel',
    period: '2025.06.01 - 2025.06.15',
    salesAmount: '¥ 245,800', receivedAmount: '¥ 200,000', balance: '¥ 45,800',
    settlementMethod: '见票结', status: 'reconciling',
    contactPerson: '赵总', contactPhone: '0599-51234567',
    orderCount: 4, invoiceStatus: '已开票',
    paymentRecords: [
      { date: '2025-06-03', amount: '¥ 150,000', method: '银行转账', remark: '金骏眉系列货款' },
      { date: '2025-06-12', amount: '¥ 50,000', method: '银行转账', remark: '正山小种预付款' },
    ],
  },
  {
    id: '3', code: 'REC-S-2025-0046', customer: '清心茶坊', customerType: 'direct',
    period: '2025.06.01 - 2025.06.15',
    salesAmount: '¥ 312,000', receivedAmount: '¥ 312,000', balance: '¥ 0',
    settlementMethod: '月结', status: 'confirmed',
    contactPerson: '林老板', contactPhone: '0768-2345678',
    orderCount: 8, invoiceStatus: '已收票',
    paymentRecords: [
      { date: '2025-06-01', amount: '¥ 200,000', method: '银行转账', remark: '凤凰单丛系列全款' },
      { date: '2025-06-08', amount: '¥ 112,000', method: '银行转账', remark: '大红袍系列全款' },
    ],
  },
  {
    id: '4', code: 'REC-S-2025-0045', customer: '品茗轩', customerType: 'platform',
    period: '2025.05.16 - 2025.05.31',
    salesAmount: '¥ 198,600', receivedAmount: '¥ 150,000', balance: '¥ 48,600',
    settlementMethod: '周期结', status: 'disputed',
    contactPerson: '张女士', contactPhone: '0593-5678901',
    orderCount: 5, invoiceStatus: '已开票',
    paymentRecords: [
      { date: '2025-05-20', amount: '¥ 100,000', method: '银行转账', remark: '白毫银针首批货款' },
      { date: '2025-05-28', amount: '¥ 50,000', method: '承兑汇票', remark: '白牡丹第二批' },
    ],
  },
  {
    id: '5', code: 'REC-S-2025-0044', customer: '翠竹茶行', customerType: 'channel',
    period: '2025.05.16 - 2025.05.31',
    salesAmount: '¥ 88,400', receivedAmount: '¥ 88,400', balance: '¥ 0',
    settlementMethod: '先款结', status: 'confirmed',
    contactPerson: '周经理', contactPhone: '0774-7234567',
    orderCount: 3, invoiceStatus: '已收票',
    paymentRecords: [
      { date: '2025-05-16', amount: '¥ 88,400', method: '银行转账', remark: '六堡茶全款预付' },
    ],
  },
  {
    id: '6', code: 'REC-S-2025-0043', customer: '和风茶屋', customerType: 'direct',
    period: '2025.05.16 - 2025.05.31',
    salesAmount: '¥ 156,200', receivedAmount: '¥ 100,000', balance: '¥ 56,200',
    settlementMethod: '月结', status: 'reconciling',
    contactPerson: '何老板', contactPhone: '0730-8234567',
    orderCount: 5, invoiceStatus: '已开票',
    paymentRecords: [
      { date: '2025-05-18', amount: '¥ 60,000', method: '银行转账', remark: '君山银针第一批' },
      { date: '2025-05-25', amount: '¥ 40,000', method: '银行转账', remark: '君山银针第二批' },
    ],
  },
  {
    id: '7', code: 'REC-S-2025-0042', customer: '云隐茶庄', customerType: 'channel',
    period: '2025.05.16 - 2025.05.31',
    salesAmount: '¥ 178,900', receivedAmount: '¥ 178,900', balance: '¥ 0',
    settlementMethod: '见票结', status: 'confirmed',
    contactPerson: '江总', contactPhone: '0599-5234567',
    orderCount: 4, invoiceStatus: '已收票',
    paymentRecords: [
      { date: '2025-05-20', amount: '¥ 100,000', method: '银行转账', remark: '正山小种系列全款' },
      { date: '2025-05-27', amount: '¥ 78,900', method: '银行转账', remark: '铁观音系列全款' },
    ],
  },
  {
    id: '8', code: 'REC-S-2025-0041', customer: '茗香斋', customerType: 'platform',
    period: '2025.05.01 - 2025.05.15',
    salesAmount: '¥ 90,400', receivedAmount: '¥ 50,000', balance: '¥ 40,400',
    settlementMethod: '月结', status: 'pending',
    contactPerson: '吴经理', contactPhone: '0595-2345678',
    orderCount: 2, invoiceStatus: '待开票',
    paymentRecords: [
      { date: '2025-05-05', amount: '¥ 50,000', method: '银行转账', remark: '铁观音预付' },
    ],
  },
];

export default function SalesReconciliation() {
  const [showDetail, setShowDetail] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ReconciliationRecord | null>(null);

  const handleView = (record: ReconciliationRecord) => {
    setSelectedRecord(record);
    setShowDetail(true);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setSelectedRecord(null);
  };

  return (
    <>
      <ContentHeader
        title="客户对账"
        breadcrumbs={['销售', '客户对账']}
        actions={
          <>
            <Button variant="ghost">导出</Button>
            <Button><PlusIcon />新建对账单</Button>
          </>
        }
      />
      <div className="content-body">
        <FilterBar>
          <FilterInput placeholder="搜索对账单号、客户..." />
          <FilterSelect options={['全部状态', '待对账', '对账中', '已确认', '有异议']} />
          <FilterSelect options={['全部客户', '华茗堂茶庄', '雅韵茶社', '清心茶坊', '品茗轩', '翠竹茶行', '和风茶屋', '云隐茶庄', '茗香斋']} />
          <FilterSelect options={['全部时间', '本月', '上个月', '近3月', '本年度']} />
        </FilterBar>

        <Card>
          <Table
            headers={['对账单号', '客户', '客户类型', '对账周期', '销售金额', '已收金额', '应收余额', '结算方式', '状态', '操作']}
            rows={reconciliationData.map((r) => [
              <span className="mono">{r.code}</span>,
              r.customer,
              <span style={{
                padding: '1px 8px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-medium)',
                background: r.customerType === 'direct' ? '#E3F2FD' : r.customerType === 'channel' ? '#FFF3E0' : '#E8F5E9',
                color: r.customerType === 'direct' ? '#1565C0' : r.customerType === 'channel' ? '#E65100' : '#2E7D32',
                border: `1px solid ${r.customerType === 'direct' ? '#90CAF9' : r.customerType === 'channel' ? '#FFCC80' : '#A5D6A7'}`,
              }}>{CUSTOMER_TYPE_LABELS[r.customerType]}</span>,
              r.period,
              <span className="mono">{r.salesAmount}</span>,
              <span className="mono">{r.receivedAmount}</span>,
              <span className="mono" style={{ color: r.balance !== '¥ 0' ? 'var(--color-module-current-base)' : 'var(--color-text-tertiary)', fontWeight: r.balance !== '¥ 0' ? 'var(--font-semibold)' : undefined }}>{r.balance}</span>,
              r.settlementMethod,
              <StatusTag variant={reconciliationStatusToVariant(r.status)} label={reconciliationStatusLabel(r.status)} />,
              <Button size="sm" variant="ghost" onClick={() => handleView(r)}>查看</Button>,
            ])}
          />
        </Card>
      </div>

      {/* 对账详情抽屉 */}
      {showDetail && selectedRecord && (
        <div className="drawer-overlay" onClick={handleCloseDetail}>
          <div className="drawer-panel" onClick={(e) => e.stopPropagation()} style={{ width: 640 }}>
            <div className="drawer-header">
              <span className="drawer-title">对账单详情</span>
              <button className="drawer-close" onClick={handleCloseDetail}>
                <svg viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
              </button>
            </div>

            <div className="drawer-body">
              {/* 客户信息 */}
              <div style={{ marginBottom: 'var(--space-5)' }}>
                <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-3)', color: 'var(--color-text-secondary)' }}>客户信息</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-3)' }}>
                  <div>
                    <label className="drawer-label">客户名称</label>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)' }}>{selectedRecord.customer}</div>
                  </div>
                  <div>
                    <label className="drawer-label">客户类型</label>
                    <span style={{
                      padding: '1px 8px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-medium)',
                      background: selectedRecord.customerType === 'direct' ? '#E3F2FD' : selectedRecord.customerType === 'channel' ? '#FFF3E0' : '#E8F5E9',
                      color: selectedRecord.customerType === 'direct' ? '#1565C0' : selectedRecord.customerType === 'channel' ? '#E65100' : '#2E7D32',
                      border: `1px solid ${selectedRecord.customerType === 'direct' ? '#90CAF9' : selectedRecord.customerType === 'channel' ? '#FFCC80' : '#A5D6A7'}`,
                    }}>{CUSTOMER_TYPE_LABELS[selectedRecord.customerType]}</span>
                  </div>
                  <div>
                    <label className="drawer-label">对账单号</label>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)' }} className="mono">{selectedRecord.code}</div>
                  </div>
                  <div>
                    <label className="drawer-label">对账周期</label>
                    <div style={{ fontSize: 'var(--text-sm)' }}>{selectedRecord.period}</div>
                  </div>
                  <div>
                    <label className="drawer-label">联系人</label>
                    <div style={{ fontSize: 'var(--text-sm)' }}>{selectedRecord.contactPerson}</div>
                  </div>
                  <div>
                    <label className="drawer-label">联系电话</label>
                    <div style={{ fontSize: 'var(--text-sm)' }}>{selectedRecord.contactPhone}</div>
                  </div>
                </div>
              </div>

              {/* 订单汇总 */}
              <div style={{ marginBottom: 'var(--space-5)' }}>
                <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-3)', color: 'var(--color-text-secondary)' }}>订单汇总</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-3)' }}>
                  <div>
                    <label className="drawer-label">关联销售单数</label>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)' }}>{selectedRecord.orderCount} 单</div>
                  </div>
                  <div>
                    <label className="drawer-label">结算方式</label>
                    <div style={{ fontSize: 'var(--text-sm)' }}>{selectedRecord.settlementMethod}</div>
                  </div>
                  <div>
                    <label className="drawer-label">销售金额</label>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)' }} className="mono">{selectedRecord.salesAmount}</div>
                  </div>
                  <div>
                    <label className="drawer-label">已收金额</label>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)' }} className="mono">{selectedRecord.receivedAmount}</div>
                  </div>
                  <div>
                    <label className="drawer-label">应收余额</label>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)', color: selectedRecord.balance !== '¥ 0' ? 'var(--color-module-current-base)' : 'var(--color-text-tertiary)' }} className="mono">{selectedRecord.balance}</div>
                  </div>
                  <div>
                    <label className="drawer-label">状态</label>
                    <StatusTag variant={reconciliationStatusToVariant(selectedRecord.status)} label={reconciliationStatusLabel(selectedRecord.status)} />
                  </div>
                </div>
              </div>

              {/* 收款记录 */}
              <div style={{ marginBottom: 'var(--space-5)' }}>
                <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-3)', color: 'var(--color-text-secondary)' }}>收款记录</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  {selectedRecord.paymentRecords.map((pr, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3)', background: 'var(--color-bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-md)', background: 'var(--color-module-current-lightest)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--color-module-current-base)' }}>
                        {i + 1}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                          <span style={{ fontWeight: 'var(--font-medium)', fontSize: 'var(--text-sm)' }} className="mono">{pr.amount}</span>
                          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{pr.date}</span>
                        </div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{pr.method} · {pr.remark}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 发票状态 */}
              <div>
                <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-3)', color: 'var(--color-text-secondary)' }}>发票状态</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-3)', background: 'var(--color-bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: selectedRecord.invoiceStatus === '已收票' ? '#01795D' : selectedRecord.invoiceStatus === '已开票' ? '#0F64B5' : '#FD742D' }} />
                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)' }}>{selectedRecord.invoiceStatus}</span>
                </div>
              </div>
            </div>

            <div className="drawer-footer">
              <Button variant="ghost" onClick={handleCloseDetail}>关闭</Button>
              {selectedRecord.status === 'pending' && (
                <Button>发起对账</Button>
              )}
              {selectedRecord.status === 'reconciling' && (
                <>
                  <Button variant="ghost" style={{ color: '#CB405D', borderColor: '#CB405D' }}>提出异议</Button>
                  <Button>确认对账</Button>
                </>
              )}
              {selectedRecord.status === 'disputed' && (
                <Button>重新对账</Button>
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
