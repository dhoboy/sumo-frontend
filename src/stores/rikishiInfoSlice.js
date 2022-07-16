import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IDLE, LOADING, SUCCESS, FAILED } from "../constants.js";
import axios from "axios";

/*
 * Slice contains info about Rikishi
 * data: {
 *   ENDO: {
 *     id,
 *     image,
 *     name,
 *     name_ja,
 *     rank: {
 *       rank,
 *       rankValue,
 *       tournament: { year, month }}
 *   },
 *   TAKAKEISHO: {}, ...
 * }
 */
const initialState = {
  status: IDLE,
  data: {},
  errorMsg: "",
};

export const fetchRikishiList = createAsyncThunk(
  "rikishiInfo/fetchList",
  async (state, { rejectWithValue }) => {
    // dont make request if already in progress
    // if (state.status !== LOADING) {
    try {
      // make request if one is not alrady in progress
      const url = `http://localhost:3005/rikishi/list`;
      const resp = await axios.get(url);

      return {
        data: resp.data?.items.reduce((acc, next) => {
          acc[next.name] = next;
          return acc;
        }, {}),
      };
    } catch ({ status, message }) {
      return rejectWithValue(message);
    }
  }
  // }
);

export const rikishiInfoSlice = createSlice({
  name: "rikishiInfo",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRikishiList.pending, (state) => {
        state.status = LOADING;
      })
      .addCase(fetchRikishiList.fulfilled, (state, action) => {
        state.status = SUCCESS;
        state.data = action.payload.data;
      })
      .addCase(fetchRikishiList.rejected, (state, action) => {
        state.status = FAILED;
        state.errorMsg = action.payload;
      });
  },
});

export const selectRikishiList = (state) =>
  Object.keys(state.rikishiInfo.data || {});

export const selectRikishiListStatus = (state) => state.rikishiInfo.status;

export const selectRikishiListErrorMsg = (state) => state.rikishiInfo.errorMsg;

export default rikishiInfoSlice.reducer;
