import { useState, useMemo } from 'react';
import ContentHeader from '../../components/layout/ContentHeader';
import Card from '../../components/common/Card';
import Tag from '../../components/common/Tag';
import Button from '../../components/common/Button';
import { teaVarieties as initialData, getAllOrigins } from '../../data/teaVarieties';
import { getTeaCategoryLabel } from '../../data/teaCategories';
import { TeaCategory } from '../../types';
import type { TeaVariety } from '../../data/teaVarieties';

const PAGE_SIZE = 16;

/** 空表单 */
const emptyForm: Omit<TeaVariety, 'popularity'> & { popularity: string } = {
  name: '', category: TeaCategory.GREEN, origin: '', originDetail: '',
  introduction: '', characteristics: '', brands: [], popularity: '50',
};

/** 茶种大全页面 */
export default function ProductTeaList() {
  const [teas, setTeas] = useState<TeaVariety[]>(initialData);
  const [selectedCategory, setSelectedCategory] = useState<TeaCategory | null>(null);
  const [selectedOrigin, setSelectedOrigin] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // 抽屉状态
  const [showDrawer, setShowDrawer] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'add' | 'edit'>('add');
  const [form, setForm] = useState({ ...emptyForm });
  const [editIndex, setEditIndex] = useState<number | null>(null);

  // 删除确认
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const origins = useMemo(() => {
    const set = new Set<string>();
    teas.forEach((t) => set.add(t.origin));
    return Array.from(set).sort();
  }, [teas]);

  const filtered = useMemo(() => {
    return teas.filter((t) => {
      if (selectedCategory && t.category !== selectedCategory) return false;
      if (selectedOrigin && t.origin !== selectedOrigin) return false;
      if (searchKeyword) {
        const kw = searchKeyword.toLowerCase();
        if (!t.name.toLowerCase().includes(kw) && !t.origin.includes(kw) && !t.originDetail.includes(kw) && !t.characteristics.includes(kw) && !t.brands.some((b) => b.includes(kw))) return false;
      }
      return true;
    });
  }, [teas, selectedCategory, selectedOrigin, searchKeyword]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, currentPage]);

  const handleCategoryChange = (cat: TeaCategory | null) => { setSelectedCategory(cat); setCurrentPage(1); };
  const handleOriginChange = (origin: string | null) => { setSelectedOrigin(origin); setCurrentPage(1); };
  const handleSearch = (kw: string) => { setSearchKeyword(kw); setCurrentPage(1); };

  // 新增
  const handleOpenAdd = () => {
    setDrawerMode('add');
    setForm({ ...emptyForm });
    setEditIndex(null);
    setShowDrawer(true);
  };

  // 编辑
  const handleOpenEdit = (idx: number) => {
    const tea = filtered[idx];
    const globalIdx = teas.indexOf(tea);
    setDrawerMode('edit');
    setForm({ ...tea, popularity: String(tea.popularity), brands: [...tea.brands] });
    setEditIndex(globalIdx);
    setShowDrawer(true);
  };

  // 保存
  const handleSave = () => {
    if (!form.name.trim()) return;
    const data: TeaVariety = { ...form, popularity: Number(form.popularity) || 50, brands: form.brands.filter(Boolean) };
    if (drawerMode === 'add') {
      const next = [...teas, data].sort((a, b) => b.popularity - a.popularity);
      setTeas(next);
    } else if (editIndex !== null) {
      const next = [...teas];
      next[editIndex] = data;
      next.sort((a, b) => b.popularity - a.popularity);
      setTeas(next);
    }
    setShowDrawer(false);
  };

  // 删除
  const handleDelete = (idx: number) => {
    const tea = filtered[idx];
    const globalIdx = teas.indexOf(tea);
    const next = teas.filter((_, i) => i !== globalIdx);
    setTeas(next);
    setDeleteConfirm(null);
  };

  const filterBtnStyle = (active: boolean) => ({
    padding: '4px 12px',
    borderRadius: 'var(--radius-md)' as const,
    border: `1px solid ${active ? 'var(--color-module-current-base)' : 'var(--color-neutral-200)'}`,
    background: active ? 'var(--color-module-current-lightest)' : 'var(--color-neutral-0)',
    color: active ? 'var(--color-module-current-base)' : 'var(--color-neutral-600)',
    cursor: 'pointer' as const,
    fontSize: 'var(--text-sm)' as const,
    transition: 'var(--transition-fast)' as const,
    whiteSpace: 'nowrap' as const,
  });

  return (
    <>
      <ContentHeader title="茶种大全" breadcrumbs={['商品', '茶类档案', '茶种大全']} />
      <div className="content-body">
        {/* 筛选区 */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-neutral-500)', fontWeight: 'var(--font-medium)', flexShrink: 0 }}>茶类：</span>
              <button style={filterBtnStyle(!selectedCategory)} onClick={() => handleCategoryChange(null)}>全部</button>
              {Object.values(TeaCategory).map((cat) => (
                <button key={cat} style={filterBtnStyle(selectedCategory === cat)} onClick={() => handleCategoryChange(selectedCategory === cat ? null : cat)}>
                  {getTeaCategoryLabel(cat)}
                </button>
              ))}
            </div>
            <Button onClick={handleOpenAdd}>+ 新增茶种</Button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: 'var(--space-3)' }}>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-neutral-500)', fontWeight: 'var(--font-medium)', flexShrink: 0 }}>产地：</span>
            <button style={filterBtnStyle(!selectedOrigin)} onClick={() => handleOriginChange(null)}>全部</button>
            {origins.map((o) => (
              <button key={o} style={filterBtnStyle(selectedOrigin === o)} onClick={() => handleOriginChange(selectedOrigin === o ? null : o)}>
                {o}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <input
              className="filter-input"
              placeholder="搜索茶种名称、产地、特点、品牌..."
              value={searchKeyword}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ maxWidth: 320 }}
            />
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-400)' }}>
              共 {filtered.length} 个茶种，按知名度排序
            </span>
          </div>
        </Card>

        {/* 茶种卡片列表 - 4列 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
          {paged.map((tea, idx) => {
            const globalIdx = (currentPage - 1) * PAGE_SIZE + idx;
            return (
              <Card key={`${tea.category}-${tea.name}-${idx}`}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <span style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', color: 'var(--color-neutral-800)', lineHeight: 1.3 }}>{tea.name}</span>
                    <span style={{ fontSize: 'var(--text-xs)', color: tea.popularity >= 80 ? '#FD742D' : 'var(--color-neutral-400)', fontWeight: 'var(--font-medium)' }}>🔥{tea.popularity}</span>
                  </div>
                  <Tag category={tea.category} />
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-600)', lineHeight: 'var(--leading-relaxed)', marginBottom: 'var(--space-3)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {tea.introduction}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-1)', marginBottom: 'var(--space-3)' }}>
                  <div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-400)', marginBottom: '1px' }}>产地</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-700)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={`${tea.origin}·${tea.originDetail}`}>{tea.origin}·{tea.originDetail}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-400)', marginBottom: '1px' }}>特点</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-700)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={tea.characteristics}>{tea.characteristics}</div>
                  </div>
                </div>
                <div style={{ borderTop: '1px solid var(--color-neutral-100)', paddingTop: 'var(--space-2)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-400)', marginBottom: 'var(--space-1)' }}>代表品牌</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {tea.brands.map((brand) => (
                        <span key={brand} style={{ padding: '1px 8px', borderRadius: 'var(--radius-full)', background: 'var(--color-neutral-100)', color: 'var(--color-neutral-600)', fontSize: 'var(--text-xs)', whiteSpace: 'nowrap' }}>
                          {brand}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '4px', flexShrink: 0, marginLeft: 'var(--space-2)' }}>
                    <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(globalIdx)} style={{ color: '#01795D', padding: '2px 6px', fontSize: 'var(--text-xs)' }}>编辑</Button>
                    <Button variant="ghost" size="sm" onClick={() => setDeleteConfirm(globalIdx)} style={{ color: '#FD742D', padding: '2px 6px', fontSize: 'var(--text-xs)' }}>删除</Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* 空状态 */}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 'var(--space-10)', color: 'var(--color-neutral-400)', fontSize: 'var(--text-sm)' }}>
            暂无匹配的茶种
          </div>
        )}

        {/* 分页 */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 'var(--space-2)', marginTop: 'var(--space-5)', paddingBottom: 'var(--space-4)' }}>
            <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)} style={{ padding: '6px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-neutral-200)', background: 'var(--color-neutral-0)', color: currentPage === 1 ? 'var(--color-neutral-300)' : 'var(--color-neutral-600)', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontSize: 'var(--text-sm)' }}>上一页</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button key={page} onClick={() => setCurrentPage(page)} style={{ width: 32, height: 32, borderRadius: 'var(--radius-md)', border: `1px solid ${currentPage === page ? 'var(--color-module-current-base)' : 'var(--color-neutral-200)'}`, background: currentPage === page ? 'var(--color-module-current-lightest)' : 'var(--color-neutral-0)', color: currentPage === page ? 'var(--color-module-current-base)' : 'var(--color-neutral-600)', cursor: 'pointer', fontSize: 'var(--text-sm)', fontWeight: currentPage === page ? 'var(--font-semibold)' : 'normal', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{page}</button>
            ))}
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)} style={{ padding: '6px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-neutral-200)', background: 'var(--color-neutral-0)', color: currentPage === totalPages ? 'var(--color-neutral-300)' : 'var(--color-neutral-600)', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', fontSize: 'var(--text-sm)' }}>下一页</button>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-400)', marginLeft: 'var(--space-2)' }}>第 {currentPage}/{totalPages} 页</span>
          </div>
        )}
      </div>

      {/* 删除确认弹窗 */}
      {deleteConfirm !== null && (
        <div className="category-dialog-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="category-dialog" onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)', color: 'var(--color-neutral-800)', marginBottom: 'var(--space-4)' }}>确认删除</div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-neutral-600)', marginBottom: 'var(--space-5)' }}>
              确定要删除茶种「{filtered[deleteConfirm - (currentPage - 1) * PAGE_SIZE]?.name}」吗？此操作不可恢复。
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
              <Button variant="ghost" onClick={() => setDeleteConfirm(null)}>取消</Button>
              <Button onClick={() => handleDelete(deleteConfirm - (currentPage - 1) * PAGE_SIZE)} style={{ background: '#FD742D' }}>确认删除</Button>
            </div>
          </div>
        </div>
      )}

      {/* 新增/编辑抽屉 */}
      {showDrawer && (
        <div className="drawer-overlay" onClick={() => setShowDrawer(false)}>
          <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <span className="drawer-title">{drawerMode === 'add' ? '新增茶种' : '编辑茶种'}</span>
              <button className="drawer-close" onClick={() => setShowDrawer(false)}>
                <svg viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </button>
            </div>
            <div className="drawer-body">
              <div className="drawer-form-row">
                <div className="drawer-form-field">
                  <label className="drawer-label">茶种名称 <span style={{ color: '#FD742D' }}>*</span></label>
                  <input className="detail-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="请输入茶种名称" />
                </div>
                <div className="drawer-form-field">
                  <label className="drawer-label">茶类 <span style={{ color: '#FD742D' }}>*</span></label>
                  <select className="detail-input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as TeaCategory })}>
                    {Object.values(TeaCategory).map((cat) => (
                      <option key={cat} value={cat}>{getTeaCategoryLabel(cat)}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="drawer-form-row">
                <div className="drawer-form-field">
                  <label className="drawer-label">产地（省份）</label>
                  <input className="detail-input" value={form.origin} onChange={(e) => setForm({ ...form, origin: e.target.value })} placeholder="如：浙江" />
                </div>
                <div className="drawer-form-field">
                  <label className="drawer-label">产地详情</label>
                  <input className="detail-input" value={form.originDetail} onChange={(e) => setForm({ ...form, originDetail: e.target.value })} placeholder="如：杭州西湖区" />
                </div>
              </div>
              <div className="drawer-form-row" style={{ flexDirection: 'column' }}>
                <div className="drawer-form-field" style={{ width: '100%' }}>
                  <label className="drawer-label">茶种介绍</label>
                  <textarea className="detail-textarea" value={form.introduction} onChange={(e) => setForm({ ...form, introduction: e.target.value })} placeholder="请输入茶种介绍" rows={3} />
                </div>
              </div>
              <div className="drawer-form-row">
                <div className="drawer-form-field">
                  <label className="drawer-label">特点</label>
                  <input className="detail-input" value={form.characteristics} onChange={(e) => setForm({ ...form, characteristics: e.target.value })} placeholder="请输入特点" />
                </div>
                <div className="drawer-form-field">
                  <label className="drawer-label">知名度 (1-100)</label>
                  <input className="detail-input" type="number" min={1} max={100} value={form.popularity} onChange={(e) => setForm({ ...form, popularity: e.target.value })} />
                </div>
              </div>
              <div className="drawer-form-row" style={{ flexDirection: 'column' }}>
                <div className="drawer-form-field" style={{ width: '100%' }}>
                  <label className="drawer-label">代表品牌（用顿号分隔）</label>
                  <input className="detail-input" value={form.brands.join('、')} onChange={(e) => setForm({ ...form, brands: e.target.value.split(/[、,，]/).map((s: string) => s.trim()).filter(Boolean) })} placeholder="如：西湖牌、狮峰牌、贡牌" />
                </div>
              </div>
            </div>
            <div className="drawer-footer">
              <Button variant="ghost" onClick={() => setShowDrawer(false)}>取消</Button>
              <Button onClick={handleSave}>{drawerMode === 'add' ? '确认新增' : '保存修改'}</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
