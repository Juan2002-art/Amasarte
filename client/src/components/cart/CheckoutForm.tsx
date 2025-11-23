import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function CheckoutForm({ onSuccess }: { onSuccess: () => void }) {
  const { items, total, clearCart } = useCart();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    type: 'delivery',
    paymentMethod: 'efectivo',
    orderTime: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
  });

  const getOrderDetailsText = () => {
    return items
      .map((item) => `${item.quantity}x ${item.name} - $${(item.price * item.quantity).toFixed(2)}`)
      .join(' | ');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const deliveryFee = formData.type === 'delivery' ? 3 : 0;
    const finalTotal = total + deliveryFee;

    const orderData: any = {
      customerName: formData.name,
      phone: formData.phone,
      orderType: formData.type,
      paymentMethod: formData.paymentMethod,
      orderDetails: getOrderDetailsText(),
      items: JSON.stringify(items),
      total: finalTotal.toFixed(2),
      status: 'pendiente',
      orderTime: formData.orderTime,
    };

    // Solo agregar dirección si es delivery
    if (formData.type === 'delivery') {
      orderData.address = formData.address;
    }

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Error al enviar el pedido');
      }

      toast({
        title: "¡Pedido Recibido!",
        description: `Tu orden #${result.order.id} ha sido registrada. Te contactaremos pronto al ${formData.phone}.`,
        duration: 7000,
      });

      clearCart();
      onSuccess();
    } catch (error: any) {
      console.error('Error submitting order:', error);
      toast({
        title: "Error al Procesar el Pedido",
        description: error.message || "Hubo un problema. Por favor intenta de nuevo.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Tu carrito está vacío.</p>
        <p className="text-sm">Agrega algunas pizzas deliciosas para continuar.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mt-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre Completo</Label>
          <Input 
            id="name" 
            required 
            placeholder="Juan Pérez"
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            data-testid="input-customer-name"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Teléfono / WhatsApp</Label>
          <Input 
            id="phone" 
            required 
            type="tel" 
            placeholder="55 1234 5678"
            value={formData.phone}
            onChange={e => setFormData({...formData, phone: e.target.value})}
            data-testid="input-phone"
          />
        </div>

        <div className="space-y-2">
          <Label>Tipo de Entrega</Label>
          <RadioGroup 
            defaultValue="delivery" 
            value={formData.type}
            onValueChange={val => setFormData({...formData, type: val})}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="delivery" id="r1" data-testid="radio-delivery" />
              <Label htmlFor="r1">Domicilio</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="pickup" id="r2" data-testid="radio-pickup" />
              <Label htmlFor="r2">Recoger</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dine-in" id="r3" data-testid="radio-dinein" />
              <Label htmlFor="r3">Comer Aquí</Label>
            </div>
          </RadioGroup>
        </div>

        {formData.type === 'delivery' && (
          <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
            <Label htmlFor="address">Dirección de Entrega</Label>
            <Textarea 
              id="address" 
              required 
              placeholder="Calle, Número, Colonia, Referencias"
              value={formData.address}
              onChange={e => setFormData({...formData, address: e.target.value})}
              data-testid="input-address"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="payment">Forma de Pago</Label>
          <Select value={formData.paymentMethod} onValueChange={(val) => setFormData({...formData, paymentMethod: val})}>
            <SelectTrigger id="payment" data-testid="select-payment">
              <SelectValue placeholder="Selecciona forma de pago" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="efectivo">Efectivo</SelectItem>
              <SelectItem value="tarjeta">Tarjeta de Crédito</SelectItem>
              <SelectItem value="transferencia">Transferencia Bancaria</SelectItem>
              <SelectItem value="paypal">PayPal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="orderTime">Hora del Pedido</Label>
          <Input 
            id="orderTime" 
            type="time"
            value={formData.orderTime}
            onChange={e => setFormData({...formData, orderTime: e.target.value})}
            data-testid="input-order-time"
          />
        </div>
      </div>

      <div className="bg-muted p-4 rounded-lg space-y-2">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span data-testid="text-subtotal">${total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Envío</span>
          <span data-testid="text-delivery-fee">{formData.type === 'delivery' ? '$3.00' : '$0.00'}</span>
        </div>
        <div className="flex justify-between font-bold text-lg pt-2 border-t">
          <span>Total</span>
          <span data-testid="text-total">${(total + (formData.type === 'delivery' ? 3 : 0)).toFixed(2)}</span>
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full font-bold text-lg h-12" 
        disabled={loading}
        data-testid="button-submit-order"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Enviando...
          </>
        ) : (
          'Confirmar Pedido'
        )}
      </Button>
    </form>
  );
}
