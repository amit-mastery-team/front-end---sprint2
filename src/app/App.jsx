import { Route, Routes } from 'react-router-dom';
import AppShell from '@/shared/components/layout/AppShell';
import NotFoundPage from '@/features/not-found/NotFoundPage';
import { ROUTES } from './routes';

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        {ROUTES.map(({ path, element, index }) =>
          index ? (
            <Route key={path} index element={element} />
          ) : (
            <Route key={path} path={path} element={element} />
          ),
        )}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
