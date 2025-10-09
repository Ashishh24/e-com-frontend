import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { productsAPI, Product } from "@/services/api";
import { useCart } from "@/hooks/useCart";
import candlesCollection from "@/assets/candles-collection.jpg";

// Using Product interface from API service

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        const featuredProducts = await productsAPI.getFeatured();
        setProducts(featuredProducts.slice(0, 3)); // Show only first 3
      } catch (error) {
        console.error('Failed to load featured products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedProducts();
  }, []);

  const handleAddToCart = async (productId: string) => {
    await addItem(productId, 1);
  };

  return (
    <section className="py-20 bg-gradient-warm">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-light text-candle-warm mb-4">
            Featured Collection
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Each candle is carefully crafted in small batches using the finest natural ingredients
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {loading ? (
            // Loading skeleton
            [...Array(3)].map((_, index) => (
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
          ) : (
            products.map((product) => (
              <Card key={product._id} className="group hover:shadow-soft transition-all duration-300 border-border/50">
                <CardContent className="p-6 space-y-4">
                  <div className="aspect-square bg-candle-cream rounded-lg overflow-hidden mb-4">
                    <div className="w-full h-full bg-gradient-glow opacity-20"></div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-medium text-candle-warm">{product.name}</h3>
                    <p className="text-sm text-candle-amber font-light">{product.fragrances[0]}</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">{product.description}</p>
                  </div>
                  <div className="flex items-center justify-between pt-4">
                    <span className="text-2xl font-light text-candle-burgundy">₹{product.discountedPrice}</span>
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={() => handleAddToCart(product._id)}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="text-center">
          <img 
            src={candlesCollection} 
            alt="Beautiful collection of artisan candles"
            className="w-full max-w-4xl mx-auto rounded-lg shadow-soft mb-8"
          />
          <Button variant="hero" size="lg" className="px-12 py-6">
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;