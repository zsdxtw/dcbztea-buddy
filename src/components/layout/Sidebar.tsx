import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../stores/appStore';
import { MODULE_CONFIGS } from '../../data/modules';
import clsx from 'clsx';

/** 侧边栏 */
export default function Sidebar() {
  const navigate = useNavigate();
  const currentModule = useAppStore((s) => s.currentModule);
  const currentSubMenu = useAppStore((s) => s.currentSubMenu);
  const sidebarCollapsed = useAppStore((s) => s.sidebarCollapsed);
  const switchSubMenu = useAppStore((s) => s.switchSubMenu);
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);

  const config = MODULE_CONFIGS[currentModule];
  const menus = config?.menus ?? [];

  const handleMenuClick = (menuKey: string) => {
    switchSubMenu(menuKey);
    navigate(`/${currentModule}/${menuKey}`);
  };

  return (
    <aside className={clsx('sidebar', sidebarCollapsed && 'collapsed')}>
      <div className="sidebar-header">
        <span className="sidebar-module-title">{config?.label ?? ''}</span>
        <button className="sidebar-toggle" onClick={toggleSidebar} title="折叠/展开">
          <svg viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      <nav className="sidebar-nav">
        {menus.map((menu) => (
          <div
            key={menu.key}
            className={clsx('sidebar-nav-item', currentSubMenu === menu.key && 'active')}
            data-tooltip={menu.label}
            onClick={() => handleMenuClick(menu.key)}
          >
            <span className="sidebar-nav-item-icon">{menu.icon}</span>
            <span className="sidebar-nav-item-text">{menu.label}</span>
          </div>
        ))}
      </nav>
    </aside>
  );
}
