# 茶叶管理系统 - 项目规则

## 商品编码规则

商品编号共计 **12 位**，格式如下：

```
一级分类(1位) + 二级分类(2位) + 品牌编号(3位) + 顺序号(5位) + 校验位(1位)
```

### 各段说明

| 段落 | 位数 | 说明 |
|------|------|------|
| 一级分类 | 1位 | 茶叶=1, 茶具=2, 茶周边=3, 其他=4 |
| 二级分类 | 2位 | 按分类管理中各一级分类下的顺序从01开始编号 |
| 品牌编号 | 3位 | 联动品牌管理中的品牌编号（原始3位编号，如001、010、027） |
| 顺序号 | 5位 | 每个品牌下从00001开始按建档顺序编号 |
| 校验位 | 1位 | 0-9随机数字 |

### 示例

- `101001000013` = 茶叶(1) + 绿茶(01) + 西湖牌(001) + 00001 + 3
- `102006000017` = 茶叶(1) + 红茶(02) + 正山堂(006) + 00001 + 7
- `103010000024` = 茶叶(1) + 青茶(03) + 八马(010) + 00002 + 4

### 关键约束

1. **品牌编号联动**：商品编号中的品牌编号部分直接使用品牌管理中的3位原始编号，不做截取
2. **编号不可变**：已建立的商品编号不因分类管理中的新增/删除而改变
3. **分类删除保护**：分类管理中，若某分类下存在商品则不允许删除该分类
4. **二级分类编号**：茶叶二级分类为 绿茶01、红茶02、青茶03，白茶04、黄茶05、黑茶06、花草茶07

### 相关文件

- 编号工具函数：`src/utils/productCode.ts`
- 品牌数据源（含编号）：`src/data/brands.tsx`
- 分类数据源：`src/data/productCategories.tsx`
- 商品数据：`src/data/teaProducts.tsx`

---

## 配色规则

### 模块主色调与辅色调

一级导航菜单选中时的配色为该模块的主色调，辅色调用于需要与主色调区分的强调场景（如删除按钮、分类标签等）。通过 `data-module` 属性切换 CSS 变量实现全局主题色联动。

