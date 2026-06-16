import type { CustomerItem } from '../types';

/* ── 直营客户（无平台） ── */
const directNoPlatform: CustomerItem[] = [
  { id: 'c1', name: '华茗堂茶庄', type: 'direct', region: '北京', contactPerson: '张明华', contactPhone: '010-8234****', contactEmail: 'zmh@huamingtang.com', contactAddress: '北京市西城区马连道16号', level: 'A级', orders: 32, totalAmount: 386000, platformIds: [], cooperationDate: '2023-02-15', status: 'active', settlementMethod: '月结', taxNo: '91110102MA***1234', source: '展会拓客', remark: '长期合作，月均采购稳定' },
  { id: 'c2', name: '清心茶坊', type: 'direct', region: '杭州', contactPerson: '李雅芳', contactPhone: '0571-8612****', level: 'S级', orders: 45, totalAmount: 512400, platformIds: [], cooperationDate: '2022-08-10', status: 'active', settlementMethod: '月结', source: '老客户转介', remark: '核心客户，高端茶品需求大' },
  { id: 'c3', name: '品茗轩', type: 'direct', region: '广州', contactPerson: '陈志远', contactPhone: '020-8356****', level: 'B级', orders: 19, totalAmount: 168600, platformIds: [], cooperationDate: '2024-01-20', status: 'active', settlementMethod: '预付', source: '线上咨询' },
  { id: 'c4', name: '翠竹茶行', type: 'direct', region: '成都', contactPerson: '王建国', contactPhone: '028-8523****', level: 'A级', orders: 24, totalAmount: 198200, platformIds: [], cooperationDate: '2023-06-05', status: 'active', settlementMethod: '月结', source: '主动开发' },
  { id: 'c5', name: '云顶茶舍', type: 'direct', region: '昆明', contactPerson: '刘晓东', contactPhone: '0871-6543****', level: 'B级', orders: 12, totalAmount: 89600, platformIds: [], cooperationDate: '2024-03-18', status: 'active', settlementMethod: '预付', source: '线上咨询' },
];

/* ── 直营客户（含平台） ── */
const directWithPlatform: CustomerItem[] = [
  { id: 'c6', name: '浦发银行', type: 'direct', region: '上海', contactPerson: '赵经理', contactPhone: '021-6123****', level: 'S级', orders: 18, totalAmount: 425000, platformIds: ['p1'], cooperationDate: '2023-04-22', status: 'active', settlementMethod: '月结', source: '平台引流', remark: '企业福利采购，年节大宗订单' },
  { id: 'c7', name: '交通银行', type: 'direct', region: '上海', contactPerson: '孙主管', contactPhone: '021-5876****', level: 'A级', orders: 15, totalAmount: 368000, platformIds: ['p2', 'p3'], cooperationDate: '2023-09-10', status: 'active', settlementMethod: '月结', source: '平台引流' },
  { id: 'c8', name: '中信证券', type: 'direct', region: '深圳', contactPerson: '周总监', contactPhone: '0755-8234****', level: 'S级', orders: 22, totalAmount: 536000, platformIds: ['p1', 'p2'], cooperationDate: '2022-12-01', status: 'active', settlementMethod: '月结', source: '老客户转介', remark: 'VIP客户礼品定制' },
  { id: 'c9', name: '中国平安', type: 'direct', region: '深圳', contactPerson: '吴经理', contactPhone: '0755-2233****', level: 'A级', orders: 10, totalAmount: 285000, platformIds: ['p4'], cooperationDate: '2024-02-28', status: 'active', settlementMethod: '月结', source: '展会拓客' },
  { id: 'c10', name: '招商银行', type: 'direct', region: '深圳', contactPerson: '钱主管', contactPhone: '0755-8866****', level: 'B级', orders: 8, totalAmount: 196000, platformIds: ['p2'], cooperationDate: '2024-05-15', status: 'active', settlementMethod: '月结', source: '主动开发' },
];

/* ── 渠道客户 ── */
const channelCustomers: CustomerItem[] = [
  { id: 'c11', name: '天福茗茶', type: 'channel', region: '福州', contactPerson: '林经理', contactPhone: '0591-8765****', level: 'S级', orders: 56, totalAmount: 826000, platformIds: [], cooperationDate: '2022-03-10', status: 'active', settlementMethod: '月结', source: '主动开发', remark: '华东区核心渠道商' },
  { id: 'c12', name: '八马茶业', type: 'channel', region: '厦门', contactPerson: '王总', contactPhone: '0592-5432****', level: 'A级', orders: 42, totalAmount: 645000, platformIds: [], cooperationDate: '2023-01-18', status: 'active', settlementMethod: '月结', source: '展会拓客' },
  { id: 'c13', name: '大益茶体验馆', type: 'channel', region: '广州', contactPerson: '陈经理', contactPhone: '020-3876****', level: 'A级', orders: 35, totalAmount: 498000, platformIds: [], cooperationDate: '2023-05-22', status: 'active', settlementMethod: '月结', source: '老客户转介' },
  { id: 'c14', name: '茶里王国', type: 'channel', region: '长沙', contactPerson: '杨总', contactPhone: '0731-8567****', level: 'B级', orders: 28, totalAmount: 312000, platformIds: [], cooperationDate: '2023-11-05', status: 'active', settlementMethod: '月结', source: '线上咨询' },
  { id: 'c15', name: '正山堂旗舰店', type: 'channel', region: '武夷山', contactPerson: '江经理', contactPhone: '0599-5123****', level: 'B级', orders: 20, totalAmount: 268000, platformIds: [], cooperationDate: '2024-01-08', status: 'inactive', settlementMethod: '月结', source: '主动开发' },
];

export const customerItems: CustomerItem[] = [
  ...directNoPlatform,
  ...directWithPlatform,
  ...channelCustomers,
];

export const CUSTOMER_TYPE_LABELS: Record<CustomerItem['type'], string> = {
  direct: '直营客户',
  channel: '渠道客户',
  platform: '平台客户',
};

export const CUSTOMER_TYPE_DESC: Record<CustomerItem['type'], string> = {
  direct: '客情自有，直接发货',
  channel: '客情非自有，进行二次售卖',
  platform: '电商平台，企业采购渠道',
};

export const LEVEL_COLORS: Record<string, { bg: string; color: string }> = {
  'S级': { bg: '#FEF2F4', color: '#CB405D' },
  'A级': { bg: '#EBF3FC', color: '#0F64B5' },
  'B级': { bg: '#EBF3FC', color: '#0F64B5' },
  'C级': { bg: 'var(--color-neutral-100)', color: 'var(--color-neutral-500)' },
};
