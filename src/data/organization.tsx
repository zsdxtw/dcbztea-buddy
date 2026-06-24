/**
 * 组织架构 & 员工管理 数据源
 */
import type { OrgNode, Employee, EmployeePerformance, EmployeeRole } from '../types';
import { customerItems } from './customers';

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
  { id: 'emp-1', empNo: 'DC001', name: '林雨桐', gender: 'female', phone: '138****5678', email: 'linyt@danchaban.com', departmentId: 'dept-1', teamId: 'team-1', position: '产品总监', role: 'manager', joinDate: '2022-03-15', status: 'active', remark: '运营与产品部负责人' },
  { id: 'emp-2', empNo: 'DC002', name: '刘明辉', gender: 'male', phone: '135****3456', email: 'liumh@danchaban.com', departmentId: 'dept-1', teamId: 'team-1', position: '产品经理', role: 'staff', joinDate: '2022-06-01', status: 'active' },
  { id: 'emp-3', empNo: 'DC003', name: '孙浩然', gender: 'male', phone: '131****2345', email: 'sunhr@danchaban.com', departmentId: 'dept-1', teamId: 'team-2', position: '供应链主管', role: 'staff', joinDate: '2022-04-20', status: 'active' },
  { id: 'emp-4', empNo: 'DC004', name: '陈思远', gender: 'male', phone: '139****1234', email: 'chensy@danchaban.com', departmentId: 'dept-2', teamId: 'team-3', position: '市场总监', role: 'manager', joinDate: '2022-02-10', status: 'active', remark: '市场部负责人' },
  { id: 'emp-5', empNo: 'DC005', name: '赵雪梅', gender: 'female', phone: '133****7890', email: 'zhaoxm@danchaban.com', departmentId: 'dept-2', teamId: 'team-3', position: '品牌经理', role: 'staff', joinDate: '2022-07-15', status: 'active' },
  { id: 'emp-6', empNo: 'DC006', name: '周丽华', gender: 'female', phone: '158****6789', email: 'zhoulh@danchaban.com', departmentId: 'dept-2', teamId: 'team-4', position: '客户经理', role: 'manager', joinDate: '2022-08-01', status: 'active', remark: '负责华东区客户' },
  { id: 'emp-7', empNo: 'DC007', name: '李娜', gender: 'female', phone: '139****5678', email: 'lina@danchaban.com', departmentId: 'dept-2', teamId: 'team-4', position: '客户经理', role: 'manager', joinDate: '2023-01-10', status: 'active', remark: '负责华南区客户' },
  { id: 'emp-8', empNo: 'DC008', name: '王强', gender: 'male', phone: '137****9012', email: 'wangqiang@danchaban.com', departmentId: 'dept-2', teamId: 'team-4', position: '跟单员', role: 'follower', joinDate: '2023-03-20', status: 'active' },
  { id: 'emp-9', empNo: 'DC009', name: '张伟', gender: 'male', phone: '138****1234', email: 'zhangwei@danchaban.com', departmentId: 'dept-2', teamId: 'team-4', position: '跟单员', role: 'follower', joinDate: '2023-05-15', status: 'active' },
  { id: 'emp-10', empNo: 'DC010', name: '张雅琴', gender: 'female', phone: '136****9012', email: 'zhangyq@danchaban.com', departmentId: 'dept-3', teamId: 'team-5', position: '门店总监', role: 'manager', joinDate: '2022-03-01', status: 'active', remark: '门店管理部负责人' },
  { id: 'emp-11', empNo: 'DC011', name: '黄志强', gender: 'male', phone: '159****0123', email: 'huangzq@danchaban.com', departmentId: 'dept-3', teamId: 'team-5', position: '区域经理', role: 'manager', joinDate: '2022-09-10', status: 'active', remark: '华东门店组负责人' },
  { id: 'emp-12', empNo: 'DC012', name: '王建国', gender: 'male', phone: '137****5678', email: 'wangjg@danchaban.com', departmentId: 'dept-3', teamId: 'team-6', position: '区域经理', role: 'manager', joinDate: '2022-10-15', status: 'active', remark: '华南门店组负责人' },
  { id: 'emp-13', empNo: 'DC013', name: '赵敏', gender: 'female', phone: '136****3456', email: 'zhaomin@danchaban.com', departmentId: 'dept-3', teamId: 'team-6', position: '店长', role: 'staff', joinDate: '2023-02-20', status: 'active' },
  { id: 'emp-14', empNo: 'DC014', name: '吴晓燕', gender: 'female', phone: '186****4567', email: 'wuxy@danchaban.com', departmentId: 'dept-4', teamId: 'team-7', position: '直播总监', role: 'manager', joinDate: '2022-05-01', status: 'active', remark: '直播与经纪部负责人' },
  { id: 'emp-15', empNo: 'DC015', name: '陈刚', gender: 'male', phone: '135****7890', email: 'chengang@danchaban.com', departmentId: 'dept-4', teamId: 'team-7', position: '直播运营', role: 'staff', joinDate: '2023-04-10', status: 'probation' },
  { id: 'emp-16', empNo: 'DC016', name: '陈志远', gender: 'male', phone: '020-8356****', email: 'chenzy@danchaban.com', departmentId: 'dept-2', teamId: 'team-4', position: '客户经理', role: 'manager', joinDate: '2022-11-05', status: 'active', remark: '负责广州区域客户' },
  { id: 'emp-17', empNo: 'DC017', name: '刘晓东', gender: 'male', phone: '0871-6543****', email: 'liuxd@danchaban.com', departmentId: 'dept-2', teamId: 'team-4', position: '客户经理', role: 'manager', joinDate: '2023-06-18', status: 'active', remark: '负责昆明区域客户' },
];

