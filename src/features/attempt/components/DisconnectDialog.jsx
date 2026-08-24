import PropTypes from 'prop-types';
import { Button, Callout, Modal } from '@/shared/components/ui';
import { useI18n } from '@/shared/i18n/I18nProvider';

export default function DisconnectDialog({ open, onClose, onReconnect }) {
  const { t } = useI18n();

  return (
    <Modal open={open} onClose={onClose} title={t('attempt.disconnectTitle')}>
      <Callout tone="warn">{t('attempt.disconnectBody')}</Callout>
      <Button variant="primary" onClick={onReconnect}>
        {t('attempt.reconnect')}
      </Button>
    </Modal>
  );
}

DisconnectDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onReconnect: PropTypes.func.isRequired,
};
