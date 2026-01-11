import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, ShoppingCart } from "lucide-react";
import Header from "@/components/Header";
import { productsAPI, Product } from "@/services/api";
import { useCart } from "@/hooks/useCart";

const ProductDetail = () => {
  const { id } = useParams();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const descriptionLimit = 100;

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;

      try {
        const productData = await productsAPI.getById(id);
        setProduct(productData);
      } catch (error) {
        console.error("Failed to load product:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    await addItem(product._id);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!product?.images?.length) return;

      if (e.key === "ArrowRight") {
        setSelectedImageIndex((prev) => (prev + 1) % product.images.length);
      } else if (e.key === "ArrowLeft") {
        setSelectedImageIndex(
          (prev) => (prev - 1 + product.images.length) % product.images.length
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [product]);

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
                  <div
                    key={i}
                    className="aspect-square bg-muted rounded-md"></div>
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
            <h1 className="text-2xl text-muted-foreground">
              Product not found
            </h1>
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
          <div className="relative w-full max-w-md mx-auto aspect-square bg-black rounded-xl overflow-hidden shadow-md">
            {product.images && product.images.length > 0 ? (
              <>
                <img
                  key={selectedImageIndex}
                  src={product.images[selectedImageIndex]}
                  alt={`Product image ${selectedImageIndex + 1}`}
                  className="w-full h-full object-cover transition-opacity duration-500 opacity-100 animate-fadeIn"
                />
                {/* Previous Button */}
                <button
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-3 hover:bg-black/70 hover:scale-110 transition-transform duration-200"
                  onClick={() =>
                    setSelectedImageIndex(
                      (prev) =>
                        (prev - 1 + product.images.length) %
                        product.images.length
                    )
                  }
                  aria-label="Previous image">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                {/* Next Button */}
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-3 hover:bg-black/70 hover:scale-110 transition-transform duration-200"
                  onClick={() =>
                    setSelectedImageIndex(
                      (prev) => (prev + 1) % product.images.length
                    )
                  }
                  aria-label="Next image">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                No Images
              </div>
            )}
          </div>
          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-light text-candle-warm mb-2">
                {product.name}
              </h1>

              <p className="text-lg text-candle-amber font-light mb-2">
                {product.fragrances.length > 0
                  ? product.fragrances.join(", ")
                  : "-"}
              </p>

              <p className="text-muted-foreground leading-relaxed mb-4">
                {descriptionExpanded ||
                product.description.length <= descriptionLimit
                  ? product.description
                  : `${product.description.slice(0, descriptionLimit)}...`}
                {product.description.length > descriptionLimit && (
                  <button
                    className="text-brown underline ml-2 text-sm"
                    onClick={() =>
                      setDescriptionExpanded(!descriptionExpanded)
                    }>
                    {descriptionExpanded ? "Read Less" : "Read More"}
                  </button>
                )}
              </p>

              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.avgRating)
                          ? "fill-candle-gold text-candle-gold"
                          : "text-muted-foreground"
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
                  <p className="text-xl font-light text-muted-foreground line-through">
                    ₹{product.price}
                  </p>
                )}
                <p className="text-xl font-light text-candle-burgundy">
                  ₹{product.discountedPrice}
                </p>
              </div>
            </div>

            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-medium text-candle-warm">
                  Product Details
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Burn Time:</span>
                    <p className="font-medium">
                      {`${product.burnTime} mins` || "45-50 hours"}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Size:</span>
                    <p className="font-medium">{product.size || "8 oz"}</p>
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Ingredients:</span>
                  <p className="font-medium">
                    {product.ingredients?.join(", ") ||
                      "Natural Soy Wax, Cotton Wick, Premium Fragrance Oils"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <div className="flex space-x-4">
                {product.inStock ? (
                  <Button
                    className="flex-1"
                    variant="hero"
                    size="lg"
                    onClick={handleAddToCart}>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                ) 
                : (
                  <Button
                    className="flex-1"
                    variant="hero"
                    size="lg"
                    onClick={handleAddToCart}
                    disabled={!product.inStock}>
                    Out of Stock
                  </Button>
                )
                }
                <Button
                  size="icon"
                  variant="outline"
                  className="h-11 w-11"
                  // onClick={handleAddToWishlist}
                >
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
