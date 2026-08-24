import PropTypes from 'prop-types';

export default function SectionTitle({ children, note }) {
  return (
    <div className="section-title">
      <h2>{children}</h2>
      {note ? <span>{note}</span> : null}
    </div>
  );
}

SectionTitle.propTypes = {
  children: PropTypes.node.isRequired,
  note: PropTypes.string,
};
