import React from "react";
import { formatPercent } from "../utils";
import styles from "./styles/TechniqueBreakdownTable.module.css";

const TechniqueBreakdownTable = ({ data = {} }) => {
  console.log("data: ", data);
  const headers = Object.keys(data?.[0] || {});
  console.log("headers: ", headers);
  return (
    <table className={styles.technique_breakdown_table}>
      <thead>
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
      </thead>
      <tbody>
        {data.map((entry, i) => {
          return (
            <tr key={i}>
              {headers.map((header) => {
                const value = entry[header];
                if (header === "percent") {
                  return <td>{formatPercent(value)}</td>;
                } else if (header === "technique_category") {
                  return (
                    <td
                      className={`${styles.technique_category} ${styles[value]}`}
                    >
                      {value}
                    </td>
                  );
                } else {
                  return <td>{value}</td>;
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
