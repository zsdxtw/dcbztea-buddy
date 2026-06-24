import { useState, useMemo, type CSSProperties } from 'react';
import ContentHeader from '../../components/layout/ContentHeader';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Table from '../../components/common/Table';
import StatusTag from '../../components/common/StatusTag';
import StatCard from '../../components/common/StatCard';
import FilterBar from '../../components/business/FilterBar';
import IdCardUpload, { parseIdCardNo, type IdCardOcrResult } from '../../components/business/IdCardUpload';
import ContractUpload from '../../components/business/ContractUpload';
import EducationRecordsEditor, { STAGE_LABELS } from '../../components/business/EducationRecordsEditor';
import { useDrawerWidth } from '../../hooks/useDrawerWidth';
import {
  orgNodes,
  employees as initialEmployees,
  calculateEmployeePerformance,
  getOrgNodeName,
  EMP_STATUS_LABELS,
} from '../../data/organization';
import type {
  Employee,
  EmployeePerformance,
  EmployeeStatus,
  EducationRecord,
  StatCardData,
  StatusVariant,
} from '../../types';

/* ── 常量与工具 ── */

const GENDER_LABELS: Record<'male' | 'female', string> = { male: '男', female: '女' };

/** 员工状态 → StatusTag 变体（在职=success、试用期=warning、离职=info） */
function empStatusVariant(status: EmployeeStatus): StatusVariant {
  switch (status) {
    case 'active':
      return 'success';
    case 'probation':
      return 'warning';
    case 'inactive':
      return 'info';
    default:
      return 'default';
  }
}

/** 金额格式化：¥ + 千分位 */
function formatYuan(n: number): string {
  return `¥${n.toLocaleString('en-US')}`;
}

/** 从员工列表中解析工号最大序号 */
function maxSeqFromEmpNo(list: Employee[]): number {
  return list.reduce((max, e) => {
    const m = e.empNo.match(/^DC(\d+)$/);
    const n = m ? parseInt(m[1], 10) : 0;
    return Math.max(max, n);
  }, 0);
}

/** 从员工列表中解析 ID 最大序号 */
function maxSeqFromId(list: Employee[]): number {
  return list.reduce((max, e) => {
    const m = e.id.match(/^emp-(\d+)$/);
    const n = m ? parseInt(m[1], 10) : 0;
    return Math.max(max, n);
  }, 0);
}

/* ── 主组件 ── */

export default function PersonnelEmployee() {
  const [employeeList, setEmployeeList] = useState<Employee[]>(initialEmployees);
  const [activeTab, setActiveTab] = useState<'list' | 'performance'>('list');
  const [showDrawer, setShowDrawer] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [detailEmployee, setDetailEmployee] = useState<Employee | null>(null);

  const stats: StatCardData[] = useMemo(() => {
    const total = employeeList.length;
    const active = employeeList.filter((e) => e.status === 'active').length;
    const probation = employeeList.filter((e) => e.status === 'probation').length;
    const inactive = employeeList.filter((e) => e.status === 'inactive').length;
    return [
      {
        label: '员工总数',
        value: String(total),
        unit: '人',
        trend: { direction: 'up', value: `在职 ${active} 人` },
        icon: <IconUsers />,
      },
      {
        label: '在职员工',
        value: String(active),
        unit: '人',
        trend: { direction: 'up', value: `占比 ${total ? Math.round((active / total) * 100) : 0}%` },
        icon: <IconActive />,
      },
      {
        label: '试用期员工',
        value: String(probation),
        unit: '人',
        trend: { direction: 'up', value: '待转正' },
        icon: <IconManager />,
      },
      {
        label: '离职员工',
        value: String(inactive),
        unit: '人',
        trend: { direction: 'down', value: '已离职' },
        icon: <IconFollower />,
      },
    ];
  }, [employeeList]);

  const handleAdd = () => {
    setEditingEmployee(null);
    setShowDrawer(true);
  };

  const handleEdit = (emp: Employee) => {
    setEditingEmployee(emp);
    setShowDrawer(true);
  };

  const handleDetail = (emp: Employee) => {
    setDetailEmployee(emp);
  };

  const handleDelete = (emp: Employee) => {
    if (window.confirm(`确定要删除员工「${emp.name}」（${emp.empNo}）吗？此操作不可撤销。`)) {
      setEmployeeList((prev) => prev.filter((e) => e.id !== emp.id));
    }
  };

  const handleSave = (emp: Employee) => {
    setEmployeeList((prev) => {
      const exists = prev.some((e) => e.id === emp.id);
      if (exists) {
        return prev.map((e) => (e.id === emp.id ? emp : e));
      }
      return [...prev, emp];
    });
    setShowDrawer(false);
    setEditingEmployee(null);
  };

  const handleCloseDrawer = () => {
    setShowDrawer(false);
    setEditingEmployee(null);
  };

  const handleCloseDetail = () => {
    setDetailEmployee(null);
  };

  return (
    <div>
      <ContentHeader title="员工管理" breadcrumbs={['人员', '员工管理']} />

      {/* 统计卡片 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)', marginBottom: 'var(--space-5)' }}>
        {stats.map((s, i) => (
          <StatCard key={i} data={s} />
        ))}
      </div>

      {/* Tab 切换 */}
      <div style={{ display: 'flex', gap: 'var(--space-1)', borderBottom: '1px solid var(--color-border-primary)', marginBottom: 'var(--space-4)' }}>
        {(['list', 'performance'] as const).map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: 'var(--space-3) var(--space-5)',
                background: 'none',
                border: 'none',
                borderBottom: isActive ? '2px solid var(--color-module-current-base)' : '2px solid transparent',
                color: isActive ? 'var(--color-module-current-base)' : 'var(--color-text-secondary)',
                fontWeight: isActive ? 'var(--font-semibold)' : 'var(--font-medium)',
                fontSize: 'var(--text-sm)',
                cursor: 'pointer',
                marginBottom: '-1px',
              }}
            >
              {tab === 'list' ? '员工列表' : '员工绩效'}
            </button>
          );
        })}
      </div>

      {/* 内容区 */}
      {activeTab === 'list' ? (
        <EmployeeListTab
          employeeList={employeeList}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDetail={handleDetail}
          onDelete={handleDelete}
        />
      ) : (
        <PerformanceTab />
      )}

      {/* 新增/编辑抽屉 */}
      {showDrawer && (
        <EditEmployeeDrawer
          employee={editingEmployee}
          employeeList={employeeList}
          onCancel={handleCloseDrawer}
          onSave={handleSave}
        />
      )}

      {/* 详情抽屉 */}
      {detailEmployee && (
        <EmployeeDetailDrawer
          employee={detailEmployee}
          onClose={handleCloseDetail}
          onEdit={(emp) => {
            setDetailEmployee(null);
            handleEdit(emp);
          }}
        />
      )}
    </div>
  );
}

