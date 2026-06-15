import ProductCategorySubPage from './ProductCategorySubPage';
import { teaCategoryData } from '../../data/productCategories';

/** 茶叶分类页面 */
export default function ProductCategoryTea() {
  return <ProductCategorySubPage categoryType="tea" rootNode={teaCategoryData} />;
}
