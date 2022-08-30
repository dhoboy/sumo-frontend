import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IDLE, LOADING, SUCCESS, FAILED } from "../constants.js";
import axios from "axios";

/*
 * Slice contains Rikishi's technique breakdown
 *   ENDO: {},
 *   TAKAKEISHO: {}, ...
 */

const initialState = {
  status: IDLE,
  data: {},
  errorMsg: "",
};

// Action
export const fetchRikishiTechniqueBreakdown = createAsyncThunk(
  "rikishiTechniqueBreakdown/fetch",
  async ({ rikishi }, { rejectWithValue }) => {
    try {
      const url = `http://127.0.0.1:3005/rikishi/technique_breakdown/${rikishi}`;
      const resp = await axios.get(url);
      return {
        rikishi,
        techniqueBreakdown: resp.data.items.reduce((acc, next) => {
          return {
            ...acc,
            ...next,
          };
        }, {}),
      };
    } catch ({ status, message }) {
      return rejectWithValue(message);
    }
  }
);

// Reducer
export const rikishiTechniqueBreakdownSlice = createSlice({
  name: "rikishiTechniqueBreakdown",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRikishiTechniqueBreakdown.pending, (state) => {
        state.status = LOADING;
      })
      .addCase(fetchRikishiTechniqueBreakdown.fulfilled, (state, action) => {
        state.status = SUCCESS;
        state.data[action.payload.rikishi] = action.payload.techniqueBreakdown;
      })
      .addCase(fetchRikishiTechniqueBreakdown.rejected, (state, action) => {
        state.status = FAILED;
        state.errorMsg = action.payload;
      });
  },
});

// Selectors
export const selectRikishiTechniqueBreakdown = (state, { rikishi }) =>
  state.rikishiTechniqueBreakdown.data?.[rikishi];

export const selectRikishiTechniqueBreakdownStatus = (state) =>
  state.rikishiTechniqueBreakdown.status;

export const selectRikishiTechniqueBreakdownError = (state) =>
  state.rikishiTechniqueBreakdown.errorMsg;

export default rikishiTechniqueBreakdownSlice.reducer;
