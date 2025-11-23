import type { Express } from "express";
import { createServer, type Server } from "http";
import { insertOrderSchema } from "@shared/schema";
import { fromError } from "zod-validation-error";
import { appendOrderToSheet, initializeSheetHeaders } from "./googleSheets";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/orders", async (req, res) => {
    try {
      const validatedData = insertOrderSchema.parse(req.body);
      
      // Generate a unique order ID using timestamp + random number
      const orderId = Math.floor(Date.now() / 1000) + Math.floor(Math.random() * 10000);
      const now = new Date();
      
      try {
        await appendOrderToSheet({
          id: orderId,
          customerName: validatedData.customerName,
          phone: validatedData.phone,
          orderType: validatedData.orderType,
          address: validatedData.address || null,
          paymentMethod: validatedData.paymentMethod,
          orderDetails: validatedData.orderDetails,
          items: validatedData.items,
          total: validatedData.total,
          status: validatedData.status,
          createdAt: now,
          orderTime: validatedData.orderTime || null
        });

        // Return success response with the generated order ID
        res.status(201).json({
          success: true,
          order: {
            id: orderId,
            customerName: validatedData.customerName,
            phone: validatedData.phone,
            orderType: validatedData.orderType,
            address: validatedData.address || null,
            paymentMethod: validatedData.paymentMethod,
            orderDetails: validatedData.orderDetails,
            items: validatedData.items,
            total: validatedData.total,
            status: validatedData.status,
            orderTime: validatedData.orderTime || null,
            createdAt: now
          },
          message: "Pedido recibido correctamente y sincronizado con Google Sheets"
        });
      } catch (sheetsError: any) {
        console.error("Failed to sync order to Google Sheets:", sheetsError);
        res.status(500).json({
          success: false,
          error: "Error al sincronizar el pedido con Google Sheets: " + sheetsError.message
        });
      }
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromError(error);
        return res.status(400).json({
          success: false,
          error: validationError.message
        });
      }
      
      console.error("Error processing order:", error);
      res.status(500).json({
        success: false,
        error: "Error al procesar el pedido"
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
