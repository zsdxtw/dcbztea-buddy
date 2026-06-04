import { useState } from 'react';
import ContentHeader from '../../components/layout/ContentHeader';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import StatusTag from '../../components/common/StatusTag';
import Toggle from '../../components/common/Toggle';
import SettingsSection from '../../components/settings/SettingsSection';
import SettingsRow from '../../components/settings/SettingsRow';
import Button from '../../components/common/Button';
import type { StatCardData } from '../../types';

const stats: StatCardData[] = [
  { label: '仓库总数', value: '6', trend: { direction: 'up', value: '+1' }, icon: <svg viewBox="0 0 18 18" fill="none"><rect x="3" y="5" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M3 9h12" stroke="currentColor" strokeWidth="1.3"/></svg> },
  { label: '启用仓库', value: '5', icon: <svg viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.3"/><path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { label: '总库位数', value: '480', icon: <svg viewBox="0 0 18 18" fill="none"><rect x="3" y="5" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M3 9h12M7 5V3h4v2" stroke="currentColor" strokeWidth="1.3"/></svg> },
  { label: '库位利用率', value: '74.2', unit: '%', trend: { direction: 'up', value: '2.5%' }, icon: <svg viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.3"/><path d="M9 5v4l3 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> },
];

interface WarehouseItem {
  name: string;
  code: string;
  address: string;
  manager: string;
  enabled: boolean;
}

const initialWarehouses: WarehouseItem[] = [
  { name: '杭州总仓', code: 'WH-HZ-01', address: '杭州市西湖区龙井路88号', manager: '李仓管', enabled: true },
  { name: '武夷仓区', code: 'WH-WY-01', address: '武夷山市星村镇茶博路12号', manager: '张仓管', enabled: true },
  { name: '苏州分仓', code: 'WH-SZ-01', address: '苏州市吴中区洞庭山路56号', manager: '王仓管', enabled: true },
  { name: '福鼎分仓', code: 'WH-FD-01', address: '福鼎市点头镇茶青市场旁', manager: '陈仓管', enabled: true },
  { name: '云南总仓', code: 'WH-YN-01', address: '勐海县勐海镇茶厂路33号', manager: '刘仓管', enabled: true },
  { name: '安溪分仓', code: 'WH-AX-01', address: '安溪县感德镇茶叶市场7号', manager: '赵仓管', enabled: false },
];

export default function InventorySettings() {
  const [warehouses, setWarehouses] = useState<WarehouseItem[]>(initialWarehouses);
  const [lowStockThreshold, setLowStockThreshold] = useState('20');
  const [turnoverDays, setTurnoverDays] = useState('45');
  const [defaultAllocation, setDefaultAllocation] = useState('auto');

  const handleToggle = (index: number, active: boolean) => {
    setWarehouses(prev => prev.map((w, i) => i === index ? { ...w, enabled: active } : w));
  };

  return (
    <>
      <ContentHeader title="仓库设置" breadcrumbs={['仓储', '仓库设置']} actions={<Button><PlusIcon />新增仓库</Button>} />
      <div className="content-body">
        <div className="stat-cards">
          {stats.map((s, i) => <StatCard key={i} data={s} />)}
        </div>
        <Card title="仓库列表">
          <Table
            headers={['仓库名称', '仓库编码', '地址', '负责人', '状态', '操作']}
            rows={warehouses.map((w, i) => [
              <span style={{ fontWeight: 'var(--font-medium)' }}>{w.name}</span>,
              <span className="mono">{w.code}</span>,
              <span style={{ color: 'var(--color-neutral-500)', fontSize: 'var(--text-sm)' }}>{w.address}</span>,
              w.manager,
              <Toggle active={w.enabled} onChange={(active) => handleToggle(i, active)} />,
              <Button variant="ghost" size="sm">编辑</Button>,
            ])}
          />
        </Card>
        <Card style={{ marginTop: 'var(--space-6)' }}>
          <SettingsSection title="库存预警配置">
            <SettingsRow
              label="低库存预警阈值"
              description="当库存数量低于此值时触发预警"
              action={
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <input
                    type="number"
                    value={lowStockThreshold}
                    onChange={(e) => setLowStockThreshold(e.target.value)}
                    style={{ width: 80, padding: 'var(--space-1) var(--space-2)', border: '1px solid var(--color-neutral-200)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family-mono)' }}
                  />
                  <span style={{ color: 'var(--color-neutral-500)', fontSize: 'var(--text-sm)' }}>kg</span>
                </div>
              }
            />
            <SettingsRow
              label="库存周转天数"
              description="超过此天数的库存标记为滞销"
              action={
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <input
                    type="number"
                    value={turnoverDays}
                    onChange={(e) => setTurnoverDays(e.target.value)}
                    style={{ width: 80, padding: 'var(--space-1) var(--space-2)', border: '1px solid var(--color-neutral-200)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family-mono)' }}
                  />
                  <span style={{ color: 'var(--color-neutral-500)', fontSize: 'var(--text-sm)' }}>天</span>
                </div>
              }
            />
          </SettingsSection>
          <SettingsSection title="默认分配规则">
            <SettingsRow
              label="默认库位分配"
              description="入库时自动分配库位的规则"
              action={
                <select
                  value={defaultAllocation}
                  onChange={(e) => setDefaultAllocation(e.target.value)}
                  style={{ padding: 'var(--space-1) var(--space-2)', border: '1px solid var(--color-neutral-200)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-sm)', background: 'var(--color-neutral-0)' }}
                >
                  <option value="auto">自动分配</option>
                  <option value="category">按茶类分配</option>
                  <option value="manual">手动指定</option>
                </select>
              }
            />
          </SettingsSection>
        </Card>
      </div>
    </>
  );
}

function PlusIcon() {
  return <svg viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
}
