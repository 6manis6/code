import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Contact from "@/models/Contact";

export async function GET() {
  try {
    await dbConnect();
    const messages = await Contact.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: messages });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch messages" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 },
      );
    }

    // Save to MongoDB only
    const contact = await Contact.create({ name, email, message });

    return NextResponse.json({ success: true, data: contact }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to save message" },
      { status: 500 },
    );
  }
}
