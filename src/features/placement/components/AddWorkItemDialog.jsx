import { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, TextField } from '@/shared/components/ui';
import { WORK_ITEM_KIND } from '@/shared/constants/domain';
import { useI18n } from '@/shared/i18n/I18nProvider';

/** Attaches a quiz (session only, at most one) or an assignment (any level). */
export default function AddWorkItemDialog({ target, pending, onClose, onSubmit }) {
  const { t } = useI18n();
  const [name, setName] = useState('');

  if (!target) return null;

  const isQuiz = target.kind === WORK_ITEM_KIND.QUIZ;
  const close = () => {
    setName('');
    onClose();
  };

  const submit = async () => {
    const saved = await onSubmit(name);
    if (!saved) return;
    setName('');
  };

  return (
    <Modal open onClose={close} title={t(isQuiz ? 'work.attachQuizTitle' : 'work.addAssignmentTitle')}>
      <TextField label={t('work.nameLabel')} value={name} onChange={setName} />

      <div className="btn-row u-mt-4">
        <Button variant="primary" onClick={submit} disabled={pending || name.trim().length === 0}>
          {pending ? t('common.saving') : t('common.save')}
        </Button>
        <Button variant="ghost" onClick={close} disabled={pending}>
          {t('common.cancel')}
        </Button>
      </div>
    </Modal>
  );
}

AddWorkItemDialog.propTypes = {
  target: PropTypes.shape({
    placementId: PropTypes.string,
    kind: PropTypes.oneOf(Object.values(WORK_ITEM_KIND)),
  }),
  pending: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
