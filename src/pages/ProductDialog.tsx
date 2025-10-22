import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { uploadMediaFiles } from "@/utils/uploadMedia";
import { Product } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

interface ProductDialogProps {
  triggerButton?: React.ReactNode;
  product?: Partial<Product>;
  onSave: (product: Product) => Promise<void>;
}

export const ProductDialog: React.FC<ProductDialogProps> = ({
  triggerButton,
  product,
  onSave,
}) => {
  const isEdit = !!product;
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    category: "",
    description: "",
    price: 0,
    discountedPrice: 0,
    burnTime: "",
    size: "",
    ingredients: [],
    fragrances: [],
    images: [],
    inStock: true,
    special: false,
    ...product,
  });
  const [media, setMedia] = useState<string[]>(product?.images || []);
  const [ingredient, setIngredient] = useState("");
  const [fragrance, setFragrance] = useState("");

  useEffect(() => {
    if (product) {
      setFormData({ ...formData, ...product });
      setMedia(product.images || []);
    }
  }, [product]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      images: media,
    }));
  }, [media]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const uploaded: string[] = await uploadMediaFiles(files);
    setMedia((prev) => [...prev, ...uploaded]);
    e.target.value = "";
  };

  const removeMedia = (index: number) =>
    setMedia(media.filter((_, i) => i !== index));

  const addIngredient = () => {
    if (!ingredient.trim()) return;
    setFormData((prev) => ({
      ...prev,
      ingredients: [...(prev.ingredients || []), ingredient.trim()],
    }));
    setIngredient("");
  };

  const removeIngredient = (index: number) =>
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients?.filter((_, i) => i !== index) || [],
    }));

  const addFragrance = () => {
    if (!fragrance.trim()) return;
    setFormData((prev) => ({
      ...prev,
      fragrances: [...(prev.fragrances || []), fragrance.trim()],
    }));
    setFragrance("");
  };

  const removeFragrance = (index: number) =>
    setFormData((prev) => ({
      ...prev,
      fragrances: prev.fragrances?.filter((_, i) => i !== index) || [],
    }));

  const handleSave = async () => {
    if (
      !formData.name ||
      !formData.category ||
      !formData.description ||
      !formData.price ||
      !formData.size
    ) {
      toast({
        title: "Error",
        description: "Please fill all required fields!",
        variant: "destructive",
      });
      return;
    }

    console.log(formData);
    const productToSave: Product = {
      ...formData,
      images: media,
    } as Product;

    if (productToSave.images.length === 0) {
      toast({
        title: "Error",
        description: "At least one product photo is required!",
        variant: "destructive",
      });
      return;
    }

    try {
      await onSave(productToSave);
      toast({
        title: "Success",
        description: `Product ${isEdit ? "updated" : "added"} successfully!`,
      });
      setOpen(false);
      if (!isEdit) {
        setFormData({
          name: "",
          category: "",
          description: "",
          price: 0,
          discountedPrice: 0,
          burnTime: "",
          size: "",
          ingredients: [],
          fragrances: [],
          images: [],
          inStock: true,
          special: false,
        });
        setMedia([]);
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: `Failed to ${isEdit ? "update" : "add"} product.`,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {triggerButton && <DialogTrigger asChild>{triggerButton}</DialogTrigger>}
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-candle-warm">
            {isEdit ? "Edit Product" : "Add New Product"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Name *</Label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </div>

          <div>
            <Label>Category *</Label>
            <Input
              value={formData.category}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, category: e.target.value }))
              }
            />
          </div>

          <div className="col-span-2">
            <Label>Description *</Label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="resize-none"
            />
          </div>

          <div>
            <Label>Price (₹) *</Label>
            <Input
              type="number"
              value={formData.price}
              // className="appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-moz-appearance]:textfield border rounded px-2 py-1"
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  price: Number(e.target.value),
                }))
              }
            />
          </div>

          <div>
            <Label>Discounted Price</Label>
            <Input
              type="number"
              value={formData.discountedPrice}
              // className="appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-moz-appearance]:textfield border rounded px-2 py-1"
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  discountedPrice: Number(e.target.value),
                }))
              }
            />
          </div>

          <div>
            <Label>Size *</Label>
            <Input
              value={formData.size}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, size: e.target.value }))
              }
            />
          </div>

          <div>
            <Label>Burn Time (in mins)</Label>
            <Input
              type="number"
              value={formData.burnTime}
              // className="appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-moz-appearance]:textfield border rounded px-2 py-1"
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, burnTime: e.target.value }))
              }
            />
          </div>

          <div>
            <Label>In Stock</Label>
            <select
              value={formData.inStock ? "true" : "false"}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  inStock: e.target.value === "true",
                }))
              }
              className="w-full rounded-md border border-gray-300 p-2">
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>

          <div>
            <Label>Special</Label>
            <select
              value={formData.special ? "true" : "false"}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  special: e.target.value === "true",
                }))
              }
              className="w-full rounded-md border border-gray-300 p-2">
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </div>

          {/* Ingredients */}
          <div className="col-span-2">
            <Label>Ingredients</Label>
            <div className="flex gap-2 mt-1">
              <Input
                placeholder="Type ingredient and press Enter"
                value={ingredient}
                onChange={(e) => setIngredient(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addIngredient()}
              />
              <Button onClick={addIngredient}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.ingredients?.map((ing, i) => (
                <span
                  key={i}
                  className="flex items-center gap-1 bg-gray-200 px-2 py-1 rounded-full">
                  {ing}
                  <button
                    onClick={() => removeIngredient(i)}
                    className="text-red-500">
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Fragrances */}
          <div className="col-span-2">
            <Label>Fragrances</Label>
            <div className="flex gap-2 mt-1">
              <Input
                placeholder="Type fragrance and press Enter"
                value={fragrance}
                onChange={(e) => setFragrance(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addFragrance()}
              />
              <Button onClick={addFragrance}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.fragrances?.map((f, i) => (
                <span
                  key={i}
                  className="flex items-center gap-1 bg-gray-200 px-2 py-1 rounded-full">
                  {f}
                  <button
                    onClick={() => removeFragrance(i)}
                    className="text-red-500">
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Media */}
          <div className="col-span-2 grid grid-cols-2 gap-3">
            {media.map((url, i) => (
              <div key={i} className="relative">
                <img
                  src={url}
                  alt="preview"
                  className="w-full h-40 object-cover rounded-lg"
                />
                <button
                  onClick={() => removeMedia(i)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs cursor-pointer">
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 mt-3 col-span-2">
            <label className="cursor-pointer ">
              📷 Add Some Images
              {/* Add Some Images */}
              <input
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          <Button
            className="mt-4 w-full bg-candle-warm hover:bg-candle-hover col-span-2"
            onClick={handleSave}>
            {isEdit ? "Save Changes" : "Add Product"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
