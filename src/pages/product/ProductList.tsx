import ContentHeader from '../../components/layout/ContentHeader';
import ProductCard from '../../components/business/ProductCard';
import Button from '../../components/common/Button';
import FilterBar, { FilterInput, FilterSelect } from '../../components/business/FilterBar';
import { productItems } from '../../data/mock';

export default function ProductList() {
  return (
    <>
      <ContentHeader title="商品列表" breadcrumbs={['商品', '商品列表']} actions={<Button><PlusIcon />新建商品</Button>} />
      <div className="content-body">
        <FilterBar>
          <FilterInput placeholder="搜索商品名称..." />
          <FilterSelect options={['全部茶类', '绿茶', '白茶', '黄茶', '青茶', '红茶', '黑茶']} />
        </FilterBar>
        <div className="product-grid">
          {productItems.map((p) => <ProductCard key={p.id} data={p} />)}
        </div>
      </div>
    </>
  );
}

function PlusIcon() {
  return <svg viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
}
