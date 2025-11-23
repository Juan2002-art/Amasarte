import { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, Leaf, Flame, Star, Check } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';
import margheritaImage from '@assets/generated_images/fresh_margherita_pizza_with_basil.png';
import pepperoniImage from '@assets/generated_images/crispy_pepperoni_pizza_with_cheese.png';
import quatroQuesosImage from '@assets/generated_images/gourmet_four_cheese_pizza.png';
import hawaianaImage from '@assets/generated_images/hawaiian_pizza_with_pineapple_ham.png';
import trufaImage from '@assets/generated_images/truffle_mushroom_gourmet_pizza.png';
import burratImage from '@assets/generated_images/burrata_prosciutto_artisanal_pizza.png';
import diabolaImage from '@assets/generated_images/spicy_diavola_hot_pizza.png';
import carboneraImage from '@assets/generated_images/carbonara_pizza_with_pancetta.png';
import capreseImage from '@assets/generated_images/caprese_pizza_with_fresh_ingredients.png';
import ruguelaImage from '@assets/generated_images/arugula_and_parmesan_pizza.png';
import bbqImage from '@assets/generated_images/bbq_smoked_meat_pizza.png';
import camaronesImage from '@assets/generated_images/garlic_shrimp_pizza.png';
import limonadaImage from '@assets/generated_images/fresh_homemade_lemonade.png';
import cervezaIPAImage from '@assets/generated_images/craft_ipa_beer_glass.png';
import vinoTintoImage from '@assets/generated_images/red_malbec_wine_glass.png';
import aguaImage from '@assets/generated_images/sparkling_mineral_water.png';
import refrescoImage from '@assets/generated_images/fresh_tropical_fruit_juice.png';
import vino_blancoImage from '@assets/generated_images/white_sauvignon_blanc_wine.png';
import cervezaImage from '@assets/generated_images/premium_lager_beer_glass.png';
import gasosaImage from '@assets/generated_images/premium_gourmet_soda.png';

// Format price in Colombian pesos
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

// Mock Data
const menuItems = {
  clasicas: [
    { id: 1, name: 'Margherita', desc: 'Salsa de tomate San Marzano, mozzarella fior di latte, albahaca fresca, aceite de oliva virgen extra.', price: 32000, tags: ['veg'], image: margheritaImage },
    { id: 2, name: 'Pepperoni', desc: 'Salsa de tomate, mozzarella, doble porción de pepperoni crujiente.', price: 35000, tags: ['popular'], image: pepperoniImage },
    { id: 3, name: 'Cuatro Quesos', desc: 'Mozzarella, gorgonzola, parmesano reggiano, provolone, miel picante.', price: 38000, tags: ['veg'], image: quatroQuesosImage },
    { id: 4, name: 'Hawaiana Artesanal', desc: 'Piña asada, jamón serrano, mozzarella, salsa de tomate.', price: 35000, tags: [], image: hawaianaImage },
    { id: 11, name: 'Carbonara', desc: 'Base blanca, panceta, queso pecorino, yema de huevo, pimienta negra.', price: 36000, tags: [], image: carboneraImage },
    { id: 12, name: 'Caprese', desc: 'Tomates frescos, mozzarella de búfala, albahaca, aceite de oliva, balsámico.', price: 34000, tags: ['veg'], image: capreseImage },
  ],
  especiales: [
    { id: 5, name: 'Trufa y Hongos', desc: 'Crema de trufa, mix de hongos silvestres, mozzarella, aceite de trufa blanca.', price: 42000, tags: ['gourmet', 'veg'], image: trufaImage },
    { id: 6, name: 'Burrata y Prosciutto', desc: 'Base blanca, prosciutto di Parma, burrata fresca entera, rúcula, tomates cherry.', price: 44000, tags: ['chef-choice'], image: burratImage },
    { id: 7, name: 'Diavola Picante', desc: "Salami picante, 'nduja calabresa, chiles frescos, miel.", price: 40000, tags: ['spicy'], image: diabolaImage },
    { id: 13, name: 'Rúcula y Parmesano', desc: 'Base blanca, rúcula fresca, virutas de parmesano, tomates asados, piñones.', price: 41000, tags: ['veg', 'gourmet'], image: ruguelaImage },
    { id: 14, name: 'BBQ Ahumada', desc: 'Carne ahumada, cebolla roja, cilantro, salsa BBQ artesanal.', price: 43000, tags: ['popular'], image: bbqImage },
    { id: 15, name: 'Camarones al Ajillo', desc: 'Base blanca, camarones al ajillo, limón, ajo tostado, perejil.', price: 45000, tags: ['chef-choice'], image: camaronesImage },
  ],
  bebidas: [
    { id: 8, name: 'Limonada Casera', desc: 'Limones frescos, menta y un toque de jengibre.', price: 13000, tags: [], image: limonadaImage },
    { id: 9, name: 'Cerveza Artesanal IPA', desc: 'Cervecería local, notas cítricas.', price: 14000, tags: [], image: cervezaIPAImage },
    { id: 10, name: 'Vino Tinto Malbec', desc: 'Copa de la casa.', price: 15000, tags: [], image: vinoTintoImage },
    { id: 16, name: 'Agua Mineral con Gas', desc: 'Refrescante y pura, con burbujas naturales.', price: 8000, tags: [], image: aguaImage },
    { id: 17, name: 'Refresco Natural', desc: 'Jugo fresco de frutas tropicales del día.', price: 10000, tags: [], image: refrescoImage },
    { id: 18, name: 'Vino Blanco Sauvignon Blanc', desc: 'Copa de blanco, fresco y afrutado.', price: 13000, tags: [], image: vino_blancoImage },
    { id: 19, name: 'Cerveza Lager Premium', desc: 'Cerveza clara, suave y refrescante.', price: 12000, tags: [], image: cervezaImage },
    { id: 20, name: 'Gaseosa Premium', desc: 'Bebida carbonatada gourmet de importación.', price: 9000, tags: [], image: gasosaImage },
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
  const [addedItems, setAddedItems] = useState<Set<number>>(new Set());

  const handleAddToCart = (item: any) => {
    addItem({ id: item.id, name: item.name, price: item.price });
    setAddedItems(new Set([...addedItems, item.id]));
    toast.success(`${item.name} agregada al pedido`);
    setTimeout(() => {
      setAddedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(item.id);
        return newSet;
      });
    }, 2000);
  };

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
                        <span className="text-lg font-bold text-primary">{formatPrice(item.price)}</span>
                      </div>
                      <CardDescription className="text-base line-clamp-2">{item.desc}</CardDescription>
                    </CardHeader>
                    <CardFooter className="mt-auto pt-4">
                      <Button 
                        onClick={() => handleAddToCart(item)}
                        className={`w-full rounded-full transition-colors ${addedItems.has(item.id) ? 'bg-primary text-white' : 'group-hover:bg-primary group-hover:text-white'}`}
                        data-testid={`button-add-${item.id}`}
                      >
                        {addedItems.has(item.id) ? <Check size={18} className="mr-2" /> : <Plus size={18} className="mr-2" />}
                        {addedItems.has(item.id) ? 'Agregada' : 'Agregar al Pedido'}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </motion.div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
