import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ContentHeader from '../../components/layout/ContentHeader';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Tag from '../../components/common/Tag';
import FilterBar from '../../components/business/FilterBar';
import type { StatCardData, BrandItem } from '../../types';
import { TeaCategory } from '../../types';
import { brandItems } from '../../data/brands';

/** 通过茶类中文名称获取 TeaCategory 枚举 */
function nameToTeaCategory(name: string): TeaCategory | undefined {
  const map: Record<string, TeaCategory> = {
    '绿茶': TeaCategory.GREEN, '红茶': TeaCategory.RED, '青茶': TeaCategory.OOLONG,
    '白茶': TeaCategory.WHITE, '黄茶': TeaCategory.YELLOW, '黑茶': TeaCategory.DARK,
    '花草茶': TeaCategory.FLOWER,
  };
  return map[name];
}

const SECOND_LEVEL_CATEGORIES = [
  '绿茶', '红茶', '青茶', '白茶', '黄茶', '黑茶', '花草茶',
  '茶壶', '茶杯', '茶盘茶台', '茶道配件',
  '茶食品', '礼盒套装', '茶叶罐/包装',
  '泡茶水', '茶书茶画', '茶香/香道',
];

const stats: StatCardData[] = [];

/* ── 品牌排名数据 ── */
type RankPeriod = 'month' | 'year' | 'oneYear';

const rankData: Record<RankPeriod, {
  salesAmount: { name: string; value: number }[];
  profitTotal: { name: string; value: number }[];
  salesQuantity: { name: string; value: number }[];
}> = {
  month: {
    salesAmount: [
      { name: '大益', value: 286000 },
      { name: '八马', value: 235000 },
      { name: '中茶', value: 198000 },
      { name: '天福茗茶', value: 172000 },
      { name: '正山堂', value: 156000 },
    ],
    profitTotal: [
      { name: '大益', value: 85600 },
      { name: '八马', value: 72800 },
      { name: '正山堂', value: 62400 },
      { name: '中茶', value: 55200 },
      { name: '品品香', value: 48600 },
    ],
    salesQuantity: [
      { name: '八马', value: 1280 },
      { name: '大益', value: 1150 },
      { name: '天福茗茶', value: 980 },
      { name: '中茶', value: 860 },
      { name: '张一元', value: 720 },
    ],
  },
  year: {
    salesAmount: [
      { name: '大益', value: 3280000 },
      { name: '八马', value: 2760000 },
      { name: '中茶', value: 2350000 },
      { name: '天福茗茶', value: 1980000 },
      { name: '西湖牌', value: 1860000 },
    ],
    profitTotal: [
      { name: '大益', value: 985000 },
      { name: '八马', value: 862000 },
      { name: '中茶', value: 728000 },
      { name: '正山堂', value: 656000 },
      { name: '品品香', value: 580000 },
    ],
    salesQuantity: [
      { name: '八马', value: 15200 },
      { name: '大益', value: 13800 },
      { name: '天福茗茶', value: 11600 },
      { name: '中茶', value: 10200 },
      { name: '张一元', value: 8600 },
    ],
  },
  oneYear: {
    salesAmount: [
      { name: '大益', value: 3050000 },
      { name: '八马', value: 2560000 },
      { name: '中茶', value: 2150000 },
      { name: '天福茗茶', value: 1820000 },
      { name: '西湖牌', value: 1720000 },
    ],
    profitTotal: [
      { name: '大益', value: 920000 },
      { name: '八马', value: 798000 },
      { name: '中茶', value: 695000 },
      { name: '正山堂', value: 605000 },
      { name: '品品香', value: 530000 },
    ],
    salesQuantity: [
      { name: '八马', value: 14200 },
      { name: '大益', value: 12900 },
      { name: '天福茗茶', value: 10900 },
      { name: '中茶', value: 9600 },
      { name: '张一元', value: 8100 },
    ],
  },
};

const barColors = ['#CB405D', '#F18F4D', '#0DAFC6', '#27254B', '#5F4027'];

function formatAmount(v: number) {
  if (v >= 10000) return `¥${(v / 10000).toFixed(1)}万`;
  return `¥${v.toLocaleString()}`;
}

