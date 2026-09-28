// @ts-expect-error node:sqlite is native in Node 22+
import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import fs from "node:fs";

// Ensure data directory exists
const DATA_DIR = path.join(process.cwd(), "data");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, "awa.db");

// Singleton connection
let dbInstance: any = null;

export function getDb(): any {
  if (!dbInstance) {
    dbInstance = new DatabaseSync(DB_PATH);
    initDatabase(dbInstance);
  }
  return dbInstance;
}

function initDatabase(db: any) {
  // Foreign keys
  db.exec("PRAGMA foreign_keys = ON;");

  // 1. Categories table
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      icon TEXT,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 2. Templates table
  db.exec(`
    CREATE TABLE IF NOT EXISTS templates (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      desc TEXT NOT NULL,
      prompt TEXT NOT NULL,
      is_pro INTEGER DEFAULT 0,
      category_id TEXT NOT NULL,
      tool TEXT NOT NULL,
      tool_url TEXT,
      img TEXT NOT NULL,
      tags TEXT NOT NULL,
      views INTEGER DEFAULT 0,
      copies INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
    );
  `);

  // 3. AI Tools table
  db.exec(`
    CREATE TABLE IF NOT EXISTS ai_tools (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      provider TEXT,
      url TEXT,
      is_active INTEGER DEFAULT 1
    );
  `);

  // 4. Template Tool Recommendations
  db.exec(`
    CREATE TABLE IF NOT EXISTS template_tool_recommendations (
      id TEXT PRIMARY KEY,
      template_id TEXT NOT NULL,
      tool_id TEXT NOT NULL,
      reason TEXT,
      is_primary INTEGER DEFAULT 0,
      FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE CASCADE,
      FOREIGN KEY (tool_id) REFERENCES ai_tools(id) ON DELETE CASCADE
    );
  `);

  // 5. Usage Steps
  db.exec(`
    CREATE TABLE IF NOT EXISTS usage_steps (
      id TEXT PRIMARY KEY,
      template_id TEXT NOT NULL,
      step_number INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE CASCADE
    );
  `);

  // 6. Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT,
      role TEXT DEFAULT 'user',
      is_pro INTEGER DEFAULT 0,
      subscription_plan TEXT DEFAULT 'free',
      credits INTEGER DEFAULT 5,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  try {
    db.exec("ALTER TABLE users ADD COLUMN password_hash TEXT;");
  } catch {}

  // 7. Subscriptions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS subscriptions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      plan TEXT NOT NULL,
      amount TEXT NOT NULL,
      status TEXT DEFAULT 'active',
      payment_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // 8. Feedback table
  db.exec(`
    CREATE TABLE IF NOT EXISTS feedback (
      id TEXT PRIMARY KEY,
      template_id TEXT NOT NULL,
      user_id TEXT,
      rating INTEGER NOT NULL,
      comment TEXT,
      tool_used TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE CASCADE
    );
  `);

  // Seed default data if empty
  seedDatabaseIfEmpty(db);
}

