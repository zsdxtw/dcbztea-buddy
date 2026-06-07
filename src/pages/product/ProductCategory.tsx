import { useState } from 'react';
import ContentHeader from '../../components/layout/ContentHeader';
import Card from '../../components/common/Card';
import StatusTag from '../../components/common/StatusTag';
import Button from '../../components/common/Button';

/* ── 分类数据结构 ── */
interface CategoryNode {
  id: string;
  name: string;
  icon?: React.ReactNode;
  sort: number;
  productCount: number;
  /** 发酵种类（仅二级分类） */
  fermentation?: string;
  /** 茶类介绍（仅二级分类） / 茶叶特点（仅三级分类） */
  description?: string;
  /** 产地（仅三级分类） */
  origin?: string;
  children?: CategoryNode[];
}

/* ── 一级分类图标 ── */
const TeaCategoryIcon = () => (
  <svg viewBox="0 0 20 20" fill="none"><path d="M10 2C6 2 3 5 3 9c0 3 2 5.5 5 6.5V17h4v-1.5c3-1 5-3.5 5-6.5 0-4-3-7-7-7z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><path d="M7 17h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><path d="M10 5v4M8 7h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
);
const TeawareCategoryIcon = () => (
  <svg viewBox="0 0 20 20" fill="none"><path d="M5 3h10v2a8 8 0 01-3 6.3V14H8v-2.7A8 8 0 015 5V3z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><path d="M7 14h6v2a1 1 0 01-1 1H8a1 1 0 01-1-1v-2z" stroke="currentColor" strokeWidth="1.3"/><path d="M15 6h2a1 1 0 011 1v1a2 2 0 01-2 2h-1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
);
const PeripheralCategoryIcon = () => (
  <svg viewBox="0 0 20 20" fill="none"><path d="M10 2l2.5 5 5.5.8-4 3.9.9 5.5L10 14.7 5.1 17.2l.9-5.5-4-3.9L7.5 7z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>
);
const OtherCategoryIcon = () => (
  <svg viewBox="0 0 20 20" fill="none"><rect x="3" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3"/><rect x="11" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3"/><rect x="3" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3"/><rect x="11" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3"/></svg>
);

