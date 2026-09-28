import pg from "pg";
import fs from "node:fs";

const env = fs.readFileSync(".env.local", "utf8");
const match = env.match(/DATABASE_URL=([^\r\n]+)/);
const databaseUrl = match[1].replace(/["']/g, "").trim();

const pool = new pg.Pool({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } });

async function main() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS platform_settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      INSERT INTO platform_settings (key, value) VALUES 
        ('non_subscriber_visibility', 'blurred_preview'),
        ('ai_monthly_spending_cap', '500'),
        ('free_customization_count', '3'),
        ('voice_input_enabled', 'true'),
        ('standing_rewrite_instruction', 'Enhance fidelity, specify lighting, color palette, camera lens, and ultra-high-definition composition parameters.'),
        ('payment_provider', 'razorpay')
      ON CONFLICT (key) DO NOTHING;
    `);
    console.log("✅ platform_settings table ready in Supabase!");
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(console.error);
