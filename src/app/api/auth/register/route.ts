import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getDb } from "@/lib/mongodb";
import { hashPassword, createToken } from "@/lib/auth-helpers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, role, phone, business_name } = body;

    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { error: "Missing required fields: email, password, name, role" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const existing = await db.collection("users").findOne({ email });
    if (existing) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const user = {
      id: crypto.randomUUID(),
      email,
      password_hash: hashPassword(password),
      name,
      role,
      phone: phone || "",
      business_name: business_name || "",
      status: "active",
      watchlist: [],
      created_at: now,
      updated_at: now,
    };

    await db.collection("users").insertOne(user);

    const token = createToken(user.id, user.role);

    const { password_hash, _id, ...safeUser } = user as any;

    return NextResponse.json({ token, user: safeUser }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
