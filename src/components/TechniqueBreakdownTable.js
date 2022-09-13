import React from "react";
import { formatPercent } from "../utils";
import styles from "./styles/TechniqueBreakdownTable.module.css";

const TechniqueBreakdownTable = ({ data = {} }) => {
  const headers = Object.keys(data?.[0] || {});
  return (
    <table className={styles.technique_breakdown_table}>
      <thead>
        <tr>
          {headers.map((header) => {
            return (
              <th key={header}>
                {header
                  .split("_")
                  .map((word) =>
                    word.charAt(0).toUpperCase().concat(word.slice(1))
                  )
                  .join(" ")}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {data.map((entry) => {
          const keyBase = entry.technique || entry.technique_category;
          return (
            <tr key={`${keyBase}-row`}>
              {headers.map((header, j) => {
                const value = entry[header];
                if (header === "percent") {
                  return (
                    <td key={`${keyBase}-${j}`}>{formatPercent(value)}</td>
                  );
                } else if (header === "technique_category") {
                  return (
                    <td
                      key={`${keyBase}-${j}`}
                      className={`${styles.technique_category}`}
                    >
                      <div className={styles[value] || styles.uncategorized}>
                        {value || "uncategorized"}
                      </div>
                    </td>
                  );
                } else {
                  return <td key={`${keyBase}-${j}`}>{value}</td>;
                }
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default TechniqueBreakdownTable;
