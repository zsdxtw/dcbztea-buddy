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
| 销售 | sales | 青色 | <span style="display:inline-block;width:14px;height:14px;background:#0DAFC6;border-radius:3px;border:1px solid rgba(0,0,0,0.15);vertical-align:middle;margin-left:4px"></span> `#0DAFC6` | 粉玫 | <span style="display:inline-block;width:14px;height:14px;background:#F26E95;border-radius:3px;border:1px solid rgba(0,0,0,0.15);vertical-align:middle;margin-left:4px"></span> `#F26E95` |
| 商品 | product | 翡翠绿 | <span style="display:inline-block;width:14px;height:14px;background:#01795D;border-radius:3px;border:1px solid rgba(0,0,0,0.15);vertical-align:middle;margin-left:4px"></span> `#01795D` | 橙色 | <span style="display:inline-block;width:14px;height:14px;background:#FD742D;border-radius:3px;border:1px solid rgba(0,0,0,0.15);vertical-align:middle;margin-left:4px"></span> `#FD742D` |
| 人员 | personnel | 紫罗兰 | <span style="display:inline-block;width:14px;height:14px;background:#9D73BD;border-radius:3px;border:1px solid rgba(0,0,0,0.15);vertical-align:middle;margin-left:4px"></span> `#9D73BD` | 鹅黄 | <span style="display:inline-block;width:14px;height:14px;background:#FDDE83;border-radius:3px;border:1px solid rgba(0,0,0,0.15);vertical-align:middle;margin-left:4px"></span> `#FDDE83` |
| 仓储 | inventory | 棕色 | <span style="display:inline-block;width:14px;height:14px;background:#5F4027;border-radius:3px;border:1px solid rgba(0,0,0,0.15);vertical-align:middle;margin-left:4px"></span> `#5F4027` | 浅橙 | <span style="display:inline-block;width:14px;height:14px;background:#FED6B8;border-radius:3px;border:1px solid rgba(0,0,0,0.15);vertical-align:middle;margin-left:4px"></span> `#FED6B8` |
| 财务 | finance | 深靛 | <span style="display:inline-block;width:14px;height:14px;background:#27254B;border-radius:3px;border:1px solid rgba(0,0,0,0.15);vertical-align:middle;margin-left:4px"></span> `#27254B` | 蓝灰 | <span style="display:inline-block;width:14px;height:14px;background:#7BA6D1;border-radius:3px;border:1px solid rgba(0,0,0,0.15);vertical-align:middle;margin-left:4px"></span> `#7BA6D1` |
| 统计 | statistics | 橙色 | <span style="display:inline-block;width:14px;height:14px;background:#F18F4D;border-radius:3px;border:1px solid rgba(0,0,0,0.15);vertical-align:middle;margin-left:4px"></span> `#F18F4D` | 深灰 | <span style="display:inline-block;width:14px;height:14px;background:#363636;border-radius:3px;border:1px solid rgba(0,0,0,0.15);vertical-align:middle;margin-left:4px"></span> `#363636` |
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
- **销售辅色** <span style="display:inline-block;width:12px;height:12px;background:#F26E95;border-radius:2px;border:1px solid rgba(0,0,0,0.1);vertical-align:middle;margin-left:2px"></span> `#F26E95`：用于销售模块下的删除按钮、平台方标签、金额等数据展示
- **商品辅色** <span style="display:inline-block;width:12px;height:12px;background:#FD742D;border-radius:2px;border:1px solid rgba(0,0,0,0.1);vertical-align:middle;margin-left:2px"></span> `#FD742D`：用于商品模块下的删除按钮、警告操作
- **人员辅色** <span style="display:inline-block;width:12px;height:12px;background:#FDDE83;border-radius:2px;border:1px solid rgba(0,0,0,0.1);vertical-align:middle;margin-left:2px"></span> `#FDDE83`：用于人员模块下的次要信息展示
- **仓储辅色** <span style="display:inline-block;width:12px;height:12px;background:#FED6B8;border-radius:2px;border:1px solid rgba(0,0,0,0.1);vertical-align:middle;margin-left:2px"></span> `#FED6B8`：用于仓储模块下的库存预警等
- **财务辅色** <span style="display:inline-block;width:12px;height:12px;background:#7BA6D1;border-radius:2px;border:1px solid rgba(0,0,0,0.1);vertical-align:middle;margin-left:2px"></span> `#7BA6D1`：用于财务模块下的银行、账号等信息
- **统计辅色** <span style="display:inline-block;width:12px;height:12px;background:#363636;border-radius:2px;border:1px solid rgba(0,0,0,0.1);vertical-align:middle;margin-left:2px"></span> `#363636`：用于统计模块下的深色强调

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
