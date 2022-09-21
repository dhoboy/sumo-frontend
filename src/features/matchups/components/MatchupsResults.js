import React from "react";
import styles from "./MatchupsResults.module.css";

// TODO: Continue styling these results
const MatchupsResults = ({ rikishi, opponent, matchupData }) => {
  // data hasn't been fetched yet for rikishi and opponent
  if (!matchupData) return null;

  // const headers = Object.keys(data.matchups?.[0] || {});
  const headers = ["rikishi", "year", "month", "day", "opponent"];

  const data = (matchupData || []).reduce(
    (acc, next) => {
      const { winner, year, month, day } = next;
      acc.matchups = acc.matchups.concat({
        rikishi,
        opponent,
        winner,
        year,
        month,
        day,
      });
      acc.totals[next.winner] += 1;
      return acc;
    },
    { totals: { [rikishi]: 0, [opponent]: 0 }, matchups: [] }
  );

  // rikishi and opponent have never faced each other
  if (!data.matchups.length) {
    return (
      <div className={styles.container}>
        <h2>No Matchup History</h2>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.totals}>
        <h2>{data?.totals?.[rikishi]}</h2>
        <h2>{data?.totals?.[opponent]}</h2>
      </div>
      <table className={styles.matchupsTable}>
        <thead>
          <tr>
            {headers.map((header) => {
              return <th key={header}>{header}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {data?.matchups?.map((row) => {
            return (
              <tr key={Math.random().toString(36)}>
                {headers.map((key) => {
                  if (key === "rikishi" && row.winner === rikishi) {
                    return <td>O</td>;
                  } else if (key === "rikishi") {
                    return <td></td>;
                  }

                  if (key === "opponent" && row.winner === opponent) {
                    return <td>O</td>;
                  } else if (key === "opponent") {
                    return <td></td>;
                  }

                  return <td>{row[key]}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default MatchupsResults;
