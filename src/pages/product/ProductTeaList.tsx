import { useState, useMemo } from 'react';
import ContentHeader from '../../components/layout/ContentHeader';
import Card from '../../components/common/Card';
import Tag from '../../components/common/Tag';
import { teaVarieties, getAllOrigins } from '../../data/teaVarieties';
import { getTeaCategoryLabel } from '../../data/teaCategories';
import { TeaCategory } from '../../types';

/** 茶种大全页面 */
export default function ProductTeaList() {
  const [selectedCategory, setSelectedCategory] = useState<TeaCategory | null>(null);
  const [selectedOrigin, setSelectedOrigin] = useState<string | null>(null);

  const origins = useMemo(() => getAllOrigins(), []);

  const filtered = useMemo(() => {
    return teaVarieties.filter((t) => {
      if (selectedCategory && t.category !== selectedCategory) return false;
      if (selectedOrigin && t.origin !== selectedOrigin) return false;
      return true;
    });
  }, [selectedCategory, selectedOrigin]);

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
          {/* 茶类筛选 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: 'var(--space-3)' }}>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-neutral-500)', fontWeight: 'var(--font-medium)', marginRight: 'var(--space-1)', flexShrink: 0 }}>茶类：</span>
            <button style={filterBtnStyle(!selectedCategory)} onClick={() => setSelectedCategory(null)}>全部</button>
            {Object.values(TeaCategory).map((cat) => (
              <button key={cat} style={filterBtnStyle(selectedCategory === cat)} onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}>
                {getTeaCategoryLabel(cat)}
              </button>
            ))}
          </div>
          {/* 产地筛选 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-neutral-500)', fontWeight: 'var(--font-medium)', marginRight: 'var(--space-1)', flexShrink: 0 }}>产地：</span>
            <button style={filterBtnStyle(!selectedOrigin)} onClick={() => setSelectedOrigin(null)}>全部</button>
            {origins.map((o) => (
              <button key={o} style={filterBtnStyle(selectedOrigin === o)} onClick={() => setSelectedOrigin(selectedOrigin === o ? null : o)}>
                {o}
              </button>
            ))}
          </div>
          <div style={{ marginTop: 'var(--space-3)', fontSize: 'var(--text-xs)', color: 'var(--color-neutral-400)' }}>
            共 {filtered.length} 个茶种
          </div>
        </Card>

        {/* 茶种卡片列表 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
          {filtered.map((tea) => (
            <Card key={`${tea.category}-${tea.name}`}>
              {/* 头部：茶种名称 + 茶类标签 */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
                <span style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)', color: 'var(--color-neutral-800)' }}>{tea.name}</span>
                <Tag category={tea.category} />
              </div>

              {/* 茶种介绍 */}
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-neutral-600)', lineHeight: 'var(--leading-relaxed)', marginBottom: 'var(--space-4)' }}>
                {tea.introduction}
              </div>

              {/* 产地 + 特点 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-400)', marginBottom: '2px' }}>产地</div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-neutral-700)' }}>{tea.origin}·{tea.originDetail}</div>
                </div>
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-400)', marginBottom: '2px' }}>特点</div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-neutral-700)' }}>{tea.characteristics}</div>
                </div>
              </div>

              {/* 代表品牌 */}
              <div style={{ borderTop: '1px solid var(--color-neutral-100)', paddingTop: 'var(--space-3)' }}>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-400)', marginBottom: 'var(--space-2)' }}>代表品牌</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                  {tea.brands.map((brand) => (
                    <span
                      key={brand}
                      style={{
                        padding: '2px 10px', borderRadius: 'var(--radius-full)',
                        background: 'var(--color-neutral-100)', color: 'var(--color-neutral-600)',
                        fontSize: 'var(--text-xs)', whiteSpace: 'nowrap',
                      }}
                    >
                      {brand}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 'var(--space-10)', color: 'var(--color-neutral-400)', fontSize: 'var(--text-sm)' }}>
            暂无匹配的茶种
          </div>
        )}
      </div>
    </>
  );
}
