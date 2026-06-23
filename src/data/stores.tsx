/**
 * 门店数据源
 * - 门店在「销售 > 门店管理」中维护（增删改查）
 * - 门店地址作为门店仓库与「仓储 > 仓库设置」联动（只读派生）
 */
import type { StoreItem } from '../types';

/** 门店初始数据 */
export const storeItems: StoreItem[] = [
  { id: 'store-01', code: 'MD-0001', name: '西湖茶庄', province: '浙江', city: '杭州市', district: '西湖区', address: '龙井路8号', manager: '周店长', phone: '0571-8801****', businessHours: '09:00-21:00', openingDate: '2021-03-15', area: 120, status: 'active', remark: '总店，临近龙井茶园' },
  { id: 'store-02', code: 'MD-0002', name: '武夷岩茶馆', province: '福建', city: '南平市', district: '武夷山市', address: '度假区大王峰路18号', manager: '吴店长', phone: '0599-525****', businessHours: '08:30-20:30', openingDate: '2022-05-01', area: 95, status: 'active', remark: '主营岩茶、红茶' },
  { id: 'store-03', code: 'MD-0003', name: '广州茶博城店', province: '广东', city: '广州市', district: '荔湾区', address: '芳村大道中50号茶博城', manager: '郑店长', phone: '020-8180****', businessHours: '09:00-20:00', openingDate: '2022-09-10', area: 200, status: 'active', remark: '华南区旗舰店' },
  { id: 'store-04', code: 'MD-0004', name: '北京马连道店', province: '北京', city: '北京市', district: '西城区', address: '马连道茶叶街10号', manager: '孙店长', phone: '010-6334****', businessHours: '09:00-21:00', openingDate: '2023-01-08', area: 150, status: 'active', remark: '北方区总店' },
  { id: 'store-05', code: 'MD-0005', name: '成都宽窄巷子店', province: '四川', city: '成都市', district: '青羊区', address: '宽窄巷子景区内12号', manager: '钱店长', phone: '028-8663****', businessHours: '10:00-22:00', openingDate: '2023-06-18', area: 80, status: 'active', remark: '景区门店，主打体验' },
  { id: 'store-06', code: 'MD-0006', name: '安溪铁观音馆', province: '福建', city: '泉州市', district: '安溪县', address: '中国茶都大厦1楼', manager: '冯店长', phone: '0595-232****', businessHours: '08:00-19:00', openingDate: '2020-11-20', area: 110, status: 'inactive', remark: '已暂停营业，筹备升级' },
];

/** 生成门店编号 */
export function generateStoreCode(sequence: number): string {
  return `MD-${String(sequence).padStart(4, '0')}`;
}
