import ContentHeader from '../../components/layout/ContentHeader';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Tag from '../../components/common/Tag';
import StatusTag from '../../components/common/StatusTag';
import FilterBar, { FilterInput, FilterSelect } from '../../components/business/FilterBar';
import { quotationStats, quotationItems } from '../../data/mock';
import type { StatusVariant } from '../../types';
import { QuotationStatus } from '../../types';

/** 报价状态映射到 StatusVariant */
function quotationStatusToVariant(status: QuotationStatus): StatusVariant {
  switch (status) {
    case QuotationStatus.PENDING_REPLY: return 'warning';
    case QuotationStatus.QUOTED: return 'info';
    case QuotationStatus.EXPIRED: return 'error';
    case QuotationStatus.CONVERTED: return 'success';
    default: return 'info';
  }
}

/** 报价状态映射到中文标签 */
function quotationStatusLabel(status: QuotationStatus): string {
  switch (status) {
    case QuotationStatus.PENDING_REPLY: return '待回复';
    case QuotationStatus.QUOTED: return '已报价';
    case QuotationStatus.EXPIRED: return '已过期';
    case QuotationStatus.CONVERTED: return '已转化';
    default: return status;
  }
}

/** 格式化金额（千分位） */
function formatAmount(value: number): string {
  return value.toLocaleString('zh-CN');
}

/** 报价管理页面 */
export default function SalesQuotations() {
  return (
    <>
      <ContentHeader title="报价管理" breadcrumbs={['销售', '报价管理']} />
      <div className="content-body">
        <div className="stat-cards">
          <StatCard data={{
            label: '待回复', value: String(quotationStats.pendingReply),
            icon: <svg viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.3"/><path d="M9 6v3l2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
          }} />
          <StatCard data={{
            label: '已报价', value: String(quotationStats.quoted),
            icon: <svg viewBox="0 0 18 18" fill="none"><rect x="3" y="2" width="12" height="14" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M6 6h6M6 9h6M6 12h4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>,
          }} />
          <StatCard data={{
            label: '已过期', value: String(quotationStats.expired),
            icon: <svg viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.3"/><path d="M6 6l6 6M12 6l-6 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
          }} />
          <StatCard data={{
            label: '转化率', value: quotationStats.conversionRate.toFixed(1), unit: '%',
            icon: <svg viewBox="0 0 18 18" fill="none"><path d="M3 14l3-4 3 2 3-5 3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
          }} />
        </div>

        <FilterBar>
          <FilterInput placeholder="搜索客户、报价单号..." />
          <FilterSelect options={['全部状态', '待回复', '已报价', '已过期', '已转化']} />
          <FilterSelect options={['全部茶类', '绿茶', '白茶', '黄茶', '青茶', '红茶', '黑茶']} />
        </FilterBar>

        <Card>
          <Table
            headers={['报价单号', '客户', '茶类', '品级', '单价(元)', '数量(kg)', '金额(元)', '有效期', '状态']}
            rows={quotationItems.map((item) => [
              <span className="mono">{item.quotationCode}</span>,
              item.customer,
              <Tag category={item.teaCategory} />,
              item.grade,
              <span className="mono">{formatAmount(item.unitPrice)}</span>,
              <span className="mono">{item.quantity}</span>,
              <span className="mono">{formatAmount(item.amount)}</span>,
              item.validUntil,
              <StatusTag variant={quotationStatusToVariant(item.status)} label={quotationStatusLabel(item.status)} />,
            ])}
          />
        </Card>
      </div>
    </>
  );
}
