import { useRef } from 'react';
import type { ContractFile } from '../../types';

interface ContractUploadProps {
  /** 已上传的合同文件列表 */
  files: ContractFile[];
  /** 文件列表变更回调 */
  onChange: (files: ContractFile[]) => void;
  /** 最大文件数，默认 5 */
  max?: number;
}

export default function ContractUpload({ files, onChange, max = 5 }: ContractUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      alert('仅支持上传 PDF 格式文件');
      e.target.value = '';
      return;
    }
    if (files.length >= max) {
      alert(`合同文件最多上传 ${max} 个`);
      e.target.value = '';
      return;
    }
    const url = URL.createObjectURL(file);
    onChange([
      ...files,
      { name: file.name, url, uploadedAt: new Date().toISOString().slice(0, 10) },
    ]);
    e.target.value = '';
  };

  const handleRemove = (index: number) => {
    onChange(files.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        {files.map((f, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              padding: 'var(--space-2) var(--space-3)',
              border: '1px solid var(--color-border-primary)',
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-bg-secondary)',
            }}
          >
            <svg viewBox="0 0 16 16" fill="none" style={{ width: 18, height: 18, color: '#CB405D', flexShrink: 0 }}>
              <path d="M4 1.5h5L13 5.5V14a.5.5 0 0 1-.5.5h-8A.5.5 0 0 1 4 14V2a.5.5 0 0 1 .5-.5z" stroke="currentColor" strokeWidth="1.2" />
              <path d="M9 1.5V5.5h4" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
            </svg>
            <a
              href={f.url}
              target="_blank"
              rel="noreferrer"
              style={{
                flex: 1,
                fontSize: 'var(--text-sm)',
                color: 'var(--color-module-current-base)',
                textDecoration: 'none',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
              title={f.name}
            >
              {f.name}
            </a>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', flexShrink: 0 }}>
              {f.uploadedAt}
            </span>
            <button
              type="button"
              onClick={() => handleRemove(i)}
              style={{
                border: 'none',
                background: 'none',
                color: '#CB405D',
                cursor: 'pointer',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
              title="删除"
            >
              <svg viewBox="0 0 16 16" fill="none" style={{ width: 14, height: 14 }}>
                <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        ))}

        {files.length < max && (
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--space-1)',
              padding: 'var(--space-2)',
              border: '1px dashed var(--color-border-primary)',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              color: 'var(--color-text-tertiary)',
              fontSize: 'var(--text-sm)',
              background: 'var(--color-bg-secondary)',
            }}
          >
            <svg viewBox="0 0 16 16" fill="none" style={{ width: 14, height: 14 }}>
              <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            上传合同（PDF，最多 {max} 个）
            <input ref={inputRef} type="file" accept="application/pdf,.pdf" style={{ display: 'none' }} onChange={handleFileChange} />
          </label>
        )}
      </div>
      <div style={{ marginTop: 'var(--space-1)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
        已上传 {files.length}/{max} 个文件
      </div>
    </div>
  );
}
