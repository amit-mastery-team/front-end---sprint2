import { useId } from 'react';
import PropTypes from 'prop-types';

/**
 * Owns the label/control association so callers never hand-roll matching ids.
 * `children` is a render function receiving the generated id.
 */
export default function Field({ label, hint, children }) {
  const id = useId();
  const hintId = `${id}-hint`;

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {children({ id, 'aria-describedby': hint ? hintId : undefined })}
      {hint ? (
        <div className="field__hint" id={hintId}>
          {hint}
        </div>
      ) : null}
    </div>
  );
}

Field.propTypes = {
  label: PropTypes.string.isRequired,
  hint: PropTypes.string,
  children: PropTypes.func.isRequired,
};
