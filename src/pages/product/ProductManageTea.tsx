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
  const [currentPage, setCurrentPage] = useState(1);

  // 提取所有品牌
  const allBrands = useMemo(() => {
    const brands = new Set<string>();
    teaProducts.forEach((p) => brands.add(p.brand));
    return Array.from(brands).sort();
  }, []);

  // 筛选
  const filtered = useMemo(() => {
    return teaProducts.filter((p) => {
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
      return true;
    });
  }, [keyword, categoryFilter, shelfFilter, brandFilter]);

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
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <input
              className="filter-input"
              placeholder="搜索商品名称、品牌、编号..."
              value={keyword}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ maxWidth: 320 }}
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
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-400)', marginLeft: 'auto' }}>
              共 {filtered.length} 件商品
            </span>
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
                  transition: 'box-shadow var(--transition-fast)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                }}
              >
                {/* 商品主图 */}
                <div style={{ width: '100%', aspectRatio: '1 / 1', overflow: 'hidden', background: 'var(--color-neutral-100)' }}>
                  <img
                    src={mainImage}
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>

                {/* 商品信息 */}
                <div style={{ padding: 'var(--space-3)' }}>
                  {/* 名称 + 茶类标签 */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--space-2)', gap: 'var(--space-2)' }}>
                    <span style={{
                      fontSize: 'var(--text-base)',
                      fontWeight: 'var(--font-semibold)',
                      color: 'var(--color-neutral-800)',
                      lineHeight: 1.3,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      flex: 1,
                      minWidth: 0,
                    }} title={product.name}>
                      {product.name}
                    </span>
                    {teaCat && <Tag category={teaCat} />}
                  </div>

                  {/* 品牌 + 规格 */}
                  <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--color-neutral-500)' }}>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={product.brand}>{product.brand}</span>
                    <span style={{ color: 'var(--color-neutral-300)' }}>|</span>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={product.spec}>{product.spec}</span>
                  </div>

                  {/* 价格 + 状态 */}
                  <div style={{
                    borderTop: '1px solid var(--color-neutral-100)',
                    paddingTop: 'var(--space-2)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                  }}>
                    <div>
                      <span style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)', color: '#FD742D' }}>
                        ¥{product.marketPrice}
                      </span>
                    </div>
                    <StatusTag
                      variant={product.shelfStatus === 'on' ? 'success' : 'error'}
                      label={getShelfStatusLabel(product.shelfStatus)}
                    />
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
