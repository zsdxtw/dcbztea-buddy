import type { ReactNode } from 'react';

interface SettingsRowProps {
  label: string;
  description?: string;
  action?: ReactNode;
}

/** 设置行组件 */
export default function SettingsRow({ label, description, action }: SettingsRowProps) {
  return (
    <div className="settings-row">
      <div>
        <div className="settings-label">{label}</div>
        {description && <div className="settings-desc">{description}</div>}
      </div>
      {action}
    </div>
  );
}
