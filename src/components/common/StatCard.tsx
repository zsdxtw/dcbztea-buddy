import type { StatCardData } from '../../types';

interface StatCardProps {
  data: StatCardData;
}

/** 统计卡片组件 */
export default function StatCard({ data }: StatCardProps) {
  const trendClass = data.trend?.direction === 'up' ? 'up' : 'down';
  const TrendIcon = data.trend?.direction === 'up' ? UpIcon : DownIcon;

  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <span className="stat-card-label">{data.label}</span>
        {data.icon && <div className="stat-card-icon">{data.icon}</div>}
      </div>
      <div className="stat-card-value">
        {data.unit && data.unit === '¥' && (
          <span style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-regular)', color: 'var(--color-neutral-500)' }}>¥</span>
        )}
        {' '}{data.value}{' '}
        {data.unit && data.unit !== '¥' && (
          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-regular)', color: 'var(--color-neutral-500)' }}>{data.unit}</span>
        )}
      </div>
      {data.trend && (
        <div className={`stat-card-trend ${trendClass}`}>
          <TrendIcon />
          {data.trend.value}
          {data.trend.label && ` ${data.trend.label}`}
        </div>
      )}
    </div>
  );
}

function UpIcon() {
  return (
    <svg viewBox="0 0 14 14" fill="none">
      <path d="M7 11V3M3 7l4-4 4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function DownIcon() {
  return (
    <svg viewBox="0 0 14 14" fill="none">
      <path d="M7 3v8M3 7l4 4 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
