import { TeaCategory, OrderStatus, StockStatus, NotificationType, QualityResult, QuotationStatus } from '../types';
import type {
  StatCardData,
  OrderItem,
  StockItem,
  AlertItemData,
  TodoItemData,
  ProductItem,
  NotificationItem,
  QualityItem,
  QuotationItem,
  TraceabilityItem,
  GradeItem,
  TeaCategoryDetail,
} from '../types';

/* ═══════════════════════════════════════════════════════════
 * Mock 数据
 * ═══════════════════════════════════════════════════════════ */

/* ── 工作台统计卡片 ── */
export const dashboardStats: StatCardData[] = [
  {
    label: '今日销售额',
    value: '128,560',
    unit: '¥',
    trend: { direction: 'up', value: '12.5%', label: '较昨日' },
    icon: <svg viewBox="0 0 18 18" fill="none"><path d="M3 14l3-4 3 2 3-5 3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  },
  {
    label: '本月采购额',
    value: '856,200',
    unit: '¥',
    trend: { direction: 'down', value: '3.2%', label: '较上月' },
    icon: <svg viewBox="0 0 18 18" fill="none"><path d="M3 5h12l-1.2 8H4.2L3 5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><path d="M7 5V3.5a2 2 0 014 0V5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  },
  {
    label: '库存总量',
    value: '42,680',
    unit: 'kg',
    trend: { direction: 'up', value: '5.8%', label: '较上月' },
    icon: <svg viewBox="0 0 18 18" fill="none"><rect x="3" y="5" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M3 9h12" stroke="currentColor" strokeWidth="1.3"/></svg>,
  },
  {
    label: '待处理订单',
    value: '23',
    trend: { direction: 'down', value: '8 个紧急' },
    icon: <svg viewBox="0 0 18 18" fill="none"><rect x="4" y="2" width="10" height="14" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M7 6h4M7 9h4M7 12h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  },
];

/* ── 库存预警 ── */
export const alertItems: AlertItemData[] = [
  { name: '正山小种 — 特级', stock: '12 kg', level: 'danger' },
  { name: '碧螺春 — 一级', stock: '8 kg', level: 'danger' },
  { name: '白毫银针 — 特级', stock: '25 kg', level: 'warning' },
  { name: '铁观音 — 一级', stock: '30 kg', level: 'warning' },
];

/* ── 待办事项 ── */
export const todoItems: TodoItemData[] = [
  { text: '审核采购订单 PO-2025-0147', time: '10:30', done: false },
  { text: '确认龙井春茶入库', time: '09:15', done: true },
  { text: '跟进客户华茗堂回款', time: '14:00', done: false },
  { text: '盘点武夷仓区红茶品类', time: '16:00', done: false },
  { text: '更新普洱熟茶商品规格', time: '17:30', done: false },
];

/* ── 采购订单 ── */
export const purchaseOrders: OrderItem[] = [
  { id: '1', code: 'PO-2025-0151', partner: '武夷山茶业', product: '大红袍', teaCategory: TeaCategory.OOLONG, quantity: '50 kg', amount: '¥ 28,500', status: OrderStatus.PENDING },
  { id: '2', code: 'PO-2025-0150', partner: '西湖龙井合作社', product: '明前龙井', teaCategory: TeaCategory.GREEN, quantity: '80 kg', amount: '¥ 56,000', status: OrderStatus.COMPLETED },
  { id: '3', code: 'PO-2025-0149', partner: '安溪铁观音集团', product: '清香铁观音', teaCategory: TeaCategory.OOLONG, quantity: '60 kg', amount: '¥ 18,200', status: OrderStatus.SHIPPING },
  { id: '4', code: 'PO-2025-0148', partner: '福鼎白茶厂', product: '白牡丹', teaCategory: TeaCategory.WHITE, quantity: '40 kg', amount: '¥ 32,800', status: OrderStatus.COMPLETED },
  { id: '5', code: 'PO-2025-0147', partner: '云南普洱茶业', product: '熟普洱', teaCategory: TeaCategory.DARK, quantity: '120 kg', amount: '¥ 45,600', status: OrderStatus.PENDING },
];

/* ── 销售订单 ── */
export const salesOrders: OrderItem[] = [
  { id: '1', code: 'SO-2025-0238', partner: '华茗堂茶庄', product: '正山小种', teaCategory: TeaCategory.RED, quantity: '30 kg', amount: '¥ 15,800', status: OrderStatus.APPROVED },
  { id: '2', code: 'SO-2025-0237', partner: '雅韵茶社', product: '碧螺春', teaCategory: TeaCategory.GREEN, quantity: '20 kg', amount: '¥ 8,600', status: OrderStatus.COMPLETED },
  { id: '3', code: 'SO-2025-0236', partner: '清心茶坊', product: '凤凰单丛', teaCategory: TeaCategory.OOLONG, quantity: '40 kg', amount: '¥ 22,400', status: OrderStatus.SHIPPING },
  { id: '4', code: 'SO-2025-0235', partner: '品茗轩', product: '白毫银针', teaCategory: TeaCategory.WHITE, quantity: '50 kg', amount: '¥ 38,000', status: OrderStatus.COMPLETED },
  { id: '5', code: 'SO-2025-0234', partner: '翠竹茶行', product: '六堡茶', teaCategory: TeaCategory.DARK, quantity: '25 kg', amount: '¥ 12,500', status: OrderStatus.PENDING },
];

/* ── 库存数据 ── */
export const stockItems: StockItem[] = [
  { id: '1', productName: '明前龙井 — 特级', teaCategory: TeaCategory.GREEN, warehouse: '杭州总仓', quantity: '280 kg', status: StockStatus.SUFFICIENT },
  { id: '2', productName: '正山小种 — 特级', teaCategory: TeaCategory.RED, warehouse: '武夷仓区', quantity: '12 kg', status: StockStatus.INSUFFICIENT },
  { id: '3', productName: '碧螺春 — 一级', teaCategory: TeaCategory.GREEN, warehouse: '苏州分仓', quantity: '8 kg', status: StockStatus.INSUFFICIENT },
  { id: '4', productName: '铁观音 — 一级', teaCategory: TeaCategory.OOLONG, warehouse: '安溪分仓', quantity: '30 kg', status: StockStatus.LOW },
  { id: '5', productName: '白毫银针 — 特级', teaCategory: TeaCategory.WHITE, warehouse: '福鼎分仓', quantity: '25 kg', status: StockStatus.LOW },
  { id: '6', productName: '熟普洱 — 三级', teaCategory: TeaCategory.DARK, warehouse: '云南总仓', quantity: '560 kg', status: StockStatus.SUFFICIENT },
];

/* ── 商品数据 ── */
export const productItems: ProductItem[] = [
  { id: '1', name: '明前龙井', spec: '特级', teaCategory: TeaCategory.GREEN, price: 580, unit: '/50g' },
  { id: '2', name: '碧螺春', spec: '一级', teaCategory: TeaCategory.GREEN, price: 420, unit: '/50g' },
  { id: '3', name: '白毫银针', spec: '特级', teaCategory: TeaCategory.WHITE, price: 960, unit: '/50g' },
  { id: '4', name: '白牡丹', spec: '一级', teaCategory: TeaCategory.WHITE, price: 380, unit: '/50g' },
  { id: '5', name: '君山银针', spec: '特级', teaCategory: TeaCategory.YELLOW, price: 880, unit: '/50g' },
  { id: '6', name: '大红袍', spec: '特级', teaCategory: TeaCategory.OOLONG, price: 720, unit: '/50g' },
  { id: '7', name: '铁观音', spec: '一级', teaCategory: TeaCategory.OOLONG, price: 320, unit: '/50g' },
  { id: '8', name: '凤凰单丛', spec: '特级', teaCategory: TeaCategory.OOLONG, price: 560, unit: '/50g' },
  { id: '9', name: '正山小种', spec: '特级', teaCategory: TeaCategory.RED, price: 480, unit: '/50g' },
  { id: '10', name: '祁门红茶', spec: '特级', teaCategory: TeaCategory.RED, price: 520, unit: '/50g' },
  { id: '11', name: '熟普洱', spec: '三级', teaCategory: TeaCategory.DARK, price: 260, unit: '/50g' },
  { id: '12', name: '六堡茶', spec: '二级', teaCategory: TeaCategory.DARK, price: 180, unit: '/50g' },
];

/* ── 销售统计卡片 ── */
export const salesStats: StatCardData[] = [
  {
    label: '本月销售额', value: '328,600', unit: '¥',
    trend: { direction: 'up', value: '18.3%' },
    icon: <svg viewBox="0 0 18 18" fill="none"><path d="M3 14l3-4 3 2 3-5 3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  },
  {
    label: '本月订单数', value: '156',
    trend: { direction: 'up', value: '+12 单' },
    icon: <svg viewBox="0 0 18 18" fill="none"><rect x="4" y="2" width="10" height="14" rx="2" stroke="currentColor" strokeWidth="1.3"/></svg>,
  },
  {
    label: '客单价', value: '2,108', unit: '¥',
    trend: { direction: 'down', value: '2.4%' },
    icon: <svg viewBox="0 0 18 18" fill="none"><rect x="2" y="4" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.3"/></svg>,
  },
  {
    label: '退货率', value: '1.2%',
    trend: { direction: 'up', value: '0.3%' },
    icon: <svg viewBox="0 0 18 18" fill="none"><path d="M3 5h12l-1.2 8H4.2L3 5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>,
  },
];

/* ── 财务统计卡片 ── */
export const financeStats: StatCardData[] = [
  {
    label: '应收金额', value: '186,400', unit: '¥',
    trend: { direction: 'up', value: '12 笔待收' },
    icon: <svg viewBox="0 0 18 18" fill="none"><path d="M3 14l3-4 3 2 3-5 3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  },
  {
    label: '应付金额', value: '124,800', unit: '¥',
    trend: { direction: 'down', value: '8 笔待付' },
    icon: <svg viewBox="0 0 18 18" fill="none"><path d="M3 5h12l-1.2 8H4.2L3 5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><path d="M7 5V3.5a2 2 0 014 0V5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  },
  {
    label: '本月收入', value: '328,600', unit: '¥',
    trend: { direction: 'up', value: '18.3%' },
    icon: <svg viewBox="0 0 18 18" fill="none"><rect x="3" y="5" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M3 9h12" stroke="currentColor" strokeWidth="1.3"/></svg>,
  },
  {
    label: '本月支出', value: '215,400', unit: '¥',
    trend: { direction: 'down', value: '5.6%' },
    icon: <svg viewBox="0 0 18 18" fill="none"><rect x="4" y="2" width="10" height="14" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M7 6h4M7 9h4M7 12h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  },
];

/* ── 统计模块卡片 ── */
export const statisticsStats: StatCardData[] = [
  {
    label: '总销售额', value: '2,186,400', unit: '¥',
    trend: { direction: 'up', value: '24.5% 同比' },
    icon: <svg viewBox="0 0 18 18" fill="none"><path d="M3 14l3-4 3 2 3-5 3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  },
  {
    label: '总采购额', value: '1,452,800', unit: '¥',
    trend: { direction: 'up', value: '15.2% 同比' },
    icon: <svg viewBox="0 0 18 18" fill="none"><path d="M3 5h12l-1.2 8H4.2L3 5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>,
  },
  {
    label: '毛利率', value: '33.5%',
    trend: { direction: 'up', value: '2.1% 同比' },
    icon: <svg viewBox="0 0 18 18" fill="none"><rect x="2" y="4" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.3"/></svg>,
  },
  {
    label: '总订单数', value: '1,826',
    trend: { direction: 'up', value: '8.7% 同比' },
    icon: <svg viewBox="0 0 18 18" fill="none"><rect x="4" y="2" width="10" height="14" rx="2" stroke="currentColor" strokeWidth="1.3"/></svg>,
  },
];

/* ── 折线图数据 ── */
export const lineChartData = {
  labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月'],
  series: [
    { name: '绿茶', color: 'var(--color-tea-green)', data: [110, 88, 95, 65, 72, 50, 55] },
    { name: '白茶', color: 'var(--color-tea-white)', data: [155, 140, 130, 120, 115, 105, 95] },
    { name: '红茶', color: 'var(--color-tea-red)', data: [130, 120, 110, 100, 90, 85, 75] },
    { name: '青茶', color: 'var(--color-tea-oolong)', data: [165, 155, 148, 138, 132, 125, 115] },
    { name: '黑茶', color: 'var(--color-tea-dark)', data: [180, 175, 168, 162, 155, 148, 140] },
    { name: '黄茶', color: 'var(--color-tea-yellow)', data: [175, 168, 162, 158, 150, 142, 135] },
    { name: '花草茶', color: 'var(--color-tea-flower)', data: [95, 88, 105, 115, 98, 85, 78] },
  ],
};

/* ── 饼图数据 ── */
export const pieChartData = [
  { name: '绿茶', value: 25, color: 'var(--color-tea-green)' },
  { name: '红茶', value: 20, color: 'var(--color-tea-red)' },
  { name: '青茶', value: 16, color: 'var(--color-tea-oolong)' },
  { name: '白茶', value: 14, color: 'var(--color-tea-white)' },
  { name: '黑茶', value: 13, color: 'var(--color-tea-dark)' },
  { name: '黄茶', value: 12, color: 'var(--color-tea-yellow)' },
];

/* ── 通知数据 ── */
export const notifications: NotificationItem[] = [
  { id: '1', type: NotificationType.QUALITY, title: '质检不合格', content: '龙井特级-批次BH20250701 水分含量超标(8.2%>7.0%)，建议退货处理', time: '10分钟前', read: false },
  { id: '2', type: NotificationType.INVENTORY, title: '到货通知', content: '采购订单PO-2025-1089已到货，请安排验收', time: '30分钟前', read: false },
  { id: '3', type: NotificationType.ORDER, title: '订单状态变更', content: '销售订单SO-2025-0238已确认，等待发货', time: '1小时前', read: false },
  { id: '4', type: NotificationType.SYSTEM, title: '系统维护通知', content: '系统将于今晚22:00-23:00进行例行维护，届时可能影响使用', time: '2小时前', read: true },
  { id: '5', type: NotificationType.QUALITY, title: '质检合格', content: '白牡丹一级-批次BH20250702 质检合格，已入库', time: '3小时前', read: true },
  { id: '6', type: NotificationType.INVENTORY, title: '库存预警', content: '正山小种特级库存不足，当前仅剩12kg，请及时补货', time: '4小时前', read: false },
  { id: '7', type: NotificationType.ORDER, title: '新订单提醒', content: '客户华茗堂茶庄下达新订单SO-2025-0240，金额¥18,600', time: '5小时前', read: true },
  { id: '8', type: NotificationType.SYSTEM, title: '审批提醒', content: '采购订单PO-2025-0151等待您的审批', time: '6小时前', read: false },
];

/* ── 质检统计 ── */
export const qualityStats = { pending: 12, qualified: 86, unqualified: 3, rate: 96.6 };

/* ── 质检数据 ── */
export const qualityItems: QualityItem[] = [
  { id: '1', batchCode: 'BH20250701', productName: '明前龙井', teaCategory: TeaCategory.GREEN, grade: '特级', moisture: 6.8, ash: 5.2, pesticideResidue: 0.02, sensory: '外形完整/汤色明亮/香气馥郁', result: QualityResult.QUALIFIED },
  { id: '2', batchCode: 'BH20250702', productName: '白牡丹', teaCategory: TeaCategory.WHITE, grade: '一级', moisture: 7.5, ash: 5.8, pesticideResidue: 0.03, sensory: '毫心肥壮/汤色杏黄/清甜醇厚', result: QualityResult.QUALIFIED },
  { id: '3', batchCode: 'BH20250703', productName: '大红袍', teaCategory: TeaCategory.OOLONG, grade: '特级', moisture: 5.6, ash: 4.8, pesticideResidue: 0.01, sensory: '岩骨花香/汤色橙黄/回甘悠长', result: QualityResult.QUALIFIED },
  { id: '4', batchCode: 'BH20250704', productName: '熟普洱', teaCategory: TeaCategory.DARK, grade: '三级', moisture: 10.2, ash: 6.1, pesticideResidue: 0.04, sensory: '汤色红浓/陈香显露/滋味醇厚', result: QualityResult.PENDING },
  { id: '5', batchCode: 'BH20250705', productName: '正山小种', teaCategory: TeaCategory.RED, grade: '特级', moisture: 7.8, ash: 6.5, pesticideResidue: 0.05, sensory: '松烟香/汤色红亮/桂圆味', result: QualityResult.UNQUALIFIED },
  { id: '6', batchCode: 'BH20250706', productName: '君山银针', teaCategory: TeaCategory.YELLOW, grade: '特级', moisture: 6.5, ash: 5.5, pesticideResidue: 0.02, sensory: '芽头肥壮/汤色杏黄/甜香持久', result: QualityResult.QUALIFIED },
  { id: '7', batchCode: 'BH20250707', productName: '碧螺春', teaCategory: TeaCategory.GREEN, grade: '一级', moisture: 7.2, ash: 5.6, pesticideResidue: 0.03, sensory: '条索纤细/汤色碧绿/花果香', result: QualityResult.PENDING },
  { id: '8', batchCode: 'BH20250708', productName: '铁观音', teaCategory: TeaCategory.OOLONG, grade: '二级', moisture: 6.1, ash: 5.0, pesticideResidue: 0.02, sensory: '卷曲结实/汤色金黄/兰花香', result: QualityResult.QUALIFIED },
];

/* ── 报价统计 ── */
export const quotationStats = { pendingReply: 8, quoted: 24, expired: 3, conversionRate: 65.2 };

/* ── 报价数据 ── */
export const quotationItems: QuotationItem[] = [
  { id: '1', quotationCode: 'QT20250701', customer: '华茗堂茶庄', teaCategory: TeaCategory.GREEN, grade: '特级', unitPrice: 2800, quantity: 50, amount: 140000, validUntil: '2025-07-15', status: QuotationStatus.PENDING_REPLY },
  { id: '2', quotationCode: 'QT20250702', customer: '雅韵茶社', teaCategory: TeaCategory.OOLONG, grade: '特级', unitPrice: 3200, quantity: 30, amount: 96000, validUntil: '2025-07-20', status: QuotationStatus.QUOTED },
  { id: '3', quotationCode: 'QT20250703', customer: '清心茶坊', teaCategory: TeaCategory.RED, grade: '一级', unitPrice: 860, quantity: 80, amount: 68800, validUntil: '2025-06-30', status: QuotationStatus.EXPIRED },
  { id: '4', quotationCode: 'QT20250704', customer: '品茗轩', teaCategory: TeaCategory.WHITE, grade: '特级', unitPrice: 4500, quantity: 20, amount: 90000, validUntil: '2025-07-25', status: QuotationStatus.CONVERTED },
  { id: '5', quotationCode: 'QT20250705', customer: '翠竹茶行', teaCategory: TeaCategory.DARK, grade: '二级', unitPrice: 520, quantity: 100, amount: 52000, validUntil: '2025-07-18', status: QuotationStatus.QUOTED },
  { id: '6', quotationCode: 'QT20250706', customer: '茗香斋', teaCategory: TeaCategory.YELLOW, grade: '特级', unitPrice: 3800, quantity: 15, amount: 57000, validUntil: '2025-07-22', status: QuotationStatus.PENDING_REPLY },
  { id: '7', quotationCode: 'QT20250707', customer: '和风茶屋', teaCategory: TeaCategory.GREEN, grade: '一级', unitPrice: 1200, quantity: 60, amount: 72000, validUntil: '2025-07-16', status: QuotationStatus.QUOTED },
  { id: '8', quotationCode: 'QT20250708', customer: '云隐茶庄', teaCategory: TeaCategory.OOLONG, grade: '二级', unitPrice: 980, quantity: 40, amount: 39200, validUntil: '2025-07-28', status: QuotationStatus.PENDING_REPLY },
];

/* ── 溯源数据 ── */
export const traceabilityItems: TraceabilityItem[] = [
  {
    id: '1', batchCode: 'BH20250701', productName: '明前龙井', teaCategory: TeaCategory.GREEN, grade: '特级', source: '西湖产区', inboundDate: '2025-07-01', status: StockStatus.SUFFICIENT,
    traceSteps: [
      { stage: '茶园', location: '西湖龙井村 · 海拔380m', date: '2025-03-28', operator: '陈师傅' },
      { stage: '加工', location: '炒青工艺 · 炒制车间', date: '2025-03-29', operator: '王师傅' },
      { stage: '质检', location: '质检中心 · 水分6.8%/感官92分', date: '2025-07-01', operator: '李工' },
      { stage: '入库', location: '杭州总仓 · A区冷藏-03架', date: '2025-07-01', operator: '赵仓管' },
      { stage: '出库', location: '尚未出库', date: '-', operator: '-' },
    ],
  },
  {
    id: '2', batchCode: 'BH20250702', productName: '白牡丹', teaCategory: TeaCategory.WHITE, grade: '一级', source: '福鼎产区', inboundDate: '2025-07-02', status: StockStatus.SUFFICIENT,
    traceSteps: [
      { stage: '茶园', location: '福鼎太姥山 · 海拔600m', date: '2025-04-10', operator: '郑师傅' },
      { stage: '加工', location: '萎凋工艺 · 自然萎凋车间', date: '2025-04-11', operator: '林师傅' },
      { stage: '质检', location: '质检中心 · 水分7.5%/感官88分', date: '2025-07-02', operator: '李工' },
      { stage: '入库', location: '福鼎分仓 · B区常温-05架', date: '2025-07-02', operator: '陈仓管' },
      { stage: '出库', location: '部分出库 · 30kg→SO-2025-0235', date: '2025-07-03', operator: '陈仓管' },
    ],
  },
  {
    id: '3', batchCode: 'BH20250703', productName: '大红袍', teaCategory: TeaCategory.OOLONG, grade: '特级', source: '武夷山产区', inboundDate: '2025-07-03', status: StockStatus.LOW,
    traceSteps: [
      { stage: '茶园', location: '武夷山正岩 · 海拔400m', date: '2025-05-15', operator: '黄师傅' },
      { stage: '加工', location: '做青工艺 · 焙火车间', date: '2025-05-16', operator: '吴师傅' },
      { stage: '质检', location: '质检中心 · 水分5.6%/感官95分', date: '2025-07-03', operator: '李工' },
      { stage: '入库', location: '武夷仓区 · C区恒温-01架', date: '2025-07-03', operator: '张仓管' },
      { stage: '出库', location: '尚未出库', date: '-', operator: '-' },
    ],
  },
  {
    id: '4', batchCode: 'BH20250704', productName: '熟普洱', teaCategory: TeaCategory.DARK, grade: '三级', source: '云南勐海产区', inboundDate: '2025-07-04', status: StockStatus.SUFFICIENT,
    traceSteps: [
      { stage: '茶园', location: '云南勐海 · 海拔1200m', date: '2025-03-20', operator: '岩师傅' },
      { stage: '加工', location: '渥堆发酵 · 发酵车间', date: '2025-04-15', operator: '刀师傅' },
      { stage: '质检', location: '质检中心 · 水分10.2%/感官80分', date: '2025-07-04', operator: '李工' },
      { stage: '入库', location: '云南总仓 · D区通风-08架', date: '2025-07-04', operator: '刘仓管' },
      { stage: '出库', location: '尚未出库', date: '-', operator: '-' },
    ],
  },
  {
    id: '5', batchCode: 'BH20250705', productName: '正山小种', teaCategory: TeaCategory.RED, grade: '特级', source: '武夷山桐木关', inboundDate: '2025-07-05', status: StockStatus.INSUFFICIENT,
    traceSteps: [
      { stage: '茶园', location: '武夷山桐木关 · 海拔900m', date: '2025-04-25', operator: '江师傅' },
      { stage: '加工', location: '松烟熏制 · 传统工艺车间', date: '2025-04-26', operator: '曹师傅' },
      { stage: '质检', location: '质检中心 · 水分7.8%/感官85分', date: '2025-07-05', operator: '李工' },
      { stage: '入库', location: '武夷仓区 · A区冷藏-02架', date: '2025-07-05', operator: '张仓管' },
      { stage: '出库', location: '已全部出库 · 50kg→SO-2025-0238', date: '2025-07-06', operator: '张仓管' },
    ],
  },
  {
    id: '6', batchCode: 'BH20250706', productName: '君山银针', teaCategory: TeaCategory.YELLOW, grade: '特级', source: '洞庭湖君山产区', inboundDate: '2025-07-06', status: StockStatus.SUFFICIENT,
    traceSteps: [
      { stage: '茶园', location: '洞庭湖君山岛 · 海拔60m', date: '2025-04-05', operator: '刘师傅' },
      { stage: '加工', location: '闷黄工艺 · 加工车间', date: '2025-04-06', operator: '何师傅' },
      { stage: '质检', location: '质检中心 · 水分6.5%/感官91分', date: '2025-07-06', operator: '李工' },
      { stage: '入库', location: '苏州分仓 · A区冷藏-01架', date: '2025-07-06', operator: '王仓管' },
      { stage: '出库', location: '尚未出库', date: '-', operator: '-' },
    ],
  },
  {
    id: '7', batchCode: 'BH20250707', productName: '碧螺春', teaCategory: TeaCategory.GREEN, grade: '一级', source: '苏州洞庭山产区', inboundDate: '2025-07-07', status: StockStatus.INSUFFICIENT,
    traceSteps: [
      { stage: '茶园', location: '苏州洞庭东山 · 海拔200m', date: '2025-03-25', operator: '徐师傅' },
      { stage: '加工', location: '揉捻工艺 · 炒制车间', date: '2025-03-25', operator: '周师傅' },
      { stage: '质检', location: '质检中心 · 水分7.2%/感官86分', date: '2025-07-07', operator: '李工' },
      { stage: '入库', location: '苏州分仓 · B区冷藏-04架', date: '2025-07-07', operator: '王仓管' },
      { stage: '出库', location: '部分出库 · 8kg→SO-2025-0237', date: '2025-07-08', operator: '王仓管' },
    ],
  },
];

/* ── 品级数据 ── */
export const gradeItems: GradeItem[] = [
  { id: '1', name: '特级', applicableCategories: [TeaCategory.GREEN, TeaCategory.WHITE, TeaCategory.YELLOW, TeaCategory.OOLONG, TeaCategory.RED, TeaCategory.DARK], pricingFactor: 3.0, sensoryStandard: '外形完整匀齐/汤色明亮清澈/香气馥郁持久/滋味鲜醇回甘/叶底嫩匀明亮', productCount: 12, active: true },
  { id: '2', name: '一级', applicableCategories: [TeaCategory.GREEN, TeaCategory.WHITE, TeaCategory.YELLOW, TeaCategory.OOLONG, TeaCategory.RED, TeaCategory.DARK], pricingFactor: 1.5, sensoryStandard: '外形较完整/汤色清亮/香气纯正/滋味醇厚/叶底较匀', productCount: 28, active: true },
  { id: '3', name: '二级', applicableCategories: [TeaCategory.GREEN, TeaCategory.OOLONG, TeaCategory.RED, TeaCategory.DARK], pricingFactor: 1.0, sensoryStandard: '外形尚完整/汤色尚亮/香气尚纯/滋味平和/叶底尚软', productCount: 35, active: true },
  { id: '4', name: '三级', applicableCategories: [TeaCategory.OOLONG, TeaCategory.RED, TeaCategory.DARK], pricingFactor: 0.7, sensoryStandard: '外形欠完整/汤色稍暗/香气平淡/滋味稍粗/叶底稍硬', productCount: 18, active: true },
  { id: '5', name: '等外', applicableCategories: [TeaCategory.DARK], pricingFactor: 0.4, sensoryStandard: '外形粗松/汤色暗淡/香气低弱/滋味粗涩/叶底粗硬', productCount: 5, active: false },
];

/* ── 茶类详情数据（从 teaCategories 共享数据源导入） ── */
export { teaCategories as teaCategoryDetails } from './teaCategories';

/* ── 茶类分析饼图数据 ── */
export const teaCategoryPieData = [
  { name: '绿茶', value: 30, color: 'var(--color-tea-green)' },
  { name: '红茶', value: 22, color: 'var(--color-tea-red)' },
  { name: '青茶', value: 18, color: 'var(--color-tea-oolong)' },
  { name: '白茶', value: 12, color: 'var(--color-tea-white)' },
  { name: '黑茶', value: 11, color: 'var(--color-tea-dark)' },
  { name: '黄茶', value: 7, color: 'var(--color-tea-yellow)' },
  { name: '花草茶', value: 8, color: 'var(--color-tea-flower)' },
];

/* ── 茶类分析折线图数据 ── */
export const teaCategoryLineData = {
  labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  series: [
    { name: '绿茶', color: 'var(--color-tea-green)', data: [85, 72, 130, 145, 98, 65, 55, 60, 88, 95, 78, 90] },
    { name: '红茶', color: 'var(--color-tea-red)', data: [65, 58, 70, 85, 92, 78, 72, 68, 95, 110, 88, 82] },
    { name: '花草茶', color: 'var(--color-tea-flower)', data: [45, 38, 52, 60, 72, 55, 48, 42, 58, 65, 50, 55] },
  ],
};
