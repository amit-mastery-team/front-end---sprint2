import { useState } from 'react';
import { useI18n } from '@/shared/i18n/I18nProvider';
import { useRole } from '@/shared/context/RoleProvider';
import { useToast } from '@/shared/context/ToastProvider';
import { useMutation } from '@/shared/hooks/useMutation';
import { api } from '@/shared/api';
import { ROLE_OPTIONS, requiresMfa } from '@/shared/constants/roles';
import MfaChallengeDialog from './MfaChallengeDialog';

export default function RoleSelect() {
  const { t } = useI18n();
  const { role, setRole } = useRole();
  const { notify, notifyFailure } = useToast();

  // The role the user is stepping up into; only set while an MFA challenge is open.
  const [pendingRole, setPendingRole] = useState(null);
  const [mfaError, setMfaError] = useState(null);

  const switchTo = (nextRole) => {
    setRole(nextRole);
    notify(t('roles.switched', { role: t(`roles.${nextRole}`) }));
  };

  const handleChange = (event) => {
    const nextRole = event.target.value;
    if (requiresMfa(nextRole)) {
      setMfaError(null);
      setPendingRole(nextRole);
      return;
    }
    switchTo(nextRole);
  };

  const verify = useMutation((code) => api.verifyMfaCode(pendingRole, code), {
    onSuccess: () => {
      switchTo(pendingRole);
      setPendingRole(null);
      setMfaError(null);
    },
    onError: (failure) => {
      setMfaError(failure.message);
      notifyFailure(failure.message);
    },
  });

  const cancel = () => {
    setPendingRole(null);
    setMfaError(null);
  };

  return (
    <>
      <label className="visually-hidden" htmlFor="role-select">
        {t('roles.label')}
      </label>
      <select id="role-select" className="select-control" value={role} onChange={handleChange}>
        {ROLE_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {t(`roles.${option}`)}
          </option>
        ))}
      </select>

      <MfaChallengeDialog
        open={pendingRole !== null}
        roleLabel={pendingRole ? t(`roles.${pendingRole}`) : ''}
        pending={verify.pending}
        error={mfaError}
        onVerify={async (code) => Boolean(await verify.run(code))}
        onCancel={cancel}
      />
    </>
  );
}
