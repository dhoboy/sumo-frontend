import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IDLE, LOADING, SUCCESS, FAILED } from "../constants.js";
import axios from "axios";

/*
 *  Slice contains Rikishi result summaries for every tournament
 *  All items keyed by `${year}-${month}`
 *  e.g. status: { "2021-05": LOADING, "2021-07": SUCCESS, ... }
 **/
const initialState = {
  status: {},
  data: {},
  errorMsg: {},
};

export const fetchTournamentSummary = createAsyncThunk(
  "rikishiTournamentSummary/fetch",
  async ({ year, month }, { rejectWithValue }) => {
    try {
      const url = `http://127.0.0.1:3005/tournament/details/${year}/${month}`;
      const resp = await axios.get(url);
      return { key: `${year}-${month}`, data: resp.data.items };
    } catch ({ status, message }) {
      return rejectWithValue(message);
    }
  }
);

export const rikishiTournamentSummarySlice = createSlice({
  name: "rikishiTournamentSummary",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTournamentSummary.pending, (state, action) => {
        const { year, month } = action.meta.arg;
        const key = `${year}-${month}`;
        state.status[key] = LOADING;
      })
      .addCase(fetchTournamentSummary.fulfilled, (state, action) => {
        const { key, data } = action.payload;
        state.status[key] = SUCCESS;
        state.data[key] = data;
      })
      .addCase(fetchTournamentSummary.rejected, (state, action) => {
        const { year, month } = action.meta.arg;
        const key = `${year}-${month}`;
        state.status[key] = FAILED;
        state.errorMsg[key] = action.payload;
      });
  },
});

export const selectTournamentSummary = (state, { year, month }) =>
  state.rikishiTournamentSummary.data?.[`${year}-${month}`];

export const selectTournamentSummaryStatus = (state, { year, month }) =>
  state.rikishiTournamentSummary.status?.[`${year}-${month}`];

export const selectTournamentSummaryErrorMsg = (state, { year, month }) =>
  state.rikishiTournamentSummary.errorMsg?.[`${year}-${month}`];

export default rikishiTournamentSummarySlice.reducer;
