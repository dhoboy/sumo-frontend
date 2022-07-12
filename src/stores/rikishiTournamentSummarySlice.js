import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IDLE, LOADING, SUCCESS, FAILED } from "../constants.js";
import axios from "axios";

/*
 *  Slice contains Rikishi result summaries for every tournament
 **/
const initialState = {
  status: IDLE,
  data: {},
  errorMsg: "",
};

export const fetchTournamentSummary = createAsyncThunk(
  "rikishiTournamentSummary/fetch",
  async ({ year, month }, { rejectWithValue }) => {
    try {
      const url = `http://localhost:3005/tournament/details/${year}/${month}`;
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
      .addCase(fetchTournamentSummary.pending, (state) => {
        state.status = LOADING;
      })
      .addCase(fetchTournamentSummary.fulfilled, (state, action) => {
        const { key, data } = action.payload;
        state.status = SUCCESS;
        state.data[key] = data;
      })
      .addCase(fetchTournamentSummary.rejected, (state, action) => {
        state.status = FAILED;
        state.errorMsg = action.payload;
      });
  },
});

export const selectTournamentSummary = (state, { year, month }) =>
  state.rikishiTournamentSummary.data[`${year}-${month}`];

export const selectTournamentSummaryStatus = (state) =>
  state.rikishiTournamentSummary.status;

export const selectTournamentSummaryErrorMsg = (state) =>
  state.rikishiTournamentSummary.errorMsg;

export default rikishiTournamentSummarySlice.reducer;
