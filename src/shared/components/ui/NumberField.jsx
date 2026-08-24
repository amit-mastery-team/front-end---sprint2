import PropTypes from 'prop-types';
import Field from './Field';

export default function NumberField({ label, hint, value, min = 1, onChange }) {
  return (
    <Field label={label} hint={hint}>
      {(fieldProps) => (
        <input
          {...fieldProps}
          type="number"
          min={min}
          value={value ?? ''}
          onChange={(event) => onChange(Number(event.target.value))}
        />
      )}
    </Field>
  );
}

NumberField.propTypes = {
  label: PropTypes.string.isRequired,
  hint: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  min: PropTypes.number,
  onChange: PropTypes.func.isRequired,
};
