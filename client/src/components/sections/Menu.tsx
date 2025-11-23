import { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, Leaf, Flame, Star, Check } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useCart, PizzaOptions } from '@/context/CartContext';
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

// Size multipliers for pizza prices
const sizeMultipliers = {
  personal: 1,
  mediana: 1.3,
  grande: 1.7,
};

const sizeLabels = {
  personal: 'Personal (25cm)',
  mediana: 'Mediana (30cm)',
  grande: 'Grande (40cm)',
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
    { id: 50, name: 'Mitad de Cada Uno', desc: 'Escoge 2 pizzas diferentes y lleva mitad de cada una. El precio es la suma del 50% de cada pizza según el tamaño.', price: 0, tags: ['popular'], image: null },
  ],
  especiales: [
    { id: 5, name: 'Trufa y Hongos', desc: 'Crema de trufa, mix de hongos silvestres, mozzarella, aceite de trufa blanca.', price: 42000, tags: ['gourmet', 'veg'], image: trufaImage },
    { id: 6, name: 'Burrata y Prosciutto', desc: 'Base blanca, prosciutto di Parma, burrata fresca entera, rúcula, tomates cherry.', price: 44000, tags: ['chef-choice'], image: burratImage },
    { id: 7, name: 'Diavola Picante', desc: "Salami picante, 'nduja calabresa, chiles frescos, miel.", price: 40000, tags: ['spicy'], image: diabolaImage },
    { id: 13, name: 'Rúcula y Parmesano', desc: 'Base blanca, rúcula fresca, virutas de parmesano, tomates asados, piñones.', price: 41000, tags: ['veg', 'gourmet'], image: ruguelaImage },
    { id: 14, name: 'BBQ Ahumada', desc: 'Carne ahumada, cebolla roja, cilantro, salsa BBQ artesanal.', price: 43000, tags: ['popular'], image: bbqImage },
    { id: 15, name: 'Camarones al Ajillo', desc: 'Base blanca, camarones al ajillo, limón, ajo tostado, perejil.', price: 45000, tags: ['chef-choice'], image: camaronesImage },
  ],
  porciones: [
    { id: 101, name: 'Porción Margherita', desc: '1 Porción de Margherita crujiente.', price: 8000, tags: ['veg'], image: margheritaImage },
    { id: 102, name: 'Porción Pepperoni', desc: '1 Porción de Pepperoni con doble queso.', price: 9000, tags: ['popular'], image: pepperoniImage },
    { id: 103, name: 'Porción Cuatro Quesos', desc: '1 Porción gourmet de 4 quesos.', price: 10000, tags: ['veg'], image: quatroQuesosImage },
    { id: 104, name: 'Porción Hawaiana', desc: '1 Porción de Hawaiana Artesanal.', price: 9000, tags: [], image: hawaianaImage },
    { id: 105, name: 'Porción BBQ', desc: '1 Porción de BBQ Ahumada.', price: 11000, tags: [], image: bbqImage },
    { id: 106, name: 'Porción Diavola', desc: '1 Porción picante Diavola.', price: 10500, tags: ['spicy'], image: diabolaImage },
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

const allPizzas = [
  ...menuItems.clasicas,
  ...menuItems.especiales
];

const categories = [
  { id: 'clasicas', label: 'Clásicas' },
  { id: 'especiales', label: 'Especiales' },
  { id: 'porciones', label: 'Porciones' },
  { id: 'bebidas', label: 'Bebidas' },
];

const baseOptions = [
  { value: 'tomate', label: 'Salsa de Tomate' },
  { value: 'blanca', label: 'Base Blanca (Crema)' },
  { value: 'barbeque', label: 'Base BBQ' },
];

export function Menu() {
  const [activeTab, setActiveTab] = useState('clasicas');
  const { addItem } = useCart();
  const [addedItems, setAddedItems] = useState<Set<number>>(new Set());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [mitadCadaPizza1, setMitadCadaPizza1] = useState<any>(null);
  const [mitadCadaPizza2, setMitadCadaPizza2] = useState<any>(null);
  const [baseType, setBaseType] = useState('tomate');
  const [selectedSize, setSelectedSize] = useState<'personal' | 'mediana' | 'grande'>('mediana');

  const isMitadDeCadaPizza = selectedItem?.id === 50;

  const isPizza = (item: any) => {
    return activeTab === 'clasicas' || activeTab === 'especiales' || menuItems.especiales.find(p => p.id === item.id) || menuItems.clasicas.find(p => p.id === item.id);
  };

  const isBeverage = (item: any) => activeTab === 'bebidas' || menuItems.bebidas.find(b => b.id === item.id);

  const isPortion = (item: any) => activeTab === 'porciones' || menuItems.porciones.find(p => p.id === item.id);

  const handleItemClick = (item: any) => {
    if (isBeverage(item)) {
      handleAddToCart(item);
    } else if (isPortion(item)) {
      handleAddToCart(item);
    } else if (isPizza(item)) {
      setSelectedItem(item);
      setMitadCadaPizza1(null);
      setMitadCadaPizza2(null);
      setBaseType('tomate');
      setSelectedSize('mediana');
      setDialogOpen(true);
    }
  };

  const handleAddToCart = (item: any, options?: PizzaOptions) => {
    addItem({ id: item.id, name: item.name, price: item.price }, options);
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

  const handleConfirmPizza = () => {
    if (isMitadDeCadaPizza && (!mitadCadaPizza1 || !mitadCadaPizza2)) {
      toast.error('Por favor selecciona 2 pizzas para la mitad de cada una');
      return;
    }

    let priceWithSize = 0;
    let displayName = selectedItem.name;
    
    if (isMitadDeCadaPizza && mitadCadaPizza1 && mitadCadaPizza2) {
      const size = sizeMultipliers[selectedSize as keyof typeof sizeMultipliers];
      const halfPrice1 = Math.round((mitadCadaPizza1.price * size) / 2);
      const halfPrice2 = Math.round((mitadCadaPizza2.price * size) / 2);
      priceWithSize = halfPrice1 + halfPrice2;
      displayName = `Mitad ${mitadCadaPizza1.name} + Mitad ${mitadCadaPizza2.name}`;
    } else {
      priceWithSize = Math.round(selectedItem.price * sizeMultipliers[selectedSize as keyof typeof sizeMultipliers]);
    }

    const itemWithPrice = { ...selectedItem, name: displayName, price: priceWithSize };

    const options: PizzaOptions = {
      tipoBase: baseType,
      tamaño: selectedSize,
      ...(isMitadDeCadaPizza && {
        tipoPizza: 'mitadCadaPizza',
        mitadPizza1: mitadCadaPizza1 ? { id: mitadCadaPizza1.id, name: mitadCadaPizza1.name } : undefined,
        mitadPizza2: mitadCadaPizza2 ? { id: mitadCadaPizza2.id, name: mitadCadaPizza2.name } : undefined,
      }),
    };

    handleAddToCart(itemWithPrice, options);
    setDialogOpen(false);
    setSelectedItem(null);
  };

  return (
    <section id="menu" className="py-24" style={{ backgroundColor: '#1A3A3B' }}>
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#F5E8D0' }}>Nuestro Menú</h2>
          <p className="text-lg" style={{ color: '#F5E8D0' }}>
            Sabores auténticos creados con ingredientes frescos y mucho amor.
          </p>
        </div>

        <Tabs defaultValue="clasicas" className="w-full" onValueChange={setActiveTab}>
          <div className="flex justify-center mb-12 overflow-x-auto pb-2">
            <TabsList className="p-1 h-auto rounded-full" style={{ backgroundColor: '#2A5A5B' }}>
              {categories.map((cat) => (
                <TabsTrigger
                  key={cat.id}
                  value={cat.id}
                  className="rounded-full px-8 py-3 text-base transition-all duration-300 data-[state=active]:bg-orange-500 data-[state=active]:text-white"
                  style={{ color: '#F5E8D0' }}
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
                  <Card key={item.id} className="group overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col" style={{ backgroundColor: '#1A3A3B' }}>
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
                        <CardTitle className="text-xl font-bold" style={{ color: '#F5E8D0' }}>{item.name}</CardTitle>
                        <span className="text-lg font-bold text-orange-400">{formatPrice(item.price)}</span>
                      </div>
                      <CardDescription className="text-base line-clamp-2" style={{ color: '#F5E8D0' }}>{item.desc}</CardDescription>
                    </CardHeader>
                    <CardFooter className="mt-auto pt-4">
                      <Button 
                        onClick={() => handleItemClick(item)}
                        className={`w-full rounded-full transition-colors ${addedItems.has(item.id) ? 'bg-green-600 hover:bg-green-700' : 'bg-orange-500 hover:bg-orange-600'} text-white`}
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

      {/* Pizza Customization Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Personalizar {selectedItem?.name}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Mitad de Cada Pizza Selection */}
            {isMitadDeCadaPizza && (
              <div className="p-4 rounded-lg space-y-4" style={{ backgroundColor: '#2A5A5B' }}>
                <p className="text-sm font-medium" style={{ color: '#F5E8D0' }}>Selecciona mitad de 2 pizzas diferentes:</p>
                
                <div>
                  <Label className="text-base font-semibold mb-2 block" style={{ color: '#FFFFFF' }}>Primera Pizza (Mitad)</Label>
                  <select 
                    value={mitadCadaPizza1?.id || ''} 
                    onChange={(e) => {
                      const pizza = allPizzas.find(p => p.id === parseInt(e.target.value) && p.id !== 50);
                      setMitadCadaPizza1(pizza);
                    }}
                    className="w-full px-3 py-2 border rounded-md bg-white"
                    data-testid="select-mitad-cada-pizza-1"
                  >
                    <option value="">Selecciona una pizza...</option>
                    {allPizzas.filter(p => p.id !== 50).map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label className="text-base font-semibold mb-2 block" style={{ color: '#FFFFFF' }}>Segunda Pizza (Mitad)</Label>
                  <select 
                    value={mitadCadaPizza2?.id || ''} 
                    onChange={(e) => {
                      const pizza = allPizzas.find(p => p.id === parseInt(e.target.value) && p.id !== 50);
                      setMitadCadaPizza2(pizza);
                    }}
                    className="w-full px-3 py-2 border rounded-md bg-white"
                    data-testid="select-mitad-cada-pizza-2"
                  >
                    <option value="">Selecciona una pizza...</option>
                    {allPizzas.filter(p => p.id !== 50).map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                {mitadCadaPizza1 && mitadCadaPizza2 && (
                  <div className="mt-3 p-3 rounded border-l-4" style={{ backgroundColor: '#1A3A3B', borderLeftColor: '#FF8533' }}>
                    <p className="text-sm font-semibold" style={{ color: '#FF8533' }}>✓ Combinación: Mitad {mitadCadaPizza1.name} + Mitad {mitadCadaPizza2.name}</p>
                    <div className="text-xs mt-2 space-y-1" style={{ color: '#F5E8D0' }}>
                      <div>Mitad {mitadCadaPizza1.name}: {formatPrice(Math.round((mitadCadaPizza1.price * sizeMultipliers[selectedSize as keyof typeof sizeMultipliers]) / 2))}</div>
                      <div>Mitad {mitadCadaPizza2.name}: {formatPrice(Math.round((mitadCadaPizza2.price * sizeMultipliers[selectedSize as keyof typeof sizeMultipliers]) / 2))}</div>
                      <div className="font-bold" style={{ color: '#FF8533' }}>Total: {formatPrice(Math.round((mitadCadaPizza1.price * sizeMultipliers[selectedSize as keyof typeof sizeMultipliers]) / 2) + Math.round((mitadCadaPizza2.price * sizeMultipliers[selectedSize as keyof typeof sizeMultipliers]) / 2))}</div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Size Selection */}
            <div>
              <Label className="text-base font-semibold mb-3 block" style={{ color: '#F5E8D0' }}>Tamaño de Pizza</Label>
              <RadioGroup value={selectedSize} onValueChange={(v: any) => setSelectedSize(v)}>
                <div className="space-y-3">
                  {(Object.entries(sizeLabels) as [keyof typeof sizeLabels, string][]).map(([size, label]) => {
                    let displayPrice = 0;
                    if (isMitadDeCadaPizza) {
                      if (mitadCadaPizza1 && mitadCadaPizza2) {
                        const halfPrice1 = Math.round((mitadCadaPizza1.price * sizeMultipliers[size]) / 2);
                        const halfPrice2 = Math.round((mitadCadaPizza2.price * sizeMultipliers[size]) / 2);
                        displayPrice = halfPrice1 + halfPrice2;
                      } else {
                        displayPrice = 0;
                      }
                    } else {
                      displayPrice = Math.round(selectedItem?.price * sizeMultipliers[size]);
                    }
                    return (
                      <div key={size} className="flex items-center space-x-2 p-3 border rounded-lg transition-colors cursor-pointer" style={{ backgroundColor: '#2A5A5B', borderColor: '#FF8533', color: '#F5E8D0' }}
                        onClick={() => setSelectedSize(size)}
                      >
                        <RadioGroupItem value={size} id={size} />
                        <Label htmlFor={size} className="flex-1 cursor-pointer">
                          <div className="font-semibold">{label}</div>
                          <div className="text-sm" style={{ color: '#F5E8D0' }}>+ {formatPrice(displayPrice - (selectedItem?.price || 0))}</div>
                        </Label>
                        <span className="font-bold" style={{ color: '#FF8533' }}>{formatPrice(displayPrice)}</span>
                      </div>
                    );
                  })}
                </div>
              </RadioGroup>
            </div>

            {/* Base Type Selection */}
            <div>
              <Label className="text-base font-semibold mb-3 block" style={{ color: '#F5E8D0' }}>Tipo de Base</Label>
              <RadioGroup value={baseType} onValueChange={setBaseType}>
                {baseOptions.map(option => (
                  <div key={option.value} className="flex items-center space-x-2 mb-3">
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label htmlFor={option.value} className="text-base cursor-pointer" style={{ color: '#F5E8D0' }}>{option.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDialogOpen(false)}
              data-testid="button-cancel-pizza"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleConfirmPizza}
              className="bg-primary text-white"
              data-testid="button-confirm-pizza"
            >
              Agregar al Pedido
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
