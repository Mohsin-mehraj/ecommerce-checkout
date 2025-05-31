import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { orderService } from "../../services/orderService";

// Async thunks
export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await orderService.createOrder(orderData);
      return response;
    } catch (error) {
      return rejectWithValue({
        message: error.message,
        errors: error.errors || [],
      });
    }
  }
);

export const fetchOrderByNumber = createAsyncThunk(
  "orders/fetchOrderByNumber",
  async (orderNumber, { rejectWithValue }) => {
    try {
      const response = await orderService.getOrderByNumber(orderNumber);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Clear customer session
export const clearCustomerSession = createAsyncThunk(
  "orders/clearCustomerSession",
  async (_, { rejectWithValue }) => {
    try {
      const response = await orderService.clearSession();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  currentOrder: null,
  orderHistory: [],
  loading: false,
  submitting: false,
  error: null,
  validationErrors: [],
  lastOrderNumber: null,
  sessionCleared: false,
};

// Order slice
const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.validationErrors = [];
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
      state.lastOrderNumber = null;
    },
    setLastOrderNumber: (state, action) => {
      state.lastOrderNumber = action.payload;
    },
    resetOrderState: (state) => {
      return {
        ...initialState,
        sessionCleared: true,
      };
    },
    clearValidationErrors: (state) => {
      state.validationErrors = [];
    },
    // Mark session as cleared to trigger form reset
    markSessionCleared: (state) => {
      state.sessionCleared = true;
    },
    // Reset session cleared flag
    resetSessionFlag: (state) => {
      state.sessionCleared = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create order
      .addCase(createOrder.pending, (state) => {
        state.submitting = true;
        state.error = null;
        state.validationErrors = [];
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.submitting = false;
        state.lastOrderNumber = action.payload.data.orderNumber;
        state.error = null;
        state.validationErrors = [];

        // Add to order history
        const orderSummary = {
          orderNumber: action.payload.data.orderNumber,
          status: action.payload.data.status,
          total: action.payload.data.total,
          createdAt: new Date().toISOString(),
        };
        state.orderHistory.unshift(orderSummary);

        // Mark that order was successful - trigger session clearing
        state.sessionCleared = true;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload.message;
        state.validationErrors = action.payload.errors || [];
      })
      // Fetch order by number
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Clear customer session
      .addCase(clearCustomerSession.fulfilled, (state, action) => {
        state.sessionCleared = true;
      });
  },
});

export const {
  clearError,
  clearCurrentOrder,
  setLastOrderNumber,
  resetOrderState,
  clearValidationErrors,
  markSessionCleared,
  resetSessionFlag,
} = orderSlice.actions;

// Selectors
export const selectCurrentOrder = (state) => state.orders.currentOrder;
export const selectOrderHistory = (state) => state.orders.orderHistory;
export const selectOrderLoading = (state) => state.orders.loading;
export const selectOrderSubmitting = (state) => state.orders.submitting;
export const selectOrderError = (state) => state.orders.error;
export const selectValidationErrors = (state) => state.orders.validationErrors;
export const selectLastOrderNumber = (state) => state.orders.lastOrderNumber;
export const selectSessionCleared = (state) => state.orders.sessionCleared;

// Complex selectors
export const selectOrderErrorsByField = (state) => {
  const errors = state.orders.validationErrors;
  return errors.reduce((acc, error) => {
    acc[error.field] = error.message;
    return acc;
  }, {});
};

export default orderSlice.reducer;
