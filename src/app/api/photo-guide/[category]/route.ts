import { NextRequest, NextResponse } from "next/server";
import { PHOTO_GUIDES } from "@/lib/constants";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: string }> }
) {
  const { category } = await params;
  const guide = PHOTO_GUIDES[category];

  if (!guide) {
    return NextResponse.json(
      { error: `No photo guide found for category: ${category}` },
      { status: 404 }
    );
  }

  return NextResponse.json(guide);
}
