import type { ReactNode } from 'react';

interface SettingsSectionProps {
  title: string;
  children: ReactNode;
}

/** 设置分组组件 */
export default function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <div className="settings-section">
      <div className="settings-section-title">{title}</div>
      {children}
    </div>
  );
}
