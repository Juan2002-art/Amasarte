import { sql } from "drizzle-orm";
import { pgTable, text, varchar, serial, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  phone: text("phone").notNull(),
  orderType: text("order_type").notNull(),
  address: text("address"),
  paymentMethod: text("payment_method").notNull().default("efectivo"),
  orderDetails: text("order_details").notNull().default(""),
  items: text("items").notNull(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pendiente"),
  orderTime: text("order_time"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertOrderSchema = createInsertSchema(orders, {
  customerName: z.string().min(1, "El nombre es requerido"),
  phone: z.string().min(10, "El teléfono debe tener al menos 10 dígitos"),
  orderType: z.enum(["delivery", "pickup", "dine-in"]),
  address: z.string().optional(),
  paymentMethod: z.string().default("efectivo"),
  orderDetails: z.string().min(1, "Los detalles del pedido son requeridos"),
  items: z.string().min(1, "Debes agregar al menos un producto"),
  total: z.string().regex(/^\d+(\.\d{1,2})?$/, "Total inválido"),
  status: z.string().default("pendiente"),
  notes: z.string().optional(),
  orderTime: z.string().optional(),
}).omit({
  id: true,
  createdAt: true,
});

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;
