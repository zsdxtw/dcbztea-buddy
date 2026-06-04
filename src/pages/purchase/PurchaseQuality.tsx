import ContentHeader from '../../components/layout/ContentHeader';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Tag from '../../components/common/Tag';
import StatusTag from '../../components/common/StatusTag';
import FilterBar, { FilterInput, FilterSelect } from '../../components/business/FilterBar';
import { qualityStats, qualityItems } from '../../data/mock';
import type { StatusVariant } from '../../types';
import { QualityResult } from '../../types';

/** 质检结果映射到 StatusVariant */
function qualityResultToVariant(result: QualityResult): StatusVariant {
  switch (result) {
    case QualityResult.QUALIFIED: return 'success';
    case QualityResult.PENDING: return 'warning';
    case QualityResult.UNQUALIFIED: return 'error';
    default: return 'info';
  }
}

/** 质检结果映射到中文标签 */
function qualityResultLabel(result: QualityResult): string {
  switch (result) {
    case QualityResult.QUALIFIED: return '合格';
    case QualityResult.PENDING: return '待质检';
    case QualityResult.UNQUALIFIED: return '不合格';
    default: return result;
  }
}

/** 茶叶质检页面 */
export default function PurchaseQuality() {
  return (
    <>
      <ContentHeader title="茶叶质检" breadcrumbs={['采购', '茶叶质检']} />
      <div className="content-body">
        <div className="stat-cards">
          <StatCard data={{
            label: '待质检', value: String(qualityStats.pending),
            icon: <svg viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.3"/><path d="M9 6v3l2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
          }} />
          <StatCard data={{
            label: '合格', value: String(qualityStats.qualified),
            icon: <svg viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.3"/><path d="M6 9l2 2 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
          }} />
          <StatCard data={{
            label: '不合格', value: String(qualityStats.unqualified),
            icon: <svg viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.3"/><path d="M6 6l6 6M12 6l-6 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
          }} />
          <StatCard data={{
            label: '合格率', value: qualityStats.rate.toFixed(1), unit: '%',
            icon: <svg viewBox="0 0 18 18" fill="none"><path d="M3 14l3-4 3 2 3-5 3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
          }} />
        </div>

        <FilterBar>
          <FilterInput placeholder="搜索批次号、商品名..." />
          <FilterSelect options={['全部结果', '待质检', '合格', '不合格']} />
          <FilterSelect options={['全部茶类', '绿茶', '白茶', '黄茶', '青茶', '红茶', '黑茶']} />
        </FilterBar>

        <Card>
          <Table
            headers={['批次号', '商品名称', '茶类', '品级', '水分(%)', '灰分(%)', '农残(mg/kg)', '感官评审', '结果']}
            rows={qualityItems.map((item) => [
              <span className="mono">{item.batchCode}</span>,
              item.productName,
              <Tag category={item.teaCategory} />,
              item.grade,
              <span className="mono">{item.moisture.toFixed(1)}</span>,
              <span className="mono">{item.ash.toFixed(1)}</span>,
              <span className="mono">{item.pesticideResidue.toFixed(2)}</span>,
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-500)', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block' }}>{item.sensory}</span>,
              <StatusTag variant={qualityResultToVariant(item.result)} label={qualityResultLabel(item.result)} />,
            ])}
          />
        </Card>
      </div>
    </>
  );
}
