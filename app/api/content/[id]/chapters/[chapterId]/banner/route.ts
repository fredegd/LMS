import { NextRequest, NextResponse } from "next/server";
import { updateChapterBanner } from "../../../../../../_services/mutations";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string, chapterId: string }> }) {
  const { id: parentId, chapterId } = await params;
  try {
    const body = await request.json();
    const { assetId } = body;

    if (!assetId) {
      return NextResponse.json({ error: "assetId is required." }, { status: 400 });
    }

    const result = await updateChapterBanner(parentId, chapterId, assetId);
    return NextResponse.json(result);
  } catch (error) {
    console.error(`POST chapter ${chapterId} banner failed:`, error);
    return NextResponse.json({ error: "Failed to update chapter banner." }, { status: 500 });
  }
}
