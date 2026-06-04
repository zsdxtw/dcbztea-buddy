import { useState, useEffect } from 'react';

/**
 * 响应式断点 Hook
 * @param query CSS 媒体查询字符串，如 '(max-width: 1023px)'
 * @returns 是否匹配
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

/** 便捷断点 Hook */
export function useIsMobile() {
  return useMediaQuery('(max-width: 767px)');
}

export function useIsTablet() {
  return useMediaQuery('(max-width: 1023px)');
}

export function useIsDesktop() {
  return useMediaQuery('(min-width: 1024px)');
}
