import { NextRequest, NextResponse } from "next/server";
import { getList } from "../../_services/index";
import { createSnippetCollection } from "../../_services/mutations";

export async function GET() {
  try {
    const data = await getList();
    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/content failed:", error);
    return NextResponse.json({ error: "Failed to load content." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, tags, level } = body;

    if (!title?.trim()) {
      return NextResponse.json({ error: "Title is required." }, { status: 400 });
    }

    const result = await createSnippetCollection({
      title: title.trim(),
      description: description?.trim() || "",
      tags: Array.isArray(tags) ? tags : [],
      level: level || undefined,
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("POST /api/content failed:", error);
    return NextResponse.json({ error: "Failed to create item." }, { status: 500 });
  }
}
