import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function GET(_request: NextRequest) {
  try {
    const db = await getDb();

    const [
      total_users,
      active_listings,
      pending_listings,
      total_listings,
      active_auctions,
      total_auctions,
      total_bids,
      total_lots,
    ] = await Promise.all([
      db.collection("users").countDocuments(),
      db.collection("listings").countDocuments({ status: "active" }),
      db.collection("listings").countDocuments({ status: "pending" }),
      db.collection("listings").countDocuments(),
      db.collection("auctions").countDocuments({ status: "active" }),
      db.collection("auctions").countDocuments(),
      db.collection("bids").countDocuments(),
      db.collection("lots").countDocuments(),
    ]);

    const sellers = await db.collection("users").countDocuments({ role: "seller" });
    const buyers = await db.collection("users").countDocuments({ role: "buyer" });

    const monthly_revenue = [
      { month: "Jan", revenue: 45000 },
      { month: "Feb", revenue: 52000 },
      { month: "Mar", revenue: 61000 },
      { month: "Apr", revenue: 58000 },
      { month: "May", revenue: 72000 },
      { month: "Jun", revenue: 85000 },
      { month: "Jul", revenue: 78000 },
      { month: "Aug", revenue: 92000 },
      { month: "Sep", revenue: 88000 },
      { month: "Oct", revenue: 95000 },
      { month: "Nov", revenue: 102000 },
      { month: "Dec", revenue: 119500 },
    ];

    const listings_by_category = await db
      .collection("listings")
      .aggregate([
        { $match: { status: "active" } },
        { $group: { _id: "$category", count: { $sum: 1 } } },
      ])
      .toArray();

    return NextResponse.json({
      total_users,
      sellers,
      buyers,
      active_listings,
      pending_listings,
      total_listings,
      active_auctions,
      total_auctions,
      total_bids,
      total_lots,
      gmv: 847500,
      monthly_revenue,
      listings_by_category: listings_by_category.map((c) => ({
        category: c._id,
        count: c.count,
      })),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
