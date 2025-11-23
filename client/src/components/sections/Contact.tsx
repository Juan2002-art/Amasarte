import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Twitter, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export function Contact() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    mensaje: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Error al enviar el formulario');
      }

      toast.success('¡Mensaje enviado exitosamente! Pronto nos pondremos en contacto.');
      setFormData({ nombre: '', email: '', telefono: '', mensaje: '' });
    } catch (error) {
      toast.error('Error al enviar el mensaje. Por favor, intenta de nuevo.');
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24" style={{ backgroundColor: '#1A3A3B' }}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 overflow-hidden rounded-3xl shadow-2xl">
          
          {/* Contact Info */}
          <div className="p-12 flex flex-col justify-center" style={{ backgroundColor: '#1A3A3B' }}>
            <h2 className="text-4xl font-bold mb-8" style={{ color: '#F5E8D0' }}>Visítanos</h2>
            
            <div className="space-y-8">
              <motion.div 
                className="flex items-start gap-4"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="p-3 rounded-full" style={{ backgroundColor: '#2A5A5B' }}>
                  <MapPin className="w-6 h-6" style={{ color: '#FF8533' }} />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-1" style={{ color: '#F5E8D0' }}>Dirección</h3>
                  <p style={{ color: '#F5E8D0' }}>Urb Emmanuel, Manzana H, Lote 5<br/>Cartagena, Bolívar, Colombia</p>
                </div>
              </motion.div>

              <motion.div 
                className="flex items-start gap-4"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="p-3 rounded-full" style={{ backgroundColor: '#2A5A5B' }}>
                  <Phone className="w-6 h-6" style={{ color: '#FF8533' }} />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-1" style={{ color: '#F5E8D0' }}>Llámanos</h3>
                  <a href="tel:+573006520811" style={{ color: '#F5E8D0' }} className="hover:text-orange-400 cursor-pointer transition-colors block">+57 300 6520811</a>
                  <a href="https://wa.me/573006520811?text=Hola%20AMASARTE%2C%20me%20gustaría%20hacer%20un%20pedido" target="_blank" rel="noopener noreferrer" style={{ color: '#F5E8D0' }} className="hover:text-orange-400 cursor-pointer transition-colors block">WhatsApp: +57 300 6520811</a>
                </div>
              </motion.div>

              <motion.div 
                className="flex items-start gap-4"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="p-3 rounded-full" style={{ backgroundColor: '#2A5A5B' }}>
                  <Mail className="w-6 h-6" style={{ color: '#FF8533' }} />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-1" style={{ color: '#F5E8D0' }}>Correo</h3>
                  <a href="mailto:amasartepizza@gmail.com" style={{ color: '#F5E8D0' }} className="hover:text-orange-400 cursor-pointer transition-colors">amasartepizza@gmail.com</a>
                </div>
              </motion.div>

              <motion.div 
                className="flex items-start gap-4"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="p-3 rounded-full" style={{ backgroundColor: '#2A5A5B' }}>
                  <Clock className="w-6 h-6" style={{ color: '#FF8533' }} />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-1" style={{ color: '#F5E8D0' }}>Horarios</h3>
                  <p style={{ color: '#F5E8D0' }}>Jueves a Domingo</p>
                  <p style={{ color: '#F5E8D0' }}>5:00 PM - 11:00 PM</p>
                </div>
              </motion.div>
            </div>

            <div className="mt-12 pt-8" style={{ borderTopColor: '#2A5A5B', borderTopWidth: '1px' }}>
              <h3 className="font-bold mb-4" style={{ color: '#F5E8D0' }}>Síguenos</h3>
              <div className="flex gap-4">
                <Button size="icon" variant="ghost" className="rounded-full transition-colors" style={{ color: '#F5E8D0' }}>
                  <Instagram size={24} />
                </Button>
                <Button size="icon" variant="ghost" className="rounded-full transition-colors" style={{ color: '#F5E8D0' }}>
                  <Facebook size={24} />
                </Button>
                <Button size="icon" variant="ghost" className="rounded-full transition-colors" style={{ color: '#F5E8D0' }}>
                  <Twitter size={24} />
                </Button>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <motion.div 
            className="p-12 flex flex-col justify-center"
            style={{ backgroundColor: '#2A5A5B' }}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold mb-8" style={{ color: '#F5E8D0' }}>Envía tu mensaje</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="nombre" className="font-semibold mb-2 block" style={{ color: '#F5E8D0' }}>Nombre Completo</Label>
                <Input
                  id="nombre"
                  name="nombre"
                  type="text"
                  placeholder="Tu nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  className="rounded-lg"
                  style={{ backgroundColor: '#1A3A3B', borderColor: '#FF8533', color: '#F5E8D0', border: '2px solid' }}
                  data-testid="input-nombre"
                />
              </div>

              <div>
                <Label htmlFor="email" className="font-semibold mb-2 block" style={{ color: '#F5E8D0' }}>Correo Electrónico</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="tu@correo.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="rounded-lg"
                  style={{ backgroundColor: '#1A3A3B', borderColor: '#FF8533', color: '#F5E8D0', border: '2px solid' }}
                  data-testid="input-email"
                />
              </div>

              <div>
                <Label htmlFor="telefono" className="font-semibold mb-2 block" style={{ color: '#F5E8D0' }}>Teléfono (Opcional)</Label>
                <Input
                  id="telefono"
                  name="telefono"
                  type="tel"
                  placeholder="+57 300 6520811"
                  value={formData.telefono}
                  onChange={handleChange}
                  className="rounded-lg"
                  style={{ backgroundColor: '#1A3A3B', borderColor: '#FF8533', color: '#F5E8D0', border: '2px solid' }}
                  data-testid="input-telefono"
                />
              </div>

              <div>
                <Label htmlFor="mensaje" className="font-semibold mb-2 block" style={{ color: '#F5E8D0' }}>Mensaje</Label>
                <Textarea
                  id="mensaje"
                  name="mensaje"
                  placeholder="Cuéntanos cómo podemos ayudarte..."
                  value={formData.mensaje}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="rounded-lg resize-none"
                  style={{ backgroundColor: '#1A3A3B', borderColor: '#FF8533', color: '#F5E8D0', border: '2px solid' }}
                  data-testid="textarea-mensaje"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-full text-white font-semibold py-6 flex items-center justify-center gap-2"
                style={{ backgroundColor: '#FF8533' }}
                data-testid="button-submit-contact"
              >
                <Send size={18} />
                {loading ? 'Enviando...' : 'Enviar Mensaje'}
              </Button>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
