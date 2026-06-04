import ContentHeader from '../../components/layout/ContentHeader';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';

export default function PurchaseSuppliers() {
  const suppliers = [
    { name: '武夷山茶业', region: '福建武夷山', products: 12, amount: '¥ 285,600' },
    { name: '西湖龙井合作社', region: '浙江杭州', products: 8, amount: '¥ 196,000' },
    { name: '安溪铁观音集团', region: '福建安溪', products: 15, amount: '¥ 168,400' },
    { name: '福鼎白茶厂', region: '福建福鼎', products: 6, amount: '¥ 142,800' },
    { name: '云南普洱茶业', region: '云南普洱', products: 10, amount: '¥ 256,200' },
  ];

  return (
    <>
      <ContentHeader title="供应商管理" breadcrumbs={['采购', '供应商管理']} actions={<Button><PlusIcon />新增供应商</Button>} />
      <div className="content-body">
        <Card>
          <Table
            headers={['供应商', '地区', '供应品类', '累计金额']}
            rows={suppliers.map((s) => [s.name, s.region, `${s.products} 种`, <span className="mono">{s.amount}</span>])}
          />
        </Card>
      </div>
    </>
  );
}

function PlusIcon() {
  return <svg viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
}
