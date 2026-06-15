import { useMemo } from 'react';
import ContentHeader from '../../components/layout/ContentHeader';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Tag from '../../components/common/Tag';
import LineChart from '../../components/charts/LineChart';
import PieChart from '../../components/charts/PieChart';
import type { StatCardData } from '../../types';
import { TeaCategory } from '../../types';
import { teaProducts } from '../../data/teaProducts';
import { brandItems } from '../../data/brands';
import { teaCategoryData, productCategoryLabels } from '../../data/productCategories';

/** 通过茶类中文名称获取 TeaCategory 枚举 */
function nameToTeaCategory(name: string): TeaCategory | undefined {
  const map: Record<string, TeaCategory> = {
    '绿茶': TeaCategory.GREEN, '红茶': TeaCategory.RED, '青茶': TeaCategory.OOLONG,
    '白茶': TeaCategory.WHITE, '黄茶': TeaCategory.YELLOW, '黑茶': TeaCategory.DARK,
    '花草茶': TeaCategory.FLOWER,
  };
  return map[name];
}

export default function ProductOverview() {
  // ── 统计数据 ──
  const stats = useMemo(() => {
    const totalProducts = teaProducts.length;
    const totalBrands = brandItems.length;
    const onShelf = teaProducts.filter(p => p.shelfStatus === 'on').length;
    const lowStock = teaProducts.filter(p => p.stock <= p.stockAlert).length;
    const totalStock = teaProducts.reduce((s, p) => s + (p.stock || 0), 0);
    const totalSales = teaProducts.reduce((s, p) => s + (p.totalSales || 0), 0);
    const avgPrice = teaProducts.reduce((s, p) => s + (p.marketPrice || 0), 0) / totalProducts;
    const comboTea = teaProducts.filter(p => {
      const cats = p.categories || [p.category];
      const teaL2Names = (teaCategoryData.children || []).map(c => c.name);
      const teaCats = cats.filter(c => teaL2Names.some(l2 => c.startsWith(l2)));
      return new Set(teaCats.map(c => teaL2Names.find(l2 => c.startsWith(l2)) || c)).size > 1;
    }).length;
    const withTeaware = teaProducts.filter(p => {
      const cats = p.categories || [p.category];
      return cats.some(c => {
        const l2 = c.split('-')[0];
        return l2 === '茶壶' || l2 === '茶杯' || l2 === '茶盘' || l2 === '茶具套装' || l2 === '茶道配件';
      }) || p.includesTeaware;
    }).length;

    return { totalProducts, totalBrands, onShelf, lowStock, totalStock, totalSales, avgPrice, comboTea, withTeaware };
  }, []);

  const statCards: StatCardData[] = [
    {
      label: '商品总数', value: String(stats.totalProducts), unit: '件',
      trend: { direction: 'up', value: '35 件在售' },
      icon: <svg viewBox="0 0 18 18" fill="none"><path d="M9 2L3 5v8l6 3 6-3V5L9 2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>,
    },
    {
      label: '合作品牌', value: String(stats.totalBrands), unit: '个',
      trend: { direction: 'up', value: '+2 本月' },
      icon: <svg viewBox="0 0 18 18" fill="none"><path d="M10 3l6 3.5v7L10 17l-6-3.5v-7L10 3z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>,
    },
    {
      label: '库存总量', value: stats.totalStock.toLocaleString(), unit: '件',
      trend: { direction: 'down', value: `${stats.lowStock} 件紧张` },
      icon: <svg viewBox="0 0 18 18" fill="none"><rect x="3" y="5" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M3 9h12" stroke="currentColor" strokeWidth="1.3"/></svg>,
    },
    {
      label: '累计销量', value: stats.totalSales.toLocaleString(), unit: '件',
      trend: { direction: 'up', value: '12.5% 同比' },
      icon: <svg viewBox="0 0 18 18" fill="none"><path d="M3 14l3-4 3 2 3-5 3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    },
  ];

  // ── 茶类分布 ──
  const categoryDistribution = useMemo(() => {
    const teaL2Names = (teaCategoryData.children || []).map(c => c.name);
    const counts: Record<string, number> = {};
    teaL2Names.forEach(n => counts[n] = 0);
    teaProducts.forEach(p => {
      const cats = p.categories || [p.category];
      cats.forEach(c => {
        const l2 = c.split('-')[0];
        if (counts[l2] !== undefined) counts[l2]++;
      });
    });
    const colors: Record<string, string> = {
      '绿茶': 'var(--color-tea-green)', '红茶': 'var(--color-tea-red)', '青茶': 'var(--color-tea-oolong)',
      '白茶': 'var(--color-tea-white)', '黄茶': 'var(--color-tea-yellow)', '黑茶': 'var(--color-tea-dark)',
      '花草茶': 'var(--color-tea-flower)',
    };
    const total = Object.values(counts).reduce((s, v) => s + v, 0) || 1;
    return teaL2Names.filter(n => counts[n] > 0).map(n => ({
      name: n,
      value: Math.round((counts[n] / total) * 100),
      count: counts[n],
      color: colors[n] || 'var(--color-neutral-400)',
    }));
  }, []);

  // ── 采购销售趋势 ──
  const trendData = {
    labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月'],
    series: [
      { name: '采购额', color: '#0DAFC6', data: [18, 15, 22, 20, 25, 23, 28] },
      { name: '销售额', color: 'var(--color-module-current-base)', data: [22, 19, 28, 26, 32, 30, 35] },
      { name: '利润', color: '#F18F4D', data: [4, 4, 6, 6, 7, 7, 7] },
    ],
  };

  // ── 品类利润分布 ──
  const profitDistribution = [
    { name: '绿茶', value: 32, color: 'var(--color-tea-green)' },
    { name: '红茶', value: 24, color: 'var(--color-tea-red)' },
    { name: '青茶', value: 18, color: 'var(--color-tea-oolong)' },
    { name: '白茶', value: 12, color: 'var(--color-tea-white)' },
    { name: '黑茶', value: 8, color: 'var(--color-tea-dark)' },
    { name: '黄茶', value: 4, color: 'var(--color-tea-yellow)' },
    { name: '花草茶', value: 2, color: 'var(--color-tea-flower)' },
  ];

  // ── 商品排行 TOP10 ──
  const topProducts = useMemo(() => {
    return [...teaProducts]
      .sort((a, b) => (b.totalSales || 0) - (a.totalSales || 0))
      .slice(0, 10)
      .map(p => ({
        ...p,
        teaL2: p.category.split('-')[0],
      }));
  }, []);

  // ── 库存预警 ──
  const lowStockProducts = useMemo(() => {
    return teaProducts
      .filter(p => p.stock <= p.stockAlert)
      .sort((a, b) => (a.stock / a.stockAlert) - (b.stock / b.stockAlert));
  }, []);

  // ── 品牌商品数排行 ──
  const brandRank = useMemo(() => {
    const counts: Record<string, number> = {};
    teaProducts.forEach(p => {
      counts[p.brand] = (counts[p.brand] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
  }, []);

  return (
    <>
      <ContentHeader title="商品概览" breadcrumbs={['商品', '商品概览']} />
      <div className="content-body">
        {/* 核心指标 */}
        <div className="stat-cards">
          {statCards.map((s, i) => <StatCard key={i} data={s} />)}
        </div>

        {/* 采购销售趋势 + 品类分布 */}
        <div className="grid-2">
          <Card title="采购·销售·利润趋势">
            <LineChart data={trendData} />
          </Card>
          <Card title="茶类商品分布">
            <PieChart data={categoryDistribution} />
          </Card>
        </div>

        {/* 品类利润分布 + 品牌商品数排行 */}
        <div className="grid-2" style={{ marginTop: 'var(--space-4)' }}>
          <Card title="品类利润占比">
            <PieChart data={profitDistribution} />
          </Card>
          <Card title="品牌商品数排行">
            <div style={{ padding: 'var(--space-2) 0' }}>
              {brandRank.map(([name, count], i) => {
                const maxCount = brandRank[0][1];
                return (
                  <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
                    <span style={{ width: 20, textAlign: 'center', fontSize: 'var(--text-sm)', fontWeight: i < 3 ? 'var(--font-semibold)' : 'normal', color: i < 3 ? 'var(--color-module-current-base)' : 'var(--color-neutral-500)', flexShrink: 0 }}>{i + 1}</span>
                    <span style={{ width: 80, fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--color-neutral-700)', flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
                    <div style={{ flex: 1, height: 8, background: 'var(--color-neutral-100)', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ width: `${(count / maxCount) * 100}%`, height: '100%', borderRadius: 4, background: i < 3 ? 'var(--color-module-current-base)' : 'var(--color-neutral-300)', transition: 'width 0.3s' }} />
                    </div>
                    <span style={{ width: 30, textAlign: 'right', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family-mono)', color: 'var(--color-neutral-600)', flexShrink: 0 }}>{count}</span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* 销量排行 TOP10 */}
        <Card title="销量排行 TOP10" style={{ marginTop: 'var(--space-4)' }}>
          <Table
            headers={['排名', '商品名称', '品牌', '分类', '规格', '售价', '库存', '销量', '状态']}
            rows={topProducts.map((p, i) => [
              <span style={{ fontWeight: i < 3 ? 'var(--font-semibold)' : 'normal', color: i < 3 ? 'var(--color-module-current-base)' : 'inherit', fontFamily: 'var(--font-family-mono)' }}>{i + 1}</span>,
              <span style={{ fontWeight: 'var(--font-medium)' }}>{p.name}</span>,
              <span>{p.brand}</span>,
              (() => { const cat = nameToTeaCategory(p.teaL2); return cat ? <Tag category={cat} /> : <span>{p.teaL2}</span>; })(),
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-500)' }}>{p.spec}</span>,
              <span className="mono">¥{p.marketPrice}</span>,
              <span className="mono" style={{ color: p.stock <= p.stockAlert ? 'var(--color-error-500)' : 'inherit' }}>{p.stock}</span>,
              <span className="mono" style={{ fontWeight: 'var(--font-medium)' }}>{p.totalSales?.toLocaleString()}</span>,
              <span style={{
                padding: '2px 8px', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-medium)',
                background: p.shelfStatus === 'on' ? 'var(--color-success-50)' : 'var(--color-neutral-100)',
                color: p.shelfStatus === 'on' ? 'var(--color-success-600)' : 'var(--color-neutral-500)',
              }}>{p.shelfStatus === 'on' ? '在售' : '下架'}</span>,
            ])}
          />
        </Card>

        {/* 库存预警 */}
        {lowStockProducts.length > 0 && (
          <Card title="库存预警" style={{ marginTop: 'var(--space-4)' }}>
            <Table
              headers={['商品名称', '品牌', '当前库存', '预警线', '库存状态']}
              rows={lowStockProducts.map(p => {
                const ratio = p.stock / p.stockAlert;
                const level = ratio <= 0.3 ? 'danger' : ratio <= 0.7 ? 'warning' : 'low';
                return [
                  <span style={{ fontWeight: 'var(--font-medium)' }}>{p.name}</span>,
                  <span>{p.brand}</span>,
                  <span className="mono">{p.stock}</span>,
                  <span className="mono" style={{ color: 'var(--color-neutral-400)' }}>{p.stockAlert}</span>,
                  <span style={{
                    padding: '2px 8px', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-medium)',
                    background: level === 'danger' ? 'var(--color-error-50)' : level === 'warning' ? 'var(--color-warning-50)' : 'var(--color-info-50)',
                    color: level === 'danger' ? 'var(--color-error-500)' : level === 'warning' ? 'var(--color-warning-500)' : 'var(--color-info-500)',
                  }}>{level === 'danger' ? '严重不足' : level === 'warning' ? '库存偏低' : '接近预警'}</span>,
                ];
              })}
            />
          </Card>
        )}
      </div>
    </>
  );
}