/* ── 客户与客户经理的映射关系 ── */
/* 客户的 contactPerson 字段对应客户经理姓名，此处建立客户→客户经理(员工)的映射 */
export const customerManagerMap: Record<string, string> = {
  // customerId → employeeId（客户经理）
  'c1': 'emp-6',   // 华茗堂茶庄 → 周丽华
  'c2': 'emp-6',   // 清心茶坊 → 周丽华
  'c3': 'emp-16',  // 品茗轩 → 陈志远
  'c4': 'emp-7',   // 翠竹茶行 → 李娜
  'c5': 'emp-17',  // 云顶茶舍 → 刘晓东
  'c6': 'emp-6',   // 浦发银行 → 周丽华
  'c7': 'emp-7',   // 交通银行 → 李娜
  'c8': 'emp-6',   // 中信证券 → 周丽华
  'c9': 'emp-7',   // 中国平安 → 李娜
  'c10': 'emp-16', // 招商银行 → 陈志远
  'c11': 'emp-6',  // 天福茗茶 → 周丽华
  'c12': 'emp-7',  // 八马茶业 → 李娜
  'c13': 'emp-16', // 大益茶体验馆 → 陈志远
  'c14': 'emp-17', // 茶里王国 → 刘晓东
  'c15': 'emp-6',  // 正山堂旗舰店 → 周丽华
};

/* ── 已完成回款的订单数据（用于绩效统计） ── */
/* 每条记录代表一笔已回款的销售订单 */
export interface CompletedOrderForPerformance {
  orderId: string;
  orderCode: string;
  customerId: string;
  customerName: string;
  /** 订单金额（元）= 销售实价合计 */
  amount: number;
  /** 销售实价合计（元） */
  actualSalesPrice: number;
  /** 采购实价合计（元） */
  actualPurchasePrice: number;
  /** 跟单员员工 ID（可能为空） */
  followerEmpId?: string;
  /** 跟单员姓名（可能为空） */
  followerName?: string;
  /** 回款日期 */
  paymentDate: string;
}

/** 计算单笔订单利润 =（销售实价 - 采购实价）× 90% */
export function getOrderProfit(order: CompletedOrderForPerformance): number {
  return (order.actualSalesPrice - order.actualPurchasePrice) * 0.9;
}

