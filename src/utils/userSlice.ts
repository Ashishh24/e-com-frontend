import { Address } from "@/services/api";
import { createSlice } from "@reduxjs/toolkit";

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address: Address[];
  cart: {
    cartTotal: number;
    items: {
      productId: string;
      quantity: number;
    }[];
  };
  wishlist: string[];
  isAdmin: boolean;
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
    removeUser: () => {
      return null;
    },
    updateUser: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { addUser, removeUser, updateUser } = userSlice.actions;

export default userSlice.reducer;
