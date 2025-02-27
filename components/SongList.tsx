"use client";

type Song = {
  name: string;
  spotify_id: string;
};

type Ranking = {
  spotify_id: string;
  daily_rank: number;
  snapshot_date: string;
  albumCover: string | null; // albumCover moved to the ranking level
  Songs: Song;
};

type SongListProps = {
  rankings: Ranking[]; // Array of Song objects
  selectedSongs: Song[]; // Array of selected Song objects
  onSelectionChange: (selectedSongs: Song[]) => void; // Function to update the selected songs
};

export default function SongList({
  rankings,
  selectedSongs,
  onSelectionChange,
}: SongListProps) {
  const handleCheckboxChange = (song: Song, isChecked: boolean) => {
    if (isChecked) {
      // Add song to selectedSongs when checked
      onSelectionChange([...selectedSongs, song]);
    } else {
      // Remove song from selectedSongs when unchecked
      onSelectionChange(selectedSongs.filter((s) => s.spotify_id !== song.spotify_id));
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Song List</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Select</th>
            <th className="border p-2">Album</th>
            <th className="border p-2">Song Name</th>
          </tr>
        </thead>
        <tbody>
          {rankings.map((ranking) => (
            <tr key={ranking.spotify_id}>
              <td className="border p-2">
                <input
                  type="checkbox"
                  onChange={(e) => handleCheckboxChange(ranking.Songs, e.target.checked)}/>
              </td>
              <td className="border p-2">
                {ranking.albumCover ? (
                  <img
                    src={ranking.albumCover}
                    alt="Album Cover"
                    className="w-12 h-12 rounded"
                  />) : (<span>No Image</span>)}
              </td>
              <td className="border p-2">{ranking.Songs.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
