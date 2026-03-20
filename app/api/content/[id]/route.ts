import { NextRequest, NextResponse } from "next/server";
import { getItemById } from "../../../_services/index";
import {
  updateSnippetCollection,
  deleteSnippetCollection,
} from "../../../_services/mutations";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const data = await getItemById(id);
    if (!data?.snippetCollection) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error(`GET /api/content/${id} failed:`, error);
    return NextResponse.json({ error: "Failed to load item." }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await request.json();
    const { title, description, tags, level } = body;

    if (!title?.trim()) {
      return NextResponse.json({ error: "Title is required." }, { status: 400 });
    }

    const result = await updateSnippetCollection(id, {
      title: title.trim(),
      description: description?.trim() || "",
      tags: Array.isArray(tags) ? tags : [],
      level: level || undefined,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error(`PUT /api/content/${id} failed:`, error);
    return NextResponse.json({ error: "Failed to update item." }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const result = await deleteSnippetCollection(id);
    return NextResponse.json(result);
  } catch (error) {
    console.error(`DELETE /api/content/${id} failed:`, error);
    return NextResponse.json({ error: "Failed to delete item." }, { status: 500 });
  }
}
