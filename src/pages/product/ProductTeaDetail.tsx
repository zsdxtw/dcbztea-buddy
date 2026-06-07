import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ContentHeader from '../../components/layout/ContentHeader';
import Card from '../../components/common/Card';
import StatusTag from '../../components/common/StatusTag';
import Button from '../../components/common/Button';
import Tag from '../../components/common/Tag';
import { teaProducts, getShelfStatusLabel, getPurchaseStatusLabel, getProductionStatusLabel } from '../../data/teaProducts';
import { TeaCategory, TeaProduct } from '../../types';
import { brandItems } from '../../data/brands';
import { teaCategoryData, teawareCategoryData, teaPeripheralCategoryData, otherCategoryData, productCategoryLabels, type ProductCategoryType, type CategoryNode } from '../../data/productCategories';

/** 通过茶类中文名称获取 TeaCategory 枚举 */
function nameToTeaCategory(name: string): TeaCategory | undefined {
  const map: Record<string, TeaCategory> = {
    '绿茶': TeaCategory.GREEN, '红茶': TeaCategory.RED, '青茶': TeaCategory.OOLONG,
    '白茶': TeaCategory.WHITE, '黄茶': TeaCategory.YELLOW, '黑茶': TeaCategory.DARK,
    '花草茶': TeaCategory.FLOWER,
  };
  return map[name];
}

/** 从 category 字段提取一级茶类名称 */
function getTopCategory(category: string): string {
  return category.split('-')[0];
}

/** 一级分类数据映射 */
const CATEGORY_DATA_MAP: Record<ProductCategoryType, CategoryNode> = {
  tea: teaCategoryData,
  teaware: teawareCategoryData,
  'tea-peripheral': teaPeripheralCategoryData,
  other: otherCategoryData,
};

/** 一级分类名 -> ProductCategoryType 反向映射 */
const L1_NAME_TO_TYPE: Record<string, ProductCategoryType> = {
  '茶叶': 'tea', '茶具': 'teaware', '茶周边': 'tea-peripheral', '其他': 'other',
};

/** 详情行组件 */
function DetailRow({ label, children, span }: { label: string; children: React.ReactNode; span?: boolean }) {
  return (
    <div className={`detail-row${span ? ' detail-row-span' : ''}`}>
      <div className="detail-label">{label}</div>
      <div className="detail-value">{children}</div>
    </div>
  );
}

/** 编辑行组件 */
function EditRow({ label, children, span }: { label: string; children: React.ReactNode; span?: boolean }) {
  return (
    <div className={`detail-row${span ? ' detail-row-span' : ''}`}>
      <div className="detail-label">{label}</div>
      <div className="detail-value" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>{children}</div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '4px 8px',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--color-neutral-200)',
  fontSize: 'var(--text-sm)',
  outline: 'none',
  background: 'var(--color-neutral-0)',
};

const selectStyle: React.CSSProperties = {
  width: '100%',
  padding: '4px 8px',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--color-neutral-200)',
  fontSize: 'var(--text-sm)',
  outline: 'none',
  background: 'var(--color-neutral-0)',
  cursor: 'pointer',
};

