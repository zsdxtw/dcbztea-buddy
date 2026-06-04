import ContentHeader from '../../components/layout/ContentHeader';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import StatusTag from '../../components/common/StatusTag';
import Button from '../../components/common/Button';

export default function SettingsRoles() {
  const roles = [
    { name: '超级管理员', members: 2, permissions: '全部权限', status: 'success' as const },
    { name: '采购经理', members: 3, permissions: '采购、仓储模块', status: 'success' as const },
    { name: '销售经理', members: 5, permissions: '销售、客户模块', status: 'success' as const },
    { name: '财务专员', members: 2, permissions: '财务模块', status: 'success' as const },
    { name: '仓库管理员', members: 4, permissions: '仓储模块', status: 'info' as const },
  ];

  return (
    <>
      <ContentHeader title="角色权限" breadcrumbs={['设置', '角色权限']} actions={<Button><PlusIcon />新增角色</Button>} />
      <div className="content-body">
        <Card>
          <Table
            headers={['角色名称', '成员数', '权限范围', '状态']}
            rows={roles.map((r) => [
              r.name,
              `${r.members} 人`,
              r.permissions,
              <StatusTag variant={r.status} label="启用" />,
            ])}
          />
        </Card>
      </div>
    </>
  );
}

function PlusIcon() {
  return <svg viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
}
