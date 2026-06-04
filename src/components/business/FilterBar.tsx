import type { ReactNode } from 'react';

interface FilterBarProps {
  children?: ReactNode;
}

/** 筛选栏组件 */
export default function FilterBar({ children }: FilterBarProps) {
  return <div className="filter-bar">{children}</div>;
}

/** 筛选输入框 */
export function FilterInput({ placeholder }: { placeholder?: string }) {
  return <input className="filter-input" placeholder={placeholder ?? '搜索...'} />;
}

/** 筛选下拉选择 */
export function FilterSelect({ options }: { options: string[] }) {
  return (
    <select className="filter-select">
      {options.map((opt, i) => (
        <option key={i} value={opt}>{opt}</option>
      ))}
    </select>
  );
}
