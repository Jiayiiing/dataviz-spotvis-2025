// app/api/rankings-dates/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client";

export async function GET(req: NextRequest) {
  const supabase = createClient();

  // Fetch min and max snapshot_date from the Rankings table
  const { data: minData, error: minError } = await supabase
    .from("Rankings")
    .select("snapshot_date")
    .order("snapshot_date", { ascending: true })
    .limit(1);

  const { data: maxData, error: maxError } = await supabase
    .from("Rankings")
    .select("snapshot_date")
    .order("snapshot_date", { ascending: false })
    .limit(1);

  if (minError || maxError) {
    return NextResponse.json({ error: minError?.message || maxError?.message }, { status: 500 });
  }

  const minDate = minData?.[0]?.snapshot_date;
  const maxDate = maxData?.[0]?.snapshot_date;

  if (!minDate || !maxDate) {
    return NextResponse.json({ error: "Could not fetch min/max dates" }, { status: 400 });
  }

  return NextResponse.json({ minDate, maxDate });
}
