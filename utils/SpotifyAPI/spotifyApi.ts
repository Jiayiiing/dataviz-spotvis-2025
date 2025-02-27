const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!;
const clientSecret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET!;

let tokenCache: { token: string; expiresAt: number } | null = null;

export async function getToken(){
    
    if (tokenCache && Date.now() < tokenCache.expiresAt) {
        return tokenCache.token;
    }

    try {
        const url = "https://accounts.spotify.com/api/token";

        const payload = {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": "Basic " + btoa(clientId + ":" + clientSecret)
            },
            body: "grant_type=client_credentials"
        };

        const response = await fetch(url, payload);

        if (!response.ok) {
            console.error("Failed to fetch Spotify token:", await response.text());
            return null;
        }

        const data = await response.json();
        tokenCache = {
            token: data.access_token,
            expiresAt: Date.now() + data.expires_in * 1000 // Store expiration time
        };

        return data.access_token;
    } catch (error) {
        console.error("Error fetching token:", error);
        return null;
    }
}



export const getAlbumCover = async (spotifyId: string): Promise<string | null> => {
    const token = await getToken();
    if (!token) return null;
    try {
        const response = await fetch(`https://api.spotify.com/v1/tracks/${spotifyId}`, {
        headers: { Authorization: `Bearer ${token}` }
        });
    
        if (response.status === 429) {
            const retryAfter = response.headers.get("Retry-After");
            console.warn(`Rate limited! Retry after ${retryAfter} seconds.`);
            if (retryAfter) {
                await new Promise((resolve) => setTimeout(resolve, parseInt(retryAfter) * 1000));
                return getAlbumCover(spotifyId); // Retry
            }
            return null;
        }

        if (!response.ok) {
        console.error(`Failed to fetch track ${spotifyId}:`, await response.text());
        return null;
        }
    
        const trackData = await response.json();

        if (!trackData.album?.images?.length) {
        console.warn(`No album image found for track ${spotifyId}`);
        return null;
        }

        return trackData.album.images[0].url;
    } catch (error) {
        console.error(`Error fetching album cover for ${spotifyId}:`, error);
        return null;
    }
  };