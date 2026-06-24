import type { Streamer } from '../types';

export const streamers: Streamer[] = [
  { id: 'st-1', name: '林雨桐', phone: '138****5678', settlement: { accountName: '林雨桐', accountNo: '6228****5678', bankName: '中国工商银行福州鼓楼支行', bankNo: '10239100XXX' }, remark: '由茶人联动创建', linkedTeaProfessionalId: '1' },
  { id: 'st-2', name: '陈思远', phone: '139****1234', settlement: { accountName: '陈思远', accountNo: '6228****1234', bankName: '中国农业银行昆明盘龙支行', bankNo: '10373100XXX' }, remark: '由茶人联动创建', linkedTeaProfessionalId: '2' },
  { id: 'st-3', name: '吴晓燕', phone: '137****3456', settlement: { accountName: '吴晓燕', accountNo: '6228****3456', bankName: '中国建设银行杭州西湖支行', bankNo: '10533100XXX' }, remark: '由茶人联动创建', linkedTeaProfessionalId: '3' },
];

/** 生成带货人 ID */
export function generateStreamerId(): string {
  return `st-${Date.now()}`;
}
