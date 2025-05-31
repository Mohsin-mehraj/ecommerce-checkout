import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { productService } from "../../services/productService";

// Async thunks
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await productService.getAllProducts();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await productService.getProductById(productId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const checkProductStock = createAsyncThunk(
  "products/checkStock",
  async ({ productId, selectedVariants, quantity }, { rejectWithValue }) => {
    try {
      const response = await productService.checkStock(
        productId,
        selectedVariants,
        quantity
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  products: [],
  currentProduct: null,
  stockStatus: null,
  loading: false,
  error: null,
  stockChecking: false,
  stockError: null,
};

// Product slice
const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.stockError = null;
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    clearStockStatus: (state) => {
      state.stockStatus = null;
      state.stockError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
        state.error = null;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Check stock
      .addCase(checkProductStock.pending, (state) => {
        state.stockChecking = true;
        state.stockError = null;
      })
      .addCase(checkProductStock.fulfilled, (state, action) => {
        state.stockChecking = false;
        state.stockStatus = action.payload;
        state.stockError = null;
      })
      .addCase(checkProductStock.rejected, (state, action) => {
        state.stockChecking = false;
        state.stockError = action.payload;
      });
  },
});

export const { clearError, clearCurrentProduct, clearStockStatus } =
  productSlice.actions;

// Selectors
export const selectProducts = (state) => state.products.products;
export const selectCurrentProduct = (state) => state.products.currentProduct;
export const selectProductsLoading = (state) => state.products.loading;
export const selectProductsError = (state) => state.products.error;
export const selectStockStatus = (state) => state.products.stockStatus;
export const selectStockChecking = (state) => state.products.stockChecking;
export const selectStockError = (state) => state.products.stockError;

export default productSlice.reducer;
