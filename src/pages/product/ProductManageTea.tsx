import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ContentHeader from '../../components/layout/ContentHeader';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Tag from '../../components/common/Tag';
import StatusTag from '../../components/common/StatusTag';
import { teaProducts, getShelfStatusLabel } from '../../data/teaProducts';
import { TeaCategory } from '../../types';

const PAGE_SIZE = 20;

/** 茶类中文名 -> TeaCategory 枚举映射 */
const CATEGORY_MAP: Record<string, TeaCategory> = {
  '绿茶': TeaCategory.GREEN,
  '红茶': TeaCategory.RED,
  '青茶': TeaCategory.OOLONG,
  '白茶': TeaCategory.WHITE,
  '黄茶': TeaCategory.YELLOW,
  '黑茶': TeaCategory.DARK,
  '花草茶': TeaCategory.FLOWER,
};

/** 茶类主色映射 */
const CATEGORY_COLORS: Record<string, string> = {
  '绿茶': '#7BA23F',
  '红茶': '#A7413B',
  '青茶': '#5B6A3E',
  '白茶': '#D6B577',
  '黄茶': '#C9A84C',
  '黑茶': '#4A3B2A',
  '花草茶': '#B03070',
};

/** 从 category 字符串提取茶类枚举，如 "绿茶-西湖龙井" -> TeaCategory.GREEN */
function parseCategory(category: string): TeaCategory | null {
  const prefix = category.split('-')[0];
  return CATEGORY_MAP[prefix] ?? null;
}

