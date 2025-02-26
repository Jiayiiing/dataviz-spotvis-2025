import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client";

export async function GET(req: NextRequest) {
  const supabase = createClient();

  // Extract query parameters
  const { searchParams } = new URL(req.url);
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const country_id = searchParams.get("country_id"); // Get country_id

  if (!startDate || !endDate || !country_id) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  const countryIdNum = parseInt(country_id, 10); // Convert to a number
  if (isNaN(countryIdNum)) {
    return NextResponse.json({ error: "Invalid country_id" }, { status: 400 });
  }

  // Fetch rankings filtered by country_id
  const { data, error } = await supabase
    .from("Rankings")  // Query the Rankings table
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
    .eq("country_id", countryIdNum)
    .gte("snapshot_date", startDate)
    .lte("snapshot_date", endDate)
    .order("snapshot_date", { ascending: false })
    .limit(100);  

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
