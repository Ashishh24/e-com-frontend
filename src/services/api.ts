import { BASE_URL } from "@/utils/url";

export interface Review {
  userId: string;
  comment: string;
  ratings: number;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  _id?: string;
  name: string;
  category: string;
  description: string;
  price: number;
  discountedPrice?: number;
  burnTime?: string;
  size: string;
  ingredients: string[];
  fragrances: string[];
  images: string[];
  inStock: boolean;
  special: boolean;
  avgRating?: number;
  reviews?: Review[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Address {
  name: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  phone: string;
}

export interface CartItem {
  product: string; // Product ID
  quantity: number;
  itemsTotal: number;
}

export interface User {
  _id: string;
  name: string;
  gender?: "Male" | "Female";
  email: string;
  verified: boolean;
  phone?: string;
  address: Address[];
  wishlist: string[]; // Product IDs
  cart: {
    cartTotal: number;
    items: CartItem[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

export interface Order {
  _id: string;
  userId: User;
  items: OrderItem[];
  shippingAddress: Address;
  payment: {
    method: "COD" | "Credit Card" | "UPI" | "Net Banking";
    status: "Pending" | "Completed" | "Failed";
    transactionId?: string;
  };
  orderStatus: "Placed" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  totalAmount: number;
  itemsTotal: number;
  deliveryCharges: number;
  createdAt: string;
  updatedAt: string;
}

// Products API
export const productsAPI = {
  getAll: async (): Promise<Product[]> => {
    const response = await fetch(`${BASE_URL}/products`);
    return response.json();
  },

  getById: async (id: string): Promise<Product> => {
    const response = await fetch(`${BASE_URL}/products/${id}`);
    return response.json();
  },

  getFeatured: async (): Promise<Product[]> => {
    const response = await fetch(`${BASE_URL}/specialProducts`);
    return response.json();
  },

  createProduct: async (
    productData: Omit<
      Product,
      "_id" | "createdAt" | "updatedAt" | "avgRating" | "reviews"
    >
  ): Promise<Product> => {
    const response = await fetch(`${BASE_URL}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
      credentials: "include",
    });
    return response.json();
  },

  updateProduct: async (
    id: string,
    product: Partial<Product>
  ): Promise<Product> => {
    const response = await fetch(`${BASE_URL}/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
      credentials: "include",
    });
    return response.json();
  },

  deleteProduct: async (id: string): Promise<void> => {
    await fetch(`${BASE_URL}/products/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
  },
};

// User/Cart API
export const userAPI = {
  getCart: async (): Promise<User["cart"]> => {
    const response = await fetch(`${BASE_URL}/cart`, {
      credentials: "include",
    });
    return response.json();
  },

  addToCart: async (itemID: string): Promise<User["cart"]> => {
    const response = await fetch(`${BASE_URL}/cart/${itemID}`, {
      method: "POST",
      body: JSON.stringify({ itemID }),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    const data = await response.json();
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message);
    }

    return data;
  },

  removeFromCart: async (itemID: string): Promise<void> => {
    const response = await fetch(`${BASE_URL}/cart/${itemID}`, {
      method: "PATCH",
      body: JSON.stringify({ itemID }),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    return response.json();
  },

  clearCart: async (itemID: string): Promise<void> => {
    const response = await fetch(`${BASE_URL}/cart/${itemID}`, {
      method: "DELETE",
      body: JSON.stringify({ itemID }),
      credentials: "include",
    });
    return response.json();
  },

  updateWishlist: async (itemID: string): Promise<User["wishlist"]> => {
    const response = await fetch(`${BASE_URL}/wishlist/${itemID}`, {
      method: "POST",
      body: JSON.stringify({ itemID }),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    const data = await response.json();
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message);
    }

    return data;
  },

  getWishlist: async (): Promise<User["wishlist"]> => {
    const response = await fetch(`${BASE_URL}/wishlist`, {
      credentials: "include",
    });
    return response.json();
  },
};

// Orders API
export const ordersAPI = {
  getAll: async (): Promise<Order[]> => {
    const response = await fetch(`${BASE_URL}/allOrders`, {
      credentials: "include",
    });
    return response.json();
  },

  getMy: async (): Promise<Order[]> => {
    const response = await fetch(`${BASE_URL}/orders`, {
      credentials: "include",
    });
    return response.json();
  },

  getById: async (id: string): Promise<Order> => {
    const response = await fetch(`${BASE_URL}/orders/${id}`, {
      body: JSON.stringify({ id }),
      credentials: "include",
    });
    return response.json();
  },

  create: async (orderData: Partial<Order>): Promise<Order> => {
    const response = await fetch(`${BASE_URL}/order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
      credentials: "include",
    });
    return response.json();
  },

  updateStatus: async (id: string, status: string): Promise<Order> => {
    const response = await fetch(`${BASE_URL}/order/${id}/${status}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
      credentials: "include",
    });
    return response.json();
  },
};
