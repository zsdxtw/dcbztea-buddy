import type { StatusVariant } from '../../types';

interface StatusTagProps {
  variant: StatusVariant;
  label: string;
}

/** 状态标签组件 */
export default function StatusTag({ variant, label }: StatusTagProps) {
  const statusClass = `status-tag status-${variant}`;
  return (
    <span className={statusClass}>
      <span className="status-tag-dot"></span>
      {label}
    </span>
  );
}

/** 订单状态映射到 StatusVariant */
export function orderStatusToVariant(status: string): StatusVariant {
  switch (status) {
    case 'completed':
      return 'success';
    case 'pending':
    case 'approved':
      return 'warning';
    case 'cancelled':
      return 'error';
    case 'shipping':
      return 'info';
    default:
      return 'info';
  }
}

/** 订单状态映射到中文标签 */
export function orderStatusLabel(status: string): string {
  switch (status) {
    case 'pending': return '待审核';
    case 'approved': return '待确认';
    case 'shipping': return '运输中';
    case 'completed': return '已完成';
    case 'cancelled': return '已取消';
    default: return status;
  }
}

/** 库存状态映射到 StatusVariant */
export function stockStatusToVariant(status: string): StatusVariant {
  switch (status) {
    case 'sufficient': return 'success';
    case 'low': return 'warning';
    case 'insufficient': return 'error';
    default: return 'info';
  }
}

/** 库存状态映射到中文标签 */
export function stockStatusLabel(status: string): string {
  switch (status) {
    case 'sufficient': return '充足';
    case 'low': return '偏低';
    case 'insufficient': return '不足';
    default: return status;
  }
}
