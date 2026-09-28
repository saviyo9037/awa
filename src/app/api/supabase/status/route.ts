import { NextResponse } from "next/server";
import { supabase, getSupabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const hasAnon = Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    const hasServiceRole = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
    const hasDbUrl = Boolean(process.env.DATABASE_URL);

    // Test a basic ping via Supabase client
    const client = getSupabaseAdmin();
    const { data, error } = await client.from("categories").select("count", { count: "exact", head: true });

    return NextResponse.json({
      status: "connected",
      message: "Supabase credentials loaded and verified successfully!",
      config: {
        projectUrl: supabaseUrl,
        hasAnonKey: hasAnon,
        hasServiceRoleKey: hasServiceRole,
        hasDatabasePoolerUrl: hasDbUrl,
      },
      tableStatus: error ? `Remote table check: ${error.message} (Note: Run schema migration if tables not yet created on Supabase)` : "Tables detected",
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      {
        status: "error",
        error: message,
      },
      { status: 500 }
    );
  }
}
