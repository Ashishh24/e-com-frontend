import { createSlice } from "@reduxjs/toolkit";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

type UserState = User | null;

const initialState: UserState = null;

const userSlice = createSlice({
  name: "User",
  initialState,
  reducers: {
    addUser: (state, action) => {
      return action.payload;
    },
    removeUser: (state, action) => {
      return null;
    },
    updateUser: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { addUser, removeUser, updateUser } = userSlice.actions;

export default userSlice.reducer;
