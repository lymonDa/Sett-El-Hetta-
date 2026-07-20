import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const positions = new Map<string, number>();

export function useScrollRestore() {
  const { pathname, search } = useLocation();
  const key = `${pathname}${search}`;

  useEffect(() => {
    const saved = positions.get(key);

    if (saved !== undefined && saved > 0) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          window.scrollTo({ top: saved, behavior: 'instant' });
        });
      });
      positions.delete(key);
    } else {
      window.scrollTo(0, 0);
    }

    return () => {
      positions.set(key, window.scrollY);
    };
  }, [key]);
}