import { useState } from 'react';
import ContentHeader from '../../components/layout/ContentHeader';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import StatusTag from '../../components/common/StatusTag';
import Toggle from '../../components/common/Toggle';
import Button from '../../components/common/Button';
import type { StatCardData } from '../../types';

const stats: StatCardData[] = [
  { label: '预警规则数', value: '8', trend: { direction: 'up', value: '+2 条' }, icon: <svg viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.3"/><path d="M9 6v4M9 12.5v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> },
  { label: '已触发预警', value: '5', trend: { direction: 'up', value: '需关注' }, icon: <svg viewBox="0 0 18 18" fill="none"><path d="M10 3a5 5 0 015 5v3l2 2H3l2-2V8a5 5 0 015-5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><path d="M8 15a2 2 0 004 0" stroke="currentColor" strokeWidth="1.3"/></svg> },
  { label: '预警商品数', value: '12', trend: { direction: 'down', value: '3 件' }, icon: <svg viewBox="0 0 18 18" fill="none"><rect x="4" y="4" width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M4 8h10M8 4v10" stroke="currentColor" strokeWidth="1.2"/></svg> },
  { label: '预警类型数', value: '4', icon: <svg viewBox="0 0 18 18" fill="none"><rect x="3" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3"/><rect x="11" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3"/><rect x="3" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3"/><rect x="11" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3"/></svg> },
];

interface AlertRule {
  name: string;
  type: string;
  condition: string;
  productCount: number;
  enabled: boolean;
  triggered: boolean;
}

const initialRules: AlertRule[] = [
  { name: '库存下限预警', type: '库存不足', condition: '库存数量 < 安全库存', productCount: 6, enabled: true, triggered: true },
  { name: '保质期临近预警', type: '保质期', condition: '距过期 ≤ 30 天', productCount: 2, enabled: true, triggered: false },
  { name: '滞销商品预警', type: '滞销', condition: '90天无出库记录', productCount: 3, enabled: true, triggered: true },
  { name: '库存上限预警', type: '库存过多', condition: '库存数量 > 最大库存', productCount: 1, enabled: false, triggered: false },
  { name: '温度异常预警', type: '环境监控', condition: '冷藏区温度 > 8°C', productCount: 0, enabled: true, triggered: false },
  { name: '批次过期预警', type: '保质期', condition: '批次已过期', productCount: 0, enabled: false, triggered: false },
  { name: '价格波动预警', type: '价格', condition: '采购价环比 > 20%', productCount: 0, enabled: true, triggered: true },
  { name: '供应商延迟预警', type: '供应', condition: '交货延迟 > 3 天', productCount: 0, enabled: true, triggered: true },
];

export default function InventoryAlertSettings() {
  const [rules, setRules] = useState<AlertRule[]>(initialRules);

  const handleToggle = (index: number, active: boolean) => {
    setRules(prev => prev.map((r, i) => i === index ? { ...r, enabled: active } : r));
  };

  return (
    <>
      <ContentHeader title="预警设置" breadcrumbs={['仓储', '预警设置']} actions={<Button><PlusIcon />新增预警规则</Button>} />
      <div className="content-body">
        <div className="stat-cards">
          {stats.map((s, i) => <StatCard key={i} data={s} />)}
        </div>
        <Card>
          <Table
            headers={['预警名称', '预警类型', '预警条件', '关联商品数', '状态', '操作']}
            rows={rules.map((r, i) => [
              <span style={{ fontWeight: 'var(--font-medium)' }}>{r.name}</span>,
              <span style={{ color: 'var(--color-module-current-accent)' }}>{r.type}</span>,
              <span style={{ color: 'var(--color-neutral-500)' }}>{r.condition}</span>,
              <span className="mono">{r.productCount}</span>,
              r.triggered && r.enabled
                ? <StatusTag variant="error" label="已触发" />
                : r.enabled
                  ? <StatusTag variant="success" label="已启用" />
                  : <StatusTag variant="warning" label="已禁用" />,
              <Toggle active={r.enabled} onChange={(active) => handleToggle(i, active)} />,
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
