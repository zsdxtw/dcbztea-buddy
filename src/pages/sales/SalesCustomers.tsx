import ContentHeader from '../../components/layout/ContentHeader';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';

export default function SalesCustomers() {
  const customers = [
    { name: '华茗堂茶庄', region: '北京', orders: 32, amount: '¥ 386,000' },
    { name: '雅韵茶社', region: '上海', orders: 28, amount: '¥ 245,800' },
    { name: '清心茶坊', region: '杭州', orders: 45, amount: '¥ 512,400' },
    { name: '品茗轩', region: '广州', orders: 19, amount: '¥ 168,600' },
    { name: '翠竹茶行', region: '成都', orders: 24, amount: '¥ 198,200' },
  ];

  return (
    <>
      <ContentHeader title="客户管理" breadcrumbs={['销售', '客户管理']} actions={<Button><PlusIcon />新增客户</Button>} />
      <div className="content-body">
        <Card>
          <Table
            headers={['客户', '地区', '订单数', '累计金额']}
            rows={customers.map((c) => [c.name, c.region, `${c.orders} 单`, <span className="mono">{c.amount}</span>])}
          />
        </Card>
      </div>
    </>
  );
}

function PlusIcon() {
  return <svg viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
}
