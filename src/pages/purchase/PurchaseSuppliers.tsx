import { useState, useMemo } from 'react';
import ContentHeader from '../../components/layout/ContentHeader';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import {
  supplierItems,
  SUPPLIER_TYPE_LABELS,
  SUPPLIER_TYPE_COLORS,
  GRADE_COLORS,
  TAX_TYPE_LABELS,
  SETTLEMENT_METHOD_LABELS,
  SHIPPING_SETTLEMENT_LABELS,
  QUALIFICATION_STATUS_LABELS,
} from '../../data/suppliers';
import type { SupplierItem, SupplierType, SupplierGrade } from '../../types';
import type { StatCardData } from '../../types';

/* ── 供应商类型筛选配置 ── */
const TYPE_FILTER: { key: SupplierType | 'all'; label: string; color: string; desc: string }[] = [
  { key: 'all', label: '全部供应商', color: 'var(--color-module-current-base)', desc: '所有合作供应商' },
  { key: 'brand', label: '品牌方', color: 'var(--color-module-current-base)', desc: '品牌方直接合作，拥有品牌授权' },
  { key: 'partner', label: '合作方', color: '#0DAFC6', desc: '合作方间接合作，非品牌持有方' },
];

export default function PurchaseSuppliers() {
  const [activeType, setActiveType] = useState<SupplierType | 'all'>('all');
  const [keyword, setKeyword] = useState('');
  const [filterGrade, setFilterGrade] = useState('');
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedForDelete, setSelectedForDelete] = useState<Set<string>>(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showAddDrawer, setShowAddDrawer] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierItem | null>(null);
  const [detailTab, setDetailTab] = useState<'basic' | 'business' | 'warehouse' | 'finance'>('basic');
  const [ocrLoading, setOcrLoading] = useState(false);

  // 筛选
  const filtered = useMemo(() => {
    return supplierItems.filter(s => {
      if (activeType !== 'all' && s.type !== activeType) return false;
      if (filterGrade && s.grade !== filterGrade) return false;
      if (keyword && !s.name.includes(keyword) && !s.unifiedCreditCode.includes(keyword) && !s.contactPerson.includes(keyword)) return false;
      return true;
    });
  }, [activeType, keyword, filterGrade]);

  // 统计
  const stats: StatCardData[] = useMemo(() => {
    const brandCount = supplierItems.filter(s => s.type === 'brand').length;
    const partnerCount = supplierItems.filter(s => s.type === 'partner').length;
    const activeCount = supplierItems.filter(s => s.status === 'active').length;
    const gradeA = supplierItems.filter(s => s.grade === 'A' || s.grade === 'S').length;
    return [
      {
        label: '品牌方', value: String(brandCount), unit: '家',
        trend: { direction: 'up', value: `在册 ${supplierItems.filter(s => s.type === 'brand' && s.status === 'active').length} 家` },
        icon: <svg viewBox="0 0 18 18" fill="none"><path d="M9 2L3 5v5c0 5 3.5 7.5 7 9 3.5-1.5 7-4 7-9V5L9 2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>,
      },
      {
        label: '合作方', value: String(partnerCount), unit: '家',
        trend: { direction: 'up', value: `在册 ${supplierItems.filter(s => s.type === 'partner' && s.status === 'active').length} 家` },
        icon: <svg viewBox="0 0 18 18" fill="none"><circle cx="7" cy="7" r="3" stroke="currentColor" strokeWidth="1.3"/><path d="M2 16a5 5 0 0110 0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><circle cx="14" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.2"/></svg>,
      },
      {
        label: '在册供应商', value: String(activeCount), unit: '家',
        trend: { direction: 'up', value: `总计 ${supplierItems.length} 家` },
        icon: <svg viewBox="0 0 18 18" fill="none"><rect x="3" y="5" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M3 9h12M7 5V3h4v2" stroke="currentColor" strokeWidth="1.3"/></svg>,
      },
      {
        label: 'A级以上', value: String(gradeA), unit: '家',
        trend: { direction: 'up', value: `占比 ${(gradeA / supplierItems.length * 100).toFixed(0)}%` },
        icon: <svg viewBox="0 0 18 18" fill="none"><path d="M9 2l2.5 5 5.5.8-4 3.9.9 5.5L9 14.7 5.1 17.2l.9-5.5-4-3.9L7.5 7z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>,
      },
    ];
  }, []);

  // 删除
  const handleEnterDeleteMode = () => { setDeleteMode(true); setSelectedForDelete(new Set()); };
  const handleCancelDeleteMode = () => { setDeleteMode(false); setSelectedForDelete(new Set()); setShowDeleteConfirm(false); };
  const handleToggleSelect = (id: string) => {
    setSelectedForDelete(prev => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  };

  // 查看详情
  const handleView = (s: SupplierItem) => { setSelectedSupplier(s); setDetailTab('basic'); setShowDetail(true); };

  // OCR 模拟
  const handleOcr = () => {
    setOcrLoading(true);
    setTimeout(() => { setOcrLoading(false); }, 2000);
  };

  return (
    <div>
      <ContentHeader title="供应商管理" breadcrumbs={['采购', '供应商管理']} />

      {/* 统计卡片 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)', marginBottom: 'var(--space-5)' }}>
        {stats.map((s, i) => <StatCard key={i} data={s} />)}
      </div>

      {/* 类型筛选卡片 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)', marginBottom: 'var(--space-5)' }}>
        {TYPE_FILTER.map(tf => {
          const count = tf.key === 'all' ? supplierItems.length : supplierItems.filter(s => s.type === tf.key).length;
          const isActive = activeType === tf.key;
          return (
            <div key={tf.key} style={{ cursor: 'pointer', border: isActive ? `2px solid ${tf.color}` : '1px solid var(--color-border-primary)', background: isActive ? `${tf.color}08` : 'var(--color-bg-primary)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', boxShadow: 'var(--shadow-sm)' }} onClick={() => setActiveType(isActive ? 'all' : tf.key)}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontWeight: 'var(--font-semibold)', fontSize: 'var(--text-base)', color: 'var(--color-text-primary)' }}>{tf.label}</span>
                <span style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', color: tf.color }}>{count}</span>
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{tf.desc}</div>
            </div>
          );
        })}
      </div>

      {/* 工具栏 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
        <input className="filter-input" placeholder="搜索名称、信用代码、联系人..." value={keyword} onChange={e => setKeyword(e.target.value)} style={{ width: 260 }} />
        <select className="filter-select" value={filterGrade} onChange={e => setFilterGrade(e.target.value)}>
          <option value="">全部等级</option>
          <option value="S">S级</option><option value="A">A级</option><option value="B">B级</option><option value="C">C级</option><option value="D">D级</option>
        </select>
        <Button onClick={() => setShowAddDrawer(true)}>
          <svg viewBox="0 0 16 16" fill="none" style={{ width: 14, height: 14 }}><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          新增
        </Button>
        {deleteMode ? (
          <>
            <Button style={{ background: '#0F64B5', borderColor: '#0F64B5' }} onClick={() => setShowDeleteConfirm(true)} disabled={selectedForDelete.size === 0}>
              <svg viewBox="0 0 16 16" fill="none" style={{ width: 14, height: 14 }}><path d="M2 4h12M5.33 4V2.67a1.33 1.33 0 011.34-1.34h2.66a1.33 1.33 0 011.34 1.34V4m2 0v9.33a1.33 1.33 0 01-1.34 1.34H4.67a1.33 1.33 0 01-1.34-1.34V4h9.34z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              删除所选({selectedForDelete.size})
            </Button>
            <Button variant="ghost" onClick={handleCancelDeleteMode}>取消</Button>
          </>
        ) : (
          <Button style={{ background: '#0F64B5', borderColor: '#0F64B5' }} onClick={handleEnterDeleteMode}>
            <svg viewBox="0 0 16 16" fill="none" style={{ width: 14, height: 14 }}><path d="M2 4h12M5.33 4V2.67a1.33 1.33 0 011.34-1.34h2.66a1.33 1.33 0 011.34 1.34V4m2 0v9.33a1.33 1.33 0 01-1.34 1.34H4.67a1.33 1.33 0 01-1.34-1.34V4h9.34z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            删除
          </Button>
        )}
        <span style={{ marginLeft: 'auto', fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>共 {filtered.length} 家供应商</span>
      </div>

      {/* 列表 */}
      <Card style={{ padding: 0 }}>
        <Table
          headers={[
            ...(deleteMode ? [<input key="chk" type="checkbox" checked={selectedForDelete.size === filtered.length && filtered.length > 0} onChange={e => { if (e.target.checked) setSelectedForDelete(new Set(filtered.map(s => s.id))); else setSelectedForDelete(new Set()); }} />] : []),
            '供应商名称', '类型', '评价等级', '主营品类', '联系人', '联系电话', '仓库', '一件代发', '状态', '操作',
          ]}
          rows={filtered.map(s => [
            ...(deleteMode ? [<input key="chk" type="checkbox" checked={selectedForDelete.has(s.id)} onChange={() => handleToggleSelect(s.id)} />] : []),
            <span key="name" style={{ fontWeight: 'var(--font-medium)' }}>{s.name}</span>,
            <span key="type" style={{ padding: '1px 8px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-medium)', background: `${SUPPLIER_TYPE_COLORS[s.type]}15`, color: SUPPLIER_TYPE_COLORS[s.type], border: `1px solid ${SUPPLIER_TYPE_COLORS[s.type]}30` }}>{SUPPLIER_TYPE_LABELS[s.type]}</span>,
            <span key="grade" style={{ fontWeight: 'var(--font-bold)', color: GRADE_COLORS[s.grade] || GRADE_COLORS['C'] }}>{s.grade}级</span>,
            <span key="cat" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{s.mainCategories.join('、')}</span>,
            <span key="cp" style={{ fontSize: 'var(--text-sm)' }}>{s.contactPerson}</span>,
            <span key="cph" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{s.contactPhone}</span>,
            <span key="wh" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{s.warehouses.length}个</span>,
            <span key="drop" style={{ fontSize: 'var(--text-sm)', color: s.supportDropship ? '#01795D' : 'var(--color-text-tertiary)' }}>{s.supportDropship ? '是' : '否'}</span>,
            <span key="st" style={{ padding: '2px 8px', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-medium)', background: s.status === 'active' ? '#E8F5E9' : '#FFF3E0', color: s.status === 'active' ? '#2E7D32' : '#E65100' }}>{s.status === 'active' ? '在册' : '停用'}</span>,
            <Button key="view" size="sm" variant="ghost" onClick={() => handleView(s)}>查看</Button>,
          ])}
        />
      </Card>

      {/* 删除确认 */}
      {showDeleteConfirm && (
        <div className="category-dialog-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="category-dialog" onClick={e => e.stopPropagation()} style={{ maxWidth: 400 }}>
            <h3 style={{ marginBottom: 'var(--space-3)' }}>确认删除</h3>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>确定要删除选中的 {selectedForDelete.size} 家供应商吗？此操作不可撤销。</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>
              <Button variant="ghost" onClick={() => setShowDeleteConfirm(false)}>取消</Button>
              <Button style={{ background: '#0F64B5', borderColor: '#0F64B5' }} onClick={handleCancelDeleteMode}>确认删除</Button>
            </div>
          </div>
        </div>
      )}

      {/* 详情弹窗 */}
      {showDetail && selectedSupplier && (
        <div className="category-dialog-overlay" onClick={() => setShowDetail(false)}>
          <div className="category-dialog" onClick={e => e.stopPropagation()} style={{ maxWidth: 800, maxHeight: '90vh', overflow: 'auto' }}>
            {/* 头部 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
              <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-lg)', background: 'var(--color-module-current-lightest)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--color-module-current-base)', flexShrink: 0 }}>
                {selectedSupplier.name.charAt(0)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 4 }}>
                  <span style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)' }}>{selectedSupplier.name}</span>
                  <span style={{ padding: '1px 8px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-medium)', background: `${SUPPLIER_TYPE_COLORS[selectedSupplier.type]}15`, color: SUPPLIER_TYPE_COLORS[selectedSupplier.type], border: `1px solid ${SUPPLIER_TYPE_COLORS[selectedSupplier.type]}30` }}>{SUPPLIER_TYPE_LABELS[selectedSupplier.type]}</span>
                  <span style={{ fontWeight: 'var(--font-bold)', color: GRADE_COLORS[selectedSupplier.grade] || GRADE_COLORS['C'], fontSize: 'var(--text-sm)' }}>{selectedSupplier.grade}级</span>
                  <span style={{ padding: '2px 8px', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-medium)', background: selectedSupplier.status === 'active' ? '#E8F5E9' : '#FFF3E0', color: selectedSupplier.status === 'active' ? '#2E7D32' : '#E65100' }}>{selectedSupplier.status === 'active' ? '在册' : '停用'}</span>
                </div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>{selectedSupplier.introduction}</div>
              </div>
            </div>

            {/* Tab 切换 */}
            <div style={{ display: 'flex', gap: 0, borderBottom: '2px solid var(--color-border-primary)', marginBottom: 'var(--space-4)' }}>
              {([['basic', '基本信息'], ['business', '经营信息'], ['warehouse', '仓库信息'], ['finance', '财务信息']] as const).map(([key, label]) => (
                <div key={key} onClick={() => setDetailTab(key)} style={{ padding: 'var(--space-2) var(--space-4)', cursor: 'pointer', fontSize: 'var(--text-sm)', fontWeight: detailTab === key ? 'var(--font-semibold)' : 'var(--font-medium)', color: detailTab === key ? 'var(--color-module-current-base)' : 'var(--color-text-tertiary)', borderBottom: detailTab === key ? '2px solid var(--color-module-current-base)' : '2px solid transparent', marginBottom: -2 }}>
                  {label}
                </div>
              ))}
            </div>

            {/* 基本信息 */}
            {detailTab === 'basic' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-3)' }}>
                {[
                  ['统一社会信用代码', selectedSupplier.unifiedCreditCode],
                  ['公司类型', selectedSupplier.companyType],
                  ['法定代表人', selectedSupplier.legalRepresentative],
                  ['成立日期', selectedSupplier.establishmentDate],
                  ['注册资本', selectedSupplier.registeredCapital],
                  ['注册地址', selectedSupplier.registeredAddress],
                  ['经营范围', selectedSupplier.businessScope],
                  ['联系人', selectedSupplier.contactPerson],
                  ['联系人职务', selectedSupplier.contactPosition],
                  ['联系电话', selectedSupplier.contactPhone],
                  ['联系邮箱', selectedSupplier.contactEmail],
                  ['联系地址', selectedSupplier.contactAddress],
                  ['合作时间', selectedSupplier.cooperationDate],
                  ['主营品类', selectedSupplier.mainCategories.join('、')],
                  ['资质状态', QUALIFICATION_STATUS_LABELS[selectedSupplier.qualificationStatus]],
                ].map(([label, value]) => (
                  <div key={label} style={{ fontSize: 'var(--text-sm)' }}>
                    <span style={{ color: 'var(--color-text-tertiary)' }}>{label}：</span>
                    <span style={{ color: 'var(--color-text-primary)', fontWeight: 'var(--font-medium)' }}>{value}</span>
                  </div>
                ))}
                {/* 文件信息 */}
                <div style={{ gridColumn: '1 / -1', fontSize: 'var(--text-sm)' }}>
                  <span style={{ color: 'var(--color-text-tertiary)' }}>合作协议：</span>
                  <span style={{ color: 'var(--color-module-current-base)' }}>{selectedSupplier.cooperationAgreements.join('、') || '无'}</span>
                </div>
                <div style={{ gridColumn: '1 / -1', fontSize: 'var(--text-sm)' }}>
                  <span style={{ color: 'var(--color-text-tertiary)' }}>品牌授权协议：</span>
                  <span style={{ color: 'var(--color-module-current-base)' }}>{selectedSupplier.brandAuthAgreements.join('、') || '无'}</span>
                </div>
              </div>
            )}

            {/* 经营信息 */}
            {detailTab === 'business' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-3)' }}>
                {[
                  ['结算方式', SETTLEMENT_METHOD_LABELS[selectedSupplier.settlementMethod]],
                  ['付款条件', selectedSupplier.paymentTerms],
                  ['交货周期', selectedSupplier.deliveryCycle],
                  ['最低起订额', `¥${selectedSupplier.minOrderAmount.toLocaleString()}`],
                  ['退货政策', selectedSupplier.returnPolicy],
                  ['质量保证', selectedSupplier.qualityGuarantee],
                  ['快递费结算', SHIPPING_SETTLEMENT_LABELS[selectedSupplier.shippingSettlement]],
                  ['运费', selectedSupplier.shippingSettlement !== 'free' ? (selectedSupplier.shippingSettlement === 'not_free_fixed' ? `¥${selectedSupplier.shippingFee}/单` : `${selectedSupplier.shippingFee}%`) : '—'],
                  ['运费备注', selectedSupplier.shippingRemark || '—'],
                  ['一件代发', selectedSupplier.supportDropship ? '支持' : '不支持'],
                  ['税务类型', TAX_TYPE_LABELS[selectedSupplier.taxType]],
                  ['备注', selectedSupplier.remark || '—'],
                ].map(([label, value]) => (
                  <div key={label} style={{ fontSize: 'var(--text-sm)' }}>
                    <span style={{ color: 'var(--color-text-tertiary)' }}>{label}：</span>
                    <span style={{ color: 'var(--color-text-primary)', fontWeight: 'var(--font-medium)' }}>{value}</span>
                  </div>
                ))}
              </div>
            )}

            {/* 仓库信息 */}
            {detailTab === 'warehouse' && (
              <div>
                {selectedSupplier.warehouses.length === 0 ? (
                  <p style={{ color: 'var(--color-text-tertiary)', textAlign: 'center', padding: 'var(--space-6)' }}>暂无仓库信息</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    {selectedSupplier.warehouses.map((wh, i) => (
                      <div key={wh.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3)', background: 'var(--color-bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                        <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--color-module-current-lightest)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--color-module-current-base)' }}>
                          {i + 1}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 2 }}>
                            <span style={{ fontWeight: 'var(--font-medium)', fontSize: 'var(--text-sm)' }}>{wh.name}</span>
                            {wh.isDefault && <span style={{ padding: '0 6px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)', background: '#E8F5E9', color: '#2E7D32' }}>默认</span>}
                          </div>
                          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{wh.address} | {wh.contactPerson} {wh.contactPhone}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 财务信息 */}
            {detailTab === 'finance' && (
              <div>
                <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-2)', color: 'var(--color-text-secondary)' }}>开票信息</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                  {[
                    ['抬头', selectedSupplier.invoiceInfo.title],
                    ['税号', selectedSupplier.invoiceInfo.taxNo],
                    ['税率', `${selectedSupplier.invoiceInfo.taxRate}%`],
                    ['开票地址', selectedSupplier.invoiceInfo.address || '—'],
                    ['开票电话', selectedSupplier.invoiceInfo.phone || '—'],
                    ['开户银行', selectedSupplier.invoiceInfo.bankName || '—'],
                    ['银行账号', selectedSupplier.invoiceInfo.bankAccount || '—'],
                  ].map(([label, value]) => (
                    <div key={label} style={{ fontSize: 'var(--text-sm)' }}>
                      <span style={{ color: 'var(--color-text-tertiary)' }}>{label}：</span>
                      <span style={{ color: 'var(--color-text-primary)', fontWeight: 'var(--font-medium)' }}>{value}</span>
                    </div>
                  ))}
                </div>
                <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-2)', color: 'var(--color-text-secondary)' }}>结算银行账号</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-3)' }}>
                  {[
                    ['户名', selectedSupplier.bankAccount.accountName],
                    ['账号', selectedSupplier.bankAccount.accountNo],
                    ['开户行', selectedSupplier.bankAccount.bankName],
                    ['行号', selectedSupplier.bankAccount.bankNo],
                    ['结算备注', selectedSupplier.bankAccount.remark || '—'],
                  ].map(([label, value]) => (
                    <div key={label} style={{ fontSize: 'var(--text-sm)' }}>
                      <span style={{ color: 'var(--color-text-tertiary)' }}>{label}：</span>
                      <span style={{ color: 'var(--color-text-primary)', fontWeight: 'var(--font-medium)' }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-4)' }}>
              <Button variant="ghost" onClick={() => setShowDetail(false)}>关闭</Button>
            </div>
          </div>
        </div>
      )}

      {/* 新增供应商抽屉 */}
      {showAddDrawer && (
        <div className="drawer-overlay" onClick={() => setShowAddDrawer(false)}>
          <div className="drawer-panel" onClick={e => e.stopPropagation()}>
            <div className="drawer-header">
              <span className="drawer-title">新增供应商</span>
              <button className="drawer-close" onClick={() => setShowAddDrawer(false)}>
                <svg viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </button>
            </div>
            <div className="drawer-body">

            {/* 营业执照OCR */}
            <div style={{ background: 'var(--color-bg-tertiary)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
              <div style={{ fontWeight: 'var(--font-semibold)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}>营业执照识别</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <div style={{ flex: 1, border: '2px dashed var(--color-border-primary)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)', textAlign: 'center', color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', cursor: 'pointer' }}>
                  点击上传营业执照图片
                </div>
                <Button onClick={handleOcr} disabled={ocrLoading}>
                  {ocrLoading ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid var(--color-neutral-300)', borderTopColor: 'var(--color-module-current-base)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                      识别中...
                    </span>
                  ) : '自动识别'}
                </Button>
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginTop: 'var(--space-1)' }}>上传营业执照图片，自动识别统一社会信用代码、公司名称、法定代表人等信息</div>
            </div>

            {/* 基本信息 */}
            <div className="drawer-section-title">基本信息</div>
            <div className="drawer-form-row">
              <div className="drawer-form-field">
                <label className="drawer-label">供应商类型 *</label>
                <select className="filter-select" style={{ width: '100%' }}>
                  <option value="">请选择</option>
                  <option value="brand">品牌方</option>
                  <option value="partner">合作方</option>
                </select>
              </div>
              <div className="drawer-form-field">
                <label className="drawer-label">名称 *</label>
                <input className="filter-input" placeholder="请输入供应商名称" style={{ width: '100%' }} />
              </div>
              <div className="drawer-form-field">
                <label className="drawer-label">统一社会信用代码 *</label>
                <input className="filter-input" placeholder="请输入18位信用代码" style={{ width: '100%' }} />
              </div>
            </div>
            <div className="drawer-form-row">
              <div className="drawer-form-field">
                <label className="drawer-label">公司类型</label>
                <input className="filter-input" placeholder="如：有限责任公司" style={{ width: '100%' }} />
              </div>
              <div className="drawer-form-field">
                <label className="drawer-label">法定代表人</label>
                <input className="filter-input" placeholder="请输入" style={{ width: '100%' }} />
              </div>
              <div className="drawer-form-field">
                <label className="drawer-label">成立日期</label>
                <input className="filter-input" placeholder="YYYY-MM-DD" style={{ width: '100%' }} />
              </div>
            </div>
            <div className="drawer-form-row">
              <div className="drawer-form-field">
                <label className="drawer-label">注册资本</label>
                <input className="filter-input" placeholder="如：500万元" style={{ width: '100%' }} />
              </div>
              <div className="drawer-form-field" style={{ flex: 2 }}>
                <label className="drawer-label">注册地址</label>
                <input className="filter-input" placeholder="请输入注册地址" style={{ width: '100%' }} />
              </div>
            </div>
            <div className="drawer-form-row">
              <div className="drawer-form-field">
                <label className="drawer-label">经营范围</label>
                <textarea className="filter-input" placeholder="请输入经营范围" style={{ width: '100%', minHeight: 60, resize: 'vertical' }} />
              </div>
            </div>

            {/* 联系信息 */}
            <div className="drawer-section-title">联系信息</div>
            <div className="drawer-form-row">
              <div className="drawer-form-field"><label className="drawer-label">联系人 *</label><input className="filter-input" placeholder="请输入" style={{ width: '100%' }} /></div>
              <div className="drawer-form-field"><label className="drawer-label">联系人职务</label><input className="filter-input" placeholder="请输入" style={{ width: '100%' }} /></div>
              <div className="drawer-form-field"><label className="drawer-label">联系电话 *</label><input className="filter-input" placeholder="请输入" style={{ width: '100%' }} /></div>
            </div>
            <div className="drawer-form-row">
              <div className="drawer-form-field"><label className="drawer-label">联系邮箱</label><input className="filter-input" placeholder="请输入" style={{ width: '100%' }} /></div>
              <div className="drawer-form-field" style={{ flex: 2 }}><label className="drawer-label">联系地址</label><input className="filter-input" placeholder="请输入" style={{ width: '100%' }} /></div>
            </div>

            {/* 合作信息 */}
            <div className="drawer-section-title">合作信息</div>
            <div className="drawer-form-row">
              <div className="drawer-form-field"><label className="drawer-label">合作时间</label><input className="filter-input" placeholder="YYYY-MM-DD" style={{ width: '100%' }} /></div>
              <div className="drawer-form-field"><label className="drawer-label">评价等级</label><select className="filter-select" style={{ width: '100%' }}><option value="">请选择</option><option value="S">S级</option><option value="A">A级</option><option value="B">B级</option><option value="C">C级</option><option value="D">D级</option></select></div>
              <div className="drawer-form-field"><label className="drawer-label">主营品类</label><input className="filter-input" placeholder="如：绿茶、红茶" style={{ width: '100%' }} /></div>
            </div>
            <div className="drawer-form-row">
              <div className="drawer-form-field"><label className="drawer-label">结算方式</label><select className="filter-select" style={{ width: '100%' }}><option value="">请选择</option><option value="period">周期结</option><option value="prepaid">先款结</option><option value="invoice">见票结</option><option value="monthly">月结</option><option value="quarterly">季结</option></select></div>
              <div className="drawer-form-field"><label className="drawer-label">付款条件</label><input className="filter-input" placeholder="如：月结30天" style={{ width: '100%' }} /></div>
              <div className="drawer-form-field"><label className="drawer-label">交货周期</label><input className="filter-input" placeholder="如：3-5个工作日" style={{ width: '100%' }} /></div>
            </div>
            <div className="drawer-form-row">
              <div className="drawer-form-field"><label className="drawer-label">最低起订额(元)</label><input className="filter-input" placeholder="请输入" style={{ width: '100%' }} type="number" /></div>
              <div className="drawer-form-field"><label className="drawer-label">一件代发</label><select className="filter-select" style={{ width: '100%' }}><option value="no">否</option><option value="yes">是</option></select></div>
              <div className="drawer-form-field"><label className="drawer-label">快递费结算</label><select className="filter-select" style={{ width: '100%' }}><option value="free">包邮</option><option value="not_free_fixed">不包邮(固定运费)</option><option value="not_free_ratio">不包邮(按比例)</option><option value="not_free_bear">不包邮(到付)</option></select></div>
            </div>
            <div className="drawer-form-row">
              <div className="drawer-form-field"><label className="drawer-label">退货政策</label><input className="filter-input" placeholder="如：质量问题7天内可退换" style={{ width: '100%' }} /></div>
              <div className="drawer-form-field"><label className="drawer-label">质量保证</label><input className="filter-input" placeholder="如：符合GB/T标准" style={{ width: '100%' }} /></div>
            </div>

            {/* 税务与开票 */}
            <div className="drawer-section-title">税务与开票</div>
            <div className="drawer-form-row">
              <div className="drawer-form-field"><label className="drawer-label">税务类型</label><select className="filter-select" style={{ width: '100%' }}><option value="small">小规模</option><option value="general">一般纳税人</option></select></div>
              <div className="drawer-form-field"><label className="drawer-label">开票抬头</label><input className="filter-input" placeholder="请输入" style={{ width: '100%' }} /></div>
              <div className="drawer-form-field"><label className="drawer-label">税号</label><input className="filter-input" placeholder="请输入" style={{ width: '100%' }} /></div>
            </div>
            <div className="drawer-form-row">
              <div className="drawer-form-field"><label className="drawer-label">税率(%)</label><input className="filter-input" placeholder="如：13" style={{ width: '100%' }} type="number" /></div>
            </div>

            {/* 结算银行账号 */}
            <div className="drawer-section-title">结算银行账号</div>
            <div className="drawer-form-row">
              <div className="drawer-form-field"><label className="drawer-label">户名</label><input className="filter-input" placeholder="请输入" style={{ width: '100%' }} /></div>
              <div className="drawer-form-field"><label className="drawer-label">账号</label><input className="filter-input" placeholder="请输入" style={{ width: '100%' }} /></div>
              <div className="drawer-form-field"><label className="drawer-label">开户行</label><input className="filter-input" placeholder="请输入" style={{ width: '100%' }} /></div>
            </div>
            <div className="drawer-form-row">
              <div className="drawer-form-field"><label className="drawer-label">行号</label><input className="filter-input" placeholder="请输入联行号" style={{ width: '100%' }} /></div>
              <div className="drawer-form-field" style={{ flex: 2 }}><label className="drawer-label">结算要求备注</label><input className="filter-input" placeholder="请输入" style={{ width: '100%' }} /></div>
            </div>

            {/* 仓库地址 */}
            <div className="drawer-section-title">仓库地址（最多9个）</div>
            <div style={{ background: 'var(--color-bg-tertiary)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
              <div className="drawer-form-row" style={{ marginBottom: 'var(--space-2)' }}>
                <div className="drawer-form-field"><label className="drawer-label" style={{ fontSize: 'var(--text-xs)' }}>仓库名称</label><input className="filter-input" placeholder="如：杭州仓" style={{ width: '100%' }} /></div>
                <div className="drawer-form-field" style={{ flex: 2 }}><label className="drawer-label" style={{ fontSize: 'var(--text-xs)' }}>仓库地址</label><input className="filter-input" placeholder="请输入详细地址" style={{ width: '100%' }} /></div>
                <div className="drawer-form-field"><label className="drawer-label" style={{ fontSize: 'var(--text-xs)' }}>联系人</label><input className="filter-input" placeholder="姓名" style={{ width: '100%' }} /></div>
                <div className="drawer-form-field"><label className="drawer-label" style={{ fontSize: 'var(--text-xs)' }}>电话</label><input className="filter-input" placeholder="电话" style={{ width: '100%' }} /></div>
                <Button size="sm">添加</Button>
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>供应商仓库将同步至"仓储 &gt; 仓库设置"，作为合作仓库管理</div>
            </div>

            {/* 文件上传 */}
            <div className="drawer-section-title">协议文件</div>
            <div className="drawer-form-row">
              <div style={{ flex: 1, border: '2px dashed var(--color-border-primary)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)', textAlign: 'center' }}>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', marginBottom: 4 }}>合作协议</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>点击或拖拽上传，支持多份</div>
              </div>
              <div style={{ flex: 1, border: '2px dashed var(--color-border-primary)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)', textAlign: 'center' }}>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', marginBottom: 4 }}>品牌授权协议</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>点击或拖拽上传，支持多份</div>
              </div>
            </div>

            {/* 简介 */}
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <label className="drawer-label">供应商简介</label>
              <textarea className="filter-input" placeholder="请输入供应商简介" style={{ width: '100%', minHeight: 80, resize: 'vertical' }} />
            </div>
            </div>
            <div className="drawer-footer">
              <Button variant="ghost" onClick={() => setShowAddDrawer(false)}>取消</Button>
              <Button onClick={() => setShowAddDrawer(false)}>保存</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
