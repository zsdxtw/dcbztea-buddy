import { useState, useMemo } from 'react';
import ContentHeader from '../../components/layout/ContentHeader';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import type { StatCardData, CustomerItem, CustomerPlatform, CustomerType } from '../../types';
import {
  customerItems as initialCustomers,
  globalPlatforms,
  CUSTOMER_TYPE_LABELS,
  CUSTOMER_TYPE_DESC,
  LEVEL_COLORS,
} from '../../data/customers';

/* ── 销售模块色 ── */
const PRIMARY = '#0DAFC6';
const PRIMARY_LIGHT = '#EDF9FC';
const SECONDARY = '#FE019A';
const SECONDARY_LIGHT = '#FDF0EC';

/* ── Tab 配置 ── */
const TABS: { key: CustomerType; label: string; desc: string; icon: React.ReactNode }[] = [
  {
    key: 'direct', label: '直营客户', desc: CUSTOMER_TYPE_DESC.direct,
    icon: <svg viewBox="0 0 18 18" fill="none"><path d="M3 8.5L9 3.5l6 5" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" strokeLinecap="round" /><path d="M4.5 8v7h9v-7" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /></svg>,
  },
  {
    key: 'channel', label: '渠道客户', desc: CUSTOMER_TYPE_DESC.channel,
    icon: <svg viewBox="0 0 18 18" fill="none"><path d="M2 10l3 2 3-4 3 5 3-3 2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /><circle cx="4" cy="5" r="1.5" stroke="currentColor" strokeWidth="1.3" /></svg>,
  },
];

/* ═══════════════════════════════════════════════════════════════
 * 主页面
 * ═══════════════════════════════════════════════════════════════ */
