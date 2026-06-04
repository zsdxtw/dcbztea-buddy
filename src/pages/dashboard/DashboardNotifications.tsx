import { useState } from 'react';
import ContentHeader from '../../components/layout/ContentHeader';
import FilterBar from '../../components/business/FilterBar';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { notifications } from '../../data/mock';
import { NotificationType } from '../../types';
import type { NotificationItem } from '../../types';

/** 通知类型标签映射 */
const typeLabels: Record<NotificationType, string> = {
  [NotificationType.SYSTEM]: '系统',
  [NotificationType.ORDER]: '订单',
  [NotificationType.QUALITY]: '质检',
  [NotificationType.INVENTORY]: '库存',
};

/** 通知类型图标颜色映射 */
const typeColors: Record<NotificationType, string> = {
  [NotificationType.SYSTEM]: 'var(--color-neutral-500)',
  [NotificationType.ORDER]: 'var(--color-module-sales-base)',
  [NotificationType.QUALITY]: 'var(--color-module-purchase-base)',
  [NotificationType.INVENTORY]: 'var(--color-module-inventory-base)',
};

/** 通知类型图标 */
function NotificationTypeIcon({ type }: { type: NotificationType }) {
  const color = typeColors[type];
  switch (type) {
    case NotificationType.SYSTEM:
      return <svg viewBox="0 0 16 16" fill="none" style={{ color }}><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3"/><path d="M8 5v3l2 1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>;
    case NotificationType.ORDER:
      return <svg viewBox="0 0 16 16" fill="none" style={{ color }}><rect x="3" y="1.5" width="10" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M6 5h4M6 7.5h4M6 10h3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>;
    case NotificationType.QUALITY:
      return <svg viewBox="0 0 16 16" fill="none" style={{ color }}><path d="M8 1L3 4v5.5L8 13l5-3.5V4L8 1z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><path d="M6 7.5l1.5 1.5 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    case NotificationType.INVENTORY:
      return <svg viewBox="0 0 16 16" fill="none" style={{ color }}><rect x="2" y="4" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M2 7.5h12" stroke="currentColor" strokeWidth="1.2"/></svg>;
  }
}

/** 消息通知页面 */
export default function DashboardNotifications() {
  const [filterType, setFilterType] = useState<string>('全部类型');
  const [filterRead, setFilterRead] = useState<string>('全部');
  const [items, setItems] = useState<NotificationItem[]>(notifications);

  const filteredItems = items.filter((item) => {
    if (filterType !== '全部类型') {
      const typeMap: Record<string, NotificationType> = {
        '系统': NotificationType.SYSTEM,
        '订单': NotificationType.ORDER,
        '质检': NotificationType.QUALITY,
        '库存': NotificationType.INVENTORY,
      };
      if (item.type !== typeMap[filterType]) return false;
    }
    if (filterRead === '未读' && item.read) return false;
    if (filterRead === '已读' && !item.read) return false;
    return true;
  });

  const handleMarkRead = (id: string) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const handleMarkAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = items.filter((n) => !n.read).length;

  return (
    <>
      <ContentHeader
        title="消息通知"
        breadcrumbs={['工作台', '消息通知']}
        actions={<Button variant="ghost" onClick={handleMarkAllRead}>全部已读</Button>}
      />
      <div className="content-body">
        <FilterBar>
          <select className="filter-select" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option>全部类型</option>
            <option>系统</option>
            <option>订单</option>
            <option>质检</option>
            <option>库存</option>
          </select>
          <select className="filter-select" value={filterRead} onChange={(e) => setFilterRead(e.target.value)}>
            <option>全部</option>
            <option>未读</option>
            <option>已读</option>
          </select>
        </FilterBar>

        {unreadCount > 0 && (
          <div style={{ marginBottom: 'var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--color-neutral-500)' }}>
            共 {unreadCount} 条未读消息
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {filteredItems.map((item) => (
            <Card key={item.id} style={{ cursor: 'pointer', transition: 'var(--transition-fast)' }}>
              <div
                style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-4)', padding: 'var(--space-4) var(--space-5)' }}
                onClick={() => handleMarkRead(item.id)}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: 'var(--radius-md)',
                  background: 'var(--color-neutral-100)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <NotificationTypeIcon type={item.type} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
                    <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--color-neutral-700)' }}>{item.title}</span>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', height: 18, padding: '0 var(--space-1)',
                      borderRadius: 'var(--radius-xs)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-medium)',
                      background: 'var(--color-neutral-100)', color: typeColors[item.type],
                    }}>
                      {typeLabels[item.type]}
                    </span>
                    {!item.read && (
                      <span style={{
                        width: 6, height: 6, borderRadius: 'var(--radius-full)',
                        background: 'var(--color-semantic-error)', flexShrink: 0,
                      }} />
                    )}
                  </div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-neutral-500)', marginBottom: 'var(--space-2)', lineHeight: 'var(--leading-md)' }}>
                    {item.content}
                  </div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-400)' }}>
                    {item.time}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <Card>
            <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--color-neutral-400)' }}>
              暂无通知消息
            </div>
          </Card>
        )}
      </div>
    </>
  );
}
