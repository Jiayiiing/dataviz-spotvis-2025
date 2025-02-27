import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client";

export async function GET(req: NextRequest) {
  const supabase = createClient();

  // Extract query parameters
  const { searchParams } = new URL(req.url);
  const country_id = searchParams.get("country");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  if (!startDate || !endDate || !country_id) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  // Fetch rankings, keeping only the best rank per artist per date
  const { data, error } = await supabase
    .from("Rankings")
    .select(`
      daily_rank, 
      snapshot_date, 
      spotify_id
    `)
    .eq("country_id", country_id) // Filter by country
    .gte("snapshot_date", startDate)
    .lte("snapshot_date", endDate)
    .order("daily_rank", { ascending: true }) // Best rank first
    .order("snapshot_date", { ascending: true })
    .limit(100);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data || data.length === 0) {
    return NextResponse.json({ error: "No rankings found" }, { status: 404 });
  }

  const spotifyIds = data.map(item => item.spotify_id)

  const { data: songArtistsData, error: songArtistsError } = await supabase
  .from("Song_artists")
  .select("spotify_id, artist_id, Artists:artist_id (name)") // Join with Artists
  .in("spotify_id", spotifyIds); 

if (songArtistsError) {
  return NextResponse.json({ error: songArtistsError.message }, { status: 500 });
}

// Create a mapping from spotify_id to artist_name
const artistMap = songArtistsData.reduce((acc, entry) => {
  acc[entry.spotify_id] = (entry.Artists as any)?.name || "Unknown Artist";
  return acc;
}, {} as Record<string, string>);

// merge data
const mergedData = data.map((item) => ({
  daily_rank: item.daily_rank,
  snapshot_date: item.snapshot_date,
  spotify_id: item.spotify_id,
  artist_name: artistMap[item.spotify_id] || "Unknown Artist",
}));

return NextResponse.json(mergedData);
}
