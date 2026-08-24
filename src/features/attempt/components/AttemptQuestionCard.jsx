import PropTypes from 'prop-types';
import { Badge, Button, Card } from '@/shared/components/ui';
import { useI18n } from '@/shared/i18n/I18nProvider';
import AnswerChoices from './AnswerChoices';
import AttemptTimer from './AttemptTimer';

export default function AttemptQuestionCard({
  attempt,
  timer,
  choice,
  locked,
  saving,
  submitting,
  onChoose,
  onSave,
  onDisconnect,
  onSubmit,
}) {
  const { t, tx } = useI18n();
  const prompt = tx(attempt.question.text);

  return (
    <Card>
      <div className="spread">
        <div>
          <Badge tone="red">{t(`assessmentType.${attempt.assessmentType}`)}</Badge>
          <h3 className="u-mt-2">{tx(attempt.assessmentTitle)}</h3>
        </div>
        <AttemptTimer label={timer.label} isLow={timer.isLow} />
      </div>

      <hr />

      <p className="attempt__position">
        {t('attempt.questionOf', { current: attempt.currentIndex, total: attempt.totalQuestions })}
      </p>
      <p className="prompt">{prompt}</p>

      <AnswerChoices
        legend={prompt}
        options={attempt.question.options}
        value={choice}
        disabled={locked}
        onChange={onChoose}
      />

      <div className="btn-row u-mt-4">
        <Button variant="primary" onClick={onSave} disabled={locked || saving}>
          {t('attempt.saveNext')}
        </Button>
        <Button onClick={onDisconnect} disabled={attempt.submitted}>
          {t('attempt.disconnect')}
        </Button>
        <Button variant="danger" onClick={onSubmit} disabled={attempt.submitted || submitting}>
          {t('attempt.submit')}
        </Button>
      </div>
    </Card>
  );
}

AttemptQuestionCard.propTypes = {
  attempt: PropTypes.object.isRequired,
  timer: PropTypes.shape({ label: PropTypes.string, isLow: PropTypes.bool }).isRequired,
  choice: PropTypes.string,
  locked: PropTypes.bool,
  saving: PropTypes.bool,
  submitting: PropTypes.bool,
  onChoose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onDisconnect: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
