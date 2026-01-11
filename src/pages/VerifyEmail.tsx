import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
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
import { BASE_URL } from "@/utils/url";
import { useToast } from "@/hooks/use-toast";

const VerifyEmail = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const email = location.state?.email;

  // If user directly opens this page
  if (!email) {
    navigate("/signup");
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${BASE_URL}/otp/verify`,
        { email, otp },
        { withCredentials: true }
      );

      toast({
        title: "Email verified!!",
        description: "Verification successful",
      });

      // Redirect to login after successful verification
      navigate("/login");
    } catch (err: any) {
      console.error(err);

      toast({
        title: "Verification Failed!!",
        description: "Invalid or expired OTP",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setOtp("");
      const response = await axios.post(
        `${BASE_URL}/otp/send`,
        { email },
        { withCredentials: true }
      );

      toast({
        title: "OTP sent successfully!!",
        description: "Check your email",
      });
    } catch (err: any) {
      toast({
        title: "Failed to resend OTP",
        description: "Please try again later",
        variant: "destructive",
      });
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
                Verify Your Email
              </CardTitle>
              <CardDescription className="text-candle-brown">
                Enter the 6-digit OTP sent to
                <br />
                <span className="font-medium">{email}</span>
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleVerify} className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-candle-brown font-medium">
                    OTP Code
                  </Label>
                  <Input
                    type="text"
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value)
                    }
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    required
                    className="text-center tracking-widest text-lg"
                  />
                </div>

                <Button
                  type="submit"
                  variant="hero"
                  className="w-full"
                  size="lg"
                  disabled={loading || otp.length !== 6}
                >
                  {loading ? "Verifying..." : "Verify Email"}
                </Button>

                <div className="flex justify-between text-sm">
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    className="text-candle-gold hover:underline"
                  >
                    Resend OTP
                  </button>

                  <Link
                    to="/signup"
                    className="text-candle-brown hover:underline"
                  >
                    Change Email
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

export default VerifyEmail;
