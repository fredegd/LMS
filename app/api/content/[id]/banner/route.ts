import { NextRequest, NextResponse } from "next/server";
import { updateSnippetCollectionBanner } from "../../../../_services/mutations";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await request.json();
    const { assetId } = body;

    if (!assetId) {
      return NextResponse.json({ error: "assetId is required." }, { status: 400 });
    }

    const result = await updateSnippetCollectionBanner(id, assetId);
    return NextResponse.json(result);
  } catch (error) {
    console.error(`POST /api/content/${id}/banner failed:`, error);
    return NextResponse.json({ error: "Failed to update banner." }, { status: 500 });
  }
}
