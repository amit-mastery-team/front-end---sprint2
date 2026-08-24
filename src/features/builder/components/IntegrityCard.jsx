import PropTypes from 'prop-types';
import { Badge, Callout, Card } from '@/shared/components/ui';
import { useI18n } from '@/shared/i18n/I18nProvider';

export default function IntegrityCard({ isGraded, complete, reasons }) {
  const { t } = useI18n();

  return (
    <Card
      title={t('builder.integrity')}
      headerSlot={
        isGraded ? (
          <Badge tone={complete ? 'ok' : 'warn'}>
            {complete ? t('builder.complete') : t('builder.incomplete')}
          </Badge>
        ) : (
          <Badge tone="info">{t('builder.notGraded')}</Badge>
        )
      }
    >
      <p>{t('builder.integrityBody')}</p>
      {isGraded && !complete ? (
        <Callout tone="warn">
          {reasons.map((reason) => t(`builder.reason.${reason}`)).join(' ')}
        </Callout>
      ) : null}
      <Callout tone="info">{t('builder.equivalence')}</Callout>
    </Card>
  );
}

IntegrityCard.propTypes = {
  isGraded: PropTypes.bool,
  complete: PropTypes.bool,
  reasons: PropTypes.arrayOf(PropTypes.string),
};