function RankBarChart({ title, data, period, onPeriodChange }: { title: string; data: { name: string; value: number }[]; period: RankPeriod; onPeriodChange: (p: RankPeriod) => void }) {
  const max = Math.max(...data.map((d) => d.value));
  const isQuantity = title.includes('数量');

  function formatValue(v: number) {
    if (isQuantity) return v.toLocaleString();
    if (v >= 10000) return `¥${(v / 10000).toFixed(1)}万`;
    return `¥${v.toLocaleString()}`;
  }

  const periods: { key: RankPeriod; label: string }[] = [
    { key: 'month', label: '当月' },
    { key: 'year', label: '当年' },
    { key: 'oneYear', label: '一年内' },
  ];

  return (
    <Card title={title} className="rank-chart-card" headerRight={
      <div className="rank-period-toggle">
        {periods.map((p) => (
          <button key={p.key} className={`rank-period-btn${period === p.key ? ' active' : ''}`} onClick={() => onPeriodChange(p.key)}>{p.label}</button>
        ))}
      </div>
    }>
      <div className="rank-chart">
        {data.map((item, i) => (
          <div key={item.name} className="rank-chart-row">
            <span className="rank-chart-rank">{i + 1}</span>
            <span className="rank-chart-name">{item.name}</span>
            <div className="rank-chart-bar-wrap">
              <div className="rank-chart-bar" style={{ width: `${(item.value / max) * 100}%`, background: barColors[i] }} />
            </div>
            <span className="rank-chart-value">{formatValue(item.value)}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

/** 新增品牌表单初始值 */
const emptyForm = {
  name: '', owner: '', introduction: '', requirements: '', policy: '',
  mainCategories: [] as string[], series: [] as string[],
  jdStoreUrl: '', tmallStoreUrl: '', website: '',
  contactPerson: '', contactPhone: '', address: '',
};

export default function ProductBrand() {
  const navigate = useNavigate();
  const [filterKeyword, setFilterKeyword] = useState('');
  const [filterCategory, setFilterCategory] = useState('主营品类');
  const [salesAmountPeriod, setSalesAmountPeriod] = useState<RankPeriod>('month');
  const [profitTotalPeriod, setProfitTotalPeriod] = useState<RankPeriod>('month');
  const [salesQuantityPeriod, setSalesQuantityPeriod] = useState<RankPeriod>('month');
  const [showDrawer, setShowDrawer] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });
  const [newSeries, setNewSeries] = useState('');
  const [showSeriesInput, setShowSeriesInput] = useState(false);

  const filteredItems = brandItems.filter((b) => {
    if (filterKeyword && !b.name.includes(filterKeyword) && !b.code.toLowerCase().includes(filterKeyword.toLowerCase()) && !b.owner.includes(filterKeyword)) return false;
    if (filterCategory !== '主营品类' && !b.mainCategories.includes(filterCategory)) return false;
    return true;
  });

  const handleRowClick = (id: string) => {
    navigate(`/product/product-brand/${id}`);
  };

  const handleOpenDrawer = () => {
    setForm({ ...emptyForm });
    setNewSeries('');
    setShowSeriesInput(false);
    setShowDrawer(true);
  };

  const handleCloseDrawer = () => {
    setShowDrawer(false);
  };

  const handleToggleCategory = (cat: string) => {
    setForm((prev) => ({
      ...prev,
      mainCategories: prev.mainCategories.includes(cat)
        ? prev.mainCategories.filter((c) => c !== cat)
        : [...prev.mainCategories, cat],
    }));
  };

  const handleAddSeries = () => {
    if (newSeries.trim()) {
      setForm((prev) => ({ ...prev, series: [...prev.series, newSeries.trim()] }));
      setNewSeries('');
      setShowSeriesInput(false);
    }
  };

  const handleRemoveSeries = (idx: number) => {
    setForm((prev) => ({ ...prev, series: prev.series.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = () => {
    // 模拟提交
    setShowDrawer(false);
  };

  /** 生成下一个品牌编号 */
  const nextCode = String(brandItems.length + 1).padStart(3, '0');

  return (
    <>
      <ContentHeader title="品牌管理" breadcrumbs={['商品', '品牌管理']} />
      <div className="content-body">
        {/* 品牌排名 */}
        <div className="rank-section">
          <div className="rank-charts-grid">
            <RankBarChart title="销售金额 TOP5" data={rankData[salesAmountPeriod].salesAmount} period={salesAmountPeriod} onPeriodChange={setSalesAmountPeriod} />
            <RankBarChart title="利润总额 TOP5" data={rankData[profitTotalPeriod].profitTotal} period={profitTotalPeriod} onPeriodChange={setProfitTotalPeriod} />
            <RankBarChart title="销售数量 TOP5" data={rankData[salesQuantityPeriod].salesQuantity} period={salesQuantityPeriod} onPeriodChange={setSalesQuantityPeriod} />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
          <FilterBar>
            <input className="filter-input" placeholder="搜索品牌名称、编码、所属公司..." value={filterKeyword} onChange={(e) => setFilterKeyword(e.target.value)} />
            <select className="filter-select" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
              <option>主营品类</option>
              {SECOND_LEVEL_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </FilterBar>
          <Button onClick={handleOpenDrawer}><PlusIcon />新增品牌</Button>
        </div>
        <Card>
          <Table
            headers={['序号', '品牌LOGO', '品牌名称', '品牌编号', '品牌所属', '主营品类', '商品数量', '联系人', '联系电话', '操作']}
            rows={filteredItems.map((b, idx) => [
              <span className="mono">{idx + 1}</span>,
              <div className="brand-logo-cell" onClick={() => handleRowClick(b.id)} style={{ cursor: 'pointer' }}>
                {b.logo ? <img src={b.logo} alt={b.name} className="brand-logo-img" /> : <div className="brand-logo-placeholder">{b.name[0]}</div>}
              </div>,
              <span style={{ fontWeight: 'var(--font-medium)', cursor: 'pointer', color: 'var(--color-module-current-base)' }} onClick={() => handleRowClick(b.id)}>{b.name}</span>,
              <span className="mono">{b.code}</span>,
              <span style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block' }} title={b.owner}>{b.owner}</span>,
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {b.mainCategories.map((c) => {
                  const cat = nameToTeaCategory(c);
                  return cat ? <Tag key={c} category={cat} /> : <span key={c} className="brand-series-tag">{c}</span>;
                })}
              </div>,
              <span className="mono">{b.productCount}</span>,
              <span>{b.contactPerson}</span>,
              <span className="mono">{b.contactPhone}</span>,
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <Button variant="ghost" size="sm" onClick={() => handleRowClick(b.id)} style={{ color: '#01795D' }}>详情</Button>
                <Button variant="ghost" size="sm" style={{ color: '#FD742D' }}>删除</Button>
              </div>,
            ])}
          />
        </Card>
      </div>

      {/* 右侧滑出抽屉 - 新增品牌 */}
      {showDrawer && (
        <div className="drawer-overlay" onClick={handleCloseDrawer}>
          <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <span className="drawer-title">新增品牌</span>
              <button className="drawer-close" onClick={handleCloseDrawer}>
                <svg viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </button>
            </div>
            <div className="drawer-body">
              {/* LOGO 上传 */}
              <div style={{ marginBottom: 'var(--space-5)' }}>
                <label className="drawer-label">品牌LOGO</label>
                <div style={{ width: 75, height: 75, border: '2px dashed var(--color-neutral-300)', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--color-neutral-400)', fontSize: 'var(--text-xs)', gap: '2px', transition: 'var(--transition-fast)' }}>
                  <svg viewBox="0 0 20 20" fill="none" style={{ width: 20, height: 20 }}><path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  上传LOGO
                  <input type="file" accept="image/jpeg,image/png,image/gif,image/webp" style={{ display: 'none' }} />
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-400)', marginTop: '4px' }}>正方形，最大500×500像素</div>
              </div>

              {/* 基本信息 */}
              <div className="drawer-section-title">基本信息</div>
              <div className="drawer-form-row">
                <div className="drawer-form-field">
                  <label className="drawer-label">品牌编号</label>
                  <input className="detail-input" value={nextCode} readOnly style={{ background: 'var(--color-neutral-100)', color: 'var(--color-neutral-500)' }} />
                </div>
                <div className="drawer-form-field">
                  <label className="drawer-label">品牌名称 <span style={{ color: '#FD742D' }}>*</span></label>
                  <input className="detail-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="请输入品牌名称" />
                </div>
              </div>
              <div className="drawer-form-row">
                <div className="drawer-form-field">
                  <label className="drawer-label">品牌所属 <span style={{ color: '#FD742D' }}>*</span></label>
                  <input className="detail-input" value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })} placeholder="请输入所属公司" />
                </div>
                <div className="drawer-form-field">
                  <label className="drawer-label">主营品类</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginTop: '4px' }}>
                    {SECOND_LEVEL_CATEGORIES.map((cat) => (
                      <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', fontSize: 'var(--text-sm)' }}>
                        <input type="checkbox" checked={form.mainCategories.includes(cat)} onChange={() => handleToggleCategory(cat)} />
                        {cat}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="drawer-form-row" style={{ flexDirection: 'column' }}>
                <div className="drawer-form-field" style={{ width: '100%' }}>
                  <label className="drawer-label">品牌介绍</label>
                  <textarea className="detail-textarea" value={form.introduction} onChange={(e) => setForm({ ...form, introduction: e.target.value })} placeholder="请输入品牌介绍" rows={3} />
                </div>
              </div>

              {/* 联系信息 */}
              <div className="drawer-section-title">联系信息</div>
              <div className="drawer-form-row">
                <div className="drawer-form-field">
                  <label className="drawer-label">联系人</label>
                  <input className="detail-input" value={form.contactPerson} onChange={(e) => setForm({ ...form, contactPerson: e.target.value })} placeholder="请输入联系人" />
                </div>
                <div className="drawer-form-field">
                  <label className="drawer-label">联系电话</label>
                  <input className="detail-input" value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} placeholder="请输入联系电话" />
                </div>
              </div>
              <div className="drawer-form-row" style={{ flexDirection: 'column' }}>
                <div className="drawer-form-field" style={{ width: '100%' }}>
                  <label className="drawer-label">地址</label>
                  <input className="detail-input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="请输入地址" />
                </div>
              </div>

              {/* 网络地址 */}
              <div className="drawer-section-title">网络地址</div>
              <div className="drawer-form-row" style={{ flexDirection: 'column' }}>
                <div className="drawer-form-field" style={{ width: '100%' }}>
                  <label className="drawer-label">品牌官网</label>
                  <input className="detail-input" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="https://" />
                </div>
              </div>
              <div className="drawer-form-row">
                <div className="drawer-form-field">
                  <label className="drawer-label">京东店地址</label>
                  <input className="detail-input" value={form.jdStoreUrl} onChange={(e) => setForm({ ...form, jdStoreUrl: e.target.value })} placeholder="https://" />
                </div>
                <div className="drawer-form-field">
                  <label className="drawer-label">天猫店地址</label>
                  <input className="detail-input" value={form.tmallStoreUrl} onChange={(e) => setForm({ ...form, tmallStoreUrl: e.target.value })} placeholder="https://" />
                </div>
              </div>

              {/* 品牌政策与要求 */}
              <div className="drawer-section-title">品牌政策与要求</div>
              <div className="drawer-form-row" style={{ flexDirection: 'column' }}>
                <div className="drawer-form-field" style={{ width: '100%' }}>
                  <label className="drawer-label">品牌要求</label>
                  <textarea className="detail-textarea" value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} placeholder="请输入品牌要求" rows={2} />
                </div>
              </div>
              <div className="drawer-form-row" style={{ flexDirection: 'column' }}>
                <div className="drawer-form-field" style={{ width: '100%' }}>
                  <label className="drawer-label">品牌政策</label>
                  <textarea className="detail-textarea" value={form.policy} onChange={(e) => setForm({ ...form, policy: e.target.value })} placeholder="请输入品牌政策" rows={2} />
                </div>
              </div>
              <div className="drawer-form-row" style={{ flexDirection: 'column' }}>
                <div className="drawer-form-field" style={{ width: '100%' }}>
                  <label className="drawer-label">品牌系列</label>
                  <div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                      {form.series.map((s, i) => (
                        <span key={i} className="brand-series-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          {s}
                          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-neutral-400)', fontSize: 'var(--text-xs)', padding: 0, lineHeight: 1 }} onClick={() => handleRemoveSeries(i)}>✕</button>
                        </span>
                      ))}
                    </div>
                    {showSeriesInput ? (
                      <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                        <input className="detail-input" value={newSeries} onChange={(e) => setNewSeries(e.target.value)} placeholder="输入系列名称" style={{ flex: 1 }} onKeyDown={(e) => { if (e.key === 'Enter') handleAddSeries(); }} />
                        <Button variant="ghost" size="sm" onClick={() => { setShowSeriesInput(false); setNewSeries(''); }} style={{ color: 'var(--color-neutral-400)' }}>取消</Button>
                        <Button size="sm" onClick={handleAddSeries}>确认</Button>
                      </div>
                    ) : (
                      <Button variant="ghost" size="sm" onClick={() => setShowSeriesInput(true)}>+ 添加系列</Button>
                    )}
                  </div>
                </div>
              </div>

              {/* 商标证书 */}
              <div className="drawer-section-title">商标证书</div>
              <div className="drawer-form-row" style={{ flexDirection: 'column' }}>
                <div className="drawer-form-field" style={{ width: '100%' }}>
                  <Button variant="ghost" size="sm">+ 上传文件</Button>
                </div>
              </div>
            </div>
            <div className="drawer-footer">
              <Button variant="ghost" onClick={handleCloseDrawer}>取消</Button>
              <Button onClick={handleSubmit}>确认新增</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function PlusIcon() {
  return <svg viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
}
