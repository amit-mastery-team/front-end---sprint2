import PropTypes from 'prop-types';
import Field from './Field';

/** A labelled single-line text input for anything NumberField/TextAreaField don't fit. */
export default function TextField({ label, hint, value, type = 'text', autoComplete, onChange }) {
  return (
    <Field label={label} hint={hint}>
      {(fieldProps) => (
        <input
          {...fieldProps}
          type={type}
          autoComplete={autoComplete}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </Field>
  );
}

TextField.propTypes = {
  label: PropTypes.string.isRequired,
  hint: PropTypes.string,
  value: PropTypes.string.isRequired,
  type: PropTypes.string,
  autoComplete: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};
