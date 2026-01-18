import { useState, useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Star, Filter } from "lucide-react";
import Header from "@/components/Header";
import { productsAPI, Product } from "@/services/api";
import { useCart } from "@/hooks/useCart";
import { getDiscountPercentage } from "@/utils/utils";

const Products = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  // const [searchTerm, setSearchTerm] = useState("");
  // const [sortBy, setSortBy] = useState("name");
  // const [filterCategory, setFilterCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState(query.get("search") || "");
  const [filterCategory, setFilterCategory] = useState(
    query.get("category") || "all",
  );
  const [sortBy, setSortBy] = useState(query.get("sort") || "name");

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    setSearchTerm(query.get("search") || "");
    setFilterCategory(query.get("category") || "all");
    setSortBy(query.get("sort") || "name");
  }, [location.search]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const allProducts = await productsAPI.getAll();
        setProducts(allProducts);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const handleAddToCart = async (productId: string) => {
    await addItem(productId);
  };

  // const filteredProducts = products
  //   .filter(
  //     (product) =>
  //       product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       product.fragrances.some((fragrance) =>
  //         fragrance.toLowerCase().includes(searchTerm.toLowerCase()),
  //       ),
  //   )
  //   .filter(
  //     (product) =>
  //       filterCategory === "all" || product.category === filterCategory,
  //   )
  //   .sort((a, b) => {
  //     switch (sortBy) {
  //       case "price-low":
  //         return a.discountedPrice - b.discountedPrice;
  //       case "price-high":
  //         return b.discountedPrice - a.discountedPrice;
  //       case "rating":
  //         return b.avgRating - a.avgRating;
  //       case "name":
  //       default:
  //         return a.name.localeCompare(b.name);
  //     }
  //   });

  const filteredProducts = useMemo(() => {
    let result = products;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.fragrances?.some((f) => f.toLowerCase().includes(term)),
      );
    }

    if (filterCategory !== "all") {
      result = result.filter((p) => p.category === filterCategory);
    }

    return result.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return (
            (a.discountedPrice ? a.discountedPrice : a.price) -
            (b.discountedPrice ? b.discountedPrice : b.price)
          );
        case "price-high":
          return (
            (b.discountedPrice ? b.discountedPrice : b.price) -
            (a.discountedPrice ? a.discountedPrice : a.price)
          );
        case "rating":
          return b.avgRating - a.avgRating;
        default:
          return a.name.localeCompare(b.name);
      }
    });
  }, [products, searchTerm, filterCategory, sortBy]);

  const updateURL = (key: string, value: string) => {
    const params = new URLSearchParams(location.search);
    value === "all" || value === ""
      ? params.delete(key)
      : params.set(key, value);
    navigate(`/products?${params.toString()}`);
  };

  const clearAllFilters = () => {
    navigate("/products");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-4xl font-light text-candle-warm mb-3 text-center md:text-left">
            Our Candle Collection
          </h1>
          <p className="text-sm md:text-lg text-muted-foreground max-w-none md:max-w-2xl mx-auto md:mx-0 text-center md:text-left">
            Discover our carefully curated selection of premium hand-poured
            candles
          </p>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <Input
              placeholder="Search candles..."
              value={searchTerm}
              onChange={(e) => updateURL("search", e.target.value)}
              className="md:max-w-md"
            />

            {/* <div className="flex flex-col sm:flex-row gap-4 w-full"> */}
            <Select
              value={filterCategory}
              // onValueChange={setFilterCategory}
              onValueChange={(v) => updateURL("category", v)}
            >
              <SelectTrigger className="w-full md:w-[320px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="relaxation">Relaxation</SelectItem>
                <SelectItem value="energizing">Energizing</SelectItem>
                <SelectItem value="nature">Nature</SelectItem>
                <SelectItem value="fresh">Fresh</SelectItem>
                <SelectItem value="seasonal">Seasonal</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={sortBy}
              // onValueChange={setSortBy}
              onValueChange={(v) => updateURL("sort", v)}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={clearAllFilters}>
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {loading
            ? // Loading skeleton
              [...Array(6)].map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <CardContent className="p-4 sm:p-6 space-y-4">
                    <div className="aspect-[4/3] sm:aspect-square bg-muted rounded-lg"></div>
                    <div className="space-y-2">
                      <div className="h-6 bg-muted rounded"></div>
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-12 bg-muted rounded"></div>
                    </div>
                  </CardContent>
                </Card>
              ))
            : filteredProducts.map((product) => (
                <Card
                  key={product._id}
                  className="group hover:shadow-soft transition-all duration-300"
                >
                  <CardContent className="p-4 sm:p-6 space-y-4">
                    <div className="aspect-[4/3] sm:aspect-square bg-candle-cream rounded-lg overflow-hidden mb-4 relative">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="w-full h-full bg-gradient-glow opacity-20 absolute top-0 left-0"></div>
                      {!product.inStock && (
                        <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                          <Badge variant="secondary">Out of Stock</Badge>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base md:text-lg font-semibold text-candle-warm">
                          {product.name}
                        </h3>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 fill-candle-gold text-candle-gold" />
                          <span className="text-sm text-muted-foreground">
                            {product.avgRating}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-candle-amber font-light">
                        {product.fragrances.length > 0
                          ? product.fragrances.join(", ")
                          : "-"}
                      </p>
                      <p className="text-muted-foreground text-sm leading-relaxed truncate">
                        {product.description}
                      </p>

                      <div className="text-sm text-muted-foreground">
                        {product.reviews.length} reviews
                      </div>
                    </div>

                    <div className="flex flex-col pt-4 gap-6">
                      {/* PRICE — LEFT */}
                      <div className="self-start flex items-center gap-2">
                        {product.discountedPrice ? (
                          <>
                            <span className="text-lg text-muted-foreground line-through">
                              ₹{product.price}
                            </span>

                            <span className="text-xl font-light text-candle-burgundy">
                              ₹{product.discountedPrice}
                            </span>

                            <span className="text-sm font-light text-candle-burgundy">
                              (
                              {getDiscountPercentage(
                                product.price,
                                product.discountedPrice,
                              )}
                              % off)
                            </span>
                          </>
                        ) : (
                          <span className="text-xl font-light text-candle-burgundy">
                            ₹{product.price}
                          </span>
                        )}
                      </div>

                      {/* BUTTONS — CENTER */}
                      <div className="self-center flex flex-row gap-2 w-full sm:w-auto">
                        <Link
                          to={`/product/${product._id}`}
                          className="flex-1 sm:flex-none"
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full sm:w-auto"
                          >
                            View Details
                          </Button>
                        </Link>

                        <Button
                          variant="secondary"
                          size="sm"
                          className="w-full sm:w-auto"
                          disabled={!product.inStock}
                          onClick={() => handleAddToCart(product._id)}
                        >
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-4">
              No products found matching your criteria
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setFilterCategory("all");
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
