import type { EducationRecord, EducationStage } from '../../types';

interface EducationRecordsEditorProps {
  /** 学习经历列表 */
  records: EducationRecord[];
  /** 列表变更回调 */
  onChange: (records: EducationRecord[]) => void;
}

/** 学习阶段选项 */
const STAGE_OPTIONS: { value: EducationStage; label: string }[] = [
  { value: 'high_school', label: '高中' },
  { value: 'college', label: '大专' },
  { value: 'university', label: '大学' },
];

const STAGE_LABELS: Record<EducationStage, string> = {
  high_school: '高中',
  college: '大专',
  university: '大学',
};

/** 已选阶段集合 */
function getSelectedStages(records: EducationRecord[]): Set<EducationStage> {
  return new Set(records.map((r) => r.stage));
}

export default function EducationRecordsEditor({ records, onChange }: EducationRecordsEditorProps) {
  const selectedStages = getSelectedStages(records);

  /** 切换阶段选中状态 */
  const toggleStage = (stage: EducationStage) => {
    if (selectedStages.has(stage)) {
      // 取消选中 → 移除该阶段记录
      onChange(records.filter((r) => r.stage !== stage));
    } else {
      // 选中 → 新增空白记录
      onChange([...records, { stage, school: '', college: '', major: '' }]);
    }
  };

  /** 更新某阶段记录字段 */
  const updateField = (stage: EducationStage, field: keyof Omit<EducationRecord, 'stage'>, value: string) => {
    onChange(records.map((r) => (r.stage === stage ? { ...r, [field]: value } : r)));
  };

  return (
    <div>
      {/* 阶段多选 */}
      <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
        {STAGE_OPTIONS.map((opt) => {
          const checked = selectedStages.has(opt.value);
          return (
            <label
              key={opt.value}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-1)',
                padding: '4px 12px',
                borderRadius: 'var(--radius-sm)',
                border: `1px solid ${checked ? 'var(--color-module-current-base)' : 'var(--color-border-primary)'}`,
                background: checked ? 'var(--color-module-current-lightest)' : 'transparent',
                color: checked ? 'var(--color-module-current-base)' : 'var(--color-text-secondary)',
                fontSize: 'var(--text-sm)',
                cursor: 'pointer',
                userSelect: 'none',
              }}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggleStage(opt.value)}
                style={{ margin: 0, accentColor: 'var(--color-module-current-base)' }}
              />
              {opt.label}
            </label>
          );
        })}
      </div>

      {/* 已选阶段的详细填写 */}
      {records.length === 0 ? (
        <div style={{ padding: 'var(--space-3)', color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', textAlign: 'center', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)' }}>
          请先选择学习阶段（高中 / 大专 / 大学 可多选）
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {records.map((rec) => (
            <div
              key={rec.stage}
              style={{
                padding: 'var(--space-3)',
                border: '1px solid var(--color-border-primary)',
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-bg-secondary)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                <span
                  style={{
                    fontSize: 'var(--text-xs)',
                    fontWeight: 'var(--font-semibold)',
                    color: 'var(--color-module-current-base)',
                    background: 'var(--color-module-current-lightest)',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-sm)',
                  }}
                >
                  {STAGE_LABELS[rec.stage]}
                </span>
              </div>
              <div className="drawer-form-row" style={{ gap: 'var(--space-2)' }}>
                <div className="drawer-form-field">
                  <label className="drawer-label">学校</label>
                  <input
                    className="filter-input"
                    style={{ width: '100%' }}
                    value={rec.school}
                    onChange={(e) => updateField(rec.stage, 'school', e.target.value)}
                    placeholder="请输入学校名称"
                  />
                </div>
                {rec.stage !== 'high_school' && (
                  <div className="drawer-form-field">
                    <label className="drawer-label">学院</label>
                    <input
                      className="filter-input"
                      style={{ width: '100%' }}
                      value={rec.college}
                      onChange={(e) => updateField(rec.stage, 'college', e.target.value)}
                      placeholder="请输入学院"
                    />
                  </div>
                )}
                {rec.stage !== 'high_school' && (
                  <div className="drawer-form-field">
                    <label className="drawer-label">专业</label>
                    <input
                      className="filter-input"
                      style={{ width: '100%' }}
                      value={rec.major}
                      onChange={(e) => updateField(rec.stage, 'major', e.target.value)}
                      placeholder="请输入专业"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export { STAGE_LABELS };
