import { useState } from 'react';
import ContentHeader from '../../components/layout/ContentHeader';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Tag from '../../components/common/Tag';
import StatusTag from '../../components/common/StatusTag';
import FilterBar, { FilterInput, FilterSelect } from '../../components/business/FilterBar';
import { TeaCategory } from '../../types';

/* ── 模拟数据 ── */
interface OtherIORecord {
  id: string;
  code: string;
  ioType: '其他入库' | '其他出库';
  product: string;
  teaCategory: TeaCategory;
  quantity: string;
  warehouse: string;
  reason: string;
  operator: string;
  date: string;
  status: 'pending' | 'approved' | 'completed';
  remark: string;
}

const mockRecords: OtherIORecord[] = [
  {
    id: '1', code: 'QT-2025-0012', ioType: '其他出库', product: '碧螺春', teaCategory: TeaCategory.GREEN,
    quantity: '5 kg', warehouse: '苏州分仓', reason: '报损', operator: '王仓管', date: '2025-07-15', status: 'completed',
    remark: '仓储受潮，品质下降，报损处理',
  },
  {
    id: '2', code: 'QT-2025-0011', ioType: '其他入库', product: '明前龙井', teaCategory: TeaCategory.GREEN,
    quantity: '10 kg', warehouse: '杭州总仓', reason: '盘盈', operator: '李仓管', date: '2025-07-14', status: 'completed',
    remark: '月度盘点发现盘盈10kg，已核实入库',
  },
  {
    id: '3', code: 'QT-2025-0010', ioType: '其他入库', product: '白牡丹', teaCategory: TeaCategory.WHITE,
    quantity: '8 kg', warehouse: '福鼎分仓', reason: '赠品入库', operator: '陈仓管', date: '2025-07-13', status: 'approved',
    remark: '供应商赠品，随采购订单PO-2025-0148到货',
  },
  {
    id: '4', code: 'QT-2025-0009', ioType: '其他出库', product: '大红袍', teaCategory: TeaCategory.OOLONG,
    quantity: '3 kg', warehouse: '武夷仓区', reason: '样品出库', operator: '张仓管', date: '2025-07-12', status: 'completed',
    remark: '客户品鉴样品，不计销售',
  },
  {
    id: '5', code: 'QT-2025-0008', ioType: '其他出库', product: '熟普洱', teaCategory: TeaCategory.DARK,
    quantity: '2 kg', warehouse: '云南总仓', reason: '报损', operator: '刘仓管', date: '2025-07-11', status: 'completed',
    remark: '包装破损，茶叶受污染，报损处理',
  },
  {
    id: '6', code: 'QT-2025-0007', ioType: '其他入库', product: '正山小种', teaCategory: TeaCategory.RED,
    quantity: '15 kg', warehouse: '武夷仓区', reason: '盘盈', operator: '张仓管', date: '2025-07-10', status: 'completed',
    remark: '周盘点盘盈15kg，已核实入库',
  },
  {
    id: '7', code: 'QT-2025-0006', ioType: '其他出库', product: '铁观音', teaCategory: TeaCategory.OOLONG,
    quantity: '4 kg', warehouse: '安溪分仓', reason: '样品出库', operator: '陈仓管', date: '2025-07-09', status: 'pending',
    remark: '展会品鉴用茶，待审批',
  },
  {
    id: '8', code: 'QT-2025-0005', ioType: '其他入库', product: '金骏眉', teaCategory: TeaCategory.RED,
    quantity: '6 kg', warehouse: '武夷仓区', reason: '赠品入库', operator: '张仓管', date: '2025-07-08', status: 'pending',
    remark: '正山堂赠品，待审核入库',
  },
];

function ioStatusToVariant(status: string) {
  switch (status) {
    case 'pending': return 'warning' as const;
    case 'approved': return 'info' as const;
    case 'completed': return 'success' as const;
    default: return 'default' as const;
  }
}

function ioStatusLabel(status: string) {
  switch (status) {
    case 'pending': return '待审核';
    case 'approved': return '已审核';
    case 'completed': return '已完成';
    default: return status;
  }
}

