import api from './client';

export const catalogApi = {
  getCategories: async () => {
    const response = await api.get('/categories/');
    return response.data;
  },

  getProducts: async (params = {}) => {
    const response = await api.get('/products/', { params });
    return response.data;
  },

  getProduct: async (id) => {
    const response = await api.get(`/products/${id}/`);
    return response.data;
  },
};
