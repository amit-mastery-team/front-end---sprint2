import PropTypes from 'prop-types';
import { Badge, Card, DescriptionList } from '@/shared/components/ui';
import { useI18n } from '@/shared/i18n/I18nProvider';

export default function AttemptStateCard({ attempt }) {
  const { t } = useI18n();

  const items = [
    {
      key: 'attempt',
      term: t('attempt.attemptLabel'),
      description: t('attempt.attemptValue', {
        current: attempt.attemptNumber,
        limit: attempt.attemptLimit,
      }),
    },
    {
      key: 'form',
      term: t('attempt.form'),
      description: t('attempt.formValue', { form: attempt.form }),
    },
    {
      key: 'lastAnswer',
      term: t('attempt.lastAnswer'),
      description: attempt.lastSavedAt ? t('attempt.savedNow') : t('attempt.notSaved'),
    },
    {
      key: 'timer',
      term: t('attempt.timerAuthority'),
      description: <Badge tone="ok">{t('attempt.server')}</Badge>,
    },
    {
      key: 'crm',
      term: t('attempt.crm'),
      description: <Badge tone="ok">{t('attempt.none')}</Badge>,
    },
  ];

  return (
    <Card title={t('attempt.attemptState')}>
      <DescriptionList items={items} />
    </Card>
  );
}

AttemptStateCard.propTypes = {
  attempt: PropTypes.object.isRequired,
};
