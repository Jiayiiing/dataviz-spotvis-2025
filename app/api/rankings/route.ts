import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client";

export async function GET(req: NextRequest) {
  const supabase = createClient();

  // Extract query parameters
  const { searchParams } = new URL(req.url);
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const countryId = searchParams.get("countryId")

  // Check if startDate, endDate, or country are missing
  if (!startDate || !endDate || !countryId) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  // Fetch rankings for joining with countries table and songs table
  const { data, error } = await supabase
    .from("Rankings")  // Query the Rankings table
    .select(`
      spotify_id,
      daily_rank,
      snapshot_date,
      Songs:spotify_id (
        name,
          Song_artists (
            Artists (
              name
            )
          )
      )
    `)
    .eq("country_id", countryId)
    .gte("snapshot_date", startDate)
    .lte("snapshot_date", endDate)
    .order("snapshot_date", { ascending: false })
    .limit(50);  // Limit the results to 50 (Top 50 songs)

  // Handle errors
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
 
  return NextResponse.json(data);
}
