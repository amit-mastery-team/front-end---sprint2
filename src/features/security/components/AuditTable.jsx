import PropTypes from 'prop-types';
import { Badge, DataTable } from '@/shared/components/ui';
import { useI18n } from '@/shared/i18n/I18nProvider';

const DENIED = 'denied';

export default function AuditTable({ entries }) {
  const { t } = useI18n();

  const columns = [
    { key: 'time', header: t('common.time'), render: (row) => row.time, cellClassName: 'u-tabular' },
    { key: 'user', header: t('common.user'), render: (row) => row.user },
    {
      key: 'action',
      header: t('common.action'),
      render: (row) => row.action,
      // Request lines stay left-to-right even in an RTL layout.
      cellClassName: 'u-ltr',
    },
    {
      key: 'source',
      header: t('common.sourceAddress'),
      render: (row) => row.source,
      // IP addresses stay left-to-right even in an RTL layout.
      cellClassName: 'u-ltr u-tabular',
    },
    {
      key: 'outcome',
      header: t('common.outcome'),
      render: (row) => (
        <Badge tone={row.outcome === DENIED ? 'bad' : 'ok'}>
          {row.detail} {row.outcome === DENIED ? t('security.outcomeDenied') : t('security.outcomeSuccess')}
        </Badge>
      ),
    },
  ];

  return (
    <DataTable
      caption={t('security.tableCaption')}
      columns={columns}
      rows={entries}
      getRowKey={(row, index) => `${row.time}-${index}`}
    />
  );
}

AuditTable.propTypes = {
  entries: PropTypes.array.isRequired,
};