export const completedOrders: CompletedOrderForPerformance[] = [
  { orderId: 'SO-2025-0242', orderCode: 'SO-2025-0242', customerId: 'c1', customerName: '华茗堂茶庄', amount: 34800, actualSalesPrice: 34800, actualPurchasePrice: 21576, followerEmpId: 'emp-8', followerName: '王强', paymentDate: '2025-07-15' },
  { orderId: 'SO-2025-0241', orderCode: 'SO-2025-0241', customerId: 'c2', customerName: '清心茶坊', amount: 36000, actualSalesPrice: 36000, actualPurchasePrice: 23400, followerEmpId: 'emp-9', followerName: '张伟', paymentDate: '2025-07-14' },
  { orderId: 'SO-2025-0240', orderCode: 'SO-2025-0240', customerId: 'c3', customerName: '品茗轩', amount: 44800, actualSalesPrice: 44800, actualPurchasePrice: 26880, followerEmpId: 'emp-8', followerName: '王强', paymentDate: '2025-07-13' },
  { orderId: 'SO-2025-0239', orderCode: 'SO-2025-0239', customerId: 'c4', customerName: '翠竹茶行', amount: 18000, actualSalesPrice: 18000, actualPurchasePrice: 11700, followerEmpId: undefined, followerName: undefined, paymentDate: '2025-07-12' },
  { orderId: 'SO-2025-0238', orderCode: 'SO-2025-0238', customerId: 'c5', customerName: '云顶茶舍', amount: 17600, actualSalesPrice: 17600, actualPurchasePrice: 11440, followerEmpId: 'emp-9', followerName: '张伟', paymentDate: '2025-07-11' },
  { orderId: 'SO-2025-0237', orderCode: 'SO-2025-0237', customerId: 'c6', customerName: '浦发银行', amount: 42500, actualSalesPrice: 42500, actualPurchasePrice: 26350, followerEmpId: undefined, followerName: undefined, paymentDate: '2025-07-10' },
  { orderId: 'SO-2025-0236', orderCode: 'SO-2025-0236', customerId: 'c7', customerName: '交通银行', amount: 36800, actualSalesPrice: 36800, actualPurchasePrice: 22908, followerEmpId: 'emp-8', followerName: '王强', paymentDate: '2025-07-09' },
  { orderId: 'SO-2025-0235', orderCode: 'SO-2025-0235', customerId: 'c8', customerName: '中信证券', amount: 53600, actualSalesPrice: 53600, actualPurchasePrice: 33768, followerEmpId: 'emp-9', followerName: '张伟', paymentDate: '2025-07-08' },
  { orderId: 'SO-2025-0234', orderCode: 'SO-2025-0234', customerId: 'c9', customerName: '中国平安', amount: 28500, actualSalesPrice: 28500, actualPurchasePrice: 17670, followerEmpId: undefined, followerName: undefined, paymentDate: '2025-07-07' },
  { orderId: 'SO-2025-0233', orderCode: 'SO-2025-0233', customerId: 'c10', customerName: '招商银行', amount: 19600, actualSalesPrice: 19600, actualPurchasePrice: 12152, followerEmpId: 'emp-8', followerName: '王强', paymentDate: '2025-07-06' },
  { orderId: 'SO-2025-0232', orderCode: 'SO-2025-0232', customerId: 'c11', customerName: '天福茗茶', amount: 82600, actualSalesPrice: 82600, actualPurchasePrice: 49560, followerEmpId: 'emp-9', followerName: '张伟', paymentDate: '2025-07-05' },
  { orderId: 'SO-2025-0231', orderCode: 'SO-2025-0231', customerId: 'c12', customerName: '八马茶业', amount: 64500, actualSalesPrice: 64500, actualPurchasePrice: 40020, followerEmpId: undefined, followerName: undefined, paymentDate: '2025-07-04' },
  { orderId: 'SO-2025-0230', orderCode: 'SO-2025-0230', customerId: 'c13', customerName: '大益茶体验馆', amount: 49800, actualSalesPrice: 49800, actualPurchasePrice: 30876, followerEmpId: 'emp-8', followerName: '王强', paymentDate: '2025-07-03' },
  { orderId: 'SO-2025-0229', orderCode: 'SO-2025-0229', customerId: 'c14', customerName: '茶里王国', amount: 31200, actualSalesPrice: 31200, actualPurchasePrice: 19344, followerEmpId: 'emp-9', followerName: '张伟', paymentDate: '2025-07-02' },
  { orderId: 'SO-2025-0228', orderCode: 'SO-2025-0228', customerId: 'c1', customerName: '华茗堂茶庄', amount: 28600, actualSalesPrice: 28600, actualPurchasePrice: 17732, followerEmpId: undefined, followerName: undefined, paymentDate: '2025-07-01' },
  { orderId: 'SO-2025-0227', orderCode: 'SO-2025-0227', customerId: 'c2', customerName: '清心茶坊', amount: 45200, actualSalesPrice: 45200, actualPurchasePrice: 28024, followerEmpId: 'emp-8', followerName: '王强', paymentDate: '2025-06-30' },
  { orderId: 'SO-2025-0226', orderCode: 'SO-2025-0226', customerId: 'c4', customerName: '翠竹茶行', amount: 19800, actualSalesPrice: 19800, actualPurchasePrice: 12276, followerEmpId: 'emp-9', followerName: '张伟', paymentDate: '2025-06-29' },
  { orderId: 'SO-2025-0225', orderCode: 'SO-2025-0225', customerId: 'c6', customerName: '浦发银行', amount: 38500, actualSalesPrice: 38500, actualPurchasePrice: 23870, followerEmpId: 'emp-8', followerName: '王强', paymentDate: '2025-06-28' },
  { orderId: 'SO-2025-0224', orderCode: 'SO-2025-0224', customerId: 'c8', customerName: '中信证券', amount: 52600, actualSalesPrice: 52600, actualPurchasePrice: 32612, followerEmpId: undefined, followerName: undefined, paymentDate: '2025-06-27' },
  { orderId: 'SO-2025-0223', orderCode: 'SO-2025-0223', customerId: 'c11', customerName: '天福茗茶', amount: 72800, actualSalesPrice: 72800, actualPurchasePrice: 43680, followerEmpId: 'emp-9', followerName: '张伟', paymentDate: '2025-06-26' },
];

