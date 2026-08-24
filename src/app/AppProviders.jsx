import PropTypes from 'prop-types';
import { BrowserRouter } from 'react-router-dom';
import { I18nProvider } from '@/shared/i18n/I18nProvider';
import { RoleProvider } from '@/shared/context/RoleProvider';
import { ToastProvider } from '@/shared/context/ToastProvider';

/** Composes every app-wide provider so main.jsx stays a single render call. */
export default function AppProviders({ children }) {
  return (
    <I18nProvider>
      <RoleProvider>
        <ToastProvider>
          <BrowserRouter>{children}</BrowserRouter>
        </ToastProvider>
      </RoleProvider>
    </I18nProvider>
  );
}

AppProviders.propTypes = {
  children: PropTypes.node,
};
