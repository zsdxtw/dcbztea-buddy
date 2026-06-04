import { pieChartData } from '../../data/mock';

interface PieChartProps {
  data?: Array<{ name: string; value: number; color: string }>;
}

/** SVG 饼图组件 */
export default function PieChart({ data }: PieChartProps) {
  const chartData = data ?? pieChartData;
  const cx = 100;
  const cy = 100;
  const r = 80;
  const circumference = 2 * Math.PI * r;

  let offset = 0;
  const arcs = chartData.map((item) => {
    const dashLen = (item.value / 100) * circumference;
    const arc = {
      ...item,
      dashLen,
      offset,
    };
    offset += dashLen;
    return arc;
  });

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)' }}>
      <svg viewBox="0 0 200 200" width="200" height="200" style={{ flexShrink: 0 }}>
        {/* 底色环 */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--color-neutral-150)" strokeWidth="24" />
        {/* 数据环 */}
        {arcs.map((arc, i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={arc.color}
            strokeWidth="24"
            strokeDasharray={`${arc.dashLen} ${circumference - arc.dashLen}`}
            strokeDashoffset={-arc.offset}
            transform={`rotate(-90 ${cx} ${cy})`}
          />
        ))}
      </svg>
      {/* 图例 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {chartData.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)' }}>
            <span style={{ width: 10, height: 10, borderRadius: 'var(--radius-xs)', background: item.color, display: 'inline-block', flexShrink: 0 }}></span>
            <span style={{ color: 'var(--color-neutral-600)' }}>{item.name}</span>
            <span style={{ color: 'var(--color-neutral-500)', fontFamily: 'var(--font-family-mono)', marginLeft: 'auto' }}>{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
