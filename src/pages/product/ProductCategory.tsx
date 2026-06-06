import { useState } from 'react';
import ContentHeader from '../../components/layout/ContentHeader';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import StatusTag from '../../components/common/StatusTag';
import Button from '../../components/common/Button';
import Toggle from '../../components/common/Toggle';
import type { StatCardData } from '../../types';

/* ── 分类数据结构 ── */
interface CategoryNode {
  id: string;
  name: string;
  icon?: React.ReactNode;
  sort: number;
  active: boolean;
  productCount: number;
  children?: CategoryNode[];
}

/* ── 一级分类图标（与侧边栏菜单图标风格一致，不重复） ── */
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
    id: 'tea', name: '茶叶', icon: <TeaCategoryIcon />, sort: 1, active: true, productCount: 151,
    children: [
      {
        id: 'red-tea', name: '红茶', sort: 1, active: true, productCount: 26,
        children: [
          { id: 'red-xiaozhong', name: '小种红茶', sort: 1, active: true, productCount: 8 },
          { id: 'red-gongfu', name: '工夫红茶', sort: 2, active: true, productCount: 10 },
          { id: 'red-hongsuicha', name: '红碎茶', sort: 3, active: true, productCount: 8 },
        ],
      },
      {
        id: 'green-tea', name: '绿茶', sort: 2, active: true, productCount: 42,
        children: [
          { id: 'green-chaoqing', name: '炒青绿茶', sort: 1, active: true, productCount: 15 },
          { id: 'green-hongqing', name: '烘青绿茶', sort: 2, active: true, productCount: 12 },
          { id: 'green-shaiqing', name: '晒青绿茶', sort: 3, active: true, productCount: 8 },
          { id: 'green-zhengqing', name: '蒸青绿茶', sort: 4, active: true, productCount: 7 },
        ],
      },
      {
        id: 'white-tea', name: '白茶', sort: 3, active: true, productCount: 18,
        children: [
          { id: 'white-yinzhen', name: '白毫银针', sort: 1, active: true, productCount: 5 },
          { id: 'white-mudan', name: '白牡丹', sort: 2, active: true, productCount: 7 },
          { id: 'white-shoumei', name: '寿眉', sort: 3, active: true, productCount: 6 },
        ],
      },
      {
        id: 'oolong-tea', name: '乌龙茶', sort: 4, active: true, productCount: 35,
        children: [
          { id: 'oolong-minbei', name: '闽北乌龙', sort: 1, active: true, productCount: 12 },
          { id: 'oolong-minnan', name: '闽南乌龙', sort: 2, active: true, productCount: 10 },
          { id: 'oolong-guangdong', name: '广东乌龙', sort: 3, active: true, productCount: 6 },
          { id: 'oolong-taiwan', name: '台湾乌龙', sort: 4, active: true, productCount: 7 },
        ],
      },
      {
        id: 'dark-tea', name: '黑茶', sort: 5, active: true, productCount: 22,
        children: [
          { id: 'dark-puer-sheng', name: '普洱生茶', sort: 1, active: true, productCount: 8 },
          { id: 'dark-puer-shou', name: '普洱熟茶', sort: 2, active: true, productCount: 7 },
          { id: 'dark-liubao', name: '六堡茶', sort: 3, active: true, productCount: 4 },
          { id: 'dark-anhua', name: '安化黑茶', sort: 4, active: true, productCount: 3 },
        ],
      },
      {
        id: 'yellow-tea', name: '黄茶', sort: 6, active: true, productCount: 8,
        children: [
          { id: 'yellow-junshan', name: '君山银针', sort: 1, active: true, productCount: 3 },
          { id: 'yellow-mengding', name: '蒙顶黄芽', sort: 2, active: true, productCount: 3 },
          { id: 'yellow-huoshan', name: '霍山黄芽', sort: 3, active: true, productCount: 2 },
        ],
      },
    ],
  },
  {
    id: 'teaware', name: '茶具', icon: <TeawareCategoryIcon />, sort: 2, active: true, productCount: 45,
    children: [
      {
        id: 'teapot', name: '茶壶', sort: 1, active: true, productCount: 15,
        children: [
          { id: 'teapot-zisha', name: '紫砂壶', sort: 1, active: true, productCount: 8 },
          { id: 'teapot-ciqi', name: '瓷器壶', sort: 2, active: true, productCount: 4 },
          { id: 'teapot-boli', name: '玻璃壶', sort: 3, active: true, productCount: 3 },
        ],
      },
      {
        id: 'teacup', name: '茶杯', sort: 2, active: true, productCount: 12,
        children: [
          { id: 'teacup-pinming', name: '品茗杯', sort: 1, active: true, productCount: 5 },
          { id: 'teacup-wenxiang', name: '闻香杯', sort: 2, active: true, productCount: 3 },
          { id: 'teacup-gaotong', name: '盖碗', sort: 3, active: true, productCount: 4 },
        ],
      },
      {
        id: 'tea-tray', name: '茶盘茶台', sort: 3, active: true, productCount: 8,
        children: [
          { id: 'tray-zhushi', name: '竹制茶盘', sort: 1, active: true, productCount: 4 },
          { id: 'tray-shicai', name: '石材茶盘', sort: 2, active: true, productCount: 4 },
        ],
      },
      {
        id: 'tea-tools', name: '茶道配件', sort: 4, active: true, productCount: 10,
        children: [
          { id: 'tools-chadao', name: '茶道六君子', sort: 1, active: true, productCount: 4 },
          { id: 'tools-chaye', name: '茶则茶荷', sort: 2, active: true, productCount: 3 },
          { id: 'tools-lvdou', name: '滤茶器', sort: 3, active: true, productCount: 3 },
        ],
      },
    ],
  },
  {
    id: 'tea-peripheral', name: '茶周边', icon: <PeripheralCategoryIcon />, sort: 3, active: true, productCount: 38,
    children: [
      {
        id: 'tea-food', name: '茶食品', sort: 1, active: true, productCount: 15,
        children: [
          { id: 'food-tea-snack', name: '茶点零食', sort: 1, active: true, productCount: 8 },
          { id: 'food-tea-candy', name: '茶味糖果', sort: 2, active: true, productCount: 4 },
          { id: 'food-tea-cake', name: '茶糕点心', sort: 3, active: true, productCount: 3 },
        ],
      },
      {
        id: 'tea-gift', name: '礼盒套装', sort: 2, active: true, productCount: 12,
        children: [
          { id: 'gift-festival', name: '节日礼盒', sort: 1, active: true, productCount: 5 },
          { id: 'gift-business', name: '商务礼盒', sort: 2, active: true, productCount: 4 },
          { id: 'gift-wedding', name: '婚庆礼盒', sort: 3, active: true, productCount: 3 },
        ],
      },
      {
        id: 'tea-storage', name: '茶叶罐/包装', sort: 3, active: true, productCount: 11,
        children: [
          { id: 'storage-tin', name: '锡罐', sort: 1, active: true, productCount: 4 },
          { id: 'storage-ceramic', name: '陶瓷罐', sort: 2, active: true, productCount: 4 },
          { id: 'storage-bag', name: '包装袋', sort: 3, active: true, productCount: 3 },
        ],
      },
    ],
  },
  {
    id: 'other', name: '其他', icon: <OtherCategoryIcon />, sort: 4, active: true, productCount: 12,
    children: [
      {
        id: 'tea-water', name: '泡茶水', sort: 1, active: true, productCount: 6,
        children: [
          { id: 'water-mineral', name: '矿泉水', sort: 1, active: true, productCount: 3 },
          { id: 'water-purified', name: '纯净水', sort: 2, active: true, productCount: 3 },
        ],
      },
      {
        id: 'tea-book', name: '茶书茶画', sort: 2, active: true, productCount: 4,
        children: [
          { id: 'book-tea-art', name: '茶艺书籍', sort: 1, active: true, productCount: 2 },
          { id: 'book-tea-culture', name: '茶文化书籍', sort: 2, active: true, productCount: 2 },
        ],
      },
      {
        id: 'tea-incense', name: '茶香/香道', sort: 3, active: true, productCount: 2,
        children: [
          { id: 'incense-stick', name: '线香', sort: 1, active: true, productCount: 1 },
          { id: 'incense-cone', name: '盘香', sort: 2, active: true, productCount: 1 },
        ],
      },
    ],
  },
];

