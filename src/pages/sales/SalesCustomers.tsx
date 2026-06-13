import { useState, useMemo } from 'react';
import ContentHeader from '../../components/layout/ContentHeader';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import type { StatCardData, CustomerItem, CustomerPlatform, CustomerType } from '../../types';
import { customerItems as initialCustomers, globalPlatforms, CUSTOMER_TYPE_LABELS, CUSTOMER_TYPE_DESCRIPTIONS } from '../../data/customers';

/* ── 标签页项 ── */
const TABS: { key: CustomerType; label: string; desc: string }[] = [
  { key: 'direct', label: '直营客户', desc: CUSTOMER_TYPE_DESCRIPTIONS.direct },
  { key: 'channel', label: '渠道客户', desc: CUSTOMER_TYPE_DESCRIPTIONS.channel },
];

/* ── 等级标签样式 ── */
const LEVEL_COLORS: Record<string, { bg: string; color: string }> = {
  'S级': { bg: 'rgba(203,64,93,0.10)', color: '#CB405D' },
  'A级': { bg: 'var(--color-module-current-lightest)', color: 'var(--color-module-current-base)' },
  'B级': { bg: 'rgba(13,175,198,0.10)', color: '#0DAFC6' },
  'C级': { bg: 'var(--color-neutral-100)', color: 'var(--color-neutral-500)' },
};

