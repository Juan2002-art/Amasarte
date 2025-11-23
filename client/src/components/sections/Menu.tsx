import { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, Leaf, Flame, Star, Info } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import pizzaImage from '@assets/generated_images/margherita_pizza_menu_item.png';
import { useCart } from '@/context/CartContext';

// Mock Data
const menuItems = {
  clasicas: [
    { id: 1, name: 'Margherita', desc: 'Salsa de tomate San Marzano, mozzarella fior di latte, albahaca fresca, aceite de oliva virgen extra.', price: 12.99, tags: ['veg'], image: pizzaImage },
    { id: 2, name: 'Pepperoni', desc: 'Salsa de tomate, mozzarella, doble porción de pepperoni crujiente.', price: 14.50, tags: ['popular'], image: pizzaImage },
    { id: 3, name: 'Cuatro Quesos', desc: 'Mozzarella, gorgonzola, parmesano reggiano, provolone, miel picante.', price: 15.50, tags: ['veg'], image: pizzaImage },
    { id: 4, name: 'Hawaiana Artesanal', desc: 'Piña asada, jamón serrano, mozzarella, salsa de tomate.', price: 14.99, tags: [], image: pizzaImage },
  ],
  especiales: [
    { id: 5, name: 'Trufa y Hongos', desc: 'Crema de trufa, mix de hongos silvestres, mozzarella, aceite de trufa blanca.', price: 18.99, tags: ['gourmet', 'veg'], image: pizzaImage },
    { id: 6, name: 'Burrata y Prosciutto', desc: 'Base blanca, prosciutto di Parma, burrata fresca entera, rúcula, tomates cherry.', price: 19.50, tags: ['chef-choice'], image: pizzaImage },
    { id: 7, name: 'Diavola Picante', desc: "Salami picante, 'nduja calabresa, chiles frescos, miel.", price: 16.50, tags: ['spicy'], image: pizzaImage },
  ],
  bebidas: [
    { id: 8, name: 'Limonada Casera', desc: 'Limones frescos, menta y un toque de jengibre.', price: 4.50, tags: [], image: null },
    { id: 9, name: 'Cerveza Artesanal IPA', desc: 'Cervecería local, notas cítricas.', price: 6.00, tags: [], image: null },
    { id: 10, name: 'Vino Tinto Malbec', desc: 'Copa de la casa.', price: 7.50, tags: [], image: null },
  ]
};

const categories = [
  { id: 'clasicas', label: 'Clásicas' },
  { id: 'especiales', label: 'Especiales' },
  { id: 'bebidas', label: 'Bebidas' },
];

export function Menu() {
  const [activeTab, setActiveTab] = useState('clasicas');
  const { addItem } = useCart();

  return (
    <section id="menu" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Nuestro Menú</h2>
          <p className="text-muted-foreground text-lg">
            Sabores auténticos creados con ingredientes frescos y mucho amor.
          </p>
        </div>

        <Tabs defaultValue="clasicas" className="w-full" onValueChange={setActiveTab}>
          <div className="flex justify-center mb-12 overflow-x-auto pb-2">
            <TabsList className="bg-muted/50 p-1 h-auto rounded-full">
              {categories.map((cat) => (
                <TabsTrigger
                  key={cat.id}
                  value={cat.id}
                  className="rounded-full px-8 py-3 text-base data-[state=active]:bg-primary data-[state=active]:text-white transition-all duration-300"
                >
                  {cat.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {categories.map((cat) => (
            <TabsContent key={cat.id} value={cat.id} className="mt-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {menuItems[cat.id as keyof typeof menuItems].map((item) => (
                  <Card key={item.id} className="group overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 bg-white h-full flex flex-col">
                    {item.image && (
                      <div className="relative h-56 overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute top-3 right-3 flex flex-col gap-2">
                          {item.tags.includes('veg') && (
                            <Badge className="bg-green-500 hover:bg-green-600"><Leaf size={12} className="mr-1" /> Veg</Badge>
                          )}
                          {item.tags.includes('spicy') && (
                            <Badge className="bg-red-500 hover:bg-red-600"><Flame size={12} className="mr-1" /> Hot</Badge>
                          )}
                          {item.tags.includes('popular') && (
                            <Badge className="bg-amber-500 hover:bg-amber-600"><Star size={12} className="mr-1" /> Top</Badge>
                          )}
                        </div>
                      </div>
                    )}
                    <CardHeader className={item.image ? 'pt-6' : ''}>
                      <div className="flex justify-between items-start mb-2">
                        <CardTitle className="text-xl font-bold">{item.name}</CardTitle>
                        <span className="text-lg font-bold text-primary">${item.price}</span>
                      </div>
                      <CardDescription className="text-base line-clamp-2">{item.desc}</CardDescription>
                    </CardHeader>
                    <CardFooter className="mt-auto pt-4">
                      <Button 
                        className="w-full rounded-full group-hover:bg-primary group-hover:text-white transition-colors"
                        onClick={() => addItem({
                          id: item.id,
                          name: item.name,
                          price: item.price,
                          image: item.image || undefined
                        })}
                      >
                        <Plus size={18} className="mr-2" /> Agregar al Pedido
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </motion.div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="mt-16 text-center">
          <Button variant="outline" size="lg" className="rounded-full border-primary text-primary hover:bg-primary hover:text-white">
            Descargar Menú PDF
          </Button>
        </div>
      </div>
    </section>
  );
}
