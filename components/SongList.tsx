"use client";

type Song = {
  name: string;
  spotify_id: string;
};

type SongListProps = {
  songs: Song[]; // Array of Song objects
  selectedSongs: Song[]; // Array of selected Song objects
  onSelectionChange: (selectedSongs: Song[]) => void; // Function to update the selected songs
};

export default function SongList({
  songs,
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
            <th className="border p-2">Song Name</th>
          </tr>
        </thead>
        <tbody>
          {songs.map((song, index) => (
            <tr key={index}>
              <td className="border p-2">
                <input
                  type="checkbox"
                  onChange={(e) => handleCheckboxChange(song, e.target.checked)}
                />
              </td>
              <td className="border p-2">{song.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