export default function SalesCustomers() {
  const [activeTab, setActiveTab] = useState<CustomerType>('direct');
  const [keyword, setKeyword] = useState('');
  const [data, setData] = useState<CustomerItem[]>(initialCustomers);
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedForDelete, setSelectedForDelete] = useState<Set<string>>(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [detailCustomer, setDetailCustomer] = useState<CustomerItem | null>(null);
  const [platformsEditor, setPlatformsEditor] = useState<CustomerItem | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  /* ── 当前Tab客户 ── */
  const tabCustomers = useMemo(() => data.filter(c => c.type === activeTab), [data, activeTab]);

  /* ── 搜索过滤 ── */
  const filtered = useMemo(() => {
    return tabCustomers.filter(c => {
      if (!keyword) return true;
      return c.name.includes(keyword) || c.contactPerson.includes(keyword) || c.region.includes(keyword) || c.contactPhone.includes(keyword);
    });
  }, [tabCustomers, keyword]);

  /* ── 统计卡片 ── */
  const stats: StatCardData[] = useMemo(() => {
    const direct = data.filter(c => c.type === 'direct');
    const channel = data.filter(c => c.type === 'channel');
    const withPlatform = direct.filter(c => c.platforms.length > 0).length;
    const activeCount = data.filter(c => c.status === 'active').length;
    return [
      { label: '客户总数', value: String(data.length), unit: '家', icon: <IconUser />, trend: { direction: 'up', value: `合作中 ${activeCount}` } },
      { label: '直营客户', value: String(direct.length), unit: '家', icon: <IconHome />, trend: { direction: 'up', value: `含平台方 ${withPlatform}` } },
      { label: '渠道客户', value: String(channel.length), unit: '家', icon: <IconChannel />, trend: { direction: 'up', value: `待新增 0` } },
      { label: '累计销售额', value: (data.reduce((s, c) => s + c.totalAmount, 0) / 10000).toFixed(1), unit: '万', icon: <IconYuan />, trend: { direction: 'up', value: `月均 ¥126.4万` } },
    ];
  }, [data]);

  /* ── 删除模式 ── */
  const enterDeleteMode = () => { setDeleteMode(true); setSelectedForDelete(new Set()); };
  const exitDeleteMode = () => { setDeleteMode(false); setSelectedForDelete(new Set()); };
  const toggleSelect = (id: string) => {
    setSelectedForDelete(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };
  const confirmDelete = () => {
    setData(prev => prev.filter(c => !selectedForDelete.has(c.id)));
    setShowDeleteConfirm(false);
    exitDeleteMode();
  };

  /* ── 平台方保存 ── */
  const savePlatforms = (customerId: string, newPlatforms: CustomerPlatform[]) => {
    setData(prev => prev.map(c => c.id === customerId ? { ...c, platforms: newPlatforms } : c));
    setPlatformsEditor(null);
  };

  return (
    <>
      <ContentHeader title="客户管理" breadcrumbs={['销售', '客户管理']} />
      <div className="content-body">
        {/* 统计卡片 */}
        <div className="stat-cards">
          {stats.map((s, i) => <StatCard key={i} data={s} />)}
        </div>

        {/* Tab 切换 */}
        <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-neutral-200)', paddingBottom: 0 }}>
          {TABS.map(t => {
            const count = data.filter(c => c.type === t.key).length;
            const active = activeTab === t.key;
            return (
              <div key={t.key}
                onClick={() => setActiveTab(t.key)}
                style={{
                  padding: 'var(--space-3) var(--space-5)', cursor: 'pointer', position: 'relative',
                  fontSize: 'var(--text-sm)', fontWeight: active ? 'var(--font-semibold)' : 'var(--font-medium)',
                  color: active ? 'var(--color-module-current-base)' : 'var(--color-neutral-600)',
                  transition: 'var(--transition-fast)', borderBottom: active ? `2px solid var(--color-module-current-base)` : '2px solid transparent',
                  marginBottom: -1,
                }}>
                {t.label} <span style={{ marginLeft: 4, fontSize: 'var(--text-xs)', color: active ? 'var(--color-module-current-base)' : 'var(--color-neutral-400)' }}>({count})</span>
              </div>
            );
          })}
        </div>

        {/* 当前Tab说明 */}
        <Card style={{ marginBottom: 'var(--space-4)', padding: 'var(--space-4) var(--space-5)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-4)' }}>
            <div>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--color-neutral-800)', marginBottom: 2 }}>
                {TABS.find(t => t.key === activeTab)?.label}
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-500)' }}>
                {TABS.find(t => t.key === activeTab)?.desc}
                {activeTab === 'direct' && '；可为直营客户配置多个平台方，下单时选择唯一的平台方'}
              </div>
            </div>
            {activeTab === 'direct' && (
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-500)' }}>
                含平台方客户 <span style={{ color: 'var(--color-module-current-base)', fontWeight: 'var(--font-semibold)' }}>{data.filter(c => c.type === 'direct' && c.platforms.length > 0).length}</span> 家
              </div>
            )}
          </div>
        </Card>

        {/* 搜索 + 操作 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
          <input className="filter-input" placeholder={`搜索${CUSTOMER_TYPE_LABELS[activeTab]}名称、联系人、地区...`} value={keyword} onChange={e => setKeyword(e.target.value)} />
          <Button onClick={() => setShowCreate(true)}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <svg viewBox="0 0 16 16" width={14} height={14} fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
              新增{CUSTOMER_TYPE_LABELS[activeTab]}
            </span>
          </Button>
          {deleteMode ? (
            <>
              <Button onClick={() => setShowDeleteConfirm(true)} disabled={selectedForDelete.size === 0} style={{ background: '#FD742D', borderColor: '#FD742D' }}>
                删除所选({selectedForDelete.size})
              </Button>
              <Button variant="ghost" onClick={exitDeleteMode} style={{ color: 'var(--color-neutral-500)' }}>取消</Button>
            </>
          ) : (
            <Button style={{ background: '#FD742D', borderColor: '#FD742D' }} onClick={enterDeleteMode}>删除</Button>
          )}
          <span style={{ marginLeft: 'auto', fontSize: 'var(--text-xs)', color: 'var(--color-neutral-400)' }}>共 {filtered.length} 个客户</span>
        </div>

        {/* 列表 */}
        <Card>
          <Table
            headers={[
              deleteMode ? '选择' : '序号', '客户名称',
              ...(activeTab === 'direct' ? ['平台方'] : []),
              '地区', '联系人', '联系电话', '等级', '订单数', '累计金额', '状态', '操作'
            ]}
            rows={filtered.map((c, idx) => {
              const cells: (string | number | React.ReactNode)[] = [
                deleteMode
                  ? <input type="checkbox" checked={selectedForDelete.has(c.id)} onChange={() => toggleSelect(c.id)} />
                  : <span className="mono">{idx + 1}</span>,
                <span style={{ fontWeight: 'var(--font-medium)' }}>{c.name}</span>,
              ];
              if (activeTab === 'direct') {
                cells.push(c.platforms.length > 0 ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {c.platforms.slice(0, 2).map(p => (
                      <span key={p.id} style={{
                        padding: '2px 8px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)',
                        background: 'rgba(13,175,198,0.10)', color: '#0DAFC6', border: '1px solid rgba(13,175,198,0.25)',
                      }}>{p.name}</span>
                    ))}
                    {c.platforms.length > 2 && <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-400)' }}>+{c.platforms.length - 2}</span>}
                  </div>
                ) : <span style={{ color: 'var(--color-neutral-300)' }}>-</span>);
              }
              cells.push(
                <span>{c.region}</span>,
                <span>{c.contactPerson}</span>,
                <span className="mono">{c.contactPhone}</span>,
                <span style={levelStyle(c.level)}>{c.level}</span>,
                <span className="mono">{c.orders}</span>,
                <span className="mono" style={{ fontWeight: 'var(--font-medium)' }}>¥{(c.totalAmount / 10000).toFixed(1)}万</span>,
                <span style={statusStyle(c.status)}>{c.status === 'active' ? '合作中' : '已暂停'}</span>,
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="link-button" onClick={() => setDetailCustomer(c)}>详情</button>
                  {activeTab === 'direct' && (
                    <button className="link-button" style={{ color: '#0DAFC6' }} onClick={() => setPlatformsEditor(c)}>
                      平台方设置
                    </button>
                  )}
                </div>
              );
              return cells;
            })}
          />
        </Card>
      </div>

      {/* 详情弹窗 */}
      {detailCustomer && (
        <div className="category-dialog-overlay" onClick={() => setDetailCustomer(null)}>
          <div className="category-dialog" style={{ width: 620, maxWidth: '92vw' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
              <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)' }}>客户详情</div>
              <button className="drawer-close" onClick={() => setDetailCustomer(null)}><svg viewBox="0 0 16 16"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg></button>
            </div>
            <DetailGrid customer={detailCustomer} />
            {detailCustomer.type === 'direct' && detailCustomer.platforms.length > 0 && (
              <>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', margin: 'var(--space-5) 0 var(--space-3)' }}>
                  平台方（{detailCustomer.platforms.length}）
                </div>
                <Card style={{ padding: 0 }}>
                  <Table
                    headers={['平台方名称', '编码', '联系人', '联系电话', '合作日期']}
                    rows={detailCustomer.platforms.map(p => [
                      <span style={{ fontWeight: 'var(--font-medium)' }}>{p.name}</span>,
                      <span className="mono">{p.code}</span>,
                      p.contactPerson,
                      <span className="mono">{p.contactPhone}</span>,
                      <span className="mono">{p.cooperationDate}</span>,
                    ])}
                  />
                </Card>
              </>
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-5)', gap: 'var(--space-2)' }}>
              <Button variant="ghost" onClick={() => setDetailCustomer(null)}>关闭</Button>
              {detailCustomer.type === 'direct' && (
                <Button onClick={() => { setPlatformsEditor(detailCustomer); setDetailCustomer(null); }}>
                  平台方设置
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 平台方设置弹窗 */}
      {platformsEditor && (
        <PlatformEditor
          customer={platformsEditor}
          onCancel={() => setPlatformsEditor(null)}
          onSave={(platforms) => savePlatforms(platformsEditor.id, platforms)}
        />
      )}

      {/* 删除确认 */}
      {showDeleteConfirm && (
        <div className="category-dialog-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="category-dialog" style={{ width: 400 }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-3)' }}>确认删除</div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-neutral-600)', marginBottom: 'var(--space-5)' }}>
              确定要删除选中的 {selectedForDelete.size} 个客户吗？此操作不可撤销。
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>
              <Button variant="ghost" onClick={() => setShowDeleteConfirm(false)}>取消</Button>
              <Button style={{ background: '#FD742D', borderColor: '#FD742D' }} onClick={confirmDelete}>确认删除</Button>
            </div>
          </div>
        </div>
      )}

      {/* 新增客户抽屉 */}
      {showCreate && (
        <CreateDrawer customerType={activeTab} onCancel={() => setShowCreate(false)}
          onSave={(newItem) => { setData(prev => [newItem, ...prev]); setShowCreate(false); }}
        />
      )}
    </>
  );
}

/* ── 工具函数：标签样式 ── */
function levelStyle(level: string): React.CSSProperties {
  const c = LEVEL_COLORS[level] || LEVEL_COLORS['C级'];
  return { padding: '2px 8px', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-medium)', background: c.bg, color: c.color, border: `1px solid ${c.color}22` };
}
function statusStyle(status: CustomerItem['status']): React.CSSProperties {
  const active = status === 'active';
  return {
    padding: '2px 8px', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-medium)',
    background: active ? 'var(--color-success-50)' : 'var(--color-neutral-100)',
    color: active ? 'var(--color-success-600)' : 'var(--color-neutral-500)', border: `1px solid ${active ? 'var(--color-success-200)' : 'var(--color-neutral-200)'}`,
  };
}

/* ── 详情栅格 ── */
function DetailGrid({ customer }: { customer: CustomerItem }) {
  const rows: [string, React.ReactNode][] = [
    ['客户名称', customer.name],
    ['客户类型', CUSTOMER_TYPE_LABELS[customer.type]],
    ['地区', customer.region],
    ['联系人', customer.contactPerson],
    ['联系电话', customer.contactPhone],
    ['联系邮箱', customer.contactEmail || '-'],
    ['联系地址', customer.contactAddress || '-'],
    ['客户等级', customer.level],
    ['订单数', String(customer.orders)],
    ['累计金额', `¥${(customer.totalAmount / 10000).toFixed(1)}万`],
    ['合作日期', customer.cooperationDate],
    ['结算方式', customer.settlementMethod || '-'],
    ['税号', customer.taxNo || '-'],
    ['状态', customer.status === 'active' ? '合作中' : '已暂停'],
    ['备注', customer.remark || '-'],
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2) var(--space-5)' }}>
      {rows.map(([k, v]) => (
        <div key={k} style={{ display: 'flex', fontSize: 'var(--text-sm)', padding: 'var(--space-2) 0', borderBottom: '1px dashed var(--color-neutral-150)' }}>
          <div style={{ width: 92, color: 'var(--color-neutral-500)', flexShrink: 0 }}>{k}</div>
          <div style={{ color: 'var(--color-neutral-800)' }}>{v}</div>
        </div>
      ))}
    </div>
  );
}

/* ── 平台方设置弹窗 ── */
function PlatformEditor({ customer, onCancel, onSave }: {
  customer: CustomerItem;
  onCancel: () => void;
  onSave: (platforms: CustomerPlatform[]) => void;
}) {
  const [selected, setSelected] = useState<CustomerPlatform[]>(customer.platforms);
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [customForm, setCustomForm] = useState<CustomerPlatform>({
    id: '', name: '', code: '', contactPerson: '', contactPhone: '', cooperationDate: new Date().toISOString().slice(0, 10),
  });

  const toggleGlobal = (p: CustomerPlatform) => {
    setSelected(prev => prev.find(x => x.id === p.id) ? prev.filter(x => x.id !== p.id) : [...prev, p]);
  };

  const addCustom = () => {
    if (!customForm.name || !customForm.code) return;
    const item: CustomerPlatform = { ...customForm, id: `custom_${Date.now()}` };
    setSelected(prev => [...prev, item]);
    setCustomForm({ id: '', name: '', code: '', contactPerson: '', contactPhone: '', cooperationDate: new Date().toISOString().slice(0, 10) });
    setShowAddCustom(false);
  };

  const removeSelected = (id: string) => setSelected(prev => prev.filter(p => p.id !== id));

  return (
    <div className="category-dialog-overlay" onClick={onCancel}>
      <div className="category-dialog" style={{ width: 720, maxWidth: '92vw', maxHeight: '86vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
          <div>
            <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)' }}>平台方设置</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-500)', marginTop: 2 }}>
              客户：{customer.name} · 销售订单可从已选平台方中选择唯一的一个
            </div>
          </div>
          <button className="drawer-close" onClick={onCancel}><svg viewBox="0 0 16 16"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg></button>
        </div>

        {/* 已选平台方 */}
        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-2)' }}>
          已选平台方（{selected.length}）
        </div>
        <Card style={{ padding: 'var(--space-3)', marginBottom: 'var(--space-4)', minHeight: 48 }}>
          {selected.length === 0 ? (
            <span style={{ color: 'var(--color-neutral-400)', fontSize: 'var(--text-xs)' }}>暂无平台方，请从下方选择或新增</span>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {selected.map(p => (
                <div key={p.id} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px',
                  background: 'rgba(13,175,198,0.10)', color: '#0DAFC6', borderRadius: 'var(--radius-sm)',
                  fontSize: 'var(--text-xs)', border: '1px solid rgba(13,175,198,0.25)',
                }}>
                  <span style={{ fontWeight: 'var(--font-medium)' }}>{p.name}</span>
                  <span className="mono" style={{ color: 'var(--color-neutral-500)' }}>({p.code})</span>
                  <button onClick={() => removeSelected(p.id)} style={{ cursor: 'pointer', border: 'none', background: 'transparent', color: '#0DAFC6', fontSize: 14, lineHeight: 1 }}>×</button>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* 从公共平台方选择 */}
        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-2)' }}>
          从平台方列表中选择
        </div>
        <Card style={{ padding: 0, marginBottom: 'var(--space-4)' }}>
          <Table
            headers={['选择', '平台方名称', '编码', '联系人', '联系电话', '合作日期']}
            rows={globalPlatforms.map(p => {
              const checked = !!selected.find(s => s.id === p.id);
              return [
                <input type="checkbox" checked={checked} onChange={() => toggleGlobal(p)} />,
                <span style={{ fontWeight: 'var(--font-medium)' }}>{p.name}</span>,
                <span className="mono">{p.code}</span>,
                p.contactPerson,
                <span className="mono">{p.contactPhone}</span>,
                <span className="mono">{p.cooperationDate}</span>,
              ];
            })}
          />
        </Card>

        {/* 自定义新增 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
          <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)' }}>新增自定义平台方</div>
          <button className="link-button" onClick={() => setShowAddCustom(v => !v)}>
            {showAddCustom ? '收起' : '+ 添加自定义平台方'}
          </button>
        </div>
        {showAddCustom && (
          <Card style={{ padding: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
              <div>
                <label style={formLabel}>平台方名称 *</label>
                <input className="filter-input" value={customForm.name} onChange={e => setCustomForm(prev => ({ ...prev, name: e.target.value }))} placeholder="如：XX企业采购平台" />
              </div>
              <div>
                <label style={formLabel}>平台方编码 *</label>
                <input className="filter-input" value={customForm.code} onChange={e => setCustomForm(prev => ({ ...prev, code: e.target.value }))} placeholder="编码（如 JDHCGO）" />
              </div>
              <div>
                <label style={formLabel}>联系人</label>
                <input className="filter-input" value={customForm.contactPerson} onChange={e => setCustomForm(prev => ({ ...prev, contactPerson: e.target.value }))} />
              </div>
              <div>
                <label style={formLabel}>联系电话</label>
                <input className="filter-input" value={customForm.contactPhone} onChange={e => setCustomForm(prev => ({ ...prev, contactPhone: e.target.value }))} />
              </div>
              <div>
                <label style={formLabel}>合作日期</label>
                <input className="filter-input" type="date" value={customForm.cooperationDate} onChange={e => setCustomForm(prev => ({ ...prev, cooperationDate: e.target.value }))} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={formLabel}>备注</label>
                <input className="filter-input" value={customForm.remark || ''} onChange={e => setCustomForm(prev => ({ ...prev, remark: e.target.value }))} />
              </div>
            </div>
            <div style={{ marginTop: 'var(--space-3)', display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={addCustom} disabled={!customForm.name || !customForm.code}>添加</Button>
            </div>
          </Card>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-2)', gap: 'var(--space-2)' }}>
          <Button variant="ghost" onClick={onCancel}>取消</Button>
          <Button onClick={() => onSave(selected)}>保存</Button>
        </div>
      </div>
    </div>
  );
}

const formLabel: React.CSSProperties = {
  display: 'block', fontSize: 'var(--text-xs)', color: 'var(--color-neutral-500)', marginBottom: 4,
};

/* ── 新增客户抽屉 ── */
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

  const update = <K extends keyof CustomerItem>(k: K, v: CustomerItem[K]) => setForm(prev => ({ ...prev, [k]: v }));
  const togglePlatform = (p: CustomerPlatform) => setForm(prev => ({
    ...prev,
    platforms: prev.platforms.find(x => x.id === p.id) ? prev.platforms.filter(x => x.id !== p.id) : [...prev.platforms, p],
  }));

  const canSave = form.name.trim().length > 0 && form.contactPerson.trim().length > 0;

  return (
    <div className="drawer-overlay" onClick={onCancel}>
      <div className="drawer-panel" onClick={e => e.stopPropagation()}>
        <div className="drawer-header">
          <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)' }}>新增{CUSTOMER_TYPE_LABELS[customerType]}</div>
          <button className="drawer-close" onClick={onCancel}><svg viewBox="0 0 16 16"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg></button>
        </div>
        <div className="drawer-body">
          <SectionTitle>基础信息</SectionTitle>
          <div style={grid2}>
            <Field label="客户名称 *"><input className="filter-input" value={form.name} onChange={e => update('name', e.target.value)} /></Field>
            <Field label="客户等级">
              <select className="filter-select" value={form.level} onChange={e => update('level', e.target.value)}>
                <option>S级</option><option>A级</option><option>B级</option><option>C级</option>
              </select>
            </Field>
            <Field label="地区"><input className="filter-input" value={form.region} onChange={e => update('region', e.target.value)} /></Field>
            <Field label="合作日期"><input className="filter-input" type="date" value={form.cooperationDate} onChange={e => update('cooperationDate', e.target.value)} /></Field>
            <Field label="联系人 *"><input className="filter-input" value={form.contactPerson} onChange={e => update('contactPerson', e.target.value)} /></Field>
            <Field label="联系电话"><input className="filter-input" value={form.contactPhone} onChange={e => update('contactPhone', e.target.value)} /></Field>
            <Field label="联系邮箱"><input className="filter-input" value={form.contactEmail || ''} onChange={e => update('contactEmail', e.target.value)} /></Field>
            <Field label="税号"><input className="filter-input" value={form.taxNo || ''} onChange={e => update('taxNo', e.target.value)} /></Field>
            <Field label="结算方式">
              <select className="filter-select" value={form.settlementMethod || ''} onChange={e => update('settlementMethod', e.target.value)}>
                <option value="月结">月结</option><option value="预付">预付</option><option value="季度">季度结算</option><option value="现款">现款</option>
              </select>
            </Field>
            <Field label="状态">
              <select className="filter-select" value={form.status} onChange={e => update('status', e.target.value as CustomerItem['status'])}>
                <option value="active">合作中</option><option value="inactive">已暂停</option>
              </select>
            </Field>
            <Field label="联系地址" full><input className="filter-input" value={form.contactAddress || ''} onChange={e => update('contactAddress', e.target.value)} /></Field>
            <Field label="备注" full><input className="filter-input" value={form.remark || ''} onChange={e => update('remark', e.target.value)} /></Field>
          </div>

          {customerType === 'direct' && (
            <>
              <SectionTitle>平台方（可多选）</SectionTitle>
              <Card style={{ padding: 'var(--space-3)' }}>
                {form.platforms.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 'var(--space-3)' }}>
                    {form.platforms.map(p => (
                      <div key={p.id} style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px',
                        background: 'rgba(13,175,198,0.10)', color: '#0DAFC6', borderRadius: 'var(--radius-sm)',
                        fontSize: 'var(--text-xs)', border: '1px solid rgba(13,175,198,0.25)',
                      }}>
                        <span style={{ fontWeight: 'var(--font-medium)' }}>{p.name}</span>
                        <span className="mono" style={{ color: 'var(--color-neutral-500)' }}>({p.code})</span>
                        <button onClick={() => togglePlatform(p)} style={{ cursor: 'pointer', border: 'none', background: 'transparent', color: '#0DAFC6', fontSize: 14, lineHeight: 1 }}>×</button>
                      </div>
                    ))}
                  </div>
                )}
                <Table
                  headers={['选择', '平台方名称', '编码', '联系人', '联系电话']}
                  rows={globalPlatforms.map(p => {
                    const checked = !!form.platforms.find(s => s.id === p.id);
                    return [
                      <input type="checkbox" checked={checked} onChange={() => togglePlatform(p)} />,
                      <span style={{ fontWeight: 'var(--font-medium)' }}>{p.name}</span>,
                      <span className="mono">{p.code}</span>,
                      p.contactPerson,
                      <span className="mono">{p.contactPhone}</span>,
                    ];
                  })}
                />
              </Card>
            </>
          )}
        </div>
        <div className="drawer-footer">
          <Button variant="ghost" onClick={onCancel}>取消</Button>
          <Button onClick={() => canSave && onSave(form)} disabled={!canSave}>保存</Button>
        </div>
      </div>
    </div>
  );
}

