import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ContentHeader from '../../components/layout/ContentHeader';
import Card from '../../components/common/Card';
import StatusTag from '../../components/common/StatusTag';
import Tag from '../../components/common/Tag';
import Button from '../../components/common/Button';
import Toggle from '../../components/common/Toggle';
import { TeaCategory, BrandLevel, BrandStatus } from '../../types';
import type { BrandItem } from '../../types';

const brandItems: BrandItem[] = [
  {
    id: '1', code: 'BRD-XH', name: '西湖牌', logo: '', owner: '杭州西湖茶叶有限公司',
    introduction: '始创于1949年，西湖龙井茶核心产区标杆品牌，传承传统炒制技艺', requirements: '需提供原产地证明，品质符合GB/T 18650标准', policy: '年度返利3%，季度结算', series: ['明前龙井', '雨前龙井', '龙井红茶'],
    trademarkCert: '西湖龙井地理标志.pdf', jdStoreUrl: 'https://xihupai.jd.com', tmallStoreUrl: 'https://xihupai.tmall.com',
    contactPerson: '王明华', contactPhone: '0571-8765****', address: '浙江省杭州市西湖区龙井路88号',
    teaCategory: TeaCategory.GREEN, level: BrandLevel.S, status: BrandStatus.ACTIVE, productCount: 8,
    website: 'https://www.xihupai.com', cooperationDate: '2023-03-15', createdBy: '陈经理', createdAt: '2023-03-15 10:00', updatedAt: '2025-06-20 14:30',
  },
  {
    id: '2', code: 'BRD-BM', name: '八马', logo: '', owner: '八马茶业股份有限公司',
    introduction: '中国茶业领军品牌，铁观音十三代传人，全国连锁门店超3000家', requirements: '需具备八马品牌授权书，门店面积不低于80㎡', policy: '首批进货额≥50万，年度返利5%', series: ['赛珍珠铁观音', '浓香铁观音', '陈皮普洱'],
    trademarkCert: '八马商标注册证.pdf', jdStoreUrl: 'https://bama.jd.com', tmallStoreUrl: 'https://bama.tmall.com',
    contactPerson: '林文杰', contactPhone: '0595-2345****', address: '福建省泉州市安溪县八马茶业大厦',
    teaCategory: TeaCategory.OOLONG, level: BrandLevel.S, status: BrandStatus.ACTIVE, productCount: 12,
    website: 'https://www.bama.com', cooperationDate: '2022-08-01', createdBy: '陈经理', createdAt: '2022-08-01 09:30', updatedAt: '2025-07-10 16:20',
  },
  {
    id: '3', code: 'BRD-ZYY', name: '张一元', logo: '', owner: '北京张一元茶叶有限责任公司',
    introduction: '百年老字号，始创于1900年，茉莉花茶制作技艺入选国家级非遗', requirements: '需通过品牌方资质审核，具备冷链仓储条件', policy: '年度返利4%，季度结算，提供品牌宣传支持', series: ['茉莉龙毫', '茉莉毛尖', '茉莉云雾'],
    trademarkCert: '张一元商标注册证.pdf', jdStoreUrl: 'https://zhangyiyuan.jd.com', tmallStoreUrl: 'https://zhangyiyuan.tmall.com',
    contactPerson: '赵国强', contactPhone: '010-6303****', address: '北京市西城区大栅栏街22号',
    teaCategory: TeaCategory.GREEN, level: BrandLevel.A, status: BrandStatus.ACTIVE, productCount: 6,
    website: 'https://www.zhangyiyuan.com', cooperationDate: '2023-01-10', createdBy: '陈经理', createdAt: '2023-01-10 11:00', updatedAt: '2025-05-18 09:45',
  },
  {
    id: '6', code: 'BRD-DY', name: '大益', logo: '', owner: '云南大益茶业集团有限公司',
    introduction: '普洱茶行业标杆，勐海茶厂传承，7542被誉为评判普洱茶的标准', requirements: '需具备普洱茶专业仓储，温湿度可调控', policy: '首批进货额≥80万，年度返利6%，提供品鉴培训', series: ['7542生茶', '7572熟茶', '金针白莲'],
    trademarkCert: '大益商标注册证.pdf', jdStoreUrl: 'https://dayi.jd.com', tmallStoreUrl: 'https://dayi.tmall.com',
    contactPerson: '吴远之', contactPhone: '0691-512****', address: '云南省西双版纳州勐海县勐海茶厂',
    teaCategory: TeaCategory.DARK, level: BrandLevel.S, status: BrandStatus.ACTIVE, productCount: 10,
    website: 'https://www.dayi.com', cooperationDate: '2022-05-18', createdBy: '陈经理', createdAt: '2022-05-18 09:00', updatedAt: '2025-07-12 10:30',
  },
];

