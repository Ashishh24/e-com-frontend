import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Trash2, Edit2, Eye } from "lucide-react";
import { productsAPI, Product } from "@/services/api";
import toast from "react-hot-toast";
import { ProductDialog } from "./ProductDialog";
import ProductDetailsDialog from "./ProductDetailsDialog";

interface AdminProduct extends Product {
  status: "active" | "inactive";
}
const AdminProducts = () => {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productsAPI.getAll();
        setProducts(
          data.map((p) => ({ ...p, status: p.inStock ? "active" : "inactive" }))
        );
      } catch (err) {
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [toast]);

  const onClickDelete = async (p) => {
    try {
      setDeleteDialogOpen(false);
      await productsAPI.deleteProduct(p._id);
      setProducts((prev) => prev.filter((prod) => prod._id !== p._id));
      toast.success(`${p.name} deleted successfully.`);
    } catch (error) {
      toast.error("Failed to delete product");
    } finally {
      setDeleteDialogOpen(false); // ✅ close after delete
    }
  };

  const handleProductSave = async (id, product) => {
    try {
      const updatedProduct = await productsAPI.updateProduct(id, product);

      setProducts((prev) =>
        prev.map((prod) =>
          prod._id === id
            ? {
                ...updatedProduct,
                status: updatedProduct.inStock ? "active" : "inactive",
              }
            : prod
        )
      );

      toast.success("Product updated successfully!");
    } catch (err) {
      toast.error("Failed to update product");
    }
  };

  const openProductDialog = (product: Product) => {
    setSelectedProduct(product);
  };

  if (loading) return <p>Loading products...</p>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-light text-candle-warm">Products</h2>
        <ProductDialog
          triggerButton={
            <Button className="bg-candle-warm hover:bg-candle-hover">
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Button>
          }
          onSave={async (product) => {
            const addedProduct = await productsAPI.createProduct(product);
            setProducts((prev) => [
              ...prev,
              {
                ...addedProduct,
                status: addedProduct.inStock ? "active" : "inactive",
              },
            ]);
          }}
        />
      </div>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Fragrances</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((p) => (
              <TableRow key={p._id}>
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.category}</TableCell>
                <TableCell>
                  {p.fragrances && p.fragrances.length > 0
                    ? p.fragrances.slice(0, 2).join(", ")
                    : "-"}
                </TableCell>
                <TableCell>₹{p.discountedPrice}</TableCell>
                <TableCell>{p.inStock ? "Yes" : "No"}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <ProductDetailsDialog
                      product={p}
                      openProductDialog={openProductDialog}
                      selectedProduct={selectedProduct}
                      setSelectedProduct={setSelectedProduct}
                      // onEdit={}
                    />

                    <ProductDialog
                      triggerButton={
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => {
                            console.log(p._id, p.name);
                          }}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      }
                      product={p}
                      onSave={(product) => handleProductSave(p._id, product)}
                    />

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="icon"
                          variant="outline"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeleteDialogOpen(true)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      {deleteDialogOpen && (
                        <DialogContent className="max-w-sm w-full">
                          <DialogHeader>
                            <DialogTitle className="text-candle-warm">
                              Delete Product
                            </DialogTitle>
                          </DialogHeader>
                          <p className="mt-2 text-sm text-muted-foreground">
                            Are you sure you want to delete
                            <strong> {p.name}</strong>? This action cannot be
                            undone.
                          </p>
                          <div className="mt-4 flex justify-end gap-2">
                            <Button
                              variant="outline"
                              onClick={() => setDeleteDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button
                              className="bg-destructive text-white hover:bg-destructive/90"
                              onClick={() => onClickDelete(p)}>
                              Delete
                            </Button>
                          </div>
                        </DialogContent>
                      )}
                    </Dialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};
export default AdminProducts;
