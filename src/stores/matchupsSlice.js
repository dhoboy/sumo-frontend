import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IDLE, LOADING, SUCCESS, FAILED } from "../constants.js";
import axios from "axios";

/*
 * Slice contains info about matchups between rikishi and opponent
 *   TAKAKEISHO-SHODAI: [{
 *     "technique_en": "Frontal push down","
 *     day":10,
 *     "west_rank_value":3,"
 *     west":"TAKAKEISHO","
 *     winner":"TAKAKEISHO",
 *     east_rank":"Maegashira #4",
 *     "loser":"SHODAI",
 *     "month":9,
 *     "is_playoff":null,
 *     "east_rank_value":8,
 *     "east":"SHODAI",
 *     "year":2019,
 *     "technique":"Oshitaoshi",
 *     "id":1448,
 *     "west_rank":"Sekiwake",
 *     "technique_category":"push"
 *   }, ... ], ...
 */
const initialState = {
  status: IDLE,
  data: {},
  errorMsg: "",
};

// Action
export const fetchMatchupList = createAsyncThunk(
  "matchups/fetchList",
  async ({ rikishi, opponent }, { rejectWithValue }) => {
    try {
      const url = `http://localhost:3005/bout/list/${rikishi}/${opponent}`;
      const resp = await axios.get(url);
      return {
        rikishi,
        opponent,
        items: resp.data.items || [],
      };
    } catch ({ status, message }) {
      return rejectWithValue(message);
    }
  }
);

// Reducer
export const matchupsSlice = createSlice({
  name: "matchups",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMatchupList.pending, (state) => {
        state.status = LOADING;
        state.errorMsg = "";
      })
      .addCase(fetchMatchupList.fulfilled, (state, action) => {
        const key = `${action.payload.rikishi}-${action.payload.opponent}`;
        state.status = SUCCESS;
        state.data[key] = action.payload.items;
      })
      .addCase(fetchMatchupList.rejected, (state, action) => {
        state.status = FAILED;
        state.errorMsg = action.payload;
      });
  },
});

// Selectors
export const selectMatchup = (state, { rikishi, opponent }) => {
  const matchupKey1 = `${rikishi.toUpperCase()}-${opponent.toUpperCase()}`;
  const matchupKey2 = `${opponent.toUpperCase()}-${rikishi.toUpperCase()}`;
  return (
    state.matchups.data[matchupKey1] || state.matchups.data[matchupKey2] || []
  );
};

export const selectAllMatchups = (state) => state.matchups.data;

export const selectMatchupsStatus = (state) => state.matchups.status;

export const selectMatchupsErrorMsg = (state) => state.matchups.errorMsg;

export default matchupsSlice.reducer;
