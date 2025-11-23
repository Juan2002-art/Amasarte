import { Navbar } from '@/components/layout/Navbar';
import { Hero } from '@/components/sections/Hero';
import { Promotions } from '@/components/sections/Promotions';
import { Menu } from '@/components/sections/Menu';
import { Gallery } from '@/components/sections/Gallery';
import { Testimonials } from '@/components/sections/Testimonials';
import { Contact } from '@/components/sections/Contact';
import { Checkout } from '@/components/sections/Checkout';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';
import { CartProvider, useCart } from '@/context/CartContext';
import { useState } from 'react';

function HomeContent() {
  const { itemCount } = useCart();

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary selection:text-white">
      <Navbar />
      
      <main>
        <Hero />
        <Promotions />
        <Menu />
        <Gallery />
        <Testimonials />
        <Checkout />
        <Contact />
      </main>

      <Footer />

      {/* Floating Cart Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button 
          size="lg" 
          className="rounded-full h-16 w-16 shadow-2xl bg-primary hover:bg-green-600 text-white relative"
          onClick={() => document.getElementById('checkout')?.scrollIntoView({ behavior: 'smooth' })}
          data-testid="button-cart-floating"
        >
          <ShoppingBag size={28} />
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center border-2 border-white">
              {itemCount}
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <CartProvider>
      <HomeContent />
    </CartProvider>
  );
}
