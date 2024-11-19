import { configureStore } from "@reduxjs/toolkit";
import messagesReducer from "../redux/Messenger/sliceAction";

const store = configureStore({
  reducer: {
    messages: messagesReducer,
  },
});

export default store;
