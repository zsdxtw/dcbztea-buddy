/**
 * 组织架构 & 员工管理 数据源
 */
import type { OrgNode, Employee, EmployeePerformance } from '../types';
import { customerItems } from './customers';
import { platformItems } from './platforms';

/* ── 组织架构：公司 → 部门 → 团队 ── */

export const orgNodes: OrgNode[] = [
  // 公司层
  { id: 'org-0', type: 'company', name: '淡茶半盏茶业有限公司', parentId: null, leader: '陈总', sort: 0, status: 'active' },

  // 部门层（初始化四大部门）
  { id: 'dept-1', type: 'department', name: '运营与产品部', parentId: 'org-0', leader: '林雨桐', sort: 1, status: 'active', remark: '负责产品运营与供应链管理' },
  { id: 'dept-2', type: 'department', name: '市场部', parentId: 'org-0', leader: '陈思远', sort: 2, status: 'active', remark: '负责市场推广与品牌建设' },
  { id: 'dept-3', type: 'department', name: '门店管理部', parentId: 'org-0', leader: '张雅琴', sort: 3, status: 'active', remark: '负责线下门店运营管理' },
  { id: 'dept-4', type: 'department', name: '直播与经纪部', parentId: 'org-0', leader: '吴晓燕', sort: 4, status: 'active', remark: '负责直播带货与茶人经纪' },

  // 团队层
  { id: 'team-1', type: 'team', name: '产品策划组', parentId: 'dept-1', leader: '刘明辉', sort: 1, status: 'active' },
  { id: 'team-2', type: 'team', name: '供应链组', parentId: 'dept-1', leader: '孙浩然', sort: 2, status: 'active' },
  { id: 'team-3', type: 'team', name: '品牌推广组', parentId: 'dept-2', leader: '赵雪梅', sort: 1, status: 'active' },
  { id: 'team-4', type: 'team', name: '客户拓展组', parentId: 'dept-2', leader: '周丽华', sort: 2, status: 'active' },
  { id: 'team-5', type: 'team', name: '华东门店组', parentId: 'dept-3', leader: '黄志强', sort: 1, status: 'active' },
  { id: 'team-6', type: 'team', name: '华南门店组', parentId: 'dept-3', leader: '王建国', sort: 2, status: 'active' },
  { id: 'team-7', type: 'team', name: '直播运营组', parentId: 'dept-4', leader: '吴晓燕', sort: 1, status: 'active' },
  { id: 'team-8', type: 'team', name: '茶人经纪组', parentId: 'dept-4', leader: '林雨桐', sort: 2, status: 'active' },
];

/* ── 员工数据 ── */

