import PropTypes from 'prop-types';

const TONES = ['info', 'warn', 'bad', 'ok'];

export default function Callout({ tone = 'info', title, children }) {
  return (
    <div className={`callout callout--${tone}`}>
      {title ? <b>{title} </b> : null}
      {children}
    </div>
  );
}

Callout.propTypes = {
  tone: PropTypes.oneOf(TONES),
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
};
