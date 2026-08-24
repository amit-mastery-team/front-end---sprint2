import { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Callout, Modal, TextField } from '@/shared/components/ui';
import { useI18n } from '@/shared/i18n/I18nProvider';

/**
 * Step-up authentication for Academic Administrator / System Administrator.
 * The password step already happened (demo role selection); this is the
 * time-based code that must follow it before the role switch takes effect.
 */
export default function MfaChallengeDialog({ open, roleLabel, pending, error, onVerify, onCancel }) {
  const { t } = useI18n();
  const [code, setCode] = useState('');

  if (!open) return null;

  const close = () => {
    setCode('');
    onCancel();
  };

  const submit = async () => {
    const verified = await onVerify(code);
    if (verified) setCode('');
  };

  return (
    <Modal open={open} onClose={close} title={t('security.mfaTitle', { role: roleLabel })}>
      <p>{t('security.mfaBody', { role: roleLabel })}</p>

      <TextField
        label={t('security.mfaCodeLabel')}
        hint={t('security.mfaHint')}
        type="text"
        autoComplete="one-time-code"
        value={code}
        onChange={setCode}
      />

      {error ? <Callout tone="bad">{error}</Callout> : null}

      <div className="btn-row u-mt-4">
        <Button variant="primary" onClick={submit} disabled={pending || code.length === 0}>
          {pending ? t('common.saving') : t('security.mfaSubmit')}
        </Button>
        <Button variant="ghost" onClick={close} disabled={pending}>
          {t('common.cancel')}
        </Button>
      </div>
    </Modal>
  );
}

MfaChallengeDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  roleLabel: PropTypes.string,
  pending: PropTypes.bool,
  error: PropTypes.string,
  onVerify: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};
