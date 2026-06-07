import { useState } from 'react';
import ContentHeader from '../../components/layout/ContentHeader';
import Card from '../../components/common/Card';
import Tag from '../../components/common/Tag';
import { teaCategories, getTeaCategoryLabel } from '../../data/teaCategories';
import { TeaCategory } from '../../types';

/** 茶种大全页面 */
export default function ProductTeaList() {
  const [selectedCategory, setSelectedCategory] = useState<TeaCategory | null>(null);

  const filteredCategories = selectedCategory
    ? teaCategories.filter((t) => t.category === selectedCategory)
    : teaCategories;

  return (
    <>
      <ContentHeader title="茶种大全" breadcrumbs={['商品', '茶类档案', '茶种大全']} />
      <div className="content-body">
        {/* 茶类筛选 */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-neutral-500)', fontWeight: 'var(--font-medium)', marginRight: 'var(--space-1)' }}>茶类筛选：</span>
            <button
              className="tea-filter-btn"
              style={{
                padding: '4px 12px', borderRadius: 'var(--radius-md)', border: '1px solid',
                borderColor: !selectedCategory ? 'var(--color-module-current-base)' : 'var(--color-neutral-200)',
                background: !selectedCategory ? 'var(--color-module-current-lightest)' : 'var(--color-neutral-0)',
                color: !selectedCategory ? 'var(--color-module-current-base)' : 'var(--color-neutral-600)',
                cursor: 'pointer', fontSize: 'var(--text-sm)', transition: 'var(--transition-fast)',
              }}
              onClick={() => setSelectedCategory(null)}
            >
              全部
            </button>
            {teaCategories.map((t) => (
              <button
                key={t.category}
                className="tea-filter-btn"
                style={{
                  padding: '4px 12px', borderRadius: 'var(--radius-md)', border: '1px solid',
                  borderColor: selectedCategory === t.category ? 'var(--color-module-current-base)' : 'var(--color-neutral-200)',
                  background: selectedCategory === t.category ? 'var(--color-module-current-lightest)' : 'var(--color-neutral-0)',
                  color: selectedCategory === t.category ? 'var(--color-module-current-base)' : 'var(--color-neutral-600)',
                  cursor: 'pointer', fontSize: 'var(--text-sm)', transition: 'var(--transition-fast)',
                }}
                onClick={() => setSelectedCategory(t.category)}
              >
                {getTeaCategoryLabel(t.category)}
              </button>
            ))}
          </div>
        </Card>

        {/* 茶种卡片列表 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
          {filteredCategories.map((tea) => (
            <Card key={tea.category}>
              <div style={{ marginBottom: 'var(--space-3)' }}>
                <Tag category={tea.category} />
              </div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-neutral-600)', lineHeight: 'var(--leading-relaxed)', marginBottom: 'var(--space-4)' }}>
                {tea.introduction}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-400)', marginBottom: '2px' }}>工艺特点</div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-neutral-700)' }}>{tea.process}</div>
                </div>
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-400)', marginBottom: '2px' }}>风味描述</div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-neutral-700)' }}>{tea.flavor}</div>
                </div>
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-400)', marginBottom: '2px' }}>存储条件</div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-neutral-700)' }}>{tea.storage}</div>
                </div>
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-400)', marginBottom: '2px' }}>商品数量</div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-neutral-700)' }}>{tea.productCount}</div>
                </div>
              </div>
              <div style={{ borderTop: '1px solid var(--color-neutral-100)', paddingTop: 'var(--space-3)' }}>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-400)', marginBottom: 'var(--space-2)' }}>代表茶种</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                  {tea.representativeTeas.map((name) => (
                    <span
                      key={name}
                      style={{
                        padding: '2px 10px', borderRadius: 'var(--radius-full)',
                        background: 'var(--color-neutral-100)', color: 'var(--color-neutral-600)',
                        fontSize: 'var(--text-xs)', whiteSpace: 'nowrap',
                      }}
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
