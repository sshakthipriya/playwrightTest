import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ lotId: string }> }
) {
  try {
    const { lotId } = await params;
    const db = await getDb();

    const lot = await db
      .collection("lots")
      .findOne({ id: lotId }, { projection: { _id: 0 } });

    if (!lot) {
      return NextResponse.json({ error: "Lot not found" }, { status: 404 });
    }

    const bids = await db
      .collection("bids")
      .find({ lot_id: lotId }, { projection: { _id: 0 } })
      .sort({ placed_at: -1 })
      .toArray();

    const current_bid = bids.length > 0
      ? Math.max(...bids.map((b) => b.amount))
      : null;

    const reserve_met = current_bid !== null && lot.reserve_price
      ? current_bid >= lot.reserve_price
      : false;

    const auction = await db
      .collection("auctions")
      .findOne({ id: lot.auction_id }, { projection: { _id: 0 } });

    return NextResponse.json({
      ...lot,
      bids,
      current_bid,
      reserve_met,
      auction,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
