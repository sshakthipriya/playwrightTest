import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getDb } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth-helpers";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ lotId: string }> }
) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { lotId } = await params;
    const db = await getDb();
    const { amount } = await request.json();

    const lot = await db.collection("lots").findOne({ id: lotId });
    if (!lot) {
      return NextResponse.json({ error: "Lot not found" }, { status: 404 });
    }

    if (lot.status !== "active" && lot.status !== "soft_close") {
      return NextResponse.json(
        { error: "Lot is not open for bidding" },
        { status: 400 }
      );
    }

    if (lot.seller_id === (user as any).id) {
      return NextResponse.json(
        { error: "Cannot bid on your own lot" },
        { status: 400 }
      );
    }

    const highestBid = await db
      .collection("bids")
      .find({ lot_id: lotId })
      .sort({ amount: -1 })
      .limit(1)
      .toArray();

    const currentHighest = highestBid.length > 0 ? highestBid[0].amount : 0;
    const minBid = currentHighest > 0
      ? currentHighest + (lot.bid_increment || 100)
      : lot.starting_bid || 0;

    if (amount < minBid) {
      return NextResponse.json(
        { error: `Bid must be at least ${minBid}` },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const bid = {
      id: crypto.randomUUID(),
      lot_id: lotId,
      bidder_id: (user as any).id,
      bidder_name: (user as any).name,
      amount,
      placed_at: now,
    };

    await db.collection("bids").insertOne(bid);

    // Handle soft-close extension: if bid placed within 5 minutes of close, extend by 5 minutes
    if (lot.close_at) {
      const closeTime = new Date(lot.close_at).getTime();
      const nowTime = new Date(now).getTime();
      const fiveMinutes = 5 * 60 * 1000;

      if (closeTime - nowTime < fiveMinutes) {
        const newCloseAt = new Date(nowTime + fiveMinutes).toISOString();
        await db.collection("lots").updateOne(
          { id: lotId },
          { $set: { close_at: newCloseAt, status: "soft_close" } }
        );
      }
    }

    // Update lot current bid
    await db.collection("lots").updateOne(
      { id: lotId },
      { $set: { current_bid: amount, bid_count: (lot.bid_count || 0) + 1 } }
    );

    // Create notification for previous high bidder
    if (highestBid.length > 0 && highestBid[0].bidder_id !== (user as any).id) {
      await db.collection("notifications").insertOne({
        id: crypto.randomUUID(),
        user_id: highestBid[0].bidder_id,
        type: "outbid",
        title: "You have been outbid",
        message: `Someone placed a higher bid of $${amount} on lot ${lot.title || lotId}`,
        lot_id: lotId,
        read: false,
        created_at: now,
      });
    }

    // Notify seller of new bid
    if (lot.seller_id) {
      await db.collection("notifications").insertOne({
        id: crypto.randomUUID(),
        user_id: lot.seller_id,
        type: "new_bid",
        title: "New bid on your lot",
        message: `A bid of $${amount} was placed on ${lot.title || lotId}`,
        lot_id: lotId,
        read: false,
        created_at: now,
      });
    }

    const { _id, ...safeBid } = bid as any;
    return NextResponse.json(safeBid, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
