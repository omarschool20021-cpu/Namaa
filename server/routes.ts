import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // NOTE: This app uses client-side Local Storage for ALL data persistence
  // The backend is intentionally minimal and serves only the frontend
  // No API routes are needed as all CRUD operations happen via localStorage on the client
  
  // If you need backend routes in the future, add them here with /api prefix

  const httpServer = createServer(app);

  return httpServer;
}
