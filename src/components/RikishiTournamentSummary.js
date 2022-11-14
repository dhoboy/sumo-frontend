import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LOADING, FAILED } from "../constants.js";
import DisplayTable from "../components/DisplayTable";
import PropTypes from "prop-types";
import Loader from "../components/Loader";
import { monthMap } from "../utils";
import styles from "./styles/RikishiTournamentSummary.module.css";
import {
  fetchTournamentSummary,
  selectTournamentSummary,
  selectTournamentSummaryStatus,
  selectTournamentSummaryErrorMsg,
} from "../stores/rikishiTournamentSummarySlice";

const prop_info = {
  year: PropTypes.number.isRequired,
  month: PropTypes.number.isRequired,
  rikishiSearchText: PropTypes.string, // optional filter text of rikishi to show
};

const RikishiTournamentSummary = ({ year, month, rikishiSearchText = "" }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const status = useSelector((state) =>
    selectTournamentSummaryStatus(state, { year, month })
  );
  const errorMsg = useSelector((state) =>
    selectTournamentSummaryErrorMsg(state, { year, month })
  );
  const data = useSelector((state) =>
    selectTournamentSummary(state, { year, month })
  );

  // TODO: Update to add status condition here
  useEffect(() => {
    if (!data) dispatch(fetchTournamentSummary({ year, month }));
  }, [data, dispatch, month, year]);

  const tableReadyData = (data || [])
    .map((d) => ({
      ...d,
      ...d.results,
    }))
    .filter(({ rikishi }) => {
      const regex = new RegExp(`^${rikishiSearchText}`, "i");
      return regex.test(rikishi);
    });

  const headers = [
    {
      colKey: "rikishi",
      display: "Rikishi",
      sortType: "string",
      linkFn: (name) => navigate(`/rikishi/${name}`),
    },
    {
      colKey: "rank",
      display: "Rank",
      sortKey: "rank_value",
      sortType: "number",
    },
    {
      colKey: "wins",
      display: "Wins",
      sortType: "number",
    },
    {
      colKey: "losses",
      display: "Losses",
      sortType: "number",
    },
    {
      colKey: "result",
      display: "Result",
      sortType: "string",
    },
  ];

  return (
    <Loader
      loading={status === LOADING}
      error={status === FAILED}
      errorMsg={errorMsg}
    >
      <div className={styles.tournamentSummary}>
        <h3 className={styles.h3}>
          <Link to={`/tournaments/${year}/${month}/1`}>
            {`${monthMap[month]} ${year}`}
          </Link>
        </h3>
        <div className={styles.tableWrapper}>
          <DisplayTable headers={headers} data={tableReadyData} canSort />
        </div>
      </div>
    </Loader>
  );
};

RikishiTournamentSummary.propTypes = prop_info;

export default RikishiTournamentSummary;
