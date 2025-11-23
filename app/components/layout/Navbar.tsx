import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { setIsOpen } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Inicio', href: '#hero' },
    { name: 'Sobre Nosotros', href: '#about' },
    { name: 'Menú', href: '#menu' },
    { name: 'Galería', href: '#gallery' },
    { name: 'Contacto', href: '#contact' },
  ];

  const scrollToSection = (id: string) => {
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-6'
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <button onClick={() => scrollToSection('#hero')} className="font-display font-bold text-2xl md:text-3xl tracking-tighter text-primary cursor-pointer flex items-center gap-2">
          AMASARTE
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => scrollToSection(link.href)}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isScrolled ? "text-foreground" : "text-white hover:text-green-300"
              )}
            >
              {link.name}
            </button>
          ))}
          <Button 
            variant={isScrolled ? "default" : "secondary"}
            className="rounded-full font-semibold"
            onClick={() => setIsOpen(true)}
          >
            Hacer Pedido
          </Button>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-primary"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} color={isScrolled ? '#1E8449' : '#FFFFFF'} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white shadow-lg p-6 md:hidden flex flex-col gap-4 border-t"
          >
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.href)}
                className="text-left text-lg font-medium text-foreground hover:text-primary py-2 border-b border-gray-100"
              >
                {link.name}
              </button>
            ))}
            <Button className="w-full rounded-full mt-2" size="lg" onClick={() => {
              setIsOpen(true);
              setIsMobileMenuOpen(false);
            }}>
              Hacer Pedido Online
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