function seedDatabaseIfEmpty(db: DatabaseSync) {
  const catCount = db.prepare("SELECT COUNT(*) as count FROM categories").get() as { count: number };
  if (catCount.count > 0) return;

  console.log("Seeding AWA database with initial categories and templates...");

  const categories = [
    { id: "image", slug: "image", name: "Image", description: "Portraits, 3D renders, and digital art prompts", icon: "Palette", sort_order: 1 },
    { id: "video", slug: "video", name: "Video", description: "Cinematic motion vectors, drone flyovers, and AI video generators", icon: "Film", sort_order: 2 },
    { id: "website", slug: "website", name: "Website", description: "Landing pages, UI kits, and web layouts", icon: "Layout", sort_order: 3 },
    { id: "slides", slug: "slides", name: "Slides", description: "Keynotes, pitch decks, and presentations", icon: "BarChart3", sort_order: 4 },
  ];


  const insertCat = db.prepare(`
    INSERT INTO categories (id, slug, name, description, icon, sort_order)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  for (const cat of categories) {
    insertCat.run(cat.id, cat.slug, cat.name, cat.description, cat.icon, cat.sort_order);
  }

  // Seed AI Tools
  const aiTools = [
    { id: "tool-midjourney", name: "Midjourney v6", slug: "midjourney-v6", provider: "Midjourney Inc.", url: "https://midjourney.com" },
    { id: "tool-claude", name: "Claude 3.7 Sonnet", slug: "claude-3-7", provider: "Anthropic", url: "https://anthropic.com" },
    { id: "tool-runway", name: "Runway Gen-3 Alpha", slug: "runway-gen3", provider: "Runway", url: "https://runwayml.com" },
    { id: "tool-sdxl", name: "Stable Diffusion XL", slug: "sdxl", provider: "Stability AI", url: "https://stability.ai" },
    { id: "tool-dalle", name: "DALL-E 3", slug: "dall-e-3", provider: "OpenAI", url: "https://openai.com" },
  ];

  const insertTool = db.prepare(`
    INSERT INTO ai_tools (id, name, slug, provider, url, is_active)
    VALUES (?, ?, ?, ?, ?, 1)
  `);

  for (const tool of aiTools) {
    insertTool.run(tool.id, tool.name, tool.slug, tool.provider, tool.url);
  }



  // Seed initial admin account
  const insertUser = db.prepare(`
    INSERT INTO users (id, email, name, role, is_pro, subscription_plan, credits)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  insertUser.run("admin-demo", "admin@awa.ai", "AWA Admin", "admin", 1, "lifetime", 999);

  console.log("Database initialized successfully!");
}

/* =========================================================================
   PUBLIC DATABASE REPOSITORY QUERIES
   ========================================================================= */

export function getCategories() {
  const db = getDb();
  return db.prepare(`
    SELECT c.*, COUNT(t.id) as template_count
    FROM categories c
    LEFT JOIN templates t ON t.category_id = c.id
    GROUP BY c.id
    ORDER BY c.sort_order ASC
  `).all();
}

export function getTemplates(options?: {
  categoryId?: string;
  tool?: string;
  search?: string;
  limit?: number;
  offset?: number;
}) {
  const db = getDb();
  let query = "SELECT * FROM templates WHERE 1=1";
  const params: unknown[] = [];

  if (options?.categoryId && options.categoryId !== "all") {
    query += " AND category_id = ?";
    params.push(options.categoryId);
  }

  if (options?.tool && options.tool !== "All Models") {
    query += " AND tool LIKE ?";
    params.push(`%${options.tool}%`);
  }

  if (options?.search) {
    query += " AND (title LIKE ? OR desc LIKE ? OR tags LIKE ?)";
    const term = `%${options.search}%`;
    params.push(term, term, term);
  }

  query += " ORDER BY created_at DESC";

  if (options?.limit) {
    query += " LIMIT ?";
    params.push(options.limit);
    if (options?.offset) {
      query += " OFFSET ?";
      params.push(options.offset);
    }
  }

  const rows = db.prepare(query).all(...params) as Record<string, unknown>[];

  return rows.map((r) => ({
    ...r,
    isPro: Boolean(r.is_pro),
    tags: typeof r.tags === "string" ? JSON.parse(r.tags) : r.tags,
  }));
}

export function getTemplateById(idOrSlug: string) {
  const db = getDb();
  const row = db
    .prepare("SELECT * FROM templates WHERE id = ? OR slug = ?")
    .get(idOrSlug, idOrSlug) as Record<string, unknown> | undefined;

  if (!row) return null;

  // Fetch usage steps
  const steps = db
    .prepare("SELECT * FROM usage_steps WHERE template_id = ? ORDER BY step_number ASC")
    .all(row.id as string);

  return {
    ...row,
    isPro: Boolean(row.is_pro),
    tags: typeof row.tags === "string" ? JSON.parse(row.tags as string) : row.tags,
    steps,
  };
}

export function incrementTemplateCopies(id: string) {
  const db = getDb();
  db.prepare("UPDATE templates SET copies = copies + 1 WHERE id = ?").run(id);
}

export function incrementTemplateViews(id: string) {
  const db = getDb();
  db.prepare("UPDATE templates SET views = views + 1 WHERE id = ?").run(id);
}

export function getUserByEmail(email: string) {
  const db = getDb();
  return db.prepare("SELECT * FROM users WHERE email = ?").get(email) as Record<string, unknown> | undefined;
}

export function createOrGetUser(email: string, name?: string, passwordHash?: string) {
  const db = getDb();
  let user = getUserByEmail(email);
  if (!user) {
    const id = `user-${Date.now()}`;
    db.prepare(`
      INSERT INTO users (id, email, name, role, is_pro, subscription_plan, credits, password_hash)
      VALUES (?, ?, ?, 'user', 0, 'free', 5, ?)
    `).run(id, email, name || "Creator", passwordHash || null);
    user = getUserByEmail(email);
  }
  return user;
}

export function recordSubscription(userId: string, plan: string, amount: string, paymentId?: string) {
  const db = getDb();
  const subId = `sub-${Date.now()}`;
  db.prepare(`
    INSERT INTO subscriptions (id, user_id, plan, amount, status, payment_id)
    VALUES (?, ?, ?, ?, 'active', ?)
  `).run(subId, userId, plan, amount, paymentId || `pay_${Date.now()}`);

  db.prepare(`
    UPDATE users SET is_pro = 1, subscription_plan = ?, credits = credits + 5 WHERE id = ?
  `).run(plan, userId);

  return { subId, success: true };
}

export function addFeedback(data: { templateId: string; userId?: string; rating: number; comment?: string; toolUsed?: string }) {
  const db = getDb();
  const id = `fb-${Date.now()}`;
  db.prepare(`
    INSERT INTO feedback (id, template_id, user_id, rating, comment, tool_used)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(id, data.templateId, data.userId || null, data.rating, data.comment || "", data.toolUsed || "");
  return { id, success: true };
}

export function getAdminStats() {
  const db = getDb();
  const templatesCount = (db.prepare("SELECT COUNT(*) as count FROM templates").get() as { count: number }).count;
  const usersCount = (db.prepare("SELECT COUNT(*) as count FROM users").get() as { count: number }).count;
  const proUsersCount = (db.prepare("SELECT COUNT(*) as count FROM users WHERE is_pro = 1").get() as { count: number }).count;
  const totalCopies = (db.prepare("SELECT SUM(copies) as count FROM templates").get() as { count: number }).count || 0;
  const totalViews = (db.prepare("SELECT SUM(views) as count FROM templates").get() as { count: number }).count || 0;
  const subRows = db.prepare("SELECT amount FROM subscriptions WHERE status = 'active'").all() as { amount: string }[];
  let totalRevenueNum = 0;
  for (const s of subRows) {
    const cleaned = parseFloat(String(s.amount).replace(/[^0-9.]/g, "")) || 0;
    totalRevenueNum += cleaned;
  }
  const recentFeedback = db.prepare("SELECT * FROM feedback ORDER BY created_at DESC LIMIT 5").all();

  return {
    templatesCount,
    usersCount,
    proUsersCount,
    totalCopies,
    totalViews,
    totalRevenue: totalRevenueNum,
    recentFeedback,
  };
}