| 模块 | ModuleKey | 主色调 | 色值 | 辅色调 | 色值 |
|------|-----------|--------|------|--------|------|
| 工作台 | dashboard | 深蓝 | <span style="display:inline-block;width:14px;height:14px;background:#023270;border-radius:3px;border:1px solid rgba(0,0,0,0.15);vertical-align:middle;margin-left:4px"></span> `#023270` | 粉红 | <span style="display:inline-block;width:14px;height:14px;background:#FD7A99;border-radius:3px;border:1px solid rgba(0,0,0,0.15);vertical-align:middle;margin-left:4px"></span> `#FD7A99` |
| 采购 | purchase | 玫红 | <span style="display:inline-block;width:14px;height:14px;background:#CB405D;border-radius:3px;border:1px solid rgba(0,0,0,0.15);vertical-align:middle;margin-left:4px"></span> `#CB405D` | 蓝 | <span style="display:inline-block;width:14px;height:14px;background:#0F64B5;border-radius:3px;border:1px solid rgba(0,0,0,0.15);vertical-align:middle;margin-left:4px"></span> `#0F64B5` |
| 销售 | sales | 蓝色 | <span style="display:inline-block;width:14px;height:14px;background:#0F64B5;border-radius:3px;border:1px solid rgba(0,0,0,0.15);vertical-align:middle;margin-left:4px"></span> `#0F64B5` | 玫红 | <span style="display:inline-block;width:14px;height:14px;background:#CB405D;border-radius:3px;border:1px solid rgba(0,0,0,0.15);vertical-align:middle;margin-left:4px"></span> `#CB405D` |
| 商品 | product | 翡翠绿 | <span style="display:inline-block;width:14px;height:14px;background:#01795D;border-radius:3px;border:1px solid rgba(0,0,0,0.15);vertical-align:middle;margin-left:4px"></span> `#01795D` | 橙色 | <span style="display:inline-block;width:14px;height:14px;background:#eb5c20;border-radius:3px;border:1px solid rgba(0,0,0,0.15);vertical-align:middle;margin-left:4px"></span> `#eb5c20` |
| 人员 | personnel | 紫罗兰 | <span style="display:inline-block;width:14px;height:14px;background:#9D73BD;border-radius:3px;border:1px solid rgba(0,0,0,0.15);vertical-align:middle;margin-left:4px"></span> `#9D73BD` | 鹅黄 | <span style="display:inline-block;width:14px;height:14px;background:#FDDE83;border-radius:3px;border:1px solid rgba(0,0,0,0.15);vertical-align:middle;margin-left:4px"></span> `#FDDE83` |
| 仓储 | inventory | 橙色 | <span style="display:inline-block;width:14px;height:14px;background:#eb5c20;border-radius:3px;border:1px solid rgba(0,0,0,0.15);vertical-align:middle;margin-left:4px"></span> `#eb5c20` | 翡翠绿 | <span style="display:inline-block;width:14px;height:14px;background:#01795D;border-radius:3px;border:1px solid rgba(0,0,0,0.15);vertical-align:middle;margin-left:4px"></span> `#01795D` |
| 财务 | finance | 深靛 | <span style="display:inline-block;width:14px;height:14px;background:#27254B;border-radius:3px;border:1px solid rgba(0,0,0,0.15);vertical-align:middle;margin-left:4px"></span> `#27254B` | 蓝灰 | <span style="display:inline-block;width:14px;height:14px;background:#7BA6D1;border-radius:3px;border:1px solid rgba(0,0,0,0.15);vertical-align:middle;margin-left:4px"></span> `#7BA6D1` |
| 统计 | statistics | 棕色 | <span style="display:inline-block;width:14px;height:14px;background:#5F4027;border-radius:3px;border:1px solid rgba(0,0,0,0.15);vertical-align:middle;margin-left:4px"></span> `#5F4027` | 浅橙 | <span style="display:inline-block;width:14px;height:14px;background:#FED6B8;border-radius:3px;border:1px solid rgba(0,0,0,0.15);vertical-align:middle;margin-left:4px"></span> `#FED6B8` |
| 系统 | settings | 灰色 | <span style="display:inline-block;width:14px;height:14px;background:#6B7280;border-radius:3px;border:1px solid rgba(0,0,0,0.15);vertical-align:middle;margin-left:4px"></span> `#6B7280` | — | — |

### 模块色阶体系

每个模块定义五级色阶，用于不同场景：

| 级别 | CSS 变量后缀 | 用途 |
|------|-------------|------|
| lightest | `-lightest` | 浅底背景、标签背景 |
| light | `-light` | 悬浮背景、次要高亮 |
| base | `-base` | 主色调，按钮、选中态、强调 |
| dark | `-dark` | 按钮悬浮态 |
| darkest | `-darkest` | 深色文字、极端强调 |

### 辅色调使用说明

