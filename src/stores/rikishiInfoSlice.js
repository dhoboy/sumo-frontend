import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IDLE, LOADING, SUCCESS, FAILED } from "../constants.js";
import axios from "axios";

/*
 * Slice contains info about Rikishi
 * base: {
 *   ENDO: {
 *     id,
 *     image,
 *     name,
 *     name_ja,
 *     rank: {
 *       rank,
 *       rankValue,
 *       tournament: { year, month },
 *     }
 *   },
 *   TAKAKEISHO: {}, ...
 * }
 */

// TODO: Consider re-organizing this to be like:
// data: { ENDO: { base: {}, rankOverTime: {}, .... }

const initialState = {
  status: IDLE,
  base: {},
  rankOverTime: {},
  techniqueBreakdown: {},
  errorMsg: "",
};

export const fetchRikishiList = createAsyncThunk(
  "rikishiInfo/fetchList",
  async (_, { rejectWithValue }) => {
    try {
      const url = `http://127.0.0.1:3005/rikishi/list`;
      const resp = await axios.get(url);

      return {
        base: resp.data?.items.reduce((acc, next) => {
          acc[next.name] = next;
          return acc;
        }, {}),
      };
    } catch ({ status, message }) {
      return rejectWithValue(message);
    }
  }
);

export const fetchRikishiRankOverTime = createAsyncThunk(
  "rikishiInfo/fetchRankOverTime",
  async ({ name }, { rejectWithValue }) => {
    try {
      const url = `/rank_over_time/${name}`;
      const resp = await axios.get(url);
      console.log("resp: ", resp);
    } catch ({ status, message }) {
      return rejectWithValue(message);
    }
  }
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
        state.base = action.payload.base;
      })
      .addCase(fetchRikishiList.rejected, (state, action) => {
        state.status = FAILED;
        state.errorMsg = action.payload;
      });
  },
});

export const selectRikishiBaseInfo = (state) => state.rikishiInfo.base;

export const selectRikishiPhotos = (state) =>
  Object.keys(state.rikishiInfo.base).reduce((acc, next) => {
    const { image } = state.rikishiInfo.base[next];
    acc[next] = image ? `https://www3.nhk.or.jp${image}` : null;
    return acc;
  }, {});

export const selectRikishiInfoStatus = (state) => state.rikishiInfo.status;

export const selectRikishiInfoErrorMsg = (state) => state.rikishiInfo.errorMsg;

export default rikishiInfoSlice.reducer;
