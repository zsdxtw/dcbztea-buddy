/**
 * 客户编号生成工具
 *
 * 编号规则（4位数字，各类型单独从 0001 开始）：
 * - 直营客户：VZY-简称首字母-0001
 * - 渠道客户：VQD-简称首字母-0001
 * - 个人客户：VGR-名称首字母-0001
 * - 平台客户：VPT-简称首字母-0001
 */

import { getPinyinInitial } from './pinyin';
import type { CustomerType } from '../types';

/** 客户类型前缀映射 */
const TYPE_PREFIX: Record<CustomerType, string> = {
  direct: 'VZY',
  channel: 'VQD',
  personal: 'VGR',
  platform: 'VPT',
};

/** 获取简称/名称的首字母组合（大写） */
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
 * @param shortName 客户简称（个人客户为客户名称）
 * @param sequence 该类型下的顺序号（1-based）
 */
export function generateCustomerCode(type: CustomerType, shortName: string, sequence: number): string {
  const prefix = TYPE_PREFIX[type];
  const initials = getShortNameInitials(shortName);
  const seq = String(sequence).padStart(4, '0');
  return `${prefix}-${initials}-${seq}`;
}
