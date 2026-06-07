import { useState, useMemo } from 'react';
import ContentHeader from '../../components/layout/ContentHeader';
import Card from '../../components/common/Card';
import Tag from '../../components/common/Tag';
import { teaVarieties, getAllOrigins } from '../../data/teaVarieties';
import { getTeaCategoryLabel } from '../../data/teaCategories';
import { TeaCategory } from '../../types';

const PAGE_SIZE = 16;

/** 茶种大全页面 */
export default function ProductTeaList() {
  const [selectedCategory, setSelectedCategory] = useState<TeaCategory | null>(null);
  const [selectedOrigin, setSelectedOrigin] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const origins = useMemo(() => getAllOrigins(), []);

  const filtered = useMemo(() => {
    return teaVarieties.filter((t) => {
      if (selectedCategory && t.category !== selectedCategory) return false;
      if (selectedOrigin && t.origin !== selectedOrigin) return false;
      return true;
    });
  }, [selectedCategory, selectedOrigin]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, currentPage]);

  // 筛选变化时重置页码
  const handleCategoryChange = (cat: TeaCategory | null) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };
  const handleOriginChange = (origin: string | null) => {
    setSelectedOrigin(origin);
    setCurrentPage(1);
  };

  const filterBtnStyle = (active: boolean) => ({
    padding: '4px 12px',
    borderRadius: 'var(--radius-md)' as const,
    border: `1px solid ${active ? 'var(--color-module-current-base)' : 'var(--color-neutral-200)'}`,
    background: active ? 'var(--color-module-current-lightest)' : 'var(--color-neutral-0)',
    color: active ? 'var(--color-module-current-base)' : 'var(--color-neutral-600)',
    cursor: 'pointer' as const,
    fontSize: 'var(--text-sm)' as const,
    transition: 'var(--transition-fast)' as const,
    whiteSpace: 'nowrap' as const,
  });

  return (
    <>
      <ContentHeader title="茶种大全" breadcrumbs={['商品', '茶类档案', '茶种大全']} />
      <div className="content-body">
        {/* 筛选区 */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: 'var(--space-3)' }}>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-neutral-500)', fontWeight: 'var(--font-medium)', marginRight: 'var(--space-1)', flexShrink: 0 }}>茶类：</span>
            <button style={filterBtnStyle(!selectedCategory)} onClick={() => handleCategoryChange(null)}>全部</button>
            {Object.values(TeaCategory).map((cat) => (
              <button key={cat} style={filterBtnStyle(selectedCategory === cat)} onClick={() => handleCategoryChange(selectedCategory === cat ? null : cat)}>
                {getTeaCategoryLabel(cat)}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-neutral-500)', fontWeight: 'var(--font-medium)', marginRight: 'var(--space-1)', flexShrink: 0 }}>产地：</span>
            <button style={filterBtnStyle(!selectedOrigin)} onClick={() => handleOriginChange(null)}>全部</button>
            {origins.map((o) => (
              <button key={o} style={filterBtnStyle(selectedOrigin === o)} onClick={() => handleOriginChange(selectedOrigin === o ? null : o)}>
                {o}
              </button>
            ))}
          </div>
          <div style={{ marginTop: 'var(--space-3)', fontSize: 'var(--text-xs)', color: 'var(--color-neutral-400)' }}>
            共 {filtered.length} 个茶种
          </div>
        </Card>

        {/* 茶种卡片列表 - 4列 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
          {paged.map((tea) => (
            <Card key={`${tea.category}-${tea.name}`}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                <span style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', color: 'var(--color-neutral-800)', lineHeight: 1.3 }}>{tea.name}</span>
                <Tag category={tea.category} />
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-600)', lineHeight: 'var(--leading-relaxed)', marginBottom: 'var(--space-3)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {tea.introduction}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-1)', marginBottom: 'var(--space-3)' }}>
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-400)', marginBottom: '1px' }}>产地</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-700)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={`${tea.origin}·${tea.originDetail}`}>{tea.origin}·{tea.originDetail}</div>
                </div>
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-400)', marginBottom: '1px' }}>特点</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-700)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={tea.characteristics}>{tea.characteristics}</div>
                </div>
              </div>
              <div style={{ borderTop: '1px solid var(--color-neutral-100)', paddingTop: 'var(--space-2)' }}>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-400)', marginBottom: 'var(--space-1)' }}>代表品牌</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {tea.brands.map((brand) => (
                    <span key={brand} style={{ padding: '1px 8px', borderRadius: 'var(--radius-full)', background: 'var(--color-neutral-100)', color: 'var(--color-neutral-600)', fontSize: 'var(--text-xs)', whiteSpace: 'nowrap' }}>
                      {brand}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* 空状态 */}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 'var(--space-10)', color: 'var(--color-neutral-400)', fontSize: 'var(--text-sm)' }}>
            暂无匹配的茶种
          </div>
        )}

        {/* 分页 */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 'var(--space-2)', marginTop: 'var(--space-5)', paddingBottom: 'var(--space-4)' }}>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              style={{
                padding: '6px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-neutral-200)',
                background: 'var(--color-neutral-0)', color: currentPage === 1 ? 'var(--color-neutral-300)' : 'var(--color-neutral-600)',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontSize: 'var(--text-sm)',
              }}
            >
              上一页
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                style={{
                  width: 32, height: 32, borderRadius: 'var(--radius-md)',
                  border: `1px solid ${currentPage === page ? 'var(--color-module-current-base)' : 'var(--color-neutral-200)'}`,
                  background: currentPage === page ? 'var(--color-module-current-lightest)' : 'var(--color-neutral-0)',
                  color: currentPage === page ? 'var(--color-module-current-base)' : 'var(--color-neutral-600)',
                  cursor: 'pointer', fontSize: 'var(--text-sm)', fontWeight: currentPage === page ? 'var(--font-semibold)' : 'normal',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                {page}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              style={{
                padding: '6px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-neutral-200)',
                background: 'var(--color-neutral-0)', color: currentPage === totalPages ? 'var(--color-neutral-300)' : 'var(--color-neutral-600)',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', fontSize: 'var(--text-sm)',
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
