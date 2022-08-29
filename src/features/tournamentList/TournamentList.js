import React, { useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { selectTournamentDates } from "../../stores/tournamentDatesSlice.js";
import RikishiTournamentSummary from "../../components/RikishiTournamentSummary";
import Pagination from "../../components/Pagination";
import Dropdown from "../../components/Dropdown";
import { monthMap } from "../../utils";
import styles from "./TournamentList.module.css";

const TournamentList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tournamentDates = useSelector(selectTournamentDates, shallowEqual);

  const selectedYear = searchParams.get("year") || "All";
  const selectedMonth = searchParams.get("month") || "All";

  const filteredTournamentDates = tournamentDates.filter(({ year, month }) => {
    if (selectedYear !== "All" && selectedMonth !== "All") {
      return (
        +year === +selectedYear &&
        +month === +monthMap[selectedMonth.toLowerCase()]
      );
    } else if (selectedYear !== "All") {
      return +year === +selectedYear;
    } else if (selectedMonth !== "All") {
      return +month === +monthMap[selectedMonth.toLowerCase()];
    } else {
      return true;
    }
  });

  // Pagination
  const page = searchParams.get("page");
  const per = 5;
  const totalPages = Math.ceil(filteredTournamentDates.length / per);

  const changePage = (p) => {
    searchParams.set("page", p);
    setSearchParams(searchParams);
  };

  useEffect(() => {
    if (!page) {
      searchParams.set("page", 1);
      setSearchParams(searchParams);
    }
  }, [page, searchParams, setSearchParams]);

  // Filters
  const dropdownOptions = tournamentDates.reduce(
    (acc, { month, year }) => {
      if (!acc.years.includes(year)) {
        acc.years = acc.years.concat(year);
      }
      if (!acc.months.includes(month)) {
        acc.months = acc.months.concat(month);
      }
      return acc;
    },
    { years: [], months: [] }
  );

  const yearOptions = ["All"].concat(
    dropdownOptions.years.sort((a, b) => +b - +a)
  );

  const monthOptions = ["All"].concat(
    dropdownOptions.months
      .sort((a, b) => +a - +b)
      .map((month) => monthMap[month])
  );

  const onYearChange = (year) => {
    searchParams.set("page", 1);
    searchParams.set("year", year);
    setSearchParams(searchParams);
  };

  const onMonthChange = (month) => {
    searchParams.set("page", 1);
    searchParams.set("month", month);
    setSearchParams(searchParams);
  };

  const rikishiSearchText = searchParams.get("rikishi") || "";

  const onRikishiTextChange = (e) => {
    searchParams.set("page", 1);
    if (e.target.value.trim() === "") {
      searchParams.delete("rikishi");
    } else {
      searchParams.set("rikishi", e.target.value);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.filters}>
        <label>
          <span>Search by Name</span>
          <input value={rikishiSearchText} onChange={onRikishiTextChange} />
        </label>
        <Dropdown
          label="Year"
          options={yearOptions}
          selected={selectedYear}
          onChange={onYearChange}
        />
        <Dropdown
          label="Month"
          options={monthOptions}
          selected={selectedMonth}
          onChange={onMonthChange}
        />
      </div>
      <div className={styles.tournamentList}>
        {filteredTournamentDates
          .slice((page - 1) * per, page * per - 1)
          .map(({ year, month }) => {
            return (
              <RikishiTournamentSummary
                key={`${year}-${month}`}
                year={year}
                month={month}
                rikishiSearchText={rikishiSearchText}
              />
            );
          })}
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
