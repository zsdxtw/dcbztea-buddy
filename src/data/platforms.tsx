import type { PlatformItem } from '../types';

/** 生成平台编号 PT-xx */
let platformCounter = 6;
export function generatePlatformCode(): string {
  const code = `PT-${String(platformCounter).padStart(2, '0')}`;
  platformCounter++;
  return code;
}

/** 平台数据源 */
export const platformItems: PlatformItem[] = [
  {
    id: 'p1', name: '京东慧采', shortName: '京东慧采', code: 'PT-01',
    contactPerson: '王经理', contactPhone: '400-606-****', contactAddress: '北京市亦庄经济开发区京东总部',
    cooperationDate: '2022-05-10', commissionRate: '8%',
    bankAccounts: [
      { accountName: '北京京东世纪贸易有限公司', accountNo: '1100 **** ****', bankName: '中国工商银行北京亦庄支行', bankNo: '102100000XXX' },
    ],
    invoiceInfos: [
      { invoiceEntity: '北京京东世纪贸易有限公司', taxNo: '91110302MA***1234', taxRate: '6%' },
    ],
    status: 'active', remark: '京东企业采购平台',
  },
  {
    id: 'p2', name: '史泰博商贸', shortName: '史泰博', code: 'PT-02',
    contactPerson: '李主管', contactPhone: '400-820-****', contactAddress: '上海市长宁区史泰博大厦',
    cooperationDate: '2022-11-20', commissionRate: '6%',
    bankAccounts: [
      { accountName: '史泰博（上海）有限公司', accountNo: '3100 **** ****', bankName: '中国银行上海市长宁支行', bankNo: '10429000XXX' },
    ],
    invoiceInfos: [
      { invoiceEntity: '史泰博（上海）有限公司', taxNo: '91310105MA***5678', taxRate: '6%' },
    ],
    status: 'active', remark: '企业级办公与福利采购',
  },
  {
    id: 'p3', name: '得力集团B2B', shortName: '得力', code: 'PT-03',
    contactPerson: '陈经理', contactPhone: '400-185-****', contactAddress: '浙江省宁波市得力工业园',
    cooperationDate: '2023-03-15', commissionRate: '5%',
    bankAccounts: [
      { accountName: '得力集团有限公司', accountNo: '3902 **** ****', bankName: '中国建设银行宁海支行', bankNo: '10533220XXX' },
    ],
    invoiceInfos: [
      { invoiceEntity: '得力集团有限公司', taxNo: '91330226MA***9012', taxRate: '13%' },
    ],
    status: 'active',
  },
  {
    id: 'p4', name: '苏宁企业购', shortName: '苏宁', code: 'PT-04',
    contactPerson: '周主管', contactPhone: '400-836-****', contactAddress: '江苏省南京市苏宁总部',
    cooperationDate: '2023-08-01', commissionRate: '7%',
    bankAccounts: [
      { accountName: '苏宁易购集团股份有限公司', accountNo: '4301 **** ****', bankName: '中国农业银行南京玄武支行', bankNo: '10330100XXX' },
    ],
    invoiceInfos: [
      { invoiceEntity: '苏宁易购集团股份有限公司', taxNo: '91320100MA***3456', taxRate: '6%' },
    ],
    status: 'active',
  },
  {
    id: 'p5', name: '欧菲斯办公', shortName: '欧菲斯', code: 'PT-05',
    contactPerson: '吴经理', contactPhone: '400-090-****', contactAddress: '重庆市渝北区欧菲斯大厦',
    cooperationDate: '2024-01-10', commissionRate: '5.5%',
    bankAccounts: [
      { accountName: '欧菲斯办公伙伴控股有限公司', accountNo: '5001 **** ****', bankName: '中国工商银行重庆渝北支行', bankNo: '10265000XXX' },
    ],
    invoiceInfos: [
      { invoiceEntity: '欧菲斯办公伙伴控股有限公司', taxNo: '91500112MA***7890', taxRate: '6%' },
    ],
    status: 'active',
  },
];
