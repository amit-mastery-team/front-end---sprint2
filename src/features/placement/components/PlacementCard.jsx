import PropTypes from 'prop-types';
import { Badge, Button, Card, StatusBadge } from '@/shared/components/ui';
import { ACADEMIC_LEVEL } from '@/shared/constants/domain';
import { LEVEL_TONE } from '@/shared/constants/ui';
import { useI18n } from '@/shared/i18n/I18nProvider';

export default function PlacementCard({ placement, onOpen, onAttachQuiz, onAddAssignment }) {
  const { t, tx } = useI18n();
  const title = tx(placement.title);
  const isSession = placement.level === ACADEMIC_LEVEL.SESSION;

  return (
    <Card
      title={title}
      headerSlot={
        <Badge tone={LEVEL_TONE[placement.level] ?? 'info'}>{t(`work.level.${placement.level}`)}</Badge>
      }
    >
      {isSession ? (
        <div className="spread">
          <p>
            {t('work.quiz')}: {placement.quiz ? tx(placement.quiz.name) : t('work.noQuiz')}
          </p>
          {placement.quiz ? (
            <StatusBadge status={placement.quiz.status} />
          ) : (
            <Button onClick={() => onAttachQuiz(placement.id)}>{t('work.attachQuiz')}</Button>
          )}
        </div>
      ) : null}

      <p className="u-mt-2">
        <b>{t('work.assignments')}</b>
      </p>
      {placement.assignments.length > 0 ? (
        <ul className="list list--plain">
          {placement.assignments.map((assignment) => (
            <li className="list-item" key={assignment.id}>
              <span>{tx(assignment.name)}</span>
              <StatusBadge status={assignment.status} />
            </li>
          ))}
        </ul>
      ) : null}

      <p>{tx(placement.note)}</p>

      <div className="btn-row">
        <Button onClick={() => onOpen(title)}>{t('common.open')}</Button>
        <Button variant="ghost" onClick={() => onAddAssignment(placement.id)}>
          {t('work.addAssignment')}
        </Button>
      </div>
    </Card>
  );
}

PlacementCard.propTypes = {
  placement: PropTypes.object.isRequired,
  onOpen: PropTypes.func.isRequired,
  onAttachQuiz: PropTypes.func.isRequired,
  onAddAssignment: PropTypes.func.isRequired,
};
