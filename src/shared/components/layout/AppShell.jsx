import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { ToastStack } from '@/shared/components/ui';
import { titleKeyForPath } from '@/app/routes';
import { useI18n } from '@/shared/i18n/I18nProvider';

function useDocumentTitle(pageTitle, appName) {
  useEffect(() => {
    document.title = `${pageTitle} — ${appName}`;
  }, [pageTitle, appName]);
}

function useScrollToTopOnNavigate(pathname) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
}

export default function AppShell() {
  const { t } = useI18n();
  const { pathname } = useLocation();
  const title = t(`nav.${titleKeyForPath(pathname)}`);

  useDocumentTitle(title, t('app.name'));
  useScrollToTopOnNavigate(pathname);

  return (
    <div className="app">
      <a className="skip-link" href="#main">
        {t('app.skip')}
      </a>
      <Sidebar />
      <div className="main">
        <Topbar title={title} />
        <main className="content" id="main">
          <Outlet />
        </main>
      </div>
      <ToastStack />
    </div>
  );
}
