import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";
import usersReducer from "./users";

// Configura y crea la tienda de Redux

const Store = configureStore({
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger), // Agrega el middleware de logger al middleware predeterminado
  reducer: {
    users: usersReducer, // Agrega el reducer de usuarios a la tienda con la clave 'users'
  },
});

export default Store; // Exporta la store
