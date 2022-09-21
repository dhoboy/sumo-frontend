import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IDLE, LOADING, SUCCESS, FAILED } from "../constants.js";
import axios from "axios";

/*
 * Slice contains Rikishi's rank over time
 *   ENDO: [{
 *     rank: "Komusubi"
 *     tournament: {month: 5, year: 2018}
 *   }, {
 *     rank: "Maegashira #6"
 *     tournament: {month: 7, year: 2018}
 *   },
 *   ...]
 *   TAKAKEISHO: {}, ...
 */

const initialState = {
  status: IDLE,
  data: {},
  errorMsg: "",
};

// Action
export const fetchRikishiRankOverTime = createAsyncThunk(
  "rikishiInfo/fetchRankOverTime",
  async ({ rikishi }, { rejectWithValue }) => {
    try {
      const url = `http://127.0.0.1:3005/rikishi/rank_over_time/${rikishi}`;
      const resp = await axios.get(url);
      return {
        rikishi,
        rankOverTime: resp.data.items.filter((d) => d.rank_value !== null),
      };
    } catch ({ status, message }) {
      return rejectWithValue(message);
    }
  }
);

// Reducer
export const rikishiRankOverTimeSlice = createSlice({
  name: "rikishiRankOverTime",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRikishiRankOverTime.pending, (state) => {
        state.status = LOADING;
        state.errorMsg = "";
      })
      .addCase(fetchRikishiRankOverTime.fulfilled, (state, action) => {
        state.status = SUCCESS;
        state.data[action.payload.rikishi] = action.payload.rankOverTime;
      })
      .addCase(fetchRikishiRankOverTime.rejected, (state, action) => {
        state.status = FAILED;
        state.errorMsg = action.payload;
      });
  },
});

// Selectors
export const selectRikishiRankOverTime = (state, { rikishi }) =>
  state.rikishiRankOverTime.data?.[rikishi];

export const selectRikishiRankOverTimeStatus = (state) =>
  state.rikishiRankOverTime.status;

export const selectRikishiRankOverTimeErrorMsg = (state) =>
  state.rikishiRankOverTime.errorMsg;

export default rikishiRankOverTimeSlice.reducer;
