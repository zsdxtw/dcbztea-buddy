import ContentHeader from '../../components/layout/ContentHeader';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Tag from '../../components/common/Tag';
import StatusTag, { orderStatusToVariant, orderStatusLabel } from '../../components/common/StatusTag';
import Button from '../../components/common/Button';
import FilterBar, { FilterInput, FilterSelect } from '../../components/business/FilterBar';
import { purchaseOrders } from '../../data/mock';

export default function PurchaseOrders() {
  return (
    <>
      <ContentHeader
        title="采购订单"
        breadcrumbs={['采购', '采购订单']}
        actions={<><Button variant="ghost">导出</Button><Button><PlusIcon />新建采购单</Button></>}
      />
      <div className="content-body">
        <FilterBar>
          <FilterInput placeholder="搜索订单编号、供应商..." />
          <FilterSelect options={['全部状态', '待审核', '运输中', '已完成']} />
          <FilterSelect options={['全部茶类', '绿茶', '白茶', '黄茶', '青茶', '红茶', '黑茶']} />
        </FilterBar>
        <Card>
          <Table
            headers={['订单编号', '供应商', '商品', '茶类', '数量', '金额', '状态']}
            rows={purchaseOrders.map((o) => [
              <span className="mono">{o.code}</span>,
              o.partner,
              `${o.product} — 特级`,
              <Tag category={o.teaCategory} />,
              <span className="mono">{o.quantity}</span>,
              <span className="mono">{o.amount}</span>,
              <StatusTag variant={orderStatusToVariant(o.status)} label={orderStatusLabel(o.status)} />,
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
