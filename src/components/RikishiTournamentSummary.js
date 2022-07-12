import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IDLE, LOADING, SUCCESS, FAILED } from "../constants.js";
import {
  fetchTournamentSummary,
  selectTournamentSummary,
  selectTournamentSummaryStatus,
  selectTournamentSummaryErrorMsg,
} from "../stores/rikishiTournamentSummarySlice";
import PropTypes from "prop-types";

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

  console.log("status: ", status);
  console.log("data: ", data);

  return (
    <div>
      {status === LOADING ? "loading!" : null}
      {status === SUCCESS
        ? data?.map((d, i) => <div key={i}>{d.rikishi}</div>)
        : null}
    </div>
  );
};

RikishiTournamentSummary.propTypes = prop_info;

export default RikishiTournamentSummary;
