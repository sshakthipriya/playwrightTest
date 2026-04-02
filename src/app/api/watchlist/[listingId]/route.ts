import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth-helpers";

export async function POST(
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
    const userId = (user as any).id;
    const watchlist: string[] = (user as any).watchlist || [];

    const index = watchlist.indexOf(listingId);
    let action: string;

    if (index > -1) {
      watchlist.splice(index, 1);
      action = "removed";
    } else {
      watchlist.push(listingId);
      action = "added";
    }

    await db.collection("users").updateOne(
      { id: userId },
      { $set: { watchlist } }
    );

    return NextResponse.json({ action, watchlist });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
