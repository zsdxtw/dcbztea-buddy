import ProductCategorySubPage from './ProductCategorySubPage';
import { teawareCategoryData } from '../../data/productCategories';

/** 茶具分类页面 */
export default function ProductCategoryTeaware() {
  return <ProductCategorySubPage categoryType="teaware" rootNode={teawareCategoryData} />;
}
