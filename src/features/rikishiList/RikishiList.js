import React, { useEffect, useContext } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { IDLE, LOADING, SUCCESS, FAILED } from "../../constants.js";
import {
  selectAllRikishiBaseInfo,
  selectRikishiBaseInfoStatus,
  selectRikishiBaseInfoErrorMsg,
} from "../../stores/rikishiBaseInfoSlice";
import { selectLatestTournament } from "../../stores/tournamentDatesSlice";
import { monthMap, smallMonthMap } from "../../utils";
import Loader from "../../components/Loader";
import DisplayTable from "../../components/DisplayTable";
import Pagination from "../../components/Pagination";
import Checkbox from "../../components/Checkbox";
import { WinSizeContext } from "../../App";
import styles from "./RikishiList.module.css";

const makeBool = (val) => {
  if (val === "true") return true;
  return false;
};

const RikishiList = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const status = useSelector(selectRikishiBaseInfoStatus, shallowEqual);
  const data = useSelector((state) => selectAllRikishiBaseInfo(state) ?? {});
  const errorMsg = useSelector(selectRikishiBaseInfoErrorMsg);
  const latestTournament = useSelector(selectLatestTournament, shallowEqual);

  const { winWidth } = useContext(WinSizeContext);
  const smallScreen = winWidth <= 768;

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
      display: smallScreen ? "Last Active" : "Last Active Tournament",
      sortType: "date",
      sortKey: "tournament_date",
    },
  ];

  // flatten over-ambitious nesting I added on the clojure side
  // and filter down based on filter values
  const tableReadyData = Object.keys(data || {})
    .reduce((acc, next) => {
      const { year, month } = data[next]?.rank?.tournament;

      acc = acc.concat({
        ...data[next],
        ...{
          tournament: `${
            smallScreen ? smallMonthMap[month] : monthMap[month]
          } ${year}`,
        },
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

  // Pagination
  const page = searchParams.get("page");
  const per = 10;
  const totalPages = Math.ceil(tableReadyData.length / per);

  useEffect(() => {
    if (!page) {
      searchParams.set("page", 1);
      setSearchParams(searchParams);
    }
  }, [page, searchParams, setSearchParams]);

  const changePage = (p) => {
    searchParams.set("page", p);
    setSearchParams(searchParams);
  };

  const handleTextChange = (e) => {
    if (e.target.value.trim() === "") {
      searchParams.delete("searchText");
    } else {
      searchParams.set("searchText", e.target.value);
    }

    searchParams.set("page", 1);
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

    searchParams.set("page", 1);
    setSearchParams(searchParams);
  };

  return (
    <Loader
      loading={status === LOADING || status === IDLE}
      error={false}
      errorMsg={errorMsg}
      size="medium"
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
        <DisplayTable
          data={tableReadyData.slice((page - 1) * per, page * per - 1)}
          headers={headers}
          canSort
        />
        <Pagination
          currentPage={+page}
          totalPages={+totalPages}
          changePage={changePage}
        />
      </div>
    </Loader>
  );
};

export default RikishiList;