const stats: StatCardData[] = [
  { label: '一级分类', value: '4', icon: <svg viewBox="0 0 18 18" fill="none"><rect x="3" y="3" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/><rect x="10" y="3" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/><rect x="3" y="10" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/></svg> },
  { label: '二级分类', value: '17', icon: <svg viewBox="0 0 18 18" fill="none"><path d="M3 5h8M3 10h5M3 15h8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> },
  { label: '三级分类', value: '46', icon: <svg viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.3"/><path d="M9 3v7h7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> },
  { label: '商品总数', value: '246', trend: { direction: 'up', value: '+12' }, icon: <svg viewBox="0 0 18 18" fill="none"><rect x="4" y="4" width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M4 8h10M8 4v10" stroke="currentColor" strokeWidth="1.2"/></svg> },
];

/** 递归统计所有分类数 */
function countAll(nodes: CategoryNode[]): number {
  let count = 0;
  for (const n of nodes) {
    count++;
    if (n.children) count += countAll(n.children);
  }
  return count;
}

/** 查找节点路径 */
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

/** 查找节点 */
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

/** 获取层级标签 */
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
  const [showAddDialog, setShowAddDialog] = useState<{ parentId: string | null; level: number } | null>(null);

  const selectedNode = selectedId ? findNode(categories, selectedId) : null;
  const selectedPath = selectedId ? findPath(categories, selectedId) : null;

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleToggleActive = (id: string) => {
    const toggle = (nodes: CategoryNode[]): CategoryNode[] =>
      nodes.map((n) => {
        if (n.id === id) return { ...n, active: !n.active };
        if (n.children) return { ...n, children: toggle(n.children) };
        return n;
      });
    setCategories(toggle(categories));
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
      active: true,
      productCount: 0,
    };

    if (showAddDialog.parentId === 'root') {
      setCategories((prev) => [...prev, newNode]);
    } else {
      const addChild = (nodes: CategoryNode[]): CategoryNode[] =>
        nodes.map((n) => {
          if (n.id === showAddDialog.parentId) {
            return { ...n, children: [...(n.children || []), newNode] };
          }
          if (n.children) return { ...n, children: addChild(n.children) };
          return n;
        });
      setCategories(addChild(categories));
      setExpandedIds((prev) => new Set([...prev, showAddDialog.parentId!]));
    }
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

  /** 渲染树节点 */
  const renderTreeNode = (node: CategoryNode, depth: number) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedIds.has(node.id);
    const isSelected = selectedId === node.id;

    return (
      <div key={node.id}>
        <div
          className={`category-tree-node${isSelected ? ' selected' : ''}`}
          style={{ paddingLeft: depth * 20 + 8 }}
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
          {!node.active && <span className="category-tree-inactive">停用</span>}
        </div>
        {hasChildren && isExpanded && (
          <div className="category-tree-children">
            {node.children!.map((child) => renderTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <ContentHeader title="分类管理" breadcrumbs={['商品', '分类管理']} actions={<Button onClick={() => setShowAddDialog({ parentId: 'root', level: -1 })}><PlusIcon />新增一级分类</Button>} />
      <div className="content-body">
        <div className="stat-cards">
          {stats.map((s, i) => <StatCard key={i} data={s} />)}
        </div>
        <div className="category-layout">
          {/* 左侧分类树 */}
          <Card title="分类结构" className="category-tree-card">
            <div className="category-tree">
              {categories.map((cat) => renderTreeNode(cat, 0))}
            </div>
          </Card>

          {/* 右侧详情 */}
          <div className="category-detail-area">
            {selectedNode ? (
              <>
                <Card title="分类详情" headerRight={
                  editing ? (
                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                      <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>取消</Button>
                      <Button size="sm" onClick={() => setEditing(false)}>保存</Button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                      <Button size="sm" onClick={() => setEditing(true)}>编辑</Button>
                    </div>
                  )
                }>
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
                        {editing ? <input className="detail-input" defaultValue={selectedNode.name} /> : <span style={{ fontWeight: 'var(--font-medium)' }}>{selectedNode.name}</span>}
                      </div>
                    </div>
                    <div className="detail-row">
                      <div className="detail-label">分类层级</div>
                      <div className="detail-value">
                        <StatusTag variant="info" label={getLevelLabel(selectedPath ? selectedPath.length - 1 : 0)} />
                      </div>
                    </div>
                    <div className="detail-row">
                      <div className="detail-label">上级分类</div>
                      <div className="detail-value">
                        {selectedPath && selectedPath.length > 1 ? selectedPath[selectedPath.length - 2].name : <span style={{ color: 'var(--color-neutral-400)' }}>无（顶级分类）</span>}
                      </div>
                    </div>
                    <div className="detail-row">
                      <div className="detail-label">排序号</div>
                      <div className="detail-value">
                        {editing ? <input className="detail-input" type="number" defaultValue={selectedNode.sort} /> : <span className="mono">{selectedNode.sort}</span>}
                      </div>
                    </div>
                    <div className="detail-row">
                      <div className="detail-label">商品数量</div>
                      <div className="detail-value"><span className="mono">{selectedNode.productCount}</span> 件</div>
                    </div>
                    <div className="detail-row">
                      <div className="detail-label">启用状态</div>
                      <div className="detail-value">
                        {editing ? (
                          <Toggle active={selectedNode.active} onChange={() => handleToggleActive(selectedNode.id)} />
                        ) : (
                          <StatusTag variant={selectedNode.active ? 'success' : 'warning'} label={selectedNode.active ? '启用' : '停用'} />
                        )}
                      </div>
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
                          {editing && (
                            <Button variant="ghost" size="sm" onClick={() => handleAddChild(selectedNode.id, selectedPath ? selectedPath.length : 0)}>
                              <PlusIcon /> 添加子分类
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                    {!selectedNode.children && editing && selectedPath && selectedPath.length < 3 && (
                      <div className="detail-row detail-row-span">
                        <div className="detail-label">子分类</div>
                        <div className="detail-value">
                          <Button variant="ghost" size="sm" onClick={() => handleAddChild(selectedNode.id, selectedPath.length)}>
                            <PlusIcon /> 添加子分类
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 操作区 */}
                  <div style={{ marginTop: 'var(--space-5)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--color-neutral-200)', display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                    <Button variant="ghost" style={{ color: 'var(--color-semantic-error)' }} onClick={() => handleDelete(selectedNode.id)}>删除此分类</Button>
                  </div>
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
                新增{showAddDialog.level < 0 ? '一级' : getLevelLabel(showAddDialog.level + 1)}
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
      </div>
    </>
  );
}

function PlusIcon() {
  return <svg viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
}
