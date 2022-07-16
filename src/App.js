import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import RikishiList from "./features/rikishiList/RikishiList";
import TournamentList from "./features/tournamentList/TournamentList";
import TournamentBoutDetail from "./features/tournamentBoutDetail/TournamentBoutDetail";
import Matchups from "./features/matchups/Matchups";
import "@fortawesome/fontawesome-free/js/all.js";

const App = () => {
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
