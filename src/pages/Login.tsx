import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import axios from "axios";
import { BASE_URL } from "@/utils/url";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${BASE_URL}/login`,
        { email, password },
        { withCredentials: true }
      );
      dispatch(addUser(response.data.user));
      toast({
        title: "Login successful!",
      });
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-radial from-candle-cream via-candle-warm to-candle-deep">
      <Header />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-md mx-auto">
          <Card className="shadow-elegant border-candle-gold/20">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-serif text-candle-gold">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-candle-brown">
                Sign in to your account to continue shopping
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-candle-brown font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="border-candle-gold/30 focus:border-candle-gold focus:ring-candle-gold/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-candle-brown font-medium">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="border-candle-gold/30 focus:border-candle-gold focus:ring-candle-gold/20"
                  />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <Link
                    to="/forgot-password"
                    className="text-candle-gold hover:text-candle-gold/80 transition-colors">
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  variant="hero"
                  className="w-full"
                  size="lg">
                  Sign In
                </Button>

                <div className="text-center text-sm text-candle-brown">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="text-candle-gold hover:text-candle-gold/80 font-medium transition-colors">
                    Create account
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
