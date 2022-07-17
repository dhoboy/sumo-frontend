import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IDLE, LOADING, SUCCESS, FAILED } from "../../constants.js";
import {
  fetchRikishiList,
  selectRikishiInfo,
  selectRikishiInfoStatus,
  selectRikishiInfoErrorMsg,
} from "../../stores/rikishiInfoSlice";
import { selectLatestTournament } from "../../stores/tournamentDatesSlice";
import { monthMap } from "../../utils";
import Loader from "../../components/Loader";
import DisplayTable from "../../components/DisplayTable";
import Checkbox from "../../components/Checkbox";
import styles from "./RikishiList.module.css";

const initialState = {
  text: "",
  yokozuna: false,
  active: true,
};

const RikishiList = () => {
  const dispatch = useDispatch();

  const status = useSelector((state) => selectRikishiInfoStatus(state));
  const data = useSelector((state) => selectRikishiInfo(state) ?? {});
  const errorMsg = useSelector((state) => selectRikishiInfoErrorMsg(state));
  const latestTournament = useSelector(selectLatestTournament);

  const [filters, setFilters] = useState(initialState);

  useEffect(() => {
    // TODO: check if data is still being fetched twice
    if (!Object.keys(data).length && status === IDLE) {
      dispatch(fetchRikishiList());
    }
  }, [data, dispatch, status]);

  const headers = [
    {
      colKey: "name",
      display: "Name",
      sortType: "string",
      linkFn: (name) => `/rikishi/${name}`,
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
    setFilters({
      ...filters,
      text: e.target.value,
    });
  };

  const handleCheckboxChange = (filterKey) => {
    setFilters({
      ...filters,
      [filterKey]: !filters[filterKey],
    });
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
      const { text, active, yokozuna } = filters;

      if (text.length) {
        // only options that start with user-entered text, case insensitive
        const regex = new RegExp(`^${text}`, "i");
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
          <input onChange={handleTextChange} className={styles.input} />
        </label>
        <div className={styles.checkboxes}>
          <Checkbox
            filterKey="active"
            label="Active Last Tournament"
            checked={filters.active}
            onChange={handleCheckboxChange}
          />
          <Checkbox
            filterKey="yokozuna"
            label="Yokozuna"
            checked={filters.yokozuna}
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
