import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import RikishiList from "./features/rikishiList/RikishiList";
import TournamentList from "./features/tournamentList/TournamentList";
import TournamentBouts from "./features/tournamentBouts/TournamentBouts";
import Matchups from "./features/matchups/Matchups";

const App = () => {
  return (
    <div id="app">
      <Header />
      <Routes>
        {/* Rikishi */}
        <Route path="/" element={<RikishiList />} />
        <Route path="rikishi" element={<RikishiList />} />

        {/* Tournaments */}
        <Route path="tournaments" element={<TournamentList />} />
        <Route path="tournaments/:year/:month" element={<TournamentBouts />} />
        <Route
          path="tournaments/:year/:month/:day"
          element={<TournamentBouts />}
        />

        {/* Matchups */}
        <Route path="matchups" element={<Matchups />} />
      </Routes>
    </div>
  );
};

export default App;
