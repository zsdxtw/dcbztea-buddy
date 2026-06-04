import ContentHeader from '../../components/layout/ContentHeader';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import LineChart from '../../components/charts/LineChart';
import Button from '../../components/common/Button';
import { salesStats } from '../../data/mock';

export default function SalesOverview() {
  return (
    <>
      <ContentHeader title="销售概览" breadcrumbs={['销售', '销售概览']} actions={<Button><PlusIcon />新建销售单</Button>} />
      <div className="content-body">
        <div className="stat-cards">
          {salesStats.map((s, i) => <StatCard key={i} data={s} />)}
        </div>
        <Card title="销售趋势">
          <LineChart />
        </Card>
      </div>
    </>
  );
}

function PlusIcon() {
  return <svg viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
}
