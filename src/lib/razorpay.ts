import Razorpay from "razorpay";
import crypto from "crypto";

export function getRazorpayKeyId(): string {
  return (
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
    process.env.RAZORPAY_KEY_ID ||
    ""
  ).trim();
}

export function getRazorpayKeySecret(): string {
  return (process.env.RAZORPAY_KEY_SECRET || "").trim();
}

export function isRazorpayConfigured(): boolean {
  const keyId = getRazorpayKeyId();
  const keySecret = getRazorpayKeySecret();
  return Boolean(keyId && keySecret);
}

export function getRazorpayInstance(): Razorpay | null {
  const key_id = getRazorpayKeyId();
  const key_secret = getRazorpayKeySecret();

  if (!key_id || !key_secret) {
    return null;
  }

  try {
    return new Razorpay({
      key_id,
      key_secret,
    });
  } catch (error) {
    console.error("Failed to initialize Razorpay SDK:", error);
    return null;
  }
}

/**
 * Validates Razorpay Payment Signature
 * HMAC SHA256 of `${order_id}|${payment_id}` using secret key
 */
export function verifyRazorpaySignature(params: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  const secret = getRazorpayKeySecret();
  if (!secret) return false;

  try {
    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${params.orderId}|${params.paymentId}`)
      .digest("hex");

    return crypto.timingSafeEqual(
      Buffer.from(generatedSignature),
      Buffer.from(params.signature)
    );
  } catch (err) {
    console.error("Error verifying Razorpay signature:", err);
    return false;
  }
}