- **工作台辅色** <span style="display:inline-block;width:12px;height:12px;background:#FD7A99;border-radius:2px;border:1px solid rgba(0,0,0,0.1);vertical-align:middle;margin-left:2px"></span> `#FD7A99`：用于工作台模块下的强调操作
- **采购辅色** <span style="display:inline-block;width:12px;height:12px;background:#0F64B5;border-radius:2px;border:1px solid rgba(0,0,0,0.1);vertical-align:middle;margin-left:2px"></span> `#0F64B5`：用于采购模块下的次要操作、链接等
- **销售辅色** <span style="display:inline-block;width:12px;height:12px;background:#CB405D;border-radius:2px;border:1px solid rgba(0,0,0,0.1);vertical-align:middle;margin-left:2px"></span> `#CB405D`：用于销售模块下的删除按钮、平台方标签、金额等数据展示
- **商品辅色** <span style="display:inline-block;width:12px;height:12px;background:#eb5c20;border-radius:2px;border:1px solid rgba(0,0,0,0.1);vertical-align:middle;margin-left:2px"></span> `#eb5c20`：用于商品模块下的删除按钮、警告操作
- **人员辅色** <span style="display:inline-block;width:12px;height:12px;background:#FDDE83;border-radius:2px;border:1px solid rgba(0,0,0,0.1);vertical-align:middle;margin-left:2px"></span> `#FDDE83`：用于人员模块下的次要信息展示
- **仓储辅色** <span style="display:inline-block;width:12px;height:12px;background:#01795D;border-radius:2px;border:1px solid rgba(0,0,0,0.1);vertical-align:middle;margin-left:2px"></span> `#01795D`：用于仓储模块下的翡翠绿强调
- **财务辅色** <span style="display:inline-block;width:12px;height:12px;background:#7BA6D1;border-radius:2px;border:1px solid rgba(0,0,0,0.1);vertical-align:middle;margin-left:2px"></span> `#7BA6D1`：用于财务模块下的银行、账号等信息
- **统计辅色** <span style="display:inline-block;width:12px;height:12px;background:#FED6B8;border-radius:2px;border:1px solid rgba(0,0,0,0.1);vertical-align:middle;margin-left:2px"></span> `#FED6B8`：用于统计模块下的浅橙强调

### 模块色切换机制

1. 根元素通过 `document.body.dataset.module = currentModule` 设置当前模块
2. CSS 通过 `[data-module="xxx"]` 选择器切换 `--color-module-current-*` 变量
3. 全局组件（按钮、标签、卡片等）使用 `var(--color-module-current-base)` 自动适配当前模块色
4. 辅色通过 `var(--color-module-{module}-secondary)` 和 `var(--color-module-{module}-secondary-light)` 使用

### 相关文件

- 色阶变量定义：`src/tokens/index.css`
- 模块配置：`src/data/modules.tsx`
- 模块切换逻辑：`src/App.tsx`
- 模块 Hook：`src/hooks/useModule.ts`

---

## 茶类标签样式

以"茶叶档案"菜单下"六大茶类"页面中的茶类标签为全局标准样式，所有涉及茶类分类展示的场景均使用 `<Tag category={TeaCategory} />` 组件。

### 标签规格

- 高度：24px
- 内边距：0 8px
- 圆角：4px（`var(--radius-sm)`）
- 字号：12px（`var(--text-xs)`）
- 字重：500（`var(--font-medium)`）
- 边框：1px solid

### 七大茶类配色

