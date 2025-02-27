"use client"; // Add this at the very top

import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';

// Register necessary chart components
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function Page() {
    const [data, setData] = useState<any[] | null>(null);
    const [songId1, setSongId1] = useState('');
    const [songId2, setSongId2] = useState('');
    const [loading, setLoading] = useState(false);
    const supabase = createClient();
    

    const getData = async () => {
        setLoading(true);
        const { data: supabasedata, error } = await supabase
            .from('Spotivis')
            .select('spotify_id, name, energy, danceability, valence, acousticness, instrumentalness, liveness')
            .in('spotify_id', [songId1, songId2]);

        if (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
            return;
        }

        const uniqueData = Object.values(
            supabasedata.reduce<Record<string, (typeof supabasedata)[number]>>((acc, song) => {
                acc[song.spotify_id] = song;
                return acc;
            }, {})
        );
        const formattedData = uniqueData.map(song => ({
            label: song.name,
            data: [song.energy, song.danceability, song.valence, song.acousticness, song.instrumentalness, song.liveness],
            fill: true,
            backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.2)`,
            borderColor: `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`,
            pointBackgroundColor: 'rgb(255, 99, 132)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(255, 99, 132)'
        }));

        setData(formattedData);
        setLoading(false);
    };

    const chartData = {
        labels: ['Energy', 'Danceability', 'Valence', 'Acousticness', 'Instrumentalness', 'Liveness'],
        datasets: data || []
    };

    return (
        <div>
            <div>
                <input
                    type="text"
                    placeholder="Enter first song ID"
                    value={songId1}
                    onChange={(e) => setSongId1(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Enter second song ID"
                    value={songId2}
                    onChange={(e) => setSongId2(e.target.value)}
                />
                <button onClick={getData}>Fetch Data</button>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : (
                data && <Radar data={chartData} options={{ elements: { line: { borderWidth: 3 } } }} />
            )}
        </div>
    );
}