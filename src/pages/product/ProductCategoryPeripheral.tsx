import ProductCategorySubPage from './ProductCategorySubPage';
import { teaPeripheralCategoryData } from '../../data/productCategories';

/** 茶周边分类页面 */
export default function ProductCategoryPeripheral() {
  return <ProductCategorySubPage categoryType="tea-peripheral" rootNode={teaPeripheralCategoryData} />;
}
