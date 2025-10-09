import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, Minus, Plus, ShoppingCart } from "lucide-react";
import Header from "@/components/Header";
import { productsAPI, Product } from "@/services/api";
import { useCart } from "@/hooks/useCart";

const ProductDetail = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      
      try {
        const productData = await productsAPI.getById(id);
        setProduct(productData);
      } catch (error) {
        console.error('Failed to load product:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    await addItem(product._id, quantity);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-2 gap-12 animate-pulse">
            <div className="space-y-4">
              <div className="aspect-square bg-muted rounded-lg"></div>
              <div className="grid grid-cols-3 gap-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="aspect-square bg-muted rounded-md"></div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="h-12 bg-muted rounded"></div>
              <div className="h-6 bg-muted rounded w-3/4"></div>
              <div className="h-24 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl text-muted-foreground">Product not found</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-candle-cream rounded-lg overflow-hidden">
              <div className="w-full h-full bg-gradient-glow opacity-20"></div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  className={`aspect-square bg-candle-cream rounded-md overflow-hidden ${
                    selectedImageIndex === index ? 'ring-2 ring-candle-amber' : ''
                  }`}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <div className="w-full h-full bg-gradient-glow opacity-20"></div>
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-light text-candle-warm mb-2">{product.name}</h1>
              <p className="text-lg text-candle-amber font-light mb-4">{product.fragrances.join(', ')}</p>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.avgRating) 
                          ? 'fill-candle-gold text-candle-gold' 
                          : 'text-muted-foreground'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-muted-foreground">
                    {product.avgRating} ({product.reviews.length} reviews)
                  </span>
                </div>
                {product.inStock && <Badge variant="secondary">In Stock</Badge>}
              </div>

              <div className="flex items-center gap-4 mb-6">
                {product.price !== product.discountedPrice && (
                  <p className="text-xl font-light text-muted-foreground line-through">${product.price}</p>
                )}
                <p className="text-xl font-light text-candle-burgundy">₹{product.discountedPrice}</p>
              </div>
            </div>

            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-medium text-candle-warm">Product Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Burn Time:</span>
                    <p className="font-medium">{product.burnTime || "45-50 hours"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Size:</span>
                    <p className="font-medium">{product.size || "8 oz"}</p>
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Ingredients:</span>
                  <p className="font-medium">{product.ingredients?.join(", ") || "Natural Soy Wax, Cotton Wick, Premium Fragrance Oils"}</p>
                </div>
              </CardContent>
            </Card>

            <p className="text-muted-foreground leading-relaxed">{product.description}</p>

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="font-medium">Quantity:</span>
                <div className="flex items-center space-x-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{quantity}</span>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button 
                  className="flex-1" 
                  variant="hero" 
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
                <Button size="icon" variant="outline" className="h-11 w-11">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;