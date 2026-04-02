import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { CATEGORIES } from "@/lib/constants";

export async function GET(_request: NextRequest) {
  try {
    const db = await getDb();

    const counts = await db
      .collection("listings")
      .aggregate([
        { $match: { status: "active" } },
        { $group: { _id: "$category", count: { $sum: 1 } } },
      ])
      .toArray();

    const countMap: Record<string, number> = {};
    for (const c of counts) {
      countMap[c._id] = c.count;
    }

    const categories = CATEGORIES.map((cat) => ({
      ...cat,
      count: countMap[cat.id] || 0,
    }));

    return NextResponse.json(categories);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