/** 茶叶商品管理页面 */
export default function ProductManageTea() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [shelfFilter, setShelfFilter] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'sales'>('default');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // 提取所有品牌
  const allBrands = useMemo(() => {
    const brands = new Set<string>();
    teaProducts.forEach((p) => brands.add(p.brand));
    return Array.from(brands).sort();
  }, []);

  // 筛选 + 排序
  const filtered = useMemo(() => {
    let result = teaProducts.filter((p) => {
      if (categoryFilter) {
        const prefix = p.category.split('-')[0];
        if (prefix !== categoryFilter) return false;
      }
      if (shelfFilter && p.shelfStatus !== shelfFilter) return false;
      if (brandFilter && p.brand !== brandFilter) return false;
      if (keyword) {
        const kw = keyword.toLowerCase();
        if (
          !p.name.toLowerCase().includes(kw) &&
          !p.brand.toLowerCase().includes(kw) &&
          !p.category.toLowerCase().includes(kw) &&
          !p.code.toLowerCase().includes(kw)
        )
          return false;
      }
      // 价格区间筛选
      if (priceMin && p.marketPrice < Number(priceMin)) return false;
      if (priceMax && p.marketPrice > Number(priceMax)) return false;
      return true;
    });
    // 排序
    if (sortBy === 'price-asc') {
      result = [...result].sort((a, b) => a.marketPrice - b.marketPrice);
    } else if (sortBy === 'price-desc') {
      result = [...result].sort((a, b) => b.marketPrice - a.marketPrice);
    } else if (sortBy === 'sales') {
      result = [...result].sort((a, b) => b.totalSales - a.totalSales);
    }
    return result;
  }, [keyword, categoryFilter, shelfFilter, brandFilter, sortBy, priceMin, priceMax]);

  // 分页
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, currentPage]);

  const handleCategoryChange = (value: string) => { setCategoryFilter(value); setCurrentPage(1); };
  const handleShelfChange = (value: string) => { setShelfFilter(value); setCurrentPage(1); };
  const handleBrandChange = (value: string) => { setBrandFilter(value); setCurrentPage(1); };
  const handleSearch = (kw: string) => { setKeyword(kw); setCurrentPage(1); };
  const handleSortChange = (sort: 'default' | 'price-asc' | 'price-desc' | 'sales') => { setSortBy(sort); setCurrentPage(1); };
  const handlePriceMinChange = (v: string) => { setPriceMin(v); setCurrentPage(1); };
  const handlePriceMaxChange = (v: string) => { setPriceMax(v); setCurrentPage(1); };

  const filterBtnStyle = (active: boolean): React.CSSProperties => ({
    padding: '4px 12px',
    borderRadius: 'var(--radius-md)',
    border: `1px solid ${active ? 'var(--color-module-current-base)' : 'var(--color-neutral-200)'}`,
    background: active ? 'var(--color-module-current-lightest)' : 'var(--color-neutral-0)',
    color: active ? 'var(--color-module-current-base)' : 'var(--color-neutral-600)',
    cursor: 'pointer',
    fontSize: 'var(--text-sm)',
    transition: 'var(--transition-fast)',
    whiteSpace: 'nowrap',
  });

  return (
    <>
      <ContentHeader
        title="茶叶商品"
        breadcrumbs={['商品', '商品管理', '茶叶']}
        actions={
          <Button>
            <svg viewBox="0 0 16 16" fill="none" style={{ width: 14, height: 14 }}>
              <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            新增商品
          </Button>
        }
      />
      <div className="content-body">
        {/* 筛选区 */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: 'var(--space-3)' }}>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-neutral-500)', fontWeight: 'var(--font-medium)', flexShrink: 0 }}>茶类：</span>
            <button style={filterBtnStyle(!categoryFilter)} onClick={() => handleCategoryChange('')}>全部</button>
            {Object.keys(CATEGORY_MAP).map((name) => (
              <button key={name} style={filterBtnStyle(categoryFilter === name)} onClick={() => handleCategoryChange(categoryFilter === name ? '' : name)}>
                {name}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: 'var(--space-3)' }}>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-neutral-500)', fontWeight: 'var(--font-medium)', flexShrink: 0 }}>品牌：</span>
            <button style={filterBtnStyle(!brandFilter)} onClick={() => handleBrandChange('')}>全部</button>
            {allBrands.map((b) => (
              <button key={b} style={filterBtnStyle(brandFilter === b)} onClick={() => handleBrandChange(brandFilter === b ? '' : b)}>
                {b}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
            <input
              className="filter-input"
              placeholder="搜索商品名称、品牌、编号..."
              value={keyword}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ maxWidth: 280 }}
            />
            <select
              value={shelfFilter}
              onChange={(e) => handleShelfChange(e.target.value)}
              style={{
                padding: '4px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-neutral-200)',
                background: 'var(--color-neutral-0)',
                color: 'var(--color-neutral-600)',
                fontSize: 'var(--text-sm)',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="">全部状态</option>
              <option value="on">上架</option>
              <option value="off">下架</option>
            </select>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-neutral-500)', flexShrink: 0 }}>价格：</span>
            <input
              className="filter-input"
              placeholder="最低价"
              value={priceMin}
              onChange={(e) => handlePriceMinChange(e.target.value)}
              style={{ width: 80, textAlign: 'center' }}
              type="number"
            />
            <span style={{ color: 'var(--color-neutral-400)' }}>—</span>
            <input
              className="filter-input"
              placeholder="最高价"
              value={priceMax}
              onChange={(e) => handlePriceMaxChange(e.target.value)}
              style={{ width: 80, textAlign: 'center' }}
              type="number"
            />
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-400)', marginLeft: 'auto' }}>
              共 {filtered.length} 件商品
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginTop: 'var(--space-3)' }}>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-neutral-500)', fontWeight: 'var(--font-medium)', flexShrink: 0 }}>排序：</span>
            <button style={filterBtnStyle(sortBy === 'default')} onClick={() => handleSortChange('default')}>默认</button>
            <button style={filterBtnStyle(sortBy === 'price-desc')} onClick={() => handleSortChange('price-desc')}>价格从高到低</button>
            <button style={filterBtnStyle(sortBy === 'price-asc')} onClick={() => handleSortChange('price-asc')}>价格从低到高</button>
            <button style={filterBtnStyle(sortBy === 'sales')} onClick={() => handleSortChange('sales')}>按销量排序</button>
          </div>
        </Card>

        {/* 商品卡片网格 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
          {paged.map((product) => {
            const teaCat = parseCategory(product.category);
            const mainImage = product.mainImages[0] || '';
            return (
              <div
                key={product.id}
                className="product-manage-card"
                onClick={() => navigate(`/product/product-tea-detail/${product.id}`)}
                style={{
                  background: 'var(--color-neutral-0)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-neutral-100)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'box-shadow var(--transition-fast), transform var(--transition-fast)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 6px 20px rgba(0,0,0,0.1)';
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                }}
              >
                {/* 商品主图 */}
                <div style={{ width: '100%', aspectRatio: '1 / 1', overflow: 'hidden', background: 'var(--color-neutral-100)', position: 'relative' }}>
                  <img
                    src={mainImage}
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                  {/* 茶类色条 */}
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 2,
                    background: (() => {
                      const topCat = product.category.split('-')[0];
                      const color = CATEGORY_COLORS[topCat];
                      return color || 'var(--color-neutral-200)';
                    })(),
                  }} />
                  {/* 茶类标签 */}
                  {teaCat && (
                    <div style={{ position: 'absolute', bottom: 6, right: 'var(--space-2)' }}>
                      <Tag category={teaCat} />
                    </div>
                  )}
                </div>

                {/* 商品信息 */}
                <div style={{ padding: 'var(--space-3) var(--space-3) var(--space-2)' }}>
                  {/* 商品名称 */}
                  <div style={{
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-semibold)',
                    color: 'var(--color-neutral-800)',
                    lineHeight: 1.4,
                    marginBottom: 'var(--space-2)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }} title={product.name}>
                    {product.name}
                  </div>

                  {/* 产品特点 */}
                  <div style={{
                    fontSize: 'var(--text-xs)',
                    color: 'var(--color-neutral-500)',
                    lineHeight: 1.5,
                    marginBottom: 'var(--space-2)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }} title={product.features}>
                    {product.features}
                  </div>

                  {/* SKU编号突出展示 */}
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '1px 8px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--color-neutral-100)',
                    fontSize: 'var(--text-xs)',
                    fontFamily: 'var(--font-family-mono, monospace)',
                    color: 'var(--color-neutral-600)',
                    fontWeight: 'var(--font-medium)',
                    marginBottom: 'var(--space-2)',
                  }}>
                    SKU {product.code}
                  </div>
                  {/* 价格 + 标签 */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 'var(--space-2)',
                    gap: 'var(--space-1)',
                  }}>
                    <span style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: '#FD742D', flexShrink: 0 }}>
                      ¥{product.marketPrice}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '1px 6px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--color-module-current-lightest)',
                        color: 'var(--color-module-current-base)',
                        fontSize: 'var(--text-xs)',
                        fontWeight: 'var(--font-semibold)',
                        lineHeight: '18px',
                      }}>
                        {product.brand}
                      </span>
                      <StatusTag
                        variant={product.shelfStatus === 'on' ? 'success' : 'error'}
                        label={getShelfStatusLabel(product.shelfStatus)}
                      />
                    </div>
                  </div>
                </div>

                {/* 底部数据栏 */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  borderTop: '1px solid var(--color-neutral-100)',
                  padding: 'var(--space-2) 0',
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-400)', marginBottom: 2 }}>库存</div>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--color-neutral-700)' }}>{product.stock}</div>
                  </div>
                  <div style={{ width: 1, background: 'var(--color-neutral-100)' }} />
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-400)', marginBottom: 2 }}>预占</div>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--color-neutral-700)' }}>{product.reservedStock}</div>
                  </div>
                  <div style={{ width: 1, background: 'var(--color-neutral-100)' }} />
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-400)', marginBottom: 2 }}>销量</div>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--color-neutral-700)' }}>{product.totalSales}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 空状态 */}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 'var(--space-10)', color: 'var(--color-neutral-400)', fontSize: 'var(--text-sm)' }}>
            暂无匹配的茶叶商品
          </div>
        )}

        {/* 分页 */}
        {totalPages > 1 && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 'var(--space-2)',
            marginTop: 'var(--space-5)',
            paddingBottom: 'var(--space-4)',
          }}>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-neutral-200)',
                background: 'var(--color-neutral-0)',
                color: currentPage === 1 ? 'var(--color-neutral-300)' : 'var(--color-neutral-600)',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                fontSize: 'var(--text-sm)',
              }}
            >
              上一页
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 'var(--radius-md)',
                  border: `1px solid ${currentPage === page ? 'var(--color-module-current-base)' : 'var(--color-neutral-200)'}`,
                  background: currentPage === page ? 'var(--color-module-current-lightest)' : 'var(--color-neutral-0)',
                  color: currentPage === page ? 'var(--color-module-current-base)' : 'var(--color-neutral-600)',
                  cursor: 'pointer',
                  fontSize: 'var(--text-sm)',
                  fontWeight: currentPage === page ? 'var(--font-semibold)' : 'normal',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {page}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-neutral-200)',
                background: 'var(--color-neutral-0)',
                color: currentPage === totalPages ? 'var(--color-neutral-300)' : 'var(--color-neutral-600)',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                fontSize: 'var(--text-sm)',
              }}
            >
              下一页
            </button>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-400)', marginLeft: 'var(--space-2)' }}>
              第 {currentPage}/{totalPages} 页
            </span>
          </div>
        )}
      </div>
    </>
  );
}
