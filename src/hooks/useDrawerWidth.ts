import { useState, useEffect } from 'react';

/**
 * 计算抽屉宽度：取 content-header 宽度的 2/3，最小 1200px。
 * 监听窗口 resize 与侧边栏折叠/展开，实时更新。
 */
export function useDrawerWidth(): number {
  const [width, setWidth] = useState(1200);

  useEffect(() => {
    const calc = () => {
      const header = document.querySelector('.content-header');
      if (header) {
        const headerWidth = header.clientWidth;
        setWidth(Math.max(1200, Math.floor((headerWidth * 2) / 3)));
      }
    };
    calc();
    window.addEventListener('resize', calc);
    // 侧边栏折叠/展开会改变 content-header 宽度
    const observer = new MutationObserver(calc);
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) observer.observe(sidebar, { attributes: true, attributeFilter: ['class'] });
    return () => {
      window.removeEventListener('resize', calc);
      observer.disconnect();
    };
  }, []);

  return width;
}
