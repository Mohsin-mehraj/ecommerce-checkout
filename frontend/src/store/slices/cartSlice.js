import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "@reduxjs/toolkit";

// Initial state
const initialState = {
  selectedProduct: null,
  selectedVariants: [],
  quantity: 1,
  subtotal: 0,
  tax: 0,
  total: 0,
  sessionId: null, // Add session tracking
};

// Cart slice
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
      // Reset variants when product changes
      state.selectedVariants = [];
      state.quantity = 1;
      cartSlice.caseReducers.calculateTotals(state);
    },
    setSelectedVariants: (state, action) => {
      state.selectedVariants = action.payload;
    },
    setQuantity: (state, action) => {
      const newQuantity = parseInt(action.payload);
      if (newQuantity > 0 && newQuantity <= 10) {
        state.quantity = newQuantity;
        cartSlice.caseReducers.calculateTotals(state);
      }
    },
    incrementQuantity: (state) => {
      if (state.quantity < 10) {
        state.quantity += 1;
        cartSlice.caseReducers.calculateTotals(state);
      }
    },
    decrementQuantity: (state) => {
      if (state.quantity > 1) {
        state.quantity -= 1;
        cartSlice.caseReducers.calculateTotals(state);
      }
    },
    calculateTotals: (state) => {
      if (state.selectedProduct) {
        state.subtotal = state.selectedProduct.price * state.quantity;
        state.tax = state.subtotal * 0.08; // 8% tax
        state.total = state.subtotal + state.tax;
      } else {
        state.subtotal = 0;
        state.tax = 0;
        state.total = 0;
      }
    },
    clearCart: (state) => {
      console.log("🧹 Cart cleared");
      return { ...initialState, sessionId: Date.now() }; // New session ID
    },
    resetVariants: (state) => {
      state.selectedVariants = [];
    },
    // Action to clear cart after successful order
    clearCartAfterOrder: (state) => {
      console.log("🎉 Cart cleared after successful order");
      return { ...initialState, sessionId: Date.now() }; // New session ID
    },
    // Action to start completely fresh shopping session
    startNewSession: (state) => {
      console.log("🔄 Starting completely new shopping session");
      const newSessionId = Date.now();
      return {
        ...initialState,
        sessionId: newSessionId,
      };
    },
    // Force complete reset (for debugging)
    forceReset: (state) => {
      console.log("💥 Force reset - complete cart state cleared");
      return { ...initialState, sessionId: Date.now() };
    },
  },
});

export const {
  setSelectedProduct,
  setSelectedVariants,
  setQuantity,
  incrementQuantity,
  decrementQuantity,
  calculateTotals,
  clearCart,
  resetVariants,
  clearCartAfterOrder,
  startNewSession,
  forceReset,
} = cartSlice.actions;

// Basic selectors
export const selectSelectedProduct = (state) => state.cart.selectedProduct;
export const selectSelectedVariants = (state) => state.cart.selectedVariants;
export const selectQuantity = (state) => state.cart.quantity;
export const selectSubtotal = (state) => state.cart.subtotal;
export const selectTax = (state) => state.cart.tax;
export const selectTotal = (state) => state.cart.total;
export const selectSessionId = (state) => state.cart.sessionId;

// Memoized selectors
export const selectCartSummary = createSelector(
  [
    selectSelectedProduct,
    selectSelectedVariants,
    selectQuantity,
    selectSubtotal,
    selectTax,
    selectTotal,
    selectSessionId,
  ],
  (product, variants, quantity, subtotal, tax, total, sessionId) => ({
    product,
    variants,
    quantity,
    subtotal,
    tax,
    total,
    sessionId,
  })
);

export const selectIsValidSelection = createSelector(
  [selectSelectedProduct, selectSelectedVariants],
  (selectedProduct, selectedVariants) => {
    if (!selectedProduct) return false;

    // Check if all variant types have selections
    const requiredVariants = selectedProduct.variants?.length || 0;
    const selectedCount = selectedVariants.length;

    return requiredVariants === selectedCount && selectedCount > 0;
  }
);

// Selector to check if this is a fresh session
export const selectIsFreshSession = createSelector(
  [selectSessionId, selectSelectedProduct],
  (sessionId, selectedProduct) => {
    // Fresh session if we have a session ID but no selected product
    return sessionId && !selectedProduct;
  }
);

export default cartSlice.reducer;
