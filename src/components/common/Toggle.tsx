import clsx from 'clsx';
import { useState } from 'react';

interface ToggleProps {
  active?: boolean;
  onChange?: (active: boolean) => void;
}

/** 开关组件 */
export default function Toggle({ active: controlledActive, onChange }: ToggleProps) {
  const [internalActive, setInternalActive] = useState(controlledActive ?? false);
  const isActive = controlledActive !== undefined ? controlledActive : internalActive;

  const handleClick = () => {
    const next = !isActive;
    if (controlledActive === undefined) {
      setInternalActive(next);
    }
    onChange?.(next);
  };

  return (
    <button
      className={clsx('toggle', isActive && 'active')}
      onClick={handleClick}
      type="button"
      aria-pressed={isActive}
    />
  );
}
