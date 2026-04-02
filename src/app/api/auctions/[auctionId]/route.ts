import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ auctionId: string }> }
) {
  try {
    const { auctionId } = await params;
    const db = await getDb();

    const auction = await db
      .collection("auctions")
      .findOne({ id: auctionId }, { projection: { _id: 0 } });

    if (!auction) {
      return NextResponse.json({ error: "Auction not found" }, { status: 404 });
    }

    const lots = await db
      .collection("lots")
      .find({ auction_id: auctionId }, { projection: { _id: 0 } })
      .toArray();

    const enrichedLots = await Promise.all(
      lots.map(async (lot) => {
        const bids = await db
          .collection("bids")
          .find({ lot_id: lot.id })
          .sort({ amount: -1 })
          .toArray();

        return {
          ...lot,
          bid_count: bids.length,
          current_bid: bids.length > 0 ? bids[0].amount : null,
        };
      })
    );

    return NextResponse.json({ ...auction, lots: enrichedLots });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
