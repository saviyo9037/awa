import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { basePrompt, tweak, aspectRatio, stylize } = body;

    if (!basePrompt || !tweak) {
      return NextResponse.json(
        { success: false, error: "basePrompt and tweak are required" },
        { status: 400 }
      );
    }

    // Algorithmic intelligent prompt enhancement
    const arFlag = aspectRatio ? ` --ar ${aspectRatio}` : " --ar 16:9";
    const sFlag = stylize ? ` --s ${stylize}` : " --s 250";

    const cleanBase = basePrompt
      .replace(/--ar\s+\d+:\d+/g, "")
      .replace(/--s\s+\d+/g, "")
      .replace(/--style\s+\w+/g, "")
      .trim();

    const enhancedPrompt = `${cleanBase}, customized with ${tweak.trim()}, cinematic composition, 8k resolution, photorealistic finish${arFlag}${sFlag} --style raw`;

    return NextResponse.json({
      success: true,
      data: {
        originalPrompt: basePrompt,
        customizedPrompt: enhancedPrompt,
        tweakApplied: tweak,
        estimatedTokens: Math.ceil(enhancedPrompt.length / 4),
      },
    });
  } catch (error) {
    console.error("Mutation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to mutate prompt" },
      { status: 500 }
    );
  }
}
