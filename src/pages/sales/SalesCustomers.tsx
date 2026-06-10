import { useState, useMemo } from 'react';
import ContentHeader from '../../components/layout/ContentHeader';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Tag from '../../components/common/Tag';
import type { StatCardData } from '../../types';

/* ── 客户分类 ── */
type CustomerType = 'direct' | 'indirect' | 'channel' | 'referral';

interface CustomerItem {
  id: string;
  name: string;
  type: CustomerType;
  typeName: string;
  region: string;
  contactPerson: string;
  contactPhone: string;
  orders: number;
  totalAmount: number;
  platform?: string; // 间营客户的平台商
  level: string; // 客户等级
  status: 'active' | 'inactive';
  cooperationDate: string;
  remark?: string;
}

/* ── 客户分类说明 ── */
const CUSTOMER_TYPE_INFO: Record<CustomerType, { label: string; desc: string; color: string }> = {
  direct: { label: '直营客户', desc: '客情自有，直接发货', color: 'var(--color-module-current-base)' },
  indirect: { label: '间营客户', desc: '客情自有，通过平台商间接发货', color: '#0DAFC6' },
  channel: { label: '渠道客户', desc: '客情非自有，进行二次售卖', color: '#F18F4D' },
  referral: { label: '带货客户', desc: '客情非自有，参与分润，公司直接发货', color: '#CB405D' },
};

