import type { ReactNode } from 'react';

interface CardProps {
  title?: ReactNode;
  headerRight?: ReactNode;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/** 卡片组件 */
export default function Card({ title, headerRight, children, className, style }: CardProps) {
  const hasHeader = title || headerRight;
  return (
    <div className={`card${className ? ` ${className}` : ''}`} style={style}>
      {hasHeader && (
        <div className="card-header">
          {title && <span className="card-title">{title}</span>}
          {headerRight}
        </div>
      )}
      <div className="card-body">{children}</div>
    </div>
  );
}
