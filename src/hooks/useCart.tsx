import { ReactNode, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/utils/appStore";
import { useToast } from "@/hooks/use-toast";
import { userAPI } from "@/services/api";
import {
  CartItem as SliceCartItem,
  setCart,
  clearCartItem as clearCartItemFromSlice,
} from "@/utils/cartSlice";

export function useCart() {
  const dispatch = useDispatch();
  const { toast } = useToast();

  const cart = useSelector((store: RootState) => store.cart);
  const user = useSelector((store: RootState) => store.user);

  // -------- Cart Functions --------
  const refreshCart = async () => {
    try {
      const res = await userAPI.getCart();
      const mapped: SliceCartItem[] = res.items.map((item) => ({
        product: item.product,
        quantity: item.quantity,
        itemsTotal: item.itemsTotal,
      }));
      dispatch(setCart(mapped));
    } catch (err) {
      console.error("Failed to load cart:", err);
      toast({
        title: "Error",
        description: "Failed to load cart items",
        variant: "destructive",
      });
    }
  };

  const addItem = async (itemId: string) => {
    try {
      await userAPI.addToCart(itemId);
      await refreshCart();
      toast({
        title: "Added to cart",
        description: "Item has been added to your cart",
      });
    } catch (err) {
      console.error("Failed to add item:", err);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      await userAPI.removeFromCart(itemId);
      await refreshCart();
      toast({
        title: "Item removed",
        description: "Item quantity decreased by 1",
      });
    } catch (err) {
      console.error("Failed to remove item:", err);
      toast({
        title: "Error",
        description: "Failed to remove item from cart",
        variant: "destructive",
      });
    }
  };

  const clearCart = async (itemId: string) => {
    try {
      await userAPI.clearCart(itemId);
      await refreshCart();
      toast({
        title: "Cart cleared",
        description: "All items removed from cart",
      });
    } catch (err) {
      console.error("Failed to clear cart:", err);
      toast({
        title: "Error",
        description: "Failed to clear cart",
        variant: "destructive",
      });
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
