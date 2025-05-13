import { NextResponse } from "next/server";

// Health check endpoint to verify API connectivity
export async function GET() {
  try {
    // Attempt to check backend health
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    let backendStatus = "unknown";
    let backendMessage = "Could not connect to backend";

    try {
      const response = await fetch(`${backendUrl}/health`, {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store",
      });

      if (response.ok) {
        const data = await response.json();
        backendStatus = "connected";
        backendMessage = data.message || "Backend is healthy";
      } else {
        backendStatus = "error";
        backendMessage = `Backend returned status ${response.status}`;
      }
    } catch (error: any) {
      backendStatus = "unreachable";
      backendMessage = error.message || "Failed to connect to backend";
    }

    return NextResponse.json(
      {
        status: "healthy",
        message: "API is operational",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || "development",
        backend: {
          status: backendStatus,
          message: backendMessage,
          url: backendUrl,
        },
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Health check error:", error);
    return NextResponse.json(
      {
        status: "unhealthy",
        message: error.message || "Internal server error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
