import { Pizza } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-secondary text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Pizza className="text-primary h-8 w-8" />
              <span className="font-display font-bold text-2xl tracking-tighter">AMASARTE</span>
            </div>
            <p className="text-gray-300 leading-relaxed mb-6">
              Pasión por la pizza artesanal. Ingredientes frescos, masa madre y horno de leña para crear experiencias inolvidables.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-xl mb-6">Enlaces Rápidos</h3>
            <ul className="space-y-3">
              <li><a href="#hero" className="text-gray-300 hover:text-primary transition-colors">Inicio</a></li>
              <li><a href="#menu" className="text-gray-300 hover:text-primary transition-colors">Ver Menú</a></li>
              <li><a href="#orders" className="text-gray-300 hover:text-primary transition-colors">Pedidos Online</a></li>
              <li><a href="#contact" className="text-gray-300 hover:text-primary transition-colors">Contacto y Ubicación</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-bold text-xl mb-6">Suscríbete</h3>
            <p className="text-gray-300 mb-4">Recibe promociones exclusivas y novedades.</p>
            <form className="flex gap-2">
              <input 
                type="email" 
                placeholder="Tu email" 
                className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 w-full focus:outline-none focus:border-primary text-white placeholder:text-gray-400"
              />
              <button className="bg-primary text-white px-4 py-2 rounded-lg font-bold hover:bg-primary/90 transition-colors">
                OK
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <p>&copy; 2025 AMASARTE. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            <span>Aceptamos:</span>
            <div className="flex gap-2">
               <div className="w-8 h-5 bg-white/20 rounded"></div>
               <div className="w-8 h-5 bg-white/20 rounded"></div>
               <div className="w-8 h-5 bg-white/20 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
