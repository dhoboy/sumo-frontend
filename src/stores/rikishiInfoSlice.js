import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

/*
 * Slice contains info about Rikishi
 */
const initialState = {
  value: 0,
};

export const rikishiSlice = createSlice({
  name: "rikishi",
  initialState,
  reducers: {},
});

export default rikishiSlice.reducer;
