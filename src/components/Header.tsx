import { ShoppingCart, User, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { useSelector } from "react-redux";
import { RootState } from "@/utils/appStore"; // adjust path
import { ReactNode } from "react";

const Header = () => {
  const { cart } = useCart();
  const userData = useSelector((store: RootState) => store.user);

  const itemCount = cart.itemCount;

  return (
    <header className="border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="text-2xl font-light text-candle-warm hover:text-candle-amber transition-colors">
            GLOWISHII...
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-muted-foreground hover:text-candle-warm transition-colors">
              Home
            </Link>
            <Link
              to="/products"
              className="text-muted-foreground hover:text-candle-warm transition-colors">
              Products
            </Link>
            <Link
              to="/orders"
              className="text-muted-foreground hover:text-candle-warm transition-colors">
              Orders
            </Link>
            <Link
              to="/admin"
              className="text-muted-foreground hover:text-candle-warm transition-colors">
              Admin
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2">
              <Input placeholder="Search candles..." className="w-64" />
              <Button size="icon" variant="ghost">
                <Search className="h-4 w-4" />
              </Button>
            </div>

            <Link to="/cart">
              <Button size="icon" variant="ghost" className="relative">
                <ShoppingCart className="h-4 w-4" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-candle-amber text-candle-cream text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Button>
            </Link>

            {userData === null ? <Link to="/login">
              <Button size="icon" variant="ghost">
                <User className="h-4 w-4" />
              </Button>
            </Link> : 
            <Link to="/profile">
              <Button size="icon" variant="ghost">
                <User className="h-4 w-4" />
              </Button>
            </Link>
            }
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
