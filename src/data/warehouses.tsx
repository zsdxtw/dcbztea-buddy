/** 仓库设置共享数据源
 * - 自有仓库：本模块维护，可在仓库设置中增删改查
 * - 合作仓库：由供应商管理中的仓库数据派生（联动），在仓库设置中只读展示
 */
import type { Warehouse } from '../types';
import { supplierItems } from './suppliers';

/** 自有仓库初始数据 */
export const ownWarehouses: Warehouse[] = [
  { id: 'wh-own-01', name: '杭州总仓', code: 'WH-HZ-01', address: '杭州市西湖区龙井路88号', manager: '李仓管', phone: '0571-8766****', category: 'own', enabled: true, isDefault: true },
  { id: 'wh-own-02', name: '武夷仓区', code: 'WH-WY-01', address: '武夷山市星村镇茶博路12号', manager: '张仓管', phone: '0599-512****', category: 'own', enabled: true, isDefault: false },
  { id: 'wh-own-03', name: '苏州分仓', code: 'WH-SZ-01', address: '苏州市吴中区洞庭山路56号', manager: '王仓管', phone: '0512-662****', category: 'own', enabled: true, isDefault: false },
  { id: 'wh-own-04', name: '福鼎分仓', code: 'WH-FD-01', address: '福鼎市点头镇茶青市场旁', manager: '陈仓管', phone: '0593-787****', category: 'own', enabled: true, isDefault: false },
  { id: 'wh-own-05', name: '云南总仓', code: 'WH-YN-01', address: '勐海县勐海镇茶厂路33号', manager: '刘仓管', phone: '0691-512****', category: 'own', enabled: true, isDefault: false },
  { id: 'wh-own-06', name: '安溪分仓', code: 'WH-AX-01', address: '安溪县感德镇茶叶市场7号', manager: '赵仓管', phone: '0595-232****', category: 'own', enabled: false, isDefault: false },
];

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
  own: '自有仓库',
  partner: '合作仓库',
};

/** 仓库归属类型颜色 */
export const WAREHOUSE_CATEGORY_COLORS: Record<Warehouse['category'], string> = {
  own: 'var(--color-module-current-base)',
  partner: '#0DAFC6',
};
