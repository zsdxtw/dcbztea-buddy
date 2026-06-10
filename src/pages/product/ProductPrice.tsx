import { useState, useMemo } from 'react';
import ContentHeader from '../../components/layout/ContentHeader';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Tag from '../../components/common/Tag';
import { TeaCategory } from '../../types';
import { teaProducts } from '../../data/teaProducts';
import { brandItems } from '../../data/brands';

/* ── 工具函数 ── */
function nameToTeaCategory(name: string): TeaCategory | undefined {
  const map: Record<string, TeaCategory> = {
    '绿茶': TeaCategory.GREEN, '红茶': TeaCategory.RED, '青茶': TeaCategory.OOLONG,
    '白茶': TeaCategory.WHITE, '黄茶': TeaCategory.YELLOW, '黑茶': TeaCategory.DARK,
    '花草茶': TeaCategory.FLOWER,
  };
  return map[name];
}

/* ── 供应商列表（模拟） ── */
const suppliers = [
  { id: 's1', name: '西湖龙井合作社' },
  { id: 's2', name: '武夷山茶业' },
  { id: 's3', name: '安溪铁观音集团' },
  { id: 's4', name: '福鼎白茶厂' },
  { id: 's5', name: '云南普洱茶业' },
  { id: 's6', name: '正山堂茶业' },
  { id: 's7', name: '八马茶业供应链' },
  { id: 's8', name: '大益集团' },
];

/* ── 客户列表（模拟，对应客户分类） ── */
const customers = [
  { id: 'c1', name: '华茗堂茶庄', type: '直营' },
  { id: 'c2', name: '清心茶坊', type: '直营' },
  { id: 'c3', name: '浦发银行', type: '间营' },
  { id: 'c4', name: '交通银行', type: '间营' },
  { id: 'c5', name: '天福茗茶（渠道）', type: '渠道' },
  { id: 'c6', name: '八马茶业（渠道）', type: '渠道' },
  { id: 'c7', name: '茶道达人小李', type: '带货' },
  { id: 'c8', name: '茗香阁直播', type: '带货' },
];

/* ── 模拟采购价数据 ── */
interface PurchasePrice {
  productId: string;
  productName: string;
  brand: string;
  category: string;
  marketPrice: number;
  supplierId: string;
  supplierName: string;
  purchasePrice: number;
  discountRate: number; // 采购折扣率
}

/* ── 模拟销售价数据 ── */
interface SalesPrice {
  productId: string;
  productName: string;
  brand: string;
  category: string;
  marketPrice: number;
  customerId: string;
  customerName: string;
  customerType: string;
  salesPrice: number;
  discountRate: number; // 销售折扣率
}

// 生成采购价模拟数据
const purchasePriceData: PurchasePrice[] = [];
teaProducts.forEach(p => {
  // 每个商品有2-3个供应商
  const brandData = brandItems.find(b => b.name === p.brand);
  const supplierCount = 2 + Math.floor(Math.random() * 2);
  const usedSuppliers = suppliers.slice(0, supplierCount);
  usedSuppliers.forEach(s => {
    const discount = 0.45 + Math.random() * 0.2; // 采购折扣 45%-65%
    purchasePriceData.push({
      productId: p.id,
      productName: p.name,
      brand: p.brand,
      category: p.category.split('-')[0],
      marketPrice: p.marketPrice,
      supplierId: s.id,
      supplierName: s.name,
      purchasePrice: Math.round(p.marketPrice * discount),
      discountRate: Math.round(discount * 100),
    });
  });
});

// 生成销售价模拟数据
const salesPriceData: SalesPrice[] = [];
teaProducts.slice(0, 15).forEach(p => {
  // 每个商品面向3-4个客户
  const customerCount = 3 + Math.floor(Math.random() * 2);
  const usedCustomers = customers.slice(0, customerCount);
  usedCustomers.forEach(c => {
    const discount = c.type === '直营' ? 0.75 + Math.random() * 0.1 :
                     c.type === '间营' ? 0.7 + Math.random() * 0.1 :
                     c.type === '渠道' ? 0.6 + Math.random() * 0.1 :
                     0.65 + Math.random() * 0.1;
    salesPriceData.push({
      productId: p.id,
      productName: p.name,
      brand: p.brand,
      category: p.category.split('-')[0],
      marketPrice: p.marketPrice,
      customerId: c.id,
      customerName: c.name,
      customerType: c.type,
      salesPrice: Math.round(p.marketPrice * discount),
      discountRate: Math.round(discount * 100),
    });
  });
});

