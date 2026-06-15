import ContentHeader from '../../components/layout/ContentHeader';
import Card from '../../components/common/Card';

/** 其他商品页面（待开发） */
export default function ProductManageOther() {
  return (
    <>
      <ContentHeader title="其他商品" breadcrumbs={['商品', '商品管理', '其他']} />
      <div className="content-body">
        <Card>
          <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--color-neutral-400)' }}>
            其他商品管理功能开发中...
          </div>
        </Card>
      </div>
    </>
  );
}
