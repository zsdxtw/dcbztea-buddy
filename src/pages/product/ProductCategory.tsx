import { useState } from 'react';
import ContentHeader from '../../components/layout/ContentHeader';
import ProductCategorySubPage from './ProductCategorySubPage';
import {
  type ProductCategoryType,
  productCategoryLabels,
  teaCategoryData,
  teawareCategoryData,
  teaPeripheralCategoryData,
  otherCategoryData,
} from '../../data/productCategories';

/* ── Tab 配置 ── */
const CATEGORY_TABS: { key: ProductCategoryType; label: string; rootNode: typeof teaCategoryData }[] = [
  { key: 'tea', label: '茶叶', rootNode: teaCategoryData },
  { key: 'teaware', label: '茶具', rootNode: teawareCategoryData },
  { key: 'tea-peripheral', label: '茶周边', rootNode: teaPeripheralCategoryData },
  { key: 'other', label: '其他', rootNode: otherCategoryData },
];

/** 分类管理 - 合并页面（4个Tab切换） */
export default function ProductCategory() {
  const [activeTab, setActiveTab] = useState<ProductCategoryType>('tea');
  const currentTab = CATEGORY_TABS.find(t => t.key === activeTab)!;

  return (
    <>
      <ContentHeader title="分类管理" breadcrumbs={['商品', '分类管理']} />

      {/* Tab 切换栏 */}
      <div style={{
        display: 'flex', gap: 0, borderBottom: '2px solid var(--color-neutral-200)',
        marginBottom: 'var(--space-4)', background: 'var(--color-neutral-0)',
      }}>
        {CATEGORY_TABS.map(t => {
          const isActive = activeTab === t.key;
          return (
            <div key={t.key} onClick={() => setActiveTab(t.key)} style={{
              padding: 'var(--space-3) var(--space-5)', cursor: 'pointer',
              fontSize: 'var(--text-sm)', fontWeight: isActive ? 'var(--font-semibold)' : 'var(--font-medium)',
              color: isActive ? 'var(--color-module-current-base)' : 'var(--color-neutral-500)',
              borderBottom: isActive ? '2px solid var(--color-module-current-base)' : '2px solid transparent',
              marginBottom: -2, transition: 'var(--transition-fast)',
            }}>
              {t.label}
            </div>
          );
        })}
      </div>

      {/* 当前 Tab 内容 - 使用 key 强制切换时重建组件状态 */}
      <ProductCategorySubPage
        key={activeTab}
        categoryType={currentTab.key}
        rootNode={currentTab.rootNode}
      />
    </>
  );
}
