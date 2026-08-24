import PropTypes from 'prop-types';
import Field from './Field';

/** A labelled select over a list of codes, with labels resolved by the caller. */
export default function SelectField({ label, hint, value, options, getLabel, onChange, disabled }) {
  return (
    <Field label={label} hint={hint}>
      {(fieldProps) => (
        <select {...fieldProps} value={value} disabled={disabled} onChange={(event) => onChange(event.target.value)}>
          {options.map((option) => (
            <option key={option} value={option}>
              {getLabel(option)}
            </option>
          ))}
        </select>
      )}
    </Field>
  );
}

SelectField.propTypes = {
  label: PropTypes.string.isRequired,
  hint: PropTypes.string,
  value: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  getLabel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};
