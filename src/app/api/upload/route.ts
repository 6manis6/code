import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get("image") as File;

    if (!image) {
      return NextResponse.json(
        { success: false, error: "No image provided" },
        { status: 400 },
      );
    }

    const apiKey = process.env.IMGBB_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "ImgBB API key not configured" },
        { status: 500 },
      );
    }

    // Convert File to base64
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString("base64");

    // Upload to ImgBB
    const uploadFormData = new FormData();
    uploadFormData.append("image", base64Image);

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${apiKey}`,
      {
        method: "POST",
        body: uploadFormData,
      },
    );

    const data = await response.json();

    if (!data.success) {
      return NextResponse.json(
        { success: false, error: "Failed to upload image" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        url: data.data.url,
        display_url: data.data.display_url,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to upload image" },
      { status: 500 },
    );
  }
}
