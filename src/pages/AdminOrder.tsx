import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Eye } from "lucide-react";
import { ordersAPI, Product, Order } from "@/services/api";
import toast from "react-hot-toast";

const AdminOrder = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [ordersData] = await Promise.all([ordersAPI.getAll()]);
        const mappedOrders = ordersData.map((order) => ({
          ...order,
          itemsCount: order.items.reduce(
            (sum: number, item: any) => sum + item.quantity,
            0
          ),
        }));

        setOrders(mappedOrders);
      } catch (error) {
        console.error("Failed to load admin data:", error);
        toast.error("Failed to load admin data");
      }
    };

    loadData();
  }, [toast]);

  const updateOrderStatus = async (
    orderId: string,
    newStatus: Order["orderStatus"]
  ) => {
    try {
      const updatedOrder = await ordersAPI.updateStatus(orderId, newStatus);

      // Update local state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? { ...order, orderStatus: updatedOrder.orderStatus }
            : order
        )
      );

      toast.success("Order status updated successfully");
    } catch (error) {
      console.error("Failed to update order status:", error);
      toast.error("Failed to update order status");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "inactive":
        return "secondary";
      case "Placed":
        return "secondary";
      case "Processing":
        return "default";
      case "Shipped":
        return "default";
      case "Delivered":
        return "default";
      case "Cancelled":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const openOrderDialog = (order: Order) => {
    setSelectedOrder(order);
  };

  return (
    <div className="min-h-screen bg-background">
      <TabsContent value="orders" className="space-y-6">
        <h2 className="text-2xl font-light text-candle-warm">
          Order Management
        </h2>

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
                  <TableCell className="font-medium text-candle-warm">
                    {order._id}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.userId.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.userId.email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{order.itemsCount} items</TableCell>
                  <TableCell className="font-medium text-candle-burgundy">
                    ₹{order.totalAmount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <select
                      value={order.orderStatus}
                      onChange={(e) =>
                        updateOrderStatus(
                          order._id,
                          e.target.value as Order["orderStatus"]
                        )
                      }
                      className="border rounded px-2 py-1 text-sm">
                      <option value="Placed">Placed</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => openOrderDialog(order)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>

                      {selectedOrder && (
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle className="text-candle-warm">
                              Order Details
                            </DialogTitle>
                          </DialogHeader>

                          <div className="space-y-4">
                            <div>
                              <p>
                                <strong>Order ID:</strong> {selectedOrder._id}
                              </p>
                              <p>
                                <strong>Customer:</strong>{" "}
                                {selectedOrder.userId.name} (
                                {selectedOrder.userId.email})
                              </p>
                              <p>
                                <strong>Status:</strong>{" "}
                                {selectedOrder.orderStatus}
                              </p>
                              <p>
                                <strong>Total:</strong> ₹
                                {selectedOrder.totalAmount.toFixed(2)}
                              </p>
                            </div>

                            <div>
                              <p>
                                <strong>Shipping Address:</strong>
                              </p>
                              <p>
                                {selectedOrder.shippingAddress.street},{" "}
                                {selectedOrder.shippingAddress.city},{" "}
                                {selectedOrder.shippingAddress.state} -{" "}
                                {selectedOrder.shippingAddress.pincode},{" "}
                                {selectedOrder.shippingAddress.country}
                              </p>
                              <p>
                                <strong>Phone:</strong>{" "}
                                {selectedOrder.shippingAddress.phone}
                              </p>
                            </div>

                            <div>
                              <p>
                                <strong>Items:</strong>
                              </p>
                              <div className="space-y-2">
                                {selectedOrder.items.map((item) => (
                                  <Card
                                    key={item.productId}
                                    className="flex items-center space-x-4 p-2">
                                    <img
                                      src={item.image}
                                      alt={item.name}
                                      className="w-20 h-20 object-cover rounded"
                                    />
                                    <div className="flex-1">
                                      <p className="text-md font-bold">
                                        {item.name}
                                      </p>
                                      <p className="text-sm">
                                        Quantity: {item.quantity}
                                      </p>
                                      <p className="text-sm font-semibold">
                                        Price: ₹{item.price.toFixed(2)}
                                      </p>
                                    </div>
                                  </Card>
                                ))}
                              </div>
                            </div>

                            <Button
                              onClick={() => setSelectedOrder(null)}
                              className="w-full mt-4">
                              Close
                            </Button>
                          </div>
                        </DialogContent>
                      )}
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </TabsContent>
    </div>
  );
};

export default AdminOrder;
