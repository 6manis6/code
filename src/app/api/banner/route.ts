import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Banner from "@/models/Banner";

const DEFAULT_SLIDE = {
  imageUrl: "",
  badgeText: "LIVE NEWS",
  title: "BREAKING:",
  titleHighlight: "JOURNAL WITH WITCH",
  subtitle: "New Episodes Airing Now! Score: 8.64/10",
  buttonText: "WATCH TRAILER",
  buttonLink: "#",
};

// GET — return the banner config.
// Handles migration from the old single-field format automatically.
export async function GET() {
  try {
    await dbConnect();

    // Use lean() to get a plain JS object so we can inspect all stored fields
    // regardless of the current Mongoose schema.
    const raw = await Banner.findOne().lean<Record<string, unknown>>();

    if (!raw) {
      // First ever run — seed a default slide
      const created = await Banner.create({
        slides: [DEFAULT_SLIDE],
        intervalMs: 5000,
      });
      return NextResponse.json({ success: true, data: created });
    }

    // If the stored document is in the OLD single-banner format
    // (has top-level imageUrl/badgeText but no slides array), migrate it.
    const hasSlides =
      Array.isArray(raw.slides) && (raw.slides as unknown[]).length > 0;

    if (!hasSlides) {
      // Build a slide from whatever legacy fields exist, then overwrite the doc.
      const migratedSlide = {
        imageUrl: (raw.imageUrl as string) || "",
        badgeText: (raw.badgeText as string) || DEFAULT_SLIDE.badgeText,
        title: (raw.title as string) || DEFAULT_SLIDE.title,
        titleHighlight:
          (raw.titleHighlight as string) || DEFAULT_SLIDE.titleHighlight,
        subtitle: (raw.subtitle as string) || DEFAULT_SLIDE.subtitle,
        buttonText: (raw.buttonText as string) || DEFAULT_SLIDE.buttonText,
        buttonLink: (raw.buttonLink as string) || DEFAULT_SLIDE.buttonLink,
      };

      const migrated = await Banner.findOneAndUpdate(
        {},
        { $set: { slides: [migratedSlide], intervalMs: 5000 } },
        { new: true },
      );
      return NextResponse.json({ success: true, data: migrated });
    }

    return NextResponse.json({ success: true, data: raw });
  } catch (error) {
    console.error("[Banner GET]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch banner" },
      { status: 500 },
    );
  }
}

// PUT — save the full banner config (slides + intervalMs).
// Uses replaceOne so the entire slides array is always overwritten cleanly.
export async function PUT(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { slides, intervalMs } = body as {
      slides: unknown[];
      intervalMs: number;
    };

    // Use the raw MongoDB collection to avoid any Mongoose strict-mode
    // field-filtering that could silently drop the slides array.
    const result = await Banner.collection.findOneAndUpdate(
      {},
      { $set: { slides, intervalMs, updatedAt: new Date() } },
      { upsert: true, returnDocument: "after" },
    );

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("[Banner PUT]", error);
    return NextResponse.json(
      { success: false, error: "Failed to update banner" },
      { status: 500 },
    );
  }
}
