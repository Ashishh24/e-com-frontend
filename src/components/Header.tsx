import { useEffect, useRef, useState } from "react";
import { ShoppingCart, User, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useCart } from "@/hooks/useCart";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/utils/appStore";
import { removeUser } from "@/utils/userSlice";

const Header = () => {
  const { cart } = useCart();
  const user = useSelector((store: RootState) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const itemCount = cart.itemCount;

  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [searchText, setSearchText] = useState("");

  const searchRef = useRef<HTMLDivElement>(null);

  /* close search on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowMobileSearch(false);
      }
    };

    if (showMobileSearch) {
      document.addEventListener("mousedown", handler);
    }

    return () => document.removeEventListener("mousedown", handler);
  }, [showMobileSearch]);

  const handleSearch = () => {
    if (!searchText.trim()) return;
    navigate(`/products?search=${encodeURIComponent(searchText.trim())}`);
    setShowMobileSearch(false);
    setSearchText("");
  };

  return (
    <header className="border-b border-border/50 bg-background/95 backdrop-blur sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* LOGO */}
          <Link
            to="/"
            className="text-4xl font-light text-candle-warm hover:text-candle-amber transition-colors"
          >
            GLOWISHII...
          </Link>

          {/* DESKTOP LINKS */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/products" className="hover:text-candle-warm">
              Products
            </Link>
            <Link to="/orders" className="hover:text-candle-warm">
              Orders
            </Link>
            {user?.isAdmin && (
              <Link to="/admin" className="hover:text-candle-warm">
                Admin
              </Link>
            )}
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-3">
            {/* DESKTOP SEARCH */}
            <div className="hidden md:flex items-center gap-2">
              <Input
                placeholder="Search candles..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-64"
              />
              <Button size="icon" variant="ghost" onClick={handleSearch}>
                <Search className="h-4 w-4" />
              </Button>
            </div>

            {/* MOBILE SEARCH ICON */}
            <Button
              size="icon"
              variant="ghost"
              className="md:hidden"
              onClick={() => setShowMobileSearch(!showMobileSearch)}
            >
              <Search className="h-4 w-4" />
            </Button>

            {/* DESKTOP CART */}
            <Link to="/cart" className="hidden md:block">
              <Button size="icon" variant="ghost" className="relative">
                <ShoppingCart className="h-4 w-4" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-candle-amber text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* USER DROPDOWN */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost">
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-48">
                {user ? (
                  <>
                    <DropdownMenuItem disabled>
                      Hi, {user.name}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                      My Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/orders")}>
                      My Orders
                    </DropdownMenuItem>

                    {/* MOBILE CART */}
                    <DropdownMenuItem
                      className="md:hidden"
                      onClick={() => navigate("/cart")}
                    >
                      Cart ({itemCount})
                    </DropdownMenuItem>

                    {/* MOBILE ADMIN LINK */}
                    {user.isAdmin && (
                      <DropdownMenuItem
                        className="md:hidden"
                        onClick={() => navigate("/admin")}
                      >
                        Admin Dashboard
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        dispatch(removeUser());
                        navigate("/login");
                      }}
                    >
                      Logout
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem onClick={() => navigate("/login")}>
                    Login
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* MOBILE SEARCH POPUP */}
      {showMobileSearch && (
        <div className="flex md:hidden w-full">
          <Input
            placeholder="Search candles..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="w-full"
          />
        </div>
      )}
    </header>
  );
};

export default Header;
