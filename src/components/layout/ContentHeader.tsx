import type { ReactNode } from 'react';

/** 内容区头部（面包屑 + 标题 + 操作按钮） */
interface ContentHeaderProps {
  title: string;
  breadcrumbs: string[];
  actions?: ReactNode;
}

export default function ContentHeader({ title, breadcrumbs, actions }: ContentHeaderProps) {
  return (
    <div className="content-header">
      <div className="content-header-left">
        <div>
          <div className="breadcrumb">
            {breadcrumbs.map((item, i) =>
              i === breadcrumbs.length - 1 ? (
                <span key={i} className="breadcrumb-current">{item}</span>
              ) : (
                <span key={i}>
                  <span>{item}</span>
                  <span className="breadcrumb-separator">/</span>
                </span>
              ),
            )}
          </div>
          <div className="page-title-row">
            <div className="page-title-accent"></div>
            <h1 className="page-title">{title}</h1>
          </div>
        </div>
      </div>
      {actions && <div className="content-header-actions">{actions}</div>}
    </div>
  );
}
