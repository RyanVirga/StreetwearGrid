import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMerchRequestSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create a new merch request
  app.post("/api/requests", async (req, res) => {
    try {
      const validatedData = insertMerchRequestSchema.parse(req.body);
      const request = await storage.createMerchRequest(validatedData);
      res.status(201).json(request);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid request data", details: error.errors });
      } else {
        console.error("Error creating merch request:", error);
        res.status(500).json({ error: "Failed to create request" });
      }
    }
  });

  // Get a specific merch request by ID
  app.get("/api/requests/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const request = await storage.getMerchRequest(id);
      
      if (!request) {
        res.status(404).json({ error: "Request not found" });
        return;
      }
      
      res.json(request);
    } catch (error) {
      console.error("Error fetching merch request:", error);
      res.status(500).json({ error: "Failed to fetch request" });
    }
  });

  // Add files to an existing request
  app.post("/api/requests/:id/files", async (req, res) => {
    try {
      const { id } = req.params;
      const filesSchema = z.array(z.object({
        id: z.string(),
        name: z.string(),
        type: z.string(),
        size: z.number(),
        preview: z.string().optional()
      }));
      
      const validatedFiles = filesSchema.parse(req.body);
      const updatedRequest = await storage.addFilesToRequest(id, validatedFiles);
      
      if (!updatedRequest) {
        res.status(404).json({ error: "Request not found" });
        return;
      }
      
      res.json(updatedRequest);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid files data", details: error.errors });
      } else {
        console.error("Error adding files to request:", error);
        res.status(500).json({ error: "Failed to add files" });
      }
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
