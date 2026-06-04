import ContentHeader from '../../components/layout/ContentHeader';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

export default function FinanceReconciliation() {
  return (
    <>
      <ContentHeader title="对账管理" breadcrumbs={['财务', '对账管理']} actions={<Button><PlusIcon />新建对账</Button>} />
      <div className="content-body">
        <Card title="对账记录">
          <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--color-neutral-400)' }}>对账管理页面内容</div>
        </Card>
      </div>
    </>
  );
}

function PlusIcon() {
  return <svg viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
}
