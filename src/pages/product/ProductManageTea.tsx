import ProductManage from './ProductManage';

/** 茶叶商品管理页面 */
export default function ProductManageTea() {
  return <ProductManage categoryType="tea" pageTitle="茶叶商品" breadcrumbs={['商品', '商品管理', '茶叶']} />;
}
