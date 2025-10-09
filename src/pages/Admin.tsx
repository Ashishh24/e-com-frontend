import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit2, Trash2, Eye } from "lucide-react";
import Header from "@/components/Header";
import { productsAPI, ordersAPI, Product, Order } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

interface AdminProduct extends Product {
  stock: number;
  status: 'active' | 'inactive';
}

interface AdminOrder {
  _id: string;
  createdAt: string;
  orderStatus: 'Placed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  totalAmount: number;
  customerName: string;
  customerEmail: string;
  items: number; // count of items
}

const Admin = () => {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsData, ordersData] = await Promise.all([
          productsAPI.getAll(),
          ordersAPI.getAll()
        ]);
        // Transform products to include admin fields
        setProducts(productsData.map(p => ({
          ...p,
          stock: Math.floor(Math.random() * 50), // Replace with actual stock from API
          status: p.inStock ? 'active' as const : 'inactive' as const
        })));
        // Transform orders to match admin interface
        setOrders(ordersData.map(o => ({
          ...o,
          customerName: 'Customer', // Replace with actual customer data from API
          customerEmail: 'customer@example.com', // Replace with actual customer data from API
          items: o.items?.length || 1 // Count of items
        })));
      } catch (error) {
        console.error('Failed to load admin data:', error);
        toast({
          title: "Error",
          description: "Failed to load admin data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [toast]);

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    stock: "",
    scent: "",
    description: ""
  });

  const handleAddProduct = async () => {
    if (newProduct.name && newProduct.price && newProduct.stock) {
      try {
        const productData = {
          name: newProduct.name,
          category: 'custom',
          description: newProduct.description,
          price: parseFloat(newProduct.price),
          discountedPrice: parseFloat(newProduct.price),
          size: '8 oz',
          ingredients: ['Natural Soy Wax', 'Cotton Wick'],
          fragrances: [newProduct.scent],
          images: [],
          inStock: parseInt(newProduct.stock) > 0,
          special: false
        };
        const createdProduct = await productsAPI.create(productData);
        const adminProduct: AdminProduct = {
          ...createdProduct,
          stock: parseInt(newProduct.stock),
          status: 'active'
        };
        setProducts([...products, adminProduct]);
        setNewProduct({ name: "", price: "", stock: "", scent: "", description: "" });
        toast({
          title: "Success",
          description: "Product added successfully"
        });
      } catch (error) {
        console.error('Failed to add product:', error);
        toast({
          title: "Error", 
          description: "Failed to add product",
          variant: "destructive"
        });
      }
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: Order['orderStatus']) => {
    try {
      await ordersAPI.updateStatus(orderId, newStatus);
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, orderStatus: newStatus } : order
      ));
      toast({
        title: "Success",
        description: "Order status updated successfully"
      });
    } catch (error) {
      console.error('Failed to update order status:', error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive"
      });
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      await productsAPI.delete(productId);
      setProducts(products.filter(product => product._id !== productId));
      toast({
        title: "Success", 
        description: "Product deleted successfully"
      });
    } catch (error) {
      console.error('Failed to delete product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'inactive': return 'secondary';
      case 'Placed': return 'secondary';
      case 'Processing': return 'default';
      case 'Shipped': return 'default';
      case 'Delivered': return 'default';
      case 'Cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-light text-candle-warm mb-8">Admin Dashboard</h1>
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-light text-candle-warm mb-8">Admin Dashboard</h1>
        
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="products">Product Management</TabsTrigger>
            <TabsTrigger value="orders">Order Management</TabsTrigger>
          </TabsList>
          
          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-light text-candle-warm">Products</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="hero">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-candle-warm">Add New Product</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Product Name</Label>
                      <Input
                        id="name"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                        placeholder="Enter product name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="scent">Scent Description</Label>
                      <Input
                        id="scent"
                        value={newProduct.scent}
                        onChange={(e) => setNewProduct({...newProduct, scent: e.target.value})}
                        placeholder="e.g., Warm Vanilla & Sandalwood"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="price">Price ($)</Label>
                        <Input
                          id="price"
                          type="number"
                          value={newProduct.price}
                          onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <Label htmlFor="stock">Stock</Label>
                        <Input
                          id="stock"
                          type="number"
                          value={newProduct.stock}
                          onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                          placeholder="0"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                        placeholder="Product description"
                        rows={3}
                      />
                    </div>
                    <Button onClick={handleAddProduct} className="w-full" variant="hero">
                      Add Product
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Scent</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product._id}>
                      <TableCell className="font-medium text-candle-warm">{product.name}</TableCell>
                      <TableCell className="text-candle-amber">{product.fragrances.join(', ')}</TableCell>
                      <TableCell>${product.discountedPrice}</TableCell>
                      <TableCell>{product.stock}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(product.status) as any}>
                          {product.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="icon" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="outline">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="outline"
                            onClick={() => deleteProduct(product._id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
          
          <TabsContent value="orders" className="space-y-6">
            <h2 className="text-2xl font-light text-candle-warm">Order Management</h2>
            
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell className="font-medium text-candle-warm">{order._id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.customerName}</p>
                          <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
                        </div>
                      </TableCell>
                      <TableCell>{order.items} items</TableCell>
                      <TableCell className="font-medium text-candle-burgundy">${order.totalAmount}</TableCell>
                      <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <select
                          value={order.orderStatus}
                          onChange={(e) => updateOrderStatus(order._id, e.target.value as Order['orderStatus'])}
                          className="border rounded px-2 py-1 text-sm"
                        >
                          <option value="Placed">Placed</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </TableCell>
                      <TableCell>
                        <Button size="icon" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;