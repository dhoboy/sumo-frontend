import React, { useEffect } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import {
  fetchTournamentDates,
  selectTournamentDates,
  selectTournamentDatesStatus,
} from "./stores/tournamentDatesSlice.js";
import { SUCCESS } from "./constants.js";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import RikishiList from "./features/rikishiList/RikishiList";
import TournamentList from "./features/tournamentList/TournamentList";
import TournamentBoutDetail from "./features/tournamentBoutDetail/TournamentBoutDetail";
import Matchups from "./features/matchups/Matchups";
import "@fortawesome/fontawesome-free/js/all.js";

const App = () => {
  const dispatch = useDispatch();
  const tournamentDates = useSelector(selectTournamentDates, shallowEqual);
  const tournamentDatesStatus = useSelector(
    selectTournamentDatesStatus,
    shallowEqual
  );

  // multiple views pages need this, so get it at app level
  useEffect(() => {
    if (tournamentDatesStatus !== SUCCESS && !tournamentDates.length) {
      dispatch(fetchTournamentDates());
    }
  }, [dispatch, tournamentDatesStatus, tournamentDates]);

  return (
    <div id="app">
      <Header />
      <Routes>
        {/* Rikishi */}
        <Route path="/" element={<RikishiList />} />
        <Route path="rikishi" element={<RikishiList />} />

        {/* Tournaments TODO: add a redirect for tournaments/:year/:month to go to day 1 */}
        <Route path="tournaments" element={<TournamentList />} />
        <Route
          path="tournaments/:year/:month"
          element={<TournamentBoutDetail />}
        />
        <Route
          path="tournaments/:year/:month/:day"
          element={<TournamentBoutDetail />}
        />

        {/* Matchups */}
        <Route path="matchups" element={<Matchups />} />
      </Routes>
    </div>
  );
};

export default App;
