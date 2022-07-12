import React, { useState, useEffect } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { IDLE, LOADING, SUCCESS, FAILED } from "../../constants.js";
import {
  fetchTournamentDates,
  selectTournamentDates,
  selectTournamentDatesStatus,
  selectTournamentDatesErrorMsg,
} from "../../stores/tournamentDatesSlice.js";
import RikishiTournamentSummary from "../../components/RikishiTournamentSummary";
import Pagination from "../../components/Pagination";

// TODO: Should TournamentSummary be a separate component?
// Need to get the summmary data of each tournament shows in
// tournament list. do i get that data here?
const TournamentList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const tournamentDates = useSelector(selectTournamentDates, shallowEqual);
  const status = useSelector(selectTournamentDatesStatus, shallowEqual);
  const errorMsg = useSelector(selectTournamentDatesErrorMsg, shallowEqual);

  const page = searchParams.get("page");
  const per = 5;
  const totalPages = Math.ceil(tournamentDates.length / per);

  console.log("tournamentDates: ", tournamentDates);

  useEffect(() => {
    if (status === IDLE) dispatch(fetchTournamentDates());
  }, [dispatch, status]);

  useEffect(() => {
    if (!page) setSearchParams({ page: 1 });
  }, [page, setSearchParams]);

  const changePage = (p) => {
    setSearchParams({ page: p });
  };

  const name = "TODO";

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
    // { colKey: "wins", display: "Wins", sortType: "number" },
    // { colKey: "losses", display: "Losses", sortType: "number" },
    // { colKey: "result", display: "Result", sortType: "string" },
  ];

  return (
    <div>
      <h2>Filters go here</h2>
      <div className="tournament-list"></div>
      {tournamentDates
        .slice((page - 1) * per, page * per - 1)
        .map(({ year, month }) => {
          return (
            <RikishiTournamentSummary
              key={`${year}-${month}`}
              year={year}
              month={month}
            />
          );
        })}
      <Pagination
        currentPage={+page}
        totalPages={+totalPages}
        changePage={changePage}
      />
    </div>
  );
};

export default TournamentList;
