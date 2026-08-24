import PropTypes from 'prop-types';
import { useI18n } from '@/shared/i18n/I18nProvider';

export default function AnswerChoices({ legend, options, value, disabled, onChange }) {
  const { tx } = useI18n();

  return (
    <fieldset className="choices">
      <legend className="visually-hidden">{legend}</legend>
      {options.map((option) => (
        <label className="list-item list-item--start choice" key={option.id}>
          <input
            type="radio"
            name="answer"
            value={option.id}
            checked={value === option.id}
            disabled={disabled}
            onChange={() => onChange(option.id)}
          />
          <span className="choice__label">{tx(option.label)}</span>
        </label>
      ))}
    </fieldset>
  );
}

AnswerChoices.propTypes = {
  legend: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  value: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
};
