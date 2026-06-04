import ContentHeader from '../../components/layout/ContentHeader';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

export default function SalesOutbound() {
  return (
    <>
      <ContentHeader title="出库管理" breadcrumbs={['销售', '出库管理']} actions={<Button><PlusIcon />新建出库</Button>} />
      <div className="content-body">
        <Card title="出库记录">
          <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--color-neutral-400)' }}>出库管理页面内容</div>
        </Card>
      </div>
    </>
  );
}

function PlusIcon() {
  return <svg viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
}