| 茶类 | TeaCategory | 背景色 | 文字色 | 边框色 |
|------|-------------|--------|--------|--------|
| 绿茶 | green | <span style="display:inline-block;width:14px;height:14px;background:#F0F6E4;border-radius:3px;border:1px solid rgba(0,0,0,0.1);vertical-align:middle;margin-left:4px"></span> `#F0F6E4` | <span style="display:inline-block;width:14px;height:14px;background:#5C7A2A;border-radius:3px;border:1px solid rgba(0,0,0,0.15);vertical-align:middle;margin-left:4px"></span> `#5C7A2A` | <span style="display:inline-block;width:14px;height:14px;background:#D8E8C0;border-radius:3px;border:1px solid rgba(0,0,0,0.1);vertical-align:middle;margin-left:4px"></span> `#D8E8C0` |
| 白茶 | white | <span style="display:inline-block;width:14px;height:14px;background:#F9F3E8;border-radius:3px;border:1px solid rgba(0,0,0,0.1);vertical-align:middle;margin-left:4px"></span> `#F9F3E8` | <span style="display:inline-block;width:14px;height:14px;background:#9A8450;border-radius:3px;border:1px solid rgba(0,0,0,0.15);vertical-align:middle;margin-left:4px"></span> `#9A8450` | <span style="display:inline-block;width:14px;height:14px;background:#E8D8B8;border-radius:3px;border:1px solid rgba(0,0,0,0.1);vertical-align:middle;margin-left:4px"></span> `#E8D8B8` |
| 黄茶 | yellow | <span style="display:inline-block;width:14px;height:14px;background:#FAF3E0;border-radius:3px;border:1px solid rgba(0,0,0,0.1);vertical-align:middle;margin-left:4px"></span> `#FAF3E0` | <span style="display:inline-block;width:14px;height:14px;background:#8A7530;border-radius:3px;border:1px solid rgba(0,0,0,0.15);vertical-align:middle;margin-left:4px"></span> `#8A7530` | <span style="display:inline-block;width:14px;height:14px;background:#E8D8A0;border-radius:3px;border:1px solid rgba(0,0,0,0.1);vertical-align:middle;margin-left:4px"></span> `#E8D8A0` |
| 青茶 | oolong | <span style="display:inline-block;width:14px;height:14px;background:#EFF2E8;border-radius:3px;border:1px solid rgba(0,0,0,0.1);vertical-align:middle;margin-left:4px"></span> `#EFF2E8` | <span style="display:inline-block;width:14px;height:14px;background:#3E4A28;border-radius:3px;border:1px solid rgba(0,0,0,0.15);vertical-align:middle;margin-left:4px"></span> `#3E4A28` | <span style="display:inline-block;width:14px;height:14px;background:#C8D0B0;border-radius:3px;border:1px solid rgba(0,0,0,0.1);vertical-align:middle;margin-left:4px"></span> `#C8D0B0` |
| 红茶 | red | <span style="display:inline-block;width:14px;height:14px;background:#F8ECEC;border-radius:3px;border:1px solid rgba(0,0,0,0.1);vertical-align:middle;margin-left:4px"></span> `#F8ECEC` | <span style="display:inline-block;width:14px;height:14px;background:#7A2A28;border-radius:3px;border:1px solid rgba(0,0,0,0.15);vertical-align:middle;margin-left:4px"></span> `#7A2A28` | <span style="display:inline-block;width:14px;height:14px;background:#E0C0C0;border-radius:3px;border:1px solid rgba(0,0,0,0.1);vertical-align:middle;margin-left:4px"></span> `#E0C0C0` |
| 黑茶 | dark | <span style="display:inline-block;width:14px;height:14px;background:#F0EBE6;border-radius:3px;border:1px solid rgba(0,0,0,0.1);vertical-align:middle;margin-left:4px"></span> `#F0EBE6` | <span style="display:inline-block;width:14px;height:14px;background:#3A2E20;border-radius:3px;border:1px solid rgba(0,0,0,0.15);vertical-align:middle;margin-left:4px"></span> `#3A2E20` | <span style="display:inline-block;width:14px;height:14px;background:#D0C8B8;border-radius:3px;border:1px solid rgba(0,0,0,0.1);vertical-align:middle;margin-left:4px"></span> `#D0C8B8` |
| 花草茶 | flower | <span style="display:inline-block;width:14px;height:14px;background:#FFF0F5;border-radius:3px;border:1px solid rgba(0,0,0,0.1);vertical-align:middle;margin-left:4px"></span> `#FFF0F5` | <span style="display:inline-block;width:14px;height:14px;background:#B03070;border-radius:3px;border:1px solid rgba(0,0,0,0.15);vertical-align:middle;margin-left:4px"></span> `#B03070` | <span style="display:inline-block;width:14px;height:14px;background:#F0C0D8;border-radius:3px;border:1px solid rgba(0,0,0,0.1);vertical-align:middle;margin-left:4px"></span> `#F0C0D8` |

### CSS 类名映射

| 茶类 | CSS 类名 |
|------|---------|
| 绿茶 | `.tag-green` |
| 白茶 | `.tag-white` |
| 黄茶 | `.tag-yellow` |
| 青茶 | `.tag-oolong` |
| 红茶 | `.tag-red` |
| 黑茶 | `.tag-dark` |
| 花草茶 | `.tag-flower` |

### 使用规范