/* ── 子组件：员工列表 Tab ── */

function EmployeeListTab({
  employeeList,
  onAdd,
  onEdit,
  onDetail,
  onDelete,
}: {
  employeeList: Employee[];
  onAdd: () => void;
  onEdit: (emp: Employee) => void;
  onDetail: (emp: Employee) => void;
  onDelete: (emp: Employee) => void;
}) {
  const [keyword, setKeyword] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const departments = useMemo(() => orgNodes.filter((n) => n.type === 'department'), []);

  const filtered = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    return employeeList.filter((e) => {
      if (kw && !e.name.toLowerCase().includes(kw) && !e.empNo.toLowerCase().includes(kw)) return false;
      if (deptFilter && e.departmentId !== deptFilter) return false;
      if (statusFilter && e.status !== statusFilter) return false;
      return true;
    });
  }, [employeeList, keyword, deptFilter, statusFilter]);

  return (
    <div>
      {/* 筛选栏 + 新增按钮 */}
      <FilterBar>
        <input
          className="filter-input"
          placeholder="搜索姓名 / 工号"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          style={{ width: 220 }}
        />
        <select
          className="filter-select"
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          style={{ width: 160 }}
        >
          <option value="">全部部门</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ width: 140 }}
        >
          <option value="">全部状态</option>
          {(Object.entries(EMP_STATUS_LABELS) as [string, string][]).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <Button onClick={onAdd}>
          <svg viewBox="0 0 16 16" fill="none" style={{ width: 14, height: 14 }}>
            <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          新增员工
        </Button>
        <span style={{ marginLeft: 'auto', fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)', alignSelf: 'center' }}>
          共 {filtered.length} 名员工
        </span>
      </FilterBar>

      {/* 表格 */}
      <Card style={{ padding: 0, marginTop: 'var(--space-4)' }}>
        {filtered.length === 0 ? (
          <EmptyState text="暂无符合条件的员工，可调整筛选条件或新增员工。" />
        ) : (
          <Table
            headers={['工号', '姓名', '性别', '部门', '团队', '职位', '手机号', '入职日期', '状态', '操作']}
            rows={filtered.map((emp) => [
              <span key="empNo" className="mono" style={{ fontSize: 'var(--text-sm)' }}>{emp.empNo}</span>,
              <span key="name" style={{ fontWeight: 'var(--font-medium)' }}>{emp.name}</span>,
              GENDER_LABELS[emp.gender],
              getOrgNodeName(emp.departmentId),
              emp.teamId ? getOrgNodeName(emp.teamId) : <span key="team" style={{ color: 'var(--color-text-tertiary)' }}>-</span>,
              emp.position,
              <span key="phone" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{emp.phone}</span>,
              emp.joinDate,
              <StatusTag key="status" variant={empStatusVariant(emp.status)} label={EMP_STATUS_LABELS[emp.status]} />,
              <div key="ops" style={{ display: 'flex', gap: 'var(--space-1)' }}>
                <Button size="sm" variant="ghost" onClick={() => onDetail(emp)}>查看</Button>
                <Button size="sm" variant="ghost" onClick={() => onEdit(emp)}>编辑</Button>
                <Button size="sm" variant="ghost" onClick={() => onDelete(emp)} style={{ color: '#CB405D' }}>删除</Button>
              </div>,
            ])}
          />
        )}
      </Card>
    </div>
  );
}

