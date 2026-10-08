// 새 배포 후 이전 청크 로드 실패 시 자동 복구 (Vite lazy chunk stale 오류)
// Layout ErrorBoundary와 함께 App 레벨에서 동작.
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const RELOAD_KEY = 'onlyai-chunk-reloaded';

export default function ChunkReloadGuard({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();

  useEffect(() => {
    const onError = (e: ErrorEvent) => {
      const msg = e.message || '';
      const isChunkFail =
        msg.includes('Failed to fetch dynamically imported module') ||
        msg.includes('Importing a module script failed') ||
        msg.includes('error loading dynamically imported module');
      if (!isChunkFail) return;
      // 무한 새로고침 방지: 세션당 1회만
      if (sessionStorage.getItem(RELOAD_KEY + pathname)) return;
      sessionStorage.setItem(RELOAD_KEY + pathname, '1');
      window.location.reload();
    };
    window.addEventListener('error', onError);
    return () => window.removeEventListener('error', onError);
  }, [pathname]);

  return <>{children}</>;
}
