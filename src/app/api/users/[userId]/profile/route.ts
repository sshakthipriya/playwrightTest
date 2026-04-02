import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const db = await getDb();

    const user = await db
      .collection("users")
      .findOne({ id: userId }, { projection: { _id: 0, password_hash: 0 } });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const listings = await db
      .collection("listings")
      .find({ seller_id: userId, status: "active" }, { projection: { _id: 0 } })
      .toArray();

    return NextResponse.json({
      ...user,
      listings,
      listing_count: listings.length,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
