import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import Header from '@/components/Header';

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    newsletter: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    // Frontend only - no actual authentication logic
    console.log('Signup attempt:', formData);
  };

  const updateField = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-radial from-candle-cream via-candle-warm to-candle-deep">
      <Header />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-md mx-auto">
          <Card className="shadow-elegant border-candle-gold/20">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-serif text-candle-gold">Create Account</CardTitle>
              <CardDescription className="text-candle-brown">
                Join us and discover our premium candle collection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-candle-brown font-medium">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => updateField('firstName', e.target.value)}
                      placeholder="First name"
                      required
                      className="border-candle-gold/30 focus:border-candle-gold focus:ring-candle-gold/20"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-candle-brown font-medium">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => updateField('lastName', e.target.value)}
                      placeholder="Last name"
                      required
                      className="border-candle-gold/30 focus:border-candle-gold focus:ring-candle-gold/20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-candle-brown font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="border-candle-gold/30 focus:border-candle-gold focus:ring-candle-gold/20"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-candle-brown font-medium">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => updateField('password', e.target.value)}
                    placeholder="Create a password"
                    required
                    className="border-candle-gold/30 focus:border-candle-gold focus:ring-candle-gold/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-candle-brown font-medium">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => updateField('confirmPassword', e.target.value)}
                    placeholder="Confirm your password"
                    required
                    className="border-candle-gold/30 focus:border-candle-gold focus:ring-candle-gold/20"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => updateField('agreeToTerms', checked as boolean)}
                      className="border-candle-gold/30 data-[state=checked]:bg-candle-gold"
                    />
                    <Label htmlFor="terms" className="text-sm text-candle-brown">
                      I agree to the{' '}
                      <Link to="/terms" className="text-candle-gold hover:text-candle-gold/80">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link to="/privacy" className="text-candle-gold hover:text-candle-gold/80">
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="newsletter"
                      checked={formData.newsletter}
                      onCheckedChange={(checked) => updateField('newsletter', checked as boolean)}
                      className="border-candle-gold/30 data-[state=checked]:bg-candle-gold"
                    />
                    <Label htmlFor="newsletter" className="text-sm text-candle-brown">
                      Subscribe to our newsletter for exclusive offers
                    </Label>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  variant="hero" 
                  className="w-full"
                  size="lg"
                  disabled={!formData.agreeToTerms}
                >
                  Create Account
                </Button>

                <div className="text-center text-sm text-candle-brown">
                  Already have an account?{' '}
                  <Link 
                    to="/login" 
                    className="text-candle-gold hover:text-candle-gold/80 font-medium transition-colors"
                  >
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