import PropTypes from 'prop-types';
import { NumberField, SelectField, TextAreaField, TextField } from '@/shared/components/ui';
import { QUESTION_TYPE } from '@/shared/constants/domain';
import { useI18n } from '@/shared/i18n/I18nProvider';

const splitLines = (text) =>
  text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

const splitCsv = (text) =>
  text
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const answerPropTypes = {
  answer: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

function ChoiceAnswerFields({ multi, answer, onChange }) {
  const { t } = useI18n();
  const optionsText = (answer.options ?? []).join('\n');
  const correctText = multi ? (answer.correct ?? []).join(', ') : (answer.correct ?? '');

  return (
    <>
      <TextAreaField
        label={t('bank.answerOptions')}
        hint={t('bank.answerOptionsHint')}
        value={optionsText}
        onChange={(value) => onChange({ ...answer, options: splitLines(value) })}
      />
      <TextField
        label={multi ? t('bank.answerCorrectMulti') : t('bank.answerCorrectSingle')}
        hint={t('bank.answerCorrectHint')}
        value={correctText}
        onChange={(value) => onChange({ ...answer, correct: multi ? splitCsv(value) : value })}
      />
    </>
  );
}
ChoiceAnswerFields.propTypes = { multi: PropTypes.bool, ...answerPropTypes };

function BooleanAnswerFields({ answer, onChange }) {
  const { t } = useI18n();
  const value = answer.correct === true ? 'true' : answer.correct === false ? 'false' : '';

  return (
    <SelectField
      label={t('bank.answerCorrectSingle')}
      value={value}
      options={['true', 'false']}
      getLabel={(option) => t(`bank.answerBoolean.${option}`)}
      onChange={(next) => onChange({ ...answer, correct: next === 'true' })}
    />
  );
}
BooleanAnswerFields.propTypes = answerPropTypes;

function ShortAnswerFields({ answer, onChange }) {
  const { t } = useI18n();
  return (
    <TextField
      label={t('bank.answerModel')}
      value={answer.modelAnswer ?? ''}
      onChange={(value) => onChange({ ...answer, modelAnswer: value })}
    />
  );
}
ShortAnswerFields.propTypes = answerPropTypes;

function NumericAnswerFields({ answer, onChange }) {
  const { t } = useI18n();
  return (
    <NumberField
      label={t('bank.answerNumeric')}
      min={-999999}
      value={answer.correct ?? ''}
      onChange={(value) => onChange({ ...answer, correct: value })}
    />
  );
}
NumericAnswerFields.propTypes = answerPropTypes;

function CodeAnswerFields({ answer, onChange }) {
  const { t } = useI18n();
  return (
    <>
      <TextAreaField
        label={t('bank.answerStarterCode')}
        value={answer.starterCode ?? ''}
        onChange={(value) => onChange({ ...answer, starterCode: value })}
      />
      <TextAreaField
        label={t('bank.answerRubric')}
        value={answer.rubric ?? ''}
        onChange={(value) => onChange({ ...answer, rubric: value })}
      />
    </>
  );
}
CodeAnswerFields.propTypes = answerPropTypes;

const FIELDS_BY_TYPE = {
  [QUESTION_TYPE.SINGLE]: (props) => <ChoiceAnswerFields {...props} />,
  [QUESTION_TYPE.MULTIPLE]: (props) => <ChoiceAnswerFields multi {...props} />,
  [QUESTION_TYPE.BOOLEAN]: (props) => <BooleanAnswerFields {...props} />,
  [QUESTION_TYPE.SHORT]: (props) => <ShortAnswerFields {...props} />,
  [QUESTION_TYPE.NUMERIC]: (props) => <NumericAnswerFields {...props} />,
  [QUESTION_TYPE.CODE]: (props) => <CodeAnswerFields {...props} />,
};

/**
 * The answer-key/rubric fields a question needs, switched by type — each
 * supported type stores exactly the data its own grading flow requires.
 */
export default function AnswerFields({ type, answer, onChange }) {
  const render = FIELDS_BY_TYPE[type] ?? FIELDS_BY_TYPE[QUESTION_TYPE.SINGLE];
  return render({ answer, onChange });
}

AnswerFields.propTypes = {
  type: PropTypes.string.isRequired,
  ...answerPropTypes,
};
