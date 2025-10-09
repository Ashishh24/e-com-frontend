import { Button } from "@/components/ui/button";
import heroCandle from "@/assets/hero-candle.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero">
      <div className="absolute inset-0 bg-gradient-glow opacity-30"></div>
      
      <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center relative z-10">
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl lg:text-7xl font-light leading-tight">
              <span className="text-candle-warm">Illuminate</span>
              <br />
              <span className="text-candle-burgundy font-medium">Your Space</span>
            </h1>
            <p className="text-xl text-candle-warm/80 max-w-lg leading-relaxed">
              Hand-poured artisan candles crafted with premium soy wax and carefully curated fragrances to transform your home into a sanctuary.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="hero" size="lg" className="text-lg px-8 py-6">
              Shop Collection
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-candle-warm text-candle-warm hover:bg-candle-cream">
              Our Story
            </Button>
          </div>
        </div>
        
        <div className="relative">
          <div className="relative animate-float">
            <img 
              src={heroCandle} 
              alt="Premium artisan candle with warm golden glow"
              className="w-full max-w-lg mx-auto rounded-lg shadow-warm"
            />
            <div className="absolute inset-0 bg-gradient-glow opacity-50 rounded-lg animate-glow"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;