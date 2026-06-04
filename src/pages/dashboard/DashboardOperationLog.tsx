import ContentHeader from '../../components/layout/ContentHeader';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import StatusTag from '../../components/common/StatusTag';
import FilterBar, { FilterInput, FilterSelect } from '../../components/business/FilterBar';
import type { StatCardData } from '../../types';

const stats: StatCardData[] = [
  { label: '今日操作数', value: '342', trend: { direction: 'up', value: '15.2%', label: '较昨日' }, icon: <svg viewBox="0 0 18 18" fill="none"><rect x="4" y="2" width="10" height="14" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M7 6h4M7 9h4M7 12h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg> },
  { label: '操作人数', value: '28', trend: { direction: 'up', value: '+3 人' }, icon: <svg viewBox="0 0 18 18" fill="none"><circle cx="7" cy="7" r="3" stroke="currentColor" strokeWidth="1.3"/><path d="M2 16a5 5 0 0110 0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> },
  { label: '异常操作', value: '5', trend: { direction: 'down', value: '2 次' }, icon: <svg viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.3"/><path d="M9 6v4M9 12.5v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> },
  { label: '系统运行时间', value: '99.8', unit: '%', trend: { direction: 'up', value: '0.1%' }, icon: <svg viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.3"/><path d="M9 5v4l3 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> },
];

const operationLogs = [
  { time: '2025-07-15 14:32:18', user: '陈经理', type: '审核', content: '审核采购订单 PO-2025-0151', ip: '192.168.1.105', result: 'success' as const },
  { time: '2025-07-15 13:15:42', user: '陈经理', type: '创建', content: '创建销售订单 SO-2025-0238', ip: '192.168.1.105', result: 'success' as const },
  { time: '2025-07-15 10:30:07', user: '李仓管', type: '入库', content: '确认入库 明前龙井 — 80kg', ip: '192.168.1.112', result: 'success' as const },
  { time: '2025-07-14 17:45:33', user: '张会计', type: '对账', content: '完成7月对账单', ip: '192.168.1.108', result: 'success' as const },
  { time: '2025-07-14 16:20:15', user: '王销售', type: '修改', content: '修改客户信息 华茗堂茶庄', ip: '192.168.1.120', result: 'warning' as const },
  { time: '2025-07-14 15:08:29', user: '赵仓管', type: '出库', content: '出库操作 正山小种 50kg', ip: '192.168.1.112', result: 'success' as const },
  { time: '2025-07-14 14:55:11', user: '刘操作员', type: '删除', content: '删除过期报价单 QT20250601', ip: '192.168.1.125', result: 'error' as const },
  { time: '2025-07-14 11:22:47', user: '陈经理', type: '审批', content: '审批退货单 RT-2025-0032', ip: '192.168.1.105', result: 'success' as const },
  { time: '2025-07-13 16:40:58', user: '张会计', type: '收款', content: '确认收款 ¥15,800 华茗堂茶庄', ip: '192.168.1.108', result: 'success' as const },
  { time: '2025-07-13 09:12:36', user: '李仓管', type: '盘点', content: '完成武夷仓区盘点', ip: '192.168.1.112', result: 'success' as const },
];

export default function DashboardOperationLog() {
  return (
    <>
      <ContentHeader title="操作日志" breadcrumbs={['工作台', '操作日志']} actions={<><FilterSelect options={['全部类型', '审核', '创建', '入库', '出库', '修改', '删除', '审批']} /></>} />
      <div className="content-body">
        <div className="stat-cards">
          {stats.map((s, i) => <StatCard key={i} data={s} />)}
        </div>
        <FilterBar>
          <FilterInput placeholder="搜索操作人、操作内容..." />
          <FilterSelect options={['全部类型', '审核', '创建', '入库', '出库', '修改', '删除', '审批']} />
          <FilterSelect options={['全部人员', '陈经理', '李仓管', '张会计', '王销售', '赵仓管', '刘操作员']} />
          <FilterSelect options={['全部时间', '今日', '近3天', '近7天', '近30天']} />
        </FilterBar>
        <Card>
          <Table
            headers={['时间', '操作人', '操作类型', '操作内容', 'IP地址', '结果']}
            rows={operationLogs.map((l) => [
              <span className="mono">{l.time}</span>,
              l.user,
              <span style={{ color: 'var(--color-module-current-accent)' }}>{l.type}</span>,
              l.content,
              <span className="mono" style={{ color: 'var(--color-neutral-500)' }}>{l.ip}</span>,
              <StatusTag variant={l.result} label={l.result === 'success' ? '成功' : l.result === 'warning' ? '警告' : '失败'} />,
            ])}
          />
        </Card>
      </div>
    </>
  );
}
