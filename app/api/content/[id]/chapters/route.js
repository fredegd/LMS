import { NextResponse } from "next/server";
import { createChapter } from "../../../../_services/mutations";

export async function POST(request, { params }) {
  try {
    const { id: parentId } = await params;
    const body = await request.json();
    const { title, chapterDescription, chapterSnippet } = body;

    if (!title?.trim()) {
      return NextResponse.json({ error: "Chapter title is required." }, { status: 400 });
    }

    const result = await createChapter(parentId, {
      title: title.trim(),
      chapterDescription: chapterDescription || "",
      chapterSnippet: chapterSnippet || "",
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("POST /api/content/[id]/chapters failed:", error);
    return NextResponse.json({ error: "Failed to create chapter." }, { status: 500 });
  }
}
