import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Callout,
  Modal,
  NumberField,
  SelectField,
  TextAreaField,
} from '@/shared/components/ui';
import {
  DIFFICULTY,
  DIFFICULTY_OPTIONS,
  QUESTION_TYPE,
  QUESTION_TYPE_OPTIONS,
  TOPIC,
  TOPIC_OPTIONS,
} from '@/shared/constants/domain';
import { LANGUAGE, LANGUAGES } from '@/shared/i18n/languages';
import { useI18n } from '@/shared/i18n/I18nProvider';
import AnswerFields from './AnswerFields';

const EMPTY_ANSWER_BY_TYPE = Object.freeze({
  [QUESTION_TYPE.SINGLE]: { options: [], correct: '' },
  [QUESTION_TYPE.MULTIPLE]: { options: [], correct: [] },
  [QUESTION_TYPE.BOOLEAN]: { correct: null },
  [QUESTION_TYPE.SHORT]: { modelAnswer: '' },
  [QUESTION_TYPE.NUMERIC]: { correct: '' },
  [QUESTION_TYPE.CODE]: { starterCode: '', rubric: '' },
});

const EMPTY_DRAFT = Object.freeze({
  text: '',
  type: QUESTION_TYPE.SINGLE,
  topic: TOPIC.JOINS,
  difficulty: DIFFICULTY.MEDIUM,
  marks: 2,
  language: LANGUAGE.EN,
  answer: EMPTY_ANSWER_BY_TYPE[QUESTION_TYPE.SINGLE],
});

const LANGUAGE_OPTIONS = LANGUAGES.map((language) => language.code);

export default function NewQuestionDialog({ open, pending, onClose, onSubmit }) {
  const { t } = useI18n();
  const [draft, setDraft] = useState(EMPTY_DRAFT);

  const setField = (field) => (value) => setDraft((current) => ({ ...current, [field]: value }));

  // Changing type swaps the whole answer shape — stale option/rubric data
  // from the previous type must not carry over.
  const setType = (type) =>
    setDraft((current) => ({ ...current, type, answer: EMPTY_ANSWER_BY_TYPE[type] }));

  const submit = async () => {
    const created = await onSubmit(draft);
    if (!created) return;
    setDraft(EMPTY_DRAFT);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={t('bank.modalTitle')}>
      <div className="form-grid">
        <SelectField
          label={t('common.type')}
          value={draft.type}
          options={QUESTION_TYPE_OPTIONS}
          getLabel={(option) => t(`questionType.${option}`)}
          onChange={setType}
        />
        <SelectField
          label={t('common.topic')}
          value={draft.topic}
          options={TOPIC_OPTIONS}
          getLabel={(option) => t(`topics.${option}`)}
          onChange={setField('topic')}
        />
        <SelectField
          label={t('common.difficulty')}
          value={draft.difficulty}
          options={DIFFICULTY_OPTIONS}
          getLabel={(option) => t(`difficulty.${option}`)}
          onChange={setField('difficulty')}
        />
        <NumberField label={t('common.marks')} value={draft.marks} onChange={setField('marks')} />
        <SelectField
          label={t('bank.language')}
          value={draft.language}
          options={LANGUAGE_OPTIONS}
          getLabel={(option) => t(`lang.${option}`)}
          onChange={setField('language')}
        />
      </div>

      <div className="u-mt-3">
        <TextAreaField
          label={t('bank.fieldQuestion')}
          value={draft.text}
          onChange={setField('text')}
        />
      </div>

      <div className="u-mt-3">
        <AnswerFields type={draft.type} answer={draft.answer} onChange={setField('answer')} />
      </div>

      <Callout tone="info">{t('bank.sourceNote')}</Callout>

      <Button variant="primary" onClick={submit} disabled={pending}>
        {pending ? t('common.saving') : t('bank.saveDraft')}
      </Button>
    </Modal>
  );
}

NewQuestionDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  pending: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
