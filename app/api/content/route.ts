console.log("DEBUG: Loading /api/content/route.ts");
import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { getList } from "@/app/_services/index";
import { createSnippetCollection } from "@/app/_services/mutations";

export async function GET(request: NextRequest) {
  try {
    const search = request.nextUrl.searchParams.get("search") || "";
    const data = await getList(search);
    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/content failed:", error);
    return NextResponse.json({ error: "Failed to load content." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  console.log("DEBUG: POST /api/content received");
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
      level: level || "",
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/content failed:", error);
    // Extract the specific error message from Hygraph response if available
    const hygraphError = error.response?.errors?.[0]?.message || error.message;
    return NextResponse.json({ error: hygraphError || "Failed to create item." }, { status: 500 });
  }
}

