import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";
import tournamentDatesReducer from "./tournamentDatesSlice";
import tournamentBoutDetailReducer from "./tournamentBoutDetailSlice";
import rikishiInfoReducer from "./rikishiInfoSlice";
import rikishiTournamentSummaryReducer from "./rikishiTournamentSummarySlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    tournamentDates: tournamentDatesReducer,
    tournamentBoutDetail: tournamentBoutDetailReducer,
    rikishiInfo: rikishiInfoReducer,
    rikishiTournamentSummary: rikishiTournamentSummaryReducer,
  },
});
