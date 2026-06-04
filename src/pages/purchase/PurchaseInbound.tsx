import ContentHeader from '../../components/layout/ContentHeader';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

export default function PurchaseInbound() {
  return (
    <>
      <ContentHeader title="入库管理" breadcrumbs={['采购', '入库管理']} actions={<Button><PlusIcon />新建入库</Button>} />
      <div className="content-body">
        <Card title="入库记录">
          <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--color-neutral-400)' }}>入库管理页面内容</div>
        </Card>
      </div>
    </>
  );
}

function PlusIcon() {
  return <svg viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
}
