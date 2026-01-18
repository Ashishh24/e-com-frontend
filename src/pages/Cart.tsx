import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { productsAPI, Product, userAPI } from "@/services/api";
import { useDispatch, useSelector } from "react-redux";
import {
  addItem as addItemToSlice,
  removeItem as removeItemFromSlice,
  clearCartItem as clearCartItemFromSlice,
  setCart,
} from "@/utils/cartSlice";

interface CartItemWithProduct {
  productId: string;
  quantity: number;
  itemsTotal: number;
  product: Product;
}

const Cart = () => {
  const cart = useSelector((store: object) => store.cart);
  const { items, total } = cart;
  const dispatch = useDispatch();
  const [cartItemsWithProducts, setCartItemsWithProducts] = useState<
    CartItemWithProduct[]
  >([]);
  const [subTotal, setSubTotal] = useState(0);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const shipping = subTotal > 599 ? 0 : 250;
  useEffect(() => {
    console.log(items, "items");
    const loadProductDetails = async () => {
      if (items.length === 0) {
        setCartItemsWithProducts([]);
        setLoadingProducts(false);
        return;
      }
      setLoadingProducts(true);
      try {
        const newItems: CartItemWithProduct[] = await Promise.all(
          items.map(async (item: object) => {
            const product = await productsAPI.getById(item.product._id);
            console.log(product);
            return {
              ...item,
              product,
            };
          }),
        );
        setCartItemsWithProducts(newItems);
        setSubTotal(total);
      } catch (error) {
        console.error("Failed to load product details:", error);
        setCartItemsWithProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };

    loadProductDetails();
  }, [items]);

  useEffect(() => {
    const newSubTotal = cartItemsWithProducts.reduce(
      (acc, item) => acc + item.itemsTotal,
      0,
    );
    setSubTotal(newSubTotal);
  }, [cartItemsWithProducts]);

  const handleMinus = async (itemId: string) => {
    setCartItemsWithProducts((prev) =>
      prev
        .map((item) =>
          item.product._id === itemId
            ? {
                ...item,
                quantity: item.quantity - 1,
                itemsTotal:
                  (item.quantity - 1) *
                  (item.product.discountedPrice
                    ? item.product.discountedPrice
                    : item.product.price),
              }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
    dispatch(removeItemFromSlice(itemId));
    try {
      const res = await userAPI.removeFromCart(itemId);
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  };

  const handleAddInc = async (itemId: string) => {
    const item = cartItemsWithProducts.find((i) => i.product._id === itemId);
    setCartItemsWithProducts((prev) =>
      prev.map((i) =>
        i.product._id === itemId
          ? {
              ...i,
              quantity: i.quantity + 1,
              itemsTotal:
                (i.quantity + 1) *
                (i.product.discountedPrice
                  ? i.product.discountedPrice
                  : i.product.price),
            }
          : i,
      ),
    );
    dispatch(
      addItemToSlice({
        product: item.product,
        quantity: 1,
        itemsTotal: item.product.discountedPrice
          ? item.product.discountedPrice
          : item.product.price,
      }),
    );
    try {
      const res = await userAPI.addToCart(itemId).catch();
    } catch (err) {
      console.error("Failed to increase item:", err);
    }
  };

  const handleDel = async (itemId: string) => {
    setCartItemsWithProducts((prev) =>
      prev.filter((item) => item.product._id !== itemId),
    );
    dispatch(clearCartItemFromSlice(itemId));
    try {
      const res = await userAPI.clearCart(itemId).catch();
    } catch (err) {
      console.error("Failed to delete item:", err);
    }
  };

  if (loadingProducts) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl md:text-4xl font-light text-candle-warm mb-6 text-center md:text-left">
            Shopping Cart
          </h1>
          <p>
            {subTotal < 599
              ? "Add ₹" +
                (599 - subTotal).toFixed(2) +
                " more to get free shipping"
              : "Congrats! You have unlocked free shipping"}
          </p>
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-4xl font-light text-candle-warm mb-6 text-center md:text-left">
          Shopping Cart
        </h1>

        {cartItemsWithProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-sm md:text-lg mb-4">
              Your cart is empty
            </p>
            <Link to="/products">
              <Button variant="hero" className="w-full sm:w-auto">
                Continue Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-3">
              {cartItemsWithProducts?.map((item) => (
                <Card key={item.product._id}>
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-candle-cream rounded-lg flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-candle-warm text-sm sm:text-base h-6 overflow-hidden truncate">
                          {item.product.name}
                        </h3>
                        <p className="text-base sm:text-lg font-light text-candle-burgundy h-6 overflow-hidden truncate">
                          ₹
                          {item.product.discountedPrice
                            ? item.product.discountedPrice
                            : item.product.price}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 p-0"
                          onClick={() => handleMinus(item.product._id)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-6 text-center text-sm">
                          {item.quantity}
                        </span>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 p-0"
                          onClick={() => handleAddInc(item.product._id)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-destructive h-8 w-8 p-0"
                          onClick={() => handleDel(item.product._id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div>
              <Card className="lg:sticky lg:top-24">
                <CardHeader>
                  <CardTitle className="text-candle-warm">
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-sm md:text-base">
                      ₹ {subTotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-sm md:text-base">₹ {shipping}</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between font-medium text-base md:text-lg">
                      <span>Total</span>
                      <span className="text-candle-burgundy">
                        ₹ {(subTotal + shipping).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <Button className="w-full" variant="hero" size="lg">
                    Proceed to Checkout
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
