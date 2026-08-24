import PropTypes from 'prop-types';

export default function Card({ title, headerSlot, children, className = '' }) {
  return (
    <section className={`card ${className}`.trim()}>
      {headerSlot}
      {title ? <h3>{title}</h3> : null}
      {children}
    </section>
  );
}

Card.propTypes = {
  title: PropTypes.node,
  /** Rendered above the title — used for a badge or a status line. */
  headerSlot: PropTypes.node,
  children: PropTypes.node,
  className: PropTypes.string,
};
