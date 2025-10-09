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
          })
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
      0
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
                itemsTotal: (item.quantity - 1) * item.product.discountedPrice,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
    dispatch(removeItemFromSlice(itemId));
    try {
      const res = await userAPI.removeFromCart(itemId);
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  };

  const handleAddInc = async (itemId: string) => {
    console.log(cartItemsWithProducts);
    console.log(itemId);

    const item = cartItemsWithProducts.find((i) => i.product._id === itemId);

    console.log(item);
    setCartItemsWithProducts((prev) =>
      prev.map((i) =>
        i.product._id === itemId
          ? {
              ...i,
              quantity: i.quantity + 1,
              itemsTotal: (i.quantity + 1) * i.product.discountedPrice,
            }
          : i
      )
    );
    dispatch(
      addItemToSlice({
        product: item.product,
        quantity: 1,
        itemsTotal: item.product.discountedPrice,
      })
    );
    try {
      console.log("calling apiiiii");
      console.log(itemId);
      const res = await userAPI.addToCart(itemId).catch();
      console.log(res);

      console.log("called apiiiii");
    } catch (err) {
      console.error("Failed to increase item:", err);
    }
  };

  const handleDel = async (itemId: string) => {
    setCartItemsWithProducts((prev) =>
      prev.filter((item) => item.product._id !== itemId)
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
          <h1 className="text-4xl font-light text-candle-warm mb-8">
            Shopping Cart
          </h1>
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
        <h1 className="text-4xl font-light text-candle-warm mb-8">
          Shopping Cart
        </h1>

        {cartItemsWithProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-4">
              Your cart is empty
            </p>
            <Link to="/products">
              <Button variant="hero">Continue Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartItemsWithProducts?.map((item) => (
                <Card key={item.product._id}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-20 bg-candle-cream rounded-lg flex-shrink-0"></div>
                      <div className="flex-1">
                        <h3 className="font-medium text-candle-warm">
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-candle-amber">
                          {item.product.fragrances.join(", ")}
                        </p>
                        <p className="text-lg font-light text-candle-burgundy">
                          ₹{item.product.discountedPrice}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => handleMinus(item.product._id)}>
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => handleAddInc(item.product._id)}>
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDel(item.product._id)}
                          className="text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="text-candle-warm">
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between font-medium text-lg">
                      <span>Total</span>
                      <span className="text-candle-burgundy">
                        ₹{subTotal.toFixed(2)}
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
