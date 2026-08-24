import { useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { useI18n } from '@/shared/i18n/I18nProvider';
import { useFocusTrap } from './useFocusTrap';
import { useLockedScroll } from './useLockedScroll';

export default function Modal({ open, onClose, title, children }) {
  const { t } = useI18n();
  const panelRef = useRef(null);
  const titleId = useId();

  useFocusTrap(panelRef, { active: open, onEscape: onClose });
  useLockedScroll(open);

  if (!open) return null;

  const closeOnBackdrop = (event) => {
    if (event.target === event.currentTarget) onClose();
  };

  return createPortal(
    // The backdrop is a convenience for pointer users; Escape and the close
    // button cover keyboard users, so no extra role is needed here.
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
    <div className="modal-bg" onMouseDown={closeOnBackdrop}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1} ref={panelRef}>
        <div className="modal__head">
          <h3 id={titleId}>{title}</h3>
          <button type="button" className="modal__close" onClick={onClose} aria-label={t('common.close')}>
            ×
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
}

Modal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
};
