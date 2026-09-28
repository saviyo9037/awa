import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { getImageKitInstance } from "@/lib/imagekit";

export async function GET() {
  try {
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const files = fs.readdirSync(uploadsDir);
    const mediaList = files.map((file) => {
      const filePath = path.join(uploadsDir, file);
      const stat = fs.statSync(filePath);
      return {
        id: file,
        name: file,
        url: `/uploads/${file}`,
        size: stat.size,
        createdAt: stat.birthtime || stat.mtime,
      };
    });

    // Also include core public assets
    const publicDir = path.join(process.cwd(), "public");
    const coreAssets = ["cyber_dashboard.jpg", "cyber_portrait.jpg", "holographic_3d.jpg"];
    coreAssets.forEach((file) => {
      const filePath = path.join(publicDir, file);
      if (fs.existsSync(filePath)) {
        const stat = fs.statSync(filePath);
        mediaList.unshift({
          id: file,
          name: file,
          url: `/${file}`,
          size: stat.size,
          createdAt: stat.mtime,
        });
      }
    });

    return NextResponse.json({ success: true, data: mediaList });
  } catch (error) {
    console.error("List media error:", error);
    return NextResponse.json({ success: false, error: "Failed to list media assets" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Clean filename
    const ext = path.extname(file.name) || ".jpg";
    const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
    const uniqueFileName = `${baseName}_${Date.now()}${ext}`;

    // 1. Try ImageKit backend upload if configured
    const ik = getImageKitInstance();
    if (ik) {
      try {
        const ikRes = await ik.upload({
          file: buffer,
          fileName: uniqueFileName,
          folder: "/blueprints",
          useUniqueFileName: true,
        });

        if (ikRes && ikRes.url) {
          return NextResponse.json({
            success: true,
            provider: "imagekit",
            url: ikRes.url,
            fileName: ikRes.name || uniqueFileName,
            fileId: ikRes.fileId,
            size: buffer.length,
            message: "Image uploaded to ImageKit CDN successfully!",
          });
        }
      } catch (ikErr: any) {
        console.warn("ImageKit backend upload failed, falling back to local file storage:", ikErr?.message || ikErr);
      }
    }

    // 2. Local fallback storage (/public/uploads)
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, uniqueFileName);
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${uniqueFileName}`;

    return NextResponse.json({
      success: true,
      provider: "local",
      url: publicUrl,
      fileName: uniqueFileName,
      size: buffer.length,
      message: "Image uploaded successfully!",
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ success: false, error: "Failed to upload image" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get("file");

    if (!fileName) {
      return NextResponse.json({ success: false, error: "No file specified" }, { status: 400 });
    }

    // Security check: prevent directory traversal
    const safeName = path.basename(fileName);
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    const filePath = path.join(uploadsDir, safeName);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return NextResponse.json({ success: true, message: `File "${safeName}" deleted.` });
    }

    return NextResponse.json({ success: false, error: "File not found" }, { status: 404 });
  } catch (error) {
    console.error("Delete media error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete media file" }, { status: 500 });
  }
}

