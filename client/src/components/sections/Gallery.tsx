import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import ovenImage from '@assets/generated_images/wood_fired_oven.png';
import ingredientsImage from '@assets/generated_images/pizza_ingredients.png';
import pizzaHero from '@assets/generated_images/artisanal_pizza_hero_image.png';

const images = [
  { id: 1, src: ovenImage, alt: 'Horno de Leña', span: 'md:col-span-2 md:row-span-2' },
  { id: 2, src: ingredientsImage, alt: 'Ingredientes Frescos', span: 'md:col-span-1 md:row-span-1' },
  { id: 3, src: pizzaHero, alt: 'Pizza Artesanal', span: 'md:col-span-1 md:row-span-1' },
  { id: 4, src: ingredientsImage, alt: 'Preparación', span: 'md:col-span-1 md:row-span-1' },
  { id: 5, src: pizzaHero, alt: 'Detalle', span: 'md:col-span-1 md:row-span-1' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export function Gallery() {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  return (
    <section id="gallery" className="py-24 bg-muted/30 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl font-bold mb-4">Galería</h2>
          <p className="text-muted-foreground">Un vistazo a nuestra cocina y pasión.</p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[250px]"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {images.map((image, index) => (
            <motion.div
              key={image.id}
              variants={itemVariants}
              className={`relative rounded-2xl overflow-hidden cursor-pointer group ${image.span}`}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              onClick={() => setSelectedId(image.id)}
              layoutId={`image-${image.id}`}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <motion.div 
                className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              >
                <motion.p 
                  className="text-white font-bold text-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                  initial={{ y: 10 }}
                  whileHover={{ y: 0 }}
                >
                  {image.alt}
                </motion.p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        <AnimatePresence>
          {selectedId !== null && (
            <Dialog open={selectedId !== null} onOpenChange={() => setSelectedId(null)}>
              <DialogContent className="max-w-5xl p-0 bg-transparent border-none shadow-none overflow-hidden">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  {selectedId && (
                    <img
                      src={images.find(i => i.id === selectedId)?.src}
                      alt="Selected"
                      className="w-full h-auto rounded-lg max-h-[85vh] object-contain"
                    />
                  )}
                </motion.div>
              </DialogContent>
            </Dialog>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
