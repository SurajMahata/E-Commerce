import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { cartApi } from "../services/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [], count: 0, total: 0 });

  async function refreshCart() {
    if (!user) {
      setCart({ items: [], count: 0, total: 0 });
      return;
    }
    setCart(await cartApi.get());
  }

  async function addToCart(productId, quantity = 1) {
    await cartApi.add({ productId, quantity });
    await refreshCart();
  }

  async function updateQuantity(itemId, quantity) {
    await cartApi.update(itemId, quantity);
    await refreshCart();
  }

  async function removeItem(itemId) {
    await cartApi.remove(itemId);
    await refreshCart();
  }

  useEffect(() => {
    refreshCart();
  }, [user]);

  const value = useMemo(() => ({ cart, refreshCart, addToCart, updateQuantity, removeItem }), [cart, user]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
