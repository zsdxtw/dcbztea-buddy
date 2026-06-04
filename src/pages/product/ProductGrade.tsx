import ContentHeader from '../../components/layout/ContentHeader';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Tag from '../../components/common/Tag';
import StatusTag from '../../components/common/StatusTag';
import FilterBar, { FilterInput, FilterSelect } from '../../components/business/FilterBar';
import { gradeItems } from '../../data/mock';
import type { StatusVariant } from '../../types';

/** 品级管理页面 */
export default function ProductGrade() {
  return (
    <>
      <ContentHeader title="品级管理" breadcrumbs={['商品', '品级管理']} />
      <div className="content-body">
        <FilterBar>
          <FilterInput placeholder="搜索品级名称..." />
          <FilterSelect options={['全部茶类', '绿茶', '白茶', '黄茶', '青茶', '红茶', '黑茶']} />
          <FilterSelect options={['全部状态', '启用', '停用']} />
        </FilterBar>

        <Card>
          <Table
            headers={['品级名称', '适用茶类', '定价系数', '感官标准', '关联商品数', '状态', '操作']}
            rows={gradeItems.map((item) => [
              <span style={{ fontWeight: 'var(--font-semibold)', color: 'var(--color-neutral-800)' }}>{item.name}</span>,
              <div style={{ display: 'flex', gap: 'var(--space-1)', flexWrap: 'wrap' }}>
                {item.applicableCategories.map((cat) => (
                  <Tag key={cat} category={cat} />
                ))}
              </div>,
              <span className="mono">{item.pricingFactor.toFixed(1)}x</span>,
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-500)', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block' }}>{item.sensoryStandard}</span>,
              <span className="mono">{item.productCount}</span>,
              <StatusTag variant={item.active ? 'success' as StatusVariant : 'error' as StatusVariant} label={item.active ? '启用' : '停用'} />,
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-module-product-base)', cursor: 'pointer' }}>编辑</span>,
            ])}
          />
        </Card>
      </div>
    </>
  );
}
