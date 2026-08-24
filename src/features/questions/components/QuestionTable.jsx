import PropTypes from 'prop-types';
import { DataTable, StatusBadge } from '@/shared/components/ui';
import { useI18n } from '@/shared/i18n/I18nProvider';

export default function QuestionTable({ questions }) {
  const { t, tx } = useI18n();

  const columns = [
    { key: 'id', header: t('common.id'), render: (q) => q.id },
    { key: 'text', header: t('common.question'), render: (q) => tx(q.text) },
    { key: 'type', header: t('common.type'), render: (q) => t(`questionType.${q.type}`) },
    { key: 'topic', header: t('common.topic'), render: (q) => t(`topics.${q.topic}`) },
    { key: 'difficulty', header: t('common.difficulty'), render: (q) => t(`difficulty.${q.difficulty}`) },
    { key: 'marks', header: t('common.marks'), render: (q) => q.marks },
    { key: 'language', header: t('bank.language'), render: (q) => t(`lang.${q.language}`) },
    { key: 'source', header: t('common.source'), render: (q) => t(`source.${q.source}`) },
    { key: 'status', header: t('common.status'), render: (q) => <StatusBadge status={q.status} /> },
  ];

  return (
    <DataTable
      caption={t('bank.tableCaption')}
      columns={columns}
      rows={questions}
      getRowKey={(question) => question.id}
    />
  );
}

QuestionTable.propTypes = {
  questions: PropTypes.array.isRequired,
};
