import PropTypes from 'prop-types';
import Field from './Field';

export default function TextAreaField({ label, hint, value, onChange }) {
  return (
    <Field label={label} hint={hint}>
      {(fieldProps) => (
        <textarea {...fieldProps} value={value} onChange={(event) => onChange(event.target.value)} />
      )}
    </Field>
  );
}

TextAreaField.propTypes = {
  label: PropTypes.string.isRequired,
  hint: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
