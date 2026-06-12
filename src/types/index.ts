/** 模块标识 */
export enum ModuleKey {
  DASHBOARD = 'dashboard',
  PURCHASE = 'purchase',
  SALES = 'sales',
  INVENTORY = 'inventory',
  PRODUCT = 'product',
  FINANCE = 'finance',
  STATISTICS = 'statistics',
  SETTINGS = 'settings',
  PERSONNEL = 'personnel',
}

/** 六大茶类 */
export enum TeaCategory {
  GREEN = 'green',
  WHITE = 'white',
  YELLOW = 'yellow',
  OOLONG = 'oolong',
  RED = 'red',
  DARK = 'dark',
  FLOWER = 'flower',
}

/** 订单状态 */
export enum OrderStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  SHIPPING = 'shipping',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

/** 库存状态 */
export enum StockStatus {
  SUFFICIENT = 'sufficient',
  LOW = 'low',
  INSUFFICIENT = 'insufficient',
}

/** 侧边栏菜单项 */
export interface MenuItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  children?: MenuItem[];
}

/** 模块配置 */
export interface ModuleConfig {
  key: ModuleKey;
  label: string;
  menus: MenuItem[];
}

/** 趋势数据 */
export interface TrendData {
  direction: 'up' | 'down';
  value: string;
  label?: string;
}

/** 统计卡片数据 */
export interface StatCardData {
  label: string;
  value: string;
  unit?: string;
  trend?: TrendData;
  icon: React.ReactNode;
}

/** 订单项 */
export interface OrderItem {
  id: string;
  code: string;
  partner: string;
  product: string;
  teaCategory: TeaCategory;
  quantity: string;
  amount: string;
  status: OrderStatus;
}

/** 商品项 */
export interface ProductItem {
  id: string;
  name: string;
  spec: string;
  teaCategory: TeaCategory;
  price: number;
  unit: string;
}

/** 库存项 */
export interface StockItem {
  id: string;
  productName: string;
  teaCategory: TeaCategory;
  warehouse: string;
  quantity: string;
  status: StockStatus;
}

/** 预警项 */
export interface AlertItemData {
  name: string;
  stock: string;
  level: 'danger' | 'warning';
}

/** 待办项 */
export interface TodoItemData {
  text: string;
  time: string;
  done: boolean;
}

/** 按钮变体 */
export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'default' | 'sm';

/** 状态标签变体 */
export type StatusVariant = 'success' | 'warning' | 'error' | 'info' | 'default';

/** 通知类型 */
export enum NotificationType {
  SYSTEM = 'system',
  ORDER = 'order',
  QUALITY = 'quality',
  INVENTORY = 'inventory',
}

/** 质检结果 */
export enum QualityResult {
  PENDING = 'pending',
  QUALIFIED = 'qualified',
  UNQUALIFIED = 'unqualified',
}

/** 报价状态 */
export enum QuotationStatus {
  PENDING_REPLY = 'pending_reply',
  QUOTED = 'quoted',
  EXPIRED = 'expired',
  CONVERTED = 'converted',
}

/** 通知项 */
export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  content: string;
  time: string;
  read: boolean;
}

/** 质检项 */
export interface QualityItem {
  id: string;
  batchCode: string;
  productName: string;
  teaCategory: TeaCategory;
  grade: string;
  moisture: number;
  ash: number;
  pesticideResidue: number;
  sensory: string;
  result: QualityResult;
}

/** 报价项 */
export interface QuotationItem {
  id: string;
  quotationCode: string;
  customer: string;
  teaCategory: TeaCategory;
  grade: string;
  unitPrice: number;
  quantity: number;
  amount: number;
  validUntil: string;
  status: QuotationStatus;
}

/** 溯源步骤 */
export interface TraceStep {
  stage: string;
  location: string;
  date: string;
  operator: string;
}

/** 溯源项 */
export interface TraceabilityItem {
  id: string;
  batchCode: string;
  productName: string;
  teaCategory: TeaCategory;
  grade: string;
  source: string;
  inboundDate: string;
  status: StockStatus;
  traceSteps: TraceStep[];
}

/** 品级项 */
export interface GradeItem {
  id: string;
  name: string;
  applicableCategories: TeaCategory[];
  pricingFactor: number;
  sensoryStandard: string;
  productCount: number;
  active: boolean;
}

/** 茶类详情 */
export interface TeaCategoryDetail {
  category: TeaCategory;
  introduction: string;
  process: string;
  storage: string;
  flavor: string;
  representativeTeas: string[];
  productCount: number;
}

/** 退货状态 */
export enum ReturnStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  COMPLETED = 'completed',
  REJECTED = 'rejected',
}

/** 退货项 */
export interface ReturnItem {
  id: string;
  code: string;
  originalOrder: string;
  partner: string;
  product: string;
  quantity: string;
  amount: string;
  reason: string;
  status: ReturnStatus;
}

