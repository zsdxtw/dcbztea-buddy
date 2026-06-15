/** 单位管理数据 - 引用自"系统-单位管理" */

export interface UnitItem {
  name: string;
  symbol: string;
  type: '重量' | '包装' | '特殊';
  base: string;
  productCount: number;
  active: boolean;
}

export const unitItems: UnitItem[] = [
  { name: '千克', symbol: 'kg', type: '重量', base: '基准单位', productCount: 86, active: true },
  { name: '克', symbol: 'g', type: '重量', base: '1 kg = 1000 g', productCount: 42, active: true },
  { name: '斤', symbol: '斤', type: '重量', base: '1 kg = 2 斤', productCount: 28, active: true },
  { name: '两', symbol: '两', type: '重量', base: '1 斤 = 10 两', productCount: 15, active: true },
  { name: '吨', symbol: 't', type: '重量', base: '1 t = 1000 kg', productCount: 8, active: true },
  { name: '磅', symbol: 'lb', type: '重量', base: '1 lb ≈ 0.454 kg', productCount: 3, active: false },
  { name: '盒', symbol: '盒', type: '包装', base: '基准单位', productCount: 52, active: true },
  { name: '箱', symbol: '箱', type: '包装', base: '1 箱 = 20 盒', productCount: 18, active: true },
  { name: '袋', symbol: '袋', type: '包装', base: '基准单位', productCount: 35, active: true },
  { name: '罐', symbol: '罐', type: '包装', base: '基准单位', productCount: 22, active: true },
  { name: '饼', symbol: '饼', type: '特殊', base: '1 饼 = 357 g（普洱）', productCount: 12, active: true },
  { name: '提', symbol: '提', type: '包装', base: '1 提 = 7 饼', productCount: 6, active: true },
];

/** 重量单位选项（启用的） */
export const weightUnits = unitItems.filter(u => u.type === '重量' && u.active);

/** 尺寸单位选项 */
export const dimensionUnits = [
  { name: '厘米', symbol: 'cm' },
  { name: '毫米', symbol: 'mm' },
  { name: '米', symbol: 'm' },
];

/** 包装单位选项（启用的） */
export const packageUnits = unitItems.filter(u => u.type === '包装' && u.active);
