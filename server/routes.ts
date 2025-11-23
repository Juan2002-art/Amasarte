import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { google } from "googleapis";
import { z } from "zod";

const ContactFormSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  email: z.string().email("Email inválido"),
  telefono: z.string().optional(),
  mensaje: z.string().min(1, "El mensaje es requerido"),
});

type ContactForm = z.infer<typeof ContactFormSchema>;

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
  // Google Sheets API route
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = ContactFormSchema.parse(req.body);
      
      // Get the spreadsheet ID from environment variable
      const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
      if (!spreadsheetId) {
        return res.status(500).json({ error: "Google Sheets ID not configured" });
      }

      const sheetsClient = await getGoogleSheetsClient();
      
      const timestamp = new Date().toLocaleString("es-MX");
      
      // Append the data to the Google Sheet
      await sheetsClient.spreadsheets.values.append({
        spreadsheetId,
        range: "Sheet1!A:D",
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [
            [timestamp, validatedData.nombre, validatedData.email, validatedData.telefono || "", validatedData.mensaje],
          ],
        },
      });

      res.json({ success: true, message: "Mensaje enviado exitosamente" });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Datos inválidos", details: error.errors });
      }
      console.error("Contact form error:", error);
      res.status(500).json({ error: error.message || "Error al enviar el mensaje" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
