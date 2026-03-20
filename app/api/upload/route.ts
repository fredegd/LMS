import { NextRequest, NextResponse } from "next/server";
import { uploadAsset, publishAsset } from "../../_services/mutations";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type "${file.type}". Allowed: ${ALLOWED_TYPES.join(", ")}` },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Max 10 MB.` },
        { status: 400 },
      );
    }

    // Forward to Hygraph via 2-step S3 upload
    const asset = await uploadAsset(file);

    // Publish the asset so its URL is accessible
    const published = await publishAsset(asset.id);

    return NextResponse.json({ id: published.id, url: published.url }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/upload failed:", error);
    return NextResponse.json({ error: error.message || "Failed to upload file." }, { status: 500 });
  }
}
