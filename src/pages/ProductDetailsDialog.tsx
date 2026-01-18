import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit2, Eye } from "lucide-react";
import { Product, productsAPI } from "@/services/api";
import { ProductDialog } from "./ProductDialog";

interface ProductDetailsDialogProps {
  product: Product;
  openProductDialog: (product: Product) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
}

const ProductDetailsDialog: React.FC<ProductDetailsDialogProps> = ({
  product,
  openProductDialog,
  selectedProduct,
  setSelectedProduct,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          onClick={() => openProductDialog(product)}>
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      {selectedProduct && (
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-candle-warm">
              Product Details
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <p>
                <strong>Product Name:</strong> {selectedProduct.name}
              </p>
              <p>
                <strong>Category:</strong> {selectedProduct.category}
              </p>
              <p>
                <strong>Description:</strong> {selectedProduct.description}
              </p>
              <p>
                <strong>Price:</strong> ₹{selectedProduct.price}
              </p>
              <p>
                <strong>Discounted Price:</strong> ₹
                {selectedProduct.discountedPrice}
              </p>
              <p>
                <strong>Burn Time (in mins):</strong> {selectedProduct.burnTime}
              </p>
              <p>
                <strong>Size:</strong> {selectedProduct.size}
              </p>

              <p>
                <strong>Ingredients:</strong>
              </p>
              <p>
                {selectedProduct.ingredients?.length
                  ? selectedProduct.ingredients.join(", ")
                  : "-"}
              </p>

              <p>
                <strong>Fragrances:</strong>
              </p>
              <p>
                {selectedProduct.fragrances?.length
                  ? selectedProduct.fragrances.join(", ")
                  : "-"}
              </p>
            </div>

            {/* Images */}
            <p>
              <strong>Images</strong>
            </p>
            <div className="flex gap-2">
              {selectedProduct.images && selectedProduct.images.length > 0 ? (
                selectedProduct.images
                  .slice(0, 3)
                  .map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`product-${idx}`}
                      className="w-20 h-20 object-cover rounded-md border border-border"
                    />
                  ))
              ) : (
                <span className="text-xs text-muted-foreground">No images</span>
              )}
            </div>

            <div>
              <Button
                onClick={() => setSelectedProduct(null)}
                className="w-full mt-4">
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default ProductDetailsDialog;
