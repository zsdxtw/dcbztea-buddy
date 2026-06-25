import { useState, useMemo } from 'react';
import ContentHeader from '../../components/layout/ContentHeader';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import type { StatCardData, CustomerItem, CustomerType, PlatformItem, PlatformBankAccount, PlatformInvoiceInfo, CustomerBankAccount, CustomerInvoiceInfo } from '../../types';
import { customerItems as initialCustomers, CUSTOMER_TYPE_LABELS, CUSTOMER_TYPE_DESC, LEVEL_COLORS } from '../../data/customers';
import { platformItems as globalPlatforms } from '../../data/platforms';
import { PROVINCE_NAMES, getCityNames, getDistricts } from '../../data/regions';
import { generateCustomerCode } from '../../utils/customerCode';
import { useDrawerWidth } from '../../hooks/useDrawerWidth';
import { employees, getEmployeeName } from '../../data/organization';
import { streamers } from '../../data/streamers';
import DeptEmployeeSelect from '../../components/business/DeptEmployeeSelect';

const PRIMARY = '#0F64B5';
const PRIMARY_LIGHT = '#EBF3FC';
const SECONDARY = '#CB405D';
const SECONDARY_LIGHT = '#FEF2F4';

/* 客户类型标签颜色映射 */
const customerTypeColors: Record<CustomerType, { bg: string; color: string; border: string }> = {
  direct: { bg: '#E3F2FD', color: '#1565C0', border: '#90CAF9' },
  channel: { bg: '#FFF3E0', color: '#E65100', border: '#FFCC80' },
  personal: { bg: '#F3E5F5', color: '#7B1FA2', border: '#CE93D8' },
  platform: { bg: '#E8F5E9', color: '#2E7D32', border: '#A5D6A7' },
  guest: { bg: '#ECEFF1', color: '#455A64', border: '#B0BEC5' },
};

