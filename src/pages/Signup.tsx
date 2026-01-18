import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import axios from "axios";
import { BASE_URL } from "@/utils/url";
import toast from "react-hot-toast";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${BASE_URL}/signup`,
        { name, email, password },
        { withCredentials: true }
      );

      toast.success("Signup successful");


      // Redirect to OTP verification page
      navigate("/verify-email", {
        state: { email },
      });
    } catch (err: any) {
      console.error(err);

      const errorMsg =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.[0] ||
        "Signup failed";

      toast.error(errorMsg);
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
                Create Account
              </CardTitle>
              <CardDescription className="text-candle-brown">
                Sign up to start shopping with us
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-candle-brown font-medium">
                    Full Name
                  </Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-candle-brown font-medium">
                    Email Address
                  </Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-candle-brown font-medium">
                    Password
                  </Label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter Password"
                    required
                  />
                </div>

                <Button type="submit" variant="hero" className="w-full" size="lg">
                  Sign Up
                </Button>

                <div className="text-center text-sm text-candle-brown">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-candle-gold font-medium">
                    Sign in
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

export default Signup;
