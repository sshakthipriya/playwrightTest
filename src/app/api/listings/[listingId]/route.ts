import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth-helpers";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ listingId: string }> }
) {
  try {
    const { listingId } = await params;
    const db = await getDb();

    const listing = await db
      .collection("listings")
      .findOne({ id: listingId }, { projection: { _id: 0 } });

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    await db.collection("listings").updateOne(
      { id: listingId },
      { $inc: { views: 1 } }
    );

    const seller = await db
      .collection("users")
      .findOne(
        { id: listing.seller_id },
        { projection: { _id: 0, password_hash: 0 } }
      );

    return NextResponse.json({ ...listing, views: (listing.views || 0) + 1, seller });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ listingId: string }> }
) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { listingId } = await params;
    const db = await getDb();
    const body = await request.json();

    const listing = await db.collection("listings").findOne({ id: listingId });
    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    if (listing.seller_id !== (user as any).id && (user as any).role !== "admin") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const updates = { ...body, updated_at: new Date().toISOString() };
    delete updates.id;
    delete updates.seller_id;

    await db.collection("listings").updateOne(
      { id: listingId },
      { $set: updates }
    );

    const updated = await db
      .collection("listings")
      .findOne({ id: listingId }, { projection: { _id: 0 } });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ listingId: string }> }
) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { listingId } = await params;
    const db = await getDb();

    const listing = await db.collection("listings").findOne({ id: listingId });
    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    if (listing.seller_id !== (user as any).id && (user as any).role !== "admin") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    await db.collection("listings").deleteOne({ id: listingId });

    return NextResponse.json({ message: "Listing deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
