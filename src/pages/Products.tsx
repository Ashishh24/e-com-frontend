import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [filterCategory, setFilterCategory] = useState("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

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

  const filteredProducts = products
    .filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.fragrances.some((fragrance) =>
          fragrance.toLowerCase().includes(searchTerm.toLowerCase())
        )
    )
    .filter(
      (product) =>
        filterCategory === "all" || product.category === filterCategory
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.discountedPrice - b.discountedPrice;
        case "price-high":
          return b.discountedPrice - a.discountedPrice;
        case "rating":
          return b.avgRating - a.avgRating;
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-light text-candle-warm mb-4">
            Our Candle Collection
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Discover our carefully curated selection of premium hand-poured
            candles
          </p>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <Input
              placeholder="Search candles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>

          <div className="flex gap-4">
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[180px]">
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

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading
            ? // Loading skeleton
              [...Array(6)].map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <CardContent className="p-6 space-y-4">
                    <div className="aspect-square bg-muted rounded-lg"></div>
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
                  className="group hover:shadow-soft transition-all duration-300">
                  <CardContent className="p-6 space-y-4">
                    <div className="aspect-square bg-candle-cream rounded-lg overflow-hidden mb-4 relative">
                      <div className="w-full h-full bg-gradient-glow opacity-20"></div>
                      {!product.inStock && (
                        <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                          <Badge variant="secondary">Out of Stock</Badge>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-medium text-candle-warm">
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
                        {product.fragrances.join(", ")}
                      </p>
                      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                        {product.description}
                      </p>

                      <div className="text-sm text-muted-foreground">
                        {product.reviews.length} reviews
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4">
                      <div className="flex items-center gap-2">
                        {product.price !== product.discountedPrice && (
                          <span className="text-lg text-muted-foreground line-through">
                            ₹{product.price}
                          </span>
                        )}
                        <span className="text-xl font-light text-candle-burgundy">
                          ₹{product.discountedPrice}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <Link to={`/product/${product._id}`}>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </Link>
                        <Button
                          variant="secondary"
                          size="sm"
                          disabled={!product.inStock}
                          onClick={() => handleAddToCart(product._id)}>
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
              }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
