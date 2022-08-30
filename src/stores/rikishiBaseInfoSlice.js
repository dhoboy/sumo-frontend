import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IDLE, LOADING, SUCCESS, FAILED } from "../constants.js";
import axios from "axios";

/*
 * Slice contains info about Rikishi
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
 */

const initialState = {
  status: IDLE,
  data: {},
  errorMsg: "",
};

// Action
export const fetchRikishiList = createAsyncThunk(
  "rikishiInfo/fetchList",
  async (_, { rejectWithValue }) => {
    try {
      const url = `http://127.0.0.1:3005/rikishi/list`;
      const resp = await axios.get(url);
      return {
        data: resp.data?.items.reduce((acc, next) => {
          acc[next.name] = {
            ...next,
            image: `https://www3.nhk.or.jp${next.image}`,
            name_ja: `https://www3.nhk.or.jp${next.name_ja}`,
          };
          return acc;
        }, {}),
      };
    } catch ({ status, message }) {
      return rejectWithValue(message);
    }
  }
);

// Reducer
export const rikishiBaseInfoSlice = createSlice({
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

// Selectors
export const selectRikishiBaseInfo = (state, { rikishi }) =>
  state.rikishiBaseInfo.data?.[rikishi];

export const selectAllRikishiBaseInfo = (state) => state.rikishiBaseInfo.data;

export const selectRikishiPhotos = (state) =>
  Object.keys(state.rikishiBaseInfo.data).reduce((acc, next) => {
    const { image } = state.rikishiBaseInfo.data[next];
    acc[next] = image || null;
    return acc;
  }, {});

export const selectRikishiBaseInfoStatus = (state) =>
  state.rikishiBaseInfo.status;

export const selectRikishiBaseInfoErrorMsg = (state) =>
  state.rikishiBaseInfo.errorMsg;

export default rikishiBaseInfoSlice.reducer;
