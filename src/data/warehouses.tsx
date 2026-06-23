/** 仓库设置共享数据源
 * - 独立仓库：自有的纯仓库，本模块维护，可在仓库设置中增删改查
 * - 门店仓库：自有的在茶叶门店的仓库，本模块维护，可在仓库设置中增删改查
 * - 合作仓库：由供应商管理中的仓库数据派生（联动），在仓库设置中只读展示
 */
import type { Warehouse } from '../types';
import { supplierItems } from './suppliers';

/** 独立仓库初始数据（自有的纯仓库） */
export const independentWarehouses: Warehouse[] = [
  { id: 'wh-ind-01', name: '杭州总仓', code: 'WH-HZ-01', address: '杭州市西湖区龙井路88号', manager: '李仓管', phone: '0571-8766****', category: 'independent', enabled: true, isDefault: true },
  { id: 'wh-ind-02', name: '武夷仓区', code: 'WH-WY-01', address: '武夷山市星村镇茶博路12号', manager: '张仓管', phone: '0599-512****', category: 'independent', enabled: true, isDefault: false },
  { id: 'wh-ind-03', name: '苏州分仓', code: 'WH-SZ-01', address: '苏州市吴中区洞庭山路56号', manager: '王仓管', phone: '0512-662****', category: 'independent', enabled: true, isDefault: false },
  { id: 'wh-ind-04', name: '福鼎分仓', code: 'WH-FD-01', address: '福鼎市点头镇茶青市场旁', manager: '陈仓管', phone: '0593-787****', category: 'independent', enabled: true, isDefault: false },
  { id: 'wh-ind-05', name: '云南总仓', code: 'WH-YN-01', address: '勐海县勐海镇茶厂路33号', manager: '刘仓管', phone: '0691-512****', category: 'independent', enabled: true, isDefault: false },
  { id: 'wh-ind-06', name: '安溪分仓', code: 'WH-AX-01', address: '安溪县感德镇茶叶市场7号', manager: '赵仓管', phone: '0595-232****', category: 'independent', enabled: false, isDefault: false },
];

/** 门店仓库初始数据（自有的在茶叶门店的仓库） */
export const storeWarehouses: Warehouse[] = [
  { id: 'wh-store-01', name: '西湖门店仓', code: 'WH-ST-01', address: '杭州市西湖区龙井路8号西湖茶庄', manager: '周店长', phone: '0571-8801****', category: 'store', enabled: true, isDefault: false },
  { id: 'wh-store-02', name: '武夷门店仓', code: 'WH-ST-02', address: '武夷山市度假区大王峰路18号岩茶馆', manager: '吴店长', phone: '0599-525****', category: 'store', enabled: true, isDefault: false },
  { id: 'wh-store-03', name: '广州门店仓', code: 'WH-ST-03', address: '广州市荔湾区芳村大道中50号茶博城', manager: '郑店长', phone: '020-8180****', category: 'store', enabled: true, isDefault: false },
];

/** 自有仓库（独立 + 门店），供页面统一管理 */
export const ownWarehouses: Warehouse[] = [...independentWarehouses, ...storeWarehouses];

/** 从供应商数据派生合作仓库列表（联动供应商管理） */
export function getPartnerWarehouses(): Warehouse[] {
  return supplierItems.flatMap(s =>
    s.warehouses.map((w, idx) => ({
      id: `wh-pt-${s.id}-${w.id}`,
      name: w.name,
      code: `WH-PT-${s.id.padStart(3, '0')}-${String(idx + 1).padStart(2, '0')}`,
      address: w.address,
      manager: w.contactPerson,
      phone: w.contactPhone,
      category: 'partner' as const,
      enabled: s.status === 'active',
      isDefault: w.isDefault,
      supplierId: s.id,
      supplierName: s.name,
    })),
  );
}

/** 仓库归属类型标签 */
export const WAREHOUSE_CATEGORY_LABELS: Record<Warehouse['category'], string> = {
  independent: '独立仓库',
  store: '门店仓库',
  partner: '合作仓库',
};

/** 仓库归属类型颜色 */
export const WAREHOUSE_CATEGORY_COLORS: Record<Warehouse['category'], string> = {
  independent: 'var(--color-module-current-base)',
  store: '#01795D',
  partner: '#0DAFC6',
};
