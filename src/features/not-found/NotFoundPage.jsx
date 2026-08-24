import { useNavigate } from 'react-router-dom';
import { Button, Card } from '@/shared/components/ui';
import { PATH } from '@/app/paths';
import { useI18n } from '@/shared/i18n/I18nProvider';

export default function NotFoundPage() {
  const { t } = useI18n();
  const navigate = useNavigate();

  return (
    <Card title={t('notFound.title')}>
      <p>{t('notFound.body')}</p>
      <Button variant="primary" onClick={() => navigate(PATH.OVERVIEW)}>
        {t('notFound.cta')}
      </Button>
    </Card>
  );
}
