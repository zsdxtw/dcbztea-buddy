import { useState } from 'react';
import ContentHeader from '../../components/layout/ContentHeader';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import StatusTag from '../../components/common/StatusTag';
import FilterBar, { FilterInput, FilterSelect } from '../../components/business/FilterBar';
import type { StatCardData } from '../../types';

/* ── 统计数据 ── */
const stats: StatCardData[] = [
  { label: '盘点单数', value: '6', unit: '单', icon: <svg viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.3"/><path d="M9 6v4M9 12.5v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> },
  { label: '盘点中', value: '2', unit: '单', trend: { direction: 'up', value: '+1单' }, icon: <svg viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.3"/><path d="M9 6v4l3 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { label: '差异项', value: '8', unit: '种', trend: { direction: 'down', value: '-2种' }, icon: <svg viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.3"/><path d="M6 10l2 2 4-5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { label: '盘点准确率', value: '97.2', unit: '%', trend: { direction: 'up', value: '+0.5%' }, icon: <svg viewBox="0 0 18 18" fill="none"><path d="M3 14l3-4 3 2 3-5 3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg> },
];

/* ── 模拟数据 ── */
interface CheckOrder {
  id: string;
  code: string;
  warehouse: string;
  scope: string;
  systemQty: string;
  actualQty: string;
  diffQty: string;
  checkDate: string;
  status: 'pending' | 'checking' | 'completed';
  operator: string;
  remark: string;
  items: { product: string; systemQty: string; actualQty: string; diff: string; result: 'match' | 'surplus' | 'shortage' }[];
}

const mockCheckOrders: CheckOrder[] = [
  {
    id: '1', code: 'PD-2025-0006', warehouse: '杭州总仓', scope: '绿茶品类', systemQty: '1,280 kg', actualQty: '1,275 kg', diffQty: '-5 kg', checkDate: '2025-07-15', status: 'checking',
    operator: '李主管', remark: '月度盘点进行中',
    items: [
      { product: '明前龙井 — 特级', systemQty: '280 kg', actualQty: '280 kg', diff: '0 kg', result: 'match' },
      { product: '雨前龙井 — 二级', systemQty: '520 kg', actualQty: '515 kg', diff: '-5 kg', result: 'shortage' },
      { product: '碧螺春 — 一级', systemQty: '180 kg', actualQty: '180 kg', diff: '0 kg', result: 'match' },
      { product: '龙井 — 三级', systemQty: '300 kg', actualQty: '300 kg', diff: '0 kg', result: 'match' },
    ],
  },
  {
    id: '2', code: 'PD-2025-0005', warehouse: '武夷仓区', scope: '红茶品类', systemQty: '680 kg', actualQty: '678 kg', diffQty: '-2 kg', checkDate: '2025-07-14', status: 'completed',
    operator: '张主管', remark: '周盘点完成',
    items: [
      { product: '正山小种 — 特级', systemQty: '120 kg', actualQty: '118 kg', diff: '-2 kg', result: 'shortage' },
      { product: '金骏眉 — 特级', systemQty: '200 kg', actualQty: '200 kg', diff: '0 kg', result: 'match' },
      { product: '祁门红茶 — 特级', systemQty: '360 kg', actualQty: '360 kg', diff: '0 kg', result: 'match' },
    ],
  },
  {
    id: '3', code: 'PD-2025-0004', warehouse: '安溪分仓', scope: '青茶品类', systemQty: '920 kg', actualQty: '925 kg', diffQty: '+5 kg', checkDate: '2025-07-13', status: 'completed',
    operator: '陈主管', remark: '盘盈5kg，已核实入库',
    items: [
      { product: '铁观音 — 一级', systemQty: '350 kg', actualQty: '355 kg', diff: '+5 kg', result: 'surplus' },
      { product: '清香铁观音 — 一级', systemQty: '280 kg', actualQty: '280 kg', diff: '0 kg', result: 'match' },
      { product: '大红袍 — 特级', systemQty: '290 kg', actualQty: '290 kg', diff: '0 kg', result: 'match' },
    ],
  },
  {
    id: '4', code: 'PD-2025-0003', warehouse: '福鼎分仓', scope: '白茶品类', systemQty: '540 kg', actualQty: '540 kg', diffQty: '0 kg', checkDate: '2025-07-12', status: 'completed',
    operator: '陈仓管', remark: '盘点无差异',
    items: [
      { product: '白毫银针 — 特级', systemQty: '180 kg', actualQty: '180 kg', diff: '0 kg', result: 'match' },
      { product: '白牡丹 — 一级', systemQty: '360 kg', actualQty: '360 kg', diff: '0 kg', result: 'match' },
    ],
  },
  {
    id: '5', code: 'PD-2025-0002', warehouse: '云南总仓', scope: '黑茶品类', systemQty: '2,100 kg', actualQty: '2,080 kg', diffQty: '-20 kg', checkDate: '2025-07-10', status: 'pending',
    operator: '刘主管', remark: '待盘点',
    items: [
      { product: '熟普洱 — 三级', systemQty: '560 kg', actualQty: '—', diff: '—', result: 'match' },
      { product: '7542生饼', systemQty: '800 kg', actualQty: '—', diff: '—', result: 'match' },
      { product: '六堡茶 — 二级', systemQty: '740 kg', actualQty: '—', diff: '—', result: 'match' },
    ],
  },
  {
    id: '6', code: 'PD-2025-0001', warehouse: '苏州分仓', scope: '全品类', systemQty: '1,560 kg', actualQty: '1,558 kg', diffQty: '-2 kg', checkDate: '2025-07-08', status: 'completed',
    operator: '王主管', remark: '月度全品类盘点',
    items: [
      { product: '碧螺春 — 一级', systemQty: '180 kg', actualQty: '178 kg', diff: '-2 kg', result: 'shortage' },
      { product: '君山银针 — 特级', systemQty: '120 kg', actualQty: '120 kg', diff: '0 kg', result: 'match' },
      { product: '明前龙井 — 特级', systemQty: '260 kg', actualQty: '260 kg', diff: '0 kg', result: 'match' },
      { product: '铁观音 — 一级', systemQty: '200 kg', actualQty: '200 kg', diff: '0 kg', result: 'match' },
      { product: '正山小种 — 特级', systemQty: '100 kg', actualQty: '100 kg', diff: '0 kg', result: 'match' },
      { product: '白毫银针 — 特级', systemQty: '150 kg', actualQty: '150 kg', diff: '0 kg', result: 'match' },
      { product: '熟普洱 — 三级', systemQty: '300 kg', actualQty: '300 kg', diff: '0 kg', result: 'match' },
      { product: '六堡茶 — 二级', systemQty: '250 kg', actualQty: '250 kg', diff: '0 kg', result: 'match' },
    ],
  },
];

function checkStatusToVariant(status: string) {
  switch (status) {
    case 'pending': return 'warning' as const;
    case 'checking': return 'info' as const;
    case 'completed': return 'success' as const;
    default: return 'default' as const;
  }
}

function checkStatusLabel(status: string) {
  switch (status) {
    case 'pending': return '待盘点';
    case 'checking': return '盘点中';
    case 'completed': return '已完成';
    default: return status;
  }
}

function diffResultToVariant(result: string) {
  switch (result) {
    case 'match': return 'success' as const;
    case 'surplus': return 'info' as const;
    case 'shortage': return 'error' as const;
    default: return 'default' as const;
  }
}

function diffResultLabel(result: string) {
  switch (result) {
    case 'match': return '一致';
    case 'surplus': return '盘盈';
    case 'shortage': return '盘亏';
    default: return result;
  }
}

export default function InventoryCheck() {
  const [showDetail, setShowDetail] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<CheckOrder | null>(null);

  const handleView = (order: CheckOrder) => {
    setSelectedOrder(order);
    setShowDetail(true);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setSelectedOrder(null);
  };

  return (
    <>
      <ContentHeader title="库存盘点" breadcrumbs={['仓储', '库存盘点']} actions={<><Button variant="ghost">导出</Button><Button><PlusIcon />新建盘点</Button></>} />
      <div className="content-body">
        <div className="stat-cards">
          {stats.map((s, i) => <StatCard key={i} data={s} />)}
        </div>
        <FilterBar>
          <FilterInput placeholder="搜索盘点单号..." />
          <FilterSelect options={['全部状态', '待盘点', '盘点中', '已完成']} />
          <FilterSelect options={['全部仓库', '杭州总仓', '武夷仓区', '苏州分仓', '安溪分仓', '福鼎分仓', '云南总仓']} />
        </FilterBar>
        <Card>
          <Table
            headers={['盘点单号', '仓库', '盘点范围', '系统数量', '实盘数量', '差异数', '盘点日期', '状态', '操作']}
            rows={mockCheckOrders.map((o) => [
              <span className="mono" style={{ fontWeight: 'var(--font-medium)' }}>{o.code}</span>,
              o.warehouse,
              o.scope,
              <span className="mono">{o.systemQty}</span>,
              <span className="mono">{o.actualQty}</span>,
              <span className="mono" style={{ color: o.diffQty.startsWith('+') ? 'var(--color-semantic-success)' : o.diffQty.startsWith('-') ? 'var(--color-semantic-error)' : 'var(--color-text-secondary)' }}>{o.diffQty}</span>,
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{o.checkDate}</span>,
              <StatusTag variant={checkStatusToVariant(o.status)} label={checkStatusLabel(o.status)} />,
              <Button size="sm" variant="ghost" onClick={() => handleView(o)}>查看</Button>,
            ])}
          />
        </Card>
      </div>

      {/* 盘点详情抽屉 */}
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
                    PD
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <span className="drawer-title">{selectedOrder.code}</span>
                      <StatusTag variant={checkStatusToVariant(selectedOrder.status)} label={checkStatusLabel(selectedOrder.status)} />
                    </div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginTop: 2 }}>
                      {selectedOrder.warehouse} · {selectedOrder.scope}
                    </div>
                  </div>
                </div>
              </div>
              <button className="drawer-close" onClick={handleCloseDetail}>
                <svg viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
              </button>
            </div>

            <div className="drawer-body">
              {/* 盘点基本信息 */}
              <div className="drawer-section-title">盘点信息</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
                <div>
                  <label className="drawer-label">盘点单号</label>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)' }}>{selectedOrder.code}</div>
                </div>
                <div>
                  <label className="drawer-label">仓库</label>
                  <div style={{ fontSize: 'var(--text-sm)' }}>{selectedOrder.warehouse}</div>
                </div>
                <div>
                  <label className="drawer-label">盘点范围</label>
                  <div style={{ fontSize: 'var(--text-sm)' }}>{selectedOrder.scope}</div>
                </div>
                <div>
                  <label className="drawer-label">盘点日期</label>
                  <div style={{ fontSize: 'var(--text-sm)' }}>{selectedOrder.checkDate}</div>
                </div>
                <div>
                  <label className="drawer-label">操作人</label>
                  <div style={{ fontSize: 'var(--text-sm)' }}>{selectedOrder.operator}</div>
                </div>
                <div>
                  <label className="drawer-label">差异汇总</label>
                  <div style={{ fontSize: 'var(--text-sm)', color: selectedOrder.diffQty.startsWith('+') ? 'var(--color-semantic-success)' : selectedOrder.diffQty.startsWith('-') ? 'var(--color-semantic-error)' : 'var(--color-text-secondary)' }} className="mono">{selectedOrder.diffQty}</div>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="drawer-label">备注</label>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{selectedOrder.remark || '—'}</div>
                </div>
              </div>

              {/* 逐项对比表 */}
              <div className="drawer-section-title">盘点明细</div>
              <div style={{
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border-primary)',
                overflow: 'hidden',
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
                  <thead>
                    <tr style={{ background: 'var(--color-bg-tertiary)' }}>
                      <th style={{ padding: 'var(--space-2) var(--space-3)', textAlign: 'left', fontWeight: 'var(--font-medium)', color: 'var(--color-text-secondary)' }}>商品</th>
                      <th style={{ padding: 'var(--space-2) var(--space-3)', textAlign: 'right', fontWeight: 'var(--font-medium)', color: 'var(--color-text-secondary)' }}>系统数量</th>
                      <th style={{ padding: 'var(--space-2) var(--space-3)', textAlign: 'right', fontWeight: 'var(--font-medium)', color: 'var(--color-text-secondary)' }}>实盘数量</th>
                      <th style={{ padding: 'var(--space-2) var(--space-3)', textAlign: 'right', fontWeight: 'var(--font-medium)', color: 'var(--color-text-secondary)' }}>差异</th>
                      <th style={{ padding: 'var(--space-2) var(--space-3)', textAlign: 'center', fontWeight: 'var(--font-medium)', color: 'var(--color-text-secondary)' }}>结果</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item, i) => (
                      <tr key={i} style={{ borderTop: '1px solid var(--color-border-primary)' }}>
                        <td style={{ padding: 'var(--space-2) var(--space-3)', fontWeight: 'var(--font-medium)' }}>{item.product}</td>
                        <td style={{ padding: 'var(--space-2) var(--space-3)', textAlign: 'right' }} className="mono">{item.systemQty}</td>
                        <td style={{ padding: 'var(--space-2) var(--space-3)', textAlign: 'right' }} className="mono">{item.actualQty}</td>
                        <td style={{ padding: 'var(--space-2) var(--space-3)', textAlign: 'right', color: item.diff.startsWith('+') ? 'var(--color-semantic-success)' : item.diff.startsWith('-') ? 'var(--color-semantic-error)' : 'var(--color-text-secondary)' }} className="mono">{item.diff}</td>
                        <td style={{ padding: 'var(--space-2) var(--space-3)', textAlign: 'center' }}><StatusTag variant={diffResultToVariant(item.result)} label={diffResultLabel(item.result)} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
