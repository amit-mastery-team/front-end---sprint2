import PropTypes from 'prop-types';

export default function Metric({ value, unit }) {
  return (
    <div className="metric">
      {value} {unit ? <small>{unit}</small> : null}
    </div>
  );
}

Metric.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  unit: PropTypes.string,
};
