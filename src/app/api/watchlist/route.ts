import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth-helpers";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const db = await getDb();
    const watchlist: string[] = (user as any).watchlist || [];

    if (watchlist.length === 0) {
      return NextResponse.json([]);
    }

    const listings = await db
      .collection("listings")
      .find({ id: { $in: watchlist } }, { projection: { _id: 0 } })
      .toArray();

    return NextResponse.json(listings);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
