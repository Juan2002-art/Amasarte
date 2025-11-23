import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';

const contactItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
    },
  }),
};

const socialVariants = {
  hidden: { opacity: 0, scale: 0 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: 0.6 + i * 0.1,
      duration: 0.4,
      type: "spring",
      stiffness: 200,
    },
  }),
};

export function Contact() {
  return (
    <section id="contact" className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 overflow-hidden rounded-3xl shadow-2xl">
          
          {/* Contact Info */}
          <motion.div 
            className="bg-foreground text-white p-12 flex flex-col justify-center"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2 
              className="text-4xl font-bold mb-8"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Visítanos
            </motion.h2>
            
            <div className="space-y-8">
              <motion.div 
                className="flex items-start gap-4"
                custom={0}
                variants={contactItemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <motion.div 
                  className="bg-primary/20 p-3 rounded-full"
                  whileHover={{ scale: 1.1, backgroundColor: "rgba(46, 204, 113, 0.4)" }}
                >
                  <MapPin className="text-primary w-6 h-6" />
                </motion.div>
                <div>
                  <h3 className="font-bold text-xl mb-1">Dirección</h3>
                  <p className="text-gray-300">Av. Principal 123, Colonia Centro<br/>Ciudad de México, CP 12345</p>
                </div>
              </motion.div>

              <motion.div 
                className="flex items-start gap-4"
                custom={1}
                variants={contactItemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <motion.div 
                  className="bg-primary/20 p-3 rounded-full"
                  whileHover={{ scale: 1.1, backgroundColor: "rgba(46, 204, 113, 0.4)" }}
                >
                  <Phone className="text-primary w-6 h-6" />
                </motion.div>
                <div>
                  <h3 className="font-bold text-xl mb-1">Llámanos</h3>
                  <motion.p 
                    className="text-gray-300 hover:text-primary cursor-pointer transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    +52 (55) 1234 5678
                  </motion.p>
                  <motion.p 
                    className="text-gray-300 hover:text-primary cursor-pointer transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    WhatsApp: +52 (55) 8765 4321
                  </motion.p>
                </div>
              </motion.div>

              <motion.div 
                className="flex items-start gap-4"
                custom={2}
                variants={contactItemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <motion.div 
                  className="bg-primary/20 p-3 rounded-full"
                  whileHover={{ scale: 1.1, backgroundColor: "rgba(46, 204, 113, 0.4)" }}
                >
                  <Clock className="text-primary w-6 h-6" />
                </motion.div>
                <div>
                  <h3 className="font-bold text-xl mb-1">Horarios</h3>
                  <p className="text-gray-300">Lun - Jue: 1:00 PM - 10:00 PM</p>
                  <p className="text-gray-300">Vie - Dom: 1:00 PM - 12:00 AM</p>
                </div>
              </motion.div>
            </div>

            <motion.div 
              className="mt-12 pt-8 border-t border-white/10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="font-bold mb-4">Síguenos</h3>
              <div className="flex gap-4">
                {[Instagram, Facebook, Twitter].map((Icon, i) => (
                  <motion.div
                    key={i}
                    custom={i}
                    variants={socialVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="hover:bg-primary hover:text-white rounded-full"
                    >
                      <Icon size={24} />
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Map (Placeholder) */}
          <motion.div 
            className="bg-gray-200 relative min-h-[400px] overflow-hidden"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
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
          </motion.div>
        </div>
      </div>
    </section>
  );
}
