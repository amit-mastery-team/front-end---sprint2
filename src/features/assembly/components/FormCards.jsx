import PropTypes from 'prop-types';
import { Card, Metric, StatusBadge } from '@/shared/components/ui';
import { useI18n } from '@/shared/i18n/I18nProvider';

export default function FormCards({ forms }) {
  const { t, tx } = useI18n();

  return (
    <div className="grid g3">
      {forms.map((form) => (
        <Card key={form.id} title={t('assembly.formTitle', { id: form.id })}>
          <Metric value={form.items} unit={t('common.items')} />
          <p>
            {t('assembly.formMeta', { marks: form.marks, seed: form.seed, note: tx(form.note) })}
          </p>
          <StatusBadge status={form.status} />
          {form.itemIds ? (
            <p className="small u-ltr u-mt-2">{t('assembly.itemOrder')}: {form.itemIds.join(' → ')}</p>
          ) : null}
        </Card>
      ))}
    </div>
  );
}

FormCards.propTypes = {
  forms: PropTypes.array.isRequired,
};
