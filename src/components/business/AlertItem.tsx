import type { AlertItemData } from '../../types';

interface AlertItemProps {
  data: AlertItemData;
}

/** 预警项组件 */
export default function AlertItem({ data }: AlertItemProps) {
  return (
    <div className="alert-item">
      <span className={`alert-item-dot ${data.level}`}></span>
      <span className="alert-item-name">{data.name}</span>
      <span className="alert-item-stock">{data.stock}</span>
    </div>
  );
}