const grid2: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' };

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--color-neutral-700)', margin: 'var(--space-4) 0 var(--space-3)' }}>{children}</div>;
}

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div style={{ gridColumn: full ? '1 / -1' : undefined }}>
      <label style={formLabel}>{label}</label>
      {children}
    </div>
  );
}

/* ── SVG 图标组件（内联） ── */
function IconUser() {
  return <svg viewBox="0 0 18 18" width={18} height={18} fill="none"><circle cx="9" cy="6.5" r="2.8" stroke="currentColor" strokeWidth="1.3" /><path d="M3 15c0-3 2.7-5 6-5s6 2 6 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>;
}
function IconHome() {
  return <svg viewBox="0 0 18 18" width={18} height={18} fill="none"><path d="M3 8.5L9 3.5l6 5" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" strokeLinecap="round" /><path d="M4.5 8v7h9v-7" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /></svg>;
}
function IconChannel() {
  return <svg viewBox="0 0 18 18" width={18} height={18} fill="none"><path d="M2 10l3 2 3-4 3 5 3-3 2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /><circle cx="4" cy="5" r="1.5" stroke="currentColor" strokeWidth="1.3" /></svg>;
}
function IconYuan() {
  return <svg viewBox="0 0 18 18" width={18} height={18} fill="none"><circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.3" /><path d="M6 6l3 4 3-4M6 11h6M9 10v4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>;
}
