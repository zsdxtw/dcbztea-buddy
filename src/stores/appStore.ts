import { create } from 'zustand';
import { ModuleKey } from '../types';
import { MODULE_CONFIGS } from '../data/modules';

interface AppState {
  /** 当前激活模块 */
  currentModule: ModuleKey;
  /** 当前激活子菜单 key */
  currentSubMenu: string;
  /** 侧边栏是否折叠 */
  sidebarCollapsed: boolean;
  /** 切换模块 */
  switchModule: (key: ModuleKey, subMenu?: string) => void;
  /** 切换子菜单 */
  switchSubMenu: (key: string) => void;
  /** 折叠/展开侧边栏 */
  toggleSidebar: () => void;
}

/** 从 localStorage 恢复侧边栏折叠状态 */
const getInitialCollapsed = (): boolean => {
  try {
    return localStorage.getItem('sidebarCollapsed') === 'true';
  } catch {
    return false;
  }
};

export const useAppStore = create<AppState>((set, get) => ({
  currentModule: ModuleKey.DASHBOARD,
  currentSubMenu: 'overview',
  sidebarCollapsed: getInitialCollapsed(),

  switchModule: (key: ModuleKey, subMenu?: string) => {
    const menus = MODULE_CONFIGS[key]?.menus ?? [];
    const firstMenu = subMenu ?? (menus.length > 0 ? menus[0].key : key);
    set({ currentModule: key, currentSubMenu: firstMenu });
  },

  switchSubMenu: (key: string) => {
    set({ currentSubMenu: key });
  },

  toggleSidebar: () => {
    const next = !get().sidebarCollapsed;
    set({ sidebarCollapsed: next });
    try {
      localStorage.setItem('sidebarCollapsed', String(next));
    } catch {
      // ignore
    }
  },
}));
