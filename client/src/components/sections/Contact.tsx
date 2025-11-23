import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Contact() {
  return (
    <section id="contact" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 overflow-hidden rounded-3xl shadow-2xl">
          
          {/* Contact Info */}
          <div className="bg-foreground text-white p-12 flex flex-col justify-center">
            <h2 className="text-4xl font-bold mb-8">Visítanos</h2>
            
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="bg-primary/20 p-3 rounded-full">
                  <MapPin className="text-primary w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-1">Dirección</h3>
                  <p className="text-gray-300">Av. Principal 123, Colonia Centro<br/>Ciudad de México, CP 12345</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-primary/20 p-3 rounded-full">
                  <Phone className="text-primary w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-1">Llámanos</h3>
                  <p className="text-gray-300 hover:text-primary cursor-pointer transition-colors">+52 (55) 1234 5678</p>
                  <p className="text-gray-300 hover:text-primary cursor-pointer transition-colors">WhatsApp: +52 (55) 8765 4321</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-primary/20 p-3 rounded-full">
                  <Clock className="text-primary w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-1">Horarios</h3>
                  <p className="text-gray-300">Lun - Jue: 1:00 PM - 10:00 PM</p>
                  <p className="text-gray-300">Vie - Dom: 1:00 PM - 12:00 AM</p>
                </div>
              </div>
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

          {/* Map (Placeholder) */}
          <div className="bg-gray-200 relative min-h-[400px]">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3762.539598680347!2d-99.16836888463254!3d19.43260768688343!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d1f8c9c7c2d1c9%3A0x803117893183770!2sAv.%20Paseo%20de%20la%20Reforma!5e0!3m2!1ses-419!2smx!4v1676660000000!5m2!1ses-419!2smx" 
              width="100%" 
              height="100%" 
              style={{border:0}} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 w-full h-full grayscale opacity-80 hover:grayscale-0 transition-all duration-500"
            ></iframe>
          </div>

        </div>
      </div>
    </section>
  );
}
