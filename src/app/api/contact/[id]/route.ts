import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Contact from "@/models/Contact";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await dbConnect();

    const contact = await Contact.findByIdAndDelete(params.id);

    if (!contact) {
      return NextResponse.json(
        { success: false, error: "Message not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to delete message" },
      { status: 500 },
    );
  }
}
