import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertOrderSchema } from "@shared/schema";
import { fromError } from "zod-validation-error";
import { appendOrderToSheet, initializeSheetHeaders } from "./googleSheets";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/orders", async (req, res) => {
    try {
      const validatedData = insertOrderSchema.parse(req.body);
      
      const order = await storage.createOrder(validatedData);
      
      try {
        await appendOrderToSheet({
          id: order.id,
          customerName: order.customerName,
          phone: order.phone,
          orderType: order.orderType,
          address: order.address,
          items: order.items,
          total: order.total,
          notes: order.notes,
          createdAt: order.createdAt
        });
      } catch (sheetsError) {
        console.error("Google Sheets sync failed, but order was saved:", sheetsError);
      }

      res.status(201).json({
        success: true,
        order,
        message: "Pedido recibido correctamente"
      });
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromError(error);
        return res.status(400).json({
          success: false,
          error: validationError.message
        });
      }
      
      console.error("Error creating order:", error);
      res.status(500).json({
        success: false,
        error: "Error al procesar el pedido"
      });
    }
  });

  app.get("/api/orders", async (req, res) => {
    try {
      const orders = await storage.getOrders();
      res.json({ success: true, orders });
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({
        success: false,
        error: "Error al obtener los pedidos"
      });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          error: "ID inválido"
        });
      }

      const order = await storage.getOrder(id);
      if (!order) {
        return res.status(404).json({
          success: false,
          error: "Pedido no encontrado"
        });
      }

      res.json({ success: true, order });
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({
        success: false,
        error: "Error al obtener el pedido"
      });
    }
  });

  app.post("/api/sheets/initialize", async (req, res) => {
    try {
      await initializeSheetHeaders();
      res.json({ 
        success: true, 
        message: "Encabezados de Google Sheets configurados correctamente" 
      });
    } catch (error: any) {
      console.error("Error initializing sheet headers:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Error al configurar Google Sheets"
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
