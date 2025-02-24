import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client";

export async function GET(req: NextRequest) {
  const supabase = createClient();

  // Extract query parameters
  const { searchParams } = new URL(req.url);
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  if (!startDate || !endDate) {
    return NextResponse.json({ error: "Missing date range parameters" }, { status: 400 });
  }

  // Fetch rankings for joining with countries table and songs table
  const { data, error } = await supabase
    .from("Rankings")  // Start with the Rankings table
    .select(`
      spotify_id,
      daily_rank,
      snapshot_date,
      Countries:country_id (country), 
      Songs:spotify_id (
        name, 
        popularity, 
        energy, 
        loudness
      )
    `)
    .gte("snapshot_date", startDate)
    .lte("snapshot_date", endDate)
    .order("snapshot_date", { ascending: false })
    .limit(100);  

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
