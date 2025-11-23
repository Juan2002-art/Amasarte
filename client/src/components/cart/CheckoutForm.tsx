import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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
    type: 'delivery', // delivery | pickup | dine-in
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call to Google Sheets
    // In a real app, this would be a backend endpoint that uses the Google Sheets API
    const orderData = {
      ...formData,
      items: items.map(i => `${i.quantity}x ${i.name}`).join(', '),
      total: total.toFixed(2),
      date: new Date().toISOString()
    };

    console.log("Submitting order to Google Sheets (Mock):", orderData);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    setLoading(false);
    toast({
      title: "¡Pedido Recibido!",
      description: "Tu orden ha sido enviada a la cocina. Te contactaremos pronto.",
      duration: 5000,
    });
    
    clearCart();
    onSuccess();
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
          />
        </div>

        <div className="space-y-2">
          <Label>Tipo de Pedido</Label>
          <RadioGroup 
            defaultValue="delivery" 
            value={formData.type}
            onValueChange={val => setFormData({...formData, type: val})}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="delivery" id="r1" />
              <Label htmlFor="r1">Domicilio</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="pickup" id="r2" />
              <Label htmlFor="r2">Recoger</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dine-in" id="r3" />
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
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="notes">Notas Adicionales</Label>
          <Textarea 
            id="notes" 
            placeholder="Sin cebolla, salsa extra, etc."
            value={formData.notes}
            onChange={e => setFormData({...formData, notes: e.target.value})}
          />
        </div>
      </div>

      <div className="bg-muted p-4 rounded-lg space-y-2">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Envío</span>
          <span>{formData.type === 'delivery' ? '$3.00' : '$0.00'}</span>
        </div>
        <div className="flex justify-between font-bold text-lg pt-2 border-t">
          <span>Total</span>
          <span>${(total + (formData.type === 'delivery' ? 3 : 0)).toFixed(2)}</span>
        </div>
      </div>

      <Button type="submit" className="w-full font-bold text-lg h-12" disabled={loading}>
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