/* ── 绩效统计工具函数 ── */

/**
 * 计算员工绩效（销售绩效 + 绩效利润）
 *
 * 【销售绩效】基于订单金额：
 * 1. 有跟单员 → 订单金额 × 40% 计入跟单员
 * 2. 无跟单员 → 订单金额 × 40% 计入客户经理
 * 3. 不管有无跟单员 → 订单金额 × 50% 计入客户经理
 *
 * 【绩效利润】基于订单利润（=（销售实价 - 采购实价）× 90%），规则同上：
 * 1. 有跟单员 → 订单利润 × 40% 计入跟单员
 * 2. 无跟单员 → 订单利润 × 40% 计入客户经理
 * 3. 不管有无跟单员 → 订单利润 × 50% 计入客户经理
 */
export function calculateEmployeePerformance(): EmployeePerformance[] {
  const resultMap = new Map<string, EmployeePerformance>();

  // 初始化所有有角色的员工
  employees.forEach((emp) => {
    if (emp.role === 'manager' || emp.role === 'follower') {
      const dept = orgNodes.find((n) => n.id === emp.departmentId);
      resultMap.set(emp.id, {
        employeeId: emp.id,
        employeeName: emp.name,
        departmentName: dept?.name ?? '-',
        position: emp.position,
        role: emp.role,
        followerAmount: 0,
        managerAmount: 0,
        totalAmount: 0,
        followerProfit: 0,
        managerProfit: 0,
        totalProfit: 0,
        orderCount: 0,
      });
    }
  });

  // 遍历已完成回款的订单
  completedOrders.forEach((order) => {
    const managerEmpId = customerManagerMap[order.customerId];
    const followerEmpId = order.followerEmpId;
    const profit = getOrderProfit(order); // 订单利润

    // ── 销售绩效（基于订单金额）──
    // 规则1：有跟单员 → 金额×40% 计入跟单员
    if (followerEmpId) {
      const perf = resultMap.get(followerEmpId);
      if (perf) {
        perf.followerAmount += order.amount * 0.4;
        perf.followerProfit += profit * 0.4;
        perf.orderCount += 1;
      }
    } else {
      // 规则2：无跟单员 → 金额×40% 计入客户经理
      if (managerEmpId) {
        const perf = resultMap.get(managerEmpId);
        if (perf) {
          perf.managerAmount += order.amount * 0.4;
          perf.managerProfit += profit * 0.4;
          perf.orderCount += 1;
        }
      }
    }

    // 规则3：不管有无跟单员 → 金额×50% 计入客户经理
    if (managerEmpId) {
      const perf = resultMap.get(managerEmpId);
      if (perf) {
        perf.managerAmount += order.amount * 0.5;
        perf.managerProfit += profit * 0.5;
        if (followerEmpId) {
          perf.orderCount += 1;
        }
      }
    }
  });

  // 计算总额
  const results = Array.from(resultMap.values());
  results.forEach((p) => {
    p.followerAmount = Math.round(p.followerAmount);
    p.managerAmount = Math.round(p.managerAmount);
    p.totalAmount = p.followerAmount + p.managerAmount;
    p.followerProfit = Math.round(p.followerProfit);
    p.managerProfit = Math.round(p.managerProfit);
    p.totalProfit = p.followerProfit + p.managerProfit;
  });

  // 按销售绩效总额降序
  results.sort((a, b) => b.totalAmount - a.totalAmount);
  return results;
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

/** 角色标签 */
export const ROLE_LABELS: Record<EmployeeRole, string> = {
  manager: '客户经理',
  salesperson: '销售员',
  follower: '跟单员',
  staff: '普通员工',
};

/** 员工状态标签 */
export const EMP_STATUS_LABELS: Record<string, string> = {
  active: '在职',
  inactive: '离职',
  probation: '试用期',
};
