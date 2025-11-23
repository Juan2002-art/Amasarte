import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';
import { Gift, Flame, Star } from 'lucide-react';

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

const promotions: any[] = [
  {
    id: 'promo-1',
    title: '2x1 en Pizzas Personales',
    description: 'Compra una pizza personal y lleva dos. Válido en pizzas clásicas.',
    discount: '50%',
    originalPrice: 32000,
    promoPrice: 16000,
    badge: 'HOT DEAL',
    highlight: true,
    details: 'Aplica en: Margherita, Pepperoni, Cuatro Quesos, Hawaiana, Carbonara, Caprese',
  },
  {
    id: 'promo-2',
    title: 'Pizza Grande -50%',
    description: 'Lleva una pizza grande con el 50% de descuento.',
    discount: '50%',
    originalPrice: 52000,
    promoPrice: 26000,
    badge: 'MEGA DESCUENTO',
    highlight: true,
    details: 'Aplica en: Cualquier pizza, personalización incluida',
  },
  {
    id: 'promo-3',
    title: '3 Porciones + Bebida',
    description: 'Lleva 3 porciones individuales + 1 bebida gratis.',
    discount: 'BEBIDA GRATIS',
    badge: 'COMBO',
    highlight: false,
    details: 'Válido de lunes a viernes',
  },
];

export function Promotions() {
  const { addItem } = useCart();
  const [addedPromos, setAddedPromos] = useState<Set<string>>(new Set());

  const handlePromoClick = (promo: any) => {
    toast.info(`${promo.title} agregada a tu carrito. Completa los detalles en el pedido.`);
    setAddedPromos(new Set([...addedPromos, promo.id]));
    setTimeout(() => {
      setAddedPromos(prev => {
        const newSet = new Set(prev);
        newSet.delete(promo.id);
        return newSet;
      });
    }, 2000);
  };

  return (
    <section id="promotions" className="py-24 bg-gradient-to-br from-orange-50 to-yellow-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Gift className="text-orange-500" size={32} />
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">Promociones Semanales</h2>
            <Flame className="text-red-500" size={32} />
          </div>
          <p className="text-muted-foreground text-lg">
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
                    ? 'border-orange-400 shadow-xl hover:shadow-2xl bg-white'
                    : 'border-gray-200 hover:border-orange-300 hover:shadow-lg'
                }`}
              >
                {promo.highlight && (
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 px-4">
                    <p className="text-sm font-bold text-center flex items-center justify-center gap-1">
                      <Star size={14} />
                      {promo.badge}
                      <Star size={14} />
                    </p>
                  </div>
                )}

                <CardHeader className={promo.highlight ? 'pt-4 pb-2' : ''}>
                  {!promo.highlight && (
                    <Badge className="w-fit mb-2 bg-blue-500 hover:bg-blue-600">
                      {promo.badge}
                    </Badge>
                  )}
                  <CardTitle className="text-2xl">{promo.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-2">{promo.description}</p>
                </CardHeader>

                <CardContent className="flex-1">
                  {promo.originalPrice && (
                    <div className="space-y-2 mb-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-primary">{formatPrice(promo.promoPrice)}</span>
                        <span className="text-xl line-through text-gray-400">{formatPrice(promo.originalPrice)}</span>
                      </div>
                      <div className="inline-block bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold">
                        Ahorra {formatPrice(promo.originalPrice - promo.promoPrice)}
                      </div>
                    </div>
                  )}
                  {!promo.originalPrice && (
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded mb-4">
                      <p className="text-lg font-bold text-blue-700">{promo.discount}</p>
                    </div>
                  )}
                  <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                    <strong>Detalles:</strong> {promo.details}
                  </p>
                </CardContent>

                <CardFooter>
                  <Button
                    onClick={() => handlePromoClick(promo)}
                    className={`w-full rounded-full font-semibold py-5 ${
                      addedPromos.has(promo.id)
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-orange-500 hover:bg-orange-600'
                    } text-white`}
                    data-testid={`button-promo-${promo.id}`}
                  >
                    {addedPromos.has(promo.id) ? '✓ Agregada' : 'Aprovechar Oferta'}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 bg-white rounded-lg p-6 border-l-4 border-orange-500"
        >
          <p className="text-center text-muted-foreground">
            <span className="font-semibold text-foreground">¡Válido esta semana!</span> Las promociones se aplican automáticamente al realizar tu pedido. Consulta con nuestro equipo para más detalles.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
