import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ notifId: string }> }
) {
  try {
    const { notifId } = await params;
    const db = await getDb();

    const result = await db.collection("notifications").updateOne(
      { id: notifId },
      { $set: { read: true } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Notification not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Notification marked as read" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