export const employees: Employee[] = [
  { id: 'emp-1', empNo: 'DC001', name: '林雨桐', gender: 'female', phone: '138****5678', email: 'linyt@danchaban.com', departmentId: 'dept-1', teamId: 'team-1', position: '产品总监', joinDate: '2022-03-15', status: 'active', remark: '运营与产品部负责人' },
  { id: 'emp-2', empNo: 'DC002', name: '刘明辉', gender: 'male', phone: '135****3456', email: 'liumh@danchaban.com', departmentId: 'dept-1', teamId: 'team-1', position: '产品经理', joinDate: '2022-06-01', status: 'active' },
  { id: 'emp-3', empNo: 'DC003', name: '孙浩然', gender: 'male', phone: '131****2345', email: 'sunhr@danchaban.com', departmentId: 'dept-1', teamId: 'team-2', position: '供应链主管', joinDate: '2022-04-20', status: 'active' },
  { id: 'emp-4', empNo: 'DC004', name: '陈思远', gender: 'male', phone: '139****1234', email: 'chensy@danchaban.com', departmentId: 'dept-2', teamId: 'team-3', position: '市场总监', joinDate: '2022-02-10', status: 'active', remark: '市场部负责人' },
  { id: 'emp-5', empNo: 'DC005', name: '赵雪梅', gender: 'female', phone: '133****7890', email: 'zhaoxm@danchaban.com', departmentId: 'dept-2', teamId: 'team-3', position: '品牌经理', joinDate: '2022-07-15', status: 'active' },
  { id: 'emp-6', empNo: 'DC006', name: '周丽华', gender: 'female', phone: '158****6789', email: 'zhoulh@danchaban.com', departmentId: 'dept-2', teamId: 'team-4', position: '客户经理', joinDate: '2022-08-01', status: 'active', remark: '负责华东区客户' },
  { id: 'emp-7', empNo: 'DC007', name: '李娜', gender: 'female', phone: '139****5678', email: 'lina@danchaban.com', departmentId: 'dept-2', teamId: 'team-4', position: '客户经理', joinDate: '2023-01-10', status: 'active', remark: '负责华南区客户' },
  { id: 'emp-8', empNo: 'DC008', name: '王强', gender: 'male', phone: '137****9012', email: 'wangqiang@danchaban.com', departmentId: 'dept-2', teamId: 'team-4', position: '跟单员', joinDate: '2023-03-20', status: 'active' },
  { id: 'emp-9', empNo: 'DC009', name: '张伟', gender: 'male', phone: '138****1234', email: 'zhangwei@danchaban.com', departmentId: 'dept-2', teamId: 'team-4', position: '跟单员', joinDate: '2023-05-15', status: 'active' },
  { id: 'emp-10', empNo: 'DC010', name: '张雅琴', gender: 'female', phone: '136****9012', email: 'zhangyq@danchaban.com', departmentId: 'dept-3', teamId: 'team-5', position: '门店总监', joinDate: '2022-03-01', status: 'active', remark: '门店管理部负责人' },
  { id: 'emp-11', empNo: 'DC011', name: '黄志强', gender: 'male', phone: '159****0123', email: 'huangzq@danchaban.com', departmentId: 'dept-3', teamId: 'team-5', position: '区域经理', joinDate: '2022-09-10', status: 'active', remark: '华东门店组负责人' },
  { id: 'emp-12', empNo: 'DC012', name: '王建国', gender: 'male', phone: '137****5678', email: 'wangjg@danchaban.com', departmentId: 'dept-3', teamId: 'team-6', position: '区域经理', joinDate: '2022-10-15', status: 'active', remark: '华南门店组负责人' },
  { id: 'emp-13', empNo: 'DC013', name: '赵敏', gender: 'female', phone: '136****3456', email: 'zhaomin@danchaban.com', departmentId: 'dept-3', teamId: 'team-6', position: '店长', joinDate: '2023-02-20', status: 'active' },
  { id: 'emp-14', empNo: 'DC014', name: '吴晓燕', gender: 'female', phone: '186****4567', email: 'wuxy@danchaban.com', departmentId: 'dept-4', teamId: 'team-7', position: '直播总监', joinDate: '2022-05-01', status: 'active', remark: '直播与经纪部负责人' },
  { id: 'emp-15', empNo: 'DC015', name: '陈刚', gender: 'male', phone: '135****7890', email: 'chengang@danchaban.com', departmentId: 'dept-4', teamId: 'team-7', position: '直播运营', joinDate: '2023-04-10', status: 'probation' },
  { id: 'emp-16', empNo: 'DC016', name: '陈志远', gender: 'male', phone: '020-8356****', email: 'chenzy@danchaban.com', departmentId: 'dept-2', teamId: 'team-4', position: '客户经理', joinDate: '2022-11-05', status: 'active', remark: '负责广州区域客户' },
  { id: 'emp-17', empNo: 'DC017', name: '刘晓东', gender: 'male', phone: '0871-6543****', email: 'liuxd@danchaban.com', departmentId: 'dept-2', teamId: 'team-4', position: '客户经理', joinDate: '2023-06-18', status: 'active', remark: '负责昆明区域客户' },
];

