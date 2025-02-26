'use client'

import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'

export default function Page() {
  const [notes, setNotes] = useState<any[] | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const getData = async () => {
      const { data, error } = await supabase.from('Spotivis').select("spotify_id, artists").limit(10)
      if (error) {
        console.error("Error fetching data:", error.message)
      } else {
        setNotes(data)
      }
    }
    getData()
  }, [])

  return <pre>{JSON.stringify(notes, null, 2)}</pre>
}
