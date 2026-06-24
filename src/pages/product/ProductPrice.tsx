import { useState, useMemo } from 'react';
import ContentHeader from '../../components/layout/ContentHeader';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Tag from '../../components/common/Tag';
import { TeaCategory } from '../../types';
import type { TeaProduct, PurchasePriceRule, VipPriceRule } from '../../types';
import { teaProducts } from '../../data/teaProducts';
import { purchasePriceRules, vipPriceRules, PRICE_SUPPLIERS, PRICE_CUSTOMERS } from '../../data/prices';

/* ── 工具函数 ── */
function nameToTeaCategory(name: string): TeaCategory | undefined {
  const map: Record<string, TeaCategory> = {
    '绿茶': TeaCategory.GREEN, '红茶': TeaCategory.RED, '青茶': TeaCategory.OOLONG,
    '白茶': TeaCategory.WHITE, '黄茶': TeaCategory.YELLOW, '黑茶': TeaCategory.DARK,
    '花草茶': TeaCategory.FLOWER,
  };
  return map[name];
}

/* ── 价格色 ── */
const COLOR_PURCHASE = '#0DAFC6';
const COLOR_SALES = '#F18F4D';
const COLOR_VIP = '#9D73BD';

/* ── Tab 类型 ── */
type PriceTab = 'market' | 'purchase' | 'sales' | 'vip';

/* ── 调价弹窗表单 ── */
interface EditForm {
  marketPrice: string;
  tmallPrice: string;
  jdPrice: string;
  salesPrice: string;
  purchasePrice: string;
  vipPrice: string;
}
interface EditState {
  tab: PriceTab;
  key: string; // market/sales: productId；purchase/vip: ruleId
  productName: string;
  subInfo: string; // 供应商 / 客户名称
  marketPrice: number;
  salesPrice: number; // 标准销售价（vip 用）
  validFrom?: string;
  validTo?: string;
}

