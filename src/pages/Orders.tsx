import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Truck, CheckCircle, Clock } from "lucide-react";
import Header from "@/components/Header";
import { ordersAPI, Order } from "@/services/api";

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const userOrders = await ordersAPI.getAll();
        setOrders(userOrders);
      } catch (error) {
        console.error('Failed to load orders:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const getStatusIcon = (status: Order['orderStatus']) => {
    switch (status) {
      case 'Placed':
        return <Clock className="h-4 w-4" />;
      case 'Processing':
        return <Package className="h-4 w-4" />;
      case 'Shipped':
        return <Truck className="h-4 w-4" />;
      case 'Delivered':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: Order['orderStatus']) => {
    switch (status) {
      case 'Placed':
        return 'secondary';
      case 'Processing':
        return 'default';
      case 'Shipped':
        return 'default';
      case 'Delivered':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const filterOrdersByStatus = (status?: Order['orderStatus']) => {
    if (!status) return orders;
    return orders.filter(order => order.orderStatus === status);
  };

  const OrderCard = ({ order }: { order: Order }) => (
    <Card className="hover:shadow-soft transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-lg text-candle-warm">Order {order._id}</CardTitle>
          <p className="text-sm text-muted-foreground">
            Placed on {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
        <Badge variant={getStatusColor(order.orderStatus) as any} className="flex items-center gap-1">
          {getStatusIcon(order.orderStatus)}
          {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {order.items.map((item) => (
            <div key={item.productId} className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-candle-cream rounded-md flex-shrink-0"></div>
              <div className="flex-1">
                <p className="font-medium text-candle-warm">{item.name}</p>
                <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
              </div>
              <p className="font-medium text-candle-burgundy">${item.price * item.quantity}</p>
            </div>
          ))}
        </div>
        
        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">Total:</span>
            <span className="text-lg font-medium text-candle-burgundy">${order.totalAmount}</span>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="flex-1">
              View Details
            </Button>
            {order.orderStatus === 'Delivered' && (
              <Button variant="secondary" size="sm">
                Reorder
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-light text-candle-warm mb-8">My Orders</h1>
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardContent className="p-6 space-y-4">
                  <div className="h-6 bg-muted rounded w-1/3"></div>
                  <div className="h-4 bg-muted rounded w-1/4"></div>
                  <div className="h-16 bg-muted rounded"></div>
                </CardContent>
              </Card>
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
        <h1 className="text-4xl font-light text-candle-warm mb-8">My Orders</h1>
        
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="processing">Processing</TabsTrigger>
            <TabsTrigger value="shipped">Shipped</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            {orders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </TabsContent>
          
          <TabsContent value="pending" className="space-y-4">
            {filterOrdersByStatus('Placed').map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </TabsContent>
          
          <TabsContent value="processing" className="space-y-4">
            {filterOrdersByStatus('Processing').map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </TabsContent>
          
          <TabsContent value="shipped" className="space-y-4">
            {filterOrdersByStatus('Shipped').map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </TabsContent>
          
          <TabsContent value="delivered" className="space-y-4">
            {filterOrdersByStatus('Delivered').map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Orders;