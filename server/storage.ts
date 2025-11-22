import { type User, type InsertUser, type MerchRequest, type InsertMerchRequest } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createMerchRequest(request: InsertMerchRequest): Promise<MerchRequest>;
  getMerchRequest(id: string): Promise<MerchRequest | undefined>;
  addFilesToRequest(id: string, files: Array<{ id: string; name: string; type: string; size: number; preview?: string }>): Promise<MerchRequest | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private merchRequests: Map<string, MerchRequest>;

  constructor() {
    this.users = new Map();
    this.merchRequests = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createMerchRequest(insertRequest: InsertMerchRequest): Promise<MerchRequest> {
    const id = randomUUID();
    const request: MerchRequest = { 
      id,
      zipCode: insertRequest.zipCode,
      deadline: insertRequest.deadline ?? null,
      budget: insertRequest.budget ?? null,
      products: Array.isArray(insertRequest.products) ? [...insertRequest.products] : insertRequest.products,
      colorways: insertRequest.colorways ?? null,
      customColors: insertRequest.customColors ? [...insertRequest.customColors] : null,
      printMethod: insertRequest.printMethod ?? null,
      printLocations: insertRequest.printLocations ?? null,
      files: insertRequest.files ? [...insertRequest.files] as Array<{ id: string; name: string; type: string; size: number; preview?: string }> : null,
      contactName: insertRequest.contactName,
      contactEmail: insertRequest.contactEmail,
      contactPhone: insertRequest.contactPhone ?? null,
      company: insertRequest.company ?? null,
      message: insertRequest.message ?? null,
      createdAt: new Date()
    };
    this.merchRequests.set(id, request);
    return request;
  }

  async getMerchRequest(id: string): Promise<MerchRequest | undefined> {
    return this.merchRequests.get(id);
  }

  async addFilesToRequest(id: string, files: Array<{ id: string; name: string; type: string; size: number; preview?: string }>): Promise<MerchRequest | undefined> {
    const request = this.merchRequests.get(id);
    if (!request) return undefined;
    
    const currentFiles = request.files || [];
    const updatedRequest: MerchRequest = {
      ...request,
      files: [...currentFiles, ...files]
    };
    this.merchRequests.set(id, updatedRequest);
    return updatedRequest;
  }
}

// Conditionally import database only if DATABASE_URL is set
let DbStorage: new () => IStorage;
let storageInstance: IStorage;

if (process.env.DATABASE_URL) {
  try {
    const { db } = await import("./db");
    const { users, merchRequests } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");

    class DbStorageImpl implements IStorage {
      async getUser(id: string): Promise<User | undefined> {
        const result = await db.select().from(users).where(eq(users.id, id));
        return result[0];
      }

      async getUserByUsername(username: string): Promise<User | undefined> {
        const result = await db.select().from(users).where(eq(users.username, username));
        return result[0];
      }

      async createUser(insertUser: InsertUser): Promise<User> {
        const result = await db.insert(users).values(insertUser).returning();
        return result[0];
      }

      async createMerchRequest(insertRequest: InsertMerchRequest): Promise<MerchRequest> {
        const result = await db.insert(merchRequests).values({
          zipCode: insertRequest.zipCode,
          deadline: insertRequest.deadline,
          budget: insertRequest.budget,
          products: insertRequest.products as any,
          colorways: insertRequest.colorways,
          customColors: insertRequest.customColors as any,
          printMethod: insertRequest.printMethod,
          printLocations: insertRequest.printLocations,
          files: insertRequest.files as any,
          contactName: insertRequest.contactName,
          contactEmail: insertRequest.contactEmail,
          contactPhone: insertRequest.contactPhone,
          company: insertRequest.company,
          message: insertRequest.message,
        }).returning();
        return result[0];
      }

      async getMerchRequest(id: string): Promise<MerchRequest | undefined> {
        const result = await db.select().from(merchRequests).where(eq(merchRequests.id, id));
        return result[0];
      }

      async addFilesToRequest(id: string, files: Array<{ id: string; name: string; type: string; size: number; preview?: string }>): Promise<MerchRequest | undefined> {
        const existing = await this.getMerchRequest(id);
        if (!existing) return undefined;
        
        const currentFiles = existing.files || [];
        const updatedFiles = [...currentFiles, ...files];
        
        const result = await db
          .update(merchRequests)
          .set({ files: updatedFiles as any })
          .where(eq(merchRequests.id, id))
          .returning();
        
        return result[0];
      }
    }

    DbStorage = DbStorageImpl;
    storageInstance = new DbStorageImpl();
  } catch (error) {
    console.warn("Failed to initialize database storage, falling back to in-memory storage:", error);
    storageInstance = new MemStorage();
  }
} else {
  console.log("DATABASE_URL not set, using in-memory storage");
  storageInstance = new MemStorage();
}

export const storage = storageInstance;