export default function ProductPrice() {
  const [activeTab, setActiveTab] = useState<PriceTab>('market');
  const [keyword, setKeyword] = useState('');
  const [filterBrand, setFilterBrand] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  // 采购价筛选
  const [purchaseSupplier, setPurchaseSupplier] = useState('');
  // VIP价筛选
  const [vipCustomer, setVipCustomer] = useState('');

  // 可编辑的本地价格数据（基准数据来自数据源，调价后覆盖）
  const [marketOverrides, setMarketOverrides] = useState<Record<string, { marketPrice: number; tmallPrice: number; jdPrice: number; salesPrice: number }>>({});
  const [purchaseRules, setPurchaseRules] = useState<PurchasePriceRule[]>(purchasePriceRules);
  const [salesOverrides, setSalesOverrides] = useState<Record<string, number>>({});
  const [vipRules, setVipRules] = useState<VipPriceRule[]>(vipPriceRules);

  // 单条调价弹窗
  const [editState, setEditState] = useState<EditState | null>(null);
  const [editForm, setEditForm] = useState<EditForm | null>(null);

  // 新增 VIP 价弹窗
  const [showAddVip, setShowAddVip] = useState(false);
  const [addVipProduct, setAddVipProduct] = useState('');
  const [addVipCustomer, setAddVipCustomer] = useState('');
  const [addVipPrice, setAddVipPrice] = useState('');

  // 批量调价
  const [batchMode, setBatchMode] = useState(false);
  const [batchTab, setBatchTab] = useState<'purchase' | 'vip'>('purchase');
  const [batchTarget, setBatchTarget] = useState('');
  const [batchAdjustType, setBatchAdjustType] = useState<'percent' | 'fixed'>('percent');
  const [batchAdjustValue, setBatchAdjustValue] = useState('');
  const [showBatchConfirm, setShowBatchConfirm] = useState(false);

  // 品牌列表
  const allBrands = useMemo(() => {
    const brands = new Set<string>();
    teaProducts.forEach(p => brands.add(p.brand));
    return Array.from(brands).sort();
  }, []);

  // 茶类列表
  const allCategories = useMemo(() => {
    const cats = new Set<string>();
    teaProducts.forEach(p => cats.add(p.category.split('-')[0]));
    return Array.from(cats).sort();
  }, []);

  // 取商品的市场价/销售价（含覆盖值）
  const getMarketData = (p: TeaProduct) => {
    const ov = marketOverrides[p.id];
    return ov ?? { marketPrice: p.marketPrice, tmallPrice: p.tmallPrice, jdPrice: p.jdPrice, salesPrice: p.salesPrice };
  };
  const getSalesPrice = (p: TeaProduct) => salesOverrides[p.id] ?? p.salesPrice;

  /* ── 列表筛选 ── */
  const marketList = useMemo(() => {
    return teaProducts.filter(p => {
      if (keyword && !p.name.includes(keyword) && !p.brand.includes(keyword) && !p.code.includes(keyword)) return false;
      if (filterBrand && p.brand !== filterBrand) return false;
      if (filterCategory && !p.category.startsWith(filterCategory)) return false;
      return true;
    });
  }, [keyword, filterBrand, filterCategory]);

  const purchaseList = useMemo(() => {
    return purchaseRules.filter(item => {
      if (keyword && !item.productName.includes(keyword) && !item.brand.includes(keyword)) return false;
      if (filterBrand && item.brand !== filterBrand) return false;
      if (filterCategory && item.category !== filterCategory) return false;
      if (purchaseSupplier && item.supplierId !== purchaseSupplier) return false;
      return true;
    });
  }, [keyword, filterBrand, filterCategory, purchaseSupplier, purchaseRules]);

  const salesList = useMemo(() => {
    return teaProducts.filter(p => {
      if (keyword && !p.name.includes(keyword) && !p.brand.includes(keyword) && !p.code.includes(keyword)) return false;
      if (filterBrand && p.brand !== filterBrand) return false;
      if (filterCategory && !p.category.startsWith(filterCategory)) return false;
      return true;
    });
  }, [keyword, filterBrand, filterCategory]);

  const vipList = useMemo(() => {
    return vipRules.filter(item => {
      if (keyword && !item.productName.includes(keyword) && !item.brand.includes(keyword)) return false;
      if (filterBrand && item.brand !== filterBrand) return false;
      if (filterCategory && item.category !== filterCategory) return false;
      if (vipCustomer && item.customerId !== vipCustomer) return false;
      return true;
    });
  }, [keyword, filterBrand, filterCategory, vipCustomer, vipRules]);

  /* ── 打开单条调价弹窗 ── */
  const openEdit = (tab: PriceTab, key: string) => {
    let st: EditState;
    let form: EditForm = { marketPrice: '', tmallPrice: '', jdPrice: '', salesPrice: '', purchasePrice: '', vipPrice: '' };
    if (tab === 'market') {
      const p = teaProducts.find(x => x.id === key)!;
      const d = getMarketData(p);
      st = { tab, key, productName: p.name, subInfo: p.brand, marketPrice: d.marketPrice, salesPrice: d.salesPrice };
      form = { ...form, marketPrice: String(d.marketPrice), tmallPrice: String(d.tmallPrice), jdPrice: String(d.jdPrice), salesPrice: String(d.salesPrice) };
    } else if (tab === 'purchase') {
      const r = purchaseRules.find(x => x.id === key)!;
      st = { tab, key, productName: r.productName, subInfo: r.supplierName, marketPrice: r.marketPrice, salesPrice: 0, validFrom: r.validFrom, validTo: r.validTo };
      form = { ...form, marketPrice: String(r.marketPrice), purchasePrice: String(r.purchasePrice) };
    } else if (tab === 'sales') {
      const p = teaProducts.find(x => x.id === key)!;
      const sp = getSalesPrice(p);
      st = { tab, key, productName: p.name, subInfo: p.brand, marketPrice: p.marketPrice, salesPrice: sp };
      form = { ...form, marketPrice: String(p.marketPrice), salesPrice: String(sp) };
    } else {
      const r = vipRules.find(x => x.id === key)!;
      st = { tab, key, productName: r.productName, subInfo: r.customerName, marketPrice: r.marketPrice, salesPrice: r.salesPrice, validFrom: r.validFrom, validTo: r.validTo };
      form = { ...form, marketPrice: String(r.marketPrice), salesPrice: String(r.salesPrice), vipPrice: String(r.vipPrice) };
    }
    setEditState(st);
    setEditForm(form);
  };

  const saveEdit = () => {
    if (!editState || !editForm) return;
    const { tab, key } = editState;
    if (tab === 'market') {
      setMarketOverrides(prev => ({ ...prev, [key]: {
        marketPrice: Number(editForm.marketPrice) || 0,
        tmallPrice: Number(editForm.tmallPrice) || 0,
        jdPrice: Number(editForm.jdPrice) || 0,
        salesPrice: Number(editForm.salesPrice) || 0,
      }}));
    } else if (tab === 'purchase') {
      const pp = Number(editForm.purchasePrice) || 0;
      setPurchaseRules(prev => prev.map(r => r.id === key ? {
        ...r, purchasePrice: pp,
        discountRate: r.marketPrice > 0 ? Math.round(pp / r.marketPrice * 100) : 0,
        lastAdjustDate: new Date().toISOString().slice(0, 10),
      } : r));
    } else if (tab === 'sales') {
      setSalesOverrides(prev => ({ ...prev, [key]: Number(editForm.salesPrice) || 0 }));
    } else if (tab === 'vip') {
      const vp = Number(editForm.vipPrice) || 0;
      setVipRules(prev => prev.map(r => r.id === key ? {
        ...r, vipPrice: vp,
        discountRate: r.marketPrice > 0 ? Math.round(vp / r.marketPrice * 100) : 0,
      } : r));
    }
    setEditState(null);
    setEditForm(null);
  };

  /* ── 新增 VIP 价 ── */
  const saveAddVip = () => {
    const p = teaProducts.find(x => x.id === addVipProduct);
    const c = PRICE_CUSTOMERS.find(x => x.id === addVipCustomer);
    if (!p || !c) return;
    const vp = Number(addVipPrice) || 0;
    const newRule: VipPriceRule = {
      id: `vip_new_${Date.now()}`,
      productId: p.id,
      productName: p.name,
      brand: p.brand,
      category: p.category.split('-')[0],
      customerId: c.id,
      customerName: c.name,
      customerType: c.type,
      marketPrice: p.marketPrice,
      salesPrice: p.salesPrice,
      vipPrice: vp,
      discountRate: p.marketPrice > 0 ? Math.round(vp / p.marketPrice * 100) : 0,
      validFrom: '2026-01-01',
      validTo: '2026-12-31',
      status: 'active',
      remark: `${c.type}客户专属价`,
    };
    setVipRules(prev => [newRule, ...prev]);
    setShowAddVip(false);
    setAddVipProduct('');
    setAddVipCustomer('');
    setAddVipPrice('');
  };

  /* ── 批量调价 ── */
  const openBatch = (tab: 'purchase' | 'vip') => {
    setBatchTab(tab);
    setBatchMode(true);
    setBatchTarget('');
    setBatchAdjustValue('');
    setBatchAdjustType('percent');
  };

  const batchCount = useMemo(() => {
    if (!batchTarget) return 0;
    return batchTab === 'purchase'
      ? purchaseRules.filter(r => r.brand === batchTarget).length
      : vipRules.filter(r => r.customerId === batchTarget).length;
  }, [batchTab, batchTarget, purchaseRules, vipRules]);

  const confirmBatch = () => {
    const val = Number(batchAdjustValue) || 0;
    const apply = (origin: number) => Math.max(0, batchAdjustType === 'percent'
      ? Math.round(origin * (1 + val / 100))
      : origin + val);
    if (batchTab === 'purchase') {
      setPurchaseRules(prev => prev.map(r => r.brand !== batchTarget ? r : {
        ...r, purchasePrice: apply(r.purchasePrice),
        discountRate: r.marketPrice > 0 ? Math.round(apply(r.purchasePrice) / r.marketPrice * 100) : 0,
      }));
    } else {
      setVipRules(prev => prev.map(r => r.customerId !== batchTarget ? r : {
        ...r, vipPrice: apply(r.vipPrice),
        discountRate: r.marketPrice > 0 ? Math.round(apply(r.vipPrice) / r.marketPrice * 100) : 0,
      }));
    }
    setShowBatchConfirm(false);
    setBatchMode(false);
  };

  /* ── 样式 ── */
  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: '8px 20px',
    borderRadius: 'var(--radius-md)',
    fontSize: 'var(--text-sm)',
    fontWeight: active ? 'var(--font-semibold)' : 'var(--font-medium)',
    background: active ? 'var(--color-module-current-base)' : 'var(--color-neutral-0)',
    color: active ? '#fff' : 'var(--color-neutral-600)',
    border: `1px solid ${active ? 'var(--color-module-current-base)' : 'var(--color-neutral-200)'}`,
    cursor: 'pointer',
    transition: 'var(--transition-fast)',
    whiteSpace: 'nowrap',
  });

  const customerTypeStyle = (type: string): React.CSSProperties => {
    const colors: Record<string, { bg: string; color: string }> = {
      '直营': { bg: 'var(--color-module-current-lightest)', color: 'var(--color-module-current-base)' },
      '间营': { bg: 'rgba(13,175,198,0.1)', color: COLOR_PURCHASE },
      '渠道': { bg: 'rgba(241,143,77,0.1)', color: COLOR_SALES },
      '带货': { bg: 'rgba(157,115,189,0.1)', color: COLOR_VIP },
    };
    const c = colors[type] || colors['直营'];
    return { padding: '2px 8px', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-medium)', background: c.bg, color: c.color };
  };

  const fieldLabel: React.CSSProperties = {
    display: 'block', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)',
    color: 'var(--color-neutral-700)', marginBottom: 'var(--space-2)',
  };

  return (
    <>
      <ContentHeader title="价格管理" breadcrumbs={['商品', '价格管理']} />
      <div className="content-body">
        {/* Tab 切换 */}
        <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
          <button style={tabStyle(activeTab === 'market')} onClick={() => setActiveTab('market')}>市场价管理</button>
          <button style={tabStyle(activeTab === 'purchase')} onClick={() => setActiveTab('purchase')}>采购价管理</button>
          <button style={tabStyle(activeTab === 'sales')} onClick={() => setActiveTab('sales')}>销售价管理</button>
          <button style={tabStyle(activeTab === 'vip')} onClick={() => setActiveTab('vip')}>VIP销售价</button>
        </div>

        {/* ── 市场价管理 ── */}
        {activeTab === 'market' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
              <input className="filter-input" placeholder="搜索商品名称、品牌、编号..." value={keyword} onChange={(e) => setKeyword(e.target.value)} />
              <select className="filter-select" value={filterBrand} onChange={(e) => setFilterBrand(e.target.value)}>
                <option value="">全部品牌</option>
                {allBrands.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
              <select className="filter-select" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                <option value="">全部茶类</option>
                {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <span style={{ marginLeft: 'auto', fontSize: 'var(--text-xs)', color: 'var(--color-neutral-400)' }}>共 {marketList.length} 件商品</span>
            </div>
            <Card>
              <Table
                headers={['商品名称', '品牌', '分类', '规格', '市场价', '天猫价', '京东价', '销售价', '操作']}
                rows={marketList.map(p => {
                  const teaCat = nameToTeaCategory(p.category.split('-')[0]);
                  const d = getMarketData(p);
                  return [
                    <span style={{ fontWeight: 'var(--font-medium)' }}>{p.name}</span>,
                    <span>{p.brand}</span>,
                    teaCat ? <Tag category={teaCat} /> : <span>{p.category.split('-')[0]}</span>,
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-500)' }}>{p.spec}</span>,
                    <span className="mono" style={{ fontWeight: 'var(--font-semibold)', color: 'var(--color-module-current-base)' }}>¥{d.marketPrice}</span>,
                    <span className="mono" style={{ color: 'var(--color-neutral-600)' }}>¥{d.tmallPrice || '-'}</span>,
                    <span className="mono" style={{ color: 'var(--color-neutral-600)' }}>¥{d.jdPrice || '-'}</span>,
                    <span className="mono" style={{ fontWeight: 'var(--font-semibold)', color: COLOR_SALES }}>¥{d.salesPrice || '-'}</span>,
                    <Button variant="ghost" size="sm" style={{ color: 'var(--color-module-current-base)' }} onClick={() => openEdit('market', p.id)}>调价</Button>,
                  ];
                })}
              />
            </Card>
          </>
        )}

        {/* ── 采购价管理 ── */}
        {activeTab === 'purchase' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
              <input className="filter-input" placeholder="搜索商品名称、品牌..." value={keyword} onChange={(e) => setKeyword(e.target.value)} />
              <select className="filter-select" value={filterBrand} onChange={(e) => setFilterBrand(e.target.value)}>
                <option value="">全部品牌</option>
                {allBrands.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
              <select className="filter-select" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                <option value="">全部茶类</option>
                {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select className="filter-select" value={purchaseSupplier} onChange={(e) => setPurchaseSupplier(e.target.value)}>
                <option value="">全部供应商</option>
                {PRICE_SUPPLIERS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <Button style={{ background: COLOR_PURCHASE, borderColor: COLOR_PURCHASE, color: '#fff' }} onClick={() => openBatch('purchase')}>
                <svg viewBox="0 0 16 16" fill="none" style={{ width: 14, height: 14 }}>
                  <path d="M2 8h12M8 2v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                批量调价
              </Button>
              <span style={{ marginLeft: 'auto', fontSize: 'var(--text-xs)', color: 'var(--color-neutral-400)' }}>共 {purchaseList.length} 条记录</span>
            </div>
            <Card>
              <Table
                headers={['商品名称', '品牌', '分类', '市场价', '供应商', '采购价', '采购折扣', '利润空间', '有效期', '操作']}
                rows={purchaseList.map(item => {
                  const teaCat = nameToTeaCategory(item.category);
                  const profit = item.marketPrice - item.purchasePrice;
                  const profitRate = item.marketPrice > 0 ? Math.round((profit / item.marketPrice) * 100) : 0;
                  return [
                    <span style={{ fontWeight: 'var(--font-medium)' }}>{item.productName}</span>,
                    <span>{item.brand}</span>,
                    teaCat ? <Tag category={teaCat} /> : <span>{item.category}</span>,
                    <span className="mono">¥{item.marketPrice}</span>,
                    <span style={{ fontSize: 'var(--text-sm)' }}>{item.supplierName}</span>,
                    <span className="mono" style={{ fontWeight: 'var(--font-semibold)', color: COLOR_PURCHASE }}>¥{item.purchasePrice}</span>,
                    <span className="mono" style={{ color: 'var(--color-neutral-500)' }}>{item.discountRate}%</span>,
                    <span style={{ fontSize: 'var(--text-sm)' }}>
                      <span className="mono" style={{ color: profitRate > 40 ? 'var(--color-success-500)' : profitRate > 25 ? 'var(--color-warning-500)' : 'var(--color-error-500)' }}>{profitRate}%</span>
                      <span style={{ color: 'var(--color-neutral-400)', marginLeft: 4 }}>(¥{profit})</span>
                    </span>,
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-500)' }}>{item.validFrom} ~ {item.validTo}</span>,
                    <Button variant="ghost" size="sm" style={{ color: COLOR_PURCHASE }} onClick={() => openEdit('purchase', item.id)}>调价</Button>,
                  ];
                })}
              />
            </Card>
          </>
        )}

        {/* ── 销售价管理 ── */}
        {activeTab === 'sales' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
              <input className="filter-input" placeholder="搜索商品名称、品牌、编号..." value={keyword} onChange={(e) => setKeyword(e.target.value)} />
              <select className="filter-select" value={filterBrand} onChange={(e) => setFilterBrand(e.target.value)}>
                <option value="">全部品牌</option>
                {allBrands.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
              <select className="filter-select" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                <option value="">全部茶类</option>
                {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <span style={{ marginLeft: 'auto', fontSize: 'var(--text-xs)', color: 'var(--color-neutral-400)' }}>共 {salesList.length} 件商品</span>
            </div>
            <Card>
              <Table
                headers={['商品名称', '品牌', '分类', '市场价', '销售价', '销售折扣', '操作']}
                rows={salesList.map(p => {
                  const teaCat = nameToTeaCategory(p.category.split('-')[0]);
                  const sp = getSalesPrice(p);
                  const discount = p.marketPrice > 0 ? Math.round((sp / p.marketPrice) * 100) : 0;
                  return [
                    <span style={{ fontWeight: 'var(--font-medium)' }}>{p.name}</span>,
                    <span>{p.brand}</span>,
                    teaCat ? <Tag category={teaCat} /> : <span>{p.category.split('-')[0]}</span>,
                    <span className="mono">¥{p.marketPrice}</span>,
                    <span className="mono" style={{ fontWeight: 'var(--font-semibold)', color: COLOR_SALES }}>¥{sp}</span>,
                    <span className="mono" style={{ color: 'var(--color-neutral-500)' }}>{discount}%</span>,
                    <Button variant="ghost" size="sm" style={{ color: COLOR_SALES }} onClick={() => openEdit('sales', p.id)}>调价</Button>,
                  ];
                })}
              />
            </Card>
          </>
        )}

        {/* ── VIP销售价管理 ── */}
        {activeTab === 'vip' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
              <input className="filter-input" placeholder="搜索商品名称、品牌..." value={keyword} onChange={(e) => setKeyword(e.target.value)} />
              <select className="filter-select" value={filterBrand} onChange={(e) => setFilterBrand(e.target.value)}>
                <option value="">全部品牌</option>
                {allBrands.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
              <select className="filter-select" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                <option value="">全部茶类</option>
                {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select className="filter-select" value={vipCustomer} onChange={(e) => setVipCustomer(e.target.value)}>
                <option value="">全部客户</option>
                {PRICE_CUSTOMERS.map(c => <option key={c.id} value={c.id}>{c.name}（{c.type}）</option>)}
              </select>
              <Button style={{ background: COLOR_VIP, borderColor: COLOR_VIP, color: '#fff' }} onClick={() => { setShowAddVip(true); setAddVipProduct(''); setAddVipCustomer(''); setAddVipPrice(''); }}>
                <svg viewBox="0 0 16 16" fill="none" style={{ width: 14, height: 14 }}>
                  <path d="M2 8h12M8 2v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                新增VIP价
              </Button>
              <Button variant="secondary" onClick={() => openBatch('vip')}>
                <svg viewBox="0 0 16 16" fill="none" style={{ width: 14, height: 14 }}>
                  <path d="M2 8h12M8 2v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                批量调价
              </Button>
              <span style={{ marginLeft: 'auto', fontSize: 'var(--text-xs)', color: 'var(--color-neutral-400)' }}>共 {vipList.length} 条记录</span>
            </div>
            <Card>
              <Table
                headers={['商品名称', '品牌', '分类', '市场价', '标准销售价', '客户', '客户类型', 'VIP价', 'VIP折扣', '有效期', '操作']}
                rows={vipList.map(item => {
                  const teaCat = nameToTeaCategory(item.category);
                  return [
                    <span style={{ fontWeight: 'var(--font-medium)' }}>{item.productName}</span>,
                    <span>{item.brand}</span>,
                    teaCat ? <Tag category={teaCat} /> : <span>{item.category}</span>,
                    <span className="mono">¥{item.marketPrice}</span>,
                    <span className="mono" style={{ color: 'var(--color-neutral-600)' }}>¥{item.salesPrice}</span>,
                    <span style={{ fontSize: 'var(--text-sm)' }}>{item.customerName}</span>,
                    <span style={customerTypeStyle(item.customerType)}>{item.customerType}</span>,
                    <span className="mono" style={{ fontWeight: 'var(--font-semibold)', color: COLOR_VIP }}>¥{item.vipPrice}</span>,
                    <span className="mono" style={{ color: 'var(--color-neutral-500)' }}>{item.discountRate}%</span>,
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-500)' }}>{item.validFrom} ~ {item.validTo}</span>,
                    <Button variant="ghost" size="sm" style={{ color: COLOR_VIP }} onClick={() => openEdit('vip', item.id)}>调价</Button>,
                  ];
                })}
              />
            </Card>
          </>
        )}
      </div>

      {/* ── 单条调价弹窗 ── */}
      {editState && editForm && (
        <div className="category-dialog-overlay" onClick={() => { setEditState(null); setEditForm(null); }}>
          <div className="category-dialog" onClick={(e) => e.stopPropagation()} style={{ width: 480 }}>
            <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)', color: 'var(--color-neutral-800)', marginBottom: 'var(--space-2)' }}>
              {editState.tab === 'market' ? '市场价调价' : editState.tab === 'purchase' ? '采购价调价' : editState.tab === 'sales' ? '销售价调价' : 'VIP价调价'}
            </div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-neutral-500)', marginBottom: 'var(--space-4)' }}>
              商品：{editState.productName}{editState.subInfo ? `（${editState.subInfo}）` : ''}
            </div>

            {/* 市场价 Tab：可改 4 个价 */}
            {editState.tab === 'market' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                <div>
                  <label style={fieldLabel}>市场价</label>
                  <input className="detail-input" type="number" value={editForm.marketPrice} onChange={(e) => setEditForm({ ...editForm, marketPrice: e.target.value })} style={{ width: '100%' }} />
                </div>
                <div>
                  <label style={fieldLabel}>天猫价</label>
                  <input className="detail-input" type="number" value={editForm.tmallPrice} onChange={(e) => setEditForm({ ...editForm, tmallPrice: e.target.value })} style={{ width: '100%' }} />
                </div>
                <div>
                  <label style={fieldLabel}>京东价</label>
                  <input className="detail-input" type="number" value={editForm.jdPrice} onChange={(e) => setEditForm({ ...editForm, jdPrice: e.target.value })} style={{ width: '100%' }} />
                </div>
                <div>
                  <label style={fieldLabel}>销售价</label>
                  <input className="detail-input" type="number" value={editForm.salesPrice} onChange={(e) => setEditForm({ ...editForm, salesPrice: e.target.value })} style={{ width: '100%' }} />
                </div>
              </div>
            )}

            {/* 采购价 Tab */}
            {editState.tab === 'purchase' && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                  <div>
                    <label style={fieldLabel}>市场价（参考）</label>
                    <div className="mono" style={{ padding: '8px 12px', background: 'var(--color-neutral-50)', borderRadius: 'var(--radius-md)', color: 'var(--color-neutral-600)' }}>¥{editState.marketPrice}</div>
                  </div>
                  <div>
                    <label style={fieldLabel}>采购价</label>
                    <input className="detail-input" type="number" value={editForm.purchasePrice} onChange={(e) => setEditForm({ ...editForm, purchasePrice: e.target.value })} style={{ width: '100%' }} />
                  </div>
                </div>
                <div style={{ padding: 'var(--space-3)', background: 'var(--color-neutral-50)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--color-neutral-600)' }}>
                  采购折扣率：{editState.marketPrice > 0 ? Math.round((Number(editForm.purchasePrice) || 0) / editState.marketPrice * 100) : 0}%
                  <span style={{ marginLeft: 12, color: 'var(--color-neutral-400)' }}>有效期：{editState.validFrom} ~ {editState.validTo}</span>
                </div>
              </>
            )}

            {/* 销售价 Tab */}
            {editState.tab === 'sales' && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                  <div>
                    <label style={fieldLabel}>市场价（参考）</label>
                    <div className="mono" style={{ padding: '8px 12px', background: 'var(--color-neutral-50)', borderRadius: 'var(--radius-md)', color: 'var(--color-neutral-600)' }}>¥{editState.marketPrice}</div>
                  </div>
                  <div>
                    <label style={fieldLabel}>销售价</label>
                    <input className="detail-input" type="number" value={editForm.salesPrice} onChange={(e) => setEditForm({ ...editForm, salesPrice: e.target.value })} style={{ width: '100%' }} />
                  </div>
                </div>
                <div style={{ padding: 'var(--space-3)', background: 'var(--color-neutral-50)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--color-neutral-600)' }}>
                  销售折扣率：{editState.marketPrice > 0 ? Math.round((Number(editForm.salesPrice) || 0) / editState.marketPrice * 100) : 0}%
                </div>
              </>
            )}

            {/* VIP价 Tab */}
            {editState.tab === 'vip' && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                  <div>
                    <label style={fieldLabel}>市场价（参考）</label>
                    <div className="mono" style={{ padding: '8px 12px', background: 'var(--color-neutral-50)', borderRadius: 'var(--radius-md)', color: 'var(--color-neutral-600)' }}>¥{editState.marketPrice}</div>
                  </div>
                  <div>
                    <label style={fieldLabel}>标准销售价（参考）</label>
                    <div className="mono" style={{ padding: '8px 12px', background: 'var(--color-neutral-50)', borderRadius: 'var(--radius-md)', color: 'var(--color-neutral-600)' }}>¥{editState.salesPrice}</div>
                  </div>
                </div>
                <div style={{ marginBottom: 'var(--space-4)' }}>
                  <label style={fieldLabel}>VIP价</label>
                  <input className="detail-input" type="number" value={editForm.vipPrice} onChange={(e) => setEditForm({ ...editForm, vipPrice: e.target.value })} style={{ width: '100%' }} />
                </div>
                <div style={{ padding: 'var(--space-3)', background: 'var(--color-neutral-50)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--color-neutral-600)' }}>
                  VIP折扣率：{editState.marketPrice > 0 ? Math.round((Number(editForm.vipPrice) || 0) / editState.marketPrice * 100) : 0}%
                  <span style={{ marginLeft: 12, color: 'var(--color-neutral-400)' }}>有效期：{editState.validFrom} ~ {editState.validTo}</span>
                </div>
              </>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
              <Button variant="ghost" onClick={() => { setEditState(null); setEditForm(null); }}>取消</Button>
              <Button onClick={saveEdit}>确认调价</Button>
            </div>
          </div>
        </div>
      )}

      {/* ── 新增 VIP 价弹窗 ── */}
      {showAddVip && (
        <div className="category-dialog-overlay" onClick={() => setShowAddVip(false)}>
          <div className="category-dialog" onClick={(e) => e.stopPropagation()} style={{ width: 480 }}>
            <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)', color: 'var(--color-neutral-800)', marginBottom: 'var(--space-4)' }}>新增VIP价</div>

            <div style={{ marginBottom: 'var(--space-4)' }}>
              <label style={fieldLabel}>商品</label>
              <select className="filter-select" style={{ width: '100%' }} value={addVipProduct} onChange={(e) => setAddVipProduct(e.target.value)}>
                <option value="">请选择商品</option>
                {teaProducts.map(p => <option key={p.id} value={p.id}>{p.name}（{p.brand}）</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <label style={fieldLabel}>客户</label>
              <select className="filter-select" style={{ width: '100%' }} value={addVipCustomer} onChange={(e) => setAddVipCustomer(e.target.value)}>
                <option value="">请选择客户</option>
                {PRICE_CUSTOMERS.map(c => <option key={c.id} value={c.id}>{c.name}（{c.type}）</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <label style={fieldLabel}>VIP价</label>
              <input className="detail-input" type="number" value={addVipPrice} onChange={(e) => setAddVipPrice(e.target.value)} placeholder="输入VIP价" style={{ width: '100%' }} />
            </div>
            {addVipProduct && addVipPrice && (() => {
              const p = teaProducts.find(x => x.id === addVipProduct);
              const vp = Number(addVipPrice) || 0;
              const rate = p && p.marketPrice > 0 ? Math.round(vp / p.marketPrice * 100) : 0;
              return (
                <div style={{ padding: 'var(--space-3)', background: 'var(--color-neutral-50)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--color-neutral-600)' }}>
                  VIP折扣率：{rate}%　|　市场价：¥{p?.marketPrice ?? '-'}　|　标准销售价：¥{p?.salesPrice ?? '-'}
                </div>
              );
            })()}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
              <Button variant="ghost" onClick={() => setShowAddVip(false)}>取消</Button>
              <Button onClick={saveAddVip} disabled={!addVipProduct || !addVipCustomer || !addVipPrice}>确认新增</Button>
            </div>
          </div>
        </div>
      )}

      {/* ── 批量调价弹窗 ── */}
      {batchMode && (
        <div className="category-dialog-overlay" onClick={() => setBatchMode(false)}>
          <div className="category-dialog" onClick={(e) => e.stopPropagation()} style={{ width: 520 }}>
            <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)', color: 'var(--color-neutral-800)', marginBottom: 'var(--space-4)' }}>
              批量调整{batchTab === 'purchase' ? '采购价' : 'VIP价'}
            </div>

            <div style={{ marginBottom: 'var(--space-4)' }}>
              <label style={fieldLabel}>调价范围 — 按{batchTab === 'purchase' ? '品牌' : '客户'}</label>
              {batchTab === 'purchase' ? (
                <select className="filter-select" style={{ width: '100%' }} value={batchTarget} onChange={(e) => setBatchTarget(e.target.value)}>
                  <option value="">请选择品牌</option>
                  {allBrands.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              ) : (
                <select className="filter-select" style={{ width: '100%' }} value={batchTarget} onChange={(e) => setBatchTarget(e.target.value)}>
                  <option value="">请选择客户</option>
                  {PRICE_CUSTOMERS.map(c => <option key={c.id} value={c.id}>{c.name}（{c.type}）</option>)}
                </select>
              )}
            </div>

            <div style={{ marginBottom: 'var(--space-4)' }}>
              <label style={fieldLabel}>调价方式</label>
              <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                <button style={{
                  padding: '6px 16px', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', cursor: 'pointer',
                  border: `1px solid ${batchAdjustType === 'percent' ? 'var(--color-module-current-base)' : 'var(--color-neutral-200)'}`,
                  background: batchAdjustType === 'percent' ? 'var(--color-module-current-lightest)' : 'var(--color-neutral-0)',
                  color: batchAdjustType === 'percent' ? 'var(--color-module-current-base)' : 'var(--color-neutral-600)',
                }} onClick={() => setBatchAdjustType('percent')}>按比例</button>
                <button style={{
                  padding: '6px 16px', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', cursor: 'pointer',
                  border: `1px solid ${batchAdjustType === 'fixed' ? 'var(--color-module-current-base)' : 'var(--color-neutral-200)'}`,
                  background: batchAdjustType === 'fixed' ? 'var(--color-module-current-lightest)' : 'var(--color-neutral-0)',
                  color: batchAdjustType === 'fixed' ? 'var(--color-module-current-base)' : 'var(--color-neutral-600)',
                }} onClick={() => setBatchAdjustType('fixed')}>按固定金额</button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <input
                  className="detail-input"
                  type="number"
                  value={batchAdjustValue}
                  onChange={(e) => setBatchAdjustValue(e.target.value)}
                  placeholder={batchAdjustType === 'percent' ? '输入比例，如 5 表示上调5%' : '输入金额，如 10 表示上调10元'}
                  style={{ flex: 1 }}
                />
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-neutral-500)', flexShrink: 0 }}>
                  {batchAdjustType === 'percent' ? '%（负数为下调）' : '元（负数为下调）'}
                </span>
              </div>
            </div>

            {batchTarget && batchAdjustValue && (
              <div style={{
                padding: 'var(--space-3)',
                background: 'var(--color-neutral-50)',
                borderRadius: 'var(--radius-md)',
                marginBottom: 'var(--space-4)',
                fontSize: 'var(--text-sm)',
                color: 'var(--color-neutral-600)',
              }}>
                <div style={{ fontWeight: 'var(--font-medium)', marginBottom: 'var(--space-1)' }}>调整预览</div>
                <div>
                  {batchTab === 'purchase'
                    ? `品牌「${batchTarget}」下所有商品的采购价将${Number(batchAdjustValue) >= 0 ? '上调' : '下调'}${batchAdjustType === 'percent' ? `${Math.abs(Number(batchAdjustValue))}%` : `¥${Math.abs(Number(batchAdjustValue))}`}`
                    : `客户「${PRICE_CUSTOMERS.find(c => c.id === batchTarget)?.name}」下所有商品的VIP价将${Number(batchAdjustValue) >= 0 ? '上调' : '下调'}${batchAdjustType === 'percent' ? `${Math.abs(Number(batchAdjustValue))}%` : `¥${Math.abs(Number(batchAdjustValue))}`}`
                  }
                </div>
                <div style={{ marginTop: 'var(--space-1)', color: 'var(--color-neutral-400)' }}>影响 {batchCount} 条价格记录</div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
              <Button variant="ghost" onClick={() => setBatchMode(false)}>取消</Button>
              <Button onClick={() => setShowBatchConfirm(true)} disabled={!batchTarget || !batchAdjustValue}>确认调价</Button>
            </div>
          </div>
        </div>
      )}

      {/* ── 调价确认弹窗 ── */}
      {showBatchConfirm && (
        <div className="category-dialog-overlay" onClick={() => setShowBatchConfirm(false)}>
          <div className="category-dialog" onClick={(e) => e.stopPropagation()} style={{ width: 400 }}>
            <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)', color: 'var(--color-neutral-800)', marginBottom: 'var(--space-3)' }}>确认调价</div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-neutral-600)', marginBottom: 'var(--space-5)' }}>
              确认对{batchTab === 'purchase' ? `品牌「${batchTarget}」` : `客户「${PRICE_CUSTOMERS.find(c => c.id === batchTarget)?.name}」`}的所有商品{batchTab === 'purchase' ? '采购价' : 'VIP价'}进行批量调整？此操作不可撤销。
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
              <Button variant="ghost" onClick={() => setShowBatchConfirm(false)}>取消</Button>
              <Button onClick={confirmBatch} style={{ background: 'var(--color-module-current-base)', borderColor: 'var(--color-module-current-base)' }}>确认调价</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
