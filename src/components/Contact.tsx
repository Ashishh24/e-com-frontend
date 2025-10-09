import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const Contact = () => {
  return (
    <section className="py-20 bg-gradient-hero">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-light text-candle-cream mb-4">
              Get In Touch
            </h2>
            <p className="text-xl text-candle-cream/80 max-w-2xl mx-auto">
              Have questions about our candles or want to create a custom scent? We'd love to hear from you.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-medium text-candle-cream mb-2">Visit Our Studio</h3>
                  <p className="text-candle-cream/80">
                    123 Artisan Street<br />
                    Craft District, CD 12345<br />
                    Open Tuesday - Saturday, 10am - 6pm
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium text-candle-cream mb-2">Contact Info</h3>
                  <p className="text-candle-cream/80">
                    Phone: (555) 123-4567<br />
                    Email: hello@candlestudio.com
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-medium text-candle-cream mb-2">Follow Us</h3>
                  <p className="text-candle-cream/80">
                    @candlestudio on Instagram<br />
                    @candlestudioco on Facebook
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-candle-cream/10 backdrop-blur-sm rounded-lg p-8 space-y-6">
              <h3 className="text-2xl font-light text-candle-cream mb-6">Send us a message</h3>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <Input 
                  placeholder="Your Name" 
                  className="bg-candle-cream/20 border-candle-cream/30 text-candle-cream placeholder:text-candle-cream/60"
                />
                <Input 
                  placeholder="Email Address" 
                  type="email"
                  className="bg-candle-cream/20 border-candle-cream/30 text-candle-cream placeholder:text-candle-cream/60"
                />
              </div>
              
              <Input 
                placeholder="Subject" 
                className="bg-candle-cream/20 border-candle-cream/30 text-candle-cream placeholder:text-candle-cream/60"
              />
              
              <Textarea 
                placeholder="Your message..." 
                rows={5}
                className="bg-candle-cream/20 border-candle-cream/30 text-candle-cream placeholder:text-candle-cream/60 resize-none"
              />
              
              <Button variant="secondary" size="lg" className="w-full">
                Send Message
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;