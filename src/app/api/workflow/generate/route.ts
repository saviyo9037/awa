import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      prompt,
      image_size = "square_hd",
      seed = Math.floor(Math.random() * 99999999),
    } = body;

    if (!prompt) {
      return NextResponse.json(
        { success: false, error: "prompt is required" },
        { status: 400 }
      );
    }

    // Resolve dimensions based on requested size
    let width = 1024;
    let height = 1024;
    if (image_size === "landscape_16_9") { width = 1344; height = 768; }
    if (image_size === "portrait_9_16") { width = 768; height = 1344; }

    const startTime = Date.now();

    // ── Call Pollinations.ai (100% Free, No API Key needed!) ─────────────
    // Pollinations generates the image on the fly using standard AI models (SDXL/Flux).
    // The URL itself is the image. We add a random seed to ensure a fresh image each time.
    // Add cb (cache buster) to bypass any poisoned 0-byte caches on Cloudflare from earlier tests
    const encodedPrompt = encodeURIComponent(prompt);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&seed=${seed}&nologo=true&cb=${Date.now()}`;
    
    // We MUST use GET (not HEAD) to generate the image, otherwise Pollinations caches 0 bytes!
    // This blocks the backend until the image is generated, so the UI loading spinner stays visible.
    // We don't need to read the body, just waiting for the response headers is enough to trigger generation.
    await fetch(imageUrl);
    const elapsed = Date.now() - startTime;

    // Pass the Pollinations URL through our local proxy to avoid browser AdBlock/Shield blocks
    const proxiedUrl = `/api/workflow/proxy?url=${encodeURIComponent(imageUrl)}`;

    return NextResponse.json({
      success: true,
      data: {
        images: [{ url: proxiedUrl, width, height, content_type: "image/jpeg" }],
        seed,
        model: "Pollinations.ai",
        inference_time_ms: elapsed,
        prompt_used: prompt,
      },
    });
  } catch (error: unknown) {
    console.error("[Workflow Generate Error]", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate image from free provider",
      },
      { status: 500 }
    );
  }
}
