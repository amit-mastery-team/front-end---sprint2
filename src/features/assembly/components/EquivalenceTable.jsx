import PropTypes from 'prop-types';
import { DataTable } from '@/shared/components/ui';
import { useI18n } from '@/shared/i18n/I18nProvider';

/** One column per assembled form, one row per equivalence check. */
export default function EquivalenceTable({ forms, checks }) {
  const { t } = useI18n();

  const columns = [
    { key: 'check', header: t('common.check'), render: (check) => t(`assembly.${check.key}`) },
    ...forms.map((form, index) => ({
      key: form.id,
      header: form.id,
      render: (check) => check.values[index],
    })),
  ];

  return (
    <DataTable
      caption={t('assembly.tableCaption')}
      columns={columns}
      rows={checks}
      getRowKey={(check) => check.key}
    />
  );
}

EquivalenceTable.propTypes = {
  forms: PropTypes.array.isRequired,
  checks: PropTypes.array.isRequired,
};
