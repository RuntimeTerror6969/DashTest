import Header from '@/components/Header/Header';
import Hero from '@/components/Hero/Hero';
import ProductsSection from '@/components/Products/ProductsSection';
import About from '@/components/About/About';
import Contact from '@/components/Contact/Contact';
import Footer from '@/components/Footer/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <ProductsSection />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