/* ── Tab 类型 ── */
type PriceTab = 'market' | 'purchase' | 'sales';

export default function ProductPrice() {
  const [activeTab, setActiveTab] = useState<PriceTab>('market');
  const [keyword, setKeyword] = useState('');
  const [filterBrand, setFilterBrand] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  // 采购价筛选
  const [purchaseSupplier, setPurchaseSupplier] = useState('');
  // 销售价筛选
  const [salesCustomer, setSalesCustomer] = useState('');

  // 批量修改状态
  const [batchMode, setBatchMode] = useState(false);
  const [batchTarget, setBatchTarget] = useState(''); // 品牌ID 或 客户ID
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

  // ── 市场价列表 ──
  const marketList = useMemo(() => {
    return teaProducts.filter(p => {
      if (keyword && !p.name.includes(keyword) && !p.brand.includes(keyword) && !p.code.includes(keyword)) return false;
      if (filterBrand && p.brand !== filterBrand) return false;
      if (filterCategory && !p.category.startsWith(filterCategory)) return false;
      return true;
    });
  }, [keyword, filterBrand, filterCategory]);

  // ── 采购价列表 ──
  const purchaseList = useMemo(() => {
    return purchasePriceData.filter(item => {
      if (keyword && !item.productName.includes(keyword) && !item.brand.includes(keyword)) return false;
      if (filterBrand && item.brand !== filterBrand) return false;
      if (filterCategory && item.category !== filterCategory) return false;
      if (purchaseSupplier && item.supplierId !== purchaseSupplier) return false;
      return true;
    });
  }, [keyword, filterBrand, filterCategory, purchaseSupplier]);

  // ── 销售价列表 ──
  const salesList = useMemo(() => {
    return salesPriceData.filter(item => {
      if (keyword && !item.productName.includes(keyword) && !item.brand.includes(keyword)) return false;
      if (filterBrand && item.brand !== filterBrand) return false;
      if (filterCategory && item.category !== filterCategory) return false;
      if (salesCustomer && item.customerId !== salesCustomer) return false;
      return true;
    });
  }, [keyword, filterBrand, filterCategory, salesCustomer]);

  // Tab 样式
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

  // 客户类型标签
  const customerTypeStyle = (type: string): React.CSSProperties => {
    const colors: Record<string, { bg: string; color: string }> = {
      '直营': { bg: 'var(--color-module-current-lightest)', color: 'var(--color-module-current-base)' },
      '间营': { bg: 'rgba(13,175,198,0.1)', color: '#0DAFC6' },
      '渠道': { bg: 'rgba(241,143,77,0.1)', color: '#F18F4D' },
      '带货': { bg: 'rgba(203,64,93,0.1)', color: '#CB405D' },
    };
    const c = colors[type] || colors['直营'];
    return { padding: '2px 8px', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-medium)', background: c.bg, color: c.color };
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
                headers={['商品名称', '品牌', '分类', '规格', '市场价', '天猫价', '京东价', '操作']}
                rows={marketList.map(p => {
                  const teaCat = nameToTeaCategory(p.category.split('-')[0]);
                  return [
                    <span style={{ fontWeight: 'var(--font-medium)' }}>{p.name}</span>,
                    <span>{p.brand}</span>,
                    teaCat ? <Tag category={teaCat} /> : <span>{p.category.split('-')[0]}</span>,
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-500)' }}>{p.spec}</span>,
                    <span className="mono" style={{ fontWeight: 'var(--font-semibold)', color: 'var(--color-module-current-base)' }}>¥{p.marketPrice}</span>,
                    <span className="mono" style={{ color: 'var(--color-neutral-600)' }}>¥{p.tmallPrice || '-'}</span>,
                    <span className="mono" style={{ color: 'var(--color-neutral-600)' }}>¥{p.jdPrice || '-'}</span>,
                    <Button variant="ghost" size="sm" style={{ color: 'var(--color-module-current-base)' }}>调价</Button>,
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
                {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <Button style={{ background: '#0DAFC6', borderColor: '#0DAFC6', color: '#fff' }} onClick={() => { setBatchMode(true); setBatchTarget(''); setBatchAdjustValue(''); }}>
                <svg viewBox="0 0 16 16" fill="none" style={{ width: 14, height: 14 }}>
                  <path d="M2 8h12M8 2v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                批量调价
              </Button>
              <span style={{ marginLeft: 'auto', fontSize: 'var(--text-xs)', color: 'var(--color-neutral-400)' }}>共 {purchaseList.length} 条记录</span>
            </div>
            <Card>
              <Table
                headers={['商品名称', '品牌', '分类', '市场价', '供应商', '采购价', '采购折扣', '利润空间', '操作']}
                rows={purchaseList.map(item => {
                  const teaCat = nameToTeaCategory(item.category);
                  const profit = item.marketPrice - item.purchasePrice;
                  const profitRate = Math.round((profit / item.marketPrice) * 100);
                  return [
                    <span style={{ fontWeight: 'var(--font-medium)' }}>{item.productName}</span>,
                    <span>{item.brand}</span>,
                    teaCat ? <Tag category={teaCat} /> : <span>{item.category}</span>,
                    <span className="mono">¥{item.marketPrice}</span>,
                    <span style={{ fontSize: 'var(--text-sm)' }}>{item.supplierName}</span>,
                    <span className="mono" style={{ fontWeight: 'var(--font-semibold)', color: '#0DAFC6' }}>¥{item.purchasePrice}</span>,
                    <span className="mono" style={{ color: 'var(--color-neutral-500)' }}>{item.discountRate}%</span>,
                    <span style={{ fontSize: 'var(--text-sm)' }}>
                      <span className="mono" style={{ color: profitRate > 40 ? 'var(--color-success-500)' : profitRate > 25 ? 'var(--color-warning-500)' : 'var(--color-error-500)' }}>{profitRate}%</span>
                      <span style={{ color: 'var(--color-neutral-400)', marginLeft: 4 }}>(¥{profit})</span>
                    </span>,
                    <Button variant="ghost" size="sm" style={{ color: '#0DAFC6' }}>调价</Button>,
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
              <input className="filter-input" placeholder="搜索商品名称、品牌..." value={keyword} onChange={(e) => setKeyword(e.target.value)} />
              <select className="filter-select" value={filterBrand} onChange={(e) => setFilterBrand(e.target.value)}>
                <option value="">全部品牌</option>
                {allBrands.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
              <select className="filter-select" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                <option value="">全部茶类</option>
                {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select className="filter-select" value={salesCustomer} onChange={(e) => setSalesCustomer(e.target.value)}>
                <option value="">全部客户</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.name}（{c.type}）</option>)}
              </select>
              <Button style={{ background: '#F18F4D', borderColor: '#F18F4D', color: '#fff' }} onClick={() => { setBatchMode(true); setBatchTarget(''); setBatchAdjustValue(''); }}>
                <svg viewBox="0 0 16 16" fill="none" style={{ width: 14, height: 14 }}>
                  <path d="M2 8h12M8 2v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                批量调价
              </Button>
              <span style={{ marginLeft: 'auto', fontSize: 'var(--text-xs)', color: 'var(--color-neutral-400)' }}>共 {salesList.length} 条记录</span>
            </div>
            <Card>
              <Table
                headers={['商品名称', '品牌', '分类', '市场价', '客户', '客户类型', '销售价', '销售折扣', '操作']}
                rows={salesList.map(item => {
                  const teaCat = nameToTeaCategory(item.category);
                  return [
                    <span style={{ fontWeight: 'var(--font-medium)' }}>{item.productName}</span>,
                    <span>{item.brand}</span>,
                    teaCat ? <Tag category={teaCat} /> : <span>{item.category}</span>,
                    <span className="mono">¥{item.marketPrice}</span>,
                    <span style={{ fontSize: 'var(--text-sm)' }}>{item.customerName}</span>,
                    <span style={customerTypeStyle(item.customerType)}>{item.customerType}</span>,
                    <span className="mono" style={{ fontWeight: 'var(--font-semibold)', color: '#F18F4D' }}>¥{item.salesPrice}</span>,
                    <span className="mono" style={{ color: 'var(--color-neutral-500)' }}>{item.discountRate}%</span>,
                    <Button variant="ghost" size="sm" style={{ color: '#F18F4D' }}>调价</Button>,
                  ];
                })}
              />
            </Card>
          </>
        )}
      </div>

      {/* ── 批量调价弹窗 ── */}
      {batchMode && (
        <div className="category-dialog-overlay" onClick={() => setBatchMode(false)}>
          <div className="category-dialog" onClick={(e) => e.stopPropagation()} style={{ width: 520 }}>
            <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)', color: 'var(--color-neutral-800)', marginBottom: 'var(--space-4)' }}>
              批量调整{activeTab === 'purchase' ? '采购价' : '销售价'}
            </div>

            {/* 选择调价对象 */}
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--color-neutral-700)', marginBottom: 'var(--space-2)' }}>
                调价范围 — 按{activeTab === 'purchase' ? '品牌' : '客户'}
              </label>
              {activeTab === 'purchase' ? (
                <select className="filter-select" style={{ width: '100%' }} value={batchTarget} onChange={(e) => setBatchTarget(e.target.value)}>
                  <option value="">请选择品牌</option>
                  {allBrands.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              ) : (
                <select className="filter-select" style={{ width: '100%' }} value={batchTarget} onChange={(e) => setBatchTarget(e.target.value)}>
                  <option value="">请选择客户</option>
                  {customers.map(c => <option key={c.id} value={c.id}>{c.name}（{c.type}）</option>)}
                </select>
              )}
            </div>

            {/* 调价方式 */}
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--color-neutral-700)', marginBottom: 'var(--space-2)' }}>调价方式</label>
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

            {/* 影响预览 */}
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
                  {activeTab === 'purchase'
                    ? `品牌「${batchTarget}」下所有商品的采购价将${Number(batchAdjustValue) >= 0 ? '上调' : '下调'}${batchAdjustType === 'percent' ? `${Math.abs(Number(batchAdjustValue))}%` : `¥${Math.abs(Number(batchAdjustValue))}`}`
                    : `客户「${customers.find(c => c.id === batchTarget)?.name}」下所有商品的销售价将${Number(batchAdjustValue) >= 0 ? '上调' : '下调'}${batchAdjustType === 'percent' ? `${Math.abs(Number(batchAdjustValue))}%` : `¥${Math.abs(Number(batchAdjustValue))}`}`
                  }
                </div>
                <div style={{ marginTop: 'var(--space-1)', color: 'var(--color-neutral-400)' }}>
                  影响 {activeTab === 'purchase'
                    ? purchasePriceData.filter(i => i.brand === batchTarget).length
                    : salesPriceData.filter(i => i.customerId === batchTarget).length
                  } 条价格记录
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
              <Button variant="ghost" onClick={() => setBatchMode(false)}>取消</Button>
              <Button onClick={() => { setShowBatchConfirm(true); }} disabled={!batchTarget || !batchAdjustValue}>
                确认调价
              </Button>
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
              确认对{activeTab === 'purchase' ? `品牌「${batchTarget}」` : `客户「${customers.find(c => c.id === batchTarget)?.name}」`}的所有商品{activeTab === 'purchase' ? '采购价' : '销售价'}进行批量调整？此操作不可撤销。
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
              <Button variant="ghost" onClick={() => setShowBatchConfirm(false)}>取消</Button>
              <Button onClick={() => { setShowBatchConfirm(false); setBatchMode(false); }} style={{ background: 'var(--color-module-current-base)', borderColor: 'var(--color-module-current-base)' }}>确认调价</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
