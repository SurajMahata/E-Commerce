import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { cartApi } from "../services/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user, isAdmin } = useAuth();
  const [cart, setCart] = useState({ items: [], count: 0, total: 0 });

  async function refreshCart() {
    if (!user || isAdmin) {
      setCart({ items: [], count: 0, total: 0 });
      return;
    }
    setCart(await cartApi.get());
  }

  async function addToCart(productId, quantity = 1) {
    if (isAdmin) {
      return;
    }
    await cartApi.add({ productId, quantity });
    await refreshCart();
  }

  async function updateQuantity(itemId, quantity) {
    if (isAdmin) {
      return;
    }
    await cartApi.update(itemId, quantity);
    await refreshCart();
  }

  async function removeItem(itemId) {
    if (isAdmin) {
      return;
    }
    await cartApi.remove(itemId);
    await refreshCart();
  }

  useEffect(() => {
    refreshCart();
  }, [user, isAdmin]);

  const value = useMemo(() => ({ cart, refreshCart, addToCart, updateQuantity, removeItem }), [cart, user, isAdmin]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
