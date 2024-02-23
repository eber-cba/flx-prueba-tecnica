import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";
import usersReducer from "./users";

const Store = configureStore({
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
  reducer: {
    users: usersReducer,
  },
});

export default Store;
