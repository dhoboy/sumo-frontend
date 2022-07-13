import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IDLE, LOADING, SUCCESS, FAILED } from "../constants.js";
import {
  fetchTournamentSummary,
  selectTournamentSummary,
  selectTournamentSummaryStatus,
  selectTournamentSummaryErrorMsg,
} from "../stores/rikishiTournamentSummarySlice";
import DisplayTable from "../components/DisplayTable.js";
import PropTypes from "prop-types";
import styles from "./styles/RikishiTournamentSummary.module.css";

const prop_info = {
  year: PropTypes.number.isRequired,
  month: PropTypes.number.isRequired,
};

const RikishiTournamentSummary = ({ year, month }) => {
  const dispatch = useDispatch();
  const status = useSelector(selectTournamentSummaryStatus);
  const errorMsg = useSelector(selectTournamentSummaryErrorMsg);
  const data = useSelector((state) =>
    selectTournamentSummary(state, { year, month })
  );

  useEffect(() => {
    if (!data) dispatch(fetchTournamentSummary({ year, month }));
  }, [data, dispatch, month, year]);

  const tableReadyData = data?.map((d) => ({
    ...d,
    ...d.results,
  }));

  const name = "bababa";
  const headers = [
    {
      colKey: "rikishi",
      display: "Rikishi",
      sortType: "string",
      linkFn: `/rikishi/${name}`,
    },
    {
      colKey: "rank",
      display: "Rank",
      sortKey: "rank_value",
      sortType: "number",
    },
    { colKey: "wins", display: "Wins", sortType: "number" },
    { colKey: "losses", display: "Losses", sortType: "number" },
    { colKey: "result", display: "Result", sortType: "string" },
  ];

  return (
    <div className={styles.wrapper}>
      {status === LOADING ? "loading!" : null}
      {status === SUCCESS && data?.length ? (
        <DisplayTable headers={headers} data={tableReadyData} />
      ) : null}
    </div>
  );
};

RikishiTournamentSummary.propTypes = prop_info;

export default RikishiTournamentSummary;
