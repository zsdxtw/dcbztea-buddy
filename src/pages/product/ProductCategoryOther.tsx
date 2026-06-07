import ProductCategorySubPage from './ProductCategorySubPage';
import { otherCategoryData } from '../../data/productCategories';

/** 其他分类页面 */
export default function ProductCategoryOther() {
  return <ProductCategorySubPage categoryType="other" rootNode={otherCategoryData} />;
}
