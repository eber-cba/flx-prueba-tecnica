import { createAsyncThunk, createReducer } from "@reduxjs/toolkit";
import axios from "axios";

// Action asincrónica para obtener todos los usuarios
export const getAllUsers = createAsyncThunk("GET_ALL_users", () => {
  return axios
    .get("http://localhost:4000/users")
    .then((res) => res.data)
    .catch((err) => {
      throw err; // Propagar el error para que sea manejado por el componente o por un middleware de error
    });
});

// Action asincrónica para crear un nuevo usuario
export const createUser = createAsyncThunk("CREATE_user", async (userData) => {
  try {
    const response = await axios.post("http://localhost:4000/users", userData);
    return response.data;
  } catch (error) {
    throw error; // Propagar el error para que sea manejado por el componente o por un middleware de error
  }
});
// Action asincrónica para editar un usuario
export const editUser = createAsyncThunk("EDIT_user", async (userData) => {
  try {
    const response = await axios.put(
      `http://localhost:4000/users/${userData.id}`,
      userData
    );
    return response.data;
  } catch (error) {
    throw error; // Propagar el error para que sea manejado por el componente o por un middleware de error
  }
});

// Action asincrónica para eliminar un usuario
export const deleteUser = createAsyncThunk("DELETE_user", async (userId) => {
  try {
    await axios.delete(`http://localhost:4000/users/${userId}`);
    return userId; // Retorna el ID del usuario eliminado
  } catch (error) {
    throw error; // Propagar el error para que sea manejado por el componente o por un middleware de error
  }
});

const usersReducer = createReducer([], (builder) => {
  builder
    .addCase(getAllUsers.fulfilled, (state, action) => {
      return action.payload;
    })
    .addCase(createUser.fulfilled, (state, action) => {
      return [...state, action.payload]; // Retorna un nuevo array con el nuevo usuario agregado
    })
    .addCase(editUser.fulfilled, (state, action) => {
      // Encuentra el índice del usuario editado en el estado
      const index = state.findIndex((user) => user.id === action.payload.id);
      // Actualiza el estado con el usuario editado
      if (index !== -1) {
        state[index] = action.payload;
      }
    });
});
export default usersReducer;
