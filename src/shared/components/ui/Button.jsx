import PropTypes from 'prop-types';

const VARIANTS = ['primary', 'secondary', 'danger', 'ghost'];

export default function Button({ variant = 'secondary', type = 'button', className = '', ...rest }) {
  return <button type={type} className={`btn btn--${variant} ${className}`.trim()} {...rest} />;
}

Button.propTypes = {
  variant: PropTypes.oneOf(VARIANTS),
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  className: PropTypes.string,
};