const TABS: { key: CustomerType; label: string; desc: string; icon: React.ReactNode }[] = [
  { key: 'direct', label: '直营客户', desc: CUSTOMER_TYPE_DESC.direct, icon: <svg viewBox="0 0 18 18" fill="none"><path d="M3 8.5L9 3.5l6 5" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" strokeLinecap="round" /><path d="M4.5 8v7h9v-7" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /></svg> },
  { key: 'channel', label: '渠道客户', desc: CUSTOMER_TYPE_DESC.channel, icon: <svg viewBox="0 0 18 18" fill="none"><path d="M2 10l3 2 3-4 3 5 3-3 2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /><circle cx="4" cy="5" r="1.5" stroke="currentColor" strokeWidth="1.3" /></svg> },
  { key: 'personal', label: '个人客户', desc: CUSTOMER_TYPE_DESC.personal, icon: <svg viewBox="0 0 18 18" fill="none"><circle cx="9" cy="6" r="3" stroke="currentColor" strokeWidth="1.3" /><path d="M3 15c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg> },
  { key: 'platform', label: '平台客户', desc: CUSTOMER_TYPE_DESC.platform, icon: <svg viewBox="0 0 18 18" fill="none"><rect x="3" y="5" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3" /><path d="M6 5V3.5A1.5 1.5 0 017.5 2h3A1.5 1.5 0 0112 3.5V5" stroke="currentColor" strokeWidth="1.3" /><path d="M9 8v2M8 9h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg> },
];

export default function SalesCustomers() {
  const [activeTab, setActiveTab] = useState<CustomerType>('direct');
  const [keyword, setKeyword] = useState('');
  const [data, setData] = useState<CustomerItem[]>(initialCustomers);
  const [platforms, setPlatforms] = useState<PlatformItem[]>(globalPlatforms);
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedForDelete, setSelectedForDelete] = useState<Set<string>>(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [detailCustomer, setDetailCustomer] = useState<CustomerItem | null>(null);
  const [showAddDrawer, setShowAddDrawer] = useState(false);
  const [showPendingMaintain, setShowPendingMaintain] = useState(false);
  const drawerWidth = useDrawerWidth();

  // 平台客户相关状态
  const [detailPlatform, setDetailPlatform] = useState<PlatformItem | null>(null);
  const [showPlatformDetail, setShowPlatformDetail] = useState(false);
  const [editingPlatform, setEditingPlatform] = useState(false);
  const [editPlatformForm, setEditPlatformForm] = useState<PlatformItem | null>(null);
  const [showAddPlatformDrawer, setShowAddPlatformDrawer] = useState(false);

  const tabCustomers = useMemo(() => data.filter(c => c.type === activeTab), [data, activeTab]);
  const filtered = useMemo(() => {
    let result = tabCustomers;
    if (showPendingMaintain) {
      // 待维护：缺少联系人、联系电话、地址、结算账户等关键信息的客户
      result = result.filter(c =>
        !c.contactPerson || !c.contactPhone || !c.contactAddress ||
        (c.type !== 'personal' && (c.bankAccounts ?? []).length === 0) ||
        !c.province || !c.city
      );
    }
    if (!keyword) return result;
    return result.filter(c => c.name.includes(keyword) || c.contactPerson.includes(keyword) || c.region.includes(keyword) || c.contactPhone.includes(keyword) || (c.shortName ?? '').includes(keyword) || (c.customerCode ?? '').includes(keyword));
  }, [tabCustomers, keyword, showPendingMaintain]);

  const getPlatformName = (id: string) => platforms.find(p => p.id === id)?.shortName ?? id;

  /** 主办人名称：支持员工或带货人 */
  const getHostName = (hostId?: string, hostType?: 'employee' | 'streamer') => {
    if (!hostId) return '—';
    if (hostType === 'streamer') return streamers.find(s => s.id === hostId)?.name ?? '—';
    return getEmployeeName(hostId);
  };

  const stats: StatCardData[] = useMemo(() => {
    const direct = data.filter(c => c.type === 'direct');
    const channel = data.filter(c => c.type === 'channel');
    const personal = data.filter(c => c.type === 'personal');
    const withPlatform = direct.filter(c => c.platformIds.length > 0).length;
    const activeCount = data.filter(c => c.status === 'active').length;
    const platformActive = platforms.filter(p => p.status === 'active').length;
    return [
      { label: '客户总数', value: String(data.length + platforms.length), unit: '家', trend: { direction: 'up', value: `合作中 ${activeCount + platformActive}` }, icon: <IconUsers /> },
      { label: '直营客户', value: String(direct.length), unit: '家', trend: { direction: 'up', value: `合作中 ${direct.filter(c => c.status === 'active').length}` }, icon: <IconHome /> },
      { label: '渠道客户', value: String(channel.length), unit: '家', trend: { direction: 'up', value: `合作中 ${channel.filter(c => c.status === 'active').length}` }, icon: <IconChannel /> },
      { label: '个人客户', value: String(personal.length), unit: '人', trend: { direction: 'up', value: `合作中 ${personal.filter(c => c.status === 'active').length}` }, icon: <IconPersonal /> },
      { label: '平台客户', value: String(platforms.length), unit: '家', trend: { direction: 'up', value: `在册 ${platformActive}` }, icon: <IconPlatform /> },
    ];
  }, [data, platforms]);

  const enterDeleteMode = () => { setDeleteMode(true); setSelectedForDelete(new Set()); };
  const exitDeleteMode = () => { setDeleteMode(false); setSelectedForDelete(new Set()); };
  const toggleSelect = (id: string) => setSelectedForDelete(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const confirmDelete = () => {
    if (activeTab === 'platform') {
      setPlatforms(prev => prev.filter(p => !selectedForDelete.has(p.id)));
    } else {
      setData(prev => prev.filter(c => !selectedForDelete.has(c.id)));
    }
    setShowDeleteConfirm(false);
    exitDeleteMode();
  };

  const levelTag = (level: string) => {
    const c = LEVEL_COLORS[level] || LEVEL_COLORS['C级'];
    return <span style={{ padding: '1px 8px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-medium)', background: c.bg, color: c.color, border: `1px solid ${c.color}30` }}>{level}</span>;
  };

  const statusTag = (status: 'active' | 'inactive', type?: 'platform') => (
    <span style={{ padding: '2px 8px', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-medium)', background: status === 'active' ? '#E8F5E9' : '#FFF3E0', color: status === 'active' ? '#2E7D32' : '#E65100' }}>
      {status === 'active' ? (type === 'platform' ? '在册' : '合作中') : (type === 'platform' ? '停用' : '已暂停')}
    </span>
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
    const sequence = platforms.length + 1;
    const newPlatform: PlatformItem = {
      id, name: shortName, shortName, code: generateCustomerCode('platform', shortName, sequence),
      contactPerson: '', contactPosition: '', contactPhone: '', contactAddress: '',
      province: '', city: '', district: '',
      cooperationDate: new Date().toISOString().slice(0, 10), commissionRate: '',
      bankAccounts: [], invoiceInfos: [], status: 'active',
    };
    setPlatforms(prev => [...prev, newPlatform]);
    return id;
  };

  // 平台客户：搜索过滤
  const filteredPlatforms = useMemo(() => {
    if (!keyword) return platforms;
    return platforms.filter(p => p.name.includes(keyword) || p.shortName.includes(keyword) || p.code.includes(keyword) || p.contactPerson.includes(keyword));
  }, [platforms, keyword]);

  // 平台详情操作
  const handleViewPlatform = (p: PlatformItem) => { setDetailPlatform(p); setEditingPlatform(false); setEditPlatformForm(null); setShowPlatformDetail(true); };
  const handleStartEditPlatform = () => { if (detailPlatform) { setEditPlatformForm({ ...detailPlatform, bankAccounts: detailPlatform.bankAccounts.map(b => ({ ...b })), invoiceInfos: detailPlatform.invoiceInfos.map(i => ({ ...i })) }); setEditingPlatform(true); } };
  const handleCancelEditPlatform = () => { setEditingPlatform(false); setEditPlatformForm(null); };
  const handleSaveEditPlatform = () => { if (editPlatformForm) { setPlatforms(prev => prev.map(p => p.id === editPlatformForm.id ? editPlatformForm : p)); setDetailPlatform(editPlatformForm); setEditingPlatform(false); setEditPlatformForm(null); } };

  // 平台删除
  const togglePlatformSelect = (id: string) => setSelectedForDelete(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  return (
    <>
      <ContentHeader title="客户管理" breadcrumbs={['销售', '客户管理']} />

      <div className="content-body">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-5)', marginBottom: 'var(--space-6)' }}>
        {TABS.map(t => {
          const count = t.key === 'platform' ? platforms.length : data.filter(c => c.type === t.key).length;
          const isActive = activeTab === t.key;
          const withPlatform = t.key === 'direct' ? data.filter(c => c.type === 'direct' && c.platformIds.length > 0).length : 0;
          return (
            <div key={t.key} onClick={() => { setActiveTab(t.key); setKeyword(''); }} style={{ cursor: 'pointer', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)', border: isActive ? `2px solid ${PRIMARY}` : '1px solid var(--color-neutral-200)', background: isActive ? `${PRIMARY}08` : 'var(--color-neutral-0)', boxShadow: 'var(--shadow-sm)', transition: 'var(--transition-fast)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <span style={{ width: 32, height: 32, borderRadius: 'var(--radius-md)', background: isActive ? PRIMARY_LIGHT : 'var(--color-neutral-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isActive ? PRIMARY : 'var(--color-neutral-500)', transition: 'var(--transition-fast)' }}>{t.icon}</span>
                  <span style={{ fontWeight: 'var(--font-semibold)', fontSize: 'var(--text-base)', color: 'var(--color-neutral-800)' }}>{t.label}</span>
                </div>
                <span style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', color: isActive ? PRIMARY : 'var(--color-neutral-600)' }}>{count}</span>
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-500)', marginLeft: 40 }}>
                {t.desc}
              </div>
            </div>
          );
        })}
      </div>

      {activeTab === 'platform' ? (
        /* ── 平台客户列表 ── */
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-5)' }}>
            <input className="filter-input" placeholder="搜索平台名称、编码、联系人..." value={keyword} onChange={e => setKeyword(e.target.value)} style={{ width: 280 }} />
            <Button onClick={() => setShowAddPlatformDrawer(true)}>
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
            <span style={{ marginLeft: 'auto', fontSize: 'var(--text-sm)', color: 'var(--color-neutral-400)' }}>共 {filteredPlatforms.length} 个平台</span>
          </div>

          <Card style={{ padding: 0 }}>
            <Table
              headers={[...(deleteMode ? ['选择'] : ['序号']), '客户简称', '平台编号', '客户名称', '主办人', '联系人', '联系人职务', '联系电话', '扣点', '结算账户', '发票主体', '状态', '操作']}
              rows={filteredPlatforms.map((p, idx) => [
                deleteMode ? <input key="chk" type="checkbox" checked={selectedForDelete.has(p.id)} onChange={() => togglePlatformSelect(p.id)} /> : <span key="idx" className="mono">{idx + 1}</span>,
                <span key="sn" className="cell-emph">{p.shortName}</span>,
                <span key="code" className="mono" style={{ color: 'var(--color-neutral-600)' }}>{p.code}</span>,
                <span key="name">{p.name}</span>,
                <span key="liaison">{p.hostId ? getHostName(p.hostId, p.hostType) : '—'}</span>,
                <span key="cp">{p.contactPerson}</span>,
                <span key="cpo" style={{ color: 'var(--color-neutral-500)', fontSize: 'var(--text-xs)' }}>{p.contactPosition || '—'}</span>,
                <span key="cph" className="mono" style={{ color: 'var(--color-neutral-600)' }}>{p.contactPhone}</span>,
                <span key="cr" style={{ color: SECONDARY, fontWeight: 'var(--font-medium)' }}>{p.commissionRate}</span>,
                <span key="ba" className="mono">{p.bankAccounts.length}个</span>,
                <span key="ii">{p.invoiceInfos.length > 0 ? p.invoiceInfos[0].invoiceEntity : '—'}</span>,
                <span key="st">{statusTag(p.status, 'platform')}</span>,
                <div className="row-actions" key="act">
                  <Button size="sm" variant="ghost" onClick={() => handleViewPlatform(p)}>查看</Button>
                  <Button size="sm" variant="ghost" onClick={() => window.alert('编辑功能（演示）')}>编辑</Button>
                </div>,
              ])}
            />
          </Card>
        </>
      ) : (
        /* ── 直营/渠道客户列表 ── */
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-5)' }}>
            <input className="filter-input" placeholder={`搜索${CUSTOMER_TYPE_LABELS[activeTab]}名称、简称、编号、联系人、地区...`} value={keyword} onChange={e => setKeyword(e.target.value)} style={{ width: 280 }} />
            <Button variant={showPendingMaintain ? 'primary' : 'ghost'} onClick={() => setShowPendingMaintain(!showPendingMaintain)}>
              <svg viewBox="0 0 16 16" fill="none" style={{ width: 14, height: 14 }}><path d="M8 2v6M8 14v.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2"/></svg>
              待维护
            </Button>
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
              headers={[...(deleteMode ? ['选择'] : ['序号']), '客户简称', '客户编号', '客户名称', '主办人', ...(activeTab === 'direct' ? ['平台方'] : []), '地区', '联系人', '联系电话', '客户来源', '等级', '订单数', '累计金额', '状态', '操作']}
              rows={filtered.map((c, idx) => {
                const cells: React.ReactNode[] = [
                  deleteMode ? <input key="chk" type="checkbox" checked={selectedForDelete.has(c.id)} onChange={() => toggleSelect(c.id)} /> : <span key="idx" className="mono">{idx + 1}</span>,
                  <span key="sn" className="cell-emph">{c.shortName || c.name}</span>,
                  <span key="cc" className="mono" style={{ color: 'var(--color-neutral-600)' }}>{c.customerCode || '—'}</span>,
                  <span key="name">{c.name}</span>,
                  <span key="liaison" style={{ fontSize: 'var(--text-sm)' }}>{c.hostId ? (c.hostType === 'streamer' ? (streamers.find(s => s.id === c.hostId)?.name ?? '—') : getEmployeeName(c.hostId)) : '—'}</span>,
                ];
                if (activeTab === 'direct') cells.push(<span key="pf">{platformTags(c.platformIds)}</span>);
                cells.push(
                  <span key="region" style={{ fontSize: 'var(--text-sm)' }}>{[c.province, c.city, c.district].filter(Boolean).join(' / ') || c.region}</span>,
                  <span key="cp">{c.contactPerson}</span>,
                  <span key="cph" className="mono" style={{ color: 'var(--color-neutral-600)' }}>{c.contactPhone}</span>,
                  <span key="src" style={{ fontSize: 'var(--text-xs)', color: c.source ? 'var(--color-neutral-700)' : 'var(--color-neutral-300)' }}>{c.source || '—'}</span>,
                  <span key="lv">{levelTag(c.level)}</span>,
                  <span key="ord" className="mono">{c.orders}</span>,
                  <span key="amt" className="mono" style={{ fontWeight: 'var(--font-medium)', color: SECONDARY }}>¥{(c.totalAmount / 10000).toFixed(1)}万</span>,
                  <span key="st">{statusTag(c.status)}</span>,
                  <div className="row-actions" key="act">
                    <Button size="sm" variant="ghost" onClick={() => setDetailCustomer(c)}>查看</Button>
                    <Button size="sm" variant="ghost" onClick={() => window.alert('编辑功能（演示）')}>编辑</Button>
                  </div>,
                );
                return cells;
              })}
            />
          </Card>
        </>
      )}

      {/* 删除确认 */}
      {showDeleteConfirm && (
        <div className="category-dialog-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="category-dialog" onClick={e => e.stopPropagation()} style={{ maxWidth: 400 }}>
            <h3 style={{ marginBottom: 'var(--space-3)' }}>确认删除</h3>
            <p style={{ color: 'var(--color-neutral-600)', marginBottom: 'var(--space-4)' }}>确定要删除选中的 {selectedForDelete.size} 个{activeTab === 'platform' ? '平台' : '客户'}吗？</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>
              <Button variant="ghost" onClick={() => setShowDeleteConfirm(false)}>取消</Button>
              <Button style={{ background: SECONDARY, borderColor: SECONDARY }} onClick={confirmDelete}>确认删除</Button>
            </div>
          </div>
        </div>
      )}

      {/* 直营/渠道客户详情弹窗 */}
      {detailCustomer && (
        <div className="category-dialog-overlay" onClick={() => setDetailCustomer(null)}>
          <div className="category-dialog" onClick={e => e.stopPropagation()} style={{ maxWidth: 720, maxHeight: '90vh', overflow: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
              <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-lg)', background: PRIMARY_LIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: PRIMARY, flexShrink: 0 }}>{detailCustomer.name.charAt(0)}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 4 }}>
                  <span style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)' }}>{detailCustomer.name}</span>
                  <span style={{ padding: '1px 8px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-medium)', background: customerTypeColors[detailCustomer.type].bg, color: customerTypeColors[detailCustomer.type].color, border: `1px solid ${customerTypeColors[detailCustomer.type].border}` }}>{CUSTOMER_TYPE_LABELS[detailCustomer.type]}</span>
                  {levelTag(detailCustomer.level)}{statusTag(detailCustomer.status)}
                </div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-neutral-500)' }}>{detailCustomer.region} · {detailCustomer.contactPerson} · {detailCustomer.contactPhone}</div>
              </div>
              <button className="drawer-close" onClick={() => setDetailCustomer(null)}><svg viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg></button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
              {([
                ['客户简称', detailCustomer.shortName || '—'],
                ['客户编号', detailCustomer.customerCode || '—'],
                ['所在地区', [detailCustomer.province, detailCustomer.city, detailCustomer.district].filter(Boolean).join(' / ') || detailCustomer.region || '—'],
                ['主办人', detailCustomer.hostId ? getHostName(detailCustomer.hostId, detailCustomer.hostType) : '—'],
                ['联系邮箱', detailCustomer.contactEmail || '—'],
                ['联系地址', detailCustomer.contactAddress || '—'],
                ...(detailCustomer.type !== 'personal' ? [['结算方式', detailCustomer.settlementMethod || '—']] as [string, string][] : []),
                ['客户来源', detailCustomer.source || '—'],
                ...(detailCustomer.type !== 'personal' ? [['税号', detailCustomer.taxNo || '—']] as [string, string][] : []),
                ['合作日期', detailCustomer.cooperationDate],
                ['累计金额', `¥${(detailCustomer.totalAmount / 10000).toFixed(1)}万`],
              ] as [string, string][]).map(([label, value]) => (
                <div key={label} style={{ fontSize: 'var(--text-sm)' }}><span style={{ color: 'var(--color-neutral-500)' }}>{label}：</span><span style={{ color: 'var(--color-neutral-800)', fontWeight: 'var(--font-medium)' }}>{value}</span></div>
              ))}
              {detailCustomer.remark && <div style={{ gridColumn: '1 / -1', fontSize: 'var(--text-sm)' }}><span style={{ color: 'var(--color-neutral-500)' }}>备注：</span><span style={{ color: 'var(--color-neutral-800)' }}>{detailCustomer.remark}</span></div>}
            </div>

            {/* 结算账户与发票信息（个人客户不展示） */}
            {detailCustomer.type !== 'personal' && (
              <>
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-2)' }}>结算账户（{(detailCustomer.bankAccounts ?? []).length}）</h4>
              {(detailCustomer.bankAccounts ?? []).length === 0 ? (
                <EmptyText>暂无结算账户</EmptyText>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  {(detailCustomer.bankAccounts ?? []).map((ba, i) => (
                    <div key={i} style={{ padding: 'var(--space-3)', background: 'var(--color-neutral-50)', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-2)', fontSize: 'var(--text-sm)' }}>
                        <div><span style={{ color: 'var(--color-neutral-500)' }}>户名：</span><span style={{ fontWeight: 'var(--font-medium)' }}>{ba.accountName}</span></div>
                        <div><span style={{ color: 'var(--color-neutral-500)' }}>账号：</span><span className="mono">{ba.accountNo}</span></div>
                        <div><span style={{ color: 'var(--color-neutral-500)' }}>开户行：</span>{ba.bankName}</div>
                        <div><span style={{ color: 'var(--color-neutral-500)' }}>行号：</span><span className="mono">{ba.bankNo}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 发票信息 */}
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-2)' }}>发票信息（{(detailCustomer.invoiceInfos ?? []).length}）</h4>
              {(detailCustomer.invoiceInfos ?? []).length === 0 ? (
                <EmptyText>暂无发票信息</EmptyText>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  {(detailCustomer.invoiceInfos ?? []).map((inv, i) => (
                    <div key={i} style={{ padding: 'var(--space-3)', background: 'var(--color-neutral-50)', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-2)', fontSize: 'var(--text-sm)' }}>
                        <div><span style={{ color: 'var(--color-neutral-500)' }}>发票主体：</span><span style={{ fontWeight: 'var(--font-medium)' }}>{inv.invoiceEntity}</span></div>
                        <div><span style={{ color: 'var(--color-neutral-500)' }}>税号：</span><span className="mono">{inv.taxNo}</span></div>
                        <div><span style={{ color: 'var(--color-neutral-500)' }}>税率：</span>{inv.taxRate}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
              </>
            )}

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

      {/* 平台客户详情/编辑抽屉 */}
      {showPlatformDetail && detailPlatform && (
        <div className="drawer-overlay" onClick={() => { setShowPlatformDetail(false); setEditingPlatform(false); setEditPlatformForm(null); }}>
          <div className="drawer-panel" onClick={e => e.stopPropagation()}>
            <div className="drawer-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flex: 1 }}>
                <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-lg)', background: PRIMARY_LIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-base)', fontWeight: 'var(--font-bold)', color: PRIMARY, flexShrink: 0 }}>{detailPlatform.shortName.charAt(0)}</div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <span className="drawer-title">{detailPlatform.name}</span>
                    <span className="mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-500)' }}>{detailPlatform.code}</span>
                    {statusTag(detailPlatform.status, 'platform')}
                  </div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-500)', marginTop: 2 }}>扣点 {detailPlatform.commissionRate} · {detailPlatform.contactPerson} · {detailPlatform.contactPhone}</div>
                </div>
              </div>
              <button className="drawer-close" onClick={() => { setShowPlatformDetail(false); setEditingPlatform(false); setEditPlatformForm(null); }}><svg viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg></button>
            </div>
            <div className="drawer-body">
              <SectionTitle>基本信息</SectionTitle>
              <div style={grid2}>
                <Field label="平台名称">{editingPlatform ? <input className="filter-input" style={{ width: '100%' }} value={editPlatformForm?.name ?? ''} onChange={e => setEditPlatformForm(prev => prev ? { ...prev, name: e.target.value } : prev)} /> : <Text>{detailPlatform.name}</Text>}</Field>
                <Field label="平台简称">{editingPlatform ? <input className="filter-input" style={{ width: '100%' }} value={editPlatformForm?.shortName ?? ''} onChange={e => setEditPlatformForm(prev => prev ? { ...prev, shortName: e.target.value } : prev)} /> : <Text>{detailPlatform.shortName}</Text>}</Field>
                <Field label="平台编号"><Text className="mono">{detailPlatform.code}</Text></Field>
                <Field label="联系人">{editingPlatform ? <input className="filter-input" style={{ width: '100%' }} value={editPlatformForm?.contactPerson ?? ''} onChange={e => setEditPlatformForm(prev => prev ? { ...prev, contactPerson: e.target.value } : prev)} /> : <Text>{detailPlatform.contactPerson}</Text>}</Field>
                <Field label="联系人职务">{editingPlatform ? <input className="filter-input" style={{ width: '100%' }} value={editPlatformForm?.contactPosition ?? ''} onChange={e => setEditPlatformForm(prev => prev ? { ...prev, contactPosition: e.target.value } : prev)} /> : <Text>{detailPlatform.contactPosition || '—'}</Text>}</Field>
                <Field label="主办人" full>{editingPlatform ? (
                  <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <select className="filter-select" style={{ width: 100 }} value={editPlatformForm?.hostType ?? ''} onChange={(e) => { setEditPlatformForm(prev => prev ? { ...prev, hostType: (e.target.value || undefined) as 'employee' | 'streamer' | undefined, hostId: undefined } : prev); }}>
                      <option value="">请选择</option>
                      <option value="employee">员工</option>
                      <option value="streamer">带货人</option>
                    </select>
                    {editPlatformForm?.hostType === 'employee' ? (
                      <DeptEmployeeSelect value={editPlatformForm?.hostId ?? ''} onChange={(empId) => setEditPlatformForm(prev => prev ? { ...prev, hostId: empId || undefined } : prev)} style={{ flex: 1 }} />
                    ) : editPlatformForm?.hostType === 'streamer' ? (
                      <select className="filter-select" style={{ flex: 1 }} value={editPlatformForm?.hostId ?? ''} onChange={(e) => setEditPlatformForm(prev => prev ? { ...prev, hostId: e.target.value || undefined } : prev)}>
                        <option value="">选择带货人</option>
                        {streamers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                    ) : (
                      <div style={{ flex: 1, height: 34, display: 'flex', alignItems: 'center', padding: '0 var(--space-3)', border: '1px solid var(--color-border-primary)', borderRadius: 'var(--radius-md)', background: 'var(--color-bg-tertiary)', fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>请先选择类型</div>
                    )}
                  </div>
                ) : <Text>{getHostName(detailPlatform.hostId, detailPlatform.hostType)}</Text>}</Field>
                <Field label="联系电话">{editingPlatform ? <input className="filter-input" style={{ width: '100%' }} value={editPlatformForm?.contactPhone ?? ''} onChange={e => setEditPlatformForm(prev => prev ? { ...prev, contactPhone: e.target.value } : prev)} /> : <Text>{detailPlatform.contactPhone}</Text>}</Field>
                <Field label="省份">{editingPlatform ? <select className="filter-select" style={{ width: '100%' }} value={editPlatformForm?.province ?? ''} onChange={e => setEditPlatformForm(prev => prev ? { ...prev, province: e.target.value, city: '', district: '' } : prev)}><option value="">请选择</option>{PROVINCE_NAMES.map(p => <option key={p} value={p}>{p}</option>)}</select> : <Text>{detailPlatform.province || '—'}</Text>}</Field>
                <Field label="城市">{editingPlatform ? <select className="filter-select" style={{ width: '100%' }} value={editPlatformForm?.city ?? ''} disabled={!editPlatformForm?.province} onChange={e => setEditPlatformForm(prev => prev ? { ...prev, city: e.target.value, district: '' } : prev)}><option value="">请选择</option>{(editPlatformForm?.province ? getCityNames(editPlatformForm.province) : []).map(c => <option key={c} value={c}>{c}</option>)}</select> : <Text>{detailPlatform.city || '—'}</Text>}</Field>
                <Field label="区县">{editingPlatform ? <select className="filter-select" style={{ width: '100%' }} value={editPlatformForm?.district ?? ''} disabled={!editPlatformForm?.city} onChange={e => setEditPlatformForm(prev => prev ? { ...prev, district: e.target.value } : prev)}><option value="">请选择</option>{(editPlatformForm?.province && editPlatformForm?.city ? getDistricts(editPlatformForm.province, editPlatformForm.city) : []).map(d => <option key={d} value={d}>{d}</option>)}</select> : <Text>{detailPlatform.district || '—'}</Text>}</Field>
                <Field label="具体地址" full>{editingPlatform ? <input className="filter-input" style={{ width: '100%' }} value={editPlatformForm?.contactAddress ?? ''} onChange={e => setEditPlatformForm(prev => prev ? { ...prev, contactAddress: e.target.value } : prev)} /> : <Text>{detailPlatform.contactAddress || '—'}</Text>}</Field>
                <Field label="合作日期">{editingPlatform ? <input className="filter-input" style={{ width: '100%' }} type="date" value={editPlatformForm?.cooperationDate ?? ''} onChange={e => setEditPlatformForm(prev => prev ? { ...prev, cooperationDate: e.target.value } : prev)} /> : <Text>{detailPlatform.cooperationDate}</Text>}</Field>
                <Field label="平台扣点">{editingPlatform ? <input className="filter-input" style={{ width: '100%' }} value={editPlatformForm?.commissionRate ?? ''} onChange={e => setEditPlatformForm(prev => prev ? { ...prev, commissionRate: e.target.value } : prev)} /> : <Text style={{ color: SECONDARY, fontWeight: 'var(--font-medium)' }}>{detailPlatform.commissionRate}</Text>}</Field>
                <Field label="备注" full>{editingPlatform ? <input className="filter-input" style={{ width: '100%' }} value={editPlatformForm?.remark ?? ''} onChange={e => setEditPlatformForm(prev => prev ? { ...prev, remark: e.target.value } : prev)} /> : <Text>{detailPlatform.remark || '—'}</Text>}</Field>
              </div>

              <SectionTitle>结算账户（{detailPlatform.bankAccounts.length}/5）</SectionTitle>
              {detailPlatform.bankAccounts.length === 0 ? <EmptyText>暂无结算账户</EmptyText> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  {detailPlatform.bankAccounts.map((ba, i) => (
                    <div key={i} style={{ padding: 'var(--space-3)', background: 'var(--color-neutral-50)', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-2)', fontSize: 'var(--text-sm)' }}>
                        <div><span style={{ color: 'var(--color-neutral-500)' }}>户名：</span><span style={{ fontWeight: 'var(--font-medium)' }}>{ba.accountName}</span></div>
                        <div><span style={{ color: 'var(--color-neutral-500)' }}>账号：</span><span className="mono">{ba.accountNo}</span></div>
                        <div><span style={{ color: 'var(--color-neutral-500)' }}>开户行：</span>{ba.bankName}</div>
                        <div><span style={{ color: 'var(--color-neutral-500)' }}>行号：</span><span className="mono">{ba.bankNo}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <SectionTitle>发票信息（{detailPlatform.invoiceInfos.length}/5）</SectionTitle>
              {detailPlatform.invoiceInfos.length === 0 ? <EmptyText>暂无发票信息</EmptyText> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  {detailPlatform.invoiceInfos.map((inv, i) => (
                    <div key={i} style={{ padding: 'var(--space-3)', background: 'var(--color-neutral-50)', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-2)', fontSize: 'var(--text-sm)' }}>
                        <div><span style={{ color: 'var(--color-neutral-500)' }}>发票主体：</span><span style={{ fontWeight: 'var(--font-medium)' }}>{inv.invoiceEntity}</span></div>
                        <div><span style={{ color: 'var(--color-neutral-500)' }}>税号：</span><span className="mono">{inv.taxNo}</span></div>
                        <div><span style={{ color: 'var(--color-neutral-500)' }}>税率：</span>{inv.taxRate}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="drawer-footer">
              {editingPlatform ? (
                <><Button variant="ghost" onClick={handleCancelEditPlatform}>取消</Button><Button onClick={handleSaveEditPlatform}>保存</Button></>
              ) : (
                <><Button variant="ghost" onClick={() => { setShowPlatformDetail(false); setEditingPlatform(false); setEditPlatformForm(null); }}>关闭</Button><Button onClick={handleStartEditPlatform}>编辑</Button></>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 新增客户抽屉 */}
      {showAddDrawer && (
        <CreateDrawer customerType={activeTab} platforms={platforms} sequence={data.filter(c => c.type === activeTab).length + 1} onCancel={() => setShowAddDrawer(false)}
          onSave={item => { setData(prev => [item, ...prev]); setShowAddDrawer(false); }}
          onQuickAddPlatform={quickAddPlatform}
        />
      )}

      {/* 新增平台抽屉 */}
      {showAddPlatformDrawer && <AddPlatformDrawer onCancel={() => setShowAddPlatformDrawer(false)} onSave={item => { setPlatforms(prev => [item, ...prev]); setShowAddPlatformDrawer(false); }} sequence={platforms.length + 1} />}
      </div>
    </>
  );
}

/* ── 新增客户抽屉 ── */
function CreateDrawer({ customerType, platforms, sequence, onCancel, onSave, onQuickAddPlatform }: {
  customerType: CustomerType;
  platforms: { id: string; shortName: string; code: string; name: string; commissionRate: string; contactPerson: string; contactPhone: string }[];
  sequence: number;
  onCancel: () => void;
  onSave: (item: CustomerItem) => void;
  onQuickAddPlatform: (shortName: string) => string;
}) {
  const drawerWidth = useDrawerWidth();
  const [form, setForm] = useState<CustomerItem>({
    id: `c_${Date.now()}`, name: '', shortName: '', customerCode: '', type: customerType, region: '', province: '', city: '', district: '',
    contactPerson: '', contactPhone: '', contactEmail: '', contactAddress: '', level: 'B级', orders: 0, totalAmount: 0, platformIds: [],
    cooperationDate: new Date().toISOString().slice(0, 10), status: 'active', settlementMethod: '月结', taxNo: '', source: '', remark: '',
    bankAccounts: [], invoiceInfos: [],
  });
  const [quickPlatformName, setQuickPlatformName] = useState('');
  const [bankAccounts, setBankAccounts] = useState<CustomerBankAccount[]>([]);
  const [invoiceInfos, setInvoiceInfos] = useState<CustomerInvoiceInfo[]>([]);
  const [newBank, setNewBank] = useState<CustomerBankAccount>({ accountName: '', accountNo: '', bankName: '', bankNo: '' });
  const [newInvoice, setNewInvoice] = useState<CustomerInvoiceInfo>({ invoiceEntity: '', taxNo: '', taxRate: '' });

  const update = <K extends keyof CustomerItem>(k: K, v: CustomerItem[K]) => setForm(prev => ({ ...prev, [k]: v }));
  const togglePlatform = (id: string) => setForm(prev => ({ ...prev, platformIds: prev.platformIds.includes(id) ? prev.platformIds.filter(x => x !== id) : [...prev.platformIds, id] }));
  const isPersonal = customerType === 'personal';
  const canSave = form.name.trim().length > 0 && (form.shortName ?? '').trim().length > 0 && (isPersonal || form.contactPerson.trim().length > 0);

  const previewCode = (form.shortName ?? '').trim() ? generateCustomerCode(customerType, form.shortName!.trim(), sequence) : '—';

  const handleProvinceChange = (p: string) => setForm(prev => ({ ...prev, province: p, city: '', district: '' }));
  const handleCityChange = (c: string) => setForm(prev => ({ ...prev, city: c, district: '' }));
  const handleDistrictChange = (d: string) => setForm(prev => ({ ...prev, district: d }));

  const handleQuickAdd = () => {
    if (!quickPlatformName.trim()) return;
    const newId = onQuickAddPlatform(quickPlatformName.trim());
    setForm(prev => ({ ...prev, platformIds: [...prev.platformIds, newId] }));
    setQuickPlatformName('');
  };

  const addBankAccount = () => {
    if (bankAccounts.length >= 5 || !newBank.accountName) return;
    setBankAccounts(prev => [...prev, { ...newBank }]);
    setNewBank({ accountName: '', accountNo: '', bankName: '', bankNo: '' });
  };
  const addInvoiceInfo = () => {
    if (invoiceInfos.length >= 5 || !newInvoice.invoiceEntity) return;
    setInvoiceInfos(prev => [...prev, { ...newInvoice }]);
    setNewInvoice({ invoiceEntity: '', taxNo: '', taxRate: '' });
  };

  const handleSave = () => {
    if (!canSave) return;
    const shortName = form.shortName!.trim();
    const customerCode = generateCustomerCode(customerType, shortName, sequence);
    const region = form.city ? form.city.replace(/市$/, '') : (form.province || '');
    onSave({ ...form, shortName, customerCode, region, contactPerson: isPersonal ? shortName : form.contactPerson, bankAccounts: isPersonal ? [] : bankAccounts, invoiceInfos: isPersonal ? [] : invoiceInfos });
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
            <div className="drawer-form-field"><label className="drawer-label">客户简称 *</label><input className="filter-input" style={{ width: '100%' }} value={form.shortName ?? ''} onChange={e => update('shortName', e.target.value)} placeholder="请输入客户简称" /></div>
            <div className="drawer-form-field"><label className="drawer-label">客户名称 *</label><input className="filter-input" style={{ width: '100%' }} value={form.name} onChange={e => update('name', e.target.value)} placeholder="请输入客户名称" /></div>
            <div className="drawer-form-field"><label className="drawer-label">客户等级</label><select className="filter-select" style={{ width: '100%' }} value={form.level} onChange={e => update('level', e.target.value)}><option>S级</option><option>A级</option><option>B级</option><option>C级</option></select></div>
          </div>
          <div className="drawer-form-row">
            <div className="drawer-form-field" style={{ flex: 1 }}><label className="drawer-label">客户编号（自动生成）</label><input className="filter-input" style={{ width: '100%' }} value={previewCode} readOnly placeholder="输入客户简称后自动生成" /></div>
          </div>
          <div className="drawer-form-row">
            {!isPersonal && <div className="drawer-form-field"><label className="drawer-label">联系人 *</label><input className="filter-input" style={{ width: '100%' }} value={form.contactPerson} onChange={e => update('contactPerson', e.target.value)} /></div>}
            <div className="drawer-form-field"><label className="drawer-label">联系电话</label><input className="filter-input" style={{ width: '100%' }} value={form.contactPhone} onChange={e => update('contactPhone', e.target.value)} /></div>
            <div className="drawer-form-field"><label className="drawer-label">联系邮箱</label><input className="filter-input" style={{ width: '100%' }} value={form.contactEmail || ''} onChange={e => update('contactEmail', e.target.value)} /></div>
          </div>
          <div className="drawer-form-row">
            <div className="drawer-form-field"><label className="drawer-label">省份</label><select className="filter-select" style={{ width: '100%' }} value={form.province ?? ''} onChange={e => handleProvinceChange(e.target.value)}><option value="">请选择</option>{PROVINCE_NAMES.map(p => <option key={p} value={p}>{p}</option>)}</select></div>
            <div className="drawer-form-field"><label className="drawer-label">城市</label><select className="filter-select" style={{ width: '100%' }} value={form.city ?? ''} disabled={!form.province} onChange={e => handleCityChange(e.target.value)}><option value="">请选择</option>{(form.province ? getCityNames(form.province) : []).map(c => <option key={c} value={c}>{c}</option>)}</select></div>
            <div className="drawer-form-field"><label className="drawer-label">区县</label><select className="filter-select" style={{ width: '100%' }} value={form.district ?? ''} disabled={!form.city} onChange={e => handleDistrictChange(e.target.value)}><option value="">请选择</option>{(form.province && form.city ? getDistricts(form.province, form.city) : []).map(d => <option key={d} value={d}>{d}</option>)}</select></div>
          </div>
          <div className="drawer-form-row">
            <div className="drawer-form-field" style={{ flex: 2 }}><label className="drawer-label">具体地址</label><input className="filter-input" style={{ width: '100%' }} value={form.contactAddress || ''} onChange={e => update('contactAddress', e.target.value)} placeholder="街道、门牌号等" /></div>
            <div className="drawer-form-field"><label className="drawer-label">合作日期</label><input className="filter-input" style={{ width: '100%' }} type="date" value={form.cooperationDate} onChange={e => update('cooperationDate', e.target.value)} /></div>
          </div>
          <div className="drawer-section-title">合作信息</div>
          <div className="drawer-form-row">
            {!isPersonal && <div className="drawer-form-field"><label className="drawer-label">结算方式</label><select className="filter-select" style={{ width: '100%' }} value={form.settlementMethod || ''} onChange={e => update('settlementMethod', e.target.value)}><option value="月结">月结</option><option value="预付">预付</option><option value="季度">季度结算</option><option value="现款">现款</option></select></div>}
            <div className="drawer-form-field"><label className="drawer-label">客户来源</label><select className="filter-select" style={{ width: '100%' }} value={form.source || ''} onChange={e => update('source', e.target.value)}><option value="">请选择</option><option value="主动开发">主动开发</option><option value="展会拓客">展会拓客</option><option value="老客户转介">老客户转介</option><option value="平台引流">平台引流</option><option value="线上咨询">线上咨询</option><option value="其他">其他</option></select></div>
            {!isPersonal && <div className="drawer-form-field"><label className="drawer-label">税号</label><input className="filter-input" style={{ width: '100%' }} value={form.taxNo || ''} onChange={e => update('taxNo', e.target.value)} /></div>}
            <div className="drawer-form-field" style={{ flex: 2 }}>
              <label className="drawer-label">主办人</label>
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <select className="filter-select" style={{ width: 100 }} value={form.hostType ?? ''} onChange={(e) => { update('hostType', (e.target.value || undefined) as 'employee' | 'streamer' | undefined); update('hostId', undefined); }}>
                  <option value="">请选择</option>
                  <option value="employee">员工</option>
                  <option value="streamer">带货人</option>
                </select>
                {form.hostType === 'employee' ? (
                  <DeptEmployeeSelect value={form.hostId ?? ''} onChange={(empId) => update('hostId', empId || undefined)} style={{ flex: 1 }} />
                ) : form.hostType === 'streamer' ? (
                  <select className="filter-select" style={{ flex: 1 }} value={form.hostId ?? ''} onChange={(e) => update('hostId', e.target.value || undefined)}>
                    <option value="">选择带货人</option>
                    {streamers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                ) : (
                  <div style={{ flex: 1, height: 34, display: 'flex', alignItems: 'center', padding: '0 var(--space-3)', border: '1px solid var(--color-border-primary)', borderRadius: 'var(--radius-md)', background: 'var(--color-bg-tertiary)', fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>请先选择类型</div>
                )}
              </div>
            </div>
          </div>
          <div className="drawer-form-row">
            <div className="drawer-form-field" style={{ flex: 1 }}><label className="drawer-label">备注</label><input className="filter-input" style={{ width: '100%' }} value={form.remark || ''} onChange={e => update('remark', e.target.value)} /></div>
            <div className="drawer-form-field"><label className="drawer-label">状态</label><select className="filter-select" style={{ width: '100%' }} value={form.status} onChange={e => update('status', e.target.value as CustomerItem['status'])}><option value="active">合作中</option><option value="inactive">已暂停</option></select></div>
          </div>

          {/* 结算账户 */}
          {!isPersonal && (
            <>
          <div className="drawer-section-title">结算账户（{bankAccounts.length}/5）</div>
          {bankAccounts.map((ba, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-2) var(--space-3)', background: 'var(--color-neutral-50)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-2)', fontSize: 'var(--text-sm)' }}>
              <span style={{ fontWeight: 'var(--font-medium)' }}>{ba.accountName}</span>
              <span className="mono" style={{ color: 'var(--color-neutral-500)' }}>{ba.accountNo}</span>
              <span style={{ color: 'var(--color-neutral-500)' }}>{ba.bankName}</span>
              <button style={{ marginLeft: 'auto', border: 'none', background: 'transparent', color: SECONDARY, cursor: 'pointer', fontSize: 14 }} onClick={() => setBankAccounts(prev => prev.filter((_, j) => j !== i))}>×</button>
            </div>
          ))}
          {bankAccounts.length < 5 && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)', padding: 'var(--space-3)', background: 'var(--color-neutral-50)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-3)' }}>
              <div><label className="drawer-label">户名 *</label><input className="filter-input" style={{ width: '100%' }} value={newBank.accountName} onChange={e => setNewBank(prev => ({ ...prev, accountName: e.target.value }))} /></div>
              <div><label className="drawer-label">账号</label><input className="filter-input" style={{ width: '100%' }} value={newBank.accountNo} onChange={e => setNewBank(prev => ({ ...prev, accountNo: e.target.value }))} /></div>
              <div><label className="drawer-label">开户行</label><input className="filter-input" style={{ width: '100%' }} value={newBank.bankName} onChange={e => setNewBank(prev => ({ ...prev, bankName: e.target.value }))} /></div>
              <div><label className="drawer-label">行号</label><input className="filter-input" style={{ width: '100%' }} value={newBank.bankNo} onChange={e => setNewBank(prev => ({ ...prev, bankNo: e.target.value }))} /></div>
              <div style={{ gridColumn: '1 / -1' }}><Button size="sm" onClick={addBankAccount} disabled={!newBank.accountName}>+ 添加账户</Button></div>
            </div>
          )}

          {/* 发票信息 */}
          <div className="drawer-section-title">发票信息（{invoiceInfos.length}/5）</div>
          {invoiceInfos.map((inv, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-2) var(--space-3)', background: 'var(--color-neutral-50)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-2)', fontSize: 'var(--text-sm)' }}>
              <span style={{ fontWeight: 'var(--font-medium)' }}>{inv.invoiceEntity}</span>
              <span className="mono" style={{ color: 'var(--color-neutral-500)' }}>{inv.taxNo}</span>
              <span style={{ color: 'var(--color-neutral-500)' }}>{inv.taxRate}</span>
              <button style={{ marginLeft: 'auto', border: 'none', background: 'transparent', color: SECONDARY, cursor: 'pointer', fontSize: 14 }} onClick={() => setInvoiceInfos(prev => prev.filter((_, j) => j !== i))}>×</button>
            </div>
          ))}
          {invoiceInfos.length < 5 && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-2)', padding: 'var(--space-3)', background: 'var(--color-neutral-50)', borderRadius: 'var(--radius-md)' }}>
              <div><label className="drawer-label">发票主体 *</label><input className="filter-input" style={{ width: '100%' }} value={newInvoice.invoiceEntity} onChange={e => setNewInvoice(prev => ({ ...prev, invoiceEntity: e.target.value }))} /></div>
              <div><label className="drawer-label">税号</label><input className="filter-input" style={{ width: '100%' }} value={newInvoice.taxNo} onChange={e => setNewInvoice(prev => ({ ...prev, taxNo: e.target.value }))} /></div>
              <div><label className="drawer-label">税率</label><input className="filter-input" style={{ width: '100%' }} value={newInvoice.taxRate} onChange={e => setNewInvoice(prev => ({ ...prev, taxRate: e.target.value }))} placeholder="6%" /></div>
              <div style={{ gridColumn: '1 / -1' }}><Button size="sm" onClick={addInvoiceInfo} disabled={!newInvoice.invoiceEntity}>+ 添加发票主体</Button></div>
            </div>
          )}
            </>
          )}

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
          <Button onClick={handleSave} disabled={!canSave}>保存</Button>
        </div>
      </div>
    </div>
  );
}

/* ── 新增平台抽屉 ── */
function AddPlatformDrawer({ onCancel, onSave, sequence }: { onCancel: () => void; onSave: (item: PlatformItem) => void; sequence: number }) {
  const drawerWidth = useDrawerWidth();
  const [form, setForm] = useState<Partial<PlatformItem>>({
    name: '', shortName: '', contactPerson: '', contactPosition: '', contactPhone: '', contactAddress: '',
    province: '', city: '', district: '',
    cooperationDate: new Date().toISOString().slice(0, 10), commissionRate: '', status: 'active',
    bankAccounts: [], invoiceInfos: [], remark: '',
  });
  const [bankAccounts, setBankAccounts] = useState<PlatformBankAccount[]>([]);
  const [invoiceInfos, setInvoiceInfos] = useState<PlatformInvoiceInfo[]>([]);
  const [newBank, setNewBank] = useState<PlatformBankAccount>({ accountName: '', accountNo: '', bankName: '', bankNo: '' });
  const [newInvoice, setNewInvoice] = useState<PlatformInvoiceInfo>({ invoiceEntity: '', taxNo: '', taxRate: '' });

  const update = <K extends keyof PlatformItem>(k: K, v: PlatformItem[K]) => setForm(prev => ({ ...prev, [k]: v }));
  const canSave = (form.name?.trim().length ?? 0) > 0 && (form.shortName?.trim().length ?? 0) > 0;

  const previewCode = (form.shortName ?? '').trim() ? generateCustomerCode('platform', form.shortName!.trim(), sequence) : '—';

  const handleProvinceChange = (p: string) => setForm(prev => ({ ...prev, province: p, city: '', district: '' }));
  const handleCityChange = (c: string) => setForm(prev => ({ ...prev, city: c, district: '' }));
  const handleDistrictChange = (d: string) => setForm(prev => ({ ...prev, district: d }));

  const addBankAccount = () => {
    if (bankAccounts.length >= 5 || !newBank.accountName) return;
    setBankAccounts(prev => [...prev, { ...newBank }]);
    setNewBank({ accountName: '', accountNo: '', bankName: '', bankNo: '' });
  };
  const addInvoiceInfo = () => {
    if (invoiceInfos.length >= 5 || !newInvoice.invoiceEntity) return;
    setInvoiceInfos(prev => [...prev, { ...newInvoice }]);
    setNewInvoice({ invoiceEntity: '', taxNo: '', taxRate: '' });
  };

  const handleSave = () => {
    if (!canSave) return;
    const shortName = form.shortName!.trim();
    const code = generateCustomerCode('platform', shortName, sequence);
    onSave({
      id: `p_${Date.now()}`, name: form.name!, shortName, code,
      contactPerson: form.contactPerson ?? '', contactPosition: form.contactPosition ?? '', contactPhone: form.contactPhone ?? '', contactAddress: form.contactAddress ?? '',
      province: form.province ?? '', city: form.city ?? '', district: form.district ?? '',
      cooperationDate: form.cooperationDate ?? new Date().toISOString().slice(0, 10), commissionRate: form.commissionRate ?? '',
      bankAccounts, invoiceInfos, status: 'active', remark: form.remark, hostId: form.hostId, hostType: form.hostType,
    } as PlatformItem);
  };

  return (
    <div className="drawer-overlay" onClick={onCancel}>
      <div className="drawer-panel" onClick={e => e.stopPropagation()}>
        <div className="drawer-header">
          <span className="drawer-title">新增平台客户</span>
          <button className="drawer-close" onClick={onCancel}><svg viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg></button>
        </div>
        <div className="drawer-body">
          <SectionTitle>基本信息</SectionTitle>
          <div style={grid2}>
            <Field label="平台名称 *"><input className="filter-input" style={{ width: '100%' }} value={form.name ?? ''} onChange={e => update('name', e.target.value)} placeholder="请输入平台全称" /></Field>
            <Field label="平台简称 *"><input className="filter-input" style={{ width: '100%' }} value={form.shortName ?? ''} onChange={e => update('shortName', e.target.value)} placeholder="如：京东慧采" /></Field>
            <Field label="平台编号（自动生成）" full><input className="filter-input" style={{ width: '100%' }} value={previewCode} readOnly placeholder="输入平台简称后自动生成" /></Field>
            <Field label="联系人"><input className="filter-input" style={{ width: '100%' }} value={form.contactPerson ?? ''} onChange={e => update('contactPerson', e.target.value)} /></Field>
            <Field label="联系人职务"><input className="filter-input" style={{ width: '100%' }} value={form.contactPosition ?? ''} onChange={e => update('contactPosition', e.target.value)} placeholder="如：采购总监" /></Field>
            <Field label="主办人" full>
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <select className="filter-select" style={{ width: 100 }} value={form.hostType ?? ''} onChange={(e) => { update('hostType', (e.target.value || undefined) as 'employee' | 'streamer' | undefined); update('hostId', undefined); }}>
                  <option value="">请选择</option>
                  <option value="employee">员工</option>
                  <option value="streamer">带货人</option>
                </select>
                {form.hostType === 'employee' ? (
                  <DeptEmployeeSelect value={form.hostId ?? ''} onChange={(empId) => update('hostId', empId || undefined)} style={{ flex: 1 }} />
                ) : form.hostType === 'streamer' ? (
                  <select className="filter-select" style={{ flex: 1 }} value={form.hostId ?? ''} onChange={(e) => update('hostId', e.target.value || undefined)}>
                    <option value="">选择带货人</option>
                    {streamers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                ) : (
                  <div style={{ flex: 1, height: 34, display: 'flex', alignItems: 'center', padding: '0 var(--space-3)', border: '1px solid var(--color-border-primary)', borderRadius: 'var(--radius-md)', background: 'var(--color-bg-tertiary)', fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>请先选择类型</div>
                )}
              </div>
            </Field>
            <Field label="联系电话"><input className="filter-input" style={{ width: '100%' }} value={form.contactPhone ?? ''} onChange={e => update('contactPhone', e.target.value)} /></Field>
          </div>

          <SectionTitle>所在地区</SectionTitle>
          <div style={grid2}>
            <Field label="省份"><select className="filter-select" style={{ width: '100%' }} value={form.province ?? ''} onChange={e => handleProvinceChange(e.target.value)}><option value="">请选择</option>{PROVINCE_NAMES.map(p => <option key={p} value={p}>{p}</option>)}</select></Field>
            <Field label="城市"><select className="filter-select" style={{ width: '100%' }} value={form.city ?? ''} disabled={!form.province} onChange={e => handleCityChange(e.target.value)}><option value="">请选择</option>{(form.province ? getCityNames(form.province) : []).map(c => <option key={c} value={c}>{c}</option>)}</select></Field>
            <Field label="区县"><select className="filter-select" style={{ width: '100%' }} value={form.district ?? ''} disabled={!form.city} onChange={e => handleDistrictChange(e.target.value)}><option value="">请选择</option>{(form.province && form.city ? getDistricts(form.province, form.city) : []).map(d => <option key={d} value={d}>{d}</option>)}</select></Field>
            <Field label="具体地址"><input className="filter-input" style={{ width: '100%' }} value={form.contactAddress ?? ''} onChange={e => update('contactAddress', e.target.value)} placeholder="街道、门牌号等" /></Field>
            <Field label="合作日期"><input className="filter-input" style={{ width: '100%' }} type="date" value={form.cooperationDate ?? ''} onChange={e => update('cooperationDate', e.target.value)} /></Field>
            <Field label="平台扣点"><input className="filter-input" style={{ width: '100%' }} value={form.commissionRate ?? ''} onChange={e => update('commissionRate', e.target.value)} placeholder="如：8%" /></Field>
            <Field label="备注" full><input className="filter-input" style={{ width: '100%' }} value={form.remark ?? ''} onChange={e => update('remark', e.target.value)} /></Field>
          </div>

          <SectionTitle>结算账户（{bankAccounts.length}/5）</SectionTitle>
          {bankAccounts.map((ba, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-2) var(--space-3)', background: 'var(--color-neutral-50)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-2)', fontSize: 'var(--text-sm)' }}>
              <span style={{ fontWeight: 'var(--font-medium)' }}>{ba.accountName}</span>
              <span className="mono" style={{ color: 'var(--color-neutral-500)' }}>{ba.accountNo}</span>
              <span style={{ color: 'var(--color-neutral-500)' }}>{ba.bankName}</span>
              <button style={{ marginLeft: 'auto', border: 'none', background: 'transparent', color: SECONDARY, cursor: 'pointer', fontSize: 14 }} onClick={() => setBankAccounts(prev => prev.filter((_, j) => j !== i))}>×</button>
            </div>
          ))}
          {bankAccounts.length < 5 && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)', padding: 'var(--space-3)', background: 'var(--color-neutral-50)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-3)' }}>
              <div><label className="drawer-label">户名 *</label><input className="filter-input" style={{ width: '100%' }} value={newBank.accountName} onChange={e => setNewBank(prev => ({ ...prev, accountName: e.target.value }))} /></div>
              <div><label className="drawer-label">账号</label><input className="filter-input" style={{ width: '100%' }} value={newBank.accountNo} onChange={e => setNewBank(prev => ({ ...prev, accountNo: e.target.value }))} /></div>
              <div><label className="drawer-label">开户行</label><input className="filter-input" style={{ width: '100%' }} value={newBank.bankName} onChange={e => setNewBank(prev => ({ ...prev, bankName: e.target.value }))} /></div>
              <div><label className="drawer-label">行号</label><input className="filter-input" style={{ width: '100%' }} value={newBank.bankNo} onChange={e => setNewBank(prev => ({ ...prev, bankNo: e.target.value }))} /></div>
              <div style={{ gridColumn: '1 / -1' }}><Button size="sm" onClick={addBankAccount} disabled={!newBank.accountName}>+ 添加账户</Button></div>
            </div>
          )}

          <SectionTitle>发票信息（{invoiceInfos.length}/5）</SectionTitle>
          {invoiceInfos.map((inv, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-2) var(--space-3)', background: 'var(--color-neutral-50)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-2)', fontSize: 'var(--text-sm)' }}>
              <span style={{ fontWeight: 'var(--font-medium)' }}>{inv.invoiceEntity}</span>
              <span className="mono" style={{ color: 'var(--color-neutral-500)' }}>{inv.taxNo}</span>
              <span style={{ color: 'var(--color-neutral-500)' }}>{inv.taxRate}</span>
              <button style={{ marginLeft: 'auto', border: 'none', background: 'transparent', color: SECONDARY, cursor: 'pointer', fontSize: 14 }} onClick={() => setInvoiceInfos(prev => prev.filter((_, j) => j !== i))}>×</button>
            </div>
          ))}
          {invoiceInfos.length < 5 && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-2)', padding: 'var(--space-3)', background: 'var(--color-neutral-50)', borderRadius: 'var(--radius-md)' }}>
              <div><label className="drawer-label">发票主体 *</label><input className="filter-input" style={{ width: '100%' }} value={newInvoice.invoiceEntity} onChange={e => setNewInvoice(prev => ({ ...prev, invoiceEntity: e.target.value }))} /></div>
              <div><label className="drawer-label">税号</label><input className="filter-input" style={{ width: '100%' }} value={newInvoice.taxNo} onChange={e => setNewInvoice(prev => ({ ...prev, taxNo: e.target.value }))} /></div>
              <div><label className="drawer-label">税率</label><input className="filter-input" style={{ width: '100%' }} value={newInvoice.taxRate} onChange={e => setNewInvoice(prev => ({ ...prev, taxRate: e.target.value }))} placeholder="6%" /></div>
              <div style={{ gridColumn: '1 / -1' }}><Button size="sm" onClick={addInvoiceInfo} disabled={!newInvoice.invoiceEntity}>+ 添加发票主体</Button></div>
            </div>
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

/* ── 通用组件 ── */
const grid2: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' };
function SectionTitle({ children }: { children: React.ReactNode }) { return <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--color-neutral-700)', margin: 'var(--space-4) 0 var(--space-3)' }}>{children}</div>; }
function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) { return <div style={{ gridColumn: full ? '1 / -1' : undefined }}><label className="drawer-label">{label}</label>{children}</div>; }
function Text({ children, className, style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) { return <div className={className} style={{ fontSize: 'var(--text-sm)', color: 'var(--color-neutral-800)', fontWeight: 'var(--font-medium)', ...style }}>{children}</div>; }
function EmptyText({ children }: { children: React.ReactNode }) { return <div style={{ padding: 'var(--space-3)', textAlign: 'center', fontSize: 'var(--text-sm)', color: 'var(--color-neutral-400)' }}>{children}</div>; }

/* ── SVG 图标 ── */
function IconUsers() { return <svg viewBox="0 0 18 18" fill="none"><circle cx="7" cy="6.5" r="2.8" stroke="currentColor" strokeWidth="1.3" /><path d="M1 15c0-3 2.7-5 6-5s6 2 6 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /><circle cx="13" cy="7" r="2.2" stroke="currentColor" strokeWidth="1.2" /><path d="M13 11c2 0 4 1.5 4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>; }
function IconHome() { return <svg viewBox="0 0 18 18" fill="none"><path d="M3 8.5L9 3.5l6 5" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" strokeLinecap="round" /><path d="M4.5 8v7h9v-7" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /></svg>; }
function IconChannel() { return <svg viewBox="0 0 18 18" fill="none"><path d="M2 10l3 2 3-4 3 5 3-3 2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /><circle cx="4" cy="5" r="1.5" stroke="currentColor" strokeWidth="1.3" /></svg>; }
function IconPersonal() { return <svg viewBox="0 0 18 18" fill="none"><circle cx="9" cy="6" r="3" stroke="currentColor" strokeWidth="1.3" /><path d="M3 15c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>; }
function IconPlatform() { return <svg viewBox="0 0 18 18" fill="none"><rect x="3" y="5" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3" /><path d="M6 5V3.5A1.5 1.5 0 017.5 2h3A1.5 1.5 0 0112 3.5V5" stroke="currentColor" strokeWidth="1.3" /><path d="M9 8v2M8 9h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>; }