/* ── Mock 数据 ── */
const initialCategories: CategoryNode[] = [
  {
    id: 'tea', name: '茶叶', icon: <TeaCategoryIcon />, sort: 1, productCount: 151,
    children: [
      {
        id: 'green-tea', name: '绿茶', sort: 1, productCount: 42,
        fermentation: '不发酵茶',
        description: '绿茶是中国产量最大、饮用最广泛的茶类，采用高温杀青，保留了鲜叶的天然物质。',
        children: [
          { id: 'xihu-longjing', name: '西湖龙井', sort: 1, productCount: 15, origin: '浙江杭州', description: '以"色绿、香郁、味甘、形美"四绝著称，扁平光滑挺直，自带浓郁豆花香，茶汤清甜顺滑。' },
          { id: 'biluochun', name: '碧螺春', sort: 2, productCount: 12, origin: '江苏苏州', description: '条索卷曲如螺、白毫密披，茶树与花果树间作，自带独特花果香，滋味鲜醇甘厚。' },
          { id: 'huangshan-maofeng', name: '黄山毛峰', sort: 3, productCount: 8, origin: '安徽黄山', description: '形似雀舌、白毫显露、色如象牙，冲泡时雾气凝顶，香气如兰，滋味鲜浓醇厚回甘。' },
          { id: 'xinyang-maojian', name: '信阳毛尖', sort: 4, productCount: 7, origin: '河南信阳', description: '条索细圆紧直、白毫满披，香气高长带熟板栗香，滋味浓醇回甘，耐泡度出色。' },
          { id: 'taiping-houkui', name: '太平猴魁', sort: 5, productCount: 5, origin: '安徽太平', description: '两叶抱芽、平扁挺直，有"猴魁两头尖，不散不翘不卷边"之说，花香高爽带独特"猴韵"。' },
          { id: 'liuan-guapian', name: '六安瓜片', sort: 6, productCount: 6, origin: '安徽六安', description: '中国唯一无芽无梗的片形绿茶，形似瓜子，栗香浓郁，滋味鲜醇回甘。' },
        ],
      },
      {
        id: 'red-tea', name: '红茶', sort: 2, productCount: 26,
        fermentation: '全发酵茶',
        description: '红茶经过萎凋、揉捻、发酵、干燥等工艺制成，汤色红亮，滋味醇厚。',
        children: [
          { id: 'qimen-hongcha', name: '祁门红茶', sort: 1, productCount: 8, origin: '安徽祁门', description: '世界三大高香红茶之一，条索紧细匀整、色泽乌润，具有似花似果似蜜的独特"祁门香"。' },
          { id: 'zhengshan-xiaozhong', name: '正山小种', sort: 2, productCount: 10, origin: '福建武夷山', description: '世界红茶鼻祖，传统松烟香显著，滋味醇厚带桂圆汤味，茶汤红浓。' },
          { id: 'jinjunmei', name: '金骏眉', sort: 3, productCount: 6, origin: '福建武夷山', description: '全芽头制作的顶级红茶，金黄金黑相间，花果蜜香交织，汤色金黄透亮，入口丝滑甘爽。' },
          { id: 'dianhong', name: '滇红', sort: 4, productCount: 7, origin: '云南凤庆', description: '大叶种红茶代表，条索肥壮、金毫满披，蜜香浓郁高长，滋味浓厚鲜爽甜润。' },
          { id: 'yingde-hongcha', name: '英德红茶', sort: 5, productCount: 5, origin: '广东英德', description: '金毫显露，蜜糖香中透着荔枝清甜，浓而不涩，回甘快，茶汤红亮。' },
        ],
      },
      {
        id: 'oolong-tea', name: '乌龙茶', sort: 3, productCount: 35,
        fermentation: '半发酵茶',
        description: '乌龙茶介于绿茶和红茶之间，兼具绿茶的清香和红茶的醇厚，工艺最为复杂。',
        children: [
          { id: 'tieguanyin', name: '铁观音', sort: 1, productCount: 12, origin: '福建安溪', description: '颗粒紧结如蜻蜓头，天然兰花香馥郁，汤色金黄浓艳似琥珀，"七泡有余香"。' },
          { id: 'dahongpao', name: '大红袍', sort: 2, productCount: 10, origin: '福建武夷山', description: '武夷岩茶之王，条索紧结、色泽绿褐油润，"岩骨花香"显著，滋味醇厚回甘、喉韵悠长。' },
          { id: 'fenghuang-dancong', name: '凤凰单丛', sort: 3, productCount: 6, origin: '广东潮州', description: '单株单制，香型多达上百种（蜜兰香、鸭屎香等），茶汤醇厚带蜜甜，"一茶一味"。' },
          { id: 'dongding-wulong', name: '冻顶乌龙', sort: 4, productCount: 7, origin: '台湾南投', description: '半球形颗粒紧结、色泽墨绿，兰花香或熟果香浓郁，滋味醇厚甘润，喉韵回甘。' },
          { id: 'dongfang-meiren', name: '东方美人', sort: 5, productCount: 4, origin: '台湾新竹', description: '茶芽被小绿叶蝉叮咬后形成独特蜜香，白毫显著、五色交叠，熟果蜜香浓郁，口感甜润如蜜。' },
          { id: 'shuixian', name: '水仙', sort: 6, productCount: 5, origin: '福建建瓯', description: '条索肥壮、色泽绿褐油润，兰花香显著，老枞水仙更有独特"枞味"（青苔香、木质香），汤感绵密顺滑。' },
        ],
      },
      {
        id: 'white-tea', name: '白茶', sort: 4, productCount: 18,
        fermentation: '微发酵茶',
        description: '白茶工艺最为简朴，仅经萎凋和干燥，不炒不揉，以"形美、色鲜、香高、味醇"著称。',
        children: [
          { id: 'baihao-yinzhen', name: '白毫银针', sort: 1, productCount: 5, origin: '福建福鼎/政和', description: '芽头肥壮挺直如针、密披白毫如银似雪，毫香清鲜高扬，滋味清鲜醇爽。' },
          { id: 'bai-mudan', name: '白牡丹', sort: 2, productCount: 7, origin: '福建福鼎/政和', description: '一芽两叶、芽叶连枝，绿叶夹银毫形似花朵，花香清雅，汤感比银针更饱满。' },
          { id: 'gongmei', name: '贡眉', sort: 3, productCount: 4, origin: '福建福鼎/政和', description: '群体种菜茶制作，芽叶细瘦、叶色灰绿带黄，汤色橙黄，带野花蜜韵，陈化后枣香显。' },
          { id: 'shoumei', name: '寿眉', sort: 4, productCount: 6, origin: '福建福鼎/政和', description: '叶片阔大、茶梗粗壮，新茶清爽甘甜，老茶醇厚带枣香药香，耐煮耐泡，性价比极高。' },
        ],
      },
      {
        id: 'yellow-tea', name: '黄茶', sort: 5, productCount: 8,
        fermentation: '轻发酵茶',
        description: '黄茶在绿茶工艺基础上增加了一道"闷黄"工序，使茶叶自然氧化变黄。',
        children: [
          { id: 'junshan-yinzhen', name: '君山银针', sort: 1, productCount: 3, origin: '湖南岳阳', description: '芽头肥壮、满披白毫、色泽金黄，有"金镶玉"美称，冲泡时芽尖三起三落，滋味甘醇鲜爽。' },
          { id: 'mengding-huangya', name: '蒙顶黄芽', sort: 2, productCount: 3, origin: '四川雅安', description: '外形扁直匀整、嫩黄油润、金芽披毫，甜香鲜嫩带熟板栗香，滋味甘醇，汤色黄亮透碧。' },
          { id: 'huoshan-huangya', name: '霍山黄芽', sort: 3, productCount: 2, origin: '安徽霍山', description: '形似雀舌、芽叶细嫩多毫、色泽黄绿，香气清高带熟板栗香，滋味鲜醇浓厚回甘。' },
          { id: 'mogan-huangya', name: '莫干黄芽', sort: 4, productCount: 1, origin: '浙江德清', description: '嫩芽略勾尖、嫩黄显毫，蜜香甘醇，滋味醇爽，汤色嫩黄绿亮。' },
          { id: 'pingyang-huangtang', name: '平阳黄汤', sort: 5, productCount: 1, origin: '浙江平阳', description: '以"干茶显黄、汤色杏黄、叶底嫩黄"三黄著称，带独特玉米香，滋味醇和回甘。' },
        ],
      },
      {
        id: 'dark-tea', name: '黑茶', sort: 6, productCount: 22,
        fermentation: '后发酵茶',
        description: '黑茶经过渥堆发酵工艺，茶性温和，具有独特的陈香，越陈越香。',
        children: [
          { id: 'puer-shou', name: '普洱茶（熟普）', sort: 1, productCount: 8, origin: '云南普洱', description: '渥堆发酵后苦涩全消，茶汤红浓油润、顺滑绵糯，陈香枣香层次丰富，越陈越香。' },
          { id: 'anhua-heicha', name: '安化黑茶', sort: 2, productCount: 7, origin: '湖南安化', description: '松烟香与菌花香并存，茯砖内长满"金花"（冠突散囊菌），滋味浓厚回甘，消食解腻一绝。' },
          { id: 'liubao-cha', name: '六堡茶', sort: 3, productCount: 4, origin: '广西梧州', description: '以"红、浓、陈、醇"四绝著称，带独特槟榔香，滋味清爽醇厚回甘，祛湿调肠胃功效显著。' },
          { id: 'yaan-zangcha', name: '雅安藏茶', sort: 4, productCount: 3, origin: '四川雅安', description: '发酵最深、滋味浓强厚重，带独特陈香与药香，极度耐泡耐煮，是调制酥油茶的主要原料。' },
          { id: 'jingyang-fuzhuan', name: '泾阳茯砖', sort: 5, productCount: 3, origin: '陕西泾阳', description: '最早发明"发花"工艺的黑茶，金花茂密、菌香浓郁，滋味醇厚带微微松烟香，陈放后药香更浓。' },
        ],
      },
      {
        id: 'flower-tea', name: '花草茶', sort: 7, productCount: 15,
        fermentation: '代用茶',
        description: '花草茶是以植物的花、叶、果、根等为原料，经加工而成的饮品，兼具美观与健康功效。',
        children: [
          { id: 'jasmine-tea', name: '茉莉花茶', sort: 1, productCount: 6, origin: '福建福州', description: '以绿茶为茶坯，经茉莉花窨制而成，香气鲜灵持久，滋味醇厚鲜爽，有"窨得茉莉无上味，列作人间第一香"的美誉。' },
          { id: 'rose-tea', name: '玫瑰花茶', sort: 2, productCount: 4, origin: '山东平阴', description: '采用重瓣红玫瑰，香气浓郁甜美，汤色浅黄明亮，有疏肝解郁、美容养颜的功效。' },
          { id: 'chrysanthemum-tea', name: '菊花茶', sort: 3, productCount: 5, origin: '浙江桐乡', description: '以杭白菊为代表，花朵完整，香气清冽，有清热解毒、明目的功效。' },
        ],
      },
    ],
  },
  {
    id: 'teaware', name: '茶具', icon: <TeawareCategoryIcon />, sort: 2, productCount: 45,
    children: [
      {
        id: 'teapot', name: '茶壶', sort: 1, productCount: 15,
        children: [
          { id: 'teapot-zisha', name: '紫砂壶', sort: 1, productCount: 8 },
          { id: 'teapot-ciqi', name: '瓷器壶', sort: 2, productCount: 4 },
          { id: 'teapot-boli', name: '玻璃壶', sort: 3, productCount: 3 },
        ],
      },
      {
        id: 'teacup', name: '茶杯', sort: 2, productCount: 12,
        children: [
          { id: 'teacup-pinming', name: '品茗杯', sort: 1, productCount: 5 },
          { id: 'teacup-wenxiang', name: '闻香杯', sort: 2, productCount: 3 },
          { id: 'teacup-gaotong', name: '盖碗', sort: 3, productCount: 4 },
        ],
      },
      {
        id: 'tea-tray', name: '茶盘茶台', sort: 3, productCount: 8,
        children: [
          { id: 'tray-zhushi', name: '竹制茶盘', sort: 1, productCount: 4 },
          { id: 'tray-shicai', name: '石材茶盘', sort: 2, productCount: 4 },
        ],
      },
      {
        id: 'tea-tools', name: '茶道配件', sort: 4, productCount: 10,
        children: [
          { id: 'tools-chadao', name: '茶道六君子', sort: 1, productCount: 4 },
          { id: 'tools-chaye', name: '茶则茶荷', sort: 2, productCount: 3 },
          { id: 'tools-lvdou', name: '滤茶器', sort: 3, productCount: 3 },
        ],
      },
    ],
  },
  {
    id: 'tea-peripheral', name: '茶周边', icon: <PeripheralCategoryIcon />, sort: 3, productCount: 38,
    children: [
      {
        id: 'tea-food', name: '茶食品', sort: 1, productCount: 15,
        children: [
          { id: 'food-tea-snack', name: '茶点零食', sort: 1, productCount: 8 },
          { id: 'food-tea-candy', name: '茶味糖果', sort: 2, productCount: 4 },
          { id: 'food-tea-cake', name: '茶糕点心', sort: 3, productCount: 3 },
        ],
      },
      {
        id: 'tea-gift', name: '礼盒套装', sort: 2, productCount: 12,
        children: [
          { id: 'gift-festival', name: '节日礼盒', sort: 1, productCount: 5 },
          { id: 'gift-business', name: '商务礼盒', sort: 2, productCount: 4 },
          { id: 'gift-wedding', name: '婚庆礼盒', sort: 3, productCount: 3 },
        ],
      },
      {
        id: 'tea-storage', name: '茶叶罐/包装', sort: 3, productCount: 11,
        children: [
          { id: 'storage-tin', name: '锡罐', sort: 1, productCount: 4 },
          { id: 'storage-ceramic', name: '陶瓷罐', sort: 2, productCount: 4 },
          { id: 'storage-bag', name: '包装袋', sort: 3, productCount: 3 },
        ],
      },
    ],
  },
  {
    id: 'other', name: '其他', icon: <OtherCategoryIcon />, sort: 4, productCount: 12,
    children: [
      {
        id: 'tea-water', name: '泡茶水', sort: 1, productCount: 6,
        children: [
          { id: 'water-mineral', name: '矿泉水', sort: 1, productCount: 3 },
          { id: 'water-purified', name: '纯净水', sort: 2, productCount: 3 },
        ],
      },
      {
        id: 'tea-book', name: '茶书茶画', sort: 2, productCount: 4,
        children: [
          { id: 'book-tea-art', name: '茶艺书籍', sort: 1, productCount: 2 },
          { id: 'book-tea-culture', name: '茶文化书籍', sort: 2, productCount: 2 },
        ],
      },
      {
        id: 'tea-incense', name: '茶香/香道', sort: 3, productCount: 2,
        children: [
          { id: 'incense-stick', name: '线香', sort: 1, productCount: 1 },
          { id: 'incense-cone', name: '盘香', sort: 2, productCount: 1 },
        ],
      },
    ],
  },
];

