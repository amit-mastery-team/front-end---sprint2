import PropTypes from 'prop-types';
import { Badge, Button, Card, Metric } from '@/shared/components/ui';
import { useI18n } from '@/shared/i18n/I18nProvider';
import { useToast } from '@/shared/context/ToastProvider';

export default function SecurityOverview({ overview }) {
  const { t } = useI18n();
  const { notifySuccess } = useToast();

  return (
    <div className="grid g3">
      <Card
        title={t('security.enrollment')}
        headerSlot={
          <Badge tone={overview.mfaEnabled ? 'ok' : 'bad'}>
            {overview.mfaEnabled ? t('security.enabled') : t('security.disabled')}
          </Badge>
        }
      >
        <p>{t('security.enrollmentBody')}</p>
        <Button onClick={() => notifySuccess(t('security.challengeSent'))}>
          {t('security.testChallenge')}
        </Button>
      </Card>

      <Card title={t('security.denied')}>
        <Metric value={overview.deniedRequests} />
        <p>{t('security.deniedBody')}</p>
      </Card>

      <Card title={t('security.crm')} headerSlot={<Badge tone="info">{t('security.crmStatus')}</Badge>}>
        <p>{t('security.crmBody')}</p>
      </Card>
    </div>
  );
}

SecurityOverview.propTypes = {
  overview: PropTypes.shape({
    mfaEnabled: PropTypes.bool,
    deniedRequests: PropTypes.number,
  }).isRequired,
};
