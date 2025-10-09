import { Product } from "@/services/api";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  product: Product;
  quantity: number;
  itemsTotal: number;
}

type CartState = {
  items: CartItem[];
  itemCount: number;
  total: number;
};

const initialState: CartState = {
  items: [],
  itemCount: 0,
  total: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
      state.itemCount = action.payload.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      state.total = action.payload.reduce(
        (sum, item) => sum + item.itemsTotal,
        0
      );
    },
    addItem: (state, action: PayloadAction<CartItem>) => {
      const index = state.items.findIndex(
        (item) => item.product._id === action.payload.product._id
      );
      if (index === -1) {
        state.items.push(action.payload);
      } else {
        state.items[index].quantity += action.payload.quantity;
        state.items[index].itemsTotal += action.payload.itemsTotal;
      }
      state.itemCount = state.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      state.total = state.items.reduce((sum, item) => sum + item.itemsTotal, 0);
    },
    removeItem: (state, action: PayloadAction<string>) => {
      const index = state.items.findIndex(
        (item) => item.product._id === action.payload
      );
      if (index !== -1) {
        if (state.items[index].quantity > 1) {
          state.items[index].quantity -= 1;
          state.items[index].itemsTotal -=
            state.items[index].itemsTotal / (state.items[index].quantity + 1);
        } else {
          state.items.splice(index, 1);
        }
      }
      state.itemCount = state.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      state.total = state.items.reduce((sum, item) => sum + item.itemsTotal, 0);
    },
    clearCartItem: (state, action: PayloadAction<string>) => {
      const index = state.items.findIndex(
        (item) => item.product._id === action.payload
      );
      if (index !== -1) {
        state.items.splice(index, 1);
      }
      state.itemCount = state.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      state.total = state.items.reduce((sum, item) => sum + item.itemsTotal, 0);
    },
  },
});

export const { setCart, addItem, removeItem, clearCartItem } =
  cartSlice.actions;
export default cartSlice.reducer;
