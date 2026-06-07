/**
 * 商品编号规则工具
 *
 * 编号格式：一级分类(1位) + 二级分类(2位) + 品牌编号(2位) + 顺序号(5位) + 校验位(1位)
 * 共 11 位
 *
 * 一级分类：茶叶=1, 茶具=2, 茶周边=3, 其他=4
 * 二级分类：按各一级分类下的顺序从01开始编号
 * 品牌编号：按品牌建档顺序从01开始编号
 * 顺序号：每个品牌下从00001开始按建档顺序编号
 * 校验位：0-9随机数字
 */

/** 一级分类编号映射 */
export const L1_CATEGORY_CODES: Record<string, string> = {
  '茶叶': '1',
  '茶具': '2',
  '茶周边': '3',
  '其他': '4',
};

/** 茶叶二级分类编号映射（按分类管理中的顺序） */
export const TEA_L2_CATEGORY_CODES: Record<string, string> = {
  '绿茶': '01',
  '红茶': '02',
  '青茶': '03',
  '白茶': '04',
  '黄茶': '05',
  '黑茶': '06',
  '花草茶': '07',
};

/** 品牌编号映射（按建档顺序） */
export const BRAND_CODES: Record<string, string> = {
  '西湖牌': '01',
  '卢正浩': '02',
  '竹叶青': '03',
  '谢裕大': '04',
  '猴坑': '05',
  '正山堂': '06',
  '凤牌': '07',
  '天之红': '08',
  '武夷星': '09',
  '八马': '10',
  '海堤': '11',
  '品品香': '12',
  '绿雪芽': '13',
  '君山': '14',
  '蒙顶山茶': '15',
  '大益': '16',
  '白沙溪': '17',
  '澜沧古茶': '18',
  '张一元': '19',
  '吴裕泰': '20',
  '春伦': '21',
  '中茶': '22',
  '陈升号': '23',
  '老同志': '24',
  '天福茗茶': '25',
  '小罐茶': '26',
  '祥源茶': '27',
};

/** 反向映射：品牌编号 -> 品牌名 */
export const BRAND_CODE_TO_NAME: Record<string, string> = Object.fromEntries(
  Object.entries(BRAND_CODES).map(([name, code]) => [code, name])
);

/** 反向映射：茶叶二级分类编号 -> 分类名 */
export const TEA_L2_CODE_TO_NAME: Record<string, string> = Object.fromEntries(
  Object.entries(TEA_L2_CATEGORY_CODES).map(([name, code]) => [code, name])
);

/** 解析商品编号 */
export function parseProductCode(code: string): {
  l1Category: string;
  l2CategoryCode: string;
  brandCode: string;
  sequence: string;
  checkDigit: string;
} {
  return {
    l1Category: code.slice(0, 1),
    l2CategoryCode: code.slice(1, 3),
    brandCode: code.slice(3, 5),
    sequence: code.slice(5, 10),
    checkDigit: code.slice(10, 11),
  };
}

/** 生成随机校验位 */
export function generateCheckDigit(): string {
  return String(Math.floor(Math.random() * 10));
}

/**
 * 生成商品编号
 * @param l1Category 一级分类名（茶叶/茶具/茶周边/其他）
 * @param l2Category 二级分类名（如绿茶、红茶等）
 * @param brand 品牌名
 * @param sequence 顺序号（1-based）
 */
export function generateProductCode(
  l1Category: string,
  l2Category: string,
  brand: string,
  sequence: number,
): string {
  const l1 = L1_CATEGORY_CODES[l1Category] || '9';
  const l2 = TEA_L2_CATEGORY_CODES[l2Category] || '99';
  const brandCode = BRAND_CODES[brand] || '99';
  const seq = String(sequence).padStart(5, '0');
  const check = generateCheckDigit();
  return l1 + l2 + brandCode + seq + check;
}

/** 获取一级分类编号 */
export function getL1Code(categoryType: string): string {
  return L1_CATEGORY_CODES[categoryType] || '9';
}

/** 获取下一个品牌编号 */
export function getNextBrandCode(): string {
  const maxCode = Math.max(...Object.values(BRAND_CODES).map(Number));
  return String(maxCode + 1).padStart(2, '0');
}
