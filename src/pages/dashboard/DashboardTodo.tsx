import ContentHeader from '../../components/layout/ContentHeader';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import TodoItem from '../../components/business/TodoItem';
import FilterBar, { FilterSelect } from '../../components/business/FilterBar';
import type { StatCardData, TodoItemData } from '../../types';

const stats: StatCardData[] = [
  { label: '待办总数', value: '12', trend: { direction: 'down', value: '3 项' }, icon: <svg viewBox="0 0 18 18" fill="none"><rect x="3" y="3" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M7 7h6M7 10h6M7 13h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg> },
  { label: '今日到期', value: '4', trend: { direction: 'up', value: '需及时处理' }, icon: <svg viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.3"/><path d="M9 6v4M9 12.5v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> },
  { label: '已逾期', value: '2', trend: { direction: 'down', value: '1 项' }, icon: <svg viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.3"/><path d="M9 6v4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><path d="M7 13h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> },
];

const allTodos: TodoItemData[] = [
  { text: '审核采购订单 PO-2025-0151', time: '10:30', done: false },
  { text: '确认龙井春茶入库', time: '09:15', done: true },
  { text: '跟进客户华茗堂回款', time: '14:00', done: false },
  { text: '盘点武夷仓区红茶品类', time: '16:00', done: false },
  { text: '更新普洱熟茶商品规格', time: '17:30', done: false },
  { text: '审批退货单 RT-2025-0012', time: '11:00', done: false },
  { text: '安排白牡丹批次质检', time: '13:30', done: true },
  { text: '准备月度财务报表', time: '18:00', done: false },
  { text: '联系供应商确认交期', time: '10:00', done: true },
  { text: '处理碧螺春库存预警', time: '15:30', done: false },
  { text: '审核费用报销 EX-2025-0023', time: '12:00', done: false },
  { text: '更新客户档案信息', time: '16:30', done: true },
];

export default function DashboardTodo() {
  return (
    <>
      <ContentHeader title="待办事项" breadcrumbs={['工作台', '待办事项']} />
      <div className="content-body">
        <div className="stat-cards">
          {stats.map((s, i) => <StatCard key={i} data={s} />)}
        </div>
        <FilterBar>
          <FilterSelect options={['全部状态', '待完成', '已完成']} />
          <FilterSelect options={['全部类型', '审批', '入库', '出库', '质检', '财务', '其他']} />
        </FilterBar>
        <Card>
          {allTodos.map((t, i) => <TodoItem key={i} data={t} />)}
        </Card>
      </div>
    </>
  );
}
