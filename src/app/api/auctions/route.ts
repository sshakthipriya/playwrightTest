import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  try {
    const db = await getDb();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const query: any = {};
    if (status) query.status = status;

    const auctions = await db
      .collection("auctions")
      .find(query, { projection: { _id: 0 } })
      .sort({ start_date: -1 })
      .toArray();

    const enriched = await Promise.all(
      auctions.map(async (auction) => {
        const lots = await db
          .collection("lots")
          .find({ auction_id: auction.id })
          .toArray();

        const lotIds = lots.map((l) => l.id);
        const totalBids = lotIds.length > 0
          ? await db.collection("bids").countDocuments({ lot_id: { $in: lotIds } })
          : 0;

        return {
          ...auction,
          lot_count: lots.length,
          total_bids: totalBids,
        };
      })
    );

    return NextResponse.json(enriched);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
