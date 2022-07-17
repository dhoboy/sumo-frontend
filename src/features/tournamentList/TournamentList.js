import React, { useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { selectTournamentDates } from "../../stores/tournamentDatesSlice.js";
import RikishiTournamentSummary from "../../components/RikishiTournamentSummary";
import Pagination from "../../components/Pagination";
import styles from "./TournamentList.module.css";

const TournamentList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tournamentDates = useSelector(selectTournamentDates, shallowEqual);

  const page = searchParams.get("page");
  const per = 5;
  const totalPages = Math.ceil(tournamentDates.length / per);

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

  return (
    <div className={styles.wrapper}>
      <div>
        <h2>Filters go here</h2>
        <div className={styles.tournamentList}>
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
        </div>
      </div>
      <Pagination
        currentPage={+page}
        totalPages={+totalPages}
        changePage={changePage}
      />
    </div>
  );
};

export default TournamentList;
