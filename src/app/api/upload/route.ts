import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mimeType = file.type || "image/png";

    // 1. ImgBB CDN Desteği (Kalıcı bulut depolama)
    const imgbbKey = process.env.IMGBB_API_KEY;
    if (imgbbKey) {
      try {
        const imgbbForm = new FormData();
        imgbbForm.append("image", buffer.toString("base64"));
        const imgbbRes = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, {
          method: "POST",
          body: imgbbForm,
        });
        const imgbbData = await imgbbRes.json();
        if (imgbbData?.success && imgbbData?.data?.url) {
          return NextResponse.json({ success: true, url: imgbbData.data.url });
        }
      } catch (imgbbErr) {
        console.warn("ImgBB upload failed, falling back to disk:", imgbbErr);
      }
    }

    try {
      // 2. Yerel Disk (Persistent Volume) Depolaması
      const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
      const filename = `media-${uniqueSuffix}-${originalName}`;
      const uploadDir = path.join(process.cwd(), "public", "uploads");

      await mkdir(uploadDir, { recursive: true });
      const filePath = path.join(uploadDir, filename);

      await writeFile(filePath, buffer);

      const publicUrl = `/uploads/${filename}`;
      return NextResponse.json({ success: true, url: publicUrl });
    } catch (fsErr) {
      console.warn("Disk upload failed, using Data URL fallback:", fsErr);
      const base64Url = `data:${mimeType};base64,${buffer.toString("base64")}`;
      return NextResponse.json({ success: true, url: base64Url });
    }
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Dosya yüklenirken hata oluştu" }, { status: 500 });
  }
}
