import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCart, PizzaOptions } from '@/context/CartContext';
import { toast } from 'sonner';
import { Gift, Flame, Star, Check } from 'lucide-react';

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

// Menu items data
const pizzasClasicas = [
  { id: 1, name: 'Margherita', price: 32000 },
  { id: 2, name: 'Pepperoni', price: 35000 },
  { id: 3, name: 'Cuatro Quesos', price: 38000 },
  { id: 4, name: 'Hawaiana Artesanal', price: 35000 },
  { id: 11, name: 'Carbonara', price: 36000 },
  { id: 12, name: 'Caprese', price: 34000 },
];

const allPizzas = [
  ...pizzasClasicas,
  { id: 5, name: 'Trufa y Hongos', price: 42000 },
  { id: 6, name: 'Burrata y Prosciutto', price: 44000 },
  { id: 7, name: 'Diavola Picante', price: 40000 },
  { id: 13, name: 'Rúcula y Parmesano', price: 41000 },
  { id: 14, name: 'BBQ Ahumada', price: 43000 },
  { id: 15, name: 'Camarones al Ajillo', price: 45000 },
];

const porciones = [
  { id: 101, name: 'Porción Margherita', price: 8000 },
  { id: 102, name: 'Porción Pepperoni', price: 9000 },
  { id: 103, name: 'Porción Cuatro Quesos', price: 10000 },
  { id: 104, name: 'Porción Hawaiana', price: 9000 },
  { id: 105, name: 'Porción BBQ', price: 11000 },
  { id: 106, name: 'Porción Diavola', price: 10500 },
];

const bebidas = [
  { id: 8, name: 'Limonada Casera', price: 13000 },
  { id: 9, name: 'Cerveza Artesanal IPA', price: 14000 },
  { id: 10, name: 'Vino Tinto Malbec', price: 15000 },
  { id: 16, name: 'Agua Mineral con Gas', price: 8000 },
  { id: 17, name: 'Refresco Natural', price: 10000 },
  { id: 18, name: 'Vino Blanco Sauvignon Blanc', price: 13000 },
  { id: 19, name: 'Cerveza Lager Premium', price: 12000 },
  { id: 20, name: 'Gaseosa Premium', price: 9000 },
];

const baseOptions = [
  { value: 'tomate', label: 'Salsa de Tomate' },
  { value: 'blanca', label: 'Base Blanca (Crema)' },
  { value: 'barbeque', label: 'Base BBQ' },
];

const promotions: any[] = [
  {
    id: 'promo-1',
    itemId: 201,
    title: '2x1 en Pizzas Personales',
    description: 'Compra una pizza personal y lleva dos. Válido en pizzas clásicas.',
    discount: '50%',
    originalPrice: 32000,
    promoPrice: 16000,
    badge: 'HOT DEAL',
    highlight: true,
    details: 'Selecciona 2 pizzas clásicas tamaño personal',
  },
  {
    id: 'promo-2',
    itemId: 202,
    title: 'Pizza Grande -50%',
    description: 'Lleva una pizza grande con el 50% de descuento.',
    discount: '50%',
    originalPrice: 52000,
    promoPrice: 26000,
    badge: 'MEGA DESCUENTO',
    highlight: true,
    details: 'Selecciona cualquier pizza en tamaño grande',
  },
  {
    id: 'promo-3',
    itemId: 203,
    title: '3 Porciones + Bebida Gratis',
    description: 'Lleva 3 porciones individuales + 1 bebida gratis.',
    discount: 'BEBIDA GRATIS',
    badge: 'COMBO',
    highlight: false,
    details: 'Selecciona 3 porciones y 1 bebida (gratis)',
    promoPrice: 21000,
  },
];

