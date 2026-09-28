import ImageKit from "imagekit";

/**
 * Returns an ImageKit instance initialized with credentials from environment variables.
 * Private key is kept strictly on the backend and NEVER exposed to client.
 */
export function getImageKitInstance(): ImageKit | null {
  const publicKey =
    process.env.IMAGEKIT_PUBLIC_KEY || process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  let urlEndpoint =
    process.env.IMAGEKIT_URL_ENDPOINT || process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

  if (urlEndpoint && urlEndpoint.includes("https://")) {
    urlEndpoint = urlEndpoint.replace(/^IMAGEKIT_URL_ENDPOINT=/, "").trim();
  }

  if (!publicKey || !privateKey || !urlEndpoint) {
    return null;
  }

  try {
    return new ImageKit({
      publicKey: publicKey.trim(),
      privateKey: privateKey.trim(),
      urlEndpoint: urlEndpoint.trim(),
    });
  } catch (error) {
    console.error("Error initializing ImageKit instance:", error);
    return null;
  }
}

export function isImageKitConfigured(): boolean {
  const publicKey =
    process.env.IMAGEKIT_PUBLIC_KEY || process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const urlEndpoint =
    process.env.IMAGEKIT_URL_ENDPOINT || process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

  return Boolean(publicKey && privateKey && urlEndpoint);
}
