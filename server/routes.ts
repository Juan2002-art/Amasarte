import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

const OrderSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  telefono: z.string().min(1, "El teléfono es requerido"),
  direccion: z.string(),
  tipoEntrega: z.enum(['domicilio', 'recoger', 'comeraqui']),
  formaPago: z.enum(['efectivo', 'tarjeta', 'transferencia']),
  detallesAdicionales: z.string().optional(),
  items: z.string().min(1, "El pedido debe contener items"),
  total: z.string(),
});

type OrderInput = z.infer<typeof OrderSchema>;

function generateOrderId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `PED-${timestamp}-${random}`;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Order API route
  app.post("/api/order", async (req, res) => {
    try {
      const validatedData = OrderSchema.parse(req.body);
      
      const orderId = generateOrderId();
      
      // Save order to storage
      const order = await storage.createOrder({
        id: orderId,
        nombre: validatedData.nombre,
        telefono: validatedData.telefono,
        direccion: validatedData.direccion,
        tipoEntrega: validatedData.tipoEntrega,
        formaPago: validatedData.formaPago,
        items: validatedData.items,
        detallesAdicionales: validatedData.detallesAdicionales || null,
        total: validatedData.total,
      });
      
      console.log("Order saved successfully with ID:", orderId);

      res.json({ success: true, orderId, message: "Pedido creado exitosamente" });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Datos inválidos", details: error.errors });
      }
      console.error("Order error:", error);
      res.status(500).json({ error: error.message || "Error al crear el pedido" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
