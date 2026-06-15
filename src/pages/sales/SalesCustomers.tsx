import { useState, useMemo } from 'react';
import ContentHeader from '../../components/layout/ContentHeader';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import type { StatCardData, CustomerItem, CustomerType } from '../../types';
import { customerItems as initialCustomers, CUSTOMER_TYPE_LABELS, CUSTOMER_TYPE_DESC, LEVEL_COLORS } from '../../data/customers';
import { platformItems as globalPlatforms, generatePlatformCode } from '../../data/platforms';

const PRIMARY = '#0F64B5';
const PRIMARY_LIGHT = '#EBF3FC';
const SECONDARY = '#CB405D';
const SECONDARY_LIGHT = '#FEF2F4';

const TABS: { key: CustomerType; label: string; desc: string; icon: React.ReactNode }[] = [
  { key: 'direct', label: '直营客户', desc: CUSTOMER_TYPE_DESC.direct, icon: <svg viewBox="0 0 18 18" fill="none"><path d="M3 8.5L9 3.5l6 5" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" strokeLinecap="round" /><path d="M4.5 8v7h9v-7" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /></svg> },
  { key: 'channel', label: '渠道客户', desc: CUSTOMER_TYPE_DESC.channel, icon: <svg viewBox="0 0 18 18" fill="none"><path d="M2 10l3 2 3-4 3 5 3-3 2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /><circle cx="4" cy="5" r="1.5" stroke="currentColor" strokeWidth="1.3" /></svg> },
];

export default function SalesCustomers() {
  const [activeTab, setActiveTab] = useState<CustomerType>('direct');
  const [keyword, setKeyword] = useState('');
  const [data, setData] = useState<CustomerItem[]>(initialCustomers);
  const [platforms, setPlatforms] = useState(globalPlatforms);
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedForDelete, setSelectedForDelete] = useState<Set<string>>(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [detailCustomer, setDetailCustomer] = useState<CustomerItem | null>(null);
  const [showAddDrawer, setShowAddDrawer] = useState(false);

  const tabCustomers = useMemo(() => data.filter(c => c.type === activeTab), [data, activeTab]);
  const filtered = useMemo(() => {
    if (!keyword) return tabCustomers;
    return tabCustomers.filter(c => c.name.includes(keyword) || c.contactPerson.includes(keyword) || c.region.includes(keyword) || c.contactPhone.includes(keyword));
  }, [tabCustomers, keyword]);

  const getPlatformName = (id: string) => platforms.find(p => p.id === id)?.shortName ?? id;

  const stats: StatCardData[] = useMemo(() => {
    const direct = data.filter(c => c.type === 'direct');
    const channel = data.filter(c => c.type === 'channel');
    const withPlatform = direct.filter(c => c.platformIds.length > 0).length;
    const activeCount = data.filter(c => c.status === 'active').length;
    return [
      { label: '客户总数', value: String(data.length), unit: '家', trend: { direction: 'up', value: `合作中 ${activeCount}` }, icon: <IconUsers /> },
      { label: '直营客户', value: String(direct.length), unit: '家', trend: { direction: 'up', value: `含平台方 ${withPlatform}` }, icon: <IconHome /> },
      { label: '渠道客户', value: String(channel.length), unit: '家', trend: { direction: 'up', value: `合作中 ${channel.filter(c => c.status === 'active').length}` }, icon: <IconChannel /> },
      { label: '累计销售额', value: (data.reduce((s, c) => s + c.totalAmount, 0) / 10000).toFixed(1), unit: '万', trend: { direction: 'up', value: `月均 ¥126.4万` }, icon: <IconYuan /> },
    ];
  }, [data]);

  const enterDeleteMode = () => { setDeleteMode(true); setSelectedForDelete(new Set()); };
  const exitDeleteMode = () => { setDeleteMode(false); setSelectedForDelete(new Set()); };
  const toggleSelect = (id: string) => setSelectedForDelete(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const confirmDelete = () => { setData(prev => prev.filter(c => !selectedForDelete.has(c.id))); setShowDeleteConfirm(false); exitDeleteMode(); };

  const levelTag = (level: string) => {
    const c = LEVEL_COLORS[level] || LEVEL_COLORS['C级'];
    return <span style={{ padding: '1px 8px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-medium)', background: c.bg, color: c.color, border: `1px solid ${c.color}30` }}>{level}</span>;
  };

  const statusTag = (status: CustomerItem['status']) => (
    <span style={{ padding: '2px 8px', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-medium)', background: status === 'active' ? '#E8F5E9' : '#FFF3E0', color: status === 'active' ? '#2E7D32' : '#E65100' }}>{status === 'active' ? '合作中' : '已暂停'}</span>
  );

  const platformTags = (platformIds: string[]) => {
    if (platformIds.length === 0) return <span style={{ color: 'var(--color-neutral-300)' }}>-</span>;
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {platformIds.slice(0, 2).map(id => (
          <span key={id} style={{ padding: '1px 8px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-medium)', background: `${SECONDARY}15`, color: SECONDARY, border: `1px solid ${SECONDARY}30` }}>{getPlatformName(id)}</span>
        ))}
        {platformIds.length > 2 && <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-400)' }}>+{platformIds.length - 2}</span>}
      </div>
    );
  };

  /** 简易新增平台（只输入简称） */
  const quickAddPlatform = (shortName: string): string => {
    const id = `p_${Date.now()}`;
    const newPlatform = {
      id, name: shortName, shortName, code: generatePlatformCode(shortName, platforms.map(p => p.code)),
      contactPerson: '', contactPosition: '', contactPhone: '', contactAddress: '',
      cooperationDate: new Date().toISOString().slice(0, 10), commissionRate: '',
      bankAccounts: [], invoiceInfos: [], status: 'active' as const,
    };
    setPlatforms(prev => [...prev, newPlatform]);
    return id;
  };

  return (
    <div>
      <ContentHeader title="客户管理" breadcrumbs={['销售', '客户管理']} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)', marginBottom: 'var(--space-5)' }}>
        {stats.map((s, i) => <StatCard key={i} data={s} />)}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-4)', marginBottom: 'var(--space-5)' }}>
        {TABS.map(t => {
          const count = data.filter(c => c.type === t.key).length;
          const isActive = activeTab === t.key;
          const withPlatform = t.key === 'direct' ? data.filter(c => c.type === 'direct' && c.platformIds.length > 0).length : 0;
          return (
            <div key={t.key} onClick={() => setActiveTab(t.key)} style={{ cursor: 'pointer', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', border: isActive ? `2px solid ${PRIMARY}` : '1px solid var(--color-neutral-200)', background: isActive ? `${PRIMARY}08` : 'var(--color-neutral-0)', boxShadow: 'var(--shadow-sm)', transition: 'var(--transition-fast)' }}>
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

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
        <input className="filter-input" placeholder={`搜索${CUSTOMER_TYPE_LABELS[activeTab]}名称、联系人、地区...`} value={keyword} onChange={e => setKeyword(e.target.value)} style={{ width: 280 }} />
        <Button onClick={() => setShowAddDrawer(true)}>
          <svg viewBox="0 0 16 16" fill="none" style={{ width: 14, height: 14 }}><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          新增
        </Button>
        {deleteMode ? (
          <>
            <Button style={{ background: SECONDARY, borderColor: SECONDARY }} onClick={() => setShowDeleteConfirm(true)} disabled={selectedForDelete.size === 0}>
              <svg viewBox="0 0 16 16" fill="none" style={{ width: 14, height: 14 }}><path d="M2 4h12M5.33 4V2.67a1.33 1.33 0 011.34-1.34h2.66a1.33 1.33 0 011.34 1.34V4m2 0v9.33a1.33 1.33 0 01-1.34 1.34H4.67a1.33 1.33 0 01-1.34-1.34V4h9.34z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              删除所选({selectedForDelete.size})
            </Button>
            <Button variant="ghost" onClick={exitDeleteMode}>取消</Button>
          </>
        ) : (
          <Button style={{ background: SECONDARY, borderColor: SECONDARY }} onClick={enterDeleteMode}>
            <svg viewBox="0 0 16 16" fill="none" style={{ width: 14, height: 14 }}><path d="M2 4h12M5.33 4V2.67a1.33 1.33 0 011.34-1.34h2.66a1.33 1.33 0 011.34 1.34V4m2 0v9.33a1.33 1.33 0 01-1.34 1.34H4.67a1.33 1.33 0 01-1.34-1.34V4h9.34z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            删除
          </Button>
        )}
        <span style={{ marginLeft: 'auto', fontSize: 'var(--text-sm)', color: 'var(--color-neutral-400)' }}>共 {filtered.length} 个客户</span>
      </div>

      <Card style={{ padding: 0 }}>
        <Table
          headers={[...(deleteMode ? ['选择'] : ['序号']), '客户名称', ...(activeTab === 'direct' ? ['平台方'] : []), '地区', '联系人', '联系电话', '客户来源', '等级', '订单数', '累计金额', '状态', '操作']}
          rows={filtered.map((c, idx) => {
            const cells: React.ReactNode[] = [
              deleteMode ? <input key="chk" type="checkbox" checked={selectedForDelete.has(c.id)} onChange={() => toggleSelect(c.id)} /> : <span key="idx" className="mono">{idx + 1}</span>,
              <span key="name" style={{ fontWeight: 'var(--font-medium)' }}>{c.name}</span>,
            ];
            if (activeTab === 'direct') cells.push(<span key="pf">{platformTags(c.platformIds)}</span>);
            cells.push(
              <span key="region">{c.region}</span>,
              <span key="cp">{c.contactPerson}</span>,
              <span key="cph" className="mono" style={{ color: 'var(--color-neutral-600)' }}>{c.contactPhone}</span>,
              <span key="src" style={{ fontSize: 'var(--text-xs)', color: c.source ? 'var(--color-neutral-700)' : 'var(--color-neutral-300)' }}>{c.source || '—'}</span>,
              <span key="lv">{levelTag(c.level)}</span>,
              <span key="ord" className="mono">{c.orders}</span>,
              <span key="amt" className="mono" style={{ fontWeight: 'var(--font-medium)', color: SECONDARY }}>¥{(c.totalAmount / 10000).toFixed(1)}万</span>,
              <span key="st">{statusTag(c.status)}</span>,
              <Button key="act" size="sm" variant="ghost" onClick={() => setDetailCustomer(c)}>查看</Button>,
            );
            return cells;
          })}
        />
      </Card>

      {/* 删除确认 */}
      {showDeleteConfirm && (
        <div className="category-dialog-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="category-dialog" onClick={e => e.stopPropagation()} style={{ maxWidth: 400 }}>
            <h3 style={{ marginBottom: 'var(--space-3)' }}>确认删除</h3>
            <p style={{ color: 'var(--color-neutral-600)', marginBottom: 'var(--space-4)' }}>确定要删除选中的 {selectedForDelete.size} 个客户吗？</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>
              <Button variant="ghost" onClick={() => setShowDeleteConfirm(false)}>取消</Button>
              <Button style={{ background: SECONDARY, borderColor: SECONDARY }} onClick={confirmDelete}>确认删除</Button>
            </div>
          </div>
        </div>
      )}

      {/* 详情弹窗 */}
      {detailCustomer && (
        <div className="category-dialog-overlay" onClick={() => setDetailCustomer(null)}>
          <div className="category-dialog" onClick={e => e.stopPropagation()} style={{ maxWidth: 720, maxHeight: '90vh', overflow: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
              <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-lg)', background: PRIMARY_LIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: PRIMARY, flexShrink: 0 }}>{detailCustomer.name.charAt(0)}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 4 }}>
                  <span style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)' }}>{detailCustomer.name}</span>
                  <span style={{ padding: '1px 8px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-medium)', background: `${PRIMARY}15`, color: PRIMARY, border: `1px solid ${PRIMARY}30` }}>{CUSTOMER_TYPE_LABELS[detailCustomer.type]}</span>
                  {levelTag(detailCustomer.level)}{statusTag(detailCustomer.status)}
                </div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-neutral-500)' }}>{detailCustomer.region} · {detailCustomer.contactPerson} · {detailCustomer.contactPhone}</div>
              </div>
              <button className="drawer-close" onClick={() => setDetailCustomer(null)}><svg viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg></button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
              {([['联系邮箱', detailCustomer.contactEmail || '—'], ['联系地址', detailCustomer.contactAddress || '—'], ['结算方式', detailCustomer.settlementMethod || '—'], ['客户来源', detailCustomer.source || '—'], ['税号', detailCustomer.taxNo || '—'], ['合作日期', detailCustomer.cooperationDate], ['累计金额', `¥${(detailCustomer.totalAmount / 10000).toFixed(1)}万`]] as [string, string][]).map(([label, value]) => (
                <div key={label} style={{ fontSize: 'var(--text-sm)' }}><span style={{ color: 'var(--color-neutral-500)' }}>{label}：</span><span style={{ color: 'var(--color-neutral-800)', fontWeight: 'var(--font-medium)' }}>{value}</span></div>
              ))}
              {detailCustomer.remark && <div style={{ gridColumn: '1 / -1', fontSize: 'var(--text-sm)' }}><span style={{ color: 'var(--color-neutral-500)' }}>备注：</span><span style={{ color: 'var(--color-neutral-800)' }}>{detailCustomer.remark}</span></div>}
            </div>
            {detailCustomer.type === 'direct' && detailCustomer.platformIds.length > 0 && (
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-2)' }}>关联平台（{detailCustomer.platformIds.length}）</h4>
                <Card style={{ padding: 0 }}>
                  <Table headers={['平台名称', '编码', '简称', '扣点', '联系人', '联系电话']}
                    rows={detailCustomer.platformIds.map(id => {
                      const p = platforms.find(x => x.id === id);
                      return p ? [<span key="n" style={{ fontWeight: 'var(--font-medium)' }}>{p.name}</span>, <span key="c" className="mono">{p.code}</span>, <span key="s">{p.shortName}</span>, <span key="cr" style={{ color: SECONDARY }}>{p.commissionRate}</span>, <span key="cp">{p.contactPerson}</span>, <span key="cph" className="mono">{p.contactPhone}</span>] : [<span key="n">未知平台</span>];
                    })}
                  />
                </Card>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-4)' }}><Button variant="ghost" onClick={() => setDetailCustomer(null)}>关闭</Button></div>
          </div>
        </div>
      )}

      {/* 新增客户抽屉 */}
      {showAddDrawer && (
        <CreateDrawer customerType={activeTab} platforms={platforms} onCancel={() => setShowAddDrawer(false)}
          onSave={item => { setData(prev => [item, ...prev]); setShowAddDrawer(false); }}
          onQuickAddPlatform={quickAddPlatform}
        />
      )}
    </div>
  );
}

/* ── 新增客户抽屉 ── */
function CreateDrawer({ customerType, platforms, onCancel, onSave, onQuickAddPlatform }: {
  customerType: CustomerType;
  platforms: { id: string; shortName: string; code: string; name: string; commissionRate: string; contactPerson: string; contactPhone: string }[];
  onCancel: () => void;
  onSave: (item: CustomerItem) => void;
  onQuickAddPlatform: (shortName: string) => string;
}) {
  const [form, setForm] = useState<CustomerItem>({
    id: `c_${Date.now()}`, name: '', type: customerType, region: '', contactPerson: '', contactPhone: '',
    contactEmail: '', contactAddress: '', level: 'B级', orders: 0, totalAmount: 0, platformIds: [],
    cooperationDate: new Date().toISOString().slice(0, 10), status: 'active', settlementMethod: '月结', taxNo: '', source: '', remark: '',
  });
  const [quickPlatformName, setQuickPlatformName] = useState('');

  const update = <K extends keyof CustomerItem>(k: K, v: CustomerItem[K]) => setForm(prev => ({ ...prev, [k]: v }));
  const togglePlatform = (id: string) => setForm(prev => ({ ...prev, platformIds: prev.platformIds.includes(id) ? prev.platformIds.filter(x => x !== id) : [...prev.platformIds, id] }));
  const canSave = form.name.trim().length > 0 && form.contactPerson.trim().length > 0;

  const handleQuickAdd = () => {
    if (!quickPlatformName.trim()) return;
    const newId = onQuickAddPlatform(quickPlatformName.trim());
    setForm(prev => ({ ...prev, platformIds: [...prev.platformIds, newId] }));
    setQuickPlatformName('');
  };

  return (
    <div className="drawer-overlay" onClick={onCancel}>
      <div className="drawer-panel" onClick={e => e.stopPropagation()}>
        <div className="drawer-header">
          <span className="drawer-title">新增{CUSTOMER_TYPE_LABELS[customerType]}</span>
          <button className="drawer-close" onClick={onCancel}><svg viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg></button>
        </div>
        <div className="drawer-body">
          <div className="drawer-section-title">基本信息</div>
          <div className="drawer-form-row">
            <div className="drawer-form-field"><label className="drawer-label">客户名称 *</label><input className="filter-input" style={{ width: '100%' }} value={form.name} onChange={e => update('name', e.target.value)} placeholder="请输入客户名称" /></div>
            <div className="drawer-form-field"><label className="drawer-label">客户等级</label><select className="filter-select" style={{ width: '100%' }} value={form.level} onChange={e => update('level', e.target.value)}><option>S级</option><option>A级</option><option>B级</option><option>C级</option></select></div>
            <div className="drawer-form-field"><label className="drawer-label">地区</label><input className="filter-input" style={{ width: '100%' }} value={form.region} onChange={e => update('region', e.target.value)} placeholder="如：上海" /></div>
          </div>
          <div className="drawer-form-row">
            <div className="drawer-form-field"><label className="drawer-label">联系人 *</label><input className="filter-input" style={{ width: '100%' }} value={form.contactPerson} onChange={e => update('contactPerson', e.target.value)} /></div>
            <div className="drawer-form-field"><label className="drawer-label">联系电话</label><input className="filter-input" style={{ width: '100%' }} value={form.contactPhone} onChange={e => update('contactPhone', e.target.value)} /></div>
            <div className="drawer-form-field"><label className="drawer-label">联系邮箱</label><input className="filter-input" style={{ width: '100%' }} value={form.contactEmail || ''} onChange={e => update('contactEmail', e.target.value)} /></div>
          </div>
          <div className="drawer-form-row">
            <div className="drawer-form-field" style={{ flex: 2 }}><label className="drawer-label">联系地址</label><input className="filter-input" style={{ width: '100%' }} value={form.contactAddress || ''} onChange={e => update('contactAddress', e.target.value)} /></div>
            <div className="drawer-form-field"><label className="drawer-label">合作日期</label><input className="filter-input" style={{ width: '100%' }} type="date" value={form.cooperationDate} onChange={e => update('cooperationDate', e.target.value)} /></div>
          </div>
          <div className="drawer-section-title">合作信息</div>
          <div className="drawer-form-row">
            <div className="drawer-form-field"><label className="drawer-label">结算方式</label><select className="filter-select" style={{ width: '100%' }} value={form.settlementMethod || ''} onChange={e => update('settlementMethod', e.target.value)}><option value="月结">月结</option><option value="预付">预付</option><option value="季度">季度结算</option><option value="现款">现款</option></select></div>
            <div className="drawer-form-field"><label className="drawer-label">客户来源</label><select className="filter-select" style={{ width: '100%' }} value={form.source || ''} onChange={e => update('source', e.target.value)}><option value="">请选择</option><option value="主动开发">主动开发</option><option value="展会拓客">展会拓客</option><option value="老客户转介">老客户转介</option><option value="平台引流">平台引流</option><option value="线上咨询">线上咨询</option><option value="其他">其他</option></select></div>
            <div className="drawer-form-field"><label className="drawer-label">税号</label><input className="filter-input" style={{ width: '100%' }} value={form.taxNo || ''} onChange={e => update('taxNo', e.target.value)} /></div>
          </div>
          <div className="drawer-form-row">
            <div className="drawer-form-field" style={{ flex: 1 }}><label className="drawer-label">备注</label><input className="filter-input" style={{ width: '100%' }} value={form.remark || ''} onChange={e => update('remark', e.target.value)} /></div>
            <div className="drawer-form-field"><label className="drawer-label">状态</label><select className="filter-select" style={{ width: '100%' }} value={form.status} onChange={e => update('status', e.target.value as CustomerItem['status'])}><option value="active">合作中</option><option value="inactive">已暂停</option></select></div>
          </div>

          {customerType === 'direct' && (
            <>
              <div className="drawer-section-title">关联平台（可多选，下单时选择唯一的一个）</div>
              {form.platformIds.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 'var(--space-3)' }}>
                  {form.platformIds.map(id => {
                    const p = platforms.find(x => x.id === id);
                    return p ? (
                      <div key={id} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: `${SECONDARY}15`, color: SECONDARY, borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)', border: `1px solid ${SECONDARY}30`, fontWeight: 'var(--font-medium)' }}>
                        {p.shortName}
                        <span className="mono" style={{ color: 'var(--color-neutral-500)', fontWeight: 'normal' }}>({p.code})</span>
                        <button onClick={() => togglePlatform(id)} style={{ cursor: 'pointer', border: 'none', background: 'transparent', color: SECONDARY, fontSize: 14, lineHeight: 1, padding: 0 }}>×</button>
                      </div>
                    ) : null;
                  })}
                </div>
              )}
              <div style={{ background: 'var(--color-neutral-50)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                <Table headers={['选择', '平台名称', '编码', '简称', '扣点', '联系人']}
                  rows={platforms.map(p => {
                    const checked = form.platformIds.includes(p.id);
                    return [<input key="chk" type="checkbox" checked={checked} onChange={() => togglePlatform(p.id)} />, <span key="n" style={{ fontWeight: 'var(--font-medium)' }}>{p.name}</span>, <span key="c" className="mono">{p.code}</span>, <span key="s">{p.shortName}</span>, <span key="cr" style={{ color: SECONDARY }}>{p.commissionRate}</span>, <span key="cp">{p.contactPerson}</span>];
                  })}
                />
              </div>
              {/* 简易新增平台 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-3)', background: SECONDARY_LIGHT, borderRadius: 'var(--radius-md)', border: `1px dashed ${SECONDARY}40` }}>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-500)', flexShrink: 0 }}>快速新增平台：</span>
                <input className="filter-input" style={{ flex: 1 }} placeholder="输入平台简称，回车新增" value={quickPlatformName} onChange={e => setQuickPlatformName(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') handleQuickAdd(); }} />
                <Button size="sm" onClick={handleQuickAdd} disabled={!quickPlatformName.trim()}>新增</Button>
              </div>
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

/* ── SVG 图标 ── */
function IconUsers() { return <svg viewBox="0 0 18 18" fill="none"><circle cx="7" cy="6.5" r="2.8" stroke="currentColor" strokeWidth="1.3" /><path d="M1 15c0-3 2.7-5 6-5s6 2 6 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /><circle cx="13" cy="7" r="2.2" stroke="currentColor" strokeWidth="1.2" /><path d="M13 11c2 0 4 1.5 4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>; }
function IconHome() { return <svg viewBox="0 0 18 18" fill="none"><path d="M3 8.5L9 3.5l6 5" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" strokeLinecap="round" /><path d="M4.5 8v7h9v-7" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /></svg>; }
function IconChannel() { return <svg viewBox="0 0 18 18" fill="none"><path d="M2 10l3 2 3-4 3 5 3-3 2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /><circle cx="4" cy="5" r="1.5" stroke="currentColor" strokeWidth="1.3" /></svg>; }
function IconYuan() { return <svg viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.3" /><path d="M6 6l3 4 3-4M6 11h6M9 10v4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>; }
