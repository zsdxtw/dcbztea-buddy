import ContentHeader from '../../components/layout/ContentHeader';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import LineChart from '../../components/charts/LineChart';
import PieChart from '../../components/charts/PieChart';
import Button from '../../components/common/Button';
import { financeStats } from '../../data/mock';

const receivablePayablePieData = [
  { name: '应收金额', value: 60, color: 'var(--color-tea-green)' },
  { name: '应付金额', value: 40, color: 'var(--color-tea-red)' },
];

export default function FinanceOverview() {
  return (
    <>
      <ContentHeader title="财务概览" breadcrumbs={['财务', '财务概览']} actions={<Button><PlusIcon />新建收支</Button>} />
      <div className="content-body">
        <div className="stat-cards">
          {financeStats.map((s, i) => <StatCard key={i} data={s} />)}
        </div>
        <div className="grid-2">
          <Card title="收支趋势">
            <LineChart />
          </Card>
          <Card title="应收应付概览">
            <PieChart data={receivablePayablePieData} />
          </Card>
        </div>
      </div>
    </>
  );
}

function PlusIcon() {
  return <svg viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
}
