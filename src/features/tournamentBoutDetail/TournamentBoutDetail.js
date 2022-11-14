import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LOADING, FAILED } from "../../constants.js";
import {
  Link,
  useParams,
  useSearchParams,
  useNavigate,
} from "react-router-dom";
import DisplayTable from "../../components/DisplayTable.js";
import Dropdown from "../../components/Dropdown";
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
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const { year, month, day } = params;

  const searchBy = searchParams.get("searchBy") || "name";
  const searchText = searchParams.get("searchText") || "";

  // scroll to top of page on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!searchParams.get("searchBy")) {
      searchParams.set("searchBy", "name");
      setSearchParams(searchParams);
    }
  }, [searchBy, searchParams, setSearchParams]);

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

  // { 1: [], 2: [], ... }
  const tableReadyData = data?.reduce((acc, next) => {
    if (!acc[next.day]) acc[next.day] = [];
    acc[next.day] = acc[next.day].concat(next);
    return acc;
  }, {});

  const filteredData = (tableReadyData?.[day] || []).filter((d) => {
    const { east, west, technique, technique_category } = d;
    const regex = new RegExp(`^${searchText}`, "i");

    switch (searchBy.toLowerCase()) {
      case "name":
        return regex.test(east) || regex.test(west);

      case "technique":
        return regex.test(technique);

      case "technique_category":
        return regex.test(technique_category);

      default:
        return true;
    }
  });

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
  ];

  const onSearchByChange = (nextSearchBy) => {
    searchParams.set("searchBy", nextSearchBy);
    searchParams.delete("searchText");
    setSearchParams(searchParams);
  };

  const onSearchTextChange = (e) => {
    if (e.target.value.trim() === "") {
      searchParams.delete("searchText");
    } else {
      searchParams.set("searchText", e.target.value);
    }
    setSearchParams(searchParams);
  };

  return (
    <Loader
      size="large"
      loading={status === LOADING}
      error={status === FAILED}
      errorMsg={errorMsg}
    >
      <div className={styles.wrapper}>
        <div className={styles.filters}>
          <Dropdown
            label="Search by"
            options={[
              { value: "name", label: "Name" },
              { value: "technique", label: "Technique" },
              { value: "technique_category", label: "Technique Category" },
            ]}
            selected={searchBy}
            onChange={onSearchByChange}
          />
          <input value={searchText} onChange={onSearchTextChange} />
        </div>
        <h2 className={styles.h2}>{`${monthMap[month]} ${year}`}</h2>
        <div className={styles.dayNav}>
          {Object.keys(tableReadyData || {}).map((d) => {
            const destination = `/tournaments/${year}/${month}/${d}${
              searchText.length
                ? `?searchBy=${searchBy}&searchText=${searchText}`
                : ""
            }`;
            return (
              <Link
                key={d}
                className={`${styles.dayNavItem} ${
                  day === d ? styles.selected : ""
                }`}
                to={destination}
              >
                {`Day ${d}`}
              </Link>
            );
          })}
        </div>
        <div className={styles.tableWrapper}>
          <DisplayTable headers={headers} data={filteredData} canSort />
        </div>
      </div>
    </Loader>
  );
};

export default TournamentBoutDetail;
