import ContentHeader from '../../components/layout/ContentHeader';
import Card from '../../components/common/Card';
import SettingsSection from '../../components/settings/SettingsSection';
import SettingsRow from '../../components/settings/SettingsRow';
import Toggle from '../../components/common/Toggle';
import Button from '../../components/common/Button';

export default function SettingsSystem() {
  return (
    <>
      <ContentHeader title="系统设置" breadcrumbs={['设置', '系统设置']} />
      <div className="content-body">
        <Card>
          <SettingsSection title="基础设置">
            <SettingsRow label="企业名称" description="淡茶半盏茶业有限公司" action={<Button variant="ghost" size="sm">修改</Button>} />
            <SettingsRow label="默认仓库" description="杭州总仓" action={<Button variant="ghost" size="sm">修改</Button>} />
            <SettingsRow label="货币单位" description="人民币 (CNY)" action={<Button variant="ghost" size="sm">修改</Button>} />
          </SettingsSection>
          <SettingsSection title="通知设置">
            <SettingsRow label="库存预警通知" description="当库存低于预警线时发送通知" action={<Toggle active />} />
            <SettingsRow label="订单状态变更通知" description="采购/销售订单状态变更时通知" action={<Toggle active />} />
            <SettingsRow label="每日经营日报" description="每日 18:00 发送当日经营概要" action={<Toggle />} />
            <SettingsRow label="财务对账提醒" description="应收/应付到期前 3 天提醒" action={<Toggle active />} />
          </SettingsSection>
          <SettingsSection title="系统信息">
            <SettingsRow label="系统版本" description="v1.0.0" />
            <SettingsRow label="数据库" description="最近备份：2025-07-14 03:00" action={<Button variant="ghost" size="sm">立即备份</Button>} />
          </SettingsSection>
        </Card>
      </div>
    </>
  );
}
