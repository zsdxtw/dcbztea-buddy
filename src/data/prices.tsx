/**
 * 价格体系数据源
 * 包含：采购价规则（商品+供应商）、VIP销售价规则（商品+客户）
 * 基准价（市场价/京东价/天猫价/销售价）存储于商品档案 teaProducts.tsx
 * 订单实价（采购实价/销售实价）存储于订单明细，见 PurchaseOrders.tsx / SalesOrders.tsx
 */
import type { PurchasePriceRule, VipPriceRule } from '../types';
import { teaProducts } from './teaProducts';

/* ── 供应商列表（与 ProductPrice.tsx 保持一致） ── */
export const PRICE_SUPPLIERS = [
  { id: 's1', name: '西湖龙井合作社' },
  { id: 's2', name: '武夷山茶业' },
  { id: 's3', name: '安溪铁观音集团' },
  { id: 's4', name: '福鼎白茶厂' },
  { id: 's5', name: '云南普洱茶业' },
  { id: 's6', name: '正山堂茶业' },
  { id: 's7', name: '八马茶业供应链' },
  { id: 's8', name: '大益集团' },
];

/* ── 客户列表（与 ProductPrice.tsx 保持一致） ── */
export const PRICE_CUSTOMERS = [
  { id: 'c1', name: '华茗堂茶庄', type: '直营' },
  { id: 'c2', name: '清心茶坊', type: '直营' },
  { id: 'c3', name: '浦发银行', type: '间营' },
  { id: 'c4', name: '交通银行', type: '间营' },
  { id: 'c5', name: '天福茗茶（渠道）', type: '渠道' },
  { id: 'c6', name: '八马茶业（渠道）', type: '渠道' },
  { id: 'c7', name: '茶道达人小李', type: '带货' },
  { id: 'c8', name: '茗香阁直播', type: '带货' },
];

/* ── 采购价规则数据 ── */
function generatePurchasePriceRules(): PurchasePriceRule[] {
  const rules: PurchasePriceRule[] = [];
  let idx = 0;
  // 每个商品关联 2-3 个供应商
  teaProducts.forEach(p => {
    const supplierCount = 2 + (idx % 2);
    const usedSuppliers = PRICE_SUPPLIERS.slice(idx % PRICE_SUPPLIERS.length, (idx % PRICE_SUPPLIERS.length) + supplierCount);
    usedSuppliers.forEach(s => {
      // 采购折扣率 45%-65%
      const discount = 0.45 + ((idx * 7) % 20) / 100;
      const purchasePrice = Math.round(p.marketPrice * discount);
      rules.push({
        id: `ppr_${++idx}`,
        productId: p.id,
        productName: p.name,
        brand: p.brand,
        category: p.category.split('-')[0],
        supplierId: s.id,
        supplierName: s.name,
        marketPrice: p.marketPrice,
        purchasePrice,
        discountRate: Math.round(discount * 100),
        validFrom: '2026-01-01',
        validTo: '2026-12-31',
        status: 'active',
        lastAdjustDate: '2026-06-01',
        lastAdjustNote: '年度调价',
      });
    });
  });
  return rules;
}

export const purchasePriceRules: PurchasePriceRule[] = generatePurchasePriceRules();

/* ── VIP 销售价规则数据 ── */
function generateVipPriceRules(): VipPriceRule[] {
  const rules: VipPriceRule[] = [];
  let idx = 0;
  // 前 15 个商品，每个关联 3-4 个客户
  teaProducts.slice(0, 15).forEach(p => {
    const customerCount = 3 + (idx % 2);
    const usedCustomers = PRICE_CUSTOMERS.slice(idx % PRICE_CUSTOMERS.length, (idx % PRICE_CUSTOMERS.length) + customerCount);
    usedCustomers.forEach(c => {
      // VIP 折扣率：直营 85-95%、间营 80-90%、渠道 70-80%、带货 75-85%
      const baseRate = c.type === '直营' ? 0.85 : c.type === '间营' ? 0.80 : c.type === '渠道' ? 0.70 : 0.75;
      const discount = baseRate + ((idx * 3) % 10) / 100;
      const vipPrice = Math.round(p.marketPrice * discount);
      rules.push({
        id: `vip_${++idx}`,
        productId: p.id,
        productName: p.name,
        brand: p.brand,
        category: p.category.split('-')[0],
        customerId: c.id,
        customerName: c.name,
        customerType: c.type,
        marketPrice: p.marketPrice,
        salesPrice: p.salesPrice,
        vipPrice,
        discountRate: Math.round(discount * 100),
        validFrom: '2026-01-01',
        validTo: '2026-12-31',
        status: 'active',
        remark: `${c.type}客户专属价`,
      });
    });
  });
  return rules;
}

export const vipPriceRules: VipPriceRule[] = generateVipPriceRules();

/* ── 工具函数 ── */

/** 根据商品ID和供应商ID获取采购价 */
export function getPurchasePrice(productId: string, supplierId: string): PurchasePriceRule | undefined {
  return purchasePriceRules.find(r => r.productId === productId && r.supplierId === supplierId && r.status === 'active');
}

/** 根据商品ID和客户ID获取VIP销售价 */
export function getVipPrice(productId: string, customerId: string): VipPriceRule | undefined {
  return vipPriceRules.find(r => r.productId === productId && r.customerId === customerId && r.status === 'active');
}

/**
 * 销售下单取价：VIP价 > 销售价 > 市场价
 * 返回 { price, source }
 */
export function getSalesDefaultPrice(productId: string, customerId: string): { price: number; source: 'vip' | 'sales' | 'market' } {
  const vip = getVipPrice(productId, customerId);
  if (vip) return { price: vip.vipPrice, source: 'vip' };

  const product = teaProducts.find(p => p.id === productId);
  if (product) {
    if (product.salesPrice) return { price: product.salesPrice, source: 'sales' };
    return { price: product.marketPrice, source: 'market' };
  }
  return { price: 0, source: 'market' };
}

/**
 * 采购下单取价：采购价 > 市场价 × 采购折扣率
 * 返回 { price, source }
 */
export function getPurchaseDefaultPrice(productId: string, supplierId: string): { price: number; source: 'purchase' | 'market' } {
  const rule = getPurchasePrice(productId, supplierId);
  if (rule) return { price: rule.purchasePrice, source: 'purchase' };

  const product = teaProducts.find(p => p.id === productId);
  if (product) return { price: Math.round(product.marketPrice * 0.55), source: 'market' };
  return { price: 0, source: 'market' };
}
