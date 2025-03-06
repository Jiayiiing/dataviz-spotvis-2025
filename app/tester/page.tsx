 'use client'

 import { createClient } from '@/utils/supabase/client';
 import { useEffect, useState } from 'react';

 export default function Page() {
     const [data, setData] = useState<any[] | null>(null);
     const [country, setCountry] = useState('VN');
     const [date, setDate] = useState('2024-10-16');
     const [loading, setLoading] = useState(false);
     const supabase = createClient();
 
     const getData = async () => {
         setLoading(true);
         const { data: supabasedata, error } = await supabase
             .from('Spotivis')
             .select('spotify_id, name, artists')
             .eq('country', country)
             .eq('snapshot_date', date);
 
         if (error) {
             console.error('Error fetching data:', error);
             setLoading(false);
             return;
         }
 
         const extractedData = supabasedata.map((item) => ({
             spotify_id: item.spotify_id,
             name: item.name,
             artists: item.artists,
         }));
 
         setData(extractedData);
         setLoading(false);
     };
 
     return (
         <div>
             <div>
                 <input
                     type="text"
                     placeholder="Enter country code"
                     value={country}
                     onChange={(e) => setCountry(e.target.value)}
                 />
                 <input
                     type="date"
                     value={date}
                     onChange={(e) => setDate(e.target.value)}
                 />
                 <button onClick={getData}>Fetch Data</button>
             </div>
 
             {loading ? (
                 <p>Loading...</p>
             ) : (
                 data && data.map((item, index) => (
                     <div key={index}>
                         <h3><strong>Name:</strong> {item.name}</h3>
                         <p><strong>Spotify ID:</strong> {item.spotify_id}</p>
                         <p><strong>Artists:</strong> {item.artists}</p>
                     </div>
                 ))
             )}
         </div>
     );
 }