export default function InventoryOtherIO() {
  const [showDetail, setShowDetail] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<OtherIORecord | null>(null);

  const handleView = (record: OtherIORecord) => {
    setSelectedRecord(record);
    setShowDetail(true);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setSelectedRecord(null);
  };

  return (
    <>
      <ContentHeader title="其他出入库" breadcrumbs={['仓储', '其他出入库']} actions={<Button><PlusIcon />新建单据</Button>} />
      <div className="content-body">
        <FilterBar>
          <FilterInput placeholder="搜索单号、商品..." />
          <FilterSelect options={['全部类型', '其他入库', '其他出库']} />
          <FilterSelect options={['全部状态', '待审核', '已审核', '已完成']} />
          <FilterSelect options={['全部仓库', '杭州总仓', '武夷仓区', '苏州分仓', '安溪分仓', '福鼎分仓', '云南总仓']} />
        </FilterBar>
        <Card>
          <Table
            headers={['单号', '出入库类型', '商品', '数量', '仓库', '原因', '操作人', '日期', '状态', '操作']}
            rows={mockRecords.map((r) => [
              <span className="mono" style={{ fontWeight: 'var(--font-medium)' }}>{r.code}</span>,
              <span style={{ color: r.ioType === '其他入库' ? 'var(--color-semantic-success)' : 'var(--color-module-current-base)', fontWeight: 'var(--font-medium)' }}>{r.ioType}</span>,
              <span>{r.product}</span>,
              <span className="mono">{r.quantity}</span>,
              r.warehouse,
              <span style={{ color: 'var(--color-text-secondary)' }}>{r.reason}</span>,
              r.operator,
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{r.date}</span>,
              <StatusTag variant={ioStatusToVariant(r.status)} label={ioStatusLabel(r.status)} />,
              <Button size="sm" variant="ghost" onClick={() => handleView(r)}>查看</Button>,
            ])}
          />
        </Card>
      </div>

      {/* 详情抽屉 */}
      {showDetail && selectedRecord && (
        <div className="drawer-overlay" onClick={handleCloseDetail}>
          <div className="drawer-panel" onClick={(e) => e.stopPropagation()} style={{ width: 560 }}>
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
                    QT
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <span className="drawer-title">{selectedRecord.code}</span>
                      <StatusTag variant={ioStatusToVariant(selectedRecord.status)} label={ioStatusLabel(selectedRecord.status)} />
                    </div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginTop: 2 }}>
                      {selectedRecord.ioType} · {selectedRecord.product}
                    </div>
                  </div>
                </div>
              </div>
              <button className="drawer-close" onClick={handleCloseDetail}>
                <svg viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
              </button>
            </div>

            <div className="drawer-body">
              <div className="drawer-section-title">单据信息</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
                <div>
                  <label className="drawer-label">单号</label>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)' }}>{selectedRecord.code}</div>
                </div>
                <div>
                  <label className="drawer-label">出入库类型</label>
                  <div style={{ fontSize: 'var(--text-sm)', color: selectedRecord.ioType === '其他入库' ? 'var(--color-semantic-success)' : 'var(--color-module-current-base)', fontWeight: 'var(--font-medium)' }}>{selectedRecord.ioType}</div>
                </div>
                <div>
                  <label className="drawer-label">商品</label>
                  <div style={{ fontSize: 'var(--text-sm)' }}>{selectedRecord.product}</div>
                </div>
                <div>
                  <label className="drawer-label">数量</label>
                  <div style={{ fontSize: 'var(--text-sm)' }} className="mono">{selectedRecord.quantity}</div>
                </div>
                <div>
                  <label className="drawer-label">仓库</label>
                  <div style={{ fontSize: 'var(--text-sm)' }}>{selectedRecord.warehouse}</div>
                </div>
                <div>
                  <label className="drawer-label">原因</label>
                  <div style={{ fontSize: 'var(--text-sm)' }}>{selectedRecord.reason}</div>
                </div>
                <div>
                  <label className="drawer-label">操作人</label>
                  <div style={{ fontSize: 'var(--text-sm)' }}>{selectedRecord.operator}</div>
                </div>
                <div>
                  <label className="drawer-label">日期</label>
                  <div style={{ fontSize: 'var(--text-sm)' }}>{selectedRecord.date}</div>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="drawer-label">备注</label>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{selectedRecord.remark || '—'}</div>
                </div>
              </div>
            </div>

            <div className="drawer-footer">
              <Button variant="ghost" onClick={handleCloseDetail}>关闭</Button>
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
