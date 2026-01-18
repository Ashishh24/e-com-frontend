import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import About from "@/components/About";
import Contact from "@/components/Contact";

const Index = () => {
  return (
    <div className="min-h-20 flex flex-col">
      <Header />
      <main className="overflow-x-hidden">
        <Hero />
        <FeaturedProducts />
        <About />
        <Contact />
      </main>
    </div>
  );
};

export default Index;
