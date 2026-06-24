import { useState, useMemo } from 'react';
import ContentHeader from '../../components/layout/ContentHeader';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import { streamers as initialStreamers } from '../../data/streamers';
import { teaProfessionals } from '../../data/teaProfessionals';
import type { Streamer, StatCardData } from '../../types';

/* ── 人员模块配色 ── */
const PRIMARY = '#9D73BD'; // 人员模块主色调
const PRIMARY_LIGHT = '#F3EDF8';
const SECONDARY = '#FDDE83'; // 人员模块辅色调

/* ── 新增表单初始值 ── */
const emptyForm = {
  name: '',
  phone: '',
  settlement: { accountName: '', accountNo: '', bankName: '', bankNo: '' },
  remark: '',
};

export default function PersonnelStreamer() {
  const [streamerList, setStreamerList] = useState<Streamer[]>(initialStreamers);
  const [keyword, setKeyword] = useState('');
  const [showDrawer, setShowDrawer] = useState(false);
  const [selectedStreamer, setSelectedStreamer] = useState<Streamer | null>(null);
  const [drawerMode, setDrawerMode] = useState<'view' | 'add'>('view');
  const [form, setForm] = useState({ ...emptyForm });

  // 茶人 id → 姓名 映射
  const teaProfessionalMap = useMemo(() => {
    const map = new Map<string, string>();
    teaProfessionals.forEach(p => map.set(p.id, p.name));
    return map;
  }, []);

  // 筛选
  const filtered = useMemo(() => {
    const kw = keyword.trim();
    return streamerList.filter(s => {
      if (!kw) return true;
      const linkedName = s.linkedTeaProfessionalId ? teaProfessionalMap.get(s.linkedTeaProfessionalId) ?? '' : '';
      return s.name.includes(kw) || s.phone.includes(kw) || linkedName.includes(kw);
    });
  }, [streamerList, keyword, teaProfessionalMap]);

  // 统计卡片
  const stats: StatCardData[] = useMemo(() => {
    const total = streamerList.length;
    const linked = streamerList.filter(s => !!s.linkedTeaProfessionalId).length;
    const independent = total - linked;
    return [
      {
        label: '带货人总数', value: String(total), unit: '人',
        trend: { direction: 'up', value: `在册 ${total} 人` },
        icon: <IconStreamer />,
      },
      {
        label: '已关联茶人数', value: String(linked), unit: '人',
        trend: { direction: 'up', value: `占比 ${total ? Math.round((linked / total) * 100) : 0}%` },
        icon: <IconLinked />,
      },
      {
        label: '独立带货人数', value: String(independent), unit: '人',
        trend: { direction: 'up', value: `占比 ${total ? Math.round((independent / total) * 100) : 0}%` },
        icon: <IconIndependent />,
      },
    ];
  }, [streamerList]);

  // 查看详情
  const handleView = (streamer: Streamer) => {
    setSelectedStreamer(streamer);
    setDrawerMode('view');
    setShowDrawer(true);
  };

  // 新增
  const handleAdd = () => {
    setSelectedStreamer(null);
    setForm({ ...emptyForm, settlement: { ...emptyForm.settlement } });
    setDrawerMode('add');
    setShowDrawer(true);
  };

  // 保存
  const handleSave = () => {
    if (!form.name.trim() || !form.phone.trim()) return;
    const nextId = `str-${streamerList.length + 1}`;
    const newStreamer: Streamer = {
      id: nextId,
      name: form.name.trim(),
      phone: form.phone.trim(),
      settlement: { ...form.settlement },
      remark: form.remark.trim() || undefined,
    };
    setStreamerList(prev => [...prev, newStreamer]);
    setShowDrawer(false);
  };

  // 删除
  const handleDelete = (streamer: Streamer) => {
    if (window.confirm(`确定要删除带货人「${streamer.name}」吗？此操作不可撤销。`)) {
      setStreamerList(prev => prev.filter(s => s.id !== streamer.id));
    }
  };

  // 获取关联茶人姓名
  const getLinkedTeaName = (s: Streamer) => {
    if (!s.linkedTeaProfessionalId) return '';
    return teaProfessionalMap.get(s.linkedTeaProfessionalId) ?? '';
  };

  return (
    <div>
      <ContentHeader title="带货人管理" breadcrumbs={['人员', '带货人管理']} />

      {/* 统计卡片 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)', marginBottom: 'var(--space-5)' }}>
        {stats.map((s, i) => (
          <StatCard key={i} data={s} />
        ))}
      </div>

      {/* 工具栏 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
        <input
          className="filter-input"
          placeholder="搜索姓名、手机号、关联茶人..."
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          style={{ width: 260 }}
        />
        <Button onClick={handleAdd}>
          <svg viewBox="0 0 16 16" fill="none" style={{ width: 14, height: 14 }}><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          新增带货人
        </Button>
        <span style={{ marginLeft: 'auto', fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>
          共 {filtered.length} 位带货人
        </span>
      </div>

      {/* 列表 */}
      <Card style={{ padding: 0 }}>
        <Table
          headers={['姓名', '手机号码', '户名', '卡号', '开户银行', '开户行号', '关联茶人', '备注', '操作']}
          rows={filtered.map(streamer => [
            <div key="name" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%', background: PRIMARY_LIGHT,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: PRIMARY,
                flexShrink: 0,
              }}>
                {streamer.name.charAt(0)}
              </div>
              <span style={{ fontWeight: 'var(--font-medium)' }}>{streamer.name}</span>
            </div>,
            <span key="phone" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{streamer.phone}</span>,
            <span key="accName" style={{ fontSize: 'var(--text-sm)' }}>{streamer.settlement.accountName || '-'}</span>,
            <span key="accNo" className="mono" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{streamer.settlement.accountNo || '-'}</span>,
            <span key="bankName" style={{ fontSize: 'var(--text-sm)' }}>{streamer.settlement.bankName || '-'}</span>,
            <span key="bankNo" className="mono" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{streamer.settlement.bankNo || '-'}</span>,
            (() => {
              const linkedName = getLinkedTeaName(streamer);
              return linkedName ? (
                <span key="linked" style={{
                  padding: '2px 8px', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-medium)',
                  background: `${PRIMARY}15`, color: PRIMARY, border: `1px solid ${PRIMARY}30`,
                }}>
                  {linkedName}
                </span>
              ) : (
                <span key="linked" style={{
                  padding: '2px 8px', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-medium)',
                  background: `${SECONDARY}40`, color: '#8A7530', border: `1px solid ${SECONDARY}`,
                }}>
                  独立带货人
                </span>
              );
            })(),
            <span key="remark" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', maxWidth: 180, display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {streamer.remark || '-'}
            </span>,
            <div key="ops" style={{ display: 'flex', gap: 'var(--space-1)' }}>
              <Button size="sm" variant="ghost" onClick={() => handleView(streamer)}>查看</Button>
              <Button size="sm" variant="ghost" onClick={() => handleDelete(streamer)} style={{ color: '#CB405D' }}>删除</Button>
            </div>,
          ])}
        />
      </Card>

      {/* 详情抽屉 */}
      {showDrawer && drawerMode === 'view' && selectedStreamer && (
        <div className="category-dialog-overlay" onClick={() => setShowDrawer(false)}>
          <div className="category-dialog" onClick={e => e.stopPropagation()} style={{ maxWidth: 640, maxHeight: '90vh', overflow: 'auto' }}>
            {/* 头部 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-5)' }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%', background: PRIMARY_LIGHT,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: PRIMARY,
              }}>
                {selectedStreamer.name.charAt(0)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 4 }}>
                  <span style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)' }}>{selectedStreamer.name}</span>
                  {(() => {
                    const linkedName = getLinkedTeaName(selectedStreamer);
                    return linkedName ? (
                      <span style={{
                        padding: '2px 8px', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-medium)',
                        background: `${PRIMARY}15`, color: PRIMARY, border: `1px solid ${PRIMARY}30`,
                      }}>
                        关联茶人：{linkedName}
                      </span>
                    ) : (
                      <span style={{
                        padding: '2px 8px', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-medium)',
                        background: `${SECONDARY}40`, color: '#8A7530', border: `1px solid ${SECONDARY}`,
                      }}>
                        独立带货人
                      </span>
                    );
                  })()}
                </div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>{selectedStreamer.phone}</div>
              </div>
            </div>

            {/* 基本信息 */}
            <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-3)', color: 'var(--color-text-primary)', borderBottom: '1px solid var(--color-border-primary)', paddingBottom: 'var(--space-2)' }}>基本信息</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
              {[
                ['姓名', selectedStreamer.name],
                ['手机号码', selectedStreamer.phone],
                ['关联茶人', getLinkedTeaName(selectedStreamer) || '无（独立带货人）'],
              ].map(([label, value]) => (
                <div key={label} style={{ fontSize: 'var(--text-sm)' }}>
                  <span style={{ color: 'var(--color-text-tertiary)' }}>{label}：</span>
                  <span style={{ color: 'var(--color-text-primary)', fontWeight: 'var(--font-medium)' }}>{value}</span>
                </div>
              ))}
            </div>

            {/* 结算信息 */}
            <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-3)', color: 'var(--color-text-primary)', borderBottom: '1px solid var(--color-border-primary)', paddingBottom: 'var(--space-2)' }}>结算信息</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
              {[
                ['户名', selectedStreamer.settlement.accountName || '-'],
                ['卡号', selectedStreamer.settlement.accountNo || '-'],
                ['开户银行', selectedStreamer.settlement.bankName || '-'],
                ['开户行号', selectedStreamer.settlement.bankNo || '-'],
              ].map(([label, value]) => (
                <div key={label} style={{ fontSize: 'var(--text-sm)' }}>
                  <span style={{ color: 'var(--color-text-tertiary)' }}>{label}：</span>
                  <span style={{ color: 'var(--color-text-primary)', fontWeight: 'var(--font-medium)', wordBreak: 'break-all' }}>{value}</span>
                </div>
              ))}
            </div>

            {/* 备注 */}
            <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-3)', color: 'var(--color-text-primary)', borderBottom: '1px solid var(--color-border-primary)', paddingBottom: 'var(--space-2)' }}>备注</h4>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)', lineHeight: 1.6 }}>
              {selectedStreamer.remark || <span style={{ color: 'var(--color-text-tertiary)' }}>-</span>}
            </div>

            {/* 关闭按钮 */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-3)' }}>
              <Button variant="ghost" onClick={() => setShowDrawer(false)}>关闭</Button>
            </div>
          </div>
        </div>
      )}

      {/* 新增抽屉 */}
      {showDrawer && drawerMode === 'add' && (
        <div className="category-dialog-overlay" onClick={() => setShowDrawer(false)}>
          <div className="category-dialog" onClick={e => e.stopPropagation()} style={{ maxWidth: 600, maxHeight: '90vh', overflow: 'auto' }}>
            <h3 style={{ marginBottom: 'var(--space-4)' }}>新增带货人</h3>
            <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>请填写带货人基本信息与结算账户，保存后可在详情中查看。</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-3)' }}>
              {/* 基本信息 */}
              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', marginBottom: 4, color: 'var(--color-text-secondary)' }}>姓名 *</label>
                <input className="filter-input" placeholder="请输入姓名" style={{ width: '100%' }} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', marginBottom: 4, color: 'var(--color-text-secondary)' }}>手机号码 *</label>
                <input className="filter-input" placeholder="请输入手机号码" style={{ width: '100%' }} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              </div>

              {/* 结算信息 */}
              <div style={{ gridColumn: '1 / -1', marginTop: 'var(--space-2)' }}>
                <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', marginBottom: 4, color: 'var(--color-text-primary)' }}>结算信息</label>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', marginBottom: 4, color: 'var(--color-text-secondary)' }}>户名</label>
                <input className="filter-input" placeholder="请输入户名" style={{ width: '100%' }} value={form.settlement.accountName} onChange={e => setForm({ ...form, settlement: { ...form.settlement, accountName: e.target.value } })} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', marginBottom: 4, color: 'var(--color-text-secondary)' }}>卡号</label>
                <input className="filter-input" placeholder="请输入卡号" style={{ width: '100%' }} value={form.settlement.accountNo} onChange={e => setForm({ ...form, settlement: { ...form.settlement, accountNo: e.target.value } })} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', marginBottom: 4, color: 'var(--color-text-secondary)' }}>开户银行</label>
                <input className="filter-input" placeholder="如：中国工商银行杭州分行" style={{ width: '100%' }} value={form.settlement.bankName} onChange={e => setForm({ ...form, settlement: { ...form.settlement, bankName: e.target.value } })} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', marginBottom: 4, color: 'var(--color-text-secondary)' }}>开户行号</label>
                <input className="filter-input" placeholder="如：102331000234" style={{ width: '100%' }} value={form.settlement.bankNo} onChange={e => setForm({ ...form, settlement: { ...form.settlement, bankNo: e.target.value } })} />
              </div>

              {/* 备注 */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', marginBottom: 4, color: 'var(--color-text-secondary)' }}>备注</label>
                <textarea className="filter-input" placeholder="请输入备注" style={{ width: '100%', minHeight: 72, resize: 'vertical' }} value={form.remark} onChange={e => setForm({ ...form, remark: e.target.value })} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)', marginTop: 'var(--space-4)' }}>
              <Button variant="ghost" onClick={() => setShowDrawer(false)}>取消</Button>
              <Button onClick={handleSave} disabled={!form.name.trim() || !form.phone.trim()}>保存</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── 统计卡片图标 ── */

function IconStreamer() {
  return (
    <svg viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="6" r="3" stroke="currentColor" strokeWidth="1.3" />
      <path d="M3 15c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M14 3l1.5 1.5L14 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconLinked() {
  return (
    <svg viewBox="0 0 18 18" fill="none">
      <path d="M7 11l4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M5 9a3 3 0 010-4l1-1a3 3 0 014 0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M13 9a3 3 0 010 4l-1 1a3 3 0 01-4 0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function IconIndependent() {
  return (
    <svg viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="6" r="3" stroke="currentColor" strokeWidth="1.3" />
      <path d="M3 15c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}