/* ── 子组件：员工绩效 Tab ── */

function PerformanceTab() {
  const performanceData: EmployeePerformance[] = useMemo(() => calculateEmployeePerformance(), []);

  /** 排名样式：1-3 名用奖牌色，其余灰色 */
  const rankStyle = (rank: number): CSSProperties => {
    if (rank === 1) return { background: '#FFD700', color: '#5A4500' };
    if (rank === 2) return { background: '#C0C0C0', color: '#3A3A3A' };
    if (rank === 3) return { background: '#CD7F32', color: '#fff' };
    return { background: 'var(--color-bg-tertiary)', color: 'var(--color-text-tertiary)' };
  };

  return (
    <div>
      {/* 说明卡片 */}
      <div style={{ background: 'var(--color-module-current-lightest)', border: '1px solid var(--color-module-current-light)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
          <svg viewBox="0 0 16 16" fill="none" style={{ width: 16, height: 16, color: 'var(--color-module-current-base)' }}>
            <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
            <path d="M8 5v3.5M8 11v.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <span style={{ fontWeight: 'var(--font-semibold)', color: 'var(--color-module-current-darkest)' }}>绩效计算规则</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
          <div>
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--color-module-current-base)', marginBottom: 'var(--space-1)' }}>绩效金额（基于订单金额）</div>
            <ul style={{ margin: 0, paddingLeft: 'var(--space-5)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
              <li>跟单人：订单金额 × 40%</li>
              <li>对接人（无跟单人时）：订单金额 × 40%</li>
              <li>对接人（所有订单）：订单金额 × 50%</li>
            </ul>
          </div>
          <div>
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--color-module-personnel-secondary)', marginBottom: 'var(--space-1)' }}>绩效利润（基于订单利润）</div>
            <ul style={{ margin: 0, paddingLeft: 'var(--space-5)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
              <li>订单利润 =（销售实价 - 采购实价）× 90%</li>
              <li>跟单人：订单利润 × 40%</li>
              <li>对接人（无跟单人时）：订单利润 × 40%</li>
              <li>对接人（所有订单）：订单利润 × 50%</li>
            </ul>
          </div>
        </div>
      </div>

      <Card style={{ padding: 0 }}>
        {performanceData.length === 0 ? (
          <EmptyState text="暂无绩效数据。" />
        ) : (
          <Table
            headers={['排名', '员工', '部门', '跟单金额(¥)', '对接金额(¥)', '金额合计(¥)', '跟单利润(¥)', '对接利润(¥)', '利润合计(¥)', '订单数']}
            rows={performanceData.map((perf, idx) => {
              const rank = idx + 1;
              return [
                <div
                  key="rank"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    fontWeight: 'var(--font-bold)',
                    fontSize: 'var(--text-sm)',
                    ...rankStyle(rank),
                  }}
                >
                  {rank}
                </div>,
                <span key="name" style={{ fontWeight: 'var(--font-medium)' }}>{perf.employeeName}</span>,
                perf.departmentName,
                <span key="follAmt" style={{ color: 'var(--color-text-secondary)' }}>{formatYuan(perf.followerAmount)}</span>,
                <span key="liaAmt" style={{ color: 'var(--color-text-secondary)' }}>{formatYuan(perf.liaisonAmount)}</span>,
                <span key="totAmt" style={{ fontWeight: 'var(--font-semibold)', color: 'var(--color-module-current-base)' }}>{formatYuan(perf.totalAmount)}</span>,
                <span key="follPft" style={{ color: 'var(--color-text-secondary)' }}>{formatYuan(perf.followerProfit)}</span>,
                <span key="liaPft" style={{ color: 'var(--color-text-secondary)' }}>{formatYuan(perf.liaisonProfit)}</span>,
                <span key="totPft" style={{ fontWeight: 'var(--font-semibold)', color: 'var(--color-module-personnel-secondary)' }}>{formatYuan(perf.totalProfit)}</span>,
                <span key="count" style={{ color: 'var(--color-text-secondary)' }}>{perf.orderCount}</span>,
              ];
            })}
          />
        )}
      </Card>
    </div>
  );
}

/* ── 子组件：新增/编辑抽屉 ── */

function EditEmployeeDrawer({
  employee,
  employeeList,
  onCancel,
  onSave,
}: {
  employee: Employee | null;
  employeeList: Employee[];
  onCancel: () => void;
  onSave: (emp: Employee) => void;
}) {
  const drawerWidth = useDrawerWidth();
  const isEdit = employee !== null;

  const departments = useMemo(() => orgNodes.filter((n) => n.type === 'department'), []);

  const nextEmpNo = useMemo(() => {
    const seq = maxSeqFromEmpNo(employeeList) + 1;
    return `DC${String(seq).padStart(3, '0')}`;
  }, [employeeList]);

  const nextId = useMemo(() => {
    const seq = maxSeqFromId(employeeList) + 1;
    return `emp-${seq}`;
  }, [employeeList]);

  const [form, setForm] = useState<Employee>(
    employee ?? {
      id: nextId,
      empNo: nextEmpNo,
      name: '',
      gender: 'male',
      phone: '',
      email: '',
      departmentId: '',
      teamId: '',
      position: '',
      joinDate: new Date().toISOString().slice(0, 10),
      status: 'probation',
      remark: '',
      idCardNo: '',
      idCardImages: [],
      idCardAddress: '',
      ethnicity: '',
      nativePlace: '',
      birthDate: '',
      hobbies: '',
      height: undefined,
      weight: undefined,
      localAddress: '',
      education: '',
      degree: '',
      educationRecords: [],
      settlement: { accountNo: '', accountName: '', bankName: '', bankNo: '' },
      contracts: [],
      emergencyContactName: '',
      emergencyContactPhone: '',
    },
  );

  const teams = useMemo(
    () => orgNodes.filter((n) => n.type === 'team' && n.parentId === form.departmentId),
    [form.departmentId],
  );

  const update = <K extends keyof Employee>(k: K, v: Employee[K]) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const handleDeptChange = (deptId: string) => {
    setForm((prev) => ({ ...prev, departmentId: deptId, teamId: '' }));
  };

  /** OCR 识别结果回填 */
  const handleOcrRecognized = (result: IdCardOcrResult) => {
    setForm((prev) => ({
      ...prev,
      name: result.name && !prev.name ? result.name : prev.name,
      gender: result.gender ?? prev.gender,
      birthDate: result.birthDate ?? prev.birthDate,
      idCardAddress: result.idCardAddress ?? prev.idCardAddress,
      idCardNo: result.idCardNo ?? prev.idCardNo,
      ethnicity: result.ethnicity ?? prev.ethnicity,
    }));
  };

  /** 身份证号变更时自动解析出生日期与性别 */
  const handleIdCardNoChange = (value: string) => {
    const parsed = parseIdCardNo(value);
    setForm((prev) => ({
      ...prev,
      idCardNo: value,
      birthDate: parsed.birthDate ?? prev.birthDate,
      gender: parsed.gender ?? prev.gender,
    }));
  };

  const canSave = form.name.trim().length > 0;

  const handleSave = () => {
    if (!canSave) return;
    onSave(form);
  };

  return (
    <div className="drawer-overlay" onClick={onCancel}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()} style={{ width: drawerWidth }}>
        <div className="drawer-header">
          <span className="drawer-title">{isEdit ? '编辑员工' : '新增员工'}</span>
          <button className="drawer-close" onClick={onCancel}>
            <svg viewBox="0 0 16 16" fill="none">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="drawer-body">
          {/* 基本信息 */}
          <div className="drawer-section-title">基本信息</div>
          <div className="drawer-form-row">
            <div className="drawer-form-field">
              <label className="drawer-label">工号（自动生成）</label>
              <input className="filter-input" style={{ width: '100%' }} value={form.empNo} readOnly />
            </div>
            <div className="drawer-form-field">
              <label className="drawer-label">姓名 *</label>
              <input
                className="filter-input"
                style={{ width: '100%' }}
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                placeholder="请输入姓名"
              />
            </div>
            <div className="drawer-form-field">
              <label className="drawer-label">性别</label>
              <select
                className="filter-select"
                style={{ width: '100%' }}
                value={form.gender}
                onChange={(e) => update('gender', e.target.value as Employee['gender'])}
              >
                <option value="male">男</option>
                <option value="female">女</option>
              </select>
            </div>
          </div>
          <div className="drawer-form-row">
            <div className="drawer-form-field">
              <label className="drawer-label">手机号</label>
              <input
                className="filter-input"
                style={{ width: '100%' }}
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                placeholder="请输入手机号"
              />
            </div>
            <div className="drawer-form-field" style={{ flex: 2 }}>
              <label className="drawer-label">邮箱</label>
              <input
                className="filter-input"
                style={{ width: '100%' }}
                value={form.email ?? ''}
                onChange={(e) => update('email', e.target.value)}
                placeholder="请输入邮箱"
              />
            </div>
          </div>

          {/* 身份证信息 */}
          <div className="drawer-section-title">身份证信息</div>
          <div className="drawer-form-row" style={{ flexDirection: 'column' }}>
            <div className="drawer-form-field" style={{ width: '100%' }}>
              <label className="drawer-label">身份证图片（正反面，支持 OCR 识别）</label>
              <IdCardUpload
                images={form.idCardImages ?? []}
                onChange={(imgs) => update('idCardImages', imgs)}
                onOcrRecognized={handleOcrRecognized}
                idCardNo={form.idCardNo}
              />
            </div>
          </div>
          <div className="drawer-form-row">
            <div className="drawer-form-field">
              <label className="drawer-label">身份证号</label>
              <input
                className="filter-input"
                style={{ width: '100%' }}
                value={form.idCardNo ?? ''}
                onChange={(e) => handleIdCardNoChange(e.target.value)}
                placeholder="请输入身份证号"
              />
            </div>
            <div className="drawer-form-field">
              <label className="drawer-label">民族</label>
              <input
                className="filter-input"
                style={{ width: '100%' }}
                value={form.ethnicity ?? ''}
                onChange={(e) => update('ethnicity', e.target.value)}
                placeholder="如：汉族"
              />
            </div>
            <div className="drawer-form-field">
              <label className="drawer-label">出生日期</label>
              <input
                className="filter-input"
                style={{ width: '100%' }}
                type="date"
                value={form.birthDate ?? ''}
                onChange={(e) => update('birthDate', e.target.value)}
              />
            </div>
          </div>
          <div className="drawer-form-row">
            <div className="drawer-form-field">
              <label className="drawer-label">籍贯</label>
              <input
                className="filter-input"
                style={{ width: '100%' }}
                value={form.nativePlace ?? ''}
                onChange={(e) => update('nativePlace', e.target.value)}
                placeholder="如：浙江杭州"
              />
            </div>
            <div className="drawer-form-field" style={{ flex: 2 }}>
              <label className="drawer-label">身份证住址</label>
              <input
                className="filter-input"
                style={{ width: '100%' }}
                value={form.idCardAddress ?? ''}
                onChange={(e) => update('idCardAddress', e.target.value)}
                placeholder="请输入身份证住址"
              />
            </div>
          </div>

          {/* 个人信息 */}
          <div className="drawer-section-title">个人信息</div>
          <div className="drawer-form-row">
            <div className="drawer-form-field">
              <label className="drawer-label">身高（cm）</label>
              <input
                className="filter-input"
                style={{ width: '100%' }}
                type="number"
                value={form.height ?? ''}
                onChange={(e) => update('height', e.target.value ? Number(e.target.value) : undefined)}
                placeholder="如：175"
              />
            </div>
            <div className="drawer-form-field">
              <label className="drawer-label">体重（kg）</label>
              <input
                className="filter-input"
                style={{ width: '100%' }}
                type="number"
                value={form.weight ?? ''}
                onChange={(e) => update('weight', e.target.value ? Number(e.target.value) : undefined)}
                placeholder="如：68"
              />
            </div>
            <div className="drawer-form-field">
              <label className="drawer-label">兴趣爱好</label>
              <input
                className="filter-input"
                style={{ width: '100%' }}
                value={form.hobbies ?? ''}
                onChange={(e) => update('hobbies', e.target.value)}
                placeholder="如：茶道、书法"
              />
            </div>
          </div>
          <div className="drawer-form-row">
            <div className="drawer-form-field" style={{ flex: 1 }}>
              <label className="drawer-label">本地住址</label>
              <input
                className="filter-input"
                style={{ width: '100%' }}
                value={form.localAddress ?? ''}
                onChange={(e) => update('localAddress', e.target.value)}
                placeholder="请输入本地住址"
              />
            </div>
          </div>

          {/* 学历信息 */}
          <div className="drawer-section-title">学历信息</div>
          <div className="drawer-form-row">
            <div className="drawer-form-field">
              <label className="drawer-label">学历</label>
              <select
                className="filter-select"
                style={{ width: '100%' }}
                value={form.education ?? ''}
                onChange={(e) => update('education', e.target.value)}
              >
                <option value="">请选择学历</option>
                <option value="高中">高中</option>
                <option value="大专">大专</option>
                <option value="本科">本科</option>
                <option value="硕士">硕士</option>
                <option value="博士">博士</option>
              </select>
            </div>
            <div className="drawer-form-field">
              <label className="drawer-label">学位</label>
              <input
                className="filter-input"
                style={{ width: '100%' }}
                value={form.degree ?? ''}
                onChange={(e) => update('degree', e.target.value)}
                placeholder="如：工学学士"
              />
            </div>
          </div>
          <div className="drawer-form-row" style={{ flexDirection: 'column' }}>
            <div className="drawer-form-field" style={{ width: '100%' }}>
              <label className="drawer-label">学习经历（高中 / 大专 / 大学 可多选）</label>
              <EducationRecordsEditor
                records={form.educationRecords ?? []}
                onChange={(records: EducationRecord[]) => update('educationRecords', records)}
              />
            </div>
          </div>

          {/* 组织信息 */}
          <div className="drawer-section-title">组织信息</div>
          <div className="drawer-form-row">
            <div className="drawer-form-field">
              <label className="drawer-label">部门 *</label>
              <select
                className="filter-select"
                style={{ width: '100%' }}
                value={form.departmentId}
                onChange={(e) => handleDeptChange(e.target.value)}
              >
                <option value="">请选择部门</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div className="drawer-form-field">
              <label className="drawer-label">团队</label>
              <select
                className="filter-select"
                style={{ width: '100%' }}
                value={form.teamId ?? ''}
                onChange={(e) => update('teamId', e.target.value)}
                disabled={teams.length === 0}
              >
                <option value="">请选择团队（可选）</option>
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            <div className="drawer-form-field">
              <label className="drawer-label">职位</label>
              <input
                className="filter-input"
                style={{ width: '100%' }}
                value={form.position}
                onChange={(e) => update('position', e.target.value)}
                placeholder="请输入职位"
              />
            </div>
          </div>
          <div className="drawer-form-row">
            <div className="drawer-form-field">
              <label className="drawer-label">入职日期</label>
              <input
                className="filter-input"
                style={{ width: '100%' }}
                type="date"
                value={form.joinDate}
                onChange={(e) => update('joinDate', e.target.value)}
              />
            </div>
            <div className="drawer-form-field">
              <label className="drawer-label">状态</label>
              <select
                className="filter-select"
                style={{ width: '100%' }}
                value={form.status}
                onChange={(e) => update('status', e.target.value as EmployeeStatus)}
              >
                <option value="active">在职</option>
                <option value="probation">试用期</option>
                <option value="inactive">离职</option>
              </select>
            </div>
          </div>

          {/* 结算信息 */}
          <div className="drawer-section-title">结算信息</div>
          <div className="drawer-form-row">
            <div className="drawer-form-field">
              <label className="drawer-label">户名</label>
              <input
                className="filter-input"
                style={{ width: '100%' }}
                value={form.settlement?.accountName ?? ''}
                onChange={(e) => update('settlement', { ...(form.settlement ?? { accountNo: '', accountName: '', bankName: '', bankNo: '' }), accountName: e.target.value })}
                placeholder="请输入户名"
              />
            </div>
            <div className="drawer-form-field">
              <label className="drawer-label">卡号</label>
              <input
                className="filter-input"
                style={{ width: '100%' }}
                value={form.settlement?.accountNo ?? ''}
                onChange={(e) => update('settlement', { ...(form.settlement ?? { accountNo: '', accountName: '', bankName: '', bankNo: '' }), accountNo: e.target.value })}
                placeholder="请输入卡号"
              />
            </div>
          </div>
          <div className="drawer-form-row">
            <div className="drawer-form-field">
              <label className="drawer-label">开户银行</label>
              <input
                className="filter-input"
                style={{ width: '100%' }}
                value={form.settlement?.bankName ?? ''}
                onChange={(e) => update('settlement', { ...(form.settlement ?? { accountNo: '', accountName: '', bankName: '', bankNo: '' }), bankName: e.target.value })}
                placeholder="如：中国工商银行杭州分行"
              />
            </div>
            <div className="drawer-form-field">
              <label className="drawer-label">开户行号</label>
              <input
                className="filter-input"
                style={{ width: '100%' }}
                value={form.settlement?.bankNo ?? ''}
                onChange={(e) => update('settlement', { ...(form.settlement ?? { accountNo: '', accountName: '', bankName: '', bankNo: '' }), bankNo: e.target.value })}
                placeholder="如：102331000234"
              />
            </div>
          </div>

          {/* 合同文件 */}
          <div className="drawer-section-title">合同文件（PDF，最多 5 个）</div>
          <div className="drawer-form-row" style={{ flexDirection: 'column' }}>
            <div className="drawer-form-field" style={{ width: '100%' }}>
              <ContractUpload
                files={form.contracts ?? []}
                onChange={(files) => update('contracts', files)}
                max={5}
              />
            </div>
          </div>

          {/* 紧急联系人 */}
          <div className="drawer-section-title">紧急联系人</div>
          <div className="drawer-form-row">
            <div className="drawer-form-field">
              <label className="drawer-label">紧急联系人姓名</label>
              <input
                className="filter-input"
                style={{ width: '100%' }}
                value={form.emergencyContactName ?? ''}
                onChange={(e) => update('emergencyContactName', e.target.value)}
                placeholder="请输入紧急联系人姓名"
              />
            </div>
            <div className="drawer-form-field">
              <label className="drawer-label">紧急联系人电话</label>
              <input
                className="filter-input"
                style={{ width: '100%' }}
                value={form.emergencyContactPhone ?? ''}
                onChange={(e) => update('emergencyContactPhone', e.target.value)}
                placeholder="请输入紧急联系人电话"
              />
            </div>
          </div>

          {/* 其他 */}
          <div className="drawer-section-title">其他</div>
          <div className="drawer-form-row">
            <div className="drawer-form-field" style={{ flex: 1 }}>
              <label className="drawer-label">备注</label>
              <input
                className="filter-input"
                style={{ width: '100%' }}
                value={form.remark ?? ''}
                onChange={(e) => update('remark', e.target.value)}
                placeholder="请输入备注"
              />
            </div>
          </div>
        </div>

        <div className="drawer-footer">
          <Button variant="ghost" onClick={onCancel}>取消</Button>
          <Button onClick={handleSave} disabled={!canSave}>保存</Button>
        </div>
      </div>
    </div>
  );
}

/* ── 子组件：员工详情抽屉 ── */

function EmployeeDetailDrawer({
  employee,
  onClose,
  onEdit,
}: {
  employee: Employee;
  onClose: () => void;
  onEdit: (emp: Employee) => void;
}) {
  const drawerWidth = useDrawerWidth();

  const fieldStyle: CSSProperties = {
    padding: 'var(--space-2) 0',
    borderBottom: '1px solid var(--color-border-primary)',
    display: 'flex',
    gap: 'var(--space-3)',
  };
  const labelStyle: CSSProperties = {
    width: 110,
    flexShrink: 0,
    color: 'var(--color-text-tertiary)',
    fontSize: 'var(--text-sm)',
  };
  const valueStyle: CSSProperties = {
    flex: 1,
    color: 'var(--color-text-primary)',
    fontSize: 'var(--text-sm)',
    wordBreak: 'break-all',
  };

  const renderField = (label: string, value?: string | number | null) => (
    <div style={fieldStyle}>
      <span style={labelStyle}>{label}</span>
      <span style={valueStyle}>{value || <span style={{ color: 'var(--color-text-tertiary)' }}>-</span>}</span>
    </div>
  );

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()} style={{ width: drawerWidth }}>
        <div className="drawer-header">
          <span className="drawer-title">员工详情</span>
          <button className="drawer-close" onClick={onClose}>
            <svg viewBox="0 0 16 16" fill="none">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="drawer-body">
          {/* 基本信息 */}
          <div className="drawer-section-title">基本信息</div>
          {renderField('工号', employee.empNo)}
          {renderField('姓名', employee.name)}
          {renderField('性别', GENDER_LABELS[employee.gender])}
          {renderField('手机号', employee.phone)}
          {renderField('邮箱', employee.email)}
          {renderField('部门', getOrgNodeName(employee.departmentId))}
          {renderField('团队', employee.teamId ? getOrgNodeName(employee.teamId) : '-')}
          {renderField('职位', employee.position)}
          {renderField('入职日期', employee.joinDate)}
          {renderField('状态', EMP_STATUS_LABELS[employee.status])}

          {/* 身份证信息 */}
          <div className="drawer-section-title" style={{ marginTop: 'var(--space-4)' }}>身份证信息</div>
          {renderField('身份证号', employee.idCardNo)}
          {renderField('民族', employee.ethnicity)}
          {renderField('出生日期', employee.birthDate)}
          {renderField('籍贯', employee.nativePlace)}
          {renderField('身份证住址', employee.idCardAddress)}
          {employee.idCardImages && employee.idCardImages.length > 0 && (
            <div style={{ padding: 'var(--space-2) 0' }}>
              <div style={{ ...labelStyle, marginBottom: 'var(--space-2)' }}>身份证图片</div>
              <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                {employee.idCardImages.map((img, i) => (
                  <img key={i} src={img} alt={`身份证${i === 0 ? '正面' : '反面'}`} style={{ width: 120, height: 76, objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-primary)' }} />
                ))}
              </div>
            </div>
          )}

          {/* 个人信息 */}
          <div className="drawer-section-title" style={{ marginTop: 'var(--space-4)' }}>个人信息</div>
          {renderField('身高（cm）', employee.height)}
          {renderField('体重（kg）', employee.weight)}
          {renderField('兴趣爱好', employee.hobbies)}
          {renderField('本地住址', employee.localAddress)}

          {/* 学历信息 */}
          <div className="drawer-section-title" style={{ marginTop: 'var(--space-4)' }}>学历信息</div>
          {renderField('学历', employee.education)}
          {renderField('学位', employee.degree)}
          {employee.educationRecords && employee.educationRecords.length > 0 ? (
            <div style={{ padding: 'var(--space-2) 0' }}>
              <div style={{ ...labelStyle, marginBottom: 'var(--space-2)' }}>学习经历</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {employee.educationRecords.map((rec, i) => (
                  <div key={i} style={{ padding: 'var(--space-2) var(--space-3)', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)' }}>
                    <span style={{ color: 'var(--color-module-current-base)', fontWeight: 'var(--font-semibold)', marginRight: 'var(--space-2)' }}>
                      {STAGE_LABELS[rec.stage]}
                    </span>
                    {rec.school}{rec.college ? ` · ${rec.college}` : ''}{rec.major ? ` · ${rec.major}` : ''}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            renderField('学习经历', '-')
          )}

          {/* 结算信息 */}
          <div className="drawer-section-title" style={{ marginTop: 'var(--space-4)' }}>结算信息</div>
          {renderField('户名', employee.settlement?.accountName)}
          {renderField('卡号', employee.settlement?.accountNo)}
          {renderField('开户银行', employee.settlement?.bankName)}
          {renderField('开户行号', employee.settlement?.bankNo)}

          {/* 合同文件 */}
          <div className="drawer-section-title" style={{ marginTop: 'var(--space-4)' }}>合同文件</div>
          {employee.contracts && employee.contracts.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', padding: 'var(--space-2) 0' }}>
              {employee.contracts.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-2) var(--space-3)', border: '1px solid var(--color-border-primary)', borderRadius: 'var(--radius-md)', background: 'var(--color-bg-secondary)' }}>
                  <svg viewBox="0 0 16 16" fill="none" style={{ width: 16, height: 16, color: '#CB405D', flexShrink: 0 }}>
                    <path d="M4 1.5h5L13 5.5V14a.5.5 0 0 1-.5.5h-8A.5.5 0 0 1 4 14V2a.5.5 0 0 1 .5-.5z" stroke="currentColor" strokeWidth="1.2" />
                  </svg>
                  <a href={f.url} target="_blank" rel="noreferrer" style={{ flex: 1, fontSize: 'var(--text-sm)', color: 'var(--color-module-current-base)', textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={f.name}>
                    {f.name}
                  </a>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{f.uploadedAt}</span>
                </div>
              ))}
            </div>
          ) : (
            renderField('合同文件', '-')
          )}

          {/* 紧急联系人 */}
          <div className="drawer-section-title" style={{ marginTop: 'var(--space-4)' }}>紧急联系人</div>
          {renderField('联系人姓名', employee.emergencyContactName)}
          {renderField('联系人电话', employee.emergencyContactPhone)}

          {/* 其他 */}
          <div className="drawer-section-title" style={{ marginTop: 'var(--space-4)' }}>其他</div>
          {renderField('备注', employee.remark)}
        </div>

        <div className="drawer-footer">
          <Button variant="ghost" onClick={onClose}>关闭</Button>
          <Button onClick={() => onEdit(employee)}>编辑</Button>
        </div>
      </div>
    </div>
  );
}

/* ── 通用子组件 ── */

function EmptyState({ text }: { text: string }) {
  return (
    <div style={{ padding: 'var(--space-8) var(--space-4)', textAlign: 'center', color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)' }}>
      {text}
    </div>
  );
}

function IconUsers() {
  return (
    <svg viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="6" r="3" stroke="currentColor" strokeWidth="1.3" />
      <path d="M3 15c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function IconActive() {
  return (
    <svg viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M6 9.5l2 2 4-4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconManager() {
  return (
    <svg viewBox="0 0 18 18" fill="none">
      <rect x="3" y="5" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M9 5V3.5M7 3.5h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M3 9h12" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function IconFollower() {
  return (
    <svg viewBox="0 0 18 18" fill="none">
      <rect x="4" y="2.5" width="10" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M6.5 6h5M6.5 9h5M6.5 12h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
