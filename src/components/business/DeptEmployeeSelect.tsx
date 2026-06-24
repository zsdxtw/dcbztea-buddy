import { useState, useMemo, useEffect } from 'react';
import { orgNodes, employees } from '../../data/organization';

interface DeptEmployeeSelectProps {
  /** 选中的员工 ID */
  value?: string;
  /** 值变化回调 */
  onChange: (empId: string) => void;
  /** 占位提示 */
  placeholder?: string;
  /** 样式 */
  style?: React.CSSProperties;
}

/**
 * 部门 → 员工 两级联动选择器
 *
 * 先选择组织架构中的部门，再选择该部门下的员工。
 * 当已有 value 时，自动回显对应部门。
 */
export default function DeptEmployeeSelect({
  value,
  onChange,
  placeholder = '请选择',
  style,
}: DeptEmployeeSelectProps) {
  const departments = useMemo(() => orgNodes.filter((n) => n.type === 'department'), []);

  // 根据已有员工 ID 反查部门
  const initialDeptId = useMemo(() => {
    if (!value) return '';
    const emp = employees.find((e) => e.id === value);
    return emp?.departmentId ?? '';
  }, [value]);

  const [deptId, setDeptId] = useState(initialDeptId);

  // 当外部 value 变化时同步部门
  useEffect(() => {
    setDeptId(initialDeptId);
  }, [initialDeptId]);

  const deptEmployees = useMemo(
    () => employees.filter((e) => e.departmentId === deptId),
    [deptId],
  );

  const handleDeptChange = (newDeptId: string) => {
    setDeptId(newDeptId);
    // 切换部门时清空员工选择
    if (value) {
      onChange('');
    }
  };

  return (
    <div style={{ display: 'flex', gap: 'var(--space-2)', ...style }}>
      <select
        className="filter-select"
        style={{ flex: 1 }}
        value={deptId}
        onChange={(e) => handleDeptChange(e.target.value)}
      >
        <option value="">选择部门</option>
        {departments.map((d) => (
          <option key={d.id} value={d.id}>{d.name}</option>
        ))}
      </select>
      <select
        className="filter-select"
        style={{ flex: 1 }}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={!deptId}
      >
        <option value="">{placeholder}</option>
        {deptEmployees.map((emp) => (
          <option key={emp.id} value={emp.id}>
            {emp.name}（{emp.position}）
          </option>
        ))}
      </select>
    </div>
  );
}
