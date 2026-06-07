import ContentHeader from '../../components/layout/ContentHeader';
import Card from '../../components/common/Card';

/** 茶周边商品页面（待开发） */
export default function ProductManagePeripheral() {
  return (
    <>
      <ContentHeader title="茶周边商品" breadcrumbs={['商品', '商品管理', '茶周边']} />
      <div className="content-body">
        <Card>
          <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--color-neutral-400)' }}>
            茶周边商品管理功能开发中...
          </div>
        </Card>
      </div>
    </>
  );
}
