import ContentHeader from '../../components/layout/ContentHeader';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import StatusTag from '../../components/common/StatusTag';

export default function SettingsLogs() {
  const logs = [
    { time: '2025-07-15 14:32', user: '陈经理', action: '审核采购订单', detail: 'PO-2025-0151', status: 'success' as const },
    { time: '2025-07-15 13:15', user: '陈经理', action: '创建销售订单', detail: 'SO-2025-0238', status: 'info' as const },
    { time: '2025-07-15 10:30', user: '李仓管', action: '确认入库', detail: '明前龙井 — 80kg', status: 'success' as const },
    { time: '2025-07-14 17:45', user: '张会计', action: '财务对账', detail: '7月对账单', status: 'success' as const },
    { time: '2025-07-14 16:20', user: '王销售', action: '修改客户信息', detail: '华茗堂茶庄', status: 'warning' as const },
  ];

  return (
    <>
      <ContentHeader title="操作日志" breadcrumbs={['设置', '操作日志']} />
      <div className="content-body">
        <Card>
          <Table
            headers={['时间', '操作人', '操作', '详情', '状态']}
            rows={logs.map((l) => [
              <span className="mono">{l.time}</span>,
              l.user,
              l.action,
              l.detail,
              <StatusTag variant={l.status} label={l.status === 'success' ? '成功' : l.status === 'warning' ? '警告' : '信息'} />,
            ])}
          />
        </Card>
      </div>
    </>
  );
}
