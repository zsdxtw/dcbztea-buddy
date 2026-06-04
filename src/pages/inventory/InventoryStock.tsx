import ContentHeader from '../../components/layout/ContentHeader';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Tag from '../../components/common/Tag';
import StatusTag, { stockStatusToVariant, stockStatusLabel } from '../../components/common/StatusTag';
import Button from '../../components/common/Button';
import { stockItems } from '../../data/mock';

export default function InventoryStock() {
  return (
    <>
      <ContentHeader title="库存管理" breadcrumbs={['仓储', '库存管理']} actions={<Button><PlusIcon />新建盘点</Button>} />
      <div className="content-body">
        <div className="stat-cards" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          <div className="stat-card">
            <div className="stat-card-header"><span className="stat-card-label">库存总量</span></div>
            <div className="stat-card-value">42,680 <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-regular)', color: 'var(--color-neutral-500)' }}>kg</span></div>
          </div>
          <div className="stat-card">
            <div className="stat-card-header"><span className="stat-card-label">SKU 数量</span></div>
            <div className="stat-card-value">328</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-header"><span className="stat-card-label">库存预警</span></div>
            <div className="stat-card-value" style={{ color: 'var(--color-semantic-warning)' }}>4</div>
          </div>
        </div>
        <Card title="库存明细">
          <Table
            headers={['商品名称', '茶类', '仓库', '库存量', '状态']}
            rows={stockItems.map((s) => [
              s.productName,
              <Tag category={s.teaCategory} />,
              s.warehouse,
              <span className="mono" style={s.status === 'insufficient' ? { color: 'var(--color-semantic-error)' } : s.status === 'low' ? { color: 'var(--color-semantic-warning)' } : undefined}>{s.quantity}</span>,
              <StatusTag variant={stockStatusToVariant(s.status)} label={stockStatusLabel(s.status)} />,
            ])}
          />
        </Card>
      </div>
    </>
  );
}

function PlusIcon() {
  return <svg viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
}