export default function SalesCustomers() {
  const [activeTab, setActiveTab] = useState<CustomerType>('direct');
  const [keyword, setKeyword] = useState('');
  const [data, setData] = useState<CustomerItem[]>(initialCustomers);
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedForDelete, setSelectedForDelete] = useState<Set<string>>(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [detailCustomer, setDetailCustomer] = useState<CustomerItem | null>(null);
  const [platformsEditor, setPlatformsEditor] = useState<CustomerItem | null>(null);
  const [showAddDrawer, setShowAddDrawer] = useState(false);

  /* ── 筛选 ── */
  const tabCustomers = useMemo(() => data.filter(c => c.type === activeTab), [data, activeTab]);
  const filtered = useMemo(() => {
    if (!keyword) return tabCustomers;
    return tabCustomers.filter(c =>
      c.name.includes(keyword) || c.contactPerson.includes(keyword) || c.region.includes(keyword) || c.contactPhone.includes(keyword)
    );
  }, [tabCustomers, keyword]);

  /* ── 统计卡片 ── */
  const stats: StatCardData[] = useMemo(() => {
    const direct = data.filter(c => c.type === 'direct');
    const channel = data.filter(c => c.type === 'channel');
    const withPlatform = direct.filter(c => c.platforms.length > 0).length;
    const activeCount = data.filter(c => c.status === 'active').length;
    return [
      { label: '客户总数', value: String(data.length), unit: '家', trend: { direction: 'up', value: `合作中 ${activeCount}` }, icon: <IconUsers /> },
      { label: '直营客户', value: String(direct.length), unit: '家', trend: { direction: 'up', value: `含平台方 ${withPlatform}` }, icon: <IconHome /> },
      { label: '渠道客户', value: String(channel.length), unit: '家', trend: { direction: 'up', value: `合作中 ${channel.filter(c => c.status === 'active').length}` }, icon: <IconChannel /> },
      { label: '累计销售额', value: (data.reduce((s, c) => s + c.totalAmount, 0) / 10000).toFixed(1), unit: '万', trend: { direction: 'up', value: `月均 ¥126.4万` }, icon: <IconYuan /> },
    ];
  }, [data]);

  /* ── 删除 ── */
  const enterDeleteMode = () => { setDeleteMode(true); setSelectedForDelete(new Set()); };
  const exitDeleteMode = () => { setDeleteMode(false); setSelectedForDelete(new Set()); };
  const toggleSelect = (id: string) => setSelectedForDelete(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const confirmDelete = () => { setData(prev => prev.filter(c => !selectedForDelete.has(c.id))); setShowDeleteConfirm(false); exitDeleteMode(); };

  /* ── 平台方保存 ── */
  const savePlatforms = (id: string, platforms: CustomerPlatform[]) => {
    setData(prev => prev.map(c => c.id === id ? { ...c, platforms } : c));
    setPlatformsEditor(null);
  };

  /* ── 等级标签 ── */
  const levelTag = (level: string) => {
    const c = LEVEL_COLORS[level] || LEVEL_COLORS['C级'];
    return <span style={{ padding: '1px 8px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-medium)', background: c.bg, color: c.color, border: `1px solid ${c.color}30` }}>{level}</span>;
  };

  /* ── 状态标签 ── */
  const statusTag = (status: CustomerItem['status']) => (
    <span style={{
      padding: '2px 8px', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-medium)',
      background: status === 'active' ? '#E8F5E9' : '#FFF3E0',
      color: status === 'active' ? '#2E7D32' : '#E65100',
    }}>{status === 'active' ? '合作中' : '已暂停'}</span>
  );

  /* ── 平台方标签 ── */
  const platformTags = (platforms: CustomerPlatform[]) => {
    if (platforms.length === 0) return <span style={{ color: 'var(--color-neutral-300)' }}>-</span>;
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {platforms.slice(0, 2).map(p => (
          <span key={p.id} style={{
            padding: '1px 8px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-medium)',
            background: `${SECONDARY}15`, color: SECONDARY, border: `1px solid ${SECONDARY}30`,
          }}>{p.name}</span>
        ))}
        {platforms.length > 2 && <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-400)' }}>+{platforms.length - 2}</span>}
      </div>
    );
  };

  return (
    <div>
      <ContentHeader title="客户管理" breadcrumbs={['销售', '客户管理']} />

      {/* ── 统计卡片 ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)', marginBottom: 'var(--space-5)' }}>
        {stats.map((s, i) => <StatCard key={i} data={s} />)}
      </div>

      {/* ── 类型筛选卡片 ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-4)', marginBottom: 'var(--space-5)' }}>
        {TABS.map(t => {
          const count = data.filter(c => c.type === t.key).length;
          const isActive = activeTab === t.key;
          const withPlatform = t.key === 'direct' ? data.filter(c => c.type === 'direct' && c.platforms.length > 0).length : 0;
          return (
            <div key={t.key} onClick={() => setActiveTab(t.key)} style={{
              cursor: 'pointer', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)',
              border: isActive ? `2px solid ${PRIMARY}` : '1px solid var(--color-neutral-200)',
              background: isActive ? `${PRIMARY}08` : 'var(--color-neutral-0)',
              boxShadow: 'var(--shadow-sm)', transition: 'var(--transition-fast)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <span style={{ width: 32, height: 32, borderRadius: 'var(--radius-md)', background: isActive ? PRIMARY_LIGHT : 'var(--color-neutral-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isActive ? PRIMARY : 'var(--color-neutral-500)', transition: 'var(--transition-fast)' }}>{t.icon}</span>
                  <span style={{ fontWeight: 'var(--font-semibold)', fontSize: 'var(--text-base)', color: 'var(--color-neutral-800)' }}>{t.label}</span>
                </div>
                <span style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', color: isActive ? PRIMARY : 'var(--color-neutral-600)' }}>{count}</span>
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-500)', marginLeft: 40 }}>
                {t.desc}
                {t.key === 'direct' && <span style={{ color: SECONDARY, marginLeft: 8 }}>含平台方 {withPlatform} 家</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── 工具栏 ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
        <input className="filter-input" placeholder={`搜索${CUSTOMER_TYPE_LABELS[activeTab]}名称、联系人、地区...`} value={keyword} onChange={e => setKeyword(e.target.value)} style={{ width: 280 }} />
        <Button onClick={() => setShowAddDrawer(true)}>新增</Button>
        {deleteMode ? (
          <>
            <Button style={{ background: SECONDARY, borderColor: SECONDARY }} onClick={() => setShowDeleteConfirm(true)} disabled={selectedForDelete.size === 0}>删除所选({selectedForDelete.size})</Button>
            <Button variant="ghost" onClick={exitDeleteMode}>取消</Button>
          </>
        ) : (
          <Button style={{ background: SECONDARY, borderColor: SECONDARY }} onClick={enterDeleteMode}>删除</Button>
        )}
        <span style={{ marginLeft: 'auto', fontSize: 'var(--text-sm)', color: 'var(--color-neutral-400)' }}>共 {filtered.length} 个客户</span>
      </div>

      {/* ── 列表 ── */}
      <Card style={{ padding: 0 }}>
        <Table
          headers={[
            ...(deleteMode ? ['选择'] : ['序号']),
            '客户名称',
            ...(activeTab === 'direct' ? ['平台方'] : []),
            '地区', '联系人', '联系电话', '等级', '订单数', '累计金额', '状态', '操作',
          ]}
          rows={filtered.map((c, idx) => {
            const cells: React.ReactNode[] = [
              deleteMode
                ? <input key="chk" type="checkbox" checked={selectedForDelete.has(c.id)} onChange={() => toggleSelect(c.id)} />
                : <span key="idx" className="mono">{idx + 1}</span>,
              <span key="name" style={{ fontWeight: 'var(--font-medium)' }}>{c.name}</span>,
            ];
            if (activeTab === 'direct') cells.push(<span key="pf">{platformTags(c.platforms)}</span>);
            cells.push(
              <span key="region">{c.region}</span>,
              <span key="cp">{c.contactPerson}</span>,
              <span key="cph" className="mono" style={{ color: 'var(--color-neutral-600)' }}>{c.contactPhone}</span>,
              <span key="lv">{levelTag(c.level)}</span>,
              <span key="ord" className="mono">{c.orders}</span>,
              <span key="amt" className="mono" style={{ fontWeight: 'var(--font-medium)', color: SECONDARY }}>¥{(c.totalAmount / 10000).toFixed(1)}万</span>,
              <span key="st">{statusTag(c.status)}</span>,
              <div key="act" style={{ display: 'flex', gap: 8 }}>
                <Button size="sm" variant="ghost" onClick={() => setDetailCustomer(c)}>查看</Button>
                {activeTab === 'direct' && (
                  <Button size="sm" variant="ghost" style={{ color: SECONDARY }} onClick={() => setPlatformsEditor(c)}>平台方</Button>
                )}
              </div>,
            );
            return cells;
          })}
        />
      </Card>

      {/* ── 删除确认 ── */}
      {showDeleteConfirm && (
        <div className="category-dialog-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="category-dialog" onClick={e => e.stopPropagation()} style={{ maxWidth: 400 }}>
            <h3 style={{ marginBottom: 'var(--space-3)' }}>确认删除</h3>
            <p style={{ color: 'var(--color-neutral-600)', marginBottom: 'var(--space-4)' }}>确定要删除选中的 {selectedForDelete.size} 个客户吗？此操作不可撤销。</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>
              <Button variant="ghost" onClick={() => setShowDeleteConfirm(false)}>取消</Button>
              <Button style={{ background: SECONDARY, borderColor: SECONDARY }} onClick={confirmDelete}>确认删除</Button>
            </div>
          </div>
        </div>
      )}

      {/* ── 详情弹窗 ── */}
      {detailCustomer && (
        <div className="category-dialog-overlay" onClick={() => setDetailCustomer(null)}>
          <div className="category-dialog" onClick={e => e.stopPropagation()} style={{ maxWidth: 720, maxHeight: '90vh', overflow: 'auto' }}>
            {/* 头部 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
              <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-lg)', background: PRIMARY_LIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: PRIMARY, flexShrink: 0 }}>
                {detailCustomer.name.charAt(0)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 4 }}>
                  <span style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)' }}>{detailCustomer.name}</span>
                  <span style={{ padding: '1px 8px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-medium)', background: `${PRIMARY}15`, color: PRIMARY, border: `1px solid ${PRIMARY}30` }}>{CUSTOMER_TYPE_LABELS[detailCustomer.type]}</span>
                  {levelTag(detailCustomer.level)}
                  {statusTag(detailCustomer.status)}
                </div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-neutral-500)' }}>
                  {detailCustomer.region} · {detailCustomer.contactPerson} · {detailCustomer.contactPhone}
                </div>
              </div>
              <button className="drawer-close" onClick={() => setDetailCustomer(null)}>
                <svg viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
              </button>
            </div>

            {/* 基本信息 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
              {([
                ['联系邮箱', detailCustomer.contactEmail || '—'],
                ['联系地址', detailCustomer.contactAddress || '—'],
                ['结算方式', detailCustomer.settlementMethod || '—'],
                ['税号', detailCustomer.taxNo || '—'],
                ['合作日期', detailCustomer.cooperationDate],
                ['累计金额', `¥${(detailCustomer.totalAmount / 10000).toFixed(1)}万`],
              ] as [string, string][]).map(([label, value]) => (
                <div key={label} style={{ fontSize: 'var(--text-sm)' }}>
                  <span style={{ color: 'var(--color-neutral-500)' }}>{label}：</span>
                  <span style={{ color: 'var(--color-neutral-800)', fontWeight: 'var(--font-medium)' }}>{value}</span>
                </div>
              ))}
              {detailCustomer.remark && (
                <div style={{ gridColumn: '1 / -1', fontSize: 'var(--text-sm)' }}>
                  <span style={{ color: 'var(--color-neutral-500)' }}>备注：</span>
                  <span style={{ color: 'var(--color-neutral-800)' }}>{detailCustomer.remark}</span>
                </div>
              )}
            </div>

            {/* 平台方信息（仅直营客户） */}
            {detailCustomer.type === 'direct' && (
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                  <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--color-neutral-700)' }}>平台方（{detailCustomer.platforms.length}）</h4>
                  <Button size="sm" onClick={() => { setPlatformsEditor(detailCustomer); setDetailCustomer(null); }}>平台方设置</Button>
                </div>
                {detailCustomer.platforms.length === 0 ? (
                  <div style={{ padding: 'var(--space-4)', background: 'var(--color-neutral-50)', borderRadius: 'var(--radius-md)', textAlign: 'center', fontSize: 'var(--text-sm)', color: 'var(--color-neutral-400)' }}>
                    暂无平台方，可点击"平台方设置"添加
                  </div>
                ) : (
                  <Card style={{ padding: 0 }}>
                    <Table
                      headers={['平台方名称', '编码', '联系人', '联系电话', '合作日期']}
                      rows={detailCustomer.platforms.map(p => [
                        <span key="n" style={{ fontWeight: 'var(--font-medium)' }}>{p.name}</span>,
                        <span key="c" className="mono">{p.code}</span>,
                        <span key="cp">{p.contactPerson}</span>,
                        <span key="cph" className="mono">{p.contactPhone}</span>,
                        <span key="d" className="mono">{p.cooperationDate}</span>,
                      ])}
                    />
                  </Card>
                )}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-4)' }}>
              <Button variant="ghost" onClick={() => setDetailCustomer(null)}>关闭</Button>
            </div>
          </div>
        </div>
      )}

      {/* ── 平台方设置弹窗 ── */}
      {platformsEditor && (
        <PlatformEditor
          customer={platformsEditor}
          onCancel={() => setPlatformsEditor(null)}
          onSave={platforms => savePlatforms(platformsEditor.id, platforms)}
        />
      )}

      {/* ── 新增客户抽屉 ── */}
      {showAddDrawer && (
        <CreateDrawer
          customerType={activeTab}
          onCancel={() => setShowAddDrawer(false)}
          onSave={item => { setData(prev => [item, ...prev]); setShowAddDrawer(false); }}
        />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
 * 平台方设置弹窗
 * ═══════════════════════════════════════════════════════════════ */
function PlatformEditor({ customer, onCancel, onSave }: {
  customer: CustomerItem;
  onCancel: () => void;
  onSave: (platforms: CustomerPlatform[]) => void;
}) {
  const [selected, setSelected] = useState<CustomerPlatform[]>(customer.platforms);
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [customForm, setCustomForm] = useState<Partial<CustomerPlatform>>({
    name: '', code: '', contactPerson: '', contactPhone: '', cooperationDate: new Date().toISOString().slice(0, 10),
  });

  const toggleGlobal = (p: CustomerPlatform) => {
    setSelected(prev => prev.find(x => x.id === p.id) ? prev.filter(x => x.id !== p.id) : [...prev, p]);
  };
  const removeSelected = (id: string) => setSelected(prev => prev.filter(p => p.id !== id));
  const addCustom = () => {
    if (!customForm.name || !customForm.code) return;
    setSelected(prev => [...prev, { ...customForm, id: `custom_${Date.now()}` } as CustomerPlatform]);
    setCustomForm({ name: '', code: '', contactPerson: '', contactPhone: '', cooperationDate: new Date().toISOString().slice(0, 10) });
    setShowAddCustom(false);
  };

  return (
    <div className="category-dialog-overlay" onClick={onCancel}>
      <div className="category-dialog" onClick={e => e.stopPropagation()} style={{ maxWidth: 720, maxHeight: '90vh', overflow: 'auto' }}>
        {/* 头部 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
          <div>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)', marginBottom: 2 }}>平台方设置</h3>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-500)' }}>
              客户：{customer.name} · 销售订单可从已选平台方中选择唯一的一个
            </div>
          </div>
          <button className="drawer-close" onClick={onCancel}>
            <svg viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </button>
        </div>

        {/* 已选平台方 */}
        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-2)' }}>
          已选平台方（{selected.length}）
        </div>
        <div style={{ minHeight: 44, padding: 'var(--space-3)', background: 'var(--color-neutral-50)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-4)' }}>
          {selected.length === 0 ? (
            <span style={{ color: 'var(--color-neutral-400)', fontSize: 'var(--text-xs)' }}>暂无平台方，请从下方选择或新增</span>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {selected.map(p => (
                <div key={p.id} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px',
                  background: `${SECONDARY}15`, color: SECONDARY, borderRadius: 'var(--radius-sm)',
                  fontSize: 'var(--text-xs)', border: `1px solid ${SECONDARY}30`, fontWeight: 'var(--font-medium)',
                }}>
                  {p.name}
                  <span className="mono" style={{ color: 'var(--color-neutral-500)', fontWeight: 'normal' }}>({p.code})</span>
                  <button onClick={() => removeSelected(p.id)} style={{ cursor: 'pointer', border: 'none', background: 'transparent', color: SECONDARY, fontSize: 14, lineHeight: 1, padding: 0 }}>×</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 从公共平台方选择 */}
        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-2)' }}>从平台方列表中选择</div>
        <Card style={{ padding: 0, marginBottom: 'var(--space-4)' }}>
          <Table
            headers={['选择', '平台方名称', '编码', '联系人', '联系电话', '合作日期']}
            rows={globalPlatforms.map(p => {
              const checked = !!selected.find(s => s.id === p.id);
              return [
                <input key="chk" type="checkbox" checked={checked} onChange={() => toggleGlobal(p)} />,
                <span key="n" style={{ fontWeight: 'var(--font-medium)' }}>{p.name}</span>,
                <span key="c" className="mono">{p.code}</span>,
                <span key="cp">{p.contactPerson}</span>,
                <span key="cph" className="mono">{p.contactPhone}</span>,
                <span key="d" className="mono">{p.cooperationDate}</span>,
              ];
            })}
          />
        </Card>

        {/* 自定义新增 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
          <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)' }}>新增自定义平台方</div>
          <button className="link-button" style={{ color: SECONDARY }} onClick={() => setShowAddCustom(v => !v)}>
            {showAddCustom ? '收起' : '+ 添加自定义平台方'}
          </button>
        </div>
        {showAddCustom && (
          <div style={{ background: 'var(--color-neutral-50)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
              <div><label className="drawer-label">平台方名称 *</label><input className="filter-input" style={{ width: '100%' }} value={customForm.name || ''} onChange={e => setCustomForm(prev => ({ ...prev, name: e.target.value }))} placeholder="如：XX企业采购平台" /></div>
              <div><label className="drawer-label">平台方编码 *</label><input className="filter-input" style={{ width: '100%' }} value={customForm.code || ''} onChange={e => setCustomForm(prev => ({ ...prev, code: e.target.value }))} placeholder="编码（如 JDHCGO）" /></div>
              <div><label className="drawer-label">联系人</label><input className="filter-input" style={{ width: '100%' }} value={customForm.contactPerson || ''} onChange={e => setCustomForm(prev => ({ ...prev, contactPerson: e.target.value }))} /></div>
              <div><label className="drawer-label">联系电话</label><input className="filter-input" style={{ width: '100%' }} value={customForm.contactPhone || ''} onChange={e => setCustomForm(prev => ({ ...prev, contactPhone: e.target.value }))} /></div>
              <div><label className="drawer-label">合作日期</label><input className="filter-input" style={{ width: '100%' }} type="date" value={customForm.cooperationDate || ''} onChange={e => setCustomForm(prev => ({ ...prev, cooperationDate: e.target.value }))} /></div>
            </div>
            <div style={{ marginTop: 'var(--space-3)', display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={addCustom} disabled={!customForm.name || !customForm.code}>添加</Button>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>
          <Button variant="ghost" onClick={onCancel}>取消</Button>
          <Button onClick={() => onSave(selected)}>保存</Button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
 * 新增客户抽屉
 * ═══════════════════════════════════════════════════════════════ */
function CreateDrawer({ customerType, onCancel, onSave }: {
  customerType: CustomerType;
  onCancel: () => void;
  onSave: (item: CustomerItem) => void;
}) {
  const [form, setForm] = useState<CustomerItem>({
    id: `c_${Date.now()}`, name: '', type: customerType, region: '', contactPerson: '', contactPhone: '',
    contactEmail: '', contactAddress: '', level: 'B级', orders: 0, totalAmount: 0, platforms: [],
    cooperationDate: new Date().toISOString().slice(0, 10), status: 'active', settlementMethod: '月结', taxNo: '', remark: '',
  });
  const [selectedPlatforms, setSelectedPlatforms] = useState<CustomerPlatform[]>([]);

  const update = <K extends keyof CustomerItem>(k: K, v: CustomerItem[K]) => setForm(prev => ({ ...prev, [k]: v }));
  const togglePlatform = (p: CustomerPlatform) => {
    setSelectedPlatforms(prev => prev.find(x => x.id === p.id) ? prev.filter(x => x.id !== p.id) : [...prev, p]);
  };
  const canSave = form.name.trim().length > 0 && form.contactPerson.trim().length > 0;

  const handleSave = () => {
    if (!canSave) return;
    onSave({ ...form, platforms: customerType === 'direct' ? selectedPlatforms : [] });
  };

  return (
    <div className="drawer-overlay" onClick={onCancel}>
      <div className="drawer-panel" onClick={e => e.stopPropagation()}>
        <div className="drawer-header">
          <span className="drawer-title">新增{CUSTOMER_TYPE_LABELS[customerType]}</span>
          <button className="drawer-close" onClick={onCancel}>
            <svg viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </button>
        </div>
        <div className="drawer-body">
          {/* 基本信息 */}
          <div className="drawer-section-title">基本信息</div>
          <div className="drawer-form-row">
            <div className="drawer-form-field"><label className="drawer-label">客户名称 *</label><input className="filter-input" style={{ width: '100%' }} value={form.name} onChange={e => update('name', e.target.value)} placeholder="请输入客户名称" /></div>
            <div className="drawer-form-field"><label className="drawer-label">客户等级</label><select className="filter-select" style={{ width: '100%' }} value={form.level} onChange={e => update('level', e.target.value)}><option>S级</option><option>A级</option><option>B级</option><option>C级</option></select></div>
            <div className="drawer-form-field"><label className="drawer-label">地区</label><input className="filter-input" style={{ width: '100%' }} value={form.region} onChange={e => update('region', e.target.value)} placeholder="如：上海" /></div>
          </div>
          <div className="drawer-form-row">
            <div className="drawer-form-field"><label className="drawer-label">联系人 *</label><input className="filter-input" style={{ width: '100%' }} value={form.contactPerson} onChange={e => update('contactPerson', e.target.value)} placeholder="请输入联系人" /></div>
            <div className="drawer-form-field"><label className="drawer-label">联系电话</label><input className="filter-input" style={{ width: '100%' }} value={form.contactPhone} onChange={e => update('contactPhone', e.target.value)} placeholder="请输入电话" /></div>
            <div className="drawer-form-field"><label className="drawer-label">联系邮箱</label><input className="filter-input" style={{ width: '100%' }} value={form.contactEmail || ''} onChange={e => update('contactEmail', e.target.value)} placeholder="请输入邮箱" /></div>
          </div>
          <div className="drawer-form-row">
            <div className="drawer-form-field" style={{ flex: 2 }}><label className="drawer-label">联系地址</label><input className="filter-input" style={{ width: '100%' }} value={form.contactAddress || ''} onChange={e => update('contactAddress', e.target.value)} placeholder="请输入详细地址" /></div>
            <div className="drawer-form-field"><label className="drawer-label">合作日期</label><input className="filter-input" style={{ width: '100%' }} type="date" value={form.cooperationDate} onChange={e => update('cooperationDate', e.target.value)} /></div>
          </div>

          {/* 合作信息 */}
          <div className="drawer-section-title">合作信息</div>
          <div className="drawer-form-row">
            <div className="drawer-form-field"><label className="drawer-label">结算方式</label><select className="filter-select" style={{ width: '100%' }} value={form.settlementMethod || ''} onChange={e => update('settlementMethod', e.target.value)}><option value="月结">月结</option><option value="预付">预付</option><option value="季度">季度结算</option><option value="现款">现款</option></select></div>
            <div className="drawer-form-field"><label className="drawer-label">税号</label><input className="filter-input" style={{ width: '100%' }} value={form.taxNo || ''} onChange={e => update('taxNo', e.target.value)} placeholder="请输入税号" /></div>
            <div className="drawer-form-field"><label className="drawer-label">状态</label><select className="filter-select" style={{ width: '100%' }} value={form.status} onChange={e => update('status', e.target.value as CustomerItem['status'])}><option value="active">合作中</option><option value="inactive">已暂停</option></select></div>
          </div>
          <div className="drawer-form-row">
            <div className="drawer-form-field" style={{ flex: 1 }}><label className="drawer-label">备注</label><input className="filter-input" style={{ width: '100%' }} value={form.remark || ''} onChange={e => update('remark', e.target.value)} placeholder="请输入备注" /></div>
          </div>

          {/* 平台方（仅直营客户） */}
          {customerType === 'direct' && (
            <>
              <div className="drawer-section-title">平台方（可多选，下单时选择唯一的一个）</div>
              {selectedPlatforms.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 'var(--space-3)' }}>
                  {selectedPlatforms.map(p => (
                    <div key={p.id} style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px',
                      background: `${SECONDARY}15`, color: SECONDARY, borderRadius: 'var(--radius-sm)',
                      fontSize: 'var(--text-xs)', border: `1px solid ${SECONDARY}30`, fontWeight: 'var(--font-medium)',
                    }}>
                      {p.name}
                      <span className="mono" style={{ color: 'var(--color-neutral-500)', fontWeight: 'normal' }}>({p.code})</span>
                      <button onClick={() => togglePlatform(p)} style={{ cursor: 'pointer', border: 'none', background: 'transparent', color: SECONDARY, fontSize: 14, lineHeight: 1, padding: 0 }}>×</button>
                    </div>
                  ))}
                </div>
              )}
              <div style={{ background: 'var(--color-neutral-50)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3)' }}>
                <Table
                  headers={['选择', '平台方名称', '编码', '联系人', '联系电话']}
                  rows={globalPlatforms.map(p => {
                    const checked = !!selectedPlatforms.find(s => s.id === p.id);
                    return [
                      <input key="chk" type="checkbox" checked={checked} onChange={() => togglePlatform(p)} />,
                      <span key="n" style={{ fontWeight: 'var(--font-medium)' }}>{p.name}</span>,
                      <span key="c" className="mono">{p.code}</span>,
                      <span key="cp">{p.contactPerson}</span>,
                      <span key="cph" className="mono">{p.contactPhone}</span>,
                    ];
                  })}
                />
              </div>
            </>
          )}
        </div>
        <div className="drawer-footer">
          <Button variant="ghost" onClick={onCancel}>取消</Button>
          <Button onClick={handleSave} disabled={!canSave}>保存</Button>
        </div>
      </div>
    </div>
  );
}

/* ── SVG 图标 ── */
function IconUsers() { return <svg viewBox="0 0 18 18" fill="none"><circle cx="7" cy="6.5" r="2.8" stroke="currentColor" strokeWidth="1.3" /><path d="M1 15c0-3 2.7-5 6-5s6 2 6 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /><circle cx="13" cy="7" r="2.2" stroke="currentColor" strokeWidth="1.2" /><path d="M13 11c2 0 4 1.5 4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>; }
function IconHome() { return <svg viewBox="0 0 18 18" fill="none"><path d="M3 8.5L9 3.5l6 5" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" strokeLinecap="round" /><path d="M4.5 8v7h9v-7" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /></svg>; }
function IconChannel() { return <svg viewBox="0 0 18 18" fill="none"><path d="M2 10l3 2 3-4 3 5 3-3 2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /><circle cx="4" cy="5" r="1.5" stroke="currentColor" strokeWidth="1.3" /></svg>; }
function IconYuan() { return <svg viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.3" /><path d="M6 6l3 4 3-4M6 11h6M9 10v4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>; }
