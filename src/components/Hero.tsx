import { Button } from "@/components/ui/button";
import heroCandle from "@/assets/hero-candle.jpg";

const Hero = () => {
  return (
    <section className="py-20 relative max-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-pink-100 via-rose-200 to-pink-300">
      <div className="absolute inset-0 bg-gradient-to-t from-pink-300/40 via-transparent to-rose-200/40"></div>

      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center relative z-10">
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl lg:text-7xl font-light leading-tight">
              <span className="text-rose-600">Illuminate</span>
              <br />
              <span className="text-pink-700 font-medium">
                Your Space
              </span>
            </h1>
            <p className="text-xl text-rose-700/80 max-w-lg leading-relaxed">
              Hand-poured artisan candles crafted with premium soy wax and
              carefully curated fragrances to transform your home into a
              sanctuary.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="text-lg px-8 py-6 bg-pink-600 hover:bg-pink-700 text-white"
            >
              Shop Collection
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-6 border-rose-500 text-rose-600 hover:bg-rose-100"
            >
              Our Story
            </Button>
          </div>
        </div>

        <div className="relative">
          <div className="relative animate-float">
            <img
              src={heroCandle}
              alt="Premium artisan candle with warm glow"
              className="w-full max-w-lg mx-auto rounded-lg shadow-xl"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-pink-400/40 to-rose-300/40 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
