import React from "react";
import { useSelector, shallowEqual } from "react-redux";
import PropTypes from "prop-types";
import { useSearchParams } from "react-router-dom";
import { selectRikishiPhotos } from "../stores/rikishiInfoSlice";
import styles from "./styles/DisplayTable.module.css";

const prop_info = {
  headers: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  canSort: PropTypes.bool, // pass true if the table is allowed to sort
  withPhoto: PropTypes.bool, // if photo should be drawn with rikishi name columns (name, east, west)
};

const DisplayTable = ({ headers, data, canSort = false, withPhoto = true }) => {
  const rikishiPhotos = useSelector(selectRikishiPhotos, shallowEqual);
  const [searchParams, setSearchParams] = useSearchParams();
  const sort = canSort ? searchParams.get("sort") || "rank_value" : false;
  const dir = searchParams.get("dir") || "desc"; // or asc

  const onHeaderClick = (colKey) => {
    searchParams.set("sort", colKey);
    searchParams.set("dir", dir === "asc" ? "desc" : "asc");
    setSearchParams(searchParams);
  };

  // sorts by strings, numbers, and dates; default sort is by strings
  // date sort takes in either date strings or date objects
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
          const aDate = aVal instanceof Date ? aVal : new Date(aVal);
          const bDate = bVal instanceof Date ? bVal : new Date(bVal);
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
                className={`${styles.th} ${canSort ? styles.sortable : ""} `}
                onClick={() => canSort && onHeaderClick(header.colKey)}
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

                const imageUrl = rikishiPhotos?.[entry[colKey]] || null;
                const drawPhoto = withPhoto && imageUrl;

                return (
                  <td
                    onClick={handleClick}
                    className={`${styles.td} ${
                      drawPhoto ? styles.withImage : ""
                    } ${linkFn ? styles.clickable : ""}`}
                    key={`td-${j}`}
                  >
                    {drawPhoto ? (
                      <img src={imageUrl} alt="rikishi" loading="lazy" />
                    ) : null}
                    <span className={linkFn ? styles.clickable : ""}>
                      {entry[colKey]}
                    </span>
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
