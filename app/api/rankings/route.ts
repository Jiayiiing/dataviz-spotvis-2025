import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client";
import { getAlbumCover } from '@/utils/SpotifyAPI/spotifyApi'


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
    .from("Rankings")  // Start with the Rankings table
    .select(`
      spotify_id,
      daily_rank,
      snapshot_date,
      Songs:spotify_id (
        name, 
        popularity, 
        energy, 
        loudness
      )
    `)
    .eq("country_id", countryId)
    .gte("snapshot_date", startDate)
    .lte("snapshot_date", endDate)
    .order("snapshot_date", { ascending: false })
    .limit(5);  // Limit the results to 50 (Top 50 songs)

  // Handle errors
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const spotifyID = data.map(item => item.spotify_id)
  
  const albumCovers = await Promise.all(
    spotifyID.map(async (id) => {
      const albumCover = await getAlbumCover(id);
      return { spotify_id: id, albumCover }; // Returning the spotify_id and its album cover
    })
  );

  const updatedData = data.map((ranking) => {
    // Find the album cover for the ranking using its spotify_id
    const albumCover = albumCovers.find((cover) => cover.spotify_id === ranking.spotify_id)?.albumCover || null;

    // Return the ranking data along with the album cover
    return {
      ...ranking,
      albumCover,  // Include the album cover in the ranking object
      Songs: ranking.Songs // Keep the original Songs array as is
    };
  });

  return NextResponse.json(updatedData);
}