1. 所有茶类分类展示统一使用 `<Tag category={TeaCategory.XXX} />` 组件，不得自定义样式
2. 茶类标签颜色通过 CSS 变量 `--color-tea-{category}-bg/text/border` 控制
3. 新增茶类需同步更新：`Tag.tsx` 组件、`index.css` 色值变量、`teaCategories.ts` 数据源

### 相关文件

- 标签组件：`src/components/common/Tag.tsx`
- 色值变量：`src/tokens/index.css`（`--color-tea-*`）
- 茶类数据源：`src/data/teaCategories.ts`
- 六大茶类页面：`src/pages/product/ProductTeaCategory.tsx`

---

## 价格体系规则

整个项目的商品价格体系由 **8 种价格** 构成，分为「基准价」「渠道价」「订单实价」三层，所有价格均以元为单位、数值类型。

### 价格类型定义

| 序号 | 价格名称 | 字段名 | 归属层级 | 说明 |
|------|----------|--------|----------|------|
| 1 | 市场价 | `marketPrice` | 基准价 | 品牌方制定的市场正常销售价，一般为零售价。存储于商品档案 `TeaProduct` |
| 2 | 京东价 | `jdPrice` | 基准价 | 京东自营旗舰店的销售价格。存储于商品档案 `TeaProduct` |
| 3 | 天猫价 | `tmallPrice` | 基准价 | 天猫旗舰店的销售价格。存储于商品档案 `TeaProduct` |
| 4 | 采购价 | `purchasePrice` | 渠道价 | 当前系统内与供应商商定的商品进货价格。按「商品 + 供应商」维度维护，存储于 `PurchasePriceRule` |
| 5 | 销售价 | `salesPrice` | 渠道价 | 当前系统内各商品标准的对外销售价。按「商品」维度维护，存储于商品档案 `TeaProduct.salesPrice` |
| 6 | VIP销售价 | `vipPrice` | 渠道价 | 针对不同客户设置的差异化销售价，关联具体客户。按「商品 + 客户」维度维护，存储于 `VipPriceRule`，一个商品可为多个客户设置不同 VIP 价 |
| 7 | 采购实价 | `actualPurchasePrice` | 订单实价 | 关联到具体采购订单的商品价格，记录采购下单时的实际采购价格。存储于采购订单明细 `PurchaseOrderItem` |
| 8 | 销售实价 | `actualSalesPrice` | 订单实价 | 关联到具体销售订单的商品价格，记录销售下单时的实际销售价格。存储于销售订单明细 `SalesOrderItem` |

### 价格层级与取值优先级

```
基准价（商品档案）         渠道价（价格规则）           订单实价（订单明细）
marketPrice                purchasePrice               actualPurchasePrice
jdPrice                    salesPrice                  actualSalesPrice
tmallPrice                 vipPrice
```

**销售下单取价优先级**：VIP销售价（当前客户） > 销售价 > 市场价

**采购下单取价优先级**：采购价（当前供应商） > 市场价 × 采购折扣率

### 各价格维护入口

| 价格 | 维护入口 | 维度 |
|------|----------|------|
| 市场价 / 京东价 / 天猫价 | 商品 > 价格管理 > 市场价管理 Tab；商品档案编辑 | 商品 |
| 采购价 | 商品 > 价格管理 > 采购价管理 Tab；采购 > 采购报（调）价 | 商品 + 供应商 |
| 销售价 | 商品 > 价格管理 > 销售价管理 Tab | 商品 |
| VIP销售价 | 商品 > 价格管理 > VIP销售价 Tab；销售 > 报价管理 | 商品 + 客户 |
| 采购实价 | 采购 > 采购订单（新建/编辑订单时调整） | 采购订单 + 商品 |
| 销售实价 | 销售 > 销售订单（新建/编辑订单时调整） | 销售订单 + 商品 |

### 订单价格调整规则

