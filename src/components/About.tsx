const About = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl lg:text-5xl font-light text-candle-warm">
                Crafted with
                <span className="text-candle-burgundy font-medium block">
                  Love & Care
                </span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Every candle tells a story. Our artisans hand-pour each candle
                using premium soy wax, cotton wicks, and carefully selected
                fragrance oils to create moments of pure tranquility.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="text-xl font-medium text-candle-warm">
                  100% Natural
                </h3>
                <p className="text-muted-foreground">
                  Made with pure soy wax and essential oils
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-medium text-candle-warm">
                  Hand-Poured
                </h3>
                <p className="text-muted-foreground">
                  Crafted in small batches with attention to detail
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-medium text-candle-warm">
                  Long Burning
                </h3>
                <p className="text-muted-foreground">
                  60+ hours of beautiful fragrance
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-medium text-candle-warm">
                  Eco-Friendly
                </h3>
                <p className="text-muted-foreground">
                  Sustainable materials and packaging
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square bg-gradient-glow rounded-full opacity-20 absolute -top-8 -right-8 w-32 h-32"></div>
            <div className="bg-candle-cream rounded-lg p-12 shadow-soft relative">
              <blockquote className="text-xl font-light text-candle-warm leading-relaxed italic">
                "Creating candles isn't just our craft—it's our passion. We
                believe in the power of fragrance to transform spaces and create
                lasting memories."
              </blockquote>
              <footer className="mt-6">
                <cite className="text-candle-burgundy font-medium not-italic">
                  — Kashish Nayak, Founder
                </cite>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
