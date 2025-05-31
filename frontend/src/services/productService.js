import api from "./api";

export const productService = {
  // Get all products
  getAllProducts: async () => {
    try {
      const response = await api.get("/products");
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get single product by ID
  getProductById: async (productId) => {
    try {
      const response = await api.get(`/products/${productId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Check stock availability
  checkStock: async (productId, selectedVariants, quantity) => {
    try {
      const response = await api.post(`/products/${productId}/check-stock`, {
        selectedVariants,
        quantity,
      });
      return response;
    } catch (error) {
      throw error;
    }
  },
};