export function Promotions() {
  const { addItem } = useCart();
  const [addedPromos, setAddedPromos] = useState<Set<string>>(new Set());
  
  // Promo-1 state
  const [promo1DialogOpen, setPromo1DialogOpen] = useState(false);
  const [promo1Pizza1, setPromo1Pizza1] = useState<any>(null);
  const [promo1Pizza2, setPromo1Pizza2] = useState<any>(null);
  const [promo1Base, setPromo1Base] = useState('tomate');

  // Promo-2 state
  const [promo2DialogOpen, setPromo2DialogOpen] = useState(false);
  const [promo2Type, setPromo2Type] = useState<'completa' | 'mitadCadaPizza'>('completa');
  const [promo2Pizza, setPromo2Pizza] = useState<any>(null);
  const [promo2MitadPizza1, setPromo2MitadPizza1] = useState<any>(null);
  const [promo2MitadPizza2, setPromo2MitadPizza2] = useState<any>(null);
  const [promo2Base, setPromo2Base] = useState('tomate');

  // Promo-3 state
  const [promo3DialogOpen, setPromo3DialogOpen] = useState(false);
  const [promo3Porciones, setPromo3Porciones] = useState<any[]>([]);
  const [promo3Bebida, setPromo3Bebida] = useState<any>(null);

  // Handlers for Promo-1
  const handlePromo1Click = () => {
    setPromo1Pizza1(null);
    setPromo1Pizza2(null);
    setPromo1Base('tomate');
    setPromo1DialogOpen(true);
  };

  const handlePromo1Confirm = () => {
    if (!promo1Pizza1 || !promo1Pizza2) {
      toast.error('Por favor selecciona 2 pizzas');
      return;
    }

    const baseLabelMap: any = { tomate: 'Tomate', blanca: 'Blanca', barbeque: 'BBQ' };
    const itemName = `2x1 ${promo1Pizza1.name} + ${promo1Pizza2.name} (Personal, Base ${baseLabelMap[promo1Base]})`;
    addItem(
      {
        id: 201,
        name: itemName,
        price: 16000,
      },
      {
        esPromocion: true,
        porcentajeDescuento: 50,
        tipoBase: promo1Base,
      }
    );

    setAddedPromos(new Set([...addedPromos, 'promo-1']));
    toast.success(`✓ ${itemName} agregada!`);
    setPromo1DialogOpen(false);
    
    setTimeout(() => {
      setAddedPromos(prev => {
        const newSet = new Set(prev);
        newSet.delete('promo-1');
        return newSet;
      });
    }, 2000);
  };

  // Handlers for Promo-2
  const handlePromo2Click = () => {
    setPromo2Type('completa');
    setPromo2Pizza(null);
    setPromo2MitadPizza1(null);
    setPromo2MitadPizza2(null);
    setPromo2Base('tomate');
    setPromo2DialogOpen(true);
  };

  const handlePromo2Confirm = () => {
    if (promo2Type === 'completa' && !promo2Pizza) {
      toast.error('Por favor selecciona una pizza');
      return;
    }

    if (promo2Type === 'mitadCadaPizza' && (!promo2MitadPizza1 || !promo2MitadPizza2)) {
      toast.error('Por favor selecciona 2 pizzas para la mitad de cada una');
      return;
    }

    const baseLabelMap: any = { tomate: 'Tomate', blanca: 'Blanca', barbeque: 'BBQ' };
    let itemName = '';
    let priceBeforeDiscount = 0;

    if (promo2Type === 'completa') {
      const grandePrice = Math.round(promo2Pizza.price * 1.7);
      priceBeforeDiscount = grandePrice;
      itemName = `${promo2Pizza.name} Grande -50% (Base ${baseLabelMap[promo2Base]})`;
    } else {
      const halfPrice1 = Math.round((promo2MitadPizza1.price * 1.7) / 2);
      const halfPrice2 = Math.round((promo2MitadPizza2.price * 1.7) / 2);
      priceBeforeDiscount = halfPrice1 + halfPrice2;
      itemName = `Mitad ${promo2MitadPizza1.name} + Mitad ${promo2MitadPizza2.name} Grande -50% (Base ${baseLabelMap[promo2Base]})`;
    }

    const promoPrice = Math.round(priceBeforeDiscount * 0.5);

    addItem(
      {
        id: 202,
        name: itemName,
        price: promoPrice,
      },
      {
        esPromocion: true,
        porcentajeDescuento: 50,
        tamaño: 'grande',
        tipoBase: promo2Base,
        tipoPizza: promo2Type,
        ...(promo2Type === 'mitadCadaPizza' && {
          mitadPizza1: promo2MitadPizza1 ? { id: promo2MitadPizza1.id, name: promo2MitadPizza1.name } : undefined,
          mitadPizza2: promo2MitadPizza2 ? { id: promo2MitadPizza2.id, name: promo2MitadPizza2.name } : undefined,
        }),
      }
    );

    setAddedPromos(new Set([...addedPromos, 'promo-2']));
    toast.success(`✓ ${itemName} agregada!`);
    setPromo2DialogOpen(false);

    setTimeout(() => {
      setAddedPromos(prev => {
        const newSet = new Set(prev);
        newSet.delete('promo-2');
        return newSet;
      });
    }, 2000);
  };

  // Handlers for Promo-3
  const handlePromo3Click = () => {
    setPromo3Porciones([]);
    setPromo3Bebida(null);
    setPromo3DialogOpen(true);
  };

  const handlePromo3AddPorcion = (porcion: any) => {
    if (promo3Porciones.length < 3) {
      setPromo3Porciones([...promo3Porciones, porcion]);
    }
  };

  const handlePromo3RemovePorcion = (index: number) => {
    setPromo3Porciones(promo3Porciones.filter((_, i) => i !== index));
  };

  const handlePromo3Confirm = () => {
    if (promo3Porciones.length !== 3 || !promo3Bebida) {
      toast.error('Por favor selecciona 3 porciones y 1 bebida');
      return;
    }

    const porcionesNames = promo3Porciones.map(p => p.name).join(', ');
    const itemName = `3 Porciones + ${promo3Bebida.name} (Gratis)`;

    addItem(
      {
        id: 203,
        name: itemName,
        price: 21000,
      },
      {
        esPromocion: true,
        porcentajeDescuento: 15,
      }
    );

    setAddedPromos(new Set([...addedPromos, 'promo-3']));
    toast.success(`✓ ${itemName} agregada!`);
    setPromo3DialogOpen(false);

    setTimeout(() => {
      setAddedPromos(prev => {
        const newSet = new Set(prev);
        newSet.delete('promo-3');
        return newSet;
      });
    }, 2000);
  };

  return (
    <>
      <section id="promotions" className="py-24" style={{ backgroundColor: '#1A3A3B' }}>
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Gift style={{ color: '#F5E8D0' }} size={32} />
              <h2 className="text-4xl md:text-5xl font-bold" style={{ color: '#F5E8D0' }}>Promociones Semanales</h2>
              <Flame style={{ color: '#F5E8D0' }} size={32} />
            </div>
            <p className="text-lg" style={{ color: '#F5E8D0' }}>
              Ofertas especiales que no puedes perder. ¡Aprovecha esta semana!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {promotions.map((promo, index) => (
              <motion.div
                key={promo.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  className={`overflow-hidden border-2 transition-all duration-300 h-full flex flex-col ${
                    promo.highlight
                      ? 'border-orange-400 shadow-xl hover:shadow-2xl'
                      : 'border-gray-600 hover:border-orange-400 hover:shadow-lg'
                  }`}
                  style={{ backgroundColor: '#1A3A3B', color: '#F5E8D0' }}
                >
                  {promo.highlight && (
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 py-2 px-4">
                      <p className="text-sm font-bold text-center flex items-center justify-center gap-1" style={{ color: '#F5E8D0' }}>
                        <Star size={14} />
                        {promo.badge}
                        <Star size={14} />
                      </p>
                    </div>
                  )}

                  <CardHeader className={promo.highlight ? 'pt-4 pb-2' : ''}>
                    {!promo.highlight && (
                      <Badge className="w-fit mb-2 bg-orange-500 hover:bg-orange-600">
                        {promo.badge}
                      </Badge>
                    )}
                    <CardTitle className="text-2xl" style={{ color: '#F5E8D0' }}>{promo.title}</CardTitle>
                    <p className="text-sm mt-2" style={{ color: '#F5E8D0' }}>{promo.description}</p>
                  </CardHeader>

                  <CardContent className="flex-1">
                    {promo.originalPrice && (
                      <div className="space-y-2 mb-4">
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-bold text-orange-400">{formatPrice(promo.promoPrice)}</span>
                          <span className="text-xl line-through" style={{ color: '#F5E8D0' }}>{formatPrice(promo.originalPrice)}</span>
                        </div>
                        <div className="inline-block bg-orange-600 text-orange-100 px-3 py-1 rounded-full text-sm font-bold">
                          Ahorra {formatPrice(promo.originalPrice - promo.promoPrice)}
                        </div>
                      </div>
                    )}
                    {!promo.originalPrice && (
                      <div className="border-l-4 border-orange-400 p-3 rounded mb-4" style={{ backgroundColor: '#2A5A5B' }}>
                        <p className="text-lg font-bold text-orange-300">{promo.discount}</p>
                        <p className="text-sm mt-1" style={{ color: '#F5E8D0' }}>{formatPrice(promo.promoPrice)}</p>
                      </div>
                    )}
                    <p className="text-xs p-2 rounded" style={{ backgroundColor: '#2A5A5B', color: '#F5E8D0' }}>
                      <strong>Detalles:</strong> {promo.details}
                    </p>
                  </CardContent>

                  <CardFooter>
                    <Button
                      onClick={() => {
                        if (promo.id === 'promo-1') handlePromo1Click();
                        else if (promo.id === 'promo-2') handlePromo2Click();
                        else if (promo.id === 'promo-3') handlePromo3Click();
                      }}
                      className={`w-full rounded-full font-semibold py-5 ${
                        addedPromos.has(promo.id)
                          ? 'bg-green-600 hover:bg-green-700'
                          : 'bg-orange-500 hover:bg-orange-600'
                      } text-white`}
                      data-testid={`button-promo-${promo.id}`}
                    >
                      {addedPromos.has(promo.id) ? (
                        <>
                          <Check size={18} className="mr-2" />
                          Agregada
                        </>
                      ) : (
                        'Aprovechar Oferta'
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12 rounded-lg p-8 border-l-4 relative overflow-hidden"
            style={{ 
              backgroundColor: '#2A5A5B',
              borderLeftColor: '#FF8533',
              boxShadow: '0 8px 32px rgba(255, 133, 51, 0.2)'
            }}
          >
            <div className="absolute -right-20 -top-20 w-40 h-40 bg-orange-500 rounded-full opacity-10"></div>
            <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-orange-500 rounded-full opacity-10"></div>
            
            <div className="relative z-10">
              <p className="text-center">
                <span 
                  className="inline-block font-bold text-xl md:text-2xl px-6 py-3 rounded-full"
                  style={{ 
                    color: '#FFFFFF',
                    backgroundColor: '#FF8533',
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                    letterSpacing: '1px'
                  }}
                >
                  ⏰ ¡Válido esta semana!
                </span>
              </p>
              <p className="text-center mt-4" style={{ color: '#F5E8D0', fontSize: '1rem' }}>
                Selecciona tus preferencias para cada promoción.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Promo-1: 2x1 Pizzas Personales Dialog */}
      <Dialog open={promo1DialogOpen} onOpenChange={setPromo1DialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle style={{ color: '#F5E8D0' }}>2x1 en Pizzas Personales</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm" style={{ color: '#F5E8D0' }}>Selecciona 2 pizzas clásicas tamaño personal (compra 1, lleva 2)</p>
            
            <div>
              <Label className="font-semibold mb-2 block" style={{ color: '#F5E8D0' }}>Primera Pizza</Label>
              <select 
                value={promo1Pizza1?.id || ''} 
                onChange={(e) => {
                  const pizza = pizzasClasicas.find(p => p.id === parseInt(e.target.value));
                  setPromo1Pizza1(pizza);
                }}
                className="w-full px-3 py-2 border rounded-md bg-white"
              >
                <option value="">Selecciona una pizza...</option>
                {pizzasClasicas.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <Label className="font-semibold mb-2 block" style={{ color: '#F5E8D0' }}>Segunda Pizza</Label>
              <select 
                value={promo1Pizza2?.id || ''} 
                onChange={(e) => {
                  const pizza = pizzasClasicas.find(p => p.id === parseInt(e.target.value));
                  setPromo1Pizza2(pizza);
                }}
                className="w-full px-3 py-2 border rounded-md bg-white"
              >
                <option value="">Selecciona una pizza...</option>
                {pizzasClasicas.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            {promo1Pizza1 && promo1Pizza2 && (
              <div className="p-3 rounded border-l-4" style={{ backgroundColor: '#1A3A3B', borderLeftColor: '#FF8533' }}>
                <p className="text-sm font-semibold" style={{ color: '#FF8533' }}>✓ Combo: {promo1Pizza1.name} + {promo1Pizza2.name}</p>
                <p className="text-xs mt-1" style={{ color: '#F5E8D0' }}>Precio: {formatPrice(16000)}</p>
              </div>
            )}

            <div>
              <Label className="font-semibold mb-3 block" style={{ color: '#F5E8D0' }}>Tipo de Base</Label>
              <RadioGroup value={promo1Base} onValueChange={setPromo1Base}>
                {baseOptions.map(option => (
                  <div key={option.value} className="flex items-center space-x-2 mb-2">
                    <RadioGroupItem value={option.value} id={`promo1-${option.value}`} />
                    <Label htmlFor={`promo1-${option.value}`} className="text-sm cursor-pointer" style={{ color: '#F5E8D0' }}>{option.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPromo1DialogOpen(false)}>Cancelar</Button>
            <Button onClick={handlePromo1Confirm} className="bg-orange-500 hover:bg-orange-600">Agregar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Promo-2: Pizza Grande -50% Dialog */}
      <Dialog open={promo2DialogOpen} onOpenChange={setPromo2DialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle style={{ color: '#F5E8D0' }}>Pizza Grande -50%</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm" style={{ color: '#F5E8D0' }}>Selecciona cualquier pizza en tamaño grande con 50% descuento</p>
            
            <div>
              <Label className="font-semibold mb-2 block" style={{ color: '#F5E8D0' }}>Tipo de Pizza</Label>
              <RadioGroup value={promo2Type} onValueChange={(v: any) => setPromo2Type(v)}>
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="completa" id="promo2-completa" />
                  <Label htmlFor="promo2-completa" className="text-sm cursor-pointer" style={{ color: '#F5E8D0' }}>Pizza Completa</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mitadCadaPizza" id="promo2-mitad-cada-pizza" />
                  <Label htmlFor="promo2-mitad-cada-pizza" className="text-sm cursor-pointer" style={{ color: '#F5E8D0' }}>Mitad de Cada Pizza</Label>
                </div>
              </RadioGroup>
            </div>

            {promo2Type === 'completa' && (
              <>
                <div>
                  <Label className="font-semibold mb-2 block" style={{ color: '#FFFF00' }}>Selecciona tu Pizza</Label>
                  <select 
                    value={promo2Pizza?.id || ''} 
                    onChange={(e) => {
                      const pizza = allPizzas.find(p => p.id === parseInt(e.target.value));
                      setPromo2Pizza(pizza);
                    }}
                    className="w-full px-3 py-2 border rounded-md bg-white"
                    style={{ color: '#FF8533', fontWeight: 'bold' }}
                  >
                    <option value="">Selecciona una pizza...</option>
                    {allPizzas.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                {promo2Pizza && (
                  <div className="p-3 rounded border-l-4" style={{ backgroundColor: '#1A3A3B', borderLeftColor: '#FF8533' }}>
                    <p className="text-sm font-semibold" style={{ color: '#FF8533' }}>{promo2Pizza.name} Grande</p>
                    <p className="text-xs mt-1" style={{ color: '#F5E8D0' }}>Precio original: {formatPrice(Math.round(promo2Pizza.price * 1.7))}</p>
                    <p className="text-xs font-bold mt-1" style={{ color: '#FF8533' }}>Con descuento: {formatPrice(Math.round(promo2Pizza.price * 1.7 * 0.5))}</p>
                  </div>
                )}
              </>
            )}

            {promo2Type === 'mitadCadaPizza' && (
              <>
                <div>
                  <Label className="font-semibold mb-2 block" style={{ color: '#FFFF00' }}>Primera Pizza (Mitad)</Label>
                  <select 
                    value={promo2MitadPizza1?.id || ''} 
                    onChange={(e) => {
                      const pizza = allPizzas.find(p => p.id === parseInt(e.target.value));
                      setPromo2MitadPizza1(pizza);
                    }}
                    className="w-full px-3 py-2 border rounded-md bg-white"
                    style={{ color: '#FF8533', fontWeight: 'bold' }}
                  >
                    <option value="">Selecciona una pizza...</option>
                    {allPizzas.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label className="font-semibold mb-2 block" style={{ color: '#FFFF00' }}>Segunda Pizza (Mitad)</Label>
                  <select 
                    value={promo2MitadPizza2?.id || ''} 
                    onChange={(e) => {
                      const pizza = allPizzas.find(p => p.id === parseInt(e.target.value));
                      setPromo2MitadPizza2(pizza);
                    }}
                    className="w-full px-3 py-2 border rounded-md bg-white"
                    style={{ color: '#FF8533', fontWeight: 'bold' }}
                  >
                    <option value="">Selecciona una pizza...</option>
                    {allPizzas.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                {promo2MitadPizza1 && promo2MitadPizza2 && (
                  <div className="p-3 rounded border-l-4" style={{ backgroundColor: '#1A3A3B', borderLeftColor: '#FF8533' }}>
                    <p className="text-sm font-semibold" style={{ color: '#FF8533' }}>✓ Mitad {promo2MitadPizza1.name} + Mitad {promo2MitadPizza2.name} Grande</p>
                    <div className="text-xs mt-2 space-y-1" style={{ color: '#F5E8D0' }}>
                      <div>Mitad {promo2MitadPizza1.name}: {formatPrice(Math.round((promo2MitadPizza1.price * 1.7) / 2))}</div>
                      <div>Mitad {promo2MitadPizza2.name}: {formatPrice(Math.round((promo2MitadPizza2.price * 1.7) / 2))}</div>
                      <div className="font-bold">Original: {formatPrice(Math.round((promo2MitadPizza1.price * 1.7) / 2) + Math.round((promo2MitadPizza2.price * 1.7) / 2))}</div>
                      <div className="font-bold" style={{ color: '#FF8533' }}>Con 50% descuento: {formatPrice(Math.round((Math.round((promo2MitadPizza1.price * 1.7) / 2) + Math.round((promo2MitadPizza2.price * 1.7) / 2)) * 0.5))}</div>
                    </div>
                  </div>
                )}
              </>
            )}

            <div>
              <Label className="font-semibold mb-3 block" style={{ color: '#F5E8D0' }}>Tipo de Base</Label>
              <RadioGroup value={promo2Base} onValueChange={setPromo2Base}>
                {baseOptions.map(option => (
                  <div key={option.value} className="flex items-center space-x-2 mb-2">
                    <RadioGroupItem value={option.value} id={`promo2-${option.value}`} />
                    <Label htmlFor={`promo2-${option.value}`} className="text-sm cursor-pointer" style={{ color: '#F5E8D0' }}>{option.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPromo2DialogOpen(false)}>Cancelar</Button>
            <Button onClick={handlePromo2Confirm} className="bg-orange-500 hover:bg-orange-600">Agregar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Promo-3: 3 Porciones + Bebida Dialog */}
      <Dialog open={promo3DialogOpen} onOpenChange={setPromo3DialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>3 Porciones + Bebida Gratis</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            <div>
              <Label className="font-semibold mb-2 block">Selecciona 3 Porciones ({promo3Porciones.length}/3)</Label>
              <div className="grid grid-cols-2 gap-2">
                {porciones.map(porcion => (
                  <Button
                    key={porcion.id}
                    variant={promo3Porciones.some(p => p.id === porcion.id) ? 'default' : 'outline'}
                    onClick={() => {
                      if (promo3Porciones.some(p => p.id === porcion.id)) {
                        handlePromo3RemovePorcion(promo3Porciones.findIndex(p => p.id === porcion.id));
                      } else {
                        handlePromo3AddPorcion(porcion);
                      }
                    }}
                    className="text-left h-auto py-2 px-2 text-xs"
                  >
                    {porcion.name}
                  </Button>
                ))}
              </div>
            </div>

            {promo3Porciones.length > 0 && (
              <div className="p-3 bg-amber-50 rounded border-l-4 border-amber-500">
                <p className="text-xs font-semibold text-amber-700">Porciones seleccionadas:</p>
                {promo3Porciones.map((p, idx) => (
                  <div key={idx} className="text-xs text-amber-600 mt-1 flex justify-between items-center">
                    <span>{p.name}</span>
                    <button onClick={() => handlePromo3RemovePorcion(idx)} className="text-red-500 hover:text-red-700">✕</button>
                  </div>
                ))}
              </div>
            )}

            <div>
              <Label className="font-semibold mb-2 block">Selecciona tu Bebida (GRATIS)</Label>
              <select 
                value={promo3Bebida?.id || ''} 
                onChange={(e) => {
                  const bebida = bebidas.find(b => b.id === parseInt(e.target.value));
                  setPromo3Bebida(bebida);
                }}
                className="w-full px-3 py-2 border rounded-md bg-white"
              >
                <option value="">Selecciona una bebida...</option>
                {bebidas.map(b => (
                  <option key={b.id} value={b.id}>{b.name} (Gratis)</option>
                ))}
              </select>
            </div>

            {promo3Porciones.length === 3 && promo3Bebida && (
              <div className="p-3 bg-green-50 rounded border-l-4 border-green-500">
                <p className="text-sm font-semibold text-green-700">✓ Combo Completo</p>
                <p className="text-xs text-green-600 mt-1">Total: {formatPrice(21000)} ({promo3Bebida.name} gratis)</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPromo3DialogOpen(false)}>Cancelar</Button>
            <Button onClick={handlePromo3Confirm} className="bg-orange-500 hover:bg-orange-600">Agregar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