export default function ProductTeaDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<Record<string, any>>({});

  const product = teaProducts.find((p) => p.id === id);

  if (!product) {
    return (
      <>
        <ContentHeader title="茶叶商品详情" breadcrumbs={['商品', '商品管理', '茶叶', '详情']} />
        <div className="content-body">
          <Card>
            <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--color-neutral-400)' }}>
              商品不存在
            </div>
          </Card>
        </div>
      </>
    );
  }

  const topCategory = getTopCategory(product.category);
  const teaCat = nameToTeaCategory(topCategory);
  const mainPreview = previewImage ?? product.mainImages[0] ?? '';

  const shelfVariant = product.shelfStatus === 'on' ? 'success' : 'error';
  const purchaseVariant = product.purchaseStatus === 'available' ? 'success' : 'warning';
  const productionVariant = product.productionStatus === 'producing' ? 'success' : 'error';

  // ── 编辑模式逻辑 ──
  const handleEnterEdit = () => {
    const formData: any = { ...product };
    // 初始化分类选择
    const l1Name = getTopCategory(product.category);
    const l1Type = L1_NAME_TO_TYPE[l1Name] || 'tea';
    const parts = product.category.split('-');
    const l2Name = parts[1] || '';
    const l3Name = parts[2] || '';
    formData.selectedL1 = l1Type;
    formData.selectedL2 = [l2Name];
    formData.selectedL3 = l3Name ? [l3Name] : [];
    formData.isNewSeries = false;
    formData.newSeriesName = '';
    setForm(formData);
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setForm({});
  };

  const handleSaveEdit = () => {
    // 更新分类
    if (editComputedCategories.length > 0) {
      form.category = editComputedCategories[0];
    }
    // 更新含茶具标记
    form.includesTeaware = computedIncludesTeaware;
    // 同步新系列到品牌管理
    const finalSeries = form.isNewSeries ? form.newSeriesName : form.series;
    if (finalSeries && form.brand) {
      syncSeriesToBrand(form.brand, finalSeries);
      form.series = finalSeries;
    }
    // 更新商品数据（实际项目中应调用API）
    Object.assign(product, form);
    setEditMode(false);
    setForm({});
  };

  const f = editMode ? form : product;

  // 编辑模式下：品牌对应的系列选项
  const brandSeriesOptions = useMemo(() => {
    const brandName = (editMode ? form.brand : product.brand) || '';
    const brand = brandItems.find(b => b.name === brandName);
    return brand?.series || [];
  }, [editMode, form.brand, product.brand]);

  // 将新系列同步到品牌管理数据
  const syncSeriesToBrand = (brandName: string, seriesName: string) => {
    if (!seriesName.trim()) return;
    const brand = brandItems.find(b => b.name === brandName);
    if (brand && !brand.series.includes(seriesName.trim())) {
      brand.series.push(seriesName.trim());
    }
  };

  // 编辑模式下：分类联动
  const editL1Type = useMemo(() => {
    const l1Name = productCategoryLabels[form.selectedL1 as ProductCategoryType] || '';
    return form.selectedL1 as ProductCategoryType | undefined;
  }, [form.selectedL1]);

  const editL2Options = useMemo(() => {
    if (!editL1Type) return [];
    const data = CATEGORY_DATA_MAP[editL1Type];
    return data?.children || [];
  }, [editL1Type]);

  const editL3Options = useMemo(() => {
    if (!editL1Type || editL1Type !== 'tea') return {};
    const result: Record<string, CategoryNode[]> = {};
    const teaData = teaCategoryData.children || [];
    for (const l2 of teaData) {
      if (form.selectedL2?.includes(l2.name) && l2.children && l2.children.length > 0) {
        result[l2.name] = l2.children;
      }
    }
    return result;
  }, [editL1Type, form.selectedL2]);

  const editComputedCategories = useMemo(() => {
    if (!form.selectedL1) return [];
    const cats: string[] = [];
    if (form.selectedL1 === 'tea') {
      for (const l2Name of (form.selectedL2 || [])) {
        const l2Node = teaCategoryData.children?.find(c => c.name === l2Name);
        if (l2Node?.children && l2Node.children.length > 0) {
          const selectedL3ForL2 = (form.selectedL3 || []).filter((l3Name: string) =>
            l2Node.children!.some(c => c.name === l3Name)
          );
          if (selectedL3ForL2.length > 0) {
            for (const l3Name of selectedL3ForL2) {
              cats.push(`${l2Name}-${l3Name}`);
            }
          } else {
            cats.push(l2Name);
          }
        } else {
          cats.push(l2Name);
        }
      }
    } else {
      for (const l2Name of (form.selectedL2 || [])) {
        cats.push(l2Name);
      }
    }
    return cats;
  }, [form.selectedL1, form.selectedL2, form.selectedL3]);

  const computedIncludesTeaware = useMemo(() => {
    if (form.selectedL1 === 'teaware') return true;
    return form.includesTeaware || false;
  }, [form.selectedL1, form.includesTeaware]);

  const handleEditL1Change = (l1: ProductCategoryType) => {
    setForm(prev => ({ ...prev, selectedL1: l1, selectedL2: [], selectedL3: [] }));
  };

  const handleEditToggleL2 = (name: string) => {
    setForm(prev => {
      const prevL2: string[] = (prev as any).selectedL2 || [];
      const newL2 = prevL2.includes(name)
        ? prevL2.filter(n => n !== name)
        : [...prevL2, name];
      const prevL3: string[] = (prev as any).selectedL3 || [];
      const validL3 = prevL3.filter(l3Name => {
        const teaData = teaCategoryData.children || [];
        for (const l2 of teaData) {
          if (newL2.includes(l2.name) && l2.children?.some(c => c.name === l3Name)) {
            return true;
          }
        }
        return false;
      });
      return { ...prev, selectedL2: newL2, selectedL3: validL3 };
    });
  };

  const handleEditToggleL3 = (name: string) => {
    setForm(prev => {
      const prevL3: string[] = (prev as any).selectedL3 || [];
      return {
        ...prev,
        selectedL3: prevL3.includes(name)
          ? prevL3.filter(n => n !== name)
          : [...prevL3, name],
      };
    });
  };

  return (
    <>
      <ContentHeader
        title={editMode ? `编辑 - ${product.name}` : product.name}
        breadcrumbs={['商品', '商品管理', '茶叶', product.name]}
        actions={
          editMode ? (
            <>
              <Button variant="ghost" onClick={handleCancelEdit}>取消</Button>
              <Button onClick={handleSaveEdit}>保存修改</Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => navigate(-1)}>返回</Button>
              <Button onClick={handleEnterEdit}>编辑</Button>
              <Button style={{ background: '#FD742D', borderColor: '#FD742D' }} onClick={() => setShowDeleteConfirm(true)}>删除</Button>
            </>
          )
        }
      />
      <div className="content-body">
        {editMode ? (
          /* ── 编辑模式 ── */
          <>
            {/* 基本信息 */}
            <Card title="基本信息" style={{ marginBottom: 'var(--space-4)' }}>
              <div className="detail-grid">
                <EditRow label="商品编码">
                  <input className="detail-input" value={f.code || ''} readOnly style={{ ...inputStyle, background: 'var(--color-neutral-100)', color: 'var(--color-neutral-400)', cursor: 'not-allowed' }} />
                </EditRow>
                <EditRow label="商品名称">
                  <input className="detail-input" value={f.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle} placeholder="请输入商品名称" />
                </EditRow>
                <EditRow label="一级分类">
                  <select
                    className="detail-input"
                    value={(form as any).selectedL1 || ''}
                    onChange={(e) => handleEditL1Change(e.target.value as ProductCategoryType)}
                    style={selectStyle}
                  >
                    {(Object.keys(productCategoryLabels) as ProductCategoryType[]).map((key) => (
                      <option key={key} value={key}>{productCategoryLabels[key]}</option>
                    ))}
                  </select>
                </EditRow>
                <EditRow label="二级分类（多选）">
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {editL2Options.map((l2) => {
                      const selected = ((form as any).selectedL2 || []).includes(l2.name);
                      return (
                        <label key={l2.id} style={{
                          display: 'flex', alignItems: 'center', gap: '3px', cursor: 'pointer',
                          fontSize: 'var(--text-xs)', padding: '2px 6px', borderRadius: 'var(--radius-sm)',
                          border: `1px solid ${selected ? 'var(--color-module-current-base)' : 'var(--color-neutral-200)'}`,
                          background: selected ? 'var(--color-module-current-lightest)' : 'var(--color-neutral-0)',
                          color: selected ? 'var(--color-module-current-base)' : 'var(--color-neutral-600)',
                          transition: 'var(--transition-fast)',
                        }}>
                          <input type="checkbox" checked={selected} onChange={() => handleEditToggleL2(l2.name)} style={{ display: 'none' }} />
                          {l2.name}
                        </label>
                      );
                    })}
                  </div>
                </EditRow>
                {(form as any).selectedL1 === 'tea' && Object.keys(editL3Options).length > 0 && (
                  <EditRow label="三级茶种（多选）">
                    <div>
                      {Object.entries(editL3Options).map(([l2Name, l3Nodes]) => (
                        <div key={l2Name} style={{ marginBottom: '4px' }}>
                          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-500)', marginBottom: '2px' }}>{l2Name}</div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                            {l3Nodes.map((l3) => {
                              const selected = ((form as any).selectedL3 || []).includes(l3.name);
                              return (
                                <label key={l3.id} style={{
                                  display: 'flex', alignItems: 'center', gap: '2px', cursor: 'pointer',
                                  fontSize: 'var(--text-xs)', padding: '1px 5px', borderRadius: 'var(--radius-sm)',
                                  border: `1px solid ${selected ? 'var(--color-module-current-base)' : 'var(--color-neutral-200)'}`,
                                  background: selected ? 'var(--color-module-current-lightest)' : 'var(--color-neutral-0)',
                                  color: selected ? 'var(--color-module-current-base)' : 'var(--color-neutral-600)',
                                }}>
                                  <input type="checkbox" checked={selected} onChange={() => handleEditToggleL3(l3.name)} style={{ display: 'none' }} />
                                  {l3.name}
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </EditRow>
                )}
                {editComputedCategories.length > 0 && (
                  <EditRow label="已选分类">
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-module-current-base)', fontWeight: 'var(--font-medium)' }}>
                      {editComputedCategories.join('、')}
                    </span>
                  </EditRow>
                )}
                <EditRow label="品牌">
                  <select className="detail-input" value={f.brand || ''} onChange={(e) => setForm({ ...form, brand: e.target.value })} style={selectStyle}>
                    <option value="">请选择品牌</option>
                    {brandItems.map((b) => (
                      <option key={b.id} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                </EditRow>
                <EditRow label="系列">
                  {form.isNewSeries ? (
                    <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', width: '100%' }}>
                      <input
                        className="detail-input"
                        value={form.newSeriesName || ''}
                        onChange={(e) => setForm({ ...form, newSeriesName: e.target.value })}
                        style={{ ...inputStyle, flex: 1 }}
                        placeholder="输入新系列名称"
                        autoFocus
                      />
                      <button
                        onClick={() => setForm({ ...form, isNewSeries: false, newSeriesName: '' })}
                        style={{
                          padding: '4px 8px', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)',
                          border: '1px solid var(--color-neutral-200)', background: 'var(--color-neutral-0)',
                          color: 'var(--color-neutral-500)', cursor: 'pointer', whiteSpace: 'nowrap',
                        }}
                      >取消</button>
                    </div>
                  ) : (
                    <select
                      className="detail-input"
                      value={f.series || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '__new__') {
                          setForm({ ...form, isNewSeries: true, series: '' });
                        } else {
                          setForm({ ...form, isNewSeries: false, series: val });
                        }
                      }}
                      style={selectStyle}
                    >
                      <option value="">请选择系列</option>
                      {brandSeriesOptions.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                      {f.series && !brandSeriesOptions.includes(f.series) && (
                        <option value={f.series}>{f.series}</option>
                      )}
                      <option value="__new__">填写新系列</option>
                    </select>
                  )}
                </EditRow>
                <EditRow label="品级">
                  <select className="detail-input" value={f.grade || ''} onChange={(e) => setForm({ ...form, grade: e.target.value })} style={selectStyle}>
                    <option value="">请选择品级</option>
                    <option value="特级">特级</option>
                    <option value="一级">一级</option>
                    <option value="二级">二级</option>
                    <option value="三级">三级</option>
                    <option value="精品">精品</option>
                    <option value="珍品">珍品</option>
                  </select>
                </EditRow>
                <EditRow label="产地">
                  <input className="detail-input" value={f.origin || ''} onChange={(e) => setForm({ ...form, origin: e.target.value })} style={inputStyle} placeholder="如：浙江杭州西湖区" />
                </EditRow>
                <EditRow label="产品特点" span>
                  <input className="detail-input" value={f.features || ''} onChange={(e) => setForm({ ...form, features: e.target.value })} style={inputStyle} placeholder="如：明前头采·豆花香·扁平挺直" />
                </EditRow>
              </div>
            </Card>

            {/* 规格包装 */}
            <Card title="规格包装" style={{ marginBottom: 'var(--space-4)' }}>
              <div className="detail-grid">
                <EditRow label="规格">
                  <input className="detail-input" value={f.spec || ''} onChange={(e) => setForm({ ...form, spec: e.target.value })} style={inputStyle} placeholder="如：50g/罐" />
                </EditRow>
                <EditRow label="包装单位">
                  <select className="detail-input" value={f.packageUnit || ''} onChange={(e) => setForm({ ...form, packageUnit: e.target.value })} style={selectStyle}>
                    <option value="罐">罐</option>
                    <option value="袋">袋</option>
                    <option value="盒">盒</option>
                    <option value="饼">饼</option>
                    <option value="砖">砖</option>
                    <option value="条">条</option>
                    <option value="箱">箱</option>
                  </select>
                </EditRow>
                <EditRow label="重量(kg)">
                  <input className="detail-input" type="number" value={f.weight || ''} onChange={(e) => setForm({ ...form, weight: Number(e.target.value) })} style={inputStyle} placeholder="0" />
                </EditRow>
                <EditRow label="每箱数量">
                  <input className="detail-input" type="number" value={f.quantityPerUnit || ''} onChange={(e) => setForm({ ...form, quantityPerUnit: Number(e.target.value) })} style={inputStyle} placeholder="0" />
                </EditRow>
                <EditRow label="体积(cm)" span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', width: '100%' }}>
                    <input className="detail-input" type="number" value={f.volume?.length || ''} onChange={(e) => setForm({ ...form, volume: { ...((f.volume) || { length: 0, width: 0, height: 0 }), length: Number(e.target.value) } })} style={{ ...inputStyle, width: '30%' }} placeholder="长" />
                    <span style={{ color: 'var(--color-neutral-400)' }}>×</span>
                    <input className="detail-input" type="number" value={f.volume?.width || ''} onChange={(e) => setForm({ ...form, volume: { ...((f.volume) || { length: 0, width: 0, height: 0 }), width: Number(e.target.value) } })} style={{ ...inputStyle, width: '30%' }} placeholder="宽" />
                    <span style={{ color: 'var(--color-neutral-400)' }}>×</span>
                    <input className="detail-input" type="number" value={f.volume?.height || ''} onChange={(e) => setForm({ ...form, volume: { ...((f.volume) || { length: 0, width: 0, height: 0 }), height: Number(e.target.value) } })} style={{ ...inputStyle, width: '30%' }} placeholder="高" />
                  </div>
                </EditRow>
                <EditRow label="69码">
                  <input className="detail-input" value={f.barcode69 || ''} onChange={(e) => setForm({ ...form, barcode69: e.target.value })} style={inputStyle} placeholder="13位条码" maxLength={13} />
                </EditRow>
                <EditRow label="型号">
                  <input className="detail-input" value={f.model || ''} onChange={(e) => setForm({ ...form, model: e.target.value })} style={inputStyle} placeholder="请输入型号" />
                </EditRow>
                <EditRow label="保质期(月)">
                  <input className="detail-input" type="number" value={f.shelfLife || ''} onChange={(e) => setForm({ ...form, shelfLife: Number(e.target.value) })} style={inputStyle} placeholder="12" />
                </EditRow>
                <EditRow label="税率(%)">
                  <input className="detail-input" type="number" value={f.taxRate || ''} onChange={(e) => setForm({ ...form, taxRate: Number(e.target.value) })} style={inputStyle} placeholder="9" />
                </EditRow>
              </div>
            </Card>

            {/* 价格信息 */}
            <Card title="价格信息" style={{ marginBottom: 'var(--space-4)' }}>
              <div className="detail-grid">
                <EditRow label="市场价(元)">
                  <input className="detail-input" type="number" value={f.marketPrice || ''} onChange={(e) => setForm({ ...form, marketPrice: Number(e.target.value) })} style={inputStyle} placeholder="0" />
                </EditRow>
                <EditRow label="天猫价(元)">
                  <input className="detail-input" type="number" value={f.tmallPrice || ''} onChange={(e) => setForm({ ...form, tmallPrice: Number(e.target.value) })} style={inputStyle} placeholder="0" />
                </EditRow>
                <EditRow label="天猫链接">
                  <input className="detail-input" value={f.tmallUrl || ''} onChange={(e) => setForm({ ...form, tmallUrl: e.target.value })} style={inputStyle} placeholder="https://" />
                </EditRow>
                <EditRow label="京东价(元)">
                  <input className="detail-input" type="number" value={f.jdPrice || ''} onChange={(e) => setForm({ ...form, jdPrice: Number(e.target.value) })} style={inputStyle} placeholder="0" />
                </EditRow>
                <EditRow label="京东链接">
                  <input className="detail-input" value={f.jdUrl || ''} onChange={(e) => setForm({ ...form, jdUrl: e.target.value })} style={inputStyle} placeholder="https://" />
                </EditRow>
              </div>
            </Card>

            {/* 状态与库存 */}
            <Card title="状态与库存" style={{ marginBottom: 'var(--space-4)' }}>
              <div className="detail-grid">
                <EditRow label="上下架状态">
                  <select className="detail-input" value={f.shelfStatus || 'on'} onChange={(e) => setForm({ ...form, shelfStatus: e.target.value as 'on' | 'off' })} style={selectStyle}>
                    <option value="on">上架</option>
                    <option value="off">下架</option>
                  </select>
                </EditRow>
                <EditRow label="采购状态">
                  <select className="detail-input" value={f.purchaseStatus || 'available'} onChange={(e) => setForm({ ...form, purchaseStatus: e.target.value as 'available' | 'stopped' })} style={selectStyle}>
                    <option value="available">可采</option>
                    <option value="stopped">停采</option>
                  </select>
                </EditRow>
                <EditRow label="生产状态">
                  <select className="detail-input" value={f.productionStatus || 'producing'} onChange={(e) => setForm({ ...form, productionStatus: e.target.value as 'producing' | 'stopped' })} style={selectStyle}>
                    <option value="producing">在产</option>
                    <option value="stopped">停产</option>
                  </select>
                </EditRow>
                <EditRow label="库存预警值">
                  <input className="detail-input" type="number" value={f.stockAlert || ''} onChange={(e) => setForm({ ...form, stockAlert: Number(e.target.value) })} style={inputStyle} placeholder="50" />
                </EditRow>
                <EditRow label="自有库存">
                  <input className="detail-input" type="number" value={f.stock || ''} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} style={inputStyle} placeholder="0" />
                </EditRow>
                <EditRow label="预占库存">
                  <input className="detail-input" type="number" value={f.reservedStock || ''} onChange={(e) => setForm({ ...form, reservedStock: Number(e.target.value) })} style={inputStyle} placeholder="0" />
                </EditRow>
                <EditRow label="总销量">
                  <input className="detail-input" type="number" value={f.totalSales || ''} onChange={(e) => setForm({ ...form, totalSales: Number(e.target.value) })} style={inputStyle} placeholder="0" />
                </EditRow>
                <EditRow label="含茶具">
                  <span style={{
                    padding: '2px 10px', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-medium)',
                    background: computedIncludesTeaware ? 'var(--color-module-current-lightest)' : 'var(--color-neutral-100)',
                    color: computedIncludesTeaware ? 'var(--color-module-current-base)' : 'var(--color-neutral-500)',
                    border: `1px solid ${computedIncludesTeaware ? 'var(--color-module-current-base)' : 'var(--color-neutral-200)'}`,
                  }}>
                    {computedIncludesTeaware ? '是（分类含茶具自动标记）' : '否'}
                  </span>
                </EditRow>
              </div>
            </Card>

            {/* 包装清单 + 备注 */}
            <div className="grid-2">
              <Card title="包装清单">
                <input className="detail-input" value={f.packageList || ''} onChange={(e) => setForm({ ...form, packageList: e.target.value })} style={inputStyle} placeholder="如：茶叶罐×1、手提袋×1" />
              </Card>
              <Card title="备注">
                <textarea className="detail-textarea" value={f.remark || ''} onChange={(e) => setForm({ ...form, remark: e.target.value })} placeholder="请输入备注信息" rows={3} />
              </Card>
            </div>
          </>
        ) : (
          /* ── 查看模式 ── */
          <>
            {/* 顶部：图片 + 基本信息 */}
            <Card style={{ marginBottom: 'var(--space-6)' }}>
              <div style={{ display: 'flex', gap: 'var(--space-8)' }}>
                {/* 左侧图片区 */}
                <div style={{ flexShrink: 0, width: 400 }}>
                  {/* 主图预览 */}
                  <div style={{
                    width: 400, height: 400, borderRadius: 'var(--radius-lg)', overflow: 'hidden',
                    background: '#fff', border: '1px solid var(--color-neutral-150)', marginBottom: 'var(--space-3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <img
                      src={mainPreview}
                      alt={product.name}
                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                    />
                  </div>
                  {/* 缩略图列表 */}
                  <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                    {product.mainImages.map((img, i) => (
                      <div
                        key={i}
                        onClick={() => setPreviewImage(img)}
                        style={{
                          width: 72, height: 72, borderRadius: 'var(--radius-md)', overflow: 'hidden',
                          background: '#fff', border: mainPreview === img ? '2px solid var(--color-module-current-base)' : '1px solid var(--color-neutral-150)',
                          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'border-color var(--transition-fast)',
                        }}
                      >
                        <img src={img} alt={`${product.name}-${i + 1}`} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* 右侧基本信息 */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                    <span style={{ fontFamily: 'var(--font-family-serif)', fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-semibold)', color: 'var(--color-neutral-800)' }}>
                      {product.name}
                    </span>
                    {teaCat && <Tag category={teaCat} />}
                  </div>
                  <div className="detail-grid">
                    <DetailRow label="商品编码"><span className="mono">{product.code}</span></DetailRow>
                    <DetailRow label="分类">{product.category}</DetailRow>
                    <DetailRow label="品牌"><span style={{ fontWeight: 'var(--font-medium)' }}>{product.brand}</span></DetailRow>
                    <DetailRow label="系列">{product.series}</DetailRow>
                    <DetailRow label="等级"><span style={{ fontWeight: 'var(--font-medium)' }}>{product.grade}</span></DetailRow>
                    <DetailRow label="产地">{product.origin}</DetailRow>
                    <DetailRow label="规格">{product.spec}</DetailRow>
                    <DetailRow label="重量">{product.weight} kg</DetailRow>
                    <DetailRow label="体积">{product.volume.length}×{product.volume.width}×{product.volume.height} cm</DetailRow>
                    <DetailRow label="包装单位">{product.packageUnit}</DetailRow>
                    <DetailRow label="单位数量">{product.quantityPerUnit}</DetailRow>
                    <DetailRow label="保质期">{product.shelfLife} 个月</DetailRow>
                    <DetailRow label="税率">{product.taxRate}%</DetailRow>
                    <DetailRow label="69码"><span className="mono">{product.barcode69}</span></DetailRow>
                    <DetailRow label="型号"><span className="mono">{product.model}</span></DetailRow>
                    <DetailRow label="产品特点" span>{product.features}</DetailRow>
                  </div>
                </div>
              </div>
            </Card>

            {/* 中部：商品状态 + 价格信息 */}
            <div className="grid-2" style={{ marginBottom: 'var(--space-6)' }}>
              <Card title="商品状态">
                <div className="detail-grid">
                  <DetailRow label="上架状态">
                    <StatusTag variant={shelfVariant} label={getShelfStatusLabel(product.shelfStatus)} />
                  </DetailRow>
                  <DetailRow label="采购状态">
                    <StatusTag variant={purchaseVariant} label={getPurchaseStatusLabel(product.purchaseStatus)} />
                  </DetailRow>
                  <DetailRow label="生产状态">
                    <StatusTag variant={productionVariant} label={getProductionStatusLabel(product.productionStatus)} />
                  </DetailRow>
                  <DetailRow label="库存预警值">
                    <span style={{ fontWeight: 'var(--font-medium)' }}>{product.stockAlert}</span>
                  </DetailRow>
                  <DetailRow label="自有库存">
                    <span style={{ fontWeight: 'var(--font-medium)' }}>{product.stock}</span>
                  </DetailRow>
                  <DetailRow label="预占数量">
                    <span style={{ fontWeight: 'var(--font-medium)' }}>{product.reservedStock}</span>
                  </DetailRow>
                  <DetailRow label="总销量">
                    <span style={{ fontWeight: 'var(--font-medium)' }}>{product.totalSales}</span>
                  </DetailRow>
                </div>
              </Card>

              <Card title="价格信息">
                <div className="detail-grid">
                  <DetailRow label="市场价" span>
                    <span style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)', color: '#CB405D' }}>
                      ¥{product.marketPrice}
                    </span>
                  </DetailRow>
                  <DetailRow label="天猫价" span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                      <span style={{ fontWeight: 'var(--font-medium)' }}>¥{product.tmallPrice}</span>
                      {product.tmallUrl && (
                        <a href={product.tmallUrl} target="_blank" rel="noreferrer" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-module-current-base)' }}>
                          查看链接
                        </a>
                      )}
                    </div>
                  </DetailRow>
                  <DetailRow label="京东价" span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                      <span style={{ fontWeight: 'var(--font-medium)' }}>¥{product.jdPrice}</span>
                      {product.jdUrl && (
                        <a href={product.jdUrl} target="_blank" rel="noreferrer" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-module-current-base)' }}>
                          查看链接
                        </a>
                      )}
                    </div>
                  </DetailRow>
                </div>
              </Card>
            </div>

            {/* 底部：附加信息 */}
            <div className="grid-2">
              <Card title="包装清单">
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-neutral-700)', lineHeight: 'var(--leading-md)' }}>
                  {product.packageList || <span style={{ color: 'var(--color-neutral-400)' }}>未填写</span>}
                </div>
              </Card>

              <Card title="备注">
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-neutral-700)', lineHeight: 'var(--leading-md)' }}>
                  {product.remark || <span style={{ color: 'var(--color-neutral-400)' }}>未填写</span>}
                </div>
              </Card>

              <Card title="详情图" style={{ gridColumn: 'span 2' }}>
                <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                  {product.detailImages.length > 0 ? (
                    product.detailImages.map((img, i) => (
                      <div
                        key={i}
                        style={{
                          width: 200, height: 200, borderRadius: 'var(--radius-lg)', overflow: 'hidden',
                          background: '#fff', border: '1px solid var(--color-neutral-150)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        <img src={img} alt={`详情图-${i + 1}`} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                      </div>
                    ))
                  ) : (
                    <span style={{ color: 'var(--color-neutral-400)' }}>暂无详情图</span>
                  )}
                </div>
              </Card>
            </div>
          </>
        )}
      </div>

      {/* 删除确认弹窗 */}
      {showDeleteConfirm && (
        <div className="category-dialog-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="category-dialog" onClick={(e) => e.stopPropagation()} style={{ width: 400 }}>
            <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)', color: 'var(--color-neutral-800)', marginBottom: 'var(--space-3)' }}>确认删除</div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-neutral-600)', marginBottom: 'var(--space-5)' }}>
              确定要删除商品「{product?.name}」吗？此操作不可撤销。
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
              <Button variant="ghost" onClick={() => setShowDeleteConfirm(false)}>取消</Button>
              <Button onClick={() => { setShowDeleteConfirm(false); navigate('/product/product-manage-tea'); }} style={{ background: '#FD742D', borderColor: '#FD742D' }}>确认删除</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
