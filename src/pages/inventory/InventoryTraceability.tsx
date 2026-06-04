import { useState } from 'react';
import ContentHeader from '../../components/layout/ContentHeader';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Tag from '../../components/common/Tag';
import StatusTag, { stockStatusToVariant, stockStatusLabel } from '../../components/common/StatusTag';
import FilterBar, { FilterInput, FilterSelect } from '../../components/business/FilterBar';
import { traceabilityItems } from '../../data/mock';
import type { TraceabilityItem } from '../../types';

/** 批次溯源页面 */
export default function InventoryTraceability() {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const handleToggle = (batchCode: string) => {
    setExpandedRow((prev) => (prev === batchCode ? null : batchCode));
  };

  return (
    <>
      <ContentHeader title="批次溯源" breadcrumbs={['仓储', '批次溯源']} />
      <div className="content-body">
        <FilterBar>
          <FilterInput placeholder="搜索批次号、商品名..." />
          <FilterSelect options={['全部茶类', '绿茶', '白茶', '黄茶', '青茶', '红茶', '黑茶']} />
          <FilterSelect options={['全部品级', '特级', '一级', '二级', '三级']} />
        </FilterBar>

        <Card>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>批次号</th>
                  <th>商品名称</th>
                  <th>茶类</th>
                  <th>品级</th>
                  <th>来源</th>
                  <th>入库日期</th>
                  <th>状态</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {traceabilityItems.map((item) => (
                  <TraceRow
                    key={item.id}
                    item={item}
                    isExpanded={expandedRow === item.batchCode}
                    onToggle={handleToggle}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <style>{`
        .trace-panel {
          overflow: hidden;
          transition: max-height var(--duration-normal) var(--ease-default),
                      opacity var(--duration-normal) var(--ease-default);
        }
        .trace-panel.collapsed {
          max-height: 0;
          opacity: 0;
        }
        .trace-panel.expanded {
          max-height: 300px;
          opacity: 1;
        }
        .trace-steps {
          display: flex;
          align-items: flex-start;
          padding: var(--space-5) var(--space-6);
          gap: 0;
        }
        .trace-step {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          text-align: center;
        }
        .trace-step-dot {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-full);
          background: var(--color-neutral-100);
          border: 2px solid var(--color-neutral-300);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: var(--text-xs);
          font-weight: var(--font-semibold);
          color: var(--color-neutral-500);
          position: relative;
          z-index: 1;
          transition: var(--transition-fast);
        }
        .trace-step:first-child .trace-step-dot,
        .trace-step:last-child .trace-step-dot {
          background: var(--color-tea-green);
          border-color: var(--color-tea-green);
          color: var(--color-neutral-0);
        }
        .trace-step-connector {
          position: absolute;
          top: 16px;
          left: calc(50% + 16px);
          right: calc(-50% + 16px);
          height: 2px;
          background: var(--color-neutral-200);
        }
        .trace-step-content {
          margin-top: var(--space-2);
          max-width: 120px;
        }
        .trace-step-stage {
          font-size: var(--text-sm);
          font-weight: var(--font-medium);
          color: var(--color-neutral-700);
          margin-bottom: 2px;
        }
        .trace-step-location {
          font-size: var(--text-xs);
          color: var(--color-neutral-500);
          line-height: var(--leading-sm);
        }
        .trace-step-date {
          font-size: var(--text-xs);
          color: var(--color-neutral-400);
          font-family: var(--font-family-mono);
          margin-top: 2px;
        }
        .trace-step-operator {
          font-size: var(--text-xs);
          color: var(--color-neutral-400);
        }
        .trace-expand-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: var(--radius-md);
          border: 1px solid var(--color-neutral-200);
          background: var(--color-neutral-0);
          cursor: pointer;
          transition: var(--transition-fast);
          color: var(--color-neutral-500);
        }
        .trace-expand-btn:hover {
          background: var(--color-neutral-100);
          color: var(--color-neutral-700);
        }
        .trace-expand-btn svg {
          width: 14px;
          height: 14px;
          transition: transform var(--duration-fast) var(--ease-default);
        }
        .trace-expand-btn.expanded svg {
          transform: rotate(180deg);
        }
      `}</style>
    </>
  );
}

/** 溯源行组件（含展开面板） */
function TraceRow({ item, isExpanded, onToggle }: {
  item: TraceabilityItem;
  isExpanded: boolean;
  onToggle: (batchCode: string) => void;
}) {
  return (
    <>
      <tr>
        <td><span className="mono">{item.batchCode}</span></td>
        <td>{item.productName}</td>
        <td><Tag category={item.teaCategory} /></td>
        <td>{item.grade}</td>
        <td style={{ fontSize: 'var(--text-sm)', color: 'var(--color-neutral-600)' }}>{item.source}</td>
        <td style={{ fontSize: 'var(--text-sm)' }}>{item.inboundDate}</td>
        <td><StatusTag variant={stockStatusToVariant(item.status)} label={stockStatusLabel(item.status)} /></td>
        <td>
          <button
            className={`trace-expand-btn${isExpanded ? ' expanded' : ''}`}
            onClick={() => onToggle(item.batchCode)}
            title={isExpanded ? '收起溯源链' : '展开溯源链'}
          >
            <svg viewBox="0 0 14 14" fill="none">
              <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </td>
      </tr>
      <tr>
        <td colSpan={8} style={{ padding: 0, borderBottom: isExpanded ? '1px solid var(--color-neutral-200)' : 'none' }}>
          <div className={`trace-panel ${isExpanded ? 'expanded' : 'collapsed'}`}>
            <div style={{ background: 'var(--color-neutral-50)', borderTop: '1px solid var(--color-neutral-150)' }}>
              <div className="trace-steps">
                {item.traceSteps.map((step, idx) => (
                  <div key={idx} className="trace-step">
                    {idx < item.traceSteps.length - 1 && <div className="trace-step-connector" />}
                    <div className="trace-step-dot">{idx + 1}</div>
                    <div className="trace-step-content">
                      <div className="trace-step-stage">{step.stage}</div>
                      <div className="trace-step-location">{step.location}</div>
                      <div className="trace-step-date">{step.date}</div>
                      <div className="trace-step-operator">{step.operator !== '-' ? step.operator : ''}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </td>
      </tr>
    </>
  );
}
