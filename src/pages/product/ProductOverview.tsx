import ContentHeader from '../../components/layout/ContentHeader';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import ProductCard from '../../components/business/ProductCard';
import Button from '../../components/common/Button';
import { productItems } from '../../data/mock';

export default function ProductOverview() {
  return (
    <>
      <ContentHeader title="商品概览" breadcrumbs={['商品', '商品概览']} actions={<Button><PlusIcon />新建商品</Button>} />
      <div className="content-body">
        <div className="stat-cards">
          <StatCard data={{ label: '商品总数', value: '128', icon: <svg viewBox="0 0 18 18" fill="none"><path d="M9 2L3 5v8l6 3 6-3V5L9 2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg> }} />
          <StatCard data={{ label: '绿茶品类', value: '24', icon: <svg viewBox="0 0 18 18" fill="none"><rect x="3" y="3" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/></svg> }} />
          <StatCard data={{ label: '本周上新', value: '3', icon: <svg viewBox="0 0 18 18" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> }} />
          <StatCard data={{ label: '缺货商品', value: '2', icon: <svg viewBox="0 0 18 18" fill="none"><path d="M10 2a5 5 0 015 5v3l2 2H3l2-2V7a5 5 0 015-5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg> }} />
        </div>
        <Card title="热门商品">
          <div className="product-grid">
            {productItems.slice(0, 4).map((p) => <ProductCard key={p.id} data={p} />)}
          </div>
        </Card>
      </div>
    </>
  );
}

function PlusIcon() {
  return <svg viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
}
