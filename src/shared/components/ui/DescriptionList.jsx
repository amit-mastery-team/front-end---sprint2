import PropTypes from 'prop-types';

/** Key/value pairs rendered as a real description list. */
export default function DescriptionList({ items }) {
  return (
    <dl className="kv">
      {items.map((item) => (
        <div className="kv__row" key={item.key}>
          <dt>{item.term}</dt>
          <dd>{item.description}</dd>
        </div>
      ))}
    </dl>
  );
}

DescriptionList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      term: PropTypes.node.isRequired,
      description: PropTypes.node,
    }),
  ).isRequired,
};
