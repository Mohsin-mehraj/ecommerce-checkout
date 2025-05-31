import api from "./api";

export const orderService = {
  // Create new order (checkout)
  createOrder: async (orderData) => {
    try {
      const response = await api.post("/orders", orderData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get order by order number
  getOrderByNumber: async (orderNumber) => {
    try {
      const response = await api.get(`/orders/${orderNumber}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Clear session for new order
  clearSession: async () => {
    try {
      const response = await api.post("/orders/clear-session");
      return response;
    } catch (error) {
      throw error;
    }
  },
};
