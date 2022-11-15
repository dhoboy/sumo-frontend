import React, { useState, useRef, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { monthMap, smallMonthMap } from "../../../utils";
import Dropdown from "../../../components/Dropdown";
import { WinSizeContext } from "../../../App";
import styles from "./styles/MatchupsResults.module.css";

const prop_info = {
  rikishi: PropTypes.string,
  opponent: PropTypes.string,
  matchupData: PropTypes.arrayOf(
    PropTypes.shape({
      day: PropTypes.number,
      east: PropTypes.string,
      east_rank: PropTypes.string,
      east_rank_value: PropTypes.number,
      id: PropTypes.number,
      is_playoff: PropTypes.bool,
      loser: PropTypes.string,
      month: PropTypes.string,
      technique: PropTypes.string,
      technique_category: PropTypes.string,
      technique_en: PropTypes.string,
      west: PropTypes.string,
      west_rank: PropTypes.string,
      west_rank_value: PropTypes.number,
      winner: PropTypes.string,
      year: PropTypes.number,
    })
  ),
};

const MatchupsResults = ({ rikishi, opponent, matchupData }) => {
  const el = useRef(null);
  const { winWidth } = useContext(WinSizeContext);
  const [displayKey, setDisplayKey] = useState("technique");

  useEffect(() => {
    if (matchupData) {
      el?.current?.scrollIntoView();
    }
  }, [matchupData]);

  const dropdownOptions = [
    { label: "Technique", value: "technique" },
    { label: "Tech. Description", value: "technique_en" },
    { label: "Tech. Category", value: "technique_category" },
  ];

  const onDropdownChange = (value) => setDisplayKey(value);

  const headers = ["rikishi", "date", "opponent"];

  const data = (matchupData || []).reduce(
    (acc, next) => {
      const {
        winner,
        year,
        month,
        day,
        technique,
        technique_en,
        technique_category,
      } = next;

      acc.matchups = acc.matchups.concat({
        rikishi,
        opponent,
        winner,
        technique,
        technique_en,
        technique_category: technique_category || "uncategorized",
        year,
        month,
        day,
      });
      acc.totals[next.winner] += 1;
      return acc;
    },
    { totals: { [rikishi]: 0, [opponent]: 0 }, matchups: [] }
  );

  // data hasn't been fetched yet for rikishi and opponent
  if (!matchupData) return null;

  // rikishi and opponent have never faced each other
  if (!data.matchups.length) {
    return (
      <div className={styles.container}>
        <h2>No Matchup History</h2>
      </div>
    );
  }

  return (
    <div ref={el} className={styles.container}>
      <table className={styles.matchupsTable}>
        <thead>
          <tr>
            {headers.map((header) => {
              if (header === "rikishi") {
                return (
                  <th key={header} className={styles.rikishiName}>
                    <h2>{rikishi}</h2>
                    <h2>{data?.totals?.[rikishi]}</h2>
                  </th>
                );
              } else if (header === "opponent") {
                return (
                  <th key={header} className={styles.rikishiName}>
                    <h2>{opponent}</h2>
                    <h2>{data?.totals?.[opponent]}</h2>
                  </th>
                );
              }
              // displaying a results type dropdown above date column
              return (
                <th key={header} className={styles.resultType}>
                  <Dropdown
                    label="Result Type:"
                    options={dropdownOptions}
                    selected={displayKey}
                    onChange={onDropdownChange}
                    fontSize="14px"
                    className="resultTypeDropdown"
                  />
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {data?.matchups
            ?.sort((a, b) => {
              return (
                new Date(b.year, b.month, b.day) -
                new Date(a.year, a.month, a.day)
              );
            })
            .map((row) => {
              return (
                <tr key={Math.random().toString(36)}>
                  {headers.map((key) => {
                    if (key === "rikishi" && row.winner === rikishi) {
                      return (
                        <td
                          key={Math.random().toString(36)}
                          className={styles.technique_category_row}
                        >
                          <div className={styles[row.technique_category]}>
                            {row[displayKey]}
                          </div>
                        </td>
                      );
                    } else if (key === "rikishi") {
                      return <td key={Math.random().toString(36)}></td>;
                    }

                    if (key === "opponent" && row.winner === opponent) {
                      return (
                        <td
                          key={Math.random().toString(36)}
                          className={styles.technique_category_row}
                        >
                          <div
                            className={
                              styles[row.technique_category || "uncategorized"]
                            }
                          >
                            {row[displayKey]}
                          </div>
                        </td>
                      );
                    } else if (key === "opponent") {
                      return <td key={Math.random().toString(36)}></td>;
                    }

                    // date
                    return (
                      <td
                        className={styles.dateEntry}
                        key={Math.random().toString(36)}
                      >
                        {`${
                          winWidth <= 768
                            ? smallMonthMap[row.month]
                            : monthMap[row.month]
                        } ${row.year}`}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

MatchupsResults.propTypes = prop_info;

export default MatchupsResults;
