import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    // TODO: Forward the payload to the Python backend once the endpoint is ready.
    return NextResponse.json({ message: "Chat endpoint not yet implemented", payload });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
