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
      ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS is_pro BOOLEAN DEFAULT FALSE;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS credits INTEGER DEFAULT 10;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_plan TEXT DEFAULT 'free';

      -- Ensure default admin user exists with password
      INSERT INTO users (id, email, name, role, is_pro, credits, subscription_plan, password_hash)
      VALUES 
        ('usr-admin', 'admin@awa.ai', 'AWA Lead Architect', 'admin', TRUE, 999, 'lifetime', 'admin123'),
        ('usr-demo', 'creator@awa.ai', 'Elena Rostova', 'pro_subscriber', TRUE, 50, 'yearly', 'awa2026')
      ON CONFLICT (email) DO UPDATE SET 
        role = EXCLUDED.role,
        is_pro = EXCLUDED.is_pro,
        password_hash = COALESCE(users.password_hash, EXCLUDED.password_hash);
    `);
    console.log("✅ Supabase users table schema updated with auth credentials!");
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(console.error);