function levelToVariant(level: BrandLevel) {
  switch (level) {
    case BrandLevel.S: return 'success' as const;
    case BrandLevel.A: return 'info' as const;
    case BrandLevel.B: return 'warning' as const;
    case BrandLevel.C: return 'error' as const;
    default: return 'info' as const;
  }
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

/** 编辑行组件 */
function EditRow({ label, children, span }: { label: string; children: React.ReactNode; span?: boolean }) {
  return (
    <div className={`detail-row${span ? ' detail-row-span' : ''}`}>
      <div className="detail-label">{label}</div>
      <div className="detail-value">{children}</div>
    </div>
  );
}

export default function ProductBrandDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [editing, setEditing] = useState(false);

  const brand = brandItems.find((b) => b.id === id);

  if (!brand) {
    return (
      <>
        <ContentHeader title="品牌详情" breadcrumbs={['商品', '品牌管理', '品牌详情']} />
        <div className="content-body">
          <Card>
            <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--color-neutral-400)' }}>
              未找到该品牌信息
            </div>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <ContentHeader
        title={brand.name}
        breadcrumbs={['商品', '品牌管理', brand.name]}
        actions={
          editing ? (
            <>
              <Button variant="ghost" onClick={() => setEditing(false)}>取消</Button>
              <Button onClick={() => setEditing(false)}>保存</Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => navigate('/product/product-brand')}>返回列表</Button>
              <Button onClick={() => setEditing(true)}>编辑品牌</Button>
            </>
          )
        }
      />
      <div className="content-body">
        {/* 品牌头部信息 */}
        <Card style={{ marginBottom: 'var(--space-6)' }}>
          <div className="brand-detail-header">
            <div className="brand-detail-logo">
              {brand.logo ? <img src={brand.logo} alt={brand.name} /> : <div className="brand-logo-placeholder brand-logo-lg">{brand.name[0]}</div>}
            </div>
            <div className="brand-detail-header-info">
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
                <span style={{ fontFamily: 'var(--font-family-serif)', fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-semibold)', color: 'var(--color-neutral-800)' }}>{brand.name}</span>
                <Tag category={brand.teaCategory} />
                <StatusTag variant={levelToVariant(brand.level)} label={brand.level + '级'} />
                <StatusTag variant={brand.status === BrandStatus.ACTIVE ? 'success' : 'warning'} label={brand.status === BrandStatus.ACTIVE ? '启用' : '禁用'} />
              </div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-neutral-500)', marginBottom: 'var(--space-1)' }}>
                <span className="mono">{brand.code}</span> · {brand.owner}
              </div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-neutral-500)' }}>
                关联商品 <span className="mono" style={{ fontWeight: 'var(--font-semibold)', color: 'var(--color-neutral-700)' }}>{brand.productCount}</span> 件 · 合作起始 <span className="mono">{brand.cooperationDate}</span>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid-2">
          {/* 基本信息 */}
          <Card title="基本信息">
            {editing ? (
              <div className="detail-grid">
                <EditRow label="品牌编号"><input className="detail-input" defaultValue={brand.code} /></EditRow>
                <EditRow label="品牌名称"><input className="detail-input" defaultValue={brand.name} /></EditRow>
                <EditRow label="品牌所属"><input className="detail-input" defaultValue={brand.owner} /></EditRow>
                <EditRow label="所属茶类">
                  <select className="detail-select" defaultValue={brand.teaCategory}>
                    <option value={TeaCategory.GREEN}>绿茶</option><option value={TeaCategory.WHITE}>白茶</option>
                    <option value={TeaCategory.YELLOW}>黄茶</option><option value={TeaCategory.OOLONG}>青茶</option>
                    <option value={TeaCategory.RED}>红茶</option><option value={TeaCategory.DARK}>黑茶</option>
                  </select>
                </EditRow>
                <EditRow label="品牌等级">
                  <select className="detail-select" defaultValue={brand.level}>
                    <option value={BrandLevel.S}>S级</option><option value={BrandLevel.A}>A级</option>
                    <option value={BrandLevel.B}>B级</option><option value={BrandLevel.C}>C级</option>
                  </select>
                </EditRow>
                <EditRow label="品牌状态"><Toggle active={brand.status === BrandStatus.ACTIVE} /></EditRow>
                <EditRow label="品牌官网"><input className="detail-input" defaultValue={brand.website} /></EditRow>
                <EditRow label="合作起始日"><input className="detail-input" type="date" defaultValue={brand.cooperationDate} /></EditRow>
                <EditRow label="品牌介绍" span><textarea className="detail-textarea" defaultValue={brand.introduction} rows={3} /></EditRow>
              </div>
            ) : (
              <div className="detail-grid">
                <DetailRow label="品牌编号"><span className="mono">{brand.code}</span></DetailRow>
                <DetailRow label="品牌名称"><span style={{ fontWeight: 'var(--font-medium)' }}>{brand.name}</span></DetailRow>
                <DetailRow label="品牌所属">{brand.owner}</DetailRow>
                <DetailRow label="所属茶类"><Tag category={brand.teaCategory} /></DetailRow>
                <DetailRow label="品牌等级"><StatusTag variant={levelToVariant(brand.level)} label={brand.level + '级'} /></DetailRow>
                <DetailRow label="品牌状态"><StatusTag variant={brand.status === BrandStatus.ACTIVE ? 'success' : 'warning'} label={brand.status === BrandStatus.ACTIVE ? '启用' : '禁用'} /></DetailRow>
                <DetailRow label="品牌官网">{brand.website ? <a href={brand.website} target="_blank" rel="noreferrer" style={{ color: 'var(--color-module-current-base)' }}>{brand.website}</a> : <span style={{ color: 'var(--color-neutral-400)' }}>未填写</span>}</DetailRow>
                <DetailRow label="合作起始日"><span className="mono">{brand.cooperationDate}</span></DetailRow>
                <DetailRow label="品牌介绍" span>{brand.introduction}</DetailRow>
              </div>
            )}
          </Card>

          {/* 品牌政策与要求 */}
          <Card title="品牌政策与要求">
            {editing ? (
              <div className="detail-grid">
                <EditRow label="品牌要求" span><textarea className="detail-textarea" defaultValue={brand.requirements} rows={3} /></EditRow>
                <EditRow label="品牌政策" span><textarea className="detail-textarea" defaultValue={brand.policy} rows={3} /></EditRow>
                <EditRow label="品牌系列" span><input className="detail-input" defaultValue={brand.series.join('、')} placeholder="多个系列用顿号分隔" /></EditRow>
              </div>
            ) : (
              <div className="detail-grid">
                <DetailRow label="品牌要求" span>{brand.requirements || <span style={{ color: 'var(--color-neutral-400)' }}>未填写</span>}</DetailRow>
                <DetailRow label="品牌政策" span>{brand.policy || <span style={{ color: 'var(--color-neutral-400)' }}>未填写</span>}</DetailRow>
                <DetailRow label="品牌系列" span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                    {brand.series.map((s, i) => (
                      <span key={i} className="brand-series-tag">{s}</span>
                    ))}
                  </div>
                </DetailRow>
              </div>
            )}
          </Card>

          {/* 电商与证书 */}
          <Card title="电商与证书">
            {editing ? (
              <div className="detail-grid">
                <EditRow label="京东店地址"><input className="detail-input" defaultValue={brand.jdStoreUrl} placeholder="https://" /></EditRow>
                <EditRow label="天猫店地址"><input className="detail-input" defaultValue={brand.tmallStoreUrl} placeholder="https://" /></EditRow>
                <EditRow label="商标证书" span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <span className="mono" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-neutral-600)' }}>{brand.trademarkCert}</span>
                    <Button variant="ghost" size="sm">上传文件</Button>
                  </div>
                </EditRow>
              </div>
            ) : (
              <div className="detail-grid">
                <DetailRow label="京东店地址">
                  {brand.jdStoreUrl ? <a href={brand.jdStoreUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--color-module-current-base)' }}>{brand.jdStoreUrl}</a> : <span style={{ color: 'var(--color-neutral-400)' }}>未填写</span>}
                </DetailRow>
                <DetailRow label="天猫店地址">
                  {brand.tmallStoreUrl ? <a href={brand.tmallStoreUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--color-module-current-base)' }}>{brand.tmallStoreUrl}</a> : <span style={{ color: 'var(--color-neutral-400)' }}>未填写</span>}
                </DetailRow>
                <DetailRow label="商标证书" span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <svg viewBox="0 0 16 16" fill="none" style={{ width: 16, height: 16, color: 'var(--color-semantic-info)' }}><rect x="3" y="1.5" width="10" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M6 5h4M6 7.5h4M6 10h3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>
                    <span className="mono" style={{ fontSize: 'var(--text-sm)' }}>{brand.trademarkCert}</span>
                    <Button variant="ghost" size="sm">下载</Button>
                  </div>
                </DetailRow>
              </div>
            )}
          </Card>

          {/* 联系信息 */}
          <Card title="联系信息">
            {editing ? (
              <div className="detail-grid">
                <EditRow label="联系人"><input className="detail-input" defaultValue={brand.contactPerson} /></EditRow>
                <EditRow label="联系电话"><input className="detail-input" defaultValue={brand.contactPhone} /></EditRow>
                <EditRow label="地址" span><input className="detail-input" defaultValue={brand.address} /></EditRow>
              </div>
            ) : (
              <div className="detail-grid">
                <DetailRow label="联系人"><span style={{ fontWeight: 'var(--font-medium)' }}>{brand.contactPerson}</span></DetailRow>
                <DetailRow label="联系电话"><span className="mono">{brand.contactPhone}</span></DetailRow>
                <DetailRow label="地址" span>{brand.address || <span style={{ color: 'var(--color-neutral-400)' }}>未填写</span>}</DetailRow>
              </div>
            )}
          </Card>
        </div>

        {/* 系统信息 */}
        <Card style={{ marginTop: 'var(--space-6)' }} title="系统信息">
          <div className="detail-grid">
            <DetailRow label="创建人">{brand.createdBy}</DetailRow>
            <DetailRow label="创建时间"><span className="mono">{brand.createdAt}</span></DetailRow>
            <DetailRow label="最后更新"><span className="mono">{brand.updatedAt}</span></DetailRow>
          </div>
        </Card>
      </div>
    </>
  );
}
