import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../stores/appStore';
import { ModuleKey } from '../../types';
import type { ReactNode } from 'react';

interface ShortcutItemProps {
  icon: ReactNode;
  text: string;
  moduleKey?: string;
  iconClass?: string;
}

/** 快捷入口组件 */
export default function ShortcutItem({ icon, text, moduleKey, iconClass }: ShortcutItemProps) {
  const navigate = useNavigate();
  const switchModule = useAppStore((s) => s.switchModule);

  const handleClick = () => {
    if (moduleKey) {
      switchModule(moduleKey as ModuleKey);
      navigate(`/${moduleKey}`);
    }
  };

  return (
    <div className="shortcut-item" onClick={handleClick}>
      <div className={`shortcut-item-icon${iconClass ? ` ${iconClass}` : ''}`}>{icon}</div>
      <span className="shortcut-item-text">{text}</span>
    </div>
  );
}
