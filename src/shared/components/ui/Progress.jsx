import PropTypes from 'prop-types';

export default function Progress({ label, percent }) {
  return (
    <div>
      {label ? (
        <div className="progress__label">
          <span>{label}</span>
          <span>{percent}%</span>
        </div>
      ) : null}
      <div
        className="progress"
        role="progressbar"
        aria-label={label}
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <span className="progress__bar" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

Progress.propTypes = {
  label: PropTypes.string,
  percent: PropTypes.number.isRequired,
};
