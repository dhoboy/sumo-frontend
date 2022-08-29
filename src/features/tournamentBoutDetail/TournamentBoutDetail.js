import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LOADING } from "../../constants.js";
import { Link, useParams, useNavigate } from "react-router-dom";
import DisplayTable from "../../components/DisplayTable.js";
import Loader from "../../components/Loader";
import { monthMap } from "../../utils";
import {
  fetchTournamentBoutDetail,
  selectTournamentBoutDetail,
  selectTournamentBoutDetailStatus,
  selectTournamentBoutDetailErrorMsg,
} from "../../stores/tournamentBoutDetailSlice";
import styles from "./TournamentBoutDetail.module.css";

const TournamentBoutDetail = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();

  const { year, month, day } = params;

  const status = useSelector((state) =>
    selectTournamentBoutDetailStatus(state, { year, month })
  );

  const data = useSelector((state) =>
    selectTournamentBoutDetail(state, { year, month })
  );

  const errorMsg = useSelector((state) =>
    selectTournamentBoutDetailErrorMsg(state, { year, month })
  );

  useEffect(() => {
    if (!data) dispatch(fetchTournamentBoutDetail({ year, month }));
  }, [data, dispatch, month, year]);

  // this is breaking the back button
  // useEffect(() => {
  //   if (!day) navigate(`/tournaments/${year}/${month}/1`);
  // }, [day, month, navigate, year]);
  //

  // { 1: [], 2: [], ... }
  const tableReadyData = data?.reduce((acc, next) => {
    if (!acc[next.day]) acc[next.day] = [];
    acc[next.day] = acc[next.day].concat(next);
    return acc;
  }, {});

  const headers = [
    {
      colKey: "east",
      display: "East",
      sortType: "string",
      linkFn: (name) => navigate(`/rikishi/${name}`),
    },
    {
      colKey: "east_rank",
      display: "East Rank",
      sortKey: "east_rank_value",
      sortType: "number",
    },
    {
      colKey: "west",
      display: "West",
      sortType: "string",
      linkFn: (name) => navigate(`/rikishi/${name}`),
    },
    {
      colKey: "west_rank",
      display: "West Rank",
      sortKey: "west_rank_value",
      sortType: "number",
    },
    {
      colKey: "winner",
      display: "Winner",
      sortType: "string",
      linkFn: (name) => navigate(`/rikishi/${name}`),
    },
    {
      colKey: "technique",
      display: "Technique",
      sortType: "string",
    },
    {
      colKey: "technique_en",
      display: "Tech. Description",
      sortType: "string",
    },
    {
      colKey: "technique_category",
      display: "Tech. Category",
      sortType: "string",
    },
    /* { colKey: "is_playoff", display: "Playoff Match", sortType: "string" }, */
    /* { colKey: "loser", display: "Loser", sortType: "string" }, */
  ];

  return (
    <Loader loading={status === LOADING} error={false} errorMsg={errorMsg}>
      <div className={styles.wrapper}>
        <h2 className={styles.h2}>{`${monthMap[month]} ${year}`}</h2>
        <div className={styles.dayNav}>
          {Object.keys(tableReadyData || {}).map((d) => {
            return (
              <Link
                key={d}
                className={`${styles.dayNavItem} ${
                  day === d ? styles.selected : ""
                }`}
                to={`/tournaments/${year}/${month}/${d}`}
              >
                {`Day ${d}`}
              </Link>
            );
          })}
        </div>
        <div className={styles.tableWrapper}>
          <DisplayTable
            headers={headers}
            data={tableReadyData?.[day] || []}
            canSort
          />
        </div>
      </div>
    </Loader>
  );
};

export default TournamentBoutDetail;
