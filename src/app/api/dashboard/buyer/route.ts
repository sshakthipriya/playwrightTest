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
    const watchlist: string[] = (user as any).watchlist || [];

    const bids = await db
      .collection("bids")
      .find({ bidder_id: userId }, { projection: { _id: 0 } })
      .sort({ placed_at: -1 })
      .toArray();

    const uniqueLotIds = [...new Set(bids.map((b) => b.lot_id))];

    const activeBids: any[] = [];
    const wonLots: any[] = [];

    for (const lotId of uniqueLotIds) {
      const lot = await db.collection("lots").findOne({ id: lotId }, { projection: { _id: 0 } });
      if (!lot) continue;

      const highestBid = await db
        .collection("bids")
        .find({ lot_id: lotId })
        .sort({ amount: -1 })
        .limit(1)
        .toArray();

      const isHighest = highestBid.length > 0 && highestBid[0].bidder_id === userId;

      if (lot.status === "active" || lot.status === "soft_close") {
        activeBids.push({ ...lot, is_highest_bidder: isHighest });
      }
      if (lot.status === "sold" && isHighest) {
        wonLots.push(lot);
      }
    }

    const watchedListings = watchlist.length > 0
      ? await db
          .collection("listings")
          .find({ id: { $in: watchlist } }, { projection: { _id: 0 } })
          .toArray()
      : [];

    const notifications = await db
      .collection("notifications")
      .find({ user_id: userId, read: false }, { projection: { _id: 0 } })
      .sort({ created_at: -1 })
      .limit(10)
      .toArray();

    return NextResponse.json({
      total_bids: bids.length,
      active_bids: activeBids.length,
      won_lots: wonLots.length,
      watchlist_count: watchlist.length,
      recent_bids: bids.slice(0, 10),
      active_bid_lots: activeBids,
      won_lot_items: wonLots,
      watched_listings: watchedListings,
      unread_notifications: notifications,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