/* ── 已完成回款的订单数据（用于绩效统计） ── */
/* 每条记录代表一笔已回款的销售订单 */
export interface CompletedOrderForPerformance {
  orderId: string;
  orderCode: string;
  customerId: string;
  customerName: string;
  /** 客户类型：direct=直营/channel=渠道/platform=平台 */
  customerType: 'direct' | 'channel' | 'platform';
  /** 订单金额（元）= 销售实价合计 */
  amount: number;
  /** 销售实价合计（元） */
  actualSalesPrice: number;
  /** 采购实价合计（元） */
  actualPurchasePrice: number;
  /** 跟单人员工 ID（可能为空） */
  followerEmpId?: string;
  /** 跟单人姓名（可能为空） */
  followerName?: string;
  /** 回款日期 */
  paymentDate: string;
  /** 经平台销售给直营客户时，记录直营客户 ID（仅 customerType='platform' 时可能有值） */
  directCustomerId?: string;
}

/** 计算单笔订单利润 =（销售实价 - 采购实价）× 90% */
export function getOrderProfit(order: CompletedOrderForPerformance): number {
  return (order.actualSalesPrice - order.actualPurchasePrice) * 0.9;
}

export const completedOrders: CompletedOrderForPerformance[] = [
  { orderId: 'SO-2025-0242', orderCode: 'SO-2025-0242', customerId: 'c1', customerName: '华茗堂茶庄', customerType: 'direct', amount: 34800, actualSalesPrice: 34800, actualPurchasePrice: 21576, followerEmpId: 'emp-8', followerName: '王强', paymentDate: '2025-07-15' },
  { orderId: 'SO-2025-0241', orderCode: 'SO-2025-0241', customerId: 'c2', customerName: '清心茶坊', customerType: 'direct', amount: 36000, actualSalesPrice: 36000, actualPurchasePrice: 23400, followerEmpId: 'emp-9', followerName: '张伟', paymentDate: '2025-07-14' },
  { orderId: 'SO-2025-0240', orderCode: 'SO-2025-0240', customerId: 'c3', customerName: '品茗轩', customerType: 'direct', amount: 44800, actualSalesPrice: 44800, actualPurchasePrice: 26880, followerEmpId: 'emp-8', followerName: '王强', paymentDate: '2025-07-13' },
  { orderId: 'SO-2025-0239', orderCode: 'SO-2025-0239', customerId: 'c4', customerName: '翠竹茶行', customerType: 'direct', amount: 18000, actualSalesPrice: 18000, actualPurchasePrice: 11700, followerEmpId: undefined, followerName: undefined, paymentDate: '2025-07-12' },
  { orderId: 'SO-2025-0238', orderCode: 'SO-2025-0238', customerId: 'c5', customerName: '云顶茶舍', customerType: 'direct', amount: 17600, actualSalesPrice: 17600, actualPurchasePrice: 11440, followerEmpId: 'emp-9', followerName: '张伟', paymentDate: '2025-07-11' },
  { orderId: 'SO-2025-0237', orderCode: 'SO-2025-0237', customerId: 'c6', customerName: '浦发银行', customerType: 'direct', amount: 42500, actualSalesPrice: 42500, actualPurchasePrice: 26350, followerEmpId: undefined, followerName: undefined, paymentDate: '2025-07-10' },
  { orderId: 'SO-2025-0236', orderCode: 'SO-2025-0236', customerId: 'c7', customerName: '交通银行', customerType: 'direct', amount: 36800, actualSalesPrice: 36800, actualPurchasePrice: 22908, followerEmpId: 'emp-8', followerName: '王强', paymentDate: '2025-07-09' },
  { orderId: 'SO-2025-0235', orderCode: 'SO-2025-0235', customerId: 'c8', customerName: '中信证券', customerType: 'direct', amount: 53600, actualSalesPrice: 53600, actualPurchasePrice: 33768, followerEmpId: 'emp-9', followerName: '张伟', paymentDate: '2025-07-08' },
  { orderId: 'SO-2025-0234', orderCode: 'SO-2025-0234', customerId: 'c9', customerName: '中国平安', customerType: 'direct', amount: 28500, actualSalesPrice: 28500, actualPurchasePrice: 17670, followerEmpId: undefined, followerName: undefined, paymentDate: '2025-07-07' },
  { orderId: 'SO-2025-0233', orderCode: 'SO-2025-0233', customerId: 'c10', customerName: '招商银行', customerType: 'direct', amount: 19600, actualSalesPrice: 19600, actualPurchasePrice: 12152, followerEmpId: 'emp-8', followerName: '王强', paymentDate: '2025-07-06' },
  { orderId: 'SO-2025-0232', orderCode: 'SO-2025-0232', customerId: 'c11', customerName: '天福茗茶', customerType: 'channel', amount: 82600, actualSalesPrice: 82600, actualPurchasePrice: 49560, followerEmpId: 'emp-9', followerName: '张伟', paymentDate: '2025-07-05' },
  { orderId: 'SO-2025-0231', orderCode: 'SO-2025-0231', customerId: 'c12', customerName: '八马茶业', customerType: 'channel', amount: 64500, actualSalesPrice: 64500, actualPurchasePrice: 40020, followerEmpId: undefined, followerName: undefined, paymentDate: '2025-07-04' },
  { orderId: 'SO-2025-0230', orderCode: 'SO-2025-0230', customerId: 'c13', customerName: '大益茶体验馆', customerType: 'channel', amount: 49800, actualSalesPrice: 49800, actualPurchasePrice: 30876, followerEmpId: 'emp-8', followerName: '王强', paymentDate: '2025-07-03' },
  { orderId: 'SO-2025-0229', orderCode: 'SO-2025-0229', customerId: 'c14', customerName: '茶里王国', customerType: 'channel', amount: 31200, actualSalesPrice: 31200, actualPurchasePrice: 19344, followerEmpId: 'emp-9', followerName: '张伟', paymentDate: '2025-07-02' },
  { orderId: 'SO-2025-0228', orderCode: 'SO-2025-0228', customerId: 'c1', customerName: '华茗堂茶庄', customerType: 'direct', amount: 28600, actualSalesPrice: 28600, actualPurchasePrice: 17732, followerEmpId: undefined, followerName: undefined, paymentDate: '2025-07-01' },
  { orderId: 'SO-2025-0227', orderCode: 'SO-2025-0227', customerId: 'c2', customerName: '清心茶坊', customerType: 'direct', amount: 45200, actualSalesPrice: 45200, actualPurchasePrice: 28024, followerEmpId: 'emp-8', followerName: '王强', paymentDate: '2025-06-30' },
  { orderId: 'SO-2025-0226', orderCode: 'SO-2025-0226', customerId: 'c4', customerName: '翠竹茶行', customerType: 'direct', amount: 19800, actualSalesPrice: 19800, actualPurchasePrice: 12276, followerEmpId: 'emp-9', followerName: '张伟', paymentDate: '2025-06-29' },
  { orderId: 'SO-2025-0225', orderCode: 'SO-2025-0225', customerId: 'c6', customerName: '浦发银行', customerType: 'direct', amount: 38500, actualSalesPrice: 38500, actualPurchasePrice: 23870, followerEmpId: 'emp-8', followerName: '王强', paymentDate: '2025-06-28' },
  { orderId: 'SO-2025-0224', orderCode: 'SO-2025-0224', customerId: 'c8', customerName: '中信证券', customerType: 'direct', amount: 52600, actualSalesPrice: 52600, actualPurchasePrice: 32612, followerEmpId: undefined, followerName: undefined, paymentDate: '2025-06-27' },
  { orderId: 'SO-2025-0223', orderCode: 'SO-2025-0223', customerId: 'c11', customerName: '天福茗茶', customerType: 'channel', amount: 72800, actualSalesPrice: 72800, actualPurchasePrice: 43680, followerEmpId: 'emp-9', followerName: '张伟', paymentDate: '2025-06-26' },
  // 平台客户直营订单（直接销售给平台客户）
  { orderId: 'SO-2025-0222', orderCode: 'SO-2025-0222', customerId: 'p1', customerName: '京东慧采', customerType: 'platform', amount: 62800, actualSalesPrice: 62800, actualPurchasePrice: 38936, followerEmpId: 'emp-8', followerName: '王强', paymentDate: '2025-06-25' },
  { orderId: 'SO-2025-0221', orderCode: 'SO-2025-0221', customerId: 'p2', customerName: '史泰博', customerType: 'platform', amount: 45600, actualSalesPrice: 45600, actualPurchasePrice: 28272, followerEmpId: undefined, followerName: undefined, paymentDate: '2025-06-24' },
  // 经平台销售给直营客户的订单（绩效记在直营客户的对接人名下）
  { orderId: 'SO-2025-0220', orderCode: 'SO-2025-0220', customerId: 'p1', customerName: '京东慧采', customerType: 'platform', amount: 35200, actualSalesPrice: 35200, actualPurchasePrice: 21824, followerEmpId: 'emp-9', followerName: '张伟', directCustomerId: 'c6', paymentDate: '2025-06-23' },
  { orderId: 'SO-2025-0219', orderCode: 'SO-2025-0219', customerId: 'p2', customerName: '史泰博', customerType: 'platform', amount: 28800, actualSalesPrice: 28800, actualPurchasePrice: 17856, followerEmpId: 'emp-8', followerName: '王强', directCustomerId: 'c7', paymentDate: '2025-06-22' },
];

