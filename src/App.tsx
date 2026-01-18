import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";import { Toaster as ShadcnToaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import Cart from "@/pages/Cart";
import Orders from "@/pages/Orders";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Admin from "@/pages/Admin";
import NotFound from "@/pages/NotFound";
import { Provider, useSelector } from "react-redux";
import appStore, { RootState } from "./utils/appStore";
import User from "./components/User";
import { useEffect } from "react";
import VerifyEmail from "./pages/VerifyEmail";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const userData = useSelector((store: RootState) => store.user);

  if (!userData) {
    return <div>Loading...</div>;
  }

  if (!userData.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <Provider store={appStore}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/profile" element={<Profile />} />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <Admin />
                </AdminRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster
            position="top-center"
            reverseOrder={false}
            toastOptions={{
              style: {
                fontSize: "14px",
                padding: "12px 20px",
              },
              success: {
                style: {
                  background: "#d1fae5",
                  color: "#065f46",
                },
              },
              error: {
                style: {
                  background: "#fee2e2",
                  color: "#991b1b",
                },
              },
            }}
          />
          <User />
        </Router>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
