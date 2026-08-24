import { createContext, useContext, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { ROLE, canApproveQuestions, requiresMfa } from '@/shared/constants/roles';

const RoleContext = createContext(null);

const initialsFor = (role) => (role === ROLE.STUDENT ? 'ST' : 'AM');

/** Holds the demo role and derives the permissions the screens gate on. */
export function RoleProvider({ initialRole = ROLE.INSTRUCTOR, children }) {
  const [role, setRole] = useState(initialRole);

  const value = useMemo(
    () => ({
      role,
      setRole,
      canApprove: canApproveQuestions(role),
      mfaRequired: requiresMfa(role),
      initials: initialsFor(role),
    }),
    [role],
  );

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

RoleProvider.propTypes = {
  initialRole: PropTypes.string,
  children: PropTypes.node,
};

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) throw new Error('useRole must be used inside <RoleProvider>');
  return context;
}