/* ── 绩效统计工具函数 ── */

/**
 * 根据订单查找对接人员工 ID
 *
 * 规则：
 * - 直营客户订单（不论是否经平台销售）→ 直营客户的对接人
 * - 平台客户直营订单（直接销售给平台客户）→ 平台客户的对接人
 * - 经平台销售给直营客户的订单 → 直营客户的对接人（非平台对接人）
 */
function getLiaisonEmpId(order: CompletedOrderForPerformance): string | undefined {
  if (order.customerType === 'platform') {
    // 平台客户订单
    if (order.directCustomerId) {
      // 经平台销售给直营客户 → 直营客户的对接人
      const directCustomer = customerItems.find((c) => c.id === order.directCustomerId);
      return directCustomer?.liaisonEmpId;
    }
    // 直接销售给平台客户 → 平台客户的对接人
    const platform = platformItems.find((p) => p.id === order.customerId);
    return platform?.liaisonEmpId;
  }
  // 直营/渠道客户订单 → 客户的对接人
  const customer = customerItems.find((c) => c.id === order.customerId);
  return customer?.liaisonEmpId;
}

/**
 * 计算员工绩效（绩效金额 + 绩效利润）
 *
 * 【跟单人绩效】基于订单，规则不变：
 * 1. 有跟单人 → 订单金额 × 40% 计入跟单人
 * 2. 无跟单人 → 订单金额 × 40% 计入对接人
 *
 * 【对接人绩效】基于客户归属：
 * - 直营客户订单（不论是否经平台）→ 直营客户的对接人
 * - 平台直营订单 → 平台客户的对接人
 * - 经平台销售给直营客户的订单 → 直营客户的对接人
 * 3. 不管有无跟单人 → 订单金额 × 50% 计入对接人
 *
 * 【绩效利润】基于订单利润（=（销售实价 - 采购实价）× 90%），规则同上。
 */
