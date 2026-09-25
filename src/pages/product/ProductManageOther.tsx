import ProductManage from './ProductManage';

/** 其他商品管理页面 */
export default function ProductManageOther() {
  return <ProductManage categoryType="other" pageTitle="其他商品" breadcrumbs={['商品', '商品管理', '其他']} />;
}
