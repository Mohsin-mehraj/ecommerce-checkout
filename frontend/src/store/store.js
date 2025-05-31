import { configureStore } from "@reduxjs/toolkit";
import productSlice from "./slices/productSlice";
import cartSlice from "./slices/cartSlice";
import orderSlice from "./slices/orderSlice";

export const store = configureStore({
  reducer: {
    products: productSlice,
    cart: cartSlice,
    orders: orderSlice,
  },

  devTools: process.env.NODE_ENV !== "production",
});
