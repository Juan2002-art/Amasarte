import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { google } from "googleapis";
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

type Order = z.infer<typeof OrderSchema>;

function generateOrderId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `PED-${timestamp}-${random}`;
}

function mapTipoEntrega(value: string): string {
  const tipoEntregaMap: Record<string, string> = {
    'domicilio': 'Envío a Domicilio',
    'recoger': 'Recoger en Tienda',
    'comeraqui': 'Comer Aquí',
  };
  return tipoEntregaMap[value] || value;
}

function mapFormaPago(value: string): string {
  const formaPagoMap: Record<string, string> = {
    'efectivo': 'Efectivo',
    'tarjeta': 'Tarjeta',
    'transferencia': 'Transferencia',
  };
  return formaPagoMap[value] || value;
}

async function getGoogleSheetsClient() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY
    ? "repl " + process.env.REPL_IDENTITY
    : process.env.WEB_REPL_RENEWAL
      ? "depl " + process.env.WEB_REPL_RENEWAL
      : null;

  if (!xReplitToken) {
    throw new Error("X_REPLIT_TOKEN not found for repl/depl");
  }

  const connectionSettings = await fetch(
    "https://" + hostname + "/api/v2/connection?include_secrets=true&connector_names=google-sheet",
    {
      headers: {
        Accept: "application/json",
        X_REPLIT_TOKEN: xReplitToken,
      },
    }
  ).then((res) => res.json()).then((data) => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error("Google Sheet not connected");
  }

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({
    access_token: accessToken,
  });

  return google.sheets({ version: "v4", auth: oauth2Client });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Order API route
  app.post("/api/order", async (req, res) => {
    try {
      const validatedData = OrderSchema.parse(req.body);
      
      // Get the spreadsheet ID from environment variable
      const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
      if (!spreadsheetId) {
        return res.status(500).json({ error: "Google Sheets ID not configured" });
      }

      const sheetsClient = await getGoogleSheetsClient();
      
      const orderId = generateOrderId();
      const now = new Date();
      const fecha = now.toLocaleDateString("es-MX");
      const hora = now.toLocaleTimeString("es-MX");
      
      const rowData = [
        orderId,
        fecha,
        hora,
        validatedData.nombre,
        validatedData.telefono,
        validatedData.direccion,
        mapTipoEntrega(validatedData.tipoEntrega),
        mapFormaPago(validatedData.formaPago),
        validatedData.items,
        validatedData.detallesAdicionales || "",
        validatedData.total,
      ];

      // Get the next available row after the headers (check column A)
      const sheetResp = await sheetsClient.spreadsheets.values.get({
        spreadsheetId,
        range: "A:A",
      });
      
      const existingRows = sheetResp.data.values?.length || 1;
      const nextRow = Math.max(existingRows + 1, 2); // At least row 2

      // Insert data starting from row 2 (skipping header row), column A
      await sheetsClient.spreadsheets.values.update({
        spreadsheetId,
        range: `A${nextRow}:K${nextRow}`,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [rowData],
        },
      });

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
