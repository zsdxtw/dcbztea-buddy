import { useState, useRef } from 'react';
import type { Employee } from '../../types';

/** 身份证 OCR 识别结果 */
export interface IdCardOcrResult {
  name?: string;
  gender?: 'male' | 'female';
  birthDate?: string;
  idCardAddress?: string;
  idCardNo?: string;
  ethnicity?: string;
}

interface IdCardUploadProps {
  /** 已上传的身份证图片列表 */
  images: string[];
  /** 图片变更回调 */
  onChange: (images: string[]) => void;
  /** OCR 识别结果回调（识别成功后回填表单字段） */
  onOcrRecognized?: (result: IdCardOcrResult) => void;
  /** 当前表单中的身份证号（用于辅助识别） */
  idCardNo?: string;
}

/** 从身份证号解析出生日期与性别 */
function parseIdCardNo(idCardNo: string): { birthDate?: string; gender?: 'male' | 'female' } {
  const trimmed = idCardNo.trim();
  if (trimmed.length !== 18) return {};
  const year = trimmed.slice(6, 10);
  const month = trimmed.slice(10, 12);
  const day = trimmed.slice(12, 14);
  const genderDigit = parseInt(trimmed.slice(16, 17), 10);
  return {
    birthDate: `${year}-${month}-${day}`,
    gender: genderDigit % 2 === 1 ? 'male' : 'female',
  };
}

/** 模拟民族列表（OCR 识别时随机返回常见民族） */
const COMMON_ETHNICITIES = ['汉族', '满族', '回族', '苗族', '土家族', '壮族', '蒙古族'];

/**
 * 模拟身份证 OCR 识别
 *
 * 真实场景应调用第三方 OCR 服务（如百度/阿里云身份证识别）。
 * 此处为演示用途：若已填写身份证号，则从中解析出生日期与性别；
 * 其余字段（姓名、住址、民族）使用模拟数据。
 */
function mockOcrRecognize(idCardNo?: string): Promise<IdCardOcrResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const result: IdCardOcrResult = {
        name: '张三',
        idCardAddress: '浙江省杭州市西湖区文三路 88 号',
        ethnicity: COMMON_ETHNICITIES[Math.floor(Math.random() * COMMON_ETHNICITIES.length)],
      };
      if (idCardNo && idCardNo.trim().length === 18) {
        const parsed = parseIdCardNo(idCardNo);
        result.idCardNo = idCardNo.trim();
        result.birthDate = parsed.birthDate;
        result.gender = parsed.gender;
      } else {
        // 无身份证号时返回模拟完整数据
        result.idCardNo = '330106199003152345';
        result.birthDate = '1990-03-15';
        result.gender = 'female';
      }
      resolve(result);
    }, 800);
  });
}

export default function IdCardUpload({ images, onChange, onOcrRecognized, idCardNo }: IdCardUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [recognizing, setRecognizing] = useState(false);
  const [recognized, setRecognized] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('请上传图片文件');
      return;
    }
    if (images.length >= 2) {
      alert('身份证正反面最多上传 2 张图片');
      return;
    }
    const url = URL.createObjectURL(file);
    onChange([...images, url]);
    setRecognized(false);
    e.target.value = '';
  };

  const handleRemove = (index: number) => {
    const next = images.filter((_, i) => i !== index);
    onChange(next);
    setRecognized(false);
  };

  const handleRecognize = async () => {
    if (images.length === 0) {
      alert('请先上传身份证图片');
      return;
    }
    setRecognizing(true);
    try {
      const result = await mockOcrRecognize(idCardNo);
      onOcrRecognized?.(result);
      setRecognized(true);
    } finally {
      setRecognizing(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {images.map((img, i) => (
          <div
            key={i}
            style={{
              position: 'relative',
              width: 120,
              height: 76,
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              border: '1px solid var(--color-border-primary)',
            }}
          >
            <img src={img} alt={`身份证${i === 0 ? '正面' : '反面'}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <button
              type="button"
              onClick={() => handleRemove(i)}
              style={{
                position: 'absolute',
                top: 2,
                right: 2,
                width: 18,
                height: 18,
                borderRadius: '50%',
                border: 'none',
                background: 'rgba(0,0,0,0.55)',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
              }}
            >
              <svg viewBox="0 0 16 16" fill="none" style={{ width: 10, height: 10 }}>
                <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
            <span
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'rgba(0,0,0,0.45)',
                color: '#fff',
                fontSize: '10px',
                textAlign: 'center',
                padding: '1px 0',
              }}
            >
              {i === 0 ? '正面' : '反面'}
            </span>
          </div>
        ))}

        {images.length < 2 && (
          <label
            style={{
              width: 120,
              height: 76,
              borderRadius: 'var(--radius-md)',
              border: '1px dashed var(--color-border-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              background: 'var(--color-bg-secondary)',
              color: 'var(--color-text-tertiary)',
              fontSize: 'var(--text-xs)',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <svg viewBox="0 0 16 16" fill="none" style={{ width: 18, height: 18 }}>
              <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            {images.length === 0 ? '上传正面' : '上传反面'}
            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
          </label>
        )}
      </div>

      <div style={{ marginTop: 'var(--space-2)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
        <button
          type="button"
          onClick={handleRecognize}
          disabled={recognizing || images.length === 0}
          style={{
            padding: '4px 12px',
            fontSize: 'var(--text-xs)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-module-current-base)',
            background: recognizing ? 'var(--color-module-current-light)' : 'transparent',
            color: 'var(--color-module-current-base)',
            cursor: recognizing || images.length === 0 ? 'not-allowed' : 'pointer',
            opacity: recognizing || images.length === 0 ? 0.6 : 1,
          }}
        >
          {recognizing ? '识别中…' : 'OCR 识别'}
        </button>
        {recognized && (
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-success, #01795D)' }}>
            ✓ 已识别并回填姓名、性别、出生日期、身份证号、住址、民族
          </span>
        )}
      </div>
    </div>
  );
}

/** 工具：从身份证号解析（供外部使用） */
export { parseIdCardNo };