/* ── 模拟客户数据 ── */
const customerItems: CustomerItem[] = [
  // 直营客户
  { id: '1', name: '华茗堂茶庄', type: 'direct', typeName: '直营客户', region: '北京', contactPerson: '张明华', contactPhone: '010-8234****', orders: 32, totalAmount: 386000, level: 'A级', status: 'active', cooperationDate: '2023-02-15', remark: '长期合作，月均采购稳定' },
  { id: '2', name: '清心茶坊', type: 'direct', typeName: '直营客户', region: '杭州', contactPerson: '李雅芳', contactPhone: '0571-8612****', orders: 45, totalAmount: 512400, level: 'S级', status: 'active', cooperationDate: '2022-08-10', remark: '核心客户，高端茶品需求大' },
  { id: '3', name: '品茗轩', type: 'direct', typeName: '直营客户', region: '广州', contactPerson: '陈志远', contactPhone: '020-8356****', orders: 19, totalAmount: 168600, level: 'B级', status: 'active', cooperationDate: '2024-01-20' },
  { id: '4', name: '翠竹茶行', type: 'direct', typeName: '直营客户', region: '成都', contactPerson: '王建国', contactPhone: '028-8523****', orders: 24, totalAmount: 198200, level: 'A级', status: 'active', cooperationDate: '2023-06-05' },
  { id: '5', name: '云顶茶舍', type: 'direct', typeName: '直营客户', region: '昆明', contactPerson: '刘晓东', contactPhone: '0871-6543****', orders: 12, totalAmount: 89600, level: 'B级', status: 'active', cooperationDate: '2024-03-18' },
  // 间营客户
  { id: '6', name: '浦发银行', type: 'indirect', typeName: '间营客户', region: '上海', contactPerson: '赵经理', contactPhone: '021-6123****', orders: 18, totalAmount: 425000, platform: '京东慧采', level: 'S级', status: 'active', cooperationDate: '2023-04-22', remark: '企业福利采购，年节大宗订单' },
  { id: '7', name: '交通银行', type: 'indirect', typeName: '间营客户', region: '上海', contactPerson: '孙主管', contactPhone: '021-5876****', orders: 15, totalAmount: 368000, platform: '史泰博', level: 'A级', status: 'active', cooperationDate: '2023-09-10' },
  { id: '8', name: '中信证券', type: 'indirect', typeName: '间营客户', region: '深圳', contactPerson: '周总监', contactPhone: '0755-8234****', orders: 22, totalAmount: 536000, platform: '得力', level: 'S级', status: 'active', cooperationDate: '2022-12-01', remark: 'VIP客户礼品定制' },
  { id: '9', name: '中国平安', type: 'indirect', typeName: '间营客户', region: '深圳', contactPerson: '吴经理', contactPhone: '0755-2233****', orders: 10, totalAmount: 285000, platform: '京东慧采', level: 'A级', status: 'active', cooperationDate: '2024-02-28' },
  { id: '10', name: '招商银行', type: 'indirect', typeName: '间营客户', region: '深圳', contactPerson: '钱主管', contactPhone: '0755-8866****', orders: 8, totalAmount: 196000, platform: '史泰博', level: 'B级', status: 'active', cooperationDate: '2024-05-15' },
  // 渠道客户
  { id: '11', name: '天福茗茶（渠道）', type: 'channel', typeName: '渠道客户', region: '福州', contactPerson: '林经理', contactPhone: '0591-8765****', orders: 56, totalAmount: 826000, level: 'S级', status: 'active', cooperationDate: '2022-03-10', remark: '华东区核心渠道商' },
  { id: '12', name: '八马茶业（渠道）', type: 'channel', typeName: '渠道客户', region: '厦门', contactPerson: '王总', contactPhone: '0592-5432****', orders: 42, totalAmount: 645000, level: 'A级', status: 'active', cooperationDate: '2023-01-18' },
  { id: '13', name: '大益茶体验馆', type: 'channel', typeName: '渠道客户', region: '广州', contactPerson: '陈经理', contactPhone: '020-3876****', orders: 35, totalAmount: 498000, level: 'A级', status: 'active', cooperationDate: '2023-05-22' },
  { id: '14', name: '茶里王国', type: 'channel', typeName: '渠道客户', region: '长沙', contactPerson: '杨总', contactPhone: '0731-8567****', orders: 28, totalAmount: 312000, level: 'B级', status: 'active', cooperationDate: '2023-11-05' },
  { id: '15', name: '正山堂旗舰店', type: 'channel', typeName: '渠道客户', region: '武夷山', contactPerson: '江经理', contactPhone: '0599-5123****', orders: 20, totalAmount: 268000, level: 'B级', status: 'inactive', cooperationDate: '2024-01-08' },
  // 带货客户
  { id: '16', name: '茶道达人小李', type: 'referral', typeName: '带货客户', region: '杭州', contactPerson: '李明', contactPhone: '138****5678', orders: 68, totalAmount: 456000, level: 'A级', status: 'active', cooperationDate: '2023-07-20', remark: '抖音茶类KOL，粉丝50万+' },
  { id: '17', name: '茗香阁直播', type: 'referral', typeName: '带货客户', region: '上海', contactPerson: '周芳', contactPhone: '159****3456', orders: 45, totalAmount: 328000, level: 'A级', status: 'active', cooperationDate: '2023-10-12', remark: '小红书+微信私域' },
  { id: '18', name: '茶文化传播公司', type: 'referral', typeName: '带货客户', region: '北京', contactPerson: '刘总', contactPhone: '010-6789****', orders: 32, totalAmount: 285000, level: 'B级', status: 'active', cooperationDate: '2024-02-05', remark: '企业客户资源丰富' },
  { id: '19', name: '茶艺师王姐', type: 'referral', typeName: '带货客户', region: '苏州', contactPerson: '王秀英', contactPhone: '136****7890', orders: 25, totalAmount: 178000, level: 'B级', status: 'active', cooperationDate: '2024-04-18' },
  { id: '20', name: '品茶汇社群', type: 'referral', typeName: '带货客户', region: '深圳', contactPerson: '张磊', contactPhone: '185****2345', orders: 18, totalAmount: 126000, level: 'C级', status: 'active', cooperationDate: '2024-06-01' },
];

