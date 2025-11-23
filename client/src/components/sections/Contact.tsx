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
    <section id="contact" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 overflow-hidden rounded-3xl shadow-2xl">
          
          {/* Contact Info */}
          <div className="bg-foreground text-white p-12 flex flex-col justify-center">
            <h2 className="text-4xl font-bold mb-8">Visítanos</h2>
            
            <div className="space-y-8">
              <motion.div 
                className="flex items-start gap-4"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="bg-primary/20 p-3 rounded-full">
                  <MapPin className="text-primary w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-1">Dirección</h3>
                  <p className="text-gray-300">Av. Principal 123, Colonia Centro<br/>Ciudad de México, CP 12345</p>
                </div>
              </motion.div>

              <motion.div 
                className="flex items-start gap-4"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="bg-primary/20 p-3 rounded-full">
                  <Phone className="text-primary w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-1">Llámanos</h3>
                  <p className="text-gray-300 hover:text-primary cursor-pointer transition-colors">+52 (55) 1234 5678</p>
                  <p className="text-gray-300 hover:text-primary cursor-pointer transition-colors">WhatsApp: +52 (55) 8765 4321</p>
                </div>
              </motion.div>

              <motion.div 
                className="flex items-start gap-4"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="bg-primary/20 p-3 rounded-full">
                  <Clock className="text-primary w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-1">Horarios</h3>
                  <p className="text-gray-300">Lun - Jue: 1:00 PM - 10:00 PM</p>
                  <p className="text-gray-300">Vie - Dom: 1:00 PM - 12:00 AM</p>
                </div>
              </motion.div>
            </div>

            <div className="mt-12 pt-8 border-t border-white/10">
              <h3 className="font-bold mb-4">Síguenos</h3>
              <div className="flex gap-4">
                <Button size="icon" variant="ghost" className="hover:bg-primary hover:text-white rounded-full">
                  <Instagram size={24} />
                </Button>
                <Button size="icon" variant="ghost" className="hover:bg-primary hover:text-white rounded-full">
                  <Facebook size={24} />
                </Button>
                <Button size="icon" variant="ghost" className="hover:bg-primary hover:text-white rounded-full">
                  <Twitter size={24} />
                </Button>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <motion.div 
            className="bg-gradient-to-br from-muted/50 to-muted p-12 flex flex-col justify-center"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold mb-8 text-foreground">Envía tu mensaje</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="nombre" className="text-foreground font-semibold mb-2 block">Nombre Completo</Label>
                <Input
                  id="nombre"
                  name="nombre"
                  type="text"
                  placeholder="Tu nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  className="rounded-lg border-foreground/20 focus:border-primary"
                  data-testid="input-nombre"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-foreground font-semibold mb-2 block">Correo Electrónico</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="tu@correo.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="rounded-lg border-foreground/20 focus:border-primary"
                  data-testid="input-email"
                />
              </div>

              <div>
                <Label htmlFor="telefono" className="text-foreground font-semibold mb-2 block">Teléfono (Opcional)</Label>
                <Input
                  id="telefono"
                  name="telefono"
                  type="tel"
                  placeholder="+52 (55) 1234 5678"
                  value={formData.telefono}
                  onChange={handleChange}
                  className="rounded-lg border-foreground/20 focus:border-primary"
                  data-testid="input-telefono"
                />
              </div>

              <div>
                <Label htmlFor="mensaje" className="text-foreground font-semibold mb-2 block">Mensaje</Label>
                <Textarea
                  id="mensaje"
                  name="mensaje"
                  placeholder="Cuéntanos cómo podemos ayudarte..."
                  value={formData.mensaje}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="rounded-lg border-foreground/20 focus:border-primary resize-none"
                  data-testid="textarea-mensaje"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-primary hover:bg-green-600 text-white font-semibold py-6 flex items-center justify-center gap-2"
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
