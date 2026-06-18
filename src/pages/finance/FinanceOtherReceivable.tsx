import { useState } from 'react';
import ContentHeader from '../../components/layout/ContentHeader';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import StatusTag from '../../components/common/StatusTag';
import Button from '../../components/common/Button';
import FilterBar, { FilterInput, FilterSelect } from '../../components/business/FilterBar';

interface OtherReceivableRecord {
  code: string;
  partner: string;
  reason: string;
  amount: string;
  dueDate: string;
  status: 'pending' | 'received' | 'overdue';
  remark?: string;
}

const receivableItems: OtherReceivableRecord[] = [
  { code: 'OR-2025-0018', partner: '杭州会展中心', reason: '押金', amount: '¥ 15,000', dueDate: '2025-08-30', status: 'pending', remark: '茶博会参展押金' },
  { code: 'OR-2025-0017', partner: '福建正山堂茶业有限责任公司', reason: '保证金', amount: '¥ 8,600', dueDate: '2025-09-15', status: 'pending', remark: '品牌代理保证金' },
  { code: 'OR-2025-0016', partner: '顺丰速运有限公司', reason: '代垫款', amount: '¥ 5,200', dueDate: '2025-07-25', status: 'received', remark: '代垫运费已收回' },
  { code: 'OR-2025-0015', partner: '华茗堂茶庄', reason: '赔偿款', amount: '¥ 3,800', dueDate: '2025-07-10', status: 'overdue', remark: '退货损坏赔偿，逾期未收' },
  { code: 'OR-2025-0014', partner: '雅韵茶社', reason: '押金', amount: '¥ 6,000', dueDate: '2025-08-20', status: 'pending', remark: '茶叶品鉴会场地押金' },
  { code: 'OR-2025-0013', partner: '八马茶业股份有限公司', reason: '代垫款', amount: '¥ 7,000', dueDate: '2025-07-18', status: 'received', remark: '联合采购代垫款已收回' },
];

function receivableStatusToVariant(status: string) {
  switch (status) {
    case 'received': return 'success' as const;
    case 'pending': return 'warning' as const;
    case 'overdue': return 'error' as const;
    default: return 'info' as const;
  }
}

function receivableStatusLabel(status: string) {
  switch (status) {
    case 'received': return '已收款';
    case 'pending': return '待收款';
    case 'overdue': return '已逾期';
    default: return status;
  }
}

function reasonColor(reason: string) {
  switch (reason) {
    case '押金': return '#01795D';
    case '保证金': return 'var(--color-module-current-base)';
    case '代垫款': return 'var(--color-module-finance-secondary)';
    case '赔偿款': return '#CB405D';
    default: return 'var(--color-neutral-400)';
  }
}

export default function FinanceOtherReceivable() {
  const [showDetail, setShowDetail] = useState(false);
  const [selectedItem, setSelectedItem] = useState<OtherReceivableRecord | null>(null);

  const handleView = (item: OtherReceivableRecord) => {
    setSelectedItem(item);
    setShowDetail(true);
  };

  return (
    <>
      <ContentHeader title="其他应收" breadcrumbs={['财务', '结算管理', '其他应收']} actions={<><Button variant="ghost">导出</Button><Button><PlusIcon />新建应收</Button></>} />
      <div className="content-body">
        <FilterBar>
          <FilterInput placeholder="搜索单号、往来单位、事由..." />
          <FilterSelect options={['全部状态', '待收款', '已收款', '已逾期']} />
          <FilterSelect options={['全部类别', '押金', '保证金', '代垫款', '赔偿款']} />
        </FilterBar>
        <Card>
          <Table
            headers={['单号', '往来单位', '事由', '金额', '应收日期', '状态', '操作']}
            rows={receivableItems.map((r) => [
              <span className="mono">{r.code}</span>,
              <span style={{ fontWeight: 'var(--font-medium)' }}>{r.partner}</span>,
              <span style={{ padding: '1px 8px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-medium)', background: `${reasonColor(r.reason)}12`, color: reasonColor(r.reason), border: `1px solid ${reasonColor(r.reason)}30` }}>{r.reason}</span>,
              <span className="mono">{r.amount}</span>,
              <span className="mono">{r.dueDate}</span>,
              <StatusTag variant={receivableStatusToVariant(r.status)} label={receivableStatusLabel(r.status)} />,
              <Button size="sm" variant="ghost" onClick={() => handleView(r)}>查看</Button>,
            ])}
          />
        </Card>
      </div>

      {showDetail && selectedItem && (
        <div className="drawer-overlay" onClick={() => setShowDetail(false)}>
          <div className="drawer-panel" onClick={e => e.stopPropagation()} style={{ width: 560 }}>
            <div className="drawer-header">
              <span className="drawer-title">应收详情</span>
              <button className="drawer-close" onClick={() => setShowDetail(false)}>
                <svg viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </button>
            </div>
            <div className="drawer-body">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-3)' }}>
                <div>
                  <label className="drawer-label">单号</label>
                  <div className="mono" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)' }}>{selectedItem.code}</div>
                </div>
                <div>
                  <label className="drawer-label">往来单位</label>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)' }}>{selectedItem.partner}</div>
                </div>
                <div>
                  <label className="drawer-label">事由</label>
                  <span style={{ padding: '1px 8px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-medium)', background: `${reasonColor(selectedItem.reason)}12`, color: reasonColor(selectedItem.reason), border: `1px solid ${reasonColor(selectedItem.reason)}30` }}>{selectedItem.reason}</span>
                </div>
                <div>
                  <label className="drawer-label">金额</label>
                  <div className="mono" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--color-module-current-base)' }}>{selectedItem.amount}</div>
                </div>
                <div>
                  <label className="drawer-label">应收日期</label>
                  <div className="mono" style={{ fontSize: 'var(--text-sm)' }}>{selectedItem.dueDate}</div>
                </div>
                <div>
                  <label className="drawer-label">状态</label>
                  <StatusTag variant={receivableStatusToVariant(selectedItem.status)} label={receivableStatusLabel(selectedItem.status)} />
                </div>
                {selectedItem.remark && (
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label className="drawer-label">备注</label>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{selectedItem.remark}</div>
                  </div>
                )}
              </div>
            </div>
            <div className="drawer-footer">
              <Button variant="ghost" onClick={() => setShowDetail(false)}>关闭</Button>
              {selectedItem.status === 'pending' && <Button>确认收款</Button>}
              {selectedItem.status === 'overdue' && <Button>催收</Button>}
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
