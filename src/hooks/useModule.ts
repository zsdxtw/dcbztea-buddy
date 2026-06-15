import { useAppStore } from '../stores/appStore';
import { ModuleKey } from '../types';

/**
 * 获取当前模块信息的 Hook
 * - currentModule: 当前模块 Key
 * - currentModuleLabel: 当前模块中文名
 */
export function useModule() {
  const currentModule = useAppStore((s) => s.currentModule);
  const currentSubMenu = useAppStore((s) => s.currentSubMenu);

  const moduleLabels: Record<ModuleKey, string> = {
    [ModuleKey.DASHBOARD]: '工作台',
    [ModuleKey.PURCHASE]: '采购',
    [ModuleKey.SALES]: '销售',
    [ModuleKey.INVENTORY]: '仓储',
    [ModuleKey.PRODUCT]: '商品',
    [ModuleKey.FINANCE]: '财务',
    [ModuleKey.STATISTICS]: '统计',
    [ModuleKey.SETTINGS]: '设置',
    [ModuleKey.PERSONNEL]: '人员',
  };

  return {
    currentModule,
    currentSubMenu,
    currentModuleLabel: moduleLabels[currentModule] ?? '',
  };
}
