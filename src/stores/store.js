import { configureStore } from "@reduxjs/toolkit";
import tournamentDatesReducer from "./tournamentDatesSlice";
import tournamentBoutDetailReducer from "./tournamentBoutDetailSlice";
import rikishiBaseInfoReducer from "./rikishiBaseInfoSlice";
import rikishiRankOverTimeReducer from "./rikishiRankOverTimeSlice";
import rikishiTechniqueBreakdownReducer from "./rikishiTechniqueBreakdownSlice";
import rikishiTournamentSummaryReducer from "./rikishiTournamentSummarySlice";
import matchupsReducer from "./matchupsSlice";

export const store = configureStore({
  reducer: {
    tournamentDates: tournamentDatesReducer,
    tournamentBoutDetail: tournamentBoutDetailReducer,
    rikishiBaseInfo: rikishiBaseInfoReducer,
    rikishiRankOverTime: rikishiRankOverTimeReducer,
    rikishiTechniqueBreakdown: rikishiTechniqueBreakdownReducer,
    rikishiTournamentSummary: rikishiTournamentSummaryReducer,
    matchups: matchupsReducer,
  },
});
