import pg from "pg";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env.local manually
const envPath = path.resolve(__dirname, "../.env.local");
let databaseUrl = process.env.DATABASE_URL;

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed.startsWith("DATABASE_URL=")) {
      databaseUrl = trimmed.substring("DATABASE_URL=".length).trim();
      // Remove enclosing quotes if any
      if ((databaseUrl.startsWith('"') && databaseUrl.endsWith('"')) || (databaseUrl.startsWith("'") && databaseUrl.endsWith("'"))) {
        databaseUrl = databaseUrl.slice(1, -1);
      }
    }
  }
}

if (!databaseUrl) {
  console.error("❌ DATABASE_URL not found in .env.local");
  process.exit(1);
}

console.log("🚀 Connecting to Supabase PostgreSQL at:", databaseUrl.replace(/:[^:@]+@/, ":****@"));

const pool = new pg.Pool({
  connectionString: databaseUrl,
  ssl: { rejectUnauthorized: false },
});

async function runMigration() {
  const client = await pool.connect();
  try {
    console.log(" Connected to Supabase! Creating database schema...");

    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        description TEXT,
        icon TEXT,
        sort_order INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS templates (
        id TEXT PRIMARY KEY,
        category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        description TEXT,
        prompt_text TEXT NOT NULL,
        image_url TEXT,
        featured BOOLEAN DEFAULT FALSE,
        complexity TEXT DEFAULT 'beginner',
        tags TEXT,
        copy_count INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS ai_tools (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT,
        website_url TEXT,
        description TEXT
      );

      CREATE TABLE IF NOT EXISTS template_tool_recommendations (
        id TEXT PRIMARY KEY,
        template_id TEXT REFERENCES templates(id) ON DELETE CASCADE,
        tool_id TEXT REFERENCES ai_tools(id) ON DELETE CASCADE,
        reason TEXT,
        is_primary BOOLEAN DEFAULT FALSE
      );

      CREATE TABLE IF NOT EXISTS usage_steps (
        id TEXT PRIMARY KEY,
        template_id TEXT REFERENCES templates(id) ON DELETE CASCADE,
        step_number INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        name TEXT,
        role TEXT DEFAULT 'user',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS subscriptions (
        id TEXT PRIMARY KEY,
        user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
        plan TEXT NOT NULL,
        status TEXT NOT NULL,
        starts_at TIMESTAMPTZ DEFAULT NOW(),
        expires_at TIMESTAMPTZ
      );

      CREATE TABLE IF NOT EXISTS feedback (
        id TEXT PRIMARY KEY,
        template_id TEXT REFERENCES templates(id) ON DELETE CASCADE,
        user_id TEXT,
        rating INTEGER NOT NULL,
        comment TEXT,
        tool_used TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    console.log("✅ Tables created successfully in Supabase!");

    // Seed Categories
    console.log("🌱 Seeding Categories...");
    const categories = [
      { id: "cat-1", name: "Landing Pages & Hero Sections", slug: "landing-pages", description: "Cinematic high-converting landing pages & responsive hero grids.", icon: "Layout", sort_order: 1 },
      { id: "cat-2", name: "Cyber & Tech Interfaces", slug: "cyber-tech", description: "Futuristic HUDs, neon telemetry, and cyber-grid software mockups.", icon: "Cpu", sort_order: 2 },
      { id: "cat-3", name: "E-Commerce & Showcases", slug: "ecommerce", description: "Luxury editorial product cards, interactive catalogs & shopping capsules.", icon: "ShoppingBag", sort_order: 3 },
      { id: "cat-4", name: "Portfolios & Creatives", slug: "portfolios", description: "Bold typography, interactive dynamic galleries, and editorial layouts.", icon: "Palette", sort_order: 4 },
      { id: "cat-5", name: "Mobile & App UIs", slug: "mobile-apps", description: "iOS & Android mobile interfaces, glassy navigation, and micro-interactions.", icon: "Smartphone", sort_order: 5 },
      { id: "cat-6", name: "SaaS & Dashboard Analytics", slug: "saas-dashboards", description: "Executive KPI graphs, dark mode data monitors, and sleek modular widgets.", icon: "BarChart3", sort_order: 6 },
    ];

    for (const c of categories) {
      await client.query(
        `INSERT INTO categories (id, name, slug, description, icon, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (id) DO UPDATE SET name=$2, slug=$3, description=$4, icon=$5, sort_order=$6`,
        [c.id, c.name, c.slug, c.description, c.icon, c.sort_order]
      );
    }

    // Seed AI Tools
    console.log("🌱 Seeding AI Tools...");
    const tools = [
      { id: "tool-midjourney", name: "Midjourney v6.1", category: "image", website_url: "https://midjourney.com", description: "Top-tier cinematic rendering and hyper-realistic photorealistic lighting." },
      { id: "tool-v0", name: "v0 by Vercel", category: "code", website_url: "https://v0.dev", description: "Generates production-ready React / Tailwind Next.js code instantly." },
      { id: "tool-claude", name: "Claude 3.7 Sonnet", category: "code", website_url: "https://anthropic.com", description: "Premier reasoning model for full-stack architecture and UI generation." },
      { id: "tool-flux", name: "FLUX.1 Schnell / Pro", category: "image", website_url: "https://blackforestlabs.ai", description: "State-of-the-art open weights visual generator with pinpoint text rendering." },
      { id: "tool-cursor", name: "Cursor AI", category: "ide", website_url: "https://cursor.com", description: "AI-first code editor for effortless codebase generation and iteration." },
    ];

    for (const t of tools) {
      await client.query(
        `INSERT INTO ai_tools (id, name, category, website_url, description)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (id) DO UPDATE SET name=$2, category=$3, website_url=$4, description=$5`,
        [t.id, t.name, t.category, t.website_url, t.description]
      );
    }

    // Seed Templates
    console.log("🌱 Seeding Templates (including AI Studio & Panoramic Capsule)...");
    const templates = [
      {
        id: "ai-studio",
        category_id: "cat-1",
        title: "AI Studio — Cinematic Capsule Suite",
        slug: "ai-studio",
        description: "Panoramic capsule hero with dark mode contrast, floating micro-interactions, and live dynamic prompt terminal.",
        prompt_text: "High-end cinematic AI studio web layout, dark obsidian theme with violet electric edge glow, floating curved capsule hero, interactive parameter controllers, frosted glass telemetry panels, ultra clean modern typography, 8k resolution, minimalist editorial aesthetic --ar 16:9 --style raw --v 6.1",
        image_url: "/cyber_dashboard.jpg",
        featured: true,
        complexity: "advanced",
        tags: "Panoramic,Capsule,Dark Mode,Editorial,AI Studio,Next.js",
        copy_count: 342,
      },
      {
        id: "tpl-1",
        category_id: "cat-1",
        title: "Neo-Obsidian Cyber Hero",
        slug: "neo-obsidian-cyber-hero",
        description: "Deep charcoal mesh gradients with luminous cyan borders, responsive CTA badges, and fluid layout.",
        prompt_text: "Futuristic cyber landing page hero section, dark slate obsidian backdrop, vibrant cyan neon highlights, glowing typography, modular cards, frosted glass telemetry, ultra realistic lighting, rendered in Unreal Engine 5 --ar 16:9 --s 750",
        image_url: "/cyber_dashboard.jpg",
        featured: true,
        complexity: "intermediate",
        tags: "Hero,Obsidian,Cyber,Futuristic,Glassmorphism",
        copy_count: 184,
      },
      {
        id: "tpl-2",
        category_id: "cat-2",
        title: "Quantum Telemetry HUD",
        slug: "quantum-telemetry-hud",
        description: "Modular dashboard panel displaying server health, latency graphs, and cryptographic tokens.",
        prompt_text: "Sci-fi quantum telemetry dashboard UI, holographic data visualizations, neon orange and electric blue meters, dark sleek carbon background, vector wireframes, ISO 27001 compliance monitors, ultra-sharp vector graphics --ar 16:9",
        image_url: "/cyber_portrait.jpg",
        featured: true,
        complexity: "advanced",
        tags: "HUD,Telemetry,Telemetry,Dark Mode,Vector",
        copy_count: 92,
      },
      {
        id: "tpl-3",
        category_id: "cat-3",
        title: "Luminary E-Commerce Capsule",
        slug: "luminary-ecommerce-capsule",
        description: "Minimalist Scandinavian product showcase with smooth hover zooms and clean layout.",
        prompt_text: "Luxury minimalist ecommerce product landing page, warm ivory and obsidian color palette, floating 3D ceramic vase, soft diffuse studio lighting, Swiss typography grid, high-end editorial lookbook --ar 16:9 --style raw",
        image_url: "/holographic_3d.jpg",
        featured: false,
        complexity: "beginner",
        tags: "E-Commerce,Minimal,Editorial,Product,Lookbook",
        copy_count: 75,
      },
      {
        id: "tpl-4",
        category_id: "cat-4",
        title: "Architectonic Creative Portfolio",
        slug: "architectonic-creative-portfolio",
        description: "Asymmetric masonry layout designed for 3D artists, architectural designers, and creative directors.",
        prompt_text: "Avant-garde architecture portfolio website, brutalist structure with refined elegance, monochrome with single rust-orange accent, high contrast layout, smooth parallax scrolling cues --ar 16:9",
        image_url: "/cyber_dashboard.jpg",
        featured: true,
        complexity: "intermediate",
        tags: "Portfolio,Creative,Brutalist,Editorial,Architecture",
        copy_count: 120,
      },
      {
        id: "tpl-5",
        category_id: "cat-6",
        title: "Apex Cloud Metrics SaaS",
        slug: "apex-cloud-metrics-saas",
        description: "Enterprise SaaS monitoring interface featuring real-time stream graphs and node health indicators.",
        prompt_text: "Modern dark SaaS analytics console, violet and emerald data graphs, real-time transaction feeds, clean tabular data display, frosted sidebar navigation, modern web application layout --ar 16:9 --v 6.1",
        image_url: "/holographic_3d.jpg",
        featured: true,
        complexity: "advanced",
        tags: "SaaS,Analytics,Metrics,Enterprise,Dark UI",
        copy_count: 215,
      },
    ];

    for (const t of templates) {
      await client.query(
        `INSERT INTO templates (id, category_id, title, slug, description, prompt_text, image_url, featured, complexity, tags, copy_count)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         ON CONFLICT (id) DO UPDATE SET title=$3, slug=$4, description=$5, prompt_text=$6, image_url=$7, featured=$8, complexity=$9, tags=$10, copy_count=$11`,
        [t.id, t.category_id, t.title, t.slug, t.description, t.prompt_text, t.image_url, t.featured, t.complexity, t.tags, t.copy_count]
      );
    }

    // Seed Demo Users
    console.log("🌱 Seeding Demo Users...");
    await client.query(
      `INSERT INTO users (id, email, name, role)
       VALUES ('usr-admin', 'admin@awa.ai', 'AWA Lead Architect', 'admin'),
              ('usr-demo', 'creator@awa.ai', 'Elena Rostova', 'pro_subscriber')
       ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name, role=EXCLUDED.role`
    );

    // Verify Counts
    const catCount = await client.query("SELECT COUNT(*) FROM categories");
    const tplCount = await client.query("SELECT COUNT(*) FROM templates");
    const toolCount = await client.query("SELECT COUNT(*) FROM ai_tools");
    const usrCount = await client.query("SELECT COUNT(*) FROM users");

    console.log("🎉 SUCCESS! Supabase PostgreSQL Database Seeded:");
    console.log(`   - Categories: ${catCount.rows[0].count}`);
    console.log(`   - Templates:  ${tplCount.rows[0].count}`);
    console.log(`   - AI Tools:   ${toolCount.rows[0].count}`);
    console.log(`   - Users:      ${usrCount.rows[0].count}`);

  } catch (err) {
    console.error("❌ Migration error:", err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration().then(() => {
  console.log(" Migration completed successfully!");
  process.exit(0);
}).catch(() => {
  process.exit(1);
});
