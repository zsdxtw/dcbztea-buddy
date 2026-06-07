import { useState } from 'react';
import ContentHeader from '../../components/layout/ContentHeader';
import Card from '../../components/common/Card';
import StatusTag from '../../components/common/StatusTag';
import Button from '../../components/common/Button';
import { getTeaCategoryDetail } from '../../data/teaCategories';
import {
  type CategoryNode,
  type ProductCategoryType,
  productCategoryLabels,
  productCategoryBreadcrumbs,
  getTeaCategoryByName,
  findPath,
  findNode,
  getLevelLabel,
} from '../../data/productCategories';

interface ProductCategorySubPageProps {
  categoryType: ProductCategoryType;
  rootNode: CategoryNode;
}

/** 分类管理子页面（茶叶/茶具/茶周边/其他） */
export default function ProductCategorySubPage({ categoryType, rootNode }: ProductCategorySubPageProps) {
  const label = productCategoryLabels[categoryType];
  const breadcrumb = productCategoryBreadcrumbs[categoryType];

  const [categories, setCategories] = useState<CategoryNode>(rootNode);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(categories.children?.map((c) => c.id) ?? []));
  const [editing, setEditing] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState<{ parentId: string; level: number } | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const allNodes = [categories, ...(categories.children ?? [])];
  const selectedNode = selectedId ? findNode(allNodes, selectedId) : null;
  const selectedPath = selectedId ? findPath(allNodes, selectedId) : null;
  const isRoot = selectedId === categories.id;
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

    const addChild = (node: CategoryNode): CategoryNode => {
      if (node.id === showAddDialog.parentId) {
        return { ...node, children: [...(node.children || []), newNode] };
      }
      if (node.children) return { ...node, children: node.children.map(addChild) };
      return node;
    };
    setCategories(addChild(categories));
    setExpandedIds((prev) => new Set([...prev, showAddDialog.parentId]));
    setShowAddDialog(null);
  };

  const handleDelete = (id: string) => {
    const removeNode = (node: CategoryNode): CategoryNode => ({
      ...node,
      children: node.children?.filter((n) => n.id !== id).map((n) => removeNode(n)),
    });
    setCategories(removeNode(categories));
    if (selectedId === id) setSelectedId(null);
  };

  const renderTreeNode = (node: CategoryNode, nodeDepth: number) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedIds.has(node.id);
    const isSelected = selectedId === node.id;
    const isRootNode = node.id === categories.id;

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
          {node.icon && <span className="category-tree-icon" style={{ width: 18, height: 18, flexShrink: 0, color: 'var(--color-module-product-base)' }}>{node.icon}</span>}
          <span className="category-tree-name">{node.name}</span>
          <span className="category-tree-count">{node.productCount}</span>
          {/* 一级分类不可删除，但可新增子分类；二三级可新增/删除 */}
          {!isRootNode && nodeDepth < 2 && (
            <span className="category-tree-actions" onClick={(e) => e.stopPropagation()}>
              <button className="category-tree-action-btn" title="新增子分类" onClick={() => handleAddChild(node.id, nodeDepth)}>
                <svg viewBox="0 0 14 14" fill="none"><path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
              </button>
              <button className="category-tree-action-btn category-tree-action-delete" title="删除" onClick={() => handleDelete(node.id)}>
                <svg viewBox="0 0 14 14" fill="none"><path d="M3 4h8M5 4V3h4v1M6 6v4M8 6v4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 4l.7 7h4.6l.7-7" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>
              </button>
            </span>
          )}
          {(!isRootNode && nodeDepth >= 2) && (
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
      <ContentHeader title={breadcrumb} breadcrumbs={['商品', '分类管理', breadcrumb]} />
      <div className="content-body">
        <div className="category-layout">
          {/* 左侧分类树 */}
          <Card title={`${label}分类结构`} className="category-tree-card" headerRight={
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-400)' }}>可管理二三级分类</div>
          }>
            <div className="category-tree">
              {renderTreeNode(categories, 0)}
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
                        {editing && !isRoot ? <input className="detail-input" defaultValue={selectedNode.name} /> : <span style={{ fontWeight: 'var(--font-medium)' }}>{selectedNode.name}</span>}
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

                    {/* 茶叶二级分类：显示发酵种类和茶类介绍 */}
                    {categoryType === 'tea' && depth === 1 && selectedNode.fermentation && (
                      <div className="detail-row">
                        <div className="detail-label">发酵种类</div>
                        <div className="detail-value">
                          <StatusTag variant="success" label={selectedNode.fermentation} />
                        </div>
                      </div>
                    )}
                    {categoryType === 'tea' && depth === 1 && (() => {
                      const teaCatEnum = getTeaCategoryByName(selectedNode.name);
                      const teaDetail = teaCatEnum ? getTeaCategoryDetail(teaCatEnum) : undefined;
                      const intro = teaDetail?.introduction || selectedNode.description;
                      return intro ? (
                        <div className="detail-row detail-row-span">
                          <div className="detail-label">茶类介绍</div>
                          <div className="detail-value" style={{ lineHeight: 'var(--leading-relaxed)' }}>{intro}</div>
                        </div>
                      ) : null;
                    })()}

                    {/* 茶叶三级分类：显示产地和茶叶特点 */}
                    {categoryType === 'tea' && depth === 2 && selectedNode.origin && (
                      <div className="detail-row">
                        <div className="detail-label">产地</div>
                        <div className="detail-value">
                          <span style={{ fontWeight: 'var(--font-medium)' }}>{selectedNode.origin}</span>
                        </div>
                      </div>
                    )}

                    {/* 非茶叶分类的二级分类描述 */}
                    {categoryType !== 'tea' && depth === 1 && selectedNode.description && (
                      <div className="detail-row detail-row-span">
                        <div className="detail-label">分类说明</div>
                        <div className="detail-value" style={{ lineHeight: 'var(--leading-relaxed)' }}>{selectedNode.description}</div>
                      </div>
                    )}

                    {/* 三级分类描述（茶叶为茶叶特点，其他为商品说明） */}
                    {depth === 2 && selectedNode.description && (
                      <div className="detail-row detail-row-span">
                        <div className="detail-label">{categoryType === 'tea' ? '茶叶特点' : '商品说明'}</div>
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
                          {selectedPath && selectedPath.length < 3 && (
                            <Button variant="ghost" size="sm" onClick={() => handleAddChild(selectedNode.id, selectedPath ? selectedPath.length - 1 : 0)}>
                              <PlusIcon /> 添加子分类
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                    {!selectedNode.children && selectedPath && selectedPath.length < 3 && (
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

                  {!isRoot && (
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
