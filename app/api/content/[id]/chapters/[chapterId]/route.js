import { NextResponse } from "next/server";
import {
  updateChapter,
  deleteChapter,
} from "../../../../../_services/mutations";

export async function PUT(request, { params }) {
  const { id: parentId, chapterId } = await params;
  try {
    const body = await request.json();
    const { title, chapterDescription, chapterSnippet } = body;

    if (!title?.trim()) {
      return NextResponse.json({ error: "Chapter title is required." }, { status: 400 });
    }

    const result = await updateChapter(parentId, chapterId, {
      title: title.trim(),
      chapterDescription: chapterDescription || "",
      chapterSnippet: chapterSnippet || "",
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error(`PUT chapter ${chapterId} failed:`, error);
    return NextResponse.json({ error: "Failed to update chapter." }, { status: 500 });
  }
}

export async function DELETE(_request, { params }) {
  const { id: parentId, chapterId } = await params;
  try {
    const result = await deleteChapter(parentId, chapterId);
    return NextResponse.json(result);
  } catch (error) {
    console.error(`DELETE chapter ${chapterId} failed:`, error);
    return NextResponse.json({ error: "Failed to delete chapter." }, { status: 500 });
  }
}
