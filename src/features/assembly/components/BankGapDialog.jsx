import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Button, Callout, Modal } from '@/shared/components/ui';
import { PATH } from '@/app/paths';
import { useI18n } from '@/shared/i18n/I18nProvider';

/** Names the exact shortfall — assembly never substitutes silently. */
export default function BankGapDialog({ gap, onClose }) {
  const { t } = useI18n();
  const navigate = useNavigate();

  if (!gap) return null;

  const detail = t('assembly.gapDetail', {
    topic: t(`topics.${gap.topic}`),
    difficulty: t(`difficulty.${gap.difficulty}`),
    missing: gap.missing,
  });

  const goToQueue = () => {
    onClose();
    navigate(PATH.REVIEW);
  };

  return (
    <Modal open onClose={onClose} title={t('assembly.gapTitle')}>
      <Callout tone="bad">{detail}</Callout>
      <p>{t('assembly.gapBody')}</p>
      <Button variant="primary" onClick={goToQueue}>
        {t('assembly.openQueue')}
      </Button>
    </Modal>
  );
}

BankGapDialog.propTypes = {
  gap: PropTypes.shape({
    topic: PropTypes.string,
    difficulty: PropTypes.string,
    missing: PropTypes.number,
  }),
  onClose: PropTypes.func.isRequired,
};
