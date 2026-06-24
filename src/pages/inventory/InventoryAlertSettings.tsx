import { useState } from 'react';
import ContentHeader from '../../components/layout/ContentHeader';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Tag from '../../components/common/Tag';
import StatusTag from '../../components/common/StatusTag';
import Toggle from '../../components/common/Toggle';
import FilterBar, { FilterInput, FilterSelect } from '../../components/business/FilterBar';
import { TeaCategory } from '../../types';
import type { StatCardData } from '../../types';

/* ── 统计数据 ── */
const stats: StatCardData[] = [
  { label: '预警规则数', value: '8', unit: '条', icon: <svg viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.3"/><path d="M9 6v4M9 12.5v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> },
  { label: '已触发预警', value: '5', trend: { direction: 'up', value: '需关注' }, icon: <svg viewBox="0 0 18 18" fill="none"><path d="M10 3a5 5 0 015 5v3l2 2H3l2-2V8a5 5 0 015-5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><path d="M8 15a2 2 0 004 0" stroke="currentColor" strokeWidth="1.3"/></svg> },
  { label: '预警商品数', value: '12', unit: '种', trend: { direction: 'down', value: '-3种' }, icon: <svg viewBox="0 0 18 18" fill="none"><rect x="4" y="4" width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M4 8h10M8 4v10" stroke="currentColor" strokeWidth="1.2"/></svg> },
  { label: '预警类型数', value: '4', unit: '种', icon: <svg viewBox="0 0 18 18" fill="none"><rect x="3" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3"/><rect x="11" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3"/><rect x="3" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3"/><rect x="11" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3"/></svg> },
];

/* ── 模拟数据 ── */
interface AlertRule {
  id: string;
  product: string;
  teaCategory: TeaCategory;
  warehouse: string;
  alertType: '库存下限' | '库存上限';
  threshold: string;
  enabled: boolean;
  triggered: boolean;
}

const initialRules: AlertRule[] = [
  { id: '1', product: '正山小种 — 特级', teaCategory: TeaCategory.RED, warehouse: '武夷仓区', alertType: '库存下限', threshold: '20 kg', enabled: true, triggered: true },
  { id: '2', product: '碧螺春 — 一级', teaCategory: TeaCategory.GREEN, warehouse: '苏州分仓', alertType: '库存下限', threshold: '15 kg', enabled: true, triggered: true },
  { id: '3', product: '白毫银针 — 特级', teaCategory: TeaCategory.WHITE, warehouse: '福鼎分仓', alertType: '库存下限', threshold: '30 kg', enabled: true, triggered: false },
  { id: '4', product: '铁观音 — 一级', teaCategory: TeaCategory.OOLONG, warehouse: '安溪分仓', alertType: '库存下限', threshold: '25 kg', enabled: true, triggered: false },
  { id: '5', product: '熟普洱 — 三级', teaCategory: TeaCategory.DARK, warehouse: '云南总仓', alertType: '库存上限', threshold: '800 kg', enabled: false, triggered: false },
  { id: '6', product: '明前龙井 — 特级', teaCategory: TeaCategory.GREEN, warehouse: '杭州总仓', alertType: '库存上限', threshold: '500 kg', enabled: true, triggered: false },
  { id: '7', product: '大红袍 — 特级', teaCategory: TeaCategory.OOLONG, warehouse: '武夷仓区', alertType: '库存下限', threshold: '30 kg', enabled: true, triggered: true },
  { id: '8', product: '金骏眉 — 特级', teaCategory: TeaCategory.RED, warehouse: '武夷仓区', alertType: '库存下限', threshold: '25 kg', enabled: false, triggered: false },
];

export default function InventoryAlertSettings() {
  const [rules, setRules] = useState<AlertRule[]>(initialRules);
  const [showDrawer, setShowDrawer] = useState(false);
  const [editingRule, setEditingRule] = useState<AlertRule | null>(null);

  const handleToggle = (id: string, active: boolean) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, enabled: active } : r));
  };

  const handleAdd = () => {
    setEditingRule(null);
    setShowDrawer(true);
  };

  const handleEdit = (rule: AlertRule) => {
    setEditingRule(rule);
    setShowDrawer(true);
  };

  const handleCloseDrawer = () => {
    setShowDrawer(false);
    setEditingRule(null);
  };

  return (
    <>
      <ContentHeader title="预警设置" breadcrumbs={['仓储', '预警设置']} actions={<Button><PlusIcon />新增预警规则</Button>} />
      <div className="content-body">
        <div className="stat-cards">
          {stats.map((s, i) => <StatCard key={i} data={s} />)}
        </div>
        <FilterBar>
          <FilterInput placeholder="搜索商品名称..." />
          <FilterSelect options={['全部预警类型', '库存下限', '库存上限']} />
          <FilterSelect options={['全部仓库', '杭州总仓', '武夷仓区', '苏州分仓', '安溪分仓', '福鼎分仓', '云南总仓']} />
          <FilterSelect options={['全部状态', '已启用', '已禁用', '已触发']} />
        </FilterBar>
        <Card>
          <Table
            headers={['商品', '茶类', '仓库', '预警类型', '阈值', '状态', '操作']}
            rows={rules.map((r) => [
              <span style={{ fontWeight: 'var(--font-medium)' }}>{r.product}</span>,
              <Tag category={r.teaCategory} />,
              r.warehouse,
              <span style={{ color: r.alertType === '库存下限' ? 'var(--color-semantic-warning)' : 'var(--color-semantic-info)', fontWeight: 'var(--font-medium)' }}>{r.alertType}</span>,
              <span className="mono">{r.threshold}</span>,
              r.triggered && r.enabled
                ? <StatusTag variant="error" label="已触发" />
                : r.enabled
                  ? <StatusTag variant="success" label="已启用" />
                  : <StatusTag variant="warning" label="已禁用" />,
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <Toggle active={r.enabled} onChange={(active) => handleToggle(r.id, active)} />
                <Button size="sm" variant="ghost" onClick={() => handleEdit(r)}>编辑</Button>
              </div>,
            ])}
          />
        </Card>
      </div>

      {/* 新增/编辑预警规则抽屉 */}
      {showDrawer && (
        <div className="drawer-overlay" onClick={handleCloseDrawer}>
          <div className="drawer-panel" onClick={(e) => e.stopPropagation()} style={{ width: 480 }}>
            <div className="drawer-header">
              <span className="drawer-title">{editingRule ? '编辑预警规则' : '新增预警规则'}</span>
              <button className="drawer-close" onClick={handleCloseDrawer}>
                <svg viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
              </button>
            </div>

            <div className="drawer-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div>
                  <label className="drawer-label">商品名称</label>
                  <input className="filter-input" placeholder="请输入商品名称" defaultValue={editingRule?.product ?? ''} style={{ width: '100%' }} />
                </div>
                <div>
                  <label className="drawer-label">茶类</label>
                  <select className="filter-select" defaultValue={editingRule?.teaCategory ?? ''} style={{ width: '100%' }}>
                    <option value="">请选择茶类</option>
                    <option value="green">绿茶</option>
                    <option value="white">白茶</option>
                    <option value="yellow">黄茶</option>
                    <option value="oolong">青茶</option>
                    <option value="red">红茶</option>
                    <option value="dark">黑茶</option>
                    <option value="flower">花草茶</option>
                  </select>
                </div>
                <div>
                  <label className="drawer-label">仓库</label>
                  <select className="filter-select" defaultValue={editingRule?.warehouse ?? ''} style={{ width: '100%' }}>
                    <option value="">请选择仓库</option>
                    <option value="杭州总仓">杭州总仓</option>
                    <option value="武夷仓区">武夷仓区</option>
                    <option value="苏州分仓">苏州分仓</option>
                    <option value="安溪分仓">安溪分仓</option>
                    <option value="福鼎分仓">福鼎分仓</option>
                    <option value="云南总仓">云南总仓</option>
                  </select>
                </div>
                <div>
                  <label className="drawer-label">预警类型</label>
                  <select className="filter-select" defaultValue={editingRule?.alertType ?? ''} style={{ width: '100%' }}>
                    <option value="">请选择预警类型</option>
                    <option value="库存下限">库存下限</option>
                    <option value="库存上限">库存上限</option>
                  </select>
                </div>
                <div>
                  <label className="drawer-label">预警阈值</label>
                  <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <input className="filter-input" placeholder="请输入阈值" defaultValue={editingRule?.threshold?.replace(' kg', '') ?? ''} style={{ flex: 1 }} />
                    <select className="filter-select" defaultValue="kg" style={{ width: 80 }}>
                      <option value="kg">kg</option>
                      <option value="件">件</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="drawer-label">启用状态</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginTop: 'var(--space-1)' }}>
                    <Toggle active={editingRule?.enabled ?? true} onChange={() => {}} />
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{(editingRule?.enabled ?? true) ? '已启用' : '已禁用'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="drawer-footer">
              <Button variant="ghost" onClick={handleCloseDrawer}>取消</Button>
              <Button>保存</Button>
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
