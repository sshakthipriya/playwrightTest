import { NextRequest, NextResponse } from "next/server";
import { BRANDS } from "@/lib/constants";

export async function GET(_request: NextRequest) {
  return NextResponse.json(BRANDS);
}
