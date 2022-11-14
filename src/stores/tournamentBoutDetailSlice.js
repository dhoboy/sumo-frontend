import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IDLE, LOADING, SUCCESS, FAILED } from "../constants.js";
import axios from "axios";

/*
 *  Slice contains every bout in every tournament
 *  All items keyed by `${year}-${month}`
 *  e.g. status: { "2021-05": LOADING, "2021-07": SUCCESS, ... }
 **/
const initialState = {
  status: {},
  data: {},
  errorMsg: {},
};

export const fetchTournamentBoutDetail = createAsyncThunk(
  "tournamentBoutDetail/fetch",
  async ({ year, month }, { rejectWithValue }) => {
    try {
      const url = `http://127.0.0.1:3005/bout/list?year=${year}&month=${month}`;
      const resp = await axios.get(url);
      return { key: `${year}-${month}`, data: resp?.data?.items || [] };
    } catch ({ status, message }) {
      return rejectWithValue(message);
    }
  }
);

export const tournamentBoutDetailSlice = createSlice({
  name: "tournamentBoutDetail",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTournamentBoutDetail.pending, (state, action) => {
        const { year, month } = action.meta.arg;
        const key = `${year}-${month}`;
        state.status[key] = LOADING;
        state.errorMsg[key] = "";
      })
      .addCase(fetchTournamentBoutDetail.fulfilled, (state, action) => {
        const { key, data } = action.payload;
        state.status[key] = SUCCESS;
        state.data[key] = data;
      })
      .addCase(fetchTournamentBoutDetail.rejected, (state, action) => {
        const { year, month } = action.meta.arg;
        const key = `${year}-${month}`;
        state.status[key] = FAILED;
        state.errorMsg[key] = action.payload;
      });
  },
});

export const selectTournamentBoutDetail = (state, { year, month }) =>
  state.tournamentBoutDetail.data?.[`${year}-${month}`];

export const selectTournamentBoutDetailStatus = (state, { year, month }) =>
  state.tournamentBoutDetail.status?.[`${year}-${month}`];

export const selectTournamentBoutDetailErrorMsg = (state, { year, month }) =>
  state.tournamentBoutDetail.errorMsg?.[`${year}-${month}`];

export default tournamentBoutDetailSlice.reducer;
