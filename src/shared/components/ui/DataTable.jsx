import PropTypes from 'prop-types';

/**
 * Declarative table: describe the columns once, pass the rows.
 * Keeps thead/tbody markup out of every feature.
 */
export default function DataTable({ caption, columns, rows, getRowKey }) {
  return (
    <div className="table-wrap">
      <table>
        <caption className="visually-hidden">{caption}</caption>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} scope="col">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={getRowKey(row, rowIndex)}>
              {columns.map((column) => (
                <td key={column.key} className={column.cellClassName}>
                  {column.render(row, rowIndex)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

DataTable.propTypes = {
  caption: PropTypes.string.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      header: PropTypes.node.isRequired,
      render: PropTypes.func.isRequired,
      cellClassName: PropTypes.string,
    }),
  ).isRequired,
  rows: PropTypes.array.isRequired,
  getRowKey: PropTypes.func.isRequired,
};
