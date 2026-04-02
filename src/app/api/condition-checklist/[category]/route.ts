import { NextRequest, NextResponse } from "next/server";
import { CONDITION_CHECKLISTS } from "@/lib/constants";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: string }> }
) {
  const { category } = await params;
  const checklist = CONDITION_CHECKLISTS[category];

  if (!checklist) {
    return NextResponse.json(
      { error: `No checklist found for category: ${category}` },
      { status: 404 }
    );
  }

  return NextResponse.json(checklist);
}