export default function SalesCustomers() {
  const [activeType, setActiveType] = useState<CustomerType | 'all'>('all');
  const [keyword, setKeyword] = useState('');
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedForDelete, setSelectedForDelete] = useState<Set<string>>(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // 筛选
  const filtered = useMemo(() => {
    return customerItems.filter(c => {
      if (activeType !== 'all' && c.type !== activeType) return false;
      if (keyword && !c.name.includes(keyword) && !c.contactPerson.includes(keyword) && !c.region.includes(keyword)) return false;
      return true;
    });
  }, [activeType, keyword]);

  // 统计
  const stats: StatCardData[] = useMemo(() => {
    const byType = (t: CustomerType) => customerItems.filter(c => c.type === t);
    return [
      {
        label: '直营客户', value: String(byType('direct').length), unit: '家',
        trend: { direction: 'up', value: `累计 ¥${(byType('direct').reduce((s, c) => s + c.totalAmount, 0) / 10000).toFixed(1)}万` },
        icon: <svg viewBox="0 0 18 18" fill="none"><path d="M9 2L3 5v8l6 3 6-3V5L9 2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>,
      },
      {
        label: '间营客户', value: String(byType('indirect').length), unit: '家',
        trend: { direction: 'up', value: `累计 ¥${(byType('indirect').reduce((s, c) => s + c.totalAmount, 0) / 10000).toFixed(1)}万` },
        icon: <svg viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.3"/><path d="M9 6v3l2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
      },
      {
        label: '渠道客户', value: String(byType('channel').length), unit: '家',
        trend: { direction: 'up', value: `累计 ¥${(byType('channel').reduce((s, c) => s + c.totalAmount, 0) / 10000).toFixed(1)}万` },
        icon: <svg viewBox="0 0 18 18" fill="none"><path d="M3 9h12M9 3v12M3 3l12 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
      },
      {
        label: '带货客户', value: String(byType('referral').length), unit: '家',
        trend: { direction: 'up', value: `累计 ¥${(byType('referral').reduce((s, c) => s + c.totalAmount, 0) / 10000).toFixed(1)}万` },
        icon: <svg viewBox="0 0 18 18" fill="none"><path d="M3 14l3-4 3 2 3-5 3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
      },
    ];
  }, []);

  // 分类标签样式
  const typeTagStyle = (type: CustomerType): React.CSSProperties => ({
    padding: '2px 8px',
    borderRadius: 'var(--radius-md)',
    fontSize: 'var(--text-xs)',
    fontWeight: 'var(--font-medium)',
    background: type === 'direct' ? 'var(--color-module-current-lightest)' :
                type === 'indirect' ? 'rgba(13,175,198,0.1)' :
                type === 'channel' ? 'rgba(241,143,77,0.1)' :
                'rgba(203,64,93,0.1)',
    color: CUSTOMER_TYPE_INFO[type].color,
    border: `1px solid ${CUSTOMER_TYPE_INFO[type].color}`,
  });

  // 等级标签
  const levelStyle = (level: string): React.CSSProperties => {
    const colors: Record<string, { bg: string; color: string }> = {
      'S级': { bg: 'rgba(203,64,93,0.1)', color: '#CB405D' },
      'A级': { bg: 'var(--color-module-current-lightest)', color: 'var(--color-module-current-base)' },
      'B级': { bg: 'rgba(13,175,198,0.1)', color: '#0DAFC6' },
      'C级': { bg: 'var(--color-neutral-100)', color: 'var(--color-neutral-500)' },
    };
    const c = colors[level] || colors['C级'];
    return { padding: '2px 8px', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-medium)', background: c.bg, color: c.color };
  };

  // 删除模式
  const handleEnterDeleteMode = () => { setDeleteMode(true); setSelectedForDelete(new Set()); };
  const handleCancelDeleteMode = () => { setDeleteMode(false); setSelectedForDelete(new Set()); };
  const handleToggleSelect = (id: string) => {
    setSelectedForDelete(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };
  const handleConfirmDelete = () => { handleCancelDeleteMode(); };

  return (
    <>
      <ContentHeader title="客户管理" breadcrumbs={['销售', '客户管理']} />
      <div className="content-body">
        {/* 统计卡片 */}
        <div className="stat-cards">
          {stats.map((s, i) => <StatCard key={i} data={s} />)}
        </div>

        {/* 客户分类说明 */}
        <Card style={{ marginBottom: 'var(--space-4)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)' }}>
            {(Object.entries(CUSTOMER_TYPE_INFO) as [CustomerType, typeof CUSTOMER_TYPE_INFO[CustomerType]][]).map(([key, info]) => (
              <div key={key} style={{
                padding: 'var(--space-4)',
                borderRadius: 'var(--radius-lg)',
                border: `1px solid ${activeType === key ? info.color : 'var(--color-neutral-200)'}`,
                background: activeType === key ? `${info.color}08` : 'var(--color-neutral-0)',
                cursor: 'pointer',
                transition: 'var(--transition-fast)',
              }} onClick={() => setActiveType(activeType === key ? 'all' : key)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: info.color, display: 'inline-block' }} />
                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: info.color }}>{info.label}</span>
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-500)', lineHeight: 1.5 }}>{info.desc}</div>
                {key === 'indirect' && (
                  <div style={{ marginTop: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--color-neutral-400)' }}>
                    平台商：京东慧采、史泰博、得力等
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* 筛选 + 操作栏 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
          <input className="filter-input" placeholder="搜索客户名称、联系人、地区..." value={keyword} onChange={(e) => setKeyword(e.target.value)} />
          <select className="filter-select" value={activeType} onChange={(e) => setActiveType(e.target.value as CustomerType | 'all')}>
            <option value="all">全部类型</option>
            <option value="direct">直营客户</option>
            <option value="indirect">间营客户</option>
            <option value="channel">渠道客户</option>
            <option value="referral">带货客户</option>
          </select>
          <Button onClick={() => { /* 新增客户 */ }}>
            <svg viewBox="0 0 16 16" fill="none" style={{ width: 14, height: 14 }}>
              <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            新增
          </Button>
          {deleteMode ? (
            <>
              <Button onClick={() => setShowDeleteConfirm(true)} disabled={selectedForDelete.size === 0} style={{ background: '#FD742D', borderColor: '#FD742D' }}>
                <svg viewBox="0 0 16 16" fill="none" style={{ width: 14, height: 14 }}>
                  <path d="M2 4h12M5.33 4V2.67a1.33 1.33 0 011.34-1.34h2.66a1.33 1.33 0 011.34 1.34V4m2 0v9.33a1.33 1.33 0 01-1.34 1.34H4.67a1.33 1.33 0 01-1.34-1.34V4h9.34z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                删除所选({selectedForDelete.size})
              </Button>
              <Button variant="ghost" onClick={handleCancelDeleteMode} style={{ color: 'var(--color-neutral-500)' }}>取消</Button>
            </>
          ) : (
            <Button style={{ background: '#FD742D', borderColor: '#FD742D' }} onClick={handleEnterDeleteMode}>
              <svg viewBox="0 0 16 16" fill="none" style={{ width: 14, height: 14 }}>
                <path d="M2 4h12M5.33 4V2.67a1.33 1.33 0 011.34-1.34h2.66a1.33 1.33 0 011.34 1.34V4m2 0v9.33a1.33 1.33 0 01-1.34 1.34H4.67a1.33 1.33 0 01-1.34-1.34V4h9.34z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              删除
            </Button>
          )}
          <span style={{ marginLeft: 'auto', fontSize: 'var(--text-xs)', color: 'var(--color-neutral-400)', flexShrink: 0 }}>共 {filtered.length} 个客户</span>
        </div>

        {/* 客户列表 */}
        <Card>
          <Table
            headers={[deleteMode ? '选择' : '序号', '客户名称', '客户类型', '地区', '联系人', '联系电话', '平台商', '等级', '订单数', '累计金额', '状态']}
            rows={filtered.map((c, idx) => [
              deleteMode
                ? <input type="checkbox" checked={selectedForDelete.has(c.id)} onChange={() => handleToggleSelect(c.id)} />
                : <span className="mono">{idx + 1}</span>,
              <span style={{ fontWeight: 'var(--font-medium)' }}>{c.name}</span>,
              <span style={typeTagStyle(c.type)}>{c.typeName}</span>,
              <span>{c.region}</span>,
              <span>{c.contactPerson}</span>,
              <span className="mono">{c.contactPhone}</span>,
              c.platform
                ? <span style={{ fontSize: 'var(--text-xs)', color: '#0DAFC6', fontWeight: 'var(--font-medium)' }}>{c.platform}</span>
                : <span style={{ color: 'var(--color-neutral-300)' }}>-</span>,
              <span style={levelStyle(c.level)}>{c.level}</span>,
              <span className="mono">{c.orders}</span>,
              <span className="mono" style={{ fontWeight: 'var(--font-medium)' }}>¥{(c.totalAmount / 10000).toFixed(1)}万</span>,
              <span style={{
                padding: '2px 8px', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-medium)',
                background: c.status === 'active' ? 'var(--color-success-50)' : 'var(--color-neutral-100)',
                color: c.status === 'active' ? 'var(--color-success-600)' : 'var(--color-neutral-500)',
              }}>{c.status === 'active' ? '合作中' : '已暂停'}</span>,
            ])}
          />
        </Card>
      </div>

      {/* 删除确认弹窗 */}
      {showDeleteConfirm && (
        <div className="category-dialog-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="category-dialog" onClick={(e) => e.stopPropagation()} style={{ width: 400 }}>
            <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)', color: 'var(--color-neutral-800)', marginBottom: 'var(--space-3)' }}>确认删除</div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-neutral-600)', marginBottom: 'var(--space-5)' }}>
              确定要删除选中的 {selectedForDelete.size} 个客户吗？此操作不可撤销。
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
              <Button variant="ghost" onClick={() => setShowDeleteConfirm(false)}>取消</Button>
              <Button onClick={() => { handleConfirmDelete(); setShowDeleteConfirm(false); }} style={{ background: '#FD742D', borderColor: '#FD742D' }}>确认删除</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
