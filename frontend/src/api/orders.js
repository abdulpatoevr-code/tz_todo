import api from './client';

export const ordersApi = {
  createOrder: async (orderData) => {
    const response = await api.post('/orders/', orderData);
    return response.data;
  },

  getOrders: async () => {
    const response = await api.get('/orders/');
    return response.data;
  },

  getOrder: async (id) => {
    const response = await api.get(`/orders/${id}/`);
    return response.data;
  },
};
