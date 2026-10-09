import { create } from 'zustand';

const getInitialCart = () => {
  try {
    const saved = localStorage.getItem('cart_items');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveCart = (items) => {
  try {
    localStorage.setItem('cart_items', JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save cart to localStorage', e);
  }
};

export const useCartStore = create((set, get) => ({
  items: getInitialCart(),

  addToCart: (product, quantity = 1) => {
    set((state) => {
      const existingIndex = state.items.findIndex((item) => item.product.id === product.id);
      let updatedItems;
      if (existingIndex > -1) {
        updatedItems = state.items.map((item, index) => {
          if (index === existingIndex) {
            return {
              ...item,
              quantity: item.quantity + quantity,
            };
          }
          return item;
        });
      } else {
        updatedItems = [...state.items, { product, quantity }];
      }
      saveCart(updatedItems);
      return { items: updatedItems };
    });
  },

  removeFromCart: (productId) => {
    set((state) => {
      const updatedItems = state.items.filter((item) => item.product.id !== productId);
      saveCart(updatedItems);
      return { items: updatedItems };
    });
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(productId);
      return;
    }
    set((state) => {
      const updatedItems = state.items.map((item) => {
        if (item.product.id === productId) {
          return { ...item, quantity };
        }
        return item;
      });
      saveCart(updatedItems);
      return { items: updatedItems };
    });
  },

  clearCart: () => {
    saveCart([]);
    set({ items: [] });
  },

  getTotalPrice: () => {
    const { items } = get();
    return items.reduce((sum, item) => {
      return sum + parseFloat(item.product.price) * item.quantity;
    }, 0);
  },

  getTotalItems: () => {
    const { items } = get();
    return items.reduce((sum, item) => sum + item.quantity, 0);
  },
}));