1. **采购下单**：选择商品后自动带出该供应商的采购价作为默认单价，支持在订单内调整，调整后的价格记录为该订单的「采购实价」，不回写到采购价规则
2. **销售下单**：选择商品后按取价优先级自动带出默认单价（VIP价 > 销售价 > 市场价），支持在订单内调整，调整后的价格记录为该订单的「销售实价」，不回写到 VIP 价或销售价规则
3. **实价不可回写**：订单内的价格调整仅影响当前订单，不修改商品档案或价格规则中的基准价/渠道价
4. **实价留痕**：订单保存后，实价随订单明细永久保存，用于财务对账和利润分析

### 关键约束

1. **基准价唯一**：市场价、京东价、天猫价、销售价均为商品级单一值，一个商品只有一条
2. **渠道价多维**：采购价按「商品+供应商」唯一，VIP销售价按「商品+客户」唯一
3. **实价随单**：采购实价/销售实价一旦订单创建即固化，订单内可改，订单外不可改
4. **价格联动展示**：采购下单时展示「市场价 / 采购价 / 实价」三列对比；销售下单时展示「市场价 / 销售价或VIP价 / 实价」三列对比

### 相关文件

- 价格数据源：`src/data/prices.tsx`（采购价规则、VIP销售价规则）
- 价格类型定义：`src/types/index.ts`（`PurchasePriceRule`、`VipPriceRule`、`PurchaseOrderItem`、`SalesOrderItem`）
- 商品档案：`src/data/teaProducts.tsx`（`marketPrice`、`jdPrice`、`tmallPrice`、`salesPrice`）
- 价格管理页面：`src/pages/product/ProductPrice.tsx`
- 采购报价页面：`src/pages/purchase/PurchasePricing.tsx`
- 销售报价页面：`src/pages/sales/SalesQuotations.tsx`
- 采购订单页面：`src/pages/purchase/PurchaseOrders.tsx`
- 销售订单页面：`src/pages/sales/SalesOrders.tsx`

---

## 客户类型规则

本项目共有 **5 种客户类型**，其中前 4 种在"客户管理"菜单下展示，游客客户不在客户管理中展示。

| 序号 | 客户类型 | CustomerType | 编号前缀 | 说明 |
|------|----------|-------------|----------|------|
| 1 | 直营客户 | `direct` | VZY | 企业客户，包括直接销售和经平台销售的客户 |
| 2 | 渠道客户 | `channel` | VQD | 企业客户，非终端客户，采购后二次销售的客户 |
| 3 | 个人客户 | `personal` | VGR | 个人客户，不区分采购后是个人消费还是二次销售 |
| 4 | 平台客户 | `platform` | VPT | 京东慧采、史泰博、易积通等集采平台客户 |
| 5 | 游客客户 | `guest` | VYK | 未知客户具体情况的自来客户（不在客户管理中展示） |

### 客户编号规则

编号格式：`前缀-简称首字母-顺序号(4位)`，各类型单独从 0001 开始编号。

### 相关文件

- 客户类型定义：`src/types/index.ts`（`CustomerType`）
- 客户数据源：`src/data/customers.tsx`
- 编号工具：`src/utils/customerCode.ts`
- 客户管理页面：`src/pages/sales/SalesCustomers.tsx`

---

## 订单销售场景规则

订单销售共有 **6 种情况**，每种情况对应不同的绩效计算方式。

### 6 种销售场景

| 场景 | 描述 | 销售链路 | 说明 |
|------|------|----------|------|
| 1 | 淡茶销售给直营客户 | 淡茶 → 直营客户 | 直接销售给终端企业客户 |
| 2 | 淡茶经平台销售给直营客户 | 淡茶 → 平台客户 → 直营客户 | 通过集采平台销售给终端客户，需扣除平台扣点 |
| 3 | 淡茶销售给渠道客户 | 淡茶 → 渠道客户 | 销售给二次销售的渠道商 |
| 4 | 淡茶销售给个人客户 | 淡茶 → 个人客户 | 销售给个人消费者 |
| 5 | 淡茶销售给平台客户 | 淡茶 → 平台客户 | 直接销售给集采平台 |
| 6 | 淡茶销售给游客客户 | 淡茶 → 游客客户 | 销售给未知自来客户 |

