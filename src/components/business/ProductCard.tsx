import Tag from '../common/Tag';
import type { ProductItem } from '../../types';

interface ProductCardProps {
  data: ProductItem;
}

/** 商品卡片组件 */
export default function ProductCard({ data }: ProductCardProps) {
  return (
    <div className="product-card">
      <div className="product-card-img">
        <svg viewBox="0 0 48 48" fill="none">
          <path d="M24 8c-6 0-12 4-12 10 0 8 12 22 12 22s12-14 12-22c0-6-6-10-12-10z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        </svg>
      </div>
      <div className="product-card-info">
        <div className="product-card-name">{data.name} — {data.spec}</div>
        <div className="product-card-meta">
          <div className="product-card-price">
            ¥{data.price} <span>{data.unit}</span>
          </div>
          <Tag category={data.teaCategory} />
        </div>
      </div>
    </div>
  );
}
