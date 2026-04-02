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
    const userId = (user as any).id;

    const [
      active_listings,
      pending_listings,
      sold_listings,
      total_listings,
    ] = await Promise.all([
      db.collection("listings").countDocuments({ seller_id: userId, status: "active" }),
      db.collection("listings").countDocuments({ seller_id: userId, status: "pending" }),
      db.collection("listings").countDocuments({ seller_id: userId, status: "sold" }),
      db.collection("listings").countDocuments({ seller_id: userId }),
    ]);

    const listings = await db
      .collection("listings")
      .find({ seller_id: userId }, { projection: { _id: 0 } })
      .sort({ created_at: -1 })
      .limit(10)
      .toArray();

    const totalViews = listings.reduce((sum, l) => sum + (l.views || 0), 0);

    const lots = await db
      .collection("lots")
      .find({ seller_id: userId })
      .toArray();
    const lotIds = lots.map((l) => l.id);

    const bids = lotIds.length > 0
      ? await db.collection("bids").find({ lot_id: { $in: lotIds } }).toArray()
      : [];

    const totalBidValue = bids.reduce((sum, b) => sum + (b.amount || 0), 0);

    return NextResponse.json({
      active_listings,
      pending_listings,
      sold_listings,
      total_listings,
      total_views: totalViews,
      total_bids: bids.length,
      total_bid_value: totalBidValue,
      recent_listings: listings,
      active_lots: lots.filter((l) => l.status === "active").length,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