### 角色定义

- **主办人**：每个客户都有主办人（原"对接人"），负责该客户的拓展与维护，非必选。主办人可以是员工或带货人。
- **跟单人**：每个订单都有跟单人，负责该订单的跟进执行，非必选。跟单人可以是员工或带货人。

### 相关文件

- 销售场景类型：`src/types/index.ts`（`SalesScenario`）
- 销售订单页面：`src/pages/sales/SalesOrders.tsx`
- 绩效计算：`src/data/organization.tsx`（`calculateEmployeePerformance`）

---

## 绩效计算规则

### 绩效金额规则

**情况2（淡茶→平台客户→直营客户）：**

| 角色 | 有跟单人 | 无跟单人 |
|------|----------|----------|
| 主办人 | 订单金额 × (1-平台扣点) × 50% | 订单金额 × (1-平台扣点) × 90% |
| 跟单人 | 订单金额 × (1-平台扣点) × 40% | — |

**其他5种情况（场景1/3/4/5/6）：**

| 角色 | 有跟单人 | 无跟单人 |
|------|----------|----------|
| 主办人 | 订单金额 × 50% | 订单金额 × 90% |
| 跟单人 | 订单金额 × 40% | — |

### 绩效利润规则

**订单利润计算：**
- 情况2：利润 = (销售实价总价 × (1-平台扣点) - 采购实价总价) × 87%
- 其他5种情况：利润 = (销售实价总价 - 采购实价总价) × 87%

**情况2（淡茶→平台客户→直营客户）：**

| 角色 | 有跟单人 | 无跟单人 |
|------|----------|----------|
| 主办人 | 利润 × 50% | 利润 × 90% |
| 跟单人 | 利润 × 40% | — |

**其他5种情况（场景1/3/4/5/6）：**

| 角色 | 有跟单人 | 无跟单人 |
|------|----------|----------|
| 主办人 | 利润 × 50% | 利润 × 90% |
| 跟单人 | 利润 × 40% | — |

### 关键约束

1. **平台扣点**：仅情况2（经平台销售给直营客户）需要扣除平台扣点，其他场景不涉及
2. **利润基数**：利润计算统一乘以 87%（即 13% 为公司留存）
3. **角色非必选**：主办人和跟单人均为非必选，无跟单人时主办人比例提高（50% → 90%）
4. **角色类型**：主办人和跟单人均支持选择员工或带货人

### 相关文件

- 绩效类型定义：`src/types/index.ts`（`EmployeePerformance`）
- 绩效计算函数：`src/data/organization.tsx`（`calculateEmployeePerformance`、`getOrderProfit`）
- 绩效展示页面：`src/pages/personnel/PersonnelEmployee.tsx`

---

## 带货人管理规则

### 带货人来源

带货人可通过以下两种方式创建：

1. **茶人联动创建**：在"茶人管理"中设置"是否带货"为"是"时，自动同步结算信息并创建带货人记录
2. **独立创建**：在"带货人管理"页面直接新增带货人

### 茶人与带货人联动规则

- 茶人设置"是否带货"为"是"时，结算信息为必填，保存后自动在带货人管理中创建对应记录
- 茶人设置"是否带货"为"否"时，自动从带货人管理列表中移除对应记录
- 联动创建的带货人记录关联茶人 ID，可在带货人管理中查看关联关系

### 带货人字段

| 字段 | 说明 |
|------|------|
| 姓名 | 带货人姓名 |
| 手机号码 | 联系电话 |
| 结算信息 | 户名、卡号、开户银行、开户行号 |
| 备注 | 选填 |
| 关联茶人 | 若由茶人联动创建，显示关联的茶人姓名 |

### 相关文件

- 带货人类型定义：`src/types/index.ts`（`Streamer`）
- 带货人数据源：`src/data/streamers.tsx`
- 带货人管理页面：`src/pages/personnel/PersonnelStreamer.tsx`
- 茶人管理页面：`src/pages/personnel/PersonnelTeaProfessional.tsx`
