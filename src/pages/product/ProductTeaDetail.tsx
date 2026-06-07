import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ContentHeader from '../../components/layout/ContentHeader';
import Card from '../../components/common/Card';
import StatusTag from '../../components/common/StatusTag';
import Button from '../../components/common/Button';
import Tag from '../../components/common/Tag';
import { teaProducts, getShelfStatusLabel, getPurchaseStatusLabel, getProductionStatusLabel } from '../../data/teaProducts';
import { TeaCategory } from '../../types';

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

/** 详情行组件 */
function DetailRow({ label, children, span }: { label: string; children: React.ReactNode; span?: boolean }) {
  return (
    <div className={`detail-row${span ? ' detail-row-span' : ''}`}>
      <div className="detail-label">{label}</div>
      <div className="detail-value">{children}</div>
    </div>
  );
}

export default function ProductTeaDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [previewImage, setPreviewImage] = useState<string | null>(null);

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

  return (
    <>
      <ContentHeader
        title={product.name}
        breadcrumbs={['商品', '商品管理', '茶叶', product.name]}
        actions={
          <>
            <Button variant="ghost" onClick={() => navigate(-1)}>返回</Button>
            <Button>编辑</Button>
          </>
        }
      />
      <div className="content-body">
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
      </div>
    </>
  );
}
