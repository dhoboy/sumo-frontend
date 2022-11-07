import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTournamentDates,
  selectTournamentDates,
  selectTournamentDatesStatus,
} from "./stores/tournamentDatesSlice.js";
import {
  fetchRikishiList,
  selectAllRikishiBaseInfo,
  selectRikishiBaseInfoStatus,
} from "./stores/rikishiBaseInfoSlice.js";
import { IDLE } from "./constants.js";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import RikishiList from "./features/rikishiList/RikishiList";
import RikishiDetail from "./features/rikishiDetail/RikishiDetail";
import TournamentList from "./features/tournamentList/TournamentList";
import TournamentBoutDetail from "./features/tournamentBoutDetail/TournamentBoutDetail";
import Matchups from "./features/matchups/Matchups";
import "@fortawesome/fontawesome-free/js/all.js";

// stores the window sizes for responsive uses throughout the code
export const WinSizeContext = React.createContext();

// TODO --
// code clean-up
// testing
// double check loading
const App = () => {
  const dispatch = useDispatch();
  const tournamentDates = useSelector(selectTournamentDates);
  const tournamentDatesStatus = useSelector(selectTournamentDatesStatus);

  const allRikishiBaseInfo = useSelector((state) =>
    selectAllRikishiBaseInfo(state)
  );
  const rikishiBaseInfoStatus = useSelector((state) =>
    selectRikishiBaseInfoStatus(state)
  );

  const [winWidth, setWinWidth] = useState(window.innerWidth);

  // multiple views need these
  // if no data, and its not currently loading, call for the data
  useEffect(() => {
    if (tournamentDatesStatus === IDLE) {
      dispatch(fetchTournamentDates());
    }
  }, [dispatch, tournamentDatesStatus, tournamentDates]);

  useEffect(() => {
    if (rikishiBaseInfoStatus === IDLE) {
      dispatch(fetchRikishiList());
    }
  }, [dispatch, allRikishiBaseInfo, rikishiBaseInfoStatus]);

  useEffect(() => {
    const updateWidth = () => setWinWidth(window.innerWidth);
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  return (
    <WinSizeContext.Provider value={{ winWidth }}>
      <div id="app">
        <Header />
        <Routes>
          {/* Rikishi */}
          <Route path="/" element={<RikishiList />} />
          <Route path="rikishi" element={<RikishiList />} />
          <Route path="rikishi/:name" element={<RikishiDetail />} />

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
    </WinSizeContext.Provider>
  );
};

export default App;
