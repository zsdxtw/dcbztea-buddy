import { lineChartData } from '../../data/mock';

interface LineChartProps {
  data?: {
    labels: string[];
    series: Array<{ name: string; color: string; data: number[] }>;
  };
}

/** SVG 折线图组件 */
export default function LineChart({ data }: LineChartProps) {
  const chartData = data ?? lineChartData;
  const chartW = 600;
  const chartH = 220;
  const padL = 50;
  const padR = 20;
  const padT = 20;
  const padB = 20;
  const plotW = chartW - padL - padR;
  const plotH = chartH - padT - padB;

  const allValues = chartData.series.flatMap((s) => s.data);
  const yMax = Math.max(200, ...allValues);
  const yStep = yMax / 4;
  const yTicks = [0, yStep, yStep * 2, yStep * 3];

  const xStep = plotW / (chartData.labels.length - 1);
  const toX = (i: number) => padL + i * xStep;
  const toY = (v: number) => padT + plotH - (v / yMax) * plotH;

  return (
    <svg className="chart-area" viewBox={`0 0 ${chartW} ${chartH}`} fill="none">
      {/* Y轴网格线 + 标签 */}
      {yTicks.map((tick) => {
        const y = toY(tick);
        return (
          <g key={tick}>
            <line x1={padL} y1={y} x2={chartW - padR} y2={y} stroke="var(--color-neutral-150)" strokeWidth="1" />
            <text x={padL - 6} y={y + 4} fontSize="10" fill="var(--color-neutral-400)" textAnchor="end" fontFamily="var(--font-family-mono)">{Math.round(tick)}</text>
          </g>
        );
      })}

      {/* X轴基线 */}
      <line x1={padL} y1={padT + plotH} x2={chartW - padR} y2={padT + plotH} stroke="var(--color-neutral-200)" strokeWidth="1" />

      {/* X轴标签 */}
      {chartData.labels.map((label, i) => (
        <text key={i} x={toX(i)} y={chartH - 5} fontSize="10" fill="var(--color-neutral-400)" textAnchor="middle">{label}</text>
      ))}

      {/* 数据系列 */}
      {chartData.series.map((series, si) => {
        const points = series.data.map((v, i) => `${toX(i)},${toY(v)}`);
        const areaPath = `M${points.join(' ')} L${toX(series.data.length - 1)},${padT + plotH} ${padL},${padT + plotH}Z`;

        return (
          <g key={si}>
            <path d={areaPath} fill={series.color} fillOpacity="0.1" />
            <polyline points={points.join(' ')} stroke={series.color} strokeWidth="2" fill="none" />
            <circle cx={toX(series.data.length - 1)} cy={toY(series.data[series.data.length - 1])} r="3" fill={series.color} />
          </g>
        );
      })}
    </svg>
  );
}
