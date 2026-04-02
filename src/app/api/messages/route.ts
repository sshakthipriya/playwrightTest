import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
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

    const messages = await db
      .collection("messages")
      .find(
        { $or: [{ sender_id: userId }, { recipient_id: userId }] },
        { projection: { _id: 0 } }
      )
      .sort({ created_at: -1 })
      .toArray();

    return NextResponse.json(messages);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const db = await getDb();
    const body = await request.json();
    const now = new Date().toISOString();

    const message = {
      id: crypto.randomUUID(),
      sender_id: (user as any).id,
      sender_name: (user as any).name,
      recipient_id: body.recipient_id,
      listing_id: body.listing_id || null,
      subject: body.subject || "",
      body: body.body,
      read: false,
      created_at: now,
    };

    await db.collection("messages").insertOne(message);

    const { _id, ...safeMessage } = message as any;
    return NextResponse.json(safeMessage, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