/** 一级分类 ID 集合 */
const LEVEL1_IDS = new Set(initialCategories.map((c) => c.id));

function findPath(nodes: CategoryNode[], targetId: string, path: CategoryNode[] = []): CategoryNode[] | null {
  for (const node of nodes) {
    const currentPath = [...path, node];
    if (node.id === targetId) return currentPath;
    if (node.children) {
      const found = findPath(node.children, targetId, currentPath);
      if (found) return found;
    }
  }
  return null;
}

function findNode(nodes: CategoryNode[], targetId: string): CategoryNode | null {
  for (const node of nodes) {
    if (node.id === targetId) return node;
    if (node.children) {
      const found = findNode(node.children, targetId);
      if (found) return found;
    }
  }
  return null;
}

function getLevelLabel(depth: number) {
  switch (depth) {
    case 0: return '一级分类';
    case 1: return '二级分类';
    case 2: return '三级分类';
    default: return '子分类';
  }
}

export default function ProductCategory() {
  const [categories, setCategories] = useState<CategoryNode[]>(initialCategories);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(['tea', 'teaware', 'tea-peripheral', 'other']));
  const [editing, setEditing] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState<{ parentId: string; level: number } | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const selectedNode = selectedId ? findNode(categories, selectedId) : null;
  const selectedPath = selectedId ? findPath(categories, selectedId) : null;
  const isLevel1 = selectedId ? LEVEL1_IDS.has(selectedId) : false;
  const depth = selectedPath ? selectedPath.length - 1 : 0;

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleAddChild = (parentId: string, level: number) => {
    setShowAddDialog({ parentId, level });
  };

  const handleConfirmAdd = () => {
    if (!showAddDialog) return;
    const input = document.getElementById('add-category-input') as HTMLInputElement;
    const name = input?.value.trim();
    if (!name) return;

    const newNode: CategoryNode = {
      id: `cat-${Date.now()}`,
      name,
      sort: 999,
      productCount: 0,
    };

    const addChild = (nodes: CategoryNode[]): CategoryNode[] =>
      nodes.map((n) => {
        if (n.id === showAddDialog.parentId) {
          return { ...n, children: [...(n.children || []), newNode] };
        }
        if (n.children) return { ...n, children: addChild(n.children) };
        return n;
      });
    setCategories(addChild(categories));
    setExpandedIds((prev) => new Set([...prev, showAddDialog.parentId]));
    setShowAddDialog(null);
  };

  const handleDelete = (id: string) => {
    const removeNode = (nodes: CategoryNode[]): CategoryNode[] =>
      nodes
        .filter((n) => n.id !== id)
        .map((n) => (n.children ? { ...n, children: removeNode(n.children) } : n));
    setCategories(removeNode(categories));
    if (selectedId === id) setSelectedId(null);
  };

  const renderTreeNode = (node: CategoryNode, nodeDepth: number) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedIds.has(node.id);
    const isSelected = selectedId === node.id;
    const nodeIsLevel1 = LEVEL1_IDS.has(node.id);

    return (
      <div key={node.id}>
        <div
          className={`category-tree-node${isSelected ? ' selected' : ''}`}
          style={{ paddingLeft: nodeDepth * 20 + 8 }}
          onClick={() => { setSelectedId(node.id); setEditing(false); }}
        >
          <span
            className={`category-tree-expand${hasChildren ? ' has-children' : ''}${isExpanded ? ' expanded' : ''}`}
            onClick={(e) => { e.stopPropagation(); if (hasChildren) toggleExpand(node.id); }}
          >
            {hasChildren && (
              <svg viewBox="0 0 12 12" fill="none"><path d="M4.5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            )}
          </span>
          {node.icon && <span className="category-tree-icon" style={{ width: 18, height: 18, flexShrink: 0, color: 'var(--color-module-current-base)' }}>{node.icon}</span>}
          <span className="category-tree-name">{node.name}</span>
          <span className="category-tree-count">{node.productCount}</span>
          {(nodeIsLevel1 && ['teaware', 'tea-peripheral', 'other'].includes(node.id) ? true : (!nodeIsLevel1 && nodeDepth < 2)) && (
            <span className="category-tree-actions" onClick={(e) => e.stopPropagation()}>
              <button className="category-tree-action-btn" title="新增子分类" onClick={() => handleAddChild(node.id, nodeDepth)}>
                <svg viewBox="0 0 14 14" fill="none"><path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
              </button>
              {!nodeIsLevel1 && (
                <button className="category-tree-action-btn category-tree-action-delete" title="删除" onClick={() => handleDelete(node.id)}>
                  <svg viewBox="0 0 14 14" fill="none"><path d="M3 4h8M5 4V3h4v1M6 6v4M8 6v4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 4l.7 7h4.6l.7-7" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>
                </button>
              )}
            </span>
          )}
          {(!nodeIsLevel1 && nodeDepth >= 2) && (
            <span className="category-tree-actions" onClick={(e) => e.stopPropagation()}>
              <button className="category-tree-action-btn category-tree-action-delete" title="删除" onClick={() => handleDelete(node.id)}>
                <svg viewBox="0 0 14 14" fill="none"><path d="M3 4h8M5 4V3h4v1M6 6v4M8 6v4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 4l.7 7h4.6l.7-7" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>
              </button>
            </span>
          )}
        </div>
        {hasChildren && isExpanded && (
          <div className="category-tree-children">
            {node.children!.map((child) => renderTreeNode(child, nodeDepth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <ContentHeader title="分类管理" breadcrumbs={['商品', '分类管理']} />
      <div className="content-body">
        <div className="category-layout">
          {/* 左侧分类树 */}
          <Card title="分类结构" className="category-tree-card" headerRight={
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-400)' }}>一级分类固定，可管理二三级</div>
          }>
            <div className="category-tree">
              {categories.map((cat) => renderTreeNode(cat, 0))}
            </div>
          </Card>

          {/* 右侧详情 */}
          <div className="category-detail-area">
            {selectedNode ? (
              <>
                <Card title="分类详情">
                  {/* 面包屑路径 */}
                  {selectedPath && (
                    <div className="category-breadcrumb">
                      {selectedPath.map((p, i) => (
                        <span key={p.id}>
                          {i > 0 && <span className="category-breadcrumb-sep">/</span>}
                          <span className={i === selectedPath.length - 1 ? 'category-breadcrumb-current' : 'category-breadcrumb-item'}>{p.name}</span>
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="detail-grid">
                    <div className="detail-row">
                      <div className="detail-label">分类名称</div>
                      <div className="detail-value">
                        {editing && !isLevel1 ? <input className="detail-input" defaultValue={selectedNode.name} /> : <span style={{ fontWeight: 'var(--font-medium)' }}>{selectedNode.name}</span>}
                      </div>
                    </div>
                    <div className="detail-row">
                      <div className="detail-label">分类层级</div>
                      <div className="detail-value">
                        <StatusTag variant="info" label={getLevelLabel(depth)} />
                      </div>
                    </div>
                    <div className="detail-row">
                      <div className="detail-label">上级分类</div>
                      <div className="detail-value">
                        {selectedPath && selectedPath.length > 1 ? selectedPath[selectedPath.length - 2].name : <span style={{ color: 'var(--color-neutral-400)' }}>无（顶级分类）</span>}
                      </div>
                    </div>

                    {/* 二级分类：显示发酵种类和茶类介绍 */}
                    {depth === 1 && selectedNode.fermentation && (
                      <div className="detail-row">
                        <div className="detail-label">发酵种类</div>
                        <div className="detail-value">
                          <StatusTag variant="success" label={selectedNode.fermentation} />
                        </div>
                      </div>
                    )}
                    {depth === 1 && selectedNode.description && (
                      <div className="detail-row detail-row-span">
                        <div className="detail-label">茶类介绍</div>
                        <div className="detail-value" style={{ lineHeight: 'var(--leading-relaxed)' }}>{selectedNode.description}</div>
                      </div>
                    )}

                    {/* 三级分类：显示产地和茶叶特点 */}
                    {depth === 2 && selectedNode.origin && (
                      <div className="detail-row">
                        <div className="detail-label">产地</div>
                        <div className="detail-value">
                          <span style={{ fontWeight: 'var(--font-medium)' }}>{selectedNode.origin}</span>
                        </div>
                      </div>
                    )}
                    {depth === 2 && selectedNode.description && (
                      <div className="detail-row detail-row-span">
                        <div className="detail-label">茶叶特点</div>
                        <div className="detail-value" style={{ lineHeight: 'var(--leading-relaxed)' }}>{selectedNode.description}</div>
                      </div>
                    )}

                    <div className="detail-row">
                      <div className="detail-label">商品数量</div>
                      <div className="detail-value"><span className="mono">{selectedNode.productCount}</span></div>
                    </div>
                    {selectedNode.children && (
                      <div className="detail-row detail-row-span">
                        <div className="detail-label">子分类</div>
                        <div className="detail-value">
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                            {selectedNode.children.map((child) => (
                              <span key={child.id} className="brand-series-tag" style={{ cursor: 'pointer' }} onClick={() => { setSelectedId(child.id); setEditing(false); }}>
                                {child.name} ({child.productCount})
                              </span>
                            ))}
                          </div>
                          {((selectedPath && selectedPath.length < 3) || (isLevel1 && ['teaware', 'tea-peripheral', 'other'].includes(selectedNode.id))) && (
                            <Button variant="ghost" size="sm" onClick={() => handleAddChild(selectedNode.id, selectedPath ? selectedPath.length - 1 : 0)}>
                              <PlusIcon /> 添加子分类
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                    {!selectedNode.children && ((selectedPath && selectedPath.length < 3) || (isLevel1 && ['teaware', 'tea-peripheral', 'other'].includes(selectedNode.id))) && (
                      <div className="detail-row detail-row-span">
                        <div className="detail-label">子分类</div>
                        <div className="detail-value">
                          <Button variant="ghost" size="sm" onClick={() => handleAddChild(selectedNode.id, selectedPath ? selectedPath.length - 1 : 0)}>
                            <PlusIcon /> 添加子分类
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {!isLevel1 && (
                    <div style={{ marginTop: 'var(--space-5)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--color-neutral-200)', display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                      {editing ? (
                        <>
                          <Button variant="ghost" onClick={() => setEditing(false)}>取消</Button>
                          <Button onClick={() => setEditing(false)}>保存</Button>
                        </>
                      ) : (
                        <>
                          <Button size="sm" onClick={() => setEditing(true)}>编辑</Button>
                          <Button size="sm" style={{ background: '#FD742D', color: '#fff', borderColor: '#FD742D' }} onClick={() => setShowDeleteConfirm(true)}>删除</Button>
                        </>
                      )}
                    </div>
                  )}
                </Card>
              </>
            ) : (
              <Card>
                <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--color-neutral-400)' }}>
                  请在左侧选择一个分类查看详情
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* 新增分类弹窗 */}
        {showAddDialog && (
          <div className="category-dialog-overlay" onClick={() => setShowAddDialog(null)}>
            <div className="category-dialog" onClick={(e) => e.stopPropagation()}>
              <div className="category-dialog-title">
                新增{getLevelLabel(showAddDialog.level + 1)}
              </div>
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <label style={{ display: 'block', fontSize: 'var(--text-sm)', color: 'var(--color-neutral-500)', marginBottom: 'var(--space-2)' }}>分类名称</label>
                <input id="add-category-input" className="detail-input" placeholder="请输入分类名称" autoFocus onKeyDown={(e) => { if (e.key === 'Enter') handleConfirmAdd(); }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                <Button variant="ghost" onClick={() => setShowAddDialog(null)}>取消</Button>
                <Button onClick={handleConfirmAdd}>确认</Button>
              </div>
            </div>
          </div>
        )}

        {/* 删除确认弹窗 */}
        {showDeleteConfirm && selectedNode && (
          <div className="category-dialog-overlay" onClick={() => setShowDeleteConfirm(false)}>
            <div className="category-dialog" onClick={(e) => e.stopPropagation()}>
              <div className="category-dialog-title">确认删除</div>
              <div style={{ marginBottom: 'var(--space-5)', fontSize: 'var(--text-base)', color: 'var(--color-neutral-600)', lineHeight: 'var(--leading-md)' }}>
                确定要删除分类「<span style={{ fontWeight: 'var(--font-semibold)', color: 'var(--color-neutral-800)' }}>{selectedNode.name}</span>」吗？{selectedNode.children && selectedNode.children.length > 0 && <span style={{ color: '#FD742D', display: 'block', marginTop: 'var(--space-2)' }}>该分类下还有子分类，删除后将一并移除。</span>}
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                <Button variant="ghost" onClick={() => setShowDeleteConfirm(false)}>取消</Button>
                <Button style={{ background: '#FD742D', color: '#fff', borderColor: '#FD742D' }} onClick={() => { handleDelete(selectedNode.id); setShowDeleteConfirm(false); }}>确认删除</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function PlusIcon() {
  return <svg viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
}
