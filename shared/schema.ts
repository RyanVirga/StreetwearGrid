import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
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

export const merchRequests = pgTable("merch_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  zipCode: varchar("zip_code", { length: 10 }).notNull(),
  deadline: text("deadline"),
  budget: text("budget"),
  products: jsonb("products").notNull().$type<Array<{ id: string; name: string; quantity: number }>>(),
  colorways: text("colorways").array(),
  customColors: jsonb("custom_colors").$type<Array<{ name: string; hex: string }>>(),
  printMethod: text("print_method"),
  printLocations: text("print_locations").array(),
  files: jsonb("files").$type<Array<{ id: string; name: string; type: string; size: number; preview?: string }>>(),
  contactName: text("contact_name").notNull(),
  contactEmail: text("contact_email").notNull(),
  contactPhone: text("contact_phone"),
  company: text("company"),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertMerchRequestSchema = createInsertSchema(merchRequests).omit({
  id: true,
  createdAt: true,
});

export type InsertMerchRequest = z.infer<typeof insertMerchRequestSchema>;
export type MerchRequest = typeof merchRequests.$inferSelect;