export function calculateEmployeePerformance(): EmployeePerformance[] {
  const resultMap = new Map<string, EmployeePerformance>();

  // 初始化所有员工
  employees.forEach((emp) => {
    const dept = orgNodes.find((n) => n.id === emp.departmentId);
    resultMap.set(emp.id, {
      employeeId: emp.id,
      employeeName: emp.name,
      departmentName: dept?.name ?? '-',
      position: emp.position,
      followerAmount: 0,
      liaisonAmount: 0,
      totalAmount: 0,
      followerProfit: 0,
      liaisonProfit: 0,
      totalProfit: 0,
      orderCount: 0,
    });
  });

  // 遍历已完成回款的订单
  completedOrders.forEach((order) => {
    const followerEmpId = order.followerEmpId;
    const liaisonEmpId = getLiaisonEmpId(order);
    const profit = getOrderProfit(order); // 订单利润

    // ── 跟单人绩效（规则不变）──
    // 规则1：有跟单人 → 金额×40% 计入跟单人
    if (followerEmpId) {
      const perf = resultMap.get(followerEmpId);
      if (perf) {
        perf.followerAmount += order.amount * 0.4;
        perf.followerProfit += profit * 0.4;
        perf.orderCount += 1;
      }
    } else {
      // 规则2：无跟单人 → 金额×40% 计入对接人
      if (liaisonEmpId) {
        const perf = resultMap.get(liaisonEmpId);
        if (perf) {
          perf.liaisonAmount += order.amount * 0.4;
          perf.liaisonProfit += profit * 0.4;
          perf.orderCount += 1;
        }
      }
    }

    // ── 对接人绩效（所有订单 × 50%）──
    // 规则3：不管有无跟单人 → 金额×50% 计入对接人
    if (liaisonEmpId) {
      const perf = resultMap.get(liaisonEmpId);
      if (perf) {
        perf.liaisonAmount += order.amount * 0.5;
        perf.liaisonProfit += profit * 0.5;
        if (followerEmpId) {
          perf.orderCount += 1;
        }
      }
    }
  });

  // 计算总额，过滤掉无绩效的员工
  const results = Array.from(resultMap.values());
  results.forEach((p) => {
    p.followerAmount = Math.round(p.followerAmount);
    p.liaisonAmount = Math.round(p.liaisonAmount);
    p.totalAmount = p.followerAmount + p.liaisonAmount;
    p.followerProfit = Math.round(p.followerProfit);
    p.liaisonProfit = Math.round(p.liaisonProfit);
    p.totalProfit = p.followerProfit + p.liaisonProfit;
  });

  // 只展示有绩效的员工
  const filtered = results.filter((p) => p.totalAmount > 0);

  // 按绩效金额总额降序
  filtered.sort((a, b) => b.totalAmount - a.totalAmount);
  return filtered;
}

/* ── 辅助查询函数 ── */

/** 获取组织树结构 */
export function getOrgTree() {
  const company = orgNodes.find((n) => n.type === 'company');
  if (!company) return null;

  const departments = orgNodes
    .filter((n) => n.type === 'department' && n.parentId === company.id)
    .sort((a, b) => a.sort - b.sort);

  departments.forEach((dept) => {
    (dept as any)._teams = orgNodes
      .filter((n) => n.type === 'team' && n.parentId === dept.id)
      .sort((a, b) => a.sort - b.sort);
  });

  return { company, departments };
}

/** 获取节点下的员工 */
export function getEmployeesByNode(nodeId: string): Employee[] {
  return employees.filter(
    (e) => e.departmentId === nodeId || e.teamId === nodeId
  );
}

/** 根据 ID 获取节点名称 */
export function getOrgNodeName(id: string): string {
  return orgNodes.find((n) => n.id === id)?.name ?? '-';
}

/** 根据 ID 获取员工姓名 */
export function getEmployeeName(id: string): string {
  return employees.find((e) => e.id === id)?.name ?? '-';
}

/** 员工状态标签 */
export const EMP_STATUS_LABELS: Record<string, string> = {
  active: '在职',
  inactive: '离职',
  probation: '试用期',
};