/** 预警类型 */
export enum AlertType {
  STOCK_LOW = 'stock_low',
  SHELF_LIFE = 'shelf_life',
  SLOW_MOVING = 'slow_moving',
  STOCK_HIGH = 'stock_high',
  ENVIRONMENT = 'environment',
  PRICE = 'price',
  SUPPLY = 'supply',
}

/** 预警规则项 */
export interface AlertRuleItem {
  id: string;
  name: string;
  type: AlertType;
  condition: string;
  productCount: number;
  enabled: boolean;
  triggered: boolean;
}

/** 收款/付款状态 */
export enum PaymentStatus {
  PAID = 'paid',
  PENDING = 'pending',
  OVERDUE = 'overdue',
  RECEIVED = 'received',
}

/** 发票状态 */
export enum InvoiceStatus {
  ISSUED = 'issued',
  RECEIVED = 'received',
  PENDING = 'pending',
  VOID = 'void',
}

/** 发票类型 */
export enum InvoiceType {
  OUTPUT = 'output',
  INPUT = 'input',
}

/** 库位状态 */
export enum LocationStatus {
  OCCUPIED = 'occupied',
  EMPTY = 'empty',
  MAINTENANCE = 'maintenance',
}

/** 用户状态 */
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

/** 备份状态 */
export enum BackupStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
}

/** 品牌等级 */
export enum BrandLevel {
  S = 'S',
  A = 'A',
  B = 'B',
  C = 'C',
}

/** 品牌状态 */
export enum BrandStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

/** 品牌项 */
export interface BrandItem {
  id: string;
  code: string;
  name: string;
  logo: string;
  owner: string;
  introduction: string;
  requirements: string;
  policy: string;
  series: string[];
  trademarkCert: string[];
  jdStoreUrl: string;
  tmallStoreUrl: string;
  contactPerson: string;
  contactPhone: string;
  address: string;
  mainCategories: string[];
  productCount: number;
  supplierCount: number;
  website: string;
  cooperationDate: string;
}

/** 茶叶商品 */
export interface TeaProduct {
  id: string;
  code: string;
  name: string;
  category: string;
  categories: string[];
  brand: string;
  series: string;
  packageUnit: string;
  barcode69: string;
  model: string;
  spec: string;
  /** 每份规格 */
  perUnitSpec: {
    netWeight: number;       // 净重
    netWeightUnit: string;   // 净重单位
    grossWeight: number;     // 毛重
    grossWeightUnit: string; // 毛重单位
    length: number;          // 长
    width: number;           // 宽
    height: number;          // 高
    dimensionUnit: string;   // 尺寸单位
  };
  /** 每箱规格（箱规） */
  perBoxSpec: {
    quantity: number;        // 每箱数量
    netWeight: number;       // 净重 = 每份净重 × 数量
    netWeightUnit: string;   // 净重单位
    grossWeight: number;     // 毛重 = 每份毛重 × 数量
    grossWeightUnit: string; // 毛重单位
    length: number;          // 长
    width: number;           // 宽
    height: number;          // 高
    dimensionUnit: string;   // 尺寸单位
  };
  weight: number;
  volume: { length: number; width: number; height: number };
  quantityPerUnit: number;
  grade: string;
  origin: string;
  shelfLife: number;
  taxRate: number;
  packageList: string;
  marketPrice: number;
  tmallPrice: number;
  tmallUrl: string;
  jdPrice: number;
  jdUrl: string;
  shelfStatus: 'on' | 'off';
  purchaseStatus: 'available' | 'stopped';
  productionStatus: 'producing' | 'stopped';
  mainImages: string[];
  detailImages: string[];
  displayImageIndex: number;
  stockAlert: number;
  stock: number;
  reservedStock: number;
  totalSales: number;
  features: string;
  includesTeaware: boolean;
  remark: string;
}

/** 茶人类型 */
export type TeaProfessionalType = 'tea_artist' | 'tea_evaluator' | 'tea_maker' | 'tea_sommelier';

/** 茶人证书 */
export interface TeaCertificate {
  name: string;
  level: string;
  issuer: string;
  issueDate: string;
  certNo: string;
}

/** 茶人获奖记录 */
export interface TeaAward {
  name: string;
  level: string;
  awardDate: string;
  organization: string;
}

/** 茶人服务报价 */
export interface TeaServiceQuote {
  serviceType: string;
  duration: string;
  price: number;
  unit: string;
  remark: string;
}

/** 茶人 */
export interface TeaProfessional {
  id: string;
  name: string;
  type: TeaProfessionalType[];
  gender: 'male' | 'female';
  photo: string;
  region: string;
  height: number;
  weight: number;
  birthDate: string;
  phone: string;
  email: string;
  idCard: string;
  address: string;
  certificates: TeaCertificate[];
  specialties: string[];
  awards: TeaAward[];
  serviceQuotes: TeaServiceQuote[];
  introduction: string;
  status: 'active' | 'inactive';
}
