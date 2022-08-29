import React, { useState, useEffect } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { IDLE, LOADING, SUCCESS, FAILED } from "../../constants.js";
import {
  fetchRikishiList,
  selectRikishiBaseInfo,
  selectRikishiInfoStatus,
  selectRikishiInfoErrorMsg,
} from "../../stores/rikishiInfoSlice";
import { selectLatestTournament } from "../../stores/tournamentDatesSlice";
import { monthMap } from "../../utils";
import Loader from "../../components/Loader";
import DisplayTable from "../../components/DisplayTable";
import Checkbox from "../../components/Checkbox";
import styles from "./RikishiList.module.css";

const makeBool = (val) => {
  if (val === "true") return true;
  return false;
};

const RikishiList = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const status = useSelector(selectRikishiInfoStatus, shallowEqual);
  const data = useSelector((state) => selectRikishiBaseInfo(state) ?? {});
  const errorMsg = useSelector(selectRikishiInfoErrorMsg);
  const latestTournament = useSelector(selectLatestTournament, shallowEqual);

  const searchText = searchParams.get("searchText") || "";
  const active = makeBool(searchParams.get("active"));
  const yokozuna = makeBool(searchParams.get("yokozuna"));

  const headers = [
    {
      colKey: "name",
      display: "Name",
      sortType: "string",
      linkFn: (name) => navigate(`/rikishi/${name}`),
    },
    {
      colKey: "rank",
      display: "Rank",
      sortType: "number",
      sortKey: "rank_value",
    },
    {
      colKey: "tournament",
      display: "Last Active Tournament",
      sortType: "date",
      sortKey: "tournament_date",
    },
  ];

  const handleTextChange = (e) => {
    if (e.target.value.trim() === "") {
      searchParams.delete("searchText");
    } else {
      searchParams.set("searchText", e.target.value);
    }
    setSearchParams(searchParams);
  };

  const handleCheckboxChange = (filterKey) => {
    let nextVal;

    switch (filterKey) {
      case "active":
        nextVal = !active;
        break;
      case "yokozuna":
        nextVal = !yokozuna;
        break;
      default:
        nextVal = false;
        break;
    }

    // only track true checkbox values in searchParams
    if (nextVal === true) {
      searchParams.set(filterKey, nextVal);
    } else {
      searchParams.delete(filterKey);
    }

    setSearchParams(searchParams);
  };

  // flatten over ambitious nesting I added on the clojure side
  // and filter down based on filter values
  const tableReadyData = Object.keys(data || {})
    .reduce((acc, next) => {
      const { year, month } = data[next]?.rank?.tournament;

      acc = acc.concat({
        ...data[next],
        ...{ tournament: `${monthMap[month]} ${year}` },
        ...{ tournament_date: new Date(year, month - 1) },
        ...{ rank: data[next]?.rank?.rank },
        ...{ rank_value: data[next]?.rank?.rank_value },
      });
      return acc;
    }, [])
    .filter(({ name, rank, tournament_date }) => {
      // build clause based on user entered filter selections
      let clause = true;

      if (searchText.length) {
        // only options that start with user-entered text, case insensitive
        const regex = new RegExp(`^${searchText}`, "i");
        clause = clause && regex.test(name);
      }

      if (active) {
        const year = tournament_date.getFullYear();
        const month = tournament_date.getMonth() + 1;
        const { year: latestYear, month: latestMonth } = latestTournament;

        clause = clause && latestYear === year && latestMonth === month;
      }

      if (yokozuna) {
        clause = clause && rank.toLowerCase() === "yokozuna";
      }

      return clause;
    });

  console.log("tableReadyData: ", tableReadyData);

  return (
    <Loader
      loading={status === LOADING || status === IDLE}
      error={false}
      errorMsg={errorMsg}
    >
      <div className={styles.filters}>
        <label className={styles.search}>
          <span>Search by Name</span>
          <input
            onChange={handleTextChange}
            value={searchText}
            className={styles.input}
          />
        </label>
        <div className={styles.checkboxes}>
          <Checkbox
            filterKey="active"
            label="Active Last Tournament"
            checked={active}
            onChange={handleCheckboxChange}
          />
          <Checkbox
            filterKey="yokozuna"
            label="Yokozuna"
            checked={yokozuna}
            onChange={handleCheckboxChange}
          />
        </div>
      </div>
      <div className={styles.wrapper}>
        <DisplayTable data={tableReadyData} headers={headers} canSort />
      </div>
    </Loader>
  );
};

export default RikishiList;
