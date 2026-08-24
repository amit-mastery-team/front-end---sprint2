import { Card, DescriptionList, StatusBadge } from '@/shared/components/ui';
import { ELIGIBILITY_MATRIX } from '@/shared/constants/domain';
import { useI18n } from '@/shared/i18n/I18nProvider';

export default function EligibilityCard() {
  const { t } = useI18n();

  const items = ELIGIBILITY_MATRIX.map(({ status, eligibility }) => ({
    key: status,
    term: t(`status.${status}`),
    description: <StatusBadge status={eligibility} />,
  }));

  return (
    <Card title={t('review.eligibility')}>
      <DescriptionList items={items} />
      <hr />
      <p>{t('review.eligibilityNote')}</p>
    </Card>
  );
}
