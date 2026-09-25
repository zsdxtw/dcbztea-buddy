import ProductManage from './ProductManage';

/** 茶周边商品管理页面 */
export default function ProductManagePeripheral() {
  return <ProductManage categoryType="tea-peripheral" pageTitle="茶周边商品" breadcrumbs={['商品', '商品管理', '茶周边']} />;
}
