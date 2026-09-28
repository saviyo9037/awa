import { NextResponse } from "next/server";
import { getImageKitInstance, isImageKitConfigured } from "@/lib/imagekit";

export async function GET() {
  try {
    if (!isImageKitConfigured()) {
      return NextResponse.json(
        {
          success: false,
          configured: false,
          error: "ImageKit environment variables (IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, IMAGEKIT_URL_ENDPOINT) are not set.",
        },
        { status: 503 }
      );
    }

    const ik = getImageKitInstance();
    if (!ik) {
      return NextResponse.json(
        {
          success: false,
          configured: false,
          error: "Failed to initialize ImageKit SDK on backend.",
        },
        { status: 500 }
      );
    }

    const publicKey =
      process.env.IMAGEKIT_PUBLIC_KEY || process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "";
    let urlEndpoint =
      process.env.IMAGEKIT_URL_ENDPOINT || process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "";
    if (urlEndpoint.includes("https://")) {
      urlEndpoint = urlEndpoint.replace(/^IMAGEKIT_URL_ENDPOINT=/, "").trim();
    }

    // Generate secure HMAC authentication token, expire timestamp, and signature
    // The privateKey is strictly used on server and NEVER exposed in this response
    const authParams = ik.getAuthenticationParameters();

    return NextResponse.json({
      success: true,
      configured: true,
      publicKey: publicKey.trim(),
      urlEndpoint: urlEndpoint.trim(),
      token: authParams.token,
      expire: authParams.expire,
      signature: authParams.signature,
    });
  } catch (error: any) {
    console.error("ImageKit auth endpoint error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Internal server error generating ImageKit auth parameters.",
      },
      { status: 500 }
    );
  }
}
