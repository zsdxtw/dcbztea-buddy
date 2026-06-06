import ContentHeader from '../../components/layout/ContentHeader';
import Card from '../../components/common/Card';
import SettingsSection from '../../components/settings/SettingsSection';
import SettingsRow from '../../components/settings/SettingsRow';

export default function SettingsAbout() {
  return (
    <>
      <ContentHeader title="关于" breadcrumbs={['系统', '关于']} />
      <div className="content-body">
        <Card>
          <SettingsSection title="系统信息">
            <SettingsRow label="系统名称" description="淡茶半盏 — 茶行业 ERP" />
            <SettingsRow label="系统版本" description="v1.0.0" />
            <SettingsRow label="构建时间" description="2025-07-15" />
            <SettingsRow label="技术栈" description="React 18 + TypeScript 5.5 + Vite 5 + Tailwind CSS 3.4" />
          </SettingsSection>
          <SettingsSection title="开发团队">
            <SettingsRow label="产品经理" description="Alice" />
            <SettingsRow label="架构师" description="Gao" />
            <SettingsRow label="工程师" description="Kou" />
          </SettingsSection>
        </Card>
      </div>
    </>
  );
}
