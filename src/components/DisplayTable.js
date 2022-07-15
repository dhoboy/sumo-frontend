import React from "react";
import PropTypes from "prop-types";
import styles from "./styles/DisplayTable.module.css";

const prop_info = {
  headers: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
};

const DisplayTable = ({ headers, data }) => {
  // TODO: add sort to url
  const sort = undefined;
  const dir = "TODO";

  const onHeaderClick = () => {};

  // sorts by strings, numbers, and dates; default sort is by strings
  const displayData = sort
    ? data.sort((a, b) => {
        const header = headers.find((h) => h.colKey === sort);
        const sortKey = header?.sortKey || header?.colKey;
        const sortType = header?.sortType;

        const aVal = a[sortKey];
        const bVal = b[sortKey];

        if (sortType === "number") {
          return dir === "asc" ? aVal - bVal : bVal - aVal;
        } else if (sortType === "date") {
          const aDate = new Date(aVal);
          const bDate = new Date(bVal);
          return dir === "asc" ? aDate - bDate : bDate - aDate;
        } else {
          return dir === "asc"
            ? aVal?.localeCompare(bVal)
            : bVal?.localeCompare(aVal);
        }
      })
    : data;

  return (
    <table className={styles.table}>
      <thead className={styles.thead}>
        <tr>
          {headers.map((header) => {
            return (
              <th
                key={header.colKey}
                className={styles.th}
                onClick={onHeaderClick(header.colKey)}
              >
                {header.display}
                {sort === header.colKey && dir === "asc" && (
                  <span>
                    <i key="asc" className="fas fa-sort-alpha-up" />
                  </span>
                )}
                {sort === header.colKey && dir === "desc" && (
                  <span>
                    <i key="desc" className="fas fa-sort-alpha-down-alt" />
                  </span>
                )}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {displayData.map((entry, i) => {
          return (
            <tr key={`tr-${i}`}>
              {headers.map(({ colKey, linkFn }, j) => {
                const handleClick = () => {
                  if (linkFn) linkFn(entry[colKey]);
                };

                return (
                  <td
                    onClick={handleClick}
                    className={styles.td}
                    key={`td-${j}`}
                  >
                    {entry[colKey]}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

DisplayTable.propTypes = prop_info;

export default DisplayTable;
