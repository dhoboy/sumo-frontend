import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";
import tournamentDatesReducer from "./tournamentDatesSlice";
import tournamentBoutsReducer from "./tournamentBoutsSlice";
import rikishiInfoReducer from "./rikishiInfoSlice";
import rikishiTournamentSummaryReducer from "./rikishiTournamentSummarySlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    tournamentDates: tournamentDatesReducer,
    tournamentBouts: tournamentBoutsReducer,
    rikishiInfo: rikishiInfoReducer,
    rikishiTournamentSummary: rikishiTournamentSummaryReducer,
  },
});
