import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function GET(_request: NextRequest) {
  try {
    const db = await getDb();

    const lots = await db
      .collection("lots")
      .find({ status: "sold" }, { projection: { _id: 0 } })
      .sort({ close_at: -1 })
      .limit(6)
      .toArray();

    return NextResponse.json(lots);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
