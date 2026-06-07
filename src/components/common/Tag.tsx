import { TeaCategory } from '../../types';

interface TagProps {
  category: TeaCategory;
  label?: string;
}

/** 茶类标签组件 */
export default function Tag({ category, label }: TagProps) {
  const categoryLabels: Record<TeaCategory, string> = {
    [TeaCategory.GREEN]: '绿茶',
    [TeaCategory.WHITE]: '白茶',
    [TeaCategory.YELLOW]: '黄茶',
    [TeaCategory.OOLONG]: '青茶',
    [TeaCategory.RED]: '红茶',
    [TeaCategory.DARK]: '黑茶',
    [TeaCategory.FLOWER]: '花草茶',
  };

  const tagClass = `tag tag-${category}`;
  return <span className={tagClass}>{label ?? categoryLabels[category]}</span>;
}
