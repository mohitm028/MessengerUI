import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchMessages = createAsyncThunk(
  "messages/fetch",
  async (page, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `https://gorest.co.in/public/v1/users?page=${page}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

const messagesSlice = createSlice({
  name: "messages",
  initialState: { data: [], page: 1, hasMore: true, error: null },
  reducers: {
    appendMessage: (state, action) => {
      state.data.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.data = [...action.payload.data, ...state.data];
        state.page += 1;
        state.hasMore = action.payload.meta.pagination.pages > state.page;
        state.error = null;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.error = action.payload || "Something went wrong.";
      });
  },
});

export const { appendMessage } = messagesSlice.actions;
export default messagesSlice.reducer;
