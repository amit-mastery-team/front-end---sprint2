import { NavLink } from 'react-router-dom';
import { ROUTES } from '@/app/routes';
import { useI18n } from '@/shared/i18n/I18nProvider';

const linkClass = ({ isActive }) => (isActive ? 'is-active' : '');

export default function Sidebar() {
  const { t } = useI18n();

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand__mark" aria-hidden="true">
          A
        </div>
        <div className="brand__text">
          <b>{t('app.name')}</b>
          <span>{t('app.tagline')}</span>
        </div>
      </div>

      <p className="nav__title">{t('nav.section')}</p>
      <nav className="nav" aria-label={t('nav.section')}>
        {ROUTES.map((route) => (
          <NavLink key={route.path} to={route.path} end={route.index} className={linkClass}>
            {t(`nav.${route.titleKey}`)}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__foot">
        <b>{t('app.footTitle')}</b>
        <p>{t('app.footBody')}</p>
        <span className="badge badge--gold">{t('app.footBadge')}</span>
      </div>
    </aside>
  );
}
