import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IDLE, LOADING, SUCCESS, FAILED } from "../constants.js";
import axios from "axios";

/*
 *  Slice contains every bout in every tournament
 **/
const initialState = {
  status: IDLE,
  data: {},
  errorMsg: "",
};

export const fetchTournamentBouts = createAsyncThunk(
  "tournamentBouts/fetch",
  async ({ year, month }, { rejectWithValue }) => {
    try {
      const url = `http://localhost:3005/bout/list?year=${year}&month=${month}`;
      const resp = await axios.get(url);
      console.log("resp: ", resp);
      return resp;
    } catch ({ status, message }) {
      return rejectWithValue(message);
    }
  }
);

export const tournamentBoutsSlice = createSlice({
  name: "tournamentBouts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTournamentBouts.pending, (state) => {
        state.status = LOADING;
      })
      .addCase(fetchTournamentBouts.fulfilled, (state, action) => {
        state.status = SUCCESS;
        console.log("action: ", action);
      })
      .addCase(fetchTournamentBouts.rejected, (state, action) => {
        state.status = FAILED;
        state.errorMsg = action.payload;
      });
  },
});

export default tournamentBoutsSlice.reducer;
