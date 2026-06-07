import ContentHeader from '../../components/layout/ContentHeader';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Tag from '../../components/common/Tag';
import { teaCategories } from '../../data/teaCategories';

/** 茶类管理页面 */
export default function ProductTeaCategory() {
  return (
    <>
      <ContentHeader title="茶类管理" breadcrumbs={['商品', '茶类管理']} />
      <div className="content-body">
        <Card title="七大茶类">
          <Table
            headers={['茶类名称', '茶类介绍', '工艺特点', '存储条件', '风味描述', '代表茶种']}
            rows={teaCategories.map((item) => [
              <Tag category={item.category} />,
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-neutral-600)', maxWidth: 280, display: 'inline-block' }}>{item.introduction}</span>,
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-neutral-600)' }}>{item.process}</span>,
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-neutral-600)' }}>{item.storage}</span>,
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-neutral-600)' }}>{item.flavor}</span>,
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-500)' }}>{item.representativeTeas.join('、')}</span>,
            ])}
          />
        </Card>
      </div>
    </>
  );
}
