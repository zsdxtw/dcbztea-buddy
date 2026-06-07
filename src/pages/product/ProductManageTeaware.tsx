import ContentHeader from '../../components/layout/ContentHeader';
import Card from '../../components/common/Card';

/** 茶具商品页面（待开发） */
export default function ProductManageTeaware() {
  return (
    <>
      <ContentHeader title="茶具商品" breadcrumbs={['商品', '商品管理', '茶具']} />
      <div className="content-body">
        <Card>
          <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--color-neutral-400)' }}>
            茶具商品管理功能开发中...
          </div>
        </Card>
      </div>
    </>
  );
}
