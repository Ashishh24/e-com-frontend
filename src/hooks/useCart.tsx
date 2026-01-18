import { ReactNode, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/utils/appStore";
import { userAPI } from "@/services/api";
import {
  CartItem,
  setCart,
  clearCartItem as clearCartItemFromSlice,
} from "@/utils/cartSlice";
import toast from "react-hot-toast";

export function useCart() {
  const dispatch = useDispatch();

  const cart = useSelector((store: RootState) => store.cart);
  const user = useSelector((store: RootState) => store.user);

  // -------- Cart Functions --------
  const refreshCart = async () => {
    try {
      const res = await userAPI.getCart();
      const mapped: CartItem[] = res.items.map((item) => ({
        product: item.product,
        quantity: item.quantity,
        itemsTotal: item.itemsTotal,
      }));
      dispatch(setCart(mapped));
    } catch (err) {
      console.error("Failed to load cart:", err);
      toast.error("Failed to load cart items");
    }
  };

  const addItem = async (itemId: string) => {
    try {
      await userAPI.addToCart(itemId);
      await refreshCart();
      toast.success("Item added to cart");
    } catch (err) {
      console.error("Failed to add item:", err);
      toast.error("Failed to add item to cart");
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      await userAPI.removeFromCart(itemId);
      await refreshCart();
      toast.success("Item removed from cart");
    } catch (err) {
      console.error("Failed to remove item:", err);
      toast.error("Failed to remove item from cart");
    }
  };

  const clearCart = async (itemId: string) => {
    try {
      await userAPI.clearCart(itemId);
      await refreshCart();
      toast.success("Cart cleared");
    } catch (err) {
      console.error("Failed to clear cart:", err);
      toast.error("Failed to clear cart");
    }
  };

  useEffect(() => {
    if (user) refreshCart();
  }, [user]);

  return {
    cart,
    refreshCart,
    addItem,
    removeItem,
    clearCart,
  };
}
