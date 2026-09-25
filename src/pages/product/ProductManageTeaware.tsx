import ProductManage from './ProductManage';

/** 茶具商品管理页面 */
export default function ProductManageTeaware() {
  return <ProductManage categoryType="teaware" pageTitle="茶具商品" breadcrumbs={['商品', '商品管理', '茶具']} />;
}
