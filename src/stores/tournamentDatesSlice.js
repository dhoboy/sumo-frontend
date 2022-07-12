import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IDLE, LOADING, SUCCESS, FAILED } from "../constants.js";
import axios from "axios";

/*
 * Slice contains list of all tournaments there is data for
 **/
const initialState = {
  status: IDLE,
  data: [], // [ { year: 2021, month: 5 }, ... ]
  errorMsg: "",
};

export const fetchTournamentDates = createAsyncThunk(
  "tournamentDates/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const resp = await axios.get("http://localhost:3005/tournament/list");
      return resp.data?.items;
    } catch ({ status, message }) {
      return rejectWithValue(message);
    }
  }
);

export const tournamentDatesSlice = createSlice({
  name: "tournamentDates",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTournamentDates.pending, (state) => {
        state.status = LOADING;
      })
      .addCase(fetchTournamentDates.fulfilled, (state, action) => {
        state.status = SUCCESS;
        state.data = action.payload;
      })
      .addCase(fetchTournamentDates.rejected, (state, action) => {
        state.status = FAILED; // TODO: Log these errors ?
        state.errorMsg = action.payload;
      });
  },
});

export const selectTournamentDates = (state) => state.tournamentDates.data;

export const selectTournamentDatesStatus = (state) =>
  state.tournamentDates.status;

export const selectTournamentDatesErrorMsg = (state) =>
  state.tournamentDates.errorMsg;

export default tournamentDatesSlice.reducer;
