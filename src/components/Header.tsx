"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Search, Sun, Moon, User, Menu, X, ShieldCheck } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import AwaLogo from "@/components/AwaLogo";

export default function Header() {
  const { user, isLoggedIn, isPro, isAdmin } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleScroll = () => setScrolled(window.scrollY > 10);
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/workflow", label: "Workflow Studio", isNew: true },
    { href: "/about", label: "About" },
    { href: "/pricing", label: "Pricing" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ];

  if (pathname?.startsWith("/admin") || pathname?.startsWith("/workflow")) {
    return null;
  }

  return (
    <>
      {/* Main Navigation Bar */}
      <header
        className={`sticky top-0 left-0 right-0 z-[100] transition-all duration-300 ${
          scrolled
            ? "bg-white/95 dark:bg-[#050508]/95 backdrop-blur-2xl border-b border-slate-200 dark:border-white/10 shadow-sm dark:shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
            : "bg-white/80 dark:bg-[#000000]/80 backdrop-blur-md border-b border-slate-200/60 dark:border-white/5"
        }`}
      >
        <div className="max-w-[1500px] mx-auto px-4 sm:px-8 flex items-center justify-between h-[64px]">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-4">
            <Link href="/" className="group inline-flex items-center">
              <AwaLogo size={32} textSize="md" />
            </Link>

            {/* Quick Search Trigger Pill */}
            <button
              onClick={() => {
                const searchInput = document.getElementById("omni-search-input");
                if (searchInput) {
                  searchInput.focus();
                  searchInput.scrollIntoView({ behavior: "smooth", block: "center" });
                }
              }}
              className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.07] dark:hover:bg-white/[0.12] border border-slate-200 dark:border-white/10 text-xs text-slate-500 dark:text-slate-400 transition-all cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10">/</span>
            </button>
          </div>

          {/* Centered Pill Navigation Group (GetLayers style) */}
          <nav className="hidden md:flex items-center gap-1 p-1 rounded-full bg-slate-100 dark:bg-white/[0.06] border border-slate-200/80 dark:border-white/10 backdrop-blur-md">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`px-3.5 py-1 rounded-full text-xs font-medium tracking-tight transition-all duration-200 flex items-center gap-1.5 ${
                    isActive
                      ? "bg-white text-slate-900 shadow-sm dark:bg-white dark:text-black font-semibold"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                  }`}
                >
                  <span>{link.label}</span>
                  {link.isNew && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-bold uppercase tracking-wider animate-pulse">
                      New
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2.5">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.07] dark:hover:bg-white/[0.14] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-yellow-400 transition-all cursor-pointer"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? (
                <Sun className="w-3.5 h-3.5 text-yellow-400" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-slate-700" />
              )}
            </button>

            {/* User Profile or Sign In */}
            {isLoggedIn ? (
              <Link
                href="/profile"
                className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/15 text-xs font-semibold text-slate-900 dark:text-white hover:border-cyan-500/50 transition-all"
              >
                <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-500 text-white flex items-center justify-center text-[9px] font-black uppercase">
                  {user?.name ? user.name.slice(0, 1) : "U"}
                </div>
                <span className="hidden sm:inline">{user?.name ? user.name.split(" ")[0] : "Account"}</span>
                {isPro && (
                  <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 bg-amber-500/15 text-amber-500 border border-amber-500/20 rounded-md">
                    PRO
                  </span>
                )}
              </Link>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  href="/login"
                  className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Sign in</span>
                </Link>
                <Link
                  href="/signup"
                  className="hidden sm:inline-block text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Register
                </Link>
              </div>
            )}

            {/* CTA Button */}
            <Link
              href="/pricing"
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-slate-200 shadow-sm transition-all"
            >
              Get Access
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 dark:bg-white/[0.07] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200"
              aria-label="Open navigation menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 dark:border-white/10 bg-white/95 dark:bg-[#07070b]/95 backdrop-blur-2xl px-6 py-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors flex items-center justify-between ${
                      isActive
                        ? "bg-slate-100 dark:bg-white/10 text-slate-950 dark:text-white font-semibold"
                        : "text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white"
                    }`}
                  >
                    <span>{link.label}</span>
                    {link.isNew && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-bold tracking-wider">
                        NEW
                      </span>
                    )}
                  </Link>
                );
              })}
              <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
                <Link
                  href={isLoggedIn ? "/profile" : "/login"}
                  className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300"
                >
                  <User className="w-4 h-4 text-cyan-500" />
                  <span>{isLoggedIn ? "My Account" : "Sign In"}</span>
                </Link>
                <Link
                  href="/pricing"
                  className="px-4 py-1.5 rounded-full text-xs font-semibold bg-indigo-600 text-white"
                >
                  Join Pro
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
