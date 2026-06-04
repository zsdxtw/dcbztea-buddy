import { useState } from 'react';
import clsx from 'clsx';
import type { TodoItemData } from '../../types';

interface TodoItemProps {
  data: TodoItemData;
}

/** 待办项组件 */
export default function TodoItem({ data }: TodoItemProps) {
  const [done, setDone] = useState(data.done);

  return (
    <div className="todo-item">
      <div
        className={clsx('todo-checkbox', done && 'checked')}
        onClick={() => setDone(!done)}
      >
        {done && (
          <svg viewBox="0 0 12 12" fill="none" style={{ width: 12, height: 12, color: 'white' }}>
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
      <span className={clsx('todo-text', done && 'done')}>{data.text}</span>
      <span className="todo-time">{data.time}</span>
    </div>
  );
}
