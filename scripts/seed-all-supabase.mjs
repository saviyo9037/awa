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

const pool = new pg.Pool({
  connectionString: databaseUrl,
  ssl: { rejectUnauthorized: false },
});

async function loadCatalog() {
  const dataPath = path.resolve(__dirname, "../src/lib/data.ts");
  const content = fs.readFileSync(dataPath, "utf-8");
  const match = content.match(/export const templates\s*=\s*(\[[\s\S]*?\n\];)/);
  if (!match) return [];
  const fn = new Function(`return ${match[1].replace(/;\s*$/, "")}`);
  return fn();
}

async function runFullSeed() {
  const client = await pool.connect();
  try {
    console.log(" Connected to Supabase PostgreSQL Pooler!");
    const allTemplates = await loadCatalog();
    console.log(`📦 Found ${allTemplates.length} templates in local catalog to sync.`);

    for (const t of allTemplates) {
      const categoryId = t.category_id || 
                         (t.category === "landing-pages" || t.category === "website" ? "cat-1" :
                         t.category === "cyber-tech" || t.category === "image" ? "cat-2" :
                         t.category === "ecommerce" ? "cat-3" :
                         t.category === "portfolios" || t.category === "poster" ? "cat-4" :
                         t.category === "mobile-apps" || t.category === "mobile" ? "cat-5" :
                         t.category === "saas-dashboards" || t.category === "presentation" ? "cat-6" : "cat-1");
      
      const slug = t.id;
      const tags = Array.isArray(t.tags) ? t.tags.join(",") : (t.tags || "");

      await client.query(
        `INSERT INTO templates (id, category_id, title, slug, description, prompt_text, image_url, featured, complexity, tags, copy_count)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         ON CONFLICT (id) DO UPDATE SET
           category_id = EXCLUDED.category_id,
           title = EXCLUDED.title,
           slug = EXCLUDED.slug,
           description = EXCLUDED.description,
           prompt_text = EXCLUDED.prompt_text,
           image_url = EXCLUDED.image_url,
           featured = EXCLUDED.featured,
           complexity = EXCLUDED.complexity,
           tags = EXCLUDED.tags`,
        [
          t.id,
          categoryId,
          t.title,
          slug,
          t.desc || t.description || "",
          t.prompt || t.prompt_text || "",
          t.img || t.image_url || "/cyber_dashboard.jpg",
          Boolean(t.isPro || t.featured),
          t.isPro ? "advanced" : "intermediate",
          tags,
          Math.floor(Math.random() * 200) + 75,
        ]
      );
    }

    // Seed realistic customer feedback & reviews
    console.log("🌱 Seeding realistic feedback and insights...");
    const feedbackList = [
      { id: "fb-1", template_id: "ai-studio", rating: 5, comment: "The Three.js liquid canvas prompt is insane. Rendered flawlessly in Claude 3.7 with zero syntax errors.", tool_used: "Claude 3.7 Sonnet" },
      { id: "fb-2", template_id: "tpl-1", rating: 5, comment: "Hyper-realistic cyber portrait. Prompt was tuned perfectly for Midjourney v6.1 with rich skin pores.", tool_used: "Midjourney v6.1" },
      { id: "fb-3", template_id: "tpl-2", rating: 5, comment: "Glassmorphic cyber telemetry HUD was ideal for our startup pitch deck visual assets.", tool_used: "v0 by Vercel" },
      { id: "fb-4", template_id: "tpl-6", rating: 5, comment: "Luxury timepiece prompt gave ultra-crisp reflections on stainless steel bezel in Runway Gen-3.", tool_used: "Runway Gen-3 Alpha" },
      { id: "fb-5", template_id: "tpl-12", rating: 4, comment: "Fashion mobile app UI was very clean. Needed minor font size tweaks for smaller viewport.", tool_used: "v0 by Vercel" },
      { id: "fb-6", template_id: "tpl-18", rating: 5, comment: "Trading dashboard charts and neon telemetry worked seamlessly for our crypto DEX layout.", tool_used: "Claude 3.7 Sonnet" },
      { id: "fb-7", template_id: "tpl-30", rating: 5, comment: "Bento box portfolio layout is the most modern aesthetic I have seen in months.", tool_used: "v0 by Vercel" },
    ];

    for (const f of feedbackList) {
      await client.query(
        `INSERT INTO feedback (id, template_id, user_id, rating, comment, tool_used)
         VALUES ($1, $2, 'usr-demo', $3, $4, $5)
         ON CONFLICT (id) DO UPDATE SET rating=EXCLUDED.rating, comment=EXCLUDED.comment, tool_used=EXCLUDED.tool_used`,
        [f.id, f.template_id, f.rating, f.comment, f.tool_used]
      );
    }

    // Check count per category
    const catBreakdown = await client.query(`
      SELECT c.name, COUNT(t.id) as count 
      FROM categories c 
      LEFT JOIN templates t ON t.category_id = c.id 
      GROUP BY c.name
      ORDER BY c.name
    `);

    console.log("🎉 Category Distribution in Supabase:");
    console.table(catBreakdown.rows);

    const tplCount = await client.query("SELECT COUNT(*) FROM templates");
    const fbCount = await client.query("SELECT COUNT(*) FROM feedback");
    console.log(`✅ Supabase Templates count: ${tplCount.rows[0].count}`);
    console.log(`✅ Supabase Feedback count:  ${fbCount.rows[0].count}`);
  } finally {
    client.release();
    await pool.end();
  }
}

runFullSeed().catch(console.error);
