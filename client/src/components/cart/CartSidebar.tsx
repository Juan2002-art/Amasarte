import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { CheckoutForm } from "./CheckoutForm";
import { useState } from "react";

export function CartSidebar() {
  const { isOpen, setIsOpen, items, removeItem, updateQuantity, total } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
    setIsCheckingOut(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader className="mb-4">
          <SheetTitle className="flex items-center gap-2 text-2xl">
            <ShoppingBag className="text-primary" /> Tu Pedido
          </SheetTitle>
          <SheetDescription>
            {isCheckingOut 
              ? "Completa tus datos para finalizar el pedido." 
              : "Revisa tus deliciosas elecciones antes de ordenar."}
          </SheetDescription>
        </SheetHeader>

        {isCheckingOut ? (
          <div className="flex-1 overflow-y-auto pr-2">
             <Button 
              variant="ghost" 
              onClick={() => setIsCheckingOut(false)} 
              className="mb-4 pl-0 hover:pl-2 transition-all"
            >
              ← Volver al carrito
            </Button>
            <CheckoutForm onSuccess={handleClose} />
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[50vh] text-muted-foreground gap-4">
                  <ShoppingBag size={64} className="opacity-20" />
                  <p className="text-lg font-medium">Tu carrito está vacío</p>
                  <Button variant="link" onClick={() => setIsOpen(false)}>
                    Explorar el Menú
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      {item.image && (
                        <div className="h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
                          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-semibold line-clamp-1">{item.name}</h4>
                          <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-end">
                          <div className="flex items-center gap-3 bg-muted/50 rounded-full p-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 rounded-full"
                              onClick={() => updateQuantity(item.id, -1)}
                            >
                              <Minus size={12} />
                            </Button>
                            <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 rounded-full"
                              onClick={() => updateQuantity(item.id, 1)}
                            >
                              <Plus size={12} />
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            {items.length > 0 && (
              <div className="border-t pt-6 mt-4 space-y-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <Button 
                  className="w-full text-lg py-6 rounded-full shadow-lg shadow-primary/20" 
                  onClick={() => setIsCheckingOut(true)}
                >
                  Proceder al Pago
                </Button>
              </div>
            )}
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
