/**
 * 客户编号生成工具
 *
 * 编号规则：
 * - 直营客户：VZY-简称首字母-XXXXX
 * - 渠道客户：VQD-简称首字母-XXXXX
 * - 平台客户：VPT-简称首字母-XXXXX
 *
 * 其中 XXXXX 为 3 个客户类型统筹从 00001 开始的顺序号
 */

import { getPinyinInitial } from './pinyin';
import type { CustomerType } from '../types';

/** 客户类型前缀映射 */
const TYPE_PREFIX: Record<CustomerType, string> = {
  direct: 'VZY',
  channel: 'VQD',
  platform: 'VPT',
};

/** 获取简称的首字母组合（大写） */
export function getShortNameInitials(shortName: string): string {
  if (!shortName) return '';
  return Array.from(shortName)
    .map(ch => getPinyinInitial(ch))
    .filter(Boolean)
    .join('')
    .toUpperCase();
}

/**
 * 生成客户编号
 * @param type 客户类型
 * @param shortName 客户简称
 * @param sequence 统筹顺序号（1-based）
 */
export function generateCustomerCode(type: CustomerType, shortName: string, sequence: number): string {
  const prefix = TYPE_PREFIX[type];
  const initials = getShortNameInitials(shortName);
  const seq = String(sequence).padStart(5, '0');
  return `${prefix}-${initials}-${seq}`;
}

/**
 * 批量为客户/平台分配统筹顺序号并生成编号
 * @param items 已按建档顺序排列的条目列表（含 type 和 shortName）
 * @returns 编号数组，与输入顺序一致
 */
export function generateCustomerCodes<T extends { type: CustomerType; shortName: string }>(
  items: T[],
): string[] {
  return items.map((item, idx) => generateCustomerCode(item.type, item.shortName, idx + 1));
}
