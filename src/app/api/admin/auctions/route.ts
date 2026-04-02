import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getDb } from "@/lib/mongodb";

export async function POST(request: NextRequest) {
  try {
    const db = await getDb();
    const body = await request.json();
    const now = new Date().toISOString();

    const auction = {
      id: crypto.randomUUID(),
      status: "scheduled",
      created_at: now,
      updated_at: now,
      ...body,
    };

    await db.collection("auctions").insertOne(auction);

    const { _id, ...safeAuction } = auction as any;
    return NextResponse.json(safeAuction, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
