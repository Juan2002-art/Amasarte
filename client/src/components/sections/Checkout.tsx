import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Trash2, Send, X, CheckCircle2, ShoppingCart } from 'lucide-react';

// Format price in Colombian pesos
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export function Checkout() {
  const { items, total, clearCart, removeItem, updateQuantity } = useCart();
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<{orderId: string; timestamp: string} | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    direccion: '',
    tipoEntrega: 'domicilio',
    formaPago: 'efectivo',
    detallesAdicionales: '',
  });

  const scrollToMenu = () => {
    const menuElement = document.getElementById('menu');
    if (menuElement) {
      menuElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      toast.error('Por favor agrega items al pedido');
      return;
    }

    if (!formData.nombre || !formData.telefono) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    if (formData.tipoEntrega === 'domicilio' && !formData.direccion) {
      toast.error('Por favor ingresa tu dirección');
      return;
    }

    setLoading(true);

    try {
      const telefono = formData.telefono.startsWith('+57') ? formData.telefono : `+57${formData.telefono}`;
      
      const itemsDetails = items.map((item) => {
        let itemStr = `${item.quantity}x ${item.name}`;
        if (item.options?.tipoPizza) {
          if (item.options.tipoPizza === 'mitad') {
            itemStr += ` (Mitad: ${item.options.mitadPizza1?.name} + ${item.options.mitadPizza2?.name})`;
          }
          itemStr += ` [Base: ${item.options.tipoBase}]`;
        }
        return itemStr;
      }).join(', ');

      const orderData = {
        nombre: formData.nombre,
        telefono: telefono,
        direccion: formData.direccion || 'N/A',
        tipoEntrega: formData.tipoEntrega,
        formaPago: formData.formaPago,
        detallesAdicionales: formData.detallesAdicionales,
        items: itemsDetails,
        total: total.toFixed(2),
      };

      const response = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Error al enviar el pedido');
      }

      const result = await response.json();
      const now = new Date();
      const timestamp = now.toLocaleTimeString('es-MX');
      
      // Show success notification
      setOrderSuccess({
        orderId: result.orderId,
        timestamp: timestamp,
      });
      
      toast.success(`¡Pedido creado! ID: ${result.orderId}`);
      clearCart();
      setFormData({
        nombre: '',
        telefono: '',
        direccion: '',
        tipoEntrega: 'domicilio',
        formaPago: 'efectivo',
        detallesAdicionales: '',
      });
    } catch (error) {
      toast.error('Error al enviar el pedido. Por favor, intenta de nuevo.');
      console.error('Order submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Success Dialog */}
      <Dialog open={!!orderSuccess} onOpenChange={(open) => !open && setOrderSuccess(null)}>
        <DialogContent className="sm:max-w-md border-2 border-green-500">
          <DialogHeader className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="flex justify-center mb-4"
            >
              <CheckCircle2 size={64} className="text-green-500" />
            </motion.div>
            <DialogTitle className="text-2xl font-bold text-green-600 text-center">
              ¡Pedido Confirmado!
            </DialogTitle>
          </DialogHeader>
          
          <DialogDescription className="hidden" />
          
          <div className="space-y-3">
            <div className="text-center text-gray-700">Tu pedido ha sido registrado correctamente.</div>
            <div className="bg-green-50 rounded-lg p-4 space-y-2">
              <div className="text-sm text-gray-600">ID del Pedido:</div>
              <div className="text-2xl font-bold text-green-700 font-mono">
                {orderSuccess?.orderId}
              </div>
              <div className="text-sm text-gray-500 mt-2">
                Hora: {orderSuccess?.timestamp}
              </div>
            </div>
            <div className="text-sm text-gray-600 text-center">
              Pronto te contactaremos para confirmar los detalles de tu pedido.
            </div>
          </div>
          
          <Button
            onClick={() => setOrderSuccess(null)}
            className="w-full bg-green-600 hover:bg-green-700 rounded-full"
            data-testid="button-close-success-dialog"
          >
            Entendido
          </Button>
        </DialogContent>
      </Dialog>

      <section id="checkout" className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">Tu Pedido</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="sticky top-24 border-none shadow-lg">
                <CardHeader>
                  <CardTitle>Resumen del Pedido</CardTitle>
                </CardHeader>
                <CardContent>
                  {items.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No hay items en tu pedido
                    </p>
                  ) : (
                    <div className="space-y-3 max-h-[400px] overflow-y-auto">
                      {items.map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex justify-between items-start p-3 bg-muted rounded-lg group"
                        >
                          <div className="flex-1">
                            <p className="font-semibold text-sm">{item.name}</p>
                            {item.options?.tipoPizza === 'mitad' && (
                              <p className="text-xs text-blue-600 mt-1">
                                Mitad: {item.options.mitadPizza1?.name} + {item.options.mitadPizza2?.name}
                              </p>
                            )}
                            {item.options?.tipoBase && (
                              <p className="text-xs text-blue-600">
                                Base: {item.options.tipoBase}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatPrice(item.price)} x {item.quantity}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <select
                              value={item.quantity}
                              onChange={(e) =>
                                updateQuantity(index, parseInt(e.target.value))
                              }
                              className="w-12 px-1 py-1 border rounded text-xs"
                              data-testid={`select-quantity-${index}`}
                            >
                              {[1, 2, 3, 4, 5].map((q) => (
                                <option key={q} value={q}>
                                  {q}
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() => removeItem(index)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded"
                              data-testid={`button-remove-${index}`}
                            >
                              <Trash2 size={14} className="text-red-500" />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex flex-col border-t pt-4 gap-4">
                  <div className="w-full flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span className="text-primary">{formatPrice(total)}</span>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={scrollToMenu}
                    className="w-full rounded-full"
                    data-testid="button-go-to-menu"
                  >
                    <ShoppingCart size={16} className="mr-2" />
                    Volver al Menú
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </div>

          {/* Order Form */}
          <div className="lg:col-span-2">
            <motion.form
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="nombre" className="font-semibold mb-2 block">
                    Nombre Completo *
                  </Label>
                  <Input
                    id="nombre"
                    name="nombre"
                    type="text"
                    placeholder="Tu nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    className="rounded-lg"
                    data-testid="input-nombre"
                  />
                </div>

                <div>
                  <Label htmlFor="telefono" className="font-semibold mb-2 block">
                    Teléfono *
                  </Label>
                  <Input
                    id="telefono"
                    name="telefono"
                    type="tel"
                    placeholder="+52 (55) 1234 5678"
                    value={formData.telefono}
                    onChange={handleChange}
                    required
                    className="rounded-lg"
                    data-testid="input-telefono"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="tipoEntrega" className="font-semibold mb-2 block">
                  Tipo de Entrega *
                </Label>
                <Select value={formData.tipoEntrega} onValueChange={(value) => handleSelectChange('tipoEntrega', value)}>
                  <SelectTrigger className="rounded-lg" data-testid="select-tipoEntrega">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="domicilio">Envío a Domicilio</SelectItem>
                    <SelectItem value="recoger">Recoger en Tienda</SelectItem>
                    <SelectItem value="comeraqui">Comer Aquí</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.tipoEntrega === 'domicilio' && (
                <div>
                  <Label htmlFor="direccion" className="font-semibold mb-2 block">
                    Dirección *
                  </Label>
                  <Textarea
                    id="direccion"
                    name="direccion"
                    placeholder="Calle, número, apartamento, referencias..."
                    value={formData.direccion}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="rounded-lg resize-none"
                    data-testid="textarea-direccion"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="formaPago" className="font-semibold mb-2 block">
                  Forma de Pago *
                </Label>
                <Select value={formData.formaPago} onValueChange={(value) => handleSelectChange('formaPago', value)}>
                  <SelectTrigger className="rounded-lg" data-testid="select-formaPago">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="efectivo">Efectivo</SelectItem>
                    <SelectItem value="tarjeta">Tarjeta</SelectItem>
                    <SelectItem value="transferencia">Transferencia</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="detallesAdicionales" className="font-semibold mb-2 block">
                  Detalles Adicionales (Opcional)
                </Label>
                <Textarea
                  id="detallesAdicionales"
                  name="detallesAdicionales"
                  placeholder="Notas especiales, alergias, preferencias..."
                  value={formData.detallesAdicionales}
                  onChange={handleChange}
                  rows={3}
                  className="rounded-lg resize-none"
                  data-testid="textarea-detallesAdicionales"
                />
              </div>

              <Button
                type="submit"
                disabled={loading || items.length === 0}
                className="w-full rounded-full bg-primary hover:bg-green-600 text-white font-semibold py-6 flex items-center justify-center gap-2"
                data-testid="button-submit-order"
              >
                <Send size={18} />
                {loading ? 'Procesando...' : `Confirmar Pedido - ${formatPrice(total)}`}
              </Button>
            </motion.form>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}
