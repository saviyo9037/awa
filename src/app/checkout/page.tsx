"use client";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

function CheckoutForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") || "yearly";
  const { user, refreshUser, isLoggedIn } = useAuth();
  
  const [email, setEmail] = useState(user?.email || "");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi">("card");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user?.email && !email) {
      setEmail(user.email);
    }
  }, [user, email]);

  const price = plan === "lifetime" ? "₹999" : "₹199";
  const planName = plan === "lifetime" ? "AWA Pro (Lifetime)" : "AWA Pro (Yearly)";

  // Dynamically load Razorpay standard checkout script
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window === "undefined") return resolve(false);
      if ((window as any).Razorpay) return resolve(true);

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsProcessing(true);

    const userEmail = email.trim() || user?.email || "subscriber@awa.ai";

    try {
      // 1. Create order on backend via Razorpay SDK
      const orderRes = await fetch("/api/payments/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          email: userEmail,
        }),
      });

      const orderData = await orderRes.json();

      // If Razorpay keys are configured, launch official Razorpay Checkout popup
      if (orderRes.ok && orderData.success && orderData.orderId && orderData.keyId) {
        const loaded = await loadRazorpayScript();
        if (!loaded) {
          throw new Error("Unable to load Razorpay payment gateway script. Please check your internet connection.");
        }

        const options = {
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency || "INR",
          name: "AWA.AI",
          description: planName,
          image: "/cyber_dashboard.jpg",
          order_id: orderData.orderId,
          prefill: {
            email: userEmail,
          },
          theme: {
            color: "#6366f1",
          },
          handler: async function (response: any) {
            setIsProcessing(true);
            try {
              // 2. Cryptographically verify signature on backend
              const verifyRes = await fetch("/api/payments/razorpay/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  email: userEmail,
                  plan,
                }),
              });

              const verifyData = await verifyRes.json();
              if (verifyRes.ok && verifyData.success) {
                localStorage.setItem("awa_is_pro", "true");
                await refreshUser();
                router.push("/success");
              } else {
                setErrorMessage(verifyData.error || "Payment verification failed.");
                setIsProcessing(false);
              }
            } catch (vErr: any) {
              setErrorMessage("Error verifying payment signature: " + vErr.message);
              setIsProcessing(false);
            }
          },
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
            },
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on("payment.failed", function (resp: any) {
          setErrorMessage(resp.error?.description || "Payment failed or cancelled.");
          setIsProcessing(false);
        });
        rzp.open();
        return;
      }

      // If Razorpay is not configured or in sandbox fallback mode
      if (!orderData.configured) {
        setErrorMessage(
          orderData.error || "Razorpay API keys not yet configured in .env.local. Please provide RAZORPAY_KEY_ID & RAZORPAY_KEY_SECRET."
        );
        setIsProcessing(false);
        return;
      }

      throw new Error(orderData.error || "Failed to initiate Razorpay order.");
    } catch (err: any) {
      console.error("Payment initiation error:", err);
      setErrorMessage(err.message || "An unexpected error occurred during checkout.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-[5%] py-[40px] max-w-[1200px] animate-[fadeIn_0.5s_ease-out] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Link href="/pricing" className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors inline-flex items-center gap-2 mb-8 text-sm font-medium">
        ← Back to Pricing
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 lg:gap-10">
        {/* Left Side - Checkout Form */}
        <div className="bg-white dark:bg-[#0d0c14]/90 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-10 shadow-xl dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Secure Checkout</h1>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold">
              RAZORPAY SECURE
            </span>
          </div>

          {errorMessage && (
            <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs flex flex-col gap-2">
              <div className="font-semibold flex items-center gap-1.5">
                <span>⚠️</span> Notice
              </div>
              <p>{errorMessage}</p>
            </div>
          )}

          {!isLoggedIn ? (
            <div className="py-8 px-4 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-3xl bg-pink-500/10 text-pink-500 flex items-center justify-center mb-5 border border-pink-500/20 shadow-lg shadow-pink-500/10">
                <span className="text-2xl">🔒</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold mb-2">Account Required Before Payment</h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8 leading-relaxed">
                To securely bind your active PRO subscription, generate licensed tokens, and synchronize cloud access, please sign in or register your creator account first.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md">
                <Link
                  href={`/login?redirect=${encodeURIComponent(`/checkout?plan=${plan}`)}`}
                  className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-500/25 transition-all text-center"
                >
                  Sign In to Account
                </Link>
                <Link
                  href={`/signup?redirect=${encodeURIComponent(`/checkout?plan=${plan}`)}`}
                  className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-900 dark:text-white font-semibold text-xs border border-slate-200 dark:border-white/10 transition-all text-center"
                >
                  Create New Account
                </Link>
              </div>
            </div>
          ) : user?.role === "admin" ? (
            <div className="py-8 px-4 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-5 border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
                <span className="text-2xl">🛡️</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold mb-2">Administrator Access Active</h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8 leading-relaxed">
                You are currently signed in as an Administrator (<span className="font-mono text-emerald-500 font-semibold">{user.email}</span>). You already have lifetime unrestricted access to all PRO blueprints and prompt outputs without needing a paid plan.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md">
                <Link
                  href="/admin"
                  className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-black font-semibold text-xs shadow-md transition-all text-center"
                >
                  Open Admin Command Center
                </Link>
                <Link
                  href="/"
                  className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-900 dark:text-white font-semibold text-xs border border-slate-200 dark:border-white/10 transition-all text-center"
                >
                  Explore All Blueprints
                </Link>
              </div>
            </div>
          ) : user?.isPro ? (
            <div className="py-8 px-4 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-5 border border-amber-500/20 shadow-lg shadow-amber-500/10">
                <span className="text-2xl">👑</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold mb-2">AWA PRO Subscription Active</h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8 leading-relaxed">
                Hi <span className="font-semibold text-slate-900 dark:text-white">{user.name}</span>! Your account (<span className="font-mono text-amber-500 font-semibold">{user.email}</span>) already has an active AWA PRO subscription. You have full access to all prompt blueprints, interactive parameters, and AI mutators.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md">
                <Link
                  href="/"
                  className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-500/25 transition-all text-center"
                >
                  Browse Master Blueprints
                </Link>
                <Link
                  href="/profile"
                  className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-900 dark:text-white font-semibold text-xs border border-slate-200 dark:border-white/10 transition-all text-center"
                >
                  View Profile &amp; Receipts
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handlePayment} className="flex flex-col">
              {/* Authenticated User Banner */}
              <div className="mb-6 p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-600/10 text-indigo-600 flex items-center justify-center font-bold text-sm">
                    {user?.name ? user.name[0].toUpperCase() : "U"}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-white">
                      Subscribing as: {user?.name || "Creator"}
                    </div>
                    <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                      {user?.email}
                    </div>
                  </div>
                </div>

                <Link
                  href={`/login?redirect=${encodeURIComponent(`/checkout?plan=${plan}`)}`}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                >
                  Switch account
                </Link>
              </div>

              <div className="flex gap-3 mb-6">
                <button 
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`flex-1 py-3 px-4 rounded-xl border text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    paymentMethod === "card" 
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-md" 
                      : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200 dark:bg-black/20 dark:border-white/5 dark:text-slate-400 dark:hover:border-white/15"
                  }`}
                >
                  <span>💳</span> Razorpay Cards / EMI
                </button>
                <button 
                  type="button"
                  onClick={() => setPaymentMethod("upi")}
                  className={`flex-1 py-3 px-4 rounded-xl border text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    paymentMethod === "upi" 
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-md" 
                      : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200 dark:bg-black/20 dark:border-white/5 dark:text-slate-400 dark:hover:border-white/15"
                  }`}
                >
                  <span>⚡</span> UPI / QR / Netbanking
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-500/[0.04] border border-indigo-500/20 mb-8 space-y-2">
                <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                  <span>🛡️</span> Instant Razorpay Gateway
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Clicking the button below will open the official 256-bit encrypted Razorpay modal supporting Google Pay, PhonePe, Paytm, Credit/Debit cards, and 50+ Netbanking banks.
                </p>
              </div>

              <button 
                type="submit" 
                disabled={isProcessing}
                className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-sm shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Connecting to Razorpay...</span>
                  </>
                ) : (
                  <span>Pay {price} via Razorpay Checkout</span>
                )}
              </button>
              <p className="text-center text-slate-500 dark:text-slate-400 text-xs mt-4 flex items-center justify-center gap-1.5">
                <span>🔒</span> Secured by RBI Authorized Razorpay Gateway
              </p>
            </form>
          )}
        </div>

        {/* Right Side - Summary */}
        <div>
          <div className="bg-white dark:bg-[#12111d] border border-slate-200 dark:border-purple-500/20 rounded-3xl p-6 sm:p-8 shadow-lg sticky top-[90px]">
            <h3 className="text-lg font-bold mb-4 tracking-tight">Order Summary</h3>
            
            <div className="flex justify-between items-center mb-3 text-sm text-slate-600 dark:text-slate-300 font-medium">
              <span>{planName}</span>
              <span className="font-bold text-slate-900 dark:text-white">{price}</span>
            </div>
            
            <div className="flex justify-between items-center mb-3 text-xs text-slate-500">
              <span>GST (18% included)</span>
              <span>₹0.00</span>
            </div>

            <hr className="border-slate-200 dark:border-white/10 my-4" />
            
            <div className="flex justify-between items-baseline mb-6">
              <span className="text-base font-bold">Total Due</span>
              <span className="text-2xl font-black text-cyan-600 dark:text-cyan-400">{price}</span>
            </div>

            <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-2">
                <span className="text-emerald-500 font-bold">✓</span> Instant access to 500+ production prompts
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500 font-bold">✓</span> 5 AI Customization credits loaded
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500 font-bold">✓</span> Midjourney v6 + Claude 3.7 compatible
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500 font-bold">✓</span> 7-day money back guarantee
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center text-slate-500 font-mono text-sm">Loading checkout details...</div>}>
      <CheckoutForm />
    </Suspense>
  );
}
