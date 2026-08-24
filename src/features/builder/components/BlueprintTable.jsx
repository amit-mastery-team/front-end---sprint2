import PropTypes from 'prop-types';
import { DataTable } from '@/shared/components/ui';
import { useI18n } from '@/shared/i18n/I18nProvider';

const itemsIn = (row) => row.easy + row.medium + row.hard;

/** A number cell that edits the row directly — this is the only place a blueprint gets built. */
function CountInput({ value, onChange }) {
  return (
    <input
      type="number"
      min={0}
      className="u-tabular"
      value={value}
      onChange={(event) => onChange(Number(event.target.value))}
    />
  );
}

CountInput.propTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default function BlueprintTable({ rows, onChangeRow }) {
  const { t } = useI18n();

  const columns = [
    { key: 'topic', header: t('common.topic'), render: (row) => t(`topics.${row.topic}`) },
    {
      key: 'weight',
      header: t('common.weight'),
      render: (row) => <CountInput value={row.weight} onChange={(value) => onChangeRow(row.topic, 'weight', value)} />,
    },
    {
      key: 'easy',
      header: t('common.easy'),
      render: (row) => <CountInput value={row.easy} onChange={(value) => onChangeRow(row.topic, 'easy', value)} />,
    },
    {
      key: 'medium',
      header: t('common.medium'),
      render: (row) => <CountInput value={row.medium} onChange={(value) => onChangeRow(row.topic, 'medium', value)} />,
    },
    {
      key: 'hard',
      header: t('common.hard'),
      render: (row) => <CountInput value={row.hard} onChange={(value) => onChangeRow(row.topic, 'hard', value)} />,
    },
    { key: 'items', header: t('common.items'), render: itemsIn },
  ];

  return (
    <DataTable
      caption={t('builder.tableCaption')}
      columns={columns}
      rows={rows}
      getRowKey={(row) => row.topic}
    />
  );
}

BlueprintTable.propTypes = {
  rows: PropTypes.array.isRequired,
  onChangeRow: PropTypes.func.isRequired,
};
