import { Pizza } from 'lucide-react';

export function Footer() {
  return (
    <footer className="py-16" style={{ backgroundColor: '#1A3A3B' }}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Pizza className="h-8 w-8" style={{ color: '#FF8533' }} />
              <span className="font-display font-bold text-2xl tracking-tighter" style={{ color: '#F5E8D0' }}>AMASARTE</span>
            </div>
            <p className="leading-relaxed mb-6" style={{ color: '#F5E8D0' }}>
              Pasión por la pizza artesanal. Ingredientes frescos, masa madre y horno de leña para crear experiencias inolvidables.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-xl mb-6" style={{ color: '#F5E8D0' }}>Enlaces Rápidos</h3>
            <ul className="space-y-3">
              <li><a href="#hero" style={{ color: '#F5E8D0' }} className="hover:text-orange-400 transition-colors">Inicio</a></li>
              <li><a href="#menu" style={{ color: '#F5E8D0' }} className="hover:text-orange-400 transition-colors">Ver Menú</a></li>
              <li><a href="#orders" style={{ color: '#F5E8D0' }} className="hover:text-orange-400 transition-colors">Pedidos Online</a></li>
              <li><a href="#contact" style={{ color: '#F5E8D0' }} className="hover:text-orange-400 transition-colors">Contacto y Ubicación</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-bold text-xl mb-6" style={{ color: '#F5E8D0' }}>Suscríbete</h3>
            <p className="mb-4" style={{ color: '#F5E8D0' }}>Recibe promociones exclusivas y novedades.</p>
            <form className="flex gap-2">
              <input 
                type="email" 
                placeholder="Tu email" 
                className="rounded-lg px-4 py-2 w-full focus:outline-none text-white placeholder:opacity-60"
                style={{ backgroundColor: '#2A5A5B', borderColor: '#FF8533', border: '2px solid', color: '#F5E8D0', placeholder: '#F5E8D0' }}
              />
              <button className="px-4 py-2 rounded-lg font-bold transition-colors text-white" style={{ backgroundColor: '#FF8533' }}>
                OK
              </button>
            </form>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm" style={{ borderTopColor: '#2A5A5B', borderTopWidth: '1px', color: '#F5E8D0' }}>
          <p>&copy; 2025 AMASARTE. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            <span>Aceptamos:</span>
            <div className="flex gap-2">
               <div className="w-8 h-5 rounded" style={{ backgroundColor: '#2A5A5B' }}></div>
               <div className="w-8 h-5 rounded" style={{ backgroundColor: '#2A5A5B' }}></div>
               <div className="w-8 h-5 rounded" style={{ backgroundColor: '#2A5A5B' }}></div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
