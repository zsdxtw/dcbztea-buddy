import ContentHeader from '../../components/layout/ContentHeader';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import StatusTag from '../../components/common/StatusTag';
import Button from '../../components/common/Button';

export default function FinanceReceivable() {
  const receivables = [
    { partner: '华茗堂茶庄', type: '应收', amount: '¥ 28,600', due: '2025-08-15', status: 'warning' as const },
    { partner: '雅韵茶社', type: '应收', amount: '¥ 15,400', due: '2025-08-20', status: 'success' as const },
    { partner: '武夷山茶业', type: '应付', amount: '¥ 42,800', due: '2025-07-25', status: 'error' as const },
    { partner: '安溪铁观音集团', type: '应付', amount: '¥ 18,200', due: '2025-08-01', status: 'warning' as const },
  ];

  return (
    <>
      <ContentHeader title="应收应付" breadcrumbs={['财务', '应收应付']} actions={<Button><PlusIcon />新建记录</Button>} />
      <div className="content-body">
        <Card>
          <Table
            headers={['往来方', '类型', '金额', '到期日', '状态']}
            rows={receivables.map((r) => [
              r.partner, r.type,
              <span className="mono">{r.amount}</span>,
              <span className="mono">{r.due}</span>,
              <StatusTag variant={r.status} label={r.status === 'error' ? '逾期' : r.status === 'warning' ? '即将到期' : '正常'} />,
            ])}
          />
        </Card>
      </div>
    </>
  );
}

function PlusIcon() {
  return <svg viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
}
