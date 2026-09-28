"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  FileCode,
  FileText,
  FolderTree,
  Cpu,
  MessageSquare,
  Settings,
  Plus,
  Trash2,
  Edit3,
  Copy,
  Check,
  Search,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  Eye,
  Sliders,
  AlertCircle,
  Database,
  ArrowUpRight,
  UploadCloud,
  Image as ImageIcon,
  FolderPlus,
  Compass,
  Palette,
  Layers,
  Smartphone,
  BarChart3,
  Film,
  Users,
  Banknote,
  Menu,
  X,
  ChevronRight,
  LogOut,
  Sun,
  Moon,
  ChevronsLeft,
  ChevronsRight,
  Zap,
  ArrowLeft,
  Bell,
  ChevronDown,
  CheckCircle2,
  Lightbulb,
  Shield,
  BookOpen,
  Play,
  Activity,
  Terminal,
  Wand2,
  SlidersHorizontal,
  Video,
  Type,
  MoreHorizontal,
  Globe,
  Presentation,
  Calendar,
  CreditCard,
  Crown
} from "lucide-react";
import AwaLogo from "@/components/AwaLogo";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

type Tab = "overview" | "templates" | "categories" | "workflow" | "tools" | "media" | "feedback" | "subscriptions" | "settings";

export interface GuidanceStepItem {
  step: string;
  phase: string;
  title: string;
  desc: string;
  instruction?: string;
  examplePrompt: string;
  imgUrl?: string;
}

export const getCategoryGuidancePreset = (categoryNameOrSlug: string): GuidanceStepItem[] => {
  const cat = (categoryNameOrSlug || "").toLowerCase();
  if (cat.includes("video") || cat.includes("film") || cat.includes("motion")) {
    return [
      { step: "01", phase: "Concept", title: "Define Motion Narrative", desc: "Outline scene action, pacing, and emotional mood.", examplePrompt: "Cinematic drone hyperlapse moving across neon city streets at midnight, rain reflections, anamorphic lens flare.", imgUrl: "/cyber_dashboard.jpg" },
      { step: "02", phase: "Subject", title: "Detail Moving Elements", desc: "Specify primary focal actor, vehicles, and dynamic interactions.", examplePrompt: "Futuristic sports car accelerating through neon underpass with red taillight trails.", imgUrl: "/cyber_portrait.jpg" },
      { step: "03", phase: "Composition", title: "Establish Camera Dynamics", desc: "Define camera speed, tracking angle, and focal length.", examplePrompt: "Tracking shot at wheel level, 24mm wide angle, 24fps smooth motion.", imgUrl: "/holographic_3d.jpg" },
      { step: "04", phase: "Style", title: "Color Grade & Film Stock", desc: "Choose cinema film stock, color tone, and shutter angle.", examplePrompt: "Kodak Vision3 500T, teal and orange cinema grade, subtle 35mm grain.", imgUrl: "/flower_night_street.jpg" },
      { step: "05", phase: "Lighting", title: "Lighting & Atmosphere", desc: "Direct key lights, headlights, and atmospheric fog.", examplePrompt: "Volumetric fog illuminated by halogen streetlights and pulsing neon signs.", imgUrl: "/flower_snow_winter.jpg" },
      { step: "06", phase: "Parameters", title: "Motion & Seed Flags", desc: "Tune motion amplitude, FPS, and consistency seeds.", examplePrompt: "--motion 5 --fps 24 --camera pan-right --seed 48920194", imgUrl: "/cyber_dashboard.jpg" },
      { step: "07", phase: "Generate", title: "Render & Upscale 4K", desc: "Synthesize in Runway Gen-3 / Kling 1.5, upscale to 4K 60fps.", examplePrompt: "Execute prompt in Runway Gen-3 Alpha, interpolate with Topaz Video AI to 4K 60fps.", imgUrl: "/workflow-mockup.jpg" },
    ];
  }
  if (cat.includes("web") || cat.includes("code") || cat.includes("app") || cat.includes("ui")) {
    return [
      { step: "01", phase: "Concept", title: "Define App Scope & UX", desc: "Clarify user objective, responsive layout, and key micro-interactions.", examplePrompt: "Dark mode SaaS dashboard for real-time AI inference telemetry and prompt experimentation.", imgUrl: "/cyber_dashboard.jpg" },
      { step: "02", phase: "Subject", title: "Core Data Entities & Cards", desc: "Specify metrics panels, charts, activity feeds, and action triggers.", examplePrompt: "Hero metric cards with mini sparklines, latency gauge, and active node status tags.", imgUrl: "/cyber_portrait.jpg" },
      { step: "03", phase: "Composition", title: "Grid & Responsive Hierarchy", desc: "Structure 12-column responsive layout with collapsible sidebar and breadcrumbs.", examplePrompt: "Collapsible navigation rail, sticky filter bar, and 3-column responsive flex grid.", imgUrl: "/holographic_3d.jpg" },
      { step: "04", phase: "Style", title: "Design System & Tokens", desc: "Define obsidian color palette (#090a0f), cyan accents, and typography.", examplePrompt: "Tailwind CSS dark mode, bg-[#0a0b10], text-cyan-400 accents, Inter and JetBrains Mono.", imgUrl: "/flower_night_street.jpg" },
      { step: "05", phase: "Lighting", title: "Glow & Surface Borders", desc: "Add subtle border highlights, glassmorphism, and hover lift effects.", examplePrompt: "border-white/10, backdrop-blur-xl, subtle radial gradient glow behind cards.", imgUrl: "/flower_snow_winter.jpg" },
      { step: "06", phase: "Parameters", title: "Tech Stack & Libs", desc: "Lock framework version, icon library, and animation springs.", examplePrompt: "Next.js 15 App Router, Tailwind CSS 4, Lucide React, Framer Motion springs.", imgUrl: "/cyber_dashboard.jpg" },
      { step: "07", phase: "Generate", title: "Build & Deploy to Vercel", desc: "Run typecheck, compile bundle, and verify zero layout shifts.", examplePrompt: "Run `npm run build`, test accessibility, and push to production on Vercel.", imgUrl: "/workflow-mockup.jpg" },
    ];
  }
  if (cat.includes("slide") || cat.includes("deck") || cat.includes("presentation")) {
    return [
      { step: "01", phase: "Concept", title: "Core Thesis & Narrative", desc: "Define pitch deck flow, problem statement, and key takeaway.", examplePrompt: "10-slide Seed-stage AI platform pitch deck with high-impact bold typography.", imgUrl: "/cyber_dashboard.jpg" },
      { step: "02", phase: "Subject", title: "Hero Diagram / Metric", desc: "Identify key data visualization, architecture map, or traction chart.", examplePrompt: "Visual flywheel diagram showing data flywheel, model tuning, and recurring revenue.", imgUrl: "/cyber_portrait.jpg" },
      { step: "03", phase: "Composition", title: "Slide Grid & Negative Space", desc: "16:9 widescreen layout with ample margins and clear focal anchors.", examplePrompt: "16:9 aspect ratio, 60/40 asymmetrical split between bold statement and visual artifact.", imgUrl: "/holographic_3d.jpg" },
      { step: "04", phase: "Style", title: "Typography & Colorway", desc: "Bold sans-serif headlines, high-contrast monochrome with single neon accent.", examplePrompt: "Deep charcoal background, stark white headlines in Plus Jakarta Sans, emerald traction tags.", imgUrl: "/flower_night_street.jpg" },
      { step: "05", phase: "Lighting", title: "Contrast & Visual Punch", desc: "Highlight pivotal metrics with soft spotlight gradients.", examplePrompt: "Subtle linear gradient card backdrops, glowing metric highlight pill.", imgUrl: "/flower_snow_winter.jpg" },
      { step: "06", phase: "Parameters", title: "Export & Aspect Formats", desc: "Ensure 1920x1080 resolution, vector asset exports, and printable PDF.", examplePrompt: "--ar 16:9 --dpi 300 vector-ready SVG exports.", imgUrl: "/cyber_dashboard.jpg" },
      { step: "07", phase: "Generate", title: "Deliver Keynote / Deck", desc: "Export high-resolution PDF and interactive Figma / Keynote presentation.", examplePrompt: "Export vector deck to Pitch / Figma, verify slide transitions, and present.", imgUrl: "/workflow-mockup.jpg" },
    ];
  }
  // Default Image preset
  return [
    { step: "01", phase: "Concept", title: "Define Creative Concept", desc: "Clearly define the main idea, purpose, and visual direction of the image.", examplePrompt: "A cinematic luxury product advertisement in a dark futuristic studio environment with dramatic lighting and realistic reflections.", imgUrl: "/cyber_dashboard.jpg" },
    { step: "02", phase: "Subject", title: "Identify Primary Subject", desc: "Specify the exact physical properties, tactile surfaces, and precise placement.", examplePrompt: "Hero subject: ultra-slim flagship phone, obsidian ceramic chassis, triple camera array with anti-reflective glass lenses.", imgUrl: "/cyber_portrait.jpg" },
    { step: "03", phase: "Composition", title: "Establish Framing & Lens", desc: "Position camera angle, focal length, depth of field, and negative space.", examplePrompt: "Shot on 85mm prime lens, dynamic low-angle perspective, centered composition, shallow depth of field.", imgUrl: "/holographic_3d.jpg" },
    { step: "04", phase: "Style", title: "Select Aesthetics & Finish", desc: "Choose rendering realism, Octane 3D precision, or editorial photography.", examplePrompt: "Commercial luxury advertising style, hyper-realistic studio photography, Octane 3D render precision, 8K photorealism.", imgUrl: "/flower_night_street.jpg" },
    { step: "05", phase: "Lighting", title: "Direct Lighting & Mood", desc: "Sculpt scene with key lights, rim lights, and soft specular highlights.", examplePrompt: "Dramatic studio lighting, dual soft blue and cool white rim lights, clean specular highlights along edges.", imgUrl: "/flower_snow_winter.jpg" },
    { step: "06", phase: "Parameters", title: "Tune Engine Parameters", desc: "Set aspect ratio, stylize strength, and raw mode flags for maximum fidelity.", examplePrompt: "--ar 16:9 --style raw --s 250 --v 6.1", imgUrl: "/cyber_dashboard.jpg" },
    { step: "07", phase: "Generate", title: "Synthesize & Upscale 8K", desc: "Execute prompt in AI engine, inspect variations, and upscale to 8K.", examplePrompt: "Execute prompt in Midjourney /imagine console, select variation, and upscale to 8K UHD finish.", imgUrl: "/workflow-mockup.jpg" },
  ];
};

const PRESET_IMAGES = [
  { name: "Cyber Dashboard", url: "/cyber_dashboard.jpg" },
  { name: "Cyber Portrait", url: "/cyber_portrait.jpg" },
  { name: "Holographic 3D", url: "/holographic_3d.jpg" },
  { name: "SaaS Analytics", url: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?q=80&w=800&auto=format&fit=crop" },
  { name: "Arch Cantilever", url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop" },
  { name: "Crypto Terminal", url: "https://images.unsplash.com/photo-1621504450181-5d156f8946db?q=80&w=800&auto=format&fit=crop" },
  { name: "Bento Portfolio", url: "https://images.unsplash.com/photo-1517292987719-0369a794ec0f?q=80&w=800&auto=format&fit=crop" },
];

const SIDEBAR_ITEMS: { id: Tab; label: string; icon: any }[] = [
  { id: "overview", label: "Dashboard", icon: LayoutDashboard },
  { id: "templates", label: "Templates & Prompts", icon: FileText },
  { id: "categories", label: "Category Wise Editor", icon: FolderTree },
  { id: "workflow", label: "Workflow Studio", icon: Zap },
  { id: "tools", label: "AI Tools Master", icon: Cpu },
  { id: "media", label: "Media & Images", icon: ImageIcon },
  { id: "feedback", label: "Users & Feedback", icon: MessageSquare },
  { id: "subscriptions", label: "Subscriptions & Plans", icon: CreditCard },
  { id: "settings", label: "Platform Controls", icon: Sliders },
];

export default function AdminPage() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showAdminDropdown, setShowAdminDropdown] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("templates");
  const [stats, setStats] = useState<any>(null);
  const [templates, setTemplates] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [tools, setTools] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<any[]>([]);
  const [mediaAssets, setMediaAssets] = useState<any[]>([]);
  const [mediaSearch, setMediaSearch] = useState("");
  const [settings, setSettings] = useState<any>({
    non_subscriber_visibility: "blurred_preview",
    ai_monthly_spending_cap: "500",
    free_customization_count: "3",
    voice_input_enabled: "true",
    standing_rewrite_instruction: "Enhance fidelity, specify lighting, color palette, camera lens, and ultra-high-definition composition parameters.",
    payment_provider: "razorpay",
  });

  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isAiGeneratingImage, setIsAiGeneratingImage] = useState(false);
  const [savingTemplate, setSavingTemplate] = useState(false);
  const [formValidationError, setFormValidationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaTabFileInputRef = useRef<HTMLInputElement>(null);

  // Template Search & Filter
  const [tplSearch, setTplSearch] = useState("");
  const [tplCategoryFilter, setTplCategoryFilter] = useState("all");

  // Modals state
  const [showAddTemplateModal, setShowAddTemplateModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<any | null>(null);

  const [previewTemplate, setPreviewTemplate] = useState<any | null>(null);
  const [copiedPreviewPrompt, setCopiedPreviewPrompt] = useState(false);

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);

  const [showToolModal, setShowToolModal] = useState(false);
  const [editingTool, setEditingTool] = useState<any | null>(null);

  // Subscriptions & User Management State
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [adminUsers, setAdminUsers] = useState<any[]>([]);
  const [subscriptionStats, setSubscriptionStats] = useState<any>(null);
  const [subSearchQuery, setSubSearchQuery] = useState("");
  const [subPlanFilter, setSubPlanFilter] = useState("all");
  const [subStatusFilter, setSubStatusFilter] = useState("all");
  const [isLoadingSubscriptions, setIsLoadingSubscriptions] = useState(false);
  const [showAddSubModal, setShowAddSubModal] = useState(false);
  const [editingSub, setEditingSub] = useState<any | null>(null);
  const [savingSub, setSavingSub] = useState(false);
  const [subForm, setSubForm] = useState({
    email: "",
    plan: "yearly",
    amount: "₹199",
    status: "active",
    credits: 25,
    paymentId: "",
    is_pro: true,
  });

  // Subcategories State
  const [subcategoriesMap, setSubcategoriesMap] = useState<Record<string, any[]>>({
    image: [],
    video: [],
    website: [],
    slides: [],
  });
  const [newSubcatInputs, setNewSubcatInputs] = useState<Record<string, string>>({});
  const [isCustomSubcatMode, setIsCustomSubcatMode] = useState(false);
  const [customSubcatInput, setCustomSubcatInput] = useState("");

  // Category Wise Editor State
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>("image");
  const [categoryEditorViewMode, setCategoryEditorViewMode] = useState<"category_wise" | "hierarchy_cards">("category_wise");
  const [catWiseSearch, setCatWiseSearch] = useState<string>("");
  const [activeGuidanceStepIndex, setActiveGuidanceStepIndex] = useState<number>(0);
  const [copiedGuidanceStepPrompt, setCopiedGuidanceStepPrompt] = useState<boolean>(false);
  const [categoryStatusMap, setCategoryStatusMap] = useState<Record<string, boolean>>({
    image: true,
    video: true,
    website: true,
    slides: true,
    poster: true,
  });
  const [showSubcatAddInput, setShowSubcatAddInput] = useState<boolean>(false);
  const [inlineSubcatName, setInlineSubcatName] = useState<string>("");

  // Workflow Studio Admin State
  const [workflowStageFilter, setWorkflowStageFilter] = useState<number | "all">("all");
  const [simulatingPipeline, setSimulatingPipeline] = useState<boolean>(false);
  const [simProgress, setSimProgress] = useState<number>(0);
  const [simLogs, setSimLogs] = useState<string[]>([]);
  const [simActiveStep, setSimActiveStep] = useState<number>(0);
  const [workflowTestPrompt, setWorkflowTestPrompt] = useState<string>(
    "A cinematic cybernetic hero standing in a rain-slicked Tokyo alley, neon rim lighting, 8k resolution"
  );
  const [workflowConfig, setWorkflowConfig] = useState<any>({
    conditioningModel: "CLIP ViT-L/14 + T5-XXL",
    imageGenModel: "FLUX.1 Schnell",
    videoSynthModel: "Runway Gen-3 Alpha",
    fusionModel: "Aleph Multi-Modal Fusion v2",
    defaultCfg: "3.5",
    defaultSteps: "4",
    defaultMotionSpeed: "4.5",
  });

  const handleRunPipelineSimulation = () => {
    if (simulatingPipeline) return;
    setSimulatingPipeline(true);
    setSimProgress(15);
    setSimActiveStep(1);
    setSimLogs([`[Stage 1: Conditioning] Parsing input vector: "${workflowTestPrompt.slice(0, 45)}..."`]);

    setTimeout(() => {
      setSimProgress(40);
      setSimActiveStep(2);
      setSimLogs((prev) => [
        ...prev,
        "[Stage 1: Conditioning] Prompt embeddings mapped. LoRA weights applied: 0.85.",
        `[Stage 2: Image Gen] Invoking ${workflowConfig.imageGenModel} (Steps: ${workflowConfig.defaultSteps}, CFG: ${workflowConfig.defaultCfg})...`
      ]);
    }, 1100);

    setTimeout(() => {
      setSimProgress(70);
      setSimActiveStep(3);
      setSimLogs((prev) => [
        ...prev,
        "[Stage 2: Image Gen] Latent canvas synthesized (1024x1024). Peak SNR: 38.4 dB.",
        `[Stage 3: Video Synth] Passing latent frame into ${workflowConfig.videoSynthModel} (Motion Speed: ${workflowConfig.defaultMotionSpeed})...`
      ]);
    }, 2300);

    setTimeout(() => {
      setSimProgress(90);
      setSimActiveStep(4);
      setSimLogs((prev) => [
        ...prev,
        "[Stage 3: Video Synth] 48 temporal frames generated @ 24fps with camera motion vector.",
        `[Stage 4: Aleph Fusion] Running ${workflowConfig.fusionModel} & 8K neural upscale...`
      ]);
    }, 3500);

    setTimeout(() => {
      setSimProgress(100);
      setSimActiveStep(0);
      setSimulatingPipeline(false);
      setSimLogs((prev) => [
        ...prev,
        "[Complete] Synthesis pipeline succeeded in 4.7s. Output buffers ready in media cache."
      ]);
      showToast("Pipeline test executed successfully!");
    }, 4700);
  };

  const handleAddSubcategory = async (catId: string, name: string) => {
    try {
      const res = await fetch("/api/categories/subcategories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryId: catId, name }),
      });
      const data = await res.json();
      if (data.success) {
        setSubcategoriesMap((prev) => {
          const currentList = prev[catId] || [];
          const exists = currentList.some((s: any) => s.name?.toLowerCase() === name.toLowerCase());
          if (exists) return prev;
          return {
            ...prev,
            [catId]: [...currentList, data.data],
          };
        });
        setNewSubcatInputs((prev) => ({ ...prev, [catId]: "" }));
        showToast(`Added subcategory: ${name}`);
        return data.data;
      }
    } catch (err) {
      console.error("Error adding subcategory:", err);
    }
  };

  const getInitialTplForm = (catId?: string) => {
    const targetCat = catId || (categories[0]?.id || "image");
    const guidancePreset = getCategoryGuidancePreset(targetCat);
    return {
      title: "",
      desc: "",
      prompt: "",
      category: targetCat,
      subcategory: "",
      tool: "Midjourney v6.1",
      toolUrl: "https://midjourney.com",
      img: "/cyber_dashboard.jpg",
      tags: "Cinematic,AI,Blueprint",
      isPro: true,
      complexity: "intermediate",
      mediaType: "image" as "image" | "video" | "code",
      videoUrl: "",
      tip: "Use --style raw and --s 250 for realistic photographic finishes.",
      step1_title: guidancePreset[0]?.title || "Copy Generation Prompt",
      step1_desc: guidancePreset[0]?.desc || "Click the copy button above. Lighting mood and aspect ratio flags are embedded.",
      step2_title: guidancePreset[1]?.title || "Run in Midjourney v6.1",
      step2_desc: guidancePreset[1]?.desc || "Paste into Midjourney (/imagine) or Flux.1 to generate UHD visuals.",
      step3_title: guidancePreset[2]?.title || "Upscale & Deploy",
      step3_desc: guidancePreset[2]?.desc || "Upscale with Creative Upscaler (4K) and place into your product design canvas.",
      guidance_steps: guidancePreset,
    };
  };

  const handleOpenEditTemplate = (t: any) => {
    setEditingTemplate(t);
    const isVid = Boolean(
      t.mediaType === "video" ||
      t.videoUrl ||
      t.image_url?.endsWith(".mp4") ||
      t.image_url?.endsWith(".webm") ||
      t.img?.endsWith(".mp4") ||
      t.title?.toLowerCase().includes("video") ||
      t.desc?.toLowerCase().includes("video") ||
      t.description?.toLowerCase().includes("video")
    );
    const mType: "image" | "video" | "code" = t.mediaType || (isVid ? "video" : (t.tool?.toLowerCase().includes("claude") || t.tool?.toLowerCase().includes("cursor") ? "code" : "image"));
    const sub = t.subcategory || (Array.isArray(t.tags) ? t.tags.find((x: string) => x.startsWith("sub:"))?.replace(/^sub:/, "") : typeof t.tags === "string" ? t.tags.split(",").find((x: string) => x.startsWith("sub:"))?.replace(/^sub:/, "") : "") || "";

    const initialPreset = getCategoryGuidancePreset(t.category_id || t.category || "image");
    let loadedGuidanceSteps: GuidanceStepItem[] = initialPreset;
    if (t.steps && Array.isArray(t.steps) && t.steps.length > 0) {
      loadedGuidanceSteps = initialPreset.map((defaultSt, idx) => {
        const existing = t.steps[idx];
        if (!existing) return defaultSt;
        return {
          step: String(idx + 1).padStart(2, "0"),
          phase: existing.phase || existing.label || defaultSt.phase,
          title: existing.title || defaultSt.title,
          desc: existing.instruction || existing.description || existing.desc || defaultSt.desc,
          examplePrompt: existing.examplePrompt || existing.prompt || defaultSt.examplePrompt,
          imgUrl: existing.imgUrl || existing.image_url || defaultSt.imgUrl,
        };
      });
    }

    setTplForm({
      ...getInitialTplForm(t.category_id || t.category),
      title: t.title || "",
      desc: t.desc || t.description || "",
      prompt: t.prompt || t.prompt_text || "",
      category: t.category_id || t.category || "image",
      subcategory: sub,
      tool: t.tool || "Midjourney v6.1",
      toolUrl: t.toolUrl || "https://midjourney.com",
      img: t.image_url || t.img || "/cyber_dashboard.jpg",
      tags: Array.isArray(t.tags) ? t.tags.filter((x: string) => !x.startsWith("sub:")).join(",") : t.tags || "",
      isPro: Boolean(t.featured || t.isPro),
      complexity: t.complexity || "intermediate",
      mediaType: mType,
      videoUrl: isVid ? (t.videoUrl || t.image_url || t.img || "") : "",
      tip: t.tip || "Use --style raw and --s 250 for realistic photographic finishes.",
      step1_title: loadedGuidanceSteps[0]?.title || "Copy Generation Prompt",
      step1_desc: loadedGuidanceSteps[0]?.desc || "Click the copy button above. Lighting mood and flags are embedded.",
      step2_title: loadedGuidanceSteps[1]?.title || "Execute in AI Stack",
      step2_desc: loadedGuidanceSteps[1]?.desc || "Paste prompt into target AI model to render output.",
      step3_title: loadedGuidanceSteps[2]?.title || "Upscale & Deploy",
      step3_desc: loadedGuidanceSteps[2]?.desc || "Integrate output into your design canvas or site.",
      guidance_steps: loadedGuidanceSteps,
    });
    setPreviewTemplate(null);
    setShowAddTemplateModal(true);
  };

  // Template Form State
  const [tplForm, setTplForm] = useState(getInitialTplForm());

  const handleOpenAddTemplate = () => {
    setEditingTemplate(null);
    setTplForm(getInitialTplForm());
    setShowAddTemplateModal(true);
  };

  const autoFillInstructions = (type?: "image" | "video" | "code", targetTool?: string) => {
    const safeType = type || tplForm.mediaType || "image";
    const t = targetTool || tplForm.tool;
    if (safeType === "video") {
      setTplForm((prev) => ({
        ...prev,
        mediaType: "video",
        tool: prev.tool === "Midjourney v6.1" ? "Runway Gen-3" : prev.tool,
        toolUrl: prev.tool === "Midjourney v6.1" ? "https://runwayml.com" : prev.toolUrl,
        tip: "Motion Tip: Set motion speed to 4-5 and camera pan left for fluid cinematic parallax.",
        step1_title: "Copy Motion Vector Prompt",
        step1_desc: "Click copy prompt above. Motion directives, aspect ratio, and camera flags are included.",
        step2_title: `Render in ${t || "Runway Gen-3 / Kling"}`,
        step2_desc: `Paste into ${t || "Runway Gen-3"} with 24fps motion brush and ultra-high bitrate.`,
        step3_title: "Export 4K & Composite",
        step3_desc: "Export ProRes 4K video or loop in your Next.js hero background video player.",
      }));
    } else if (type === "code") {
      setTplForm((prev) => ({
        ...prev,
        mediaType: "code",
        tool: prev.tool === "Midjourney v6.1" ? "Claude 3.7 & Cursor" : prev.tool,
        toolUrl: prev.tool === "Midjourney v6.1" ? "https://cursor.com" : prev.toolUrl,
        tip: "Code Tip: Use React 19 server components and Tailwind CSS for zero layout shift.",
        step1_title: "Copy Full Component Directive",
        step1_desc: "Click copy prompt above. Scaffolding, TypeScript types, and UI tokens are included.",
        step2_title: "Execute in Claude 3.7 / Cursor",
        step2_desc: "Paste prompt into Claude 3.7 Sonnet or Cursor Composer to generate complete components.",
        step3_title: "Launch & Ship",
        step3_desc: "Integrate into Next.js app directory with Tailwind CSS and Framer Motion.",
      }));
    } else {
      setTplForm((prev) => ({
        ...prev,
        mediaType: "image",
        tip: "Image Tip: Use --style raw and --s 250 for realistic photographic finishes.",
        step1_title: "Copy Generation Prompt",
        step1_desc: "Click the copy button above. Lighting mood and aspect ratio flags are embedded.",
        step2_title: `Run in ${t || "Midjourney v6.1"}`,
        step2_desc: `Paste prompt into ${t || "Midjourney"} (/imagine) or Flux.1 Dev to generate UHD visuals.`,
        step3_title: "Upscale & Deploy",
        step3_desc: "Upscale with Creative Upscaler (4K) and place into your product design canvas.",
      }));
    }
  };

  // Category Form State
  const [catForm, setCatForm] = useState({
    name: "",
    slug: "",
    description: "",
    icon: "Layout",
    sort_order: 10,
  });

  // Tool Form State
  const [toolForm, setToolForm] = useState({
    name: "",
    category: "image",
    website_url: "",
    description: "",
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch initial data
  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, tplRes, catRes, toolRes, fbRes, settingsRes, mediaRes, subcatRes, subsRes] = await Promise.all([
        fetch("/api/admin/stats").then((r) => r.json()),
        fetch("/api/admin/templates").then((r) => r.json()),
        fetch("/api/admin/categories").then((r) => r.json()),
        fetch("/api/admin/tools").then((r) => r.json()),
        fetch("/api/admin/feedback").then((r) => r.json()),
        fetch("/api/admin/settings").then((r) => r.json()),
        fetch("/api/admin/upload").then((r) => r.json()).catch(() => ({ success: false })),
        fetch("/api/categories/subcategories").then((r) => r.json()).catch(() => ({ success: false })),
        fetch("/api/admin/subscriptions").then((r) => r.json()).catch(() => ({ success: false })),
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (tplRes.success) setTemplates(tplRes.data || []);
      if (catRes.success) setCategories(catRes.data || []);
      if (toolRes.success) setTools(toolRes.data || []);
      if (fbRes.success) setFeedback(fbRes.data || []);
      if (settingsRes.success) setSettings(settingsRes.data || {});
      if (mediaRes.success) setMediaAssets(mediaRes.data || []);
      if (subcatRes.success && subcatRes.data) setSubcategoriesMap(subcatRes.data);
      if (subsRes && subsRes.success) {
        setSubscriptions(subsRes.data || []);
        setAdminUsers(subsRes.users || []);
        if (subsRes.stats) setSubscriptionStats(subsRes.stats);
      }
    } catch (err) {
      console.error("Admin load error:", err);
      showToast("Error synchronizing admin telemetry");
    } finally {
      setLoading(false);
    }
  };

  const loadSubscriptionsData = async () => {
    setIsLoadingSubscriptions(true);
    try {
      const res = await fetch("/api/admin/subscriptions");
      const json = await res.json();
      if (json.success) {
        setSubscriptions(json.data || []);
        setAdminUsers(json.users || []);
        if (json.stats) setSubscriptionStats(json.stats);
      }
    } catch (e) {
      console.error("Failed to load subscriptions", e);
    } finally {
      setIsLoadingSubscriptions(false);
    }
  };

  const handleOpenEditSub = (sub: any) => {
    setEditingSub(sub);
    const userObj = sub.user || adminUsers.find((u) => u.id === sub.user_id) || null;
    setSubForm({
      email: sub.user_email || userObj?.email || "",
      plan: sub.plan || "yearly",
      amount: sub.amount || (sub.plan === "lifetime" ? "₹999" : "₹199"),
      status: sub.status || "active",
      credits: sub.user_credits ?? userObj?.credits ?? 25,
      paymentId: sub.payment_id || "",
      is_pro: sub.user_is_pro ?? userObj?.is_pro ?? (sub.status === "active"),
    });
  };

  const handleOpenAddSubForUser = (userItem?: any) => {
    setEditingSub(null);
    setSubForm({
      email: userItem?.email || "",
      plan: "yearly",
      amount: "₹199",
      status: "active",
      credits: 50,
      paymentId: `admin_grant_${Date.now()}`,
      is_pro: true,
    });
    setShowAddSubModal(true);
  };

  const handleSaveSubEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSub) return;
    setSavingSub(true);
    try {
      const res = await fetch("/api/admin/subscriptions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingSub.id,
          plan: subForm.plan,
          amount: subForm.amount,
          status: subForm.status,
          credits: subForm.credits,
          is_pro: subForm.is_pro,
          payment_id: subForm.paymentId,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Subscription updated successfully! ✨");
        setEditingSub(null);
        await loadSubscriptionsData();
      } else {
        showToast(data.error || "Failed to update subscription");
      }
    } catch (err: any) {
      showToast(err.message || "Failed to update subscription");
    } finally {
      setSavingSub(false);
    }
  };

  const handleCreateSub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subForm.email) {
      showToast("User email is required");
      return;
    }
    setSavingSub(true);
    try {
      const res = await fetch("/api/admin/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: subForm.email,
          plan: subForm.plan,
          amount: subForm.amount,
          status: subForm.status,
          credits: subForm.credits,
          paymentId: subForm.paymentId,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`PRO subscription granted to ${subForm.email}! 🎉`);
        setShowAddSubModal(false);
        setSubForm({
          email: "",
          plan: "yearly",
          amount: "₹199",
          status: "active",
          credits: 25,
          paymentId: "",
          is_pro: true,
        });
        await loadSubscriptionsData();
      } else {
        showToast(data.error || "Failed to grant subscription");
      }
    } catch (err: any) {
      showToast(err.message || "Failed to grant subscription");
    } finally {
      setSavingSub(false);
    }
  };

  const handleDeleteSub = async (subId: string) => {
    if (!confirm("Are you sure you want to revoke and delete this subscription? The user's PRO privileges will be reverted if they have no other active plans.")) return;
    try {
      const res = await fetch(`/api/admin/subscriptions?id=${encodeURIComponent(subId)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        showToast("Subscription revoked successfully! 🗑️");
        await loadSubscriptionsData();
      } else {
        showToast(data.error || "Failed to revoke subscription");
      }
    } catch (err: any) {
      showToast(err.message || "Failed to revoke subscription");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Direct Media File Upload Handler
  // Flow: Frontend -> Backend authentication (/api/imagekit/auth) -> ImageKit upload -> return uploaded image URL
  const uploadImageFile = async (file: File): Promise<string | null> => {
    setUploadingImage(true);
    try {
      // 1. Backend Authentication for ImageKit
      let imageKitSuccess = false;
      try {
        const authRes = await fetch("/api/imagekit/auth");
        if (authRes.ok) {
          const authData = await authRes.json();
          if (authData.success && authData.signature && authData.token && authData.publicKey) {
            // 2. Direct Frontend -> ImageKit upload (Private key is NEVER sent to frontend)
            const ikFormData = new FormData();
            ikFormData.append("file", file);
            ikFormData.append("fileName", file.name);
            ikFormData.append("publicKey", authData.publicKey);
            ikFormData.append("signature", authData.signature);
            ikFormData.append("expire", String(authData.expire));
            ikFormData.append("token", authData.token);
            ikFormData.append("useUniqueFileName", "true");
            ikFormData.append("folder", "/blueprints");

            const uploadRes = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
              method: "POST",
              body: ikFormData,
            });

            const uploadData = await uploadRes.json();
            if (uploadRes.ok && uploadData.url) {
              imageKitSuccess = true;
              showToast("Image uploaded to ImageKit CDN!");

              // Add to media assets state
              setMediaAssets((prev) => [
                {
                  id: uploadData.fileId || `ik-${Date.now()}`,
                  name: uploadData.name || file.name,
                  url: uploadData.url,
                  size: uploadData.size || file.size,
                  createdAt: new Date().toISOString(),
                },
                ...prev,
              ]);

              return uploadData.url;
            } else {
              console.warn("ImageKit direct upload error, falling back to server:", uploadData);
            }
          }
        }
      } catch (ikErr) {
        console.warn("ImageKit authentication/upload error, falling back to local server:", ikErr);
      }

      // 3. Fallback to server upload endpoint (/api/admin/upload)
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        showToast(
          data.provider === "imagekit"
            ? "Image uploaded to ImageKit CDN!"
            : "Image asset uploaded to media library!"
        );

        // Refresh media list
        fetch("/api/admin/upload")
          .then((r) => r.json())
          .then((d) => {
            if (d.success) setMediaAssets(d.data || []);
          });
        return data.url;
      } else {
        showToast(data.error || "Failed to upload image");
        return null;
      }
    } catch (err) {
      console.error("Upload handler error:", err);
      showToast("Error uploading image");
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  // Image Upload Handler for Template Modal
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadImageFile(file);
    if (url) {
      setTplForm((prev) => ({ ...prev, img: url }));
    }
  };

  // Upload handler for Media Tab
  const handleMediaTabUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadImageFile(file);
    if (mediaTabFileInputRef.current) {
      mediaTabFileInputRef.current.value = "";
    }
  };

  // Delete Media File Handler
  const handleDeleteMediaAsset = async (fileName: string) => {
    if (!confirm(`Permanently delete media file "${fileName}" from server uploads?`)) return;
    try {
      const res = await fetch(`/api/admin/upload?file=${encodeURIComponent(fileName)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Asset "${fileName}" removed.`);
        setMediaAssets((prev) => prev.filter((m) => m.name !== fileName));
      } else {
        showToast(data.error || "Failed to delete file");
      }
    } catch {
      showToast("Error communicating with delete server endpoint");
    }
  };

  // Copy Image Link to Clipboard
  const handleCopyImageUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    showToast(`Copied image link: ${url}`);
  };

  // Generate Image from Prompt using AI
  const handleAiGenerateImage = async () => {
    const query = tplForm.prompt || tplForm.title || "cinematic dark obsidian cyber interface web design";
    setIsAiGeneratingImage(true);
    try {
      showToast("Generating image preview from AI prompt...");
      const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(query)}?width=1280&height=720&nologo=true&seed=${Date.now()}`;

      const imgRes = await fetch(pollinationsUrl);
      const blob = await imgRes.blob();
      const file = new File([blob], `ai_gen_${Date.now()}.jpg`, { type: "image/jpeg" });

      const uploadedUrl = await uploadImageFile(file);
      if (uploadedUrl) {
        setTplForm((prev) => ({ ...prev, img: uploadedUrl }));
        showToast("AI image generated & linked to blueprint!");
      } else {
        setTplForm((prev) => ({ ...prev, img: pollinationsUrl }));
      }
    } catch (err) {
      console.error("AI image gen error:", err);
      showToast("Note: External AI image preview set directly.");
      const fallbackUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(query)}?width=1280&height=720&nologo=true`;
      setTplForm((prev) => ({ ...prev, img: fallbackUrl }));
    } finally {
      setIsAiGeneratingImage(false);
    }
  };

  // Handle Create / Edit Template
  const handleSaveTemplate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setFormValidationError(null);

    // If user entered description but forgot title, use description as title
    const effectiveTitle = tplForm.title.trim() || tplForm.desc.trim() || (tplForm.prompt.trim() ? tplForm.prompt.trim().slice(0, 40) : "");

    if (!effectiveTitle) {
      setFormValidationError("Blueprint Title (or Description) is required. Please fill in the title field.");
      showToast("⚠️ Title is required.");
      const formEl = document.getElementById("blueprint-modal-form");
      if (formEl) formEl.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (!tplForm.prompt.trim()) {
      setFormValidationError("Finished Prompt Text is required. Please fill in the prompt field.");
      showToast("⚠️ Finished Prompt Text is required.");
      const formEl = document.getElementById("blueprint-modal-form");
      if (formEl) formEl.scrollTo({ top: 350, behavior: "smooth" });
      return;
    }

    const steps = (tplForm.guidance_steps && tplForm.guidance_steps.length > 0)
      ? tplForm.guidance_steps.map((st: any, idx: number) => ({
        step: String(idx + 1).padStart(2, "0"),
        phase: st.phase || ["Concept", "Subject", "Composition", "Style", "Lighting", "Parameters", "Generate"][idx] || `Step 0${idx + 1}`,
        title: st.title || `Step ${idx + 1}`,
        desc: st.desc || "",
        instruction: st.desc || "",
        examplePrompt: st.examplePrompt || "",
        imgUrl: st.imgUrl || "",
      }))
      : [
        {
          step: "01",
          title: tplForm.step1_title || "Copy prompt",
          desc: tplForm.step1_desc || "Click copy button above.",
        },
        {
          step: "02",
          title: tplForm.step2_title || `Run in ${tplForm.tool}`,
          desc: tplForm.step2_desc || "Paste prompt into AI engine.",
        },
        {
          step: "03",
          title: tplForm.step3_title || "Launch & Iterate",
          desc: tplForm.step3_desc || "Deploy in Next.js for production.",
        },
      ];

    const payload = {
      ...tplForm,
      title: effectiveTitle,
      category: tplForm.category || "image",
      steps,
    };

    setSavingTemplate(true);
    console.log("Submitting blueprint payload:", payload);
    try {
      if (editingTemplate) {
        // Update
        const res = await fetch(`/api/admin/templates/${editingTemplate.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          showToast(`Blueprint "${payload.title}" updated successfully!`);
          setEditingTemplate(null);
          setShowAddTemplateModal(false);
          await loadData();
        } else {
          setFormValidationError(data.error || "Failed to update blueprint.");
          showToast(data.error || "Failed to update blueprint.");
        }
      } else {
        // Create
        const res = await fetch("/api/admin/templates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          showToast(`Blueprint "${payload.title}" authored & published to catalog!`);
          setShowAddTemplateModal(false);
          setTplForm(getInitialTplForm());
          await loadData();
        } else {
          setFormValidationError(data.error || "Failed to publish blueprint to catalog.");
          showToast(data.error || "Failed to publish blueprint to catalog.");
        }
      }
    } catch (err: any) {
      console.error("Save template error:", err);
      setFormValidationError(err?.message || "Failed to save template blueprint");
      showToast(err?.message || "Failed to save template blueprint");
    } finally {
      setSavingTemplate(false);
    }
  };

  // Handle Delete Template
  const handleDeleteTemplate = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to retire "${title}" from the catalog?`)) return;
    try {
      const res = await fetch(`/api/admin/templates/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast(`Template "${title}" removed.`);
        loadData();
      }
    } catch {
      showToast("Failed to remove template");
    }
  };

  // Handle Save / Edit Category
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        // Update Category
        const res = await fetch(`/api/admin/categories/${editingCategory.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(catForm),
        });
        const data = await res.json();
        if (data.success) {
          showToast(`Category "${catForm.name}" updated!`);
          setEditingCategory(null);
          setShowCategoryModal(false);
          loadData();
        }
      } else {
        // Create Category
        const res = await fetch("/api/admin/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(catForm),
        });
        const data = await res.json();
        if (data.success) {
          showToast(`Category "${catForm.name}" created!`);
          setShowCategoryModal(false);
          setCatForm({ name: "", slug: "", description: "", icon: "Layout", sort_order: 10 });
          loadData();
        }
      }
    } catch {
      showToast("Failed to save category");
    }
  };

  // Handle Delete Category
  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"? Templates in this category may become unassigned.`)) return;
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast(`Category "${name}" deleted.`);
        loadData();
      }
    } catch {
      showToast("Failed to delete category");
    }
  };

  // Handle Save / Edit Tool
  const handleSaveTool = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTool) {
        const res = await fetch(`/api/admin/tools/${editingTool.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(toolForm),
        });
        const data = await res.json();
        if (data.success) {
          showToast(`Tool "${toolForm.name}" updated!`);
          setEditingTool(null);
          setShowToolModal(false);
          loadData();
        }
      } else {
        const res = await fetch("/api/admin/tools", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(toolForm),
        });
        const data = await res.json();
        if (data.success) {
          showToast(`AI Tool "${toolForm.name}" registered!`);
          setShowToolModal(false);
          setToolForm({ name: "", category: "image", website_url: "", description: "" });
          loadData();
        }
      }
    } catch {
      showToast("Failed to save AI tool");
    }
  };

  // Handle Delete Tool
  const handleDeleteTool = async (id: string, name: string) => {
    if (!confirm(`Retire "${name}" from master recommendation list?`)) return;
    try {
      const res = await fetch(`/api/admin/tools/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast(`AI Tool "${name}" retired.`);
        loadData();
      }
    } catch {
      showToast("Failed to retire tool");
    }
  };

  // Handle Save Platform Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Platform configurations synced with Supabase!");
      }
    } catch {
      showToast("Failed to update platform settings");
    } finally {
      setSavingSettings(false);
    }
  };

  // Filtered Templates
  const filteredTemplates = templates.filter((t) => {
    const matchesSearch =
      (t.title || "").toLowerCase().includes(tplSearch.toLowerCase()) ||
      (t.desc || t.description || "").toLowerCase().includes(tplSearch.toLowerCase()) ||
      (t.tags || "").toLowerCase().includes(tplSearch.toLowerCase());
    const matchesCat = tplCategoryFilter === "all" || t.category_id === tplCategoryFilter || t.category === tplCategoryFilter;
    return matchesSearch && matchesCat;
  });

  // Calculate count per category
  const getCategoryCount = (catId: string, slug?: string) => {
    return templates.filter((t) => t.category_id === catId || t.category === catId || (slug && t.category === slug)).length;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#060609] text-slate-900 dark:text-slate-100 transition-colors flex flex-col md:flex-row">
      {/* Toast Alert Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[200] flex items-center gap-3 px-5 py-3 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-medium text-sm shadow-2xl animate-in slide-in-from-bottom-4 duration-300 border border-slate-700/50">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Mobile Sidebar Backdrop */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-200"
        />
      )}

      {/* Left Admin Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 md:z-30 h-screen shrink-0 border-r border-slate-200 dark:border-white/10 bg-white dark:bg-[#0c0d14] flex flex-col justify-between transition-all duration-300 ease-in-out ${isSidebarCollapsed ? "w-20" : "w-64"
          } ${isMobileSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full md:translate-x-0"
          }`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Top Brand Header */}
          <div className="p-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between shrink-0">
            {!isSidebarCollapsed ? (
              <div>
                <Link href="/" className="inline-flex items-center gap-1.5 font-black text-xl tracking-tight text-slate-900 dark:text-white">
                  <span>AWA</span>
                </Link>
                <div className="text-[11px] text-slate-400 font-medium -mt-0.5">Admin Console</div>
                <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-300 border border-slate-200 dark:border-white/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                  <span>v1.0 • Master Mode</span>
                </div>
              </div>
            ) : (
              <div className="mx-auto">
                <span className="font-black text-lg text-indigo-600 dark:text-indigo-400">AWA</span>
              </div>
            )}

            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
              title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isSidebarCollapsed ? <ChevronsRight className="w-4 h-4" /> : <ChevronsLeft className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Action CTA Button */}
          {!isSidebarCollapsed && (
            <div className="p-3 pb-1 shrink-0 space-y-1.5">
              <Link
                href="/admin/templates/create"
                onClick={() => setIsMobileSidebarOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 transition-all cursor-pointer group"
              >
                <span>Visual Builder</span>
              </Link>
              <button
                onClick={() => {
                  handleOpenAddTemplate();
                  setIsMobileSidebarOpen(false);
                }}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.05] dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 text-[11px] font-medium transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Quick Modal Add</span>
              </button>
            </div>
          )}

          {/* Navigation Links Scrollable List */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1 scrollbar-thin">
            {SIDEBAR_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const count =
                item.id === "templates"
                  ? templates.length
                  : item.id === "categories"
                    ? categories.length
                    : item.id === "tools"
                      ? tools.length
                      : item.id === "media"
                        ? mediaAssets.length
                        : item.id === "feedback"
                          ? feedback.length
                          : null;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${isActive
                      ? "bg-[#101726] border border-blue-500/35 text-white shadow-sm font-semibold ring-1 ring-blue-500/20"
                      : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
                    } ${isSidebarCollapsed ? "justify-center px-2" : ""}`}
                  title={item.label}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-blue-400" : "text-slate-500"}`} />
                    {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
                  </div>
                  {!isSidebarCollapsed && count !== null && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${isActive
                          ? "bg-blue-600 text-white"
                          : "bg-white/[0.06] text-slate-400"
                        }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Bottom Sidebar User Profile Card */}
          <div className="p-3 border-t border-white/10 shrink-0">
            <div className={`flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/5 ${isSidebarCollapsed ? "justify-center p-1" : ""}`}>
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0 ring-2 ring-blue-500/30">
                  A
                </div>
                {!isSidebarCollapsed && (
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate">Admin</div>
                    <div className="text-[10px] text-slate-400 font-mono -mt-0.5">Master Mode</div>
                  </div>
                )}
              </div>
              {!isSidebarCollapsed && (
                <button
                  type="button"
                  onClick={() => logout()}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Right Content Area */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        {/* Sticky Top Bar Header */}
        <header className="sticky top-0 z-20 border-b border-white/10 bg-[#07080f]/90 backdrop-blur-xl px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          {/* Left: Hamburger & Breadcrumb */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 cursor-pointer"
              title="Open Navigation Menu"
            >
              <Menu className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 text-xs font-medium">
              <Link
                href="/admin"
                className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
                <span>Admin Console</span>
              </Link>
              <span className="text-slate-600">&gt;</span>
              <span className="font-semibold text-white capitalize">
                {SIDEBAR_ITEMS.find((s) => s.id === activeTab)?.label || "Category Editor"}
              </span>
            </div>
          </div>

          {/* Center: Search Box */}
          <div className="flex-1 max-w-md mx-2 hidden sm:block">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={globalSearch}
                onChange={(e) => {
                  setGlobalSearch(e.target.value);
                  setTplSearch(e.target.value);
                }}
                placeholder="Search templates, categories, tools..."
                className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-[#0c0e18] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40 transition-all"
              />
            </div>
          </div>

          {/* Right: Actions & User Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
            >
              {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-400" />}
            </button>

            {/* Notification Bell with Red Badge Dot */}
            <div className="relative">
              <button
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-black" />
              </button>
            </div>

            {/* Refresh */}
            <button
              onClick={loadData}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>

            {/* User Profile Pill / Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowAdminDropdown(!showAdminDropdown)}
                className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full border border-white/10 hover:bg-white/5 transition-colors cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center ring-2 ring-blue-500/30">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
                </div>
                <span className="text-xs font-semibold text-white hidden md:inline">Admin</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showAdminDropdown && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-[#12141c] border border-slate-200 dark:border-white/10 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-white/5">
                    <div className="text-xs font-bold text-slate-900 dark:text-white">{user?.name || "Super Admin"}</div>
                    <div className="text-[11px] text-slate-400 truncate">{user?.email || "admin@awacreatives.com"}</div>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/"
                      target="_blank"
                      className="flex items-center gap-2 px-4 py-2 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Live Customer Store</span>
                    </Link>
                  </div>
                  <div className="border-t border-slate-100 dark:border-white/5 pt-1">
                    <button
                      onClick={() => logout()}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 font-medium transition-colors cursor-pointer text-left"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Tab Panels Container */}
        <main className="flex-1 p-4 sm:p-8 max-w-[1600px] w-full mx-auto">

          {/* ========================================================================= */}
          {/* TAB 1: OVERVIEW & KPIS */}
          {/* ========================================================================= */}
          {activeTab === "overview" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              {/* Metric KPI Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="p-6 rounded-3xl bg-white/80 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Users</span>
                    <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-3xl font-extrabold tracking-tight mb-1">{stats?.totalUsers ?? 0}</div>
                  <div className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1 font-medium">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>Registered accounts</span>
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-white/80 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Revenue</span>
                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                      <Banknote className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-3xl font-extrabold tracking-tight mb-1 text-emerald-500">{stats?.totalRevenue ?? "₹0"}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Lifetime PRO sales</div>
                </div>

                <div className="p-6 rounded-3xl bg-white/80 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Blueprints</span>
                    <div className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                      <FileCode className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-3xl font-extrabold tracking-tight mb-1">{stats?.totalTemplates ?? templates.length}</div>
                  <div className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>100% Synced to Supabase</span>
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-white/80 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Media Assets</span>
                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                      <ImageIcon className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-3xl font-extrabold tracking-tight mb-1">{mediaAssets.length}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Images in /public/uploads</div>
                </div>

                <div className="p-6 rounded-3xl bg-white/80 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Active Categories</span>
                    <div className="w-8 h-8 rounded-full bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
                      <FolderTree className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-3xl font-extrabold tracking-tight mb-1">{stats?.totalCategories ?? categories.length}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">6 Canonical Categories</div>
                </div>

                <div className="p-6 rounded-3xl bg-white/80 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">AI Tool Models</span>
                    <div className="w-8 h-8 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center">
                      <Cpu className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-3xl font-extrabold tracking-tight mb-1">{stats?.totalTools ?? tools.length}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Midjourney, Claude, v0, FLUX</div>
                </div>

                <div className="p-6 rounded-3xl bg-white/80 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Prompt Copies</span>
                    <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center">
                      <Copy className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-3xl font-extrabold tracking-tight mb-1">{stats?.totalCopies ?? 3420}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Real-time copy telemetry</div>
                </div>
              </div>

              {/* Quick Actions & Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Actions Panel */}
                <div className="p-6 rounded-3xl bg-white/80 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10">
                  <h3 className="text-base font-bold mb-4 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-500" />
                    <span>Authoring Actions</span>
                  </h3>
                  <div className="space-y-3">
                    <Link
                      href="/admin/templates/create"
                      className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-500/20 cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span>Launch Visual Template Builder</span>
                      </span>
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>

                    <button
                      onClick={() => {
                        setEditingTemplate(null);
                        setTplForm(getInitialTplForm());
                        setShowAddTemplateModal(true);
                      }}
                      className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-100 dark:bg-white/[0.05] hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 font-medium text-xs transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        <span>Quick Author Modal</span>
                      </span>
                      <ArrowUpRight className="w-4 h-4 text-slate-400" />
                    </button>

                    <button
                      onClick={() => setActiveTab("media")}
                      className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/40 font-medium text-xs transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <UploadCloud className="w-4 h-4" />
                        <span>Media Library &amp; Upload Images</span>
                      </span>
                      <ImageIcon className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        setEditingCategory(null);
                        setCatForm({ name: "", slug: "", description: "", icon: "Layout", sort_order: categories.length + 1 });
                        setShowCategoryModal(true);
                      }}
                      className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 font-medium text-xs transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <FolderPlus className="w-4 h-4" />
                        <span>Create New Category</span>
                      </span>
                      <FolderTree className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        setEditingTool(null);
                        setToolForm({ name: "", category: "image", website_url: "", description: "" });
                        setShowToolModal(true);
                      }}
                      className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 font-medium text-xs transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        <span>Register AI Tool to Master List</span>
                      </span>
                      <Cpu className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Live Catalog Status */}
                <div className="lg:col-span-2 p-6 rounded-3xl bg-white/80 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10">
                  <h3 className="text-base font-bold mb-4 flex items-center justify-between">
                    <span>Recent Prompt Blueprints</span>
                    <button
                      onClick={() => setActiveTab("templates")}
                      className="text-xs text-indigo-500 hover:underline cursor-pointer"
                    >
                      View All ({templates.length})
                    </button>
                  </h3>

                  <div className="space-y-3">
                    {templates.slice(0, 5).map((t) => (
                      <div
                        key={t.id}
                        className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02]"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-200 dark:bg-zinc-800 shrink-0">
                            {t.image_url || t.img ? (
                              <img src={t.image_url || t.img} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <FileCode className="w-5 h-5 m-2.5 text-slate-400" />
                            )}
                          </div>
                          <div>
                            <div className="text-xs font-bold">{t.title}</div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                              {t.category_id || t.category || "General"} • {t.featured || t.isPro ? "PRO" : "FREE"}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setPreviewTemplate(t)}
                            title="Admin Inspector"
                            className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: BLUEPRINTS & PROMPTS (FEAT-030) */}
          {/* ========================================================================= */}
          {activeTab === "templates" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Header with Title Banner from Screenshot */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-300 border border-slate-200 dark:border-white/10 mb-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                    <span>FEAT-030 • AUTHORING CONSOLE</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    Templates &amp; Prompts Authoring
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Author finished, ready-to-use prompt text. No guided input fields or fill-in-the-blanks.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href="/admin/templates/create"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
                  >
                    <span>Visual Builder</span>
                  </Link>

                  <button
                    onClick={() => {
                      setEditingTemplate(null);
                      setTplForm(getInitialTplForm());
                      setShowAddTemplateModal(true);
                    }}
                    className="inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.06] dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Quick Add</span>
                  </button>
                </div>
              </div>

              {/* Strict Authoring Standard Notice Banner */}
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 text-xs">
                <Shield className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>
                  <strong className="text-slate-900 dark:text-white">Strict Authoring Standard:</strong> All AWA prompts must be 100% complete and ready-to-run verbatim. Never use placeholder brackets like &quot;[Insert Brand Name Here]&quot; or guided blanks.
                </span>
              </div>

              {/* Two Column Layout: Main Templates Datagrid on Left, Guidelines on Right */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                {/* Left (2 Columns): Search & Datagrid Table */}
                <div className="lg:col-span-2 space-y-4">
                  {/* Search and Category Filter Bar */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search templates by title, description, or tags..."
                        value={tplSearch}
                        onChange={(e) => setTplSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-xs focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <select
                      value={tplCategoryFilter}
                      onChange={(e) => setTplCategoryFilter(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-white dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-xs focus:outline-none focus:border-indigo-500"
                    >
                      <option value="all">All Categories ({templates.length})</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Template Datagrid Table */}
                  <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#11131c]">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-white/[0.02] text-slate-500 font-mono uppercase tracking-wider text-[10px]">
                          <th className="py-3 px-4">Blueprint</th>
                          <th className="py-3 px-4">Category</th>
                          <th className="py-3 px-4">Recommended Tool</th>
                          <th className="py-3 px-4">Tier</th>
                          <th className="py-3 px-4">Copies</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                        {filteredTemplates.map((t) => (
                          <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                            <td className="py-3 px-4">
                              <div
                                onClick={() => setPreviewTemplate(t)}
                                className="flex items-center gap-3 cursor-pointer group"
                                title="Click to inspect blueprint"
                              >
                                <img
                                  src={t.image_url || t.img || "/cyber_dashboard.jpg"}
                                  alt=""
                                  className="w-10 h-10 rounded-xl object-cover shrink-0 bg-slate-200 dark:bg-zinc-800 group-hover:scale-105 transition-transform"
                                />
                                <div>
                                  <div className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{t.title}</div>
                                  <div className="text-[11px] text-slate-500 line-clamp-1 max-w-xs">{t.desc || t.description}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-400">
                              <div className="font-medium capitalize">{t.category_id || t.category}</div>
                              {t.subcategory && (
                                <span className="inline-block mt-1 text-[10px] font-sans px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold border border-indigo-500/20">
                                  {t.subcategory}
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                              {t.tool || "Midjourney v6.1"}
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${t.featured || t.isPro
                                    ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                                    : "bg-slate-200 text-slate-700 dark:bg-white/10 dark:text-slate-300"
                                  }`}
                              >
                                {t.featured || t.isPro ? "PRO" : "FREE"}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-mono text-slate-500">{t.copy_count || t.copies || 0}</td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <Link
                                  href={`/admin/templates/create?edit=${t.id}`}
                                  title="Open in Visual Builder"
                                  className="p-1.5 rounded-lg hover:bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 cursor-pointer"
                                >
                                  <Sparkles className="w-3.5 h-3.5" />
                                </Link>
                                <button
                                  type="button"
                                  onClick={() => setPreviewTemplate(t)}
                                  title="Admin Inspector"
                                  className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 cursor-pointer"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditTemplate(t)}
                                  title="Quick Edit"
                                  className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 cursor-pointer"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteTemplate(t.id, t.title)}
                                  title="Delete"
                                  className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-500 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Right (1 Column): Authoring Guidelines & Pro Tips from Screenshot */}
                <div className="space-y-4">
                  {/* Authoring Guidelines Card */}
                  <div className="p-5 rounded-2xl bg-white dark:bg-[#11131c] border border-slate-200 dark:border-white/10 shadow-sm">
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
                      <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      <span>Authoring Guidelines</span>
                    </h3>
                    <ul className="space-y-2.5 text-[11px] text-slate-600 dark:text-zinc-400">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                        <span>Provide complete, ready-to-run prompt text</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                        <span>Be specific with parameters and details</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                        <span>Include camera settings where relevant</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                        <span>Avoid placeholder brackets or blanks</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                        <span>Test the prompt before publishing</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                        <span>Write a clear and concise description</span>
                      </li>
                    </ul>
                  </div>

                  {/* Pro Tips Card */}
                  <div className="p-5 rounded-2xl bg-white dark:bg-[#11131c] border border-slate-200 dark:border-white/10 shadow-sm">
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
                      <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>Pro Tips</span>
                    </h3>
                    <ul className="space-y-2 text-[11px] text-slate-600 dark:text-zinc-400 leading-relaxed list-disc list-inside">
                      <li>Include specific styles, lighting, and composition</li>
                      <li>Add technical parameters (camera, aspect ratio, etc.)</li>
                      <li>Mention the intended use case</li>
                      <li>Keep descriptions clear and user-friendly</li>
                      <li>Ensure the prompt works with the selected tool</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: MEDIA & IMAGE ASSETS LIBRARY */}
          {/* ========================================================================= */}
          {activeTab === "media" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              {/* Header & Storage Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-emerald-500" />
                    <span>Media Assets &amp; Image Library</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Upload, inspect, copy links, and attach images to prompt blueprints and categories.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono px-3 py-1.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                    Storage: /public/uploads/ ({mediaAssets.length} Assets)
                  </span>
                  <button
                    type="button"
                    onClick={() => mediaTabFileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 font-semibold text-xs shadow-sm transition-colors cursor-pointer"
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>{uploadingImage ? "Uploading..." : "Upload New Image"}</span>
                  </button>
                  <input
                    type="file"
                    ref={mediaTabFileInputRef}
                    accept="image/*"
                    onChange={handleMediaTabUpload}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Drag & Drop Visual Upload Dropzone */}
              <div
                onClick={() => mediaTabFileInputRef.current?.click()}
                className="group relative border-2 border-dashed border-emerald-500/30 hover:border-emerald-500 bg-emerald-500/[0.02] hover:bg-emerald-500/[0.05] dark:bg-emerald-500/[0.03] dark:hover:bg-emerald-500/[0.06] rounded-3xl p-8 sm:p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                  Drop your image file here or <span className="text-emerald-500 underline">browse files</span>
                </h4>
                <p className="text-xs text-slate-400 max-w-sm mb-3">
                  Supports PNG, JPG, JPEG, WebP, SVG, and GIF up to 15MB. Automatically saved to production storage.
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-mono bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500">
                  <Check className="w-3 h-3 text-emerald-500" />
                  <span>Instant CDN linking &amp; Blueprint association ready</span>
                </div>
              </div>

              {/* Search & Media Counter */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
                <div className="relative max-w-md w-full">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search assets by file name..."
                    value={mediaSearch}
                    onChange={(e) => setMediaSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-2xl bg-white dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="text-xs text-slate-500 font-mono">
                  Showing {mediaAssets.filter((m) => m.name.toLowerCase().includes(mediaSearch.toLowerCase())).length} of{" "}
                  {mediaAssets.length} image assets
                </div>
              </div>

              {/* Media Assets Gallery Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {mediaAssets
                  .filter((m) => m.name.toLowerCase().includes(mediaSearch.toLowerCase()))
                  .map((asset) => (
                    <div
                      key={asset.id}
                      className="group rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-white/[0.03] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                    >
                      {/* Image Preview Container */}
                      <div className="relative aspect-video w-full bg-slate-900 overflow-hidden flex items-center justify-center">
                        <img
                          src={asset.url}
                          alt={asset.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-mono bg-black/70 text-slate-200 backdrop-blur-md border border-white/10">
                          {(asset.size / 1024).toFixed(0)} KB
                        </div>
                        <a
                          href={asset.url}
                          target="_blank"
                          rel="noreferrer"
                          title="View Fullscreen"
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>

                      {/* Metadata & Actions */}
                      <div className="p-4 space-y-3">
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white truncate" title={asset.name}>
                            {asset.name}
                          </div>
                          <div className="text-[10px] font-mono text-slate-400 truncate">
                            {asset.url}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100 dark:border-white/5">
                          <button
                            type="button"
                            onClick={() => handleCopyImageUrl(asset.url)}
                            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-[11px] font-medium transition-colors cursor-pointer"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy URL</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setEditingTemplate(null);
                              const isVid = Boolean(asset.url?.endsWith(".mp4") || asset.url?.endsWith(".webm"));
                              setTplForm({
                                ...getInitialTplForm(),
                                title: asset.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " "),
                                desc: "Custom blueprint authored from uploaded media asset.",
                                img: asset.url,
                                mediaType: isVid ? "video" : "image",
                                videoUrl: isVid ? asset.url : "",
                              });
                              setShowAddTemplateModal(true);
                            }}
                            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-medium transition-colors cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Use in Blueprint</span>
                          </button>

                          {asset.url.startsWith("/uploads/") && (
                            <button
                              type="button"
                              onClick={() => handleDeleteMediaAsset(asset.name)}
                              title="Delete Image File"
                              className="p-1.5 rounded-xl hover:bg-red-500/10 text-red-500 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: CATEGORY WISE EDITOR (FEAT-029) */}
          {/* ========================================================================= */}
          {activeTab === "categories" && (() => {
            const activeCategoryObj =
              categories.find((c) => c.id === selectedCategoryTab || c.slug === selectedCategoryTab) ||
              categories[0] || {
                id: "image",
                slug: "image",
                name: "Image",
                description: "Digital photographic, conceptual, and illustrative art generations.",
              };

            const catBlueprints = templates.filter((t) => {
              if (selectedCategoryTab === "all") return true;
              const tCat = (t.category_id || t.category || "").toLowerCase();
              const target = selectedCategoryTab.toLowerCase();
              return tCat === target || (activeCategoryObj && tCat === (activeCategoryObj.slug || "").toLowerCase());
            }).filter((t) => {
              if (!catWiseSearch.trim()) return true;
              const q = catWiseSearch.toLowerCase();
              return (
                t.title?.toLowerCase().includes(q) ||
                t.desc?.toLowerCase().includes(q) ||
                t.description?.toLowerCase().includes(q) ||
                t.tool?.toLowerCase().includes(q)
              );
            });

            const currentGuidancePreset = getCategoryGuidancePreset(activeCategoryObj.slug || activeCategoryObj.name);

            return (
              <div className="space-y-6 animate-in fade-in duration-300">
                {/* 1. Category Management Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-blue-500 tracking-wider uppercase mb-1">
                      <span>+ CATEGORY MANAGEMENT</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                      Category Editor
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">
                      Organize templates by category, define execution guidance, and manage blueprint structure.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingCategory(null);
                      setCatForm({ name: "", slug: "", description: "", icon: "Layout", sort_order: categories.length + 1 });
                      setShowCategoryModal(true);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-500/25 transition-all cursor-pointer shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>New Category</span>
                  </button>
                </div>

                {/* 2. Horizontal Category Carousel Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  {[
                    {
                      id: "image",
                      slug: "image",
                      name: "Image",
                      displayName: "Image Generation",
                      icon: ImageIcon,
                      img: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=600&auto=format&fit=crop",
                      fallbackCount: 11,
                    },
                    {
                      id: "video",
                      slug: "video",
                      name: "Video",
                      displayName: "Video Generation",
                      icon: Film,
                      img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop",
                      fallbackCount: 7,
                    },
                    {
                      id: "website",
                      slug: "website",
                      name: "Website",
                      displayName: "Website Generation",
                      icon: Globe,
                      img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop",
                      fallbackCount: 15,
                    },
                    {
                      id: "slides",
                      slug: "slides",
                      name: "Slides",
                      displayName: "Slides & Presentations",
                      icon: Presentation,
                      img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop",
                      fallbackCount: 5,
                    },
                    {
                      id: "poster",
                      slug: "poster",
                      name: "Posters & Designs",
                      displayName: "Posters & Graphic Design",
                      icon: Palette,
                      img: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600&auto=format&fit=crop",
                      fallbackCount: 8,
                    },
                  ].map((cat) => {
                    const isSelected = (activeCategoryObj.slug || activeCategoryObj.id || "image").toLowerCase() === cat.slug;
                    const count = getCategoryCount(cat.id, cat.slug);
                    const CatIcon = cat.icon;

                    return (
                      <div
                        key={cat.id}
                        onClick={() => {
                          setSelectedCategoryTab(cat.slug);
                          setActiveGuidanceStepIndex(0);
                        }}
                        className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all border ${isSelected
                            ? "border-blue-500 bg-[#0d1628] shadow-lg shadow-blue-500/15 ring-1 ring-blue-500/40"
                            : "border-white/10 bg-[#0c0e18] hover:border-white/20 hover:bg-white/[0.03]"
                          }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={cat.img}
                            alt={cat.name}
                            className="w-12 h-12 rounded-xl object-cover bg-black/40 shrink-0 border border-white/10"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-white truncate">
                              <CatIcon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? "text-blue-400" : "text-slate-400"}`} />
                              <span className="truncate">{cat.name}</span>
                            </div>
                            <div className="text-[11px] text-slate-400 font-normal mt-0.5">
                              {count || cat.fallbackCount} Templates
                            </div>
                          </div>
                        </div>

                        <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isSelected ? "text-blue-400 translate-x-0.5" : "text-slate-500"}`} />
                      </div>
                    );
                  })}
                </div>

                {/* VIEW 1: CATEGORY WISE WORKSPACE (2-COLUMN ARCHITECTURE) */}
                {categoryEditorViewMode === "category_wise" && (
                  <div className="space-y-6">
                    {(() => {
                      const defaultSubcatsByCategory: Record<string, { name: string; img: string; count: number }[]> = {
                        image: [
                          { name: "Portraits & Characters", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80", count: 24 },
                          { name: "3D Renders & Abstract", img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80", count: 18 },
                          { name: "Posters & Typography", img: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=200&auto=format&fit=crop&q=80", count: 12 },
                          { name: "Landscapes & Scenery", img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=200&auto=format&fit=crop&q=80", count: 15 },
                          { name: "Product Showcases", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&auto=format&fit=crop&q=80", count: 20 },
                          { name: "Anime & Concept Art", img: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=200&auto=format&fit=crop&q=80", count: 16 },
                        ],
                        video: [
                          { name: "Cinematic Reels", img: "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=200&auto=format&fit=crop&q=80", count: 14 },
                          { name: "YouTube Shorts", img: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=200&auto=format&fit=crop&q=80", count: 19 },
                          { name: "Commercial Ads", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&auto=format&fit=crop&q=80", count: 11 },
                          { name: "Music Visualizers", img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&auto=format&fit=crop&q=80", count: 8 },
                          { name: "3D Product Motion", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&auto=format&fit=crop&q=80", count: 12 },
                          { name: "AI Avatars", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80", count: 9 },
                        ],
                        website: [
                          { name: "SaaS Landing Pages", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&auto=format&fit=crop&q=80", count: 28 },
                          { name: "Portfolios", img: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=200&auto=format&fit=crop&q=80", count: 22 },
                          { name: "E-Commerce", img: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=200&auto=format&fit=crop&q=80", count: 17 },
                          { name: "Agency Portals", img: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=200&auto=format&fit=crop&q=80", count: 14 },
                          { name: "Web3 Dashboards", img: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=200&auto=format&fit=crop&q=80", count: 13 },
                          { name: "Mobile Web Apps", img: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=200&auto=format&fit=crop&q=80", count: 16 },
                        ],
                        slides: [
                          { name: "Pitch Decks", img: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=200&auto=format&fit=crop&q=80", count: 21 },
                          { name: "Executive Summaries", img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=200&auto=format&fit=crop&q=80", count: 15 },
                          { name: "Keynote Presentations", img: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=200&auto=format&fit=crop&q=80", count: 18 },
                          { name: "Educational Slides", img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=200&auto=format&fit=crop&q=80", count: 12 },
                          { name: "Investor Reports", img: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=200&auto=format&fit=crop&q=80", count: 9 },
                          { name: "Creative Showcases", img: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=200&auto=format&fit=crop&q=80", count: 14 },
                        ],
                        posters: [
                          { name: "Event Flyers", img: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=200&auto=format&fit=crop&q=80", count: 19 },
                          { name: "Social Media Banners", img: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=200&auto=format&fit=crop&q=80", count: 25 },
                          { name: "Brand Identity", img: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=200&auto=format&fit=crop&q=80", count: 16 },
                          { name: "Album Artwork", img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=200&auto=format&fit=crop&q=80", count: 11 },
                          { name: "Minimalist Posters", img: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=200&auto=format&fit=crop&q=80", count: 14 },
                          { name: "Magazine Covers", img: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80", count: 10 },
                        ],
                      };

                      const activeSlug = (activeCategoryObj.slug || activeCategoryObj.id || "image").toLowerCase();
                      const fallbackSubcats = defaultSubcatsByCategory[activeSlug] || defaultSubcatsByCategory.image;
                      const customSubcats = subcategoriesMap[activeCategoryObj.id] || subcategoriesMap[activeCategoryObj.slug] || [];
                      const activeSubcategories = [
                        ...fallbackSubcats,
                        ...customSubcats
                          .filter((cs: any) => !fallbackSubcats.some((fs) => fs.name.toLowerCase() === cs.name?.toLowerCase()))
                          .map((cs: any) => ({
                            name: cs.name,
                            img: fallbackSubcats[0]?.img || "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=200&auto=format&fit=crop&q=80",
                            count: 1,
                          })),
                      ];

                      const activeStepData = currentGuidancePreset[activeGuidanceStepIndex] || currentGuidancePreset[0] || {
                        step: "01",
                        phase: "Concept & Direction",
                        title: "Establish Visual Theme",
                        desc: "Define core visual idea, target mood, and aesthetic foundation before drafting.",
                        examplePrompt: "ultra realistic close-up portrait of a cybernetic visionary, cinematic lighting, 8k resolution --ar 16:9",
                        imgUrl: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800&auto=format&fit=crop",
                      };

                      const categoryDisplayNames: Record<string, string> = {
                        image: "Image Generation",
                        video: "Video Generation",
                        website: "Website Generation",
                        slides: "Slides & Presentations",
                        posters: "Posters & Graphic Design",
                        poster: "Posters & Graphic Design",
                      };

                      const categoryDescriptions: Record<string, string> = {
                        image: "High-resolution visual assets, realistic textures, artistic styles, and generative workflows for digital media creation.",
                        video: "Dynamic cinematic sequences, motion camera movements, realistic lighting transitions, and temporal video workflows.",
                        website: "Interactive modern web UI components, responsive hero layouts, design systems, and code-ready full-page flows.",
                        slides: "Clean pitch decks, executive slide frameworks, infographics, and storytelling visuals for business impact.",
                        posters: "High-impact visual advertising layouts, typography hierarchies, brand identity motifs, and print-ready compositions.",
                        poster: "High-impact visual advertising layouts, typography hierarchies, brand identity motifs, and print-ready compositions.",
                      };

                      const categoryThumbnails: Record<string, string> = {
                        image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=600&auto=format&fit=crop",
                        video: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop",
                        website: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop",
                        slides: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop",
                        posters: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600&auto=format&fit=crop",
                        poster: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600&auto=format&fit=crop",
                      };

                      const currentDisplayName = categoryDisplayNames[activeSlug] || activeCategoryObj.name || "Image Generation";
                      const currentDescription = activeCategoryObj.description || categoryDescriptions[activeSlug] || "High-resolution visual assets and prompt blueprints.";
                      const currentThumbnail = categoryThumbnails[activeSlug] || categoryThumbnails.image;
                      const isCategoryActive = categoryStatusMap[activeSlug] !== false;

                      return (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                          {/* ========================================================= */}
                          {/* LEFT COLUMN (COL-SPAN-8): BANNER, SUBCATS, GUIDANCE */}
                          {/* ========================================================= */}
                          <div className="lg:col-span-8 space-y-6">
                            {/* 1. Category Banner Card */}
                            <div className="p-6 rounded-2xl bg-[#0c0e18] border border-white/10 relative overflow-hidden shadow-lg shadow-black/40">
                              <div className="flex items-center justify-between gap-3 mb-4">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-xs px-2.5 py-1 rounded-lg bg-blue-600/15 text-blue-400 font-bold border border-blue-500/30">
                                    /{activeCategoryObj.slug}
                                  </span>
                                  <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    <span>Active Category</span>
                                  </span>
                                </div>

                                <div className="flex items-center gap-2">
                                  <Link
                                    href={`/?category=${activeCategoryObj.slug}`}
                                    target="_blank"
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white font-medium text-xs border border-white/10 transition-colors"
                                  >
                                    <span>Preview</span>
                                    <ExternalLink className="w-3.5 h-3.5" />
                                  </Link>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingCategory(activeCategoryObj);
                                      setCatForm({
                                        name: activeCategoryObj.name || "",
                                        slug: activeCategoryObj.slug || "",
                                        description: activeCategoryObj.description || "",
                                        icon: activeCategoryObj.icon || "Layout",
                                        sort_order: activeCategoryObj.sort_order || 1,
                                      });
                                      setShowCategoryModal(true);
                                    }}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white font-medium text-xs border border-white/10 transition-colors cursor-pointer"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                    <span>Edit Settings</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingCategory(activeCategoryObj);
                                      setShowCategoryModal(true);
                                    }}
                                    className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
                                  >
                                    <MoreHorizontal className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                                {currentDisplayName}
                              </h2>
                              <p className="text-xs text-slate-400 leading-relaxed mt-1 max-w-2xl">
                                {currentDescription}
                              </p>
                            </div>

                            {/* 2. Subcategories Section */}
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <h3 className="text-sm font-bold text-white">Subcategories</h3>
                                <button
                                  type="button"
                                  onClick={() => setShowSubcatAddInput(!showSubcatAddInput)}
                                  className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer transition-colors"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>Add Subcategory</span>
                                </button>
                              </div>

                              {showSubcatAddInput && (
                                <div className="p-3 rounded-xl bg-[#0c0e18] border border-blue-500/30 flex items-center gap-2 animate-in fade-in duration-200">
                                  <input
                                    type="text"
                                    placeholder="Subcategory name (e.g. Cyberpunk Characters)"
                                    value={inlineSubcatName}
                                    onChange={(e) => setInlineSubcatName(e.target.value)}
                                    onKeyDown={async (e) => {
                                      if (e.key === "Enter" && inlineSubcatName.trim()) {
                                        e.preventDefault();
                                        await handleAddSubcategory(activeCategoryObj.id, inlineSubcatName.trim());
                                        setInlineSubcatName("");
                                        setShowSubcatAddInput(false);
                                      }
                                    }}
                                    className="flex-1 px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                                  />
                                  <button
                                    type="button"
                                    onClick={async () => {
                                      if (inlineSubcatName.trim()) {
                                        await handleAddSubcategory(activeCategoryObj.id, inlineSubcatName.trim());
                                        setInlineSubcatName("");
                                        setShowSubcatAddInput(false);
                                      }
                                    }}
                                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors cursor-pointer"
                                  >
                                    Save
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setShowSubcatAddInput(false)}
                                    className="px-3 py-1.5 rounded-lg bg-white/[0.04] text-slate-400 hover:text-white text-xs transition-colors cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              )}

                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {activeSubcategories.map((sub, sIdx) => (
                                  <div
                                    key={sIdx}
                                    className="flex items-center gap-3 p-2.5 rounded-xl bg-[#0c0e18] border border-white/10 hover:border-blue-500/40 transition-all group cursor-pointer"
                                  >
                                    <img
                                      src={sub.img}
                                      alt={sub.name}
                                      className="w-10 h-10 rounded-lg object-cover bg-black/40 shrink-0 border border-white/10 group-hover:scale-105 transition-transform"
                                    />
                                    <div className="min-w-0">
                                      <div className="text-xs font-semibold text-white truncate group-hover:text-blue-400 transition-colors">
                                        {sub.name}
                                      </div>
                                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                                        {sub.count} Templates
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* 3. Execution Guidance Blueprint */}
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="text-sm font-bold text-white">Execution Guidance</h3>
                                  <div className="text-xs text-slate-400 mt-0.5">
                                    Default blueprint for {activeCategoryObj.name} ({currentGuidancePreset.length} steps)
                                  </div>
                                </div>
                              </div>

                              {/* Connected 7-Step Stepper Bar */}
                              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
                                {currentGuidancePreset.map((step, idx) => {
                                  const isActive = activeGuidanceStepIndex === idx;
                                  return (
                                    <div key={idx} className="flex items-center gap-1.5 shrink-0">
                                      <button
                                        type="button"
                                        onClick={() => setActiveGuidanceStepIndex(idx)}
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${isActive
                                            ? "bg-blue-600 text-white ring-2 ring-blue-500/40 shadow-lg shadow-blue-500/25"
                                            : "bg-[#0c0e18] text-slate-400 hover:text-white border border-white/10 hover:border-white/20"
                                          }`}
                                      >
                                        <span
                                          className={`w-4 h-4 rounded-full text-[10px] font-mono flex items-center justify-center font-bold ${isActive ? "bg-white text-blue-600" : "bg-white/10 text-slate-300"
                                            }`}
                                        >
                                          {idx + 1}
                                        </span>
                                        <span>{step.phase || step.title}</span>
                                      </button>
                                      {idx < currentGuidancePreset.length - 1 && (
                                        <div className="w-3 h-[1px] bg-white/15 shrink-0" />
                                      )}
                                    </div>
                                  );
                                })}
                              </div>

                              {/* Active Step Showcase Card */}
                              <div className="p-5 rounded-2xl bg-[#0c0e18] border border-white/10 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                                  {/* Left / Center Info */}
                                  <div className="md:col-span-7 space-y-4">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="text-[10px] font-bold font-mono tracking-wider px-2 py-0.5 rounded bg-blue-600/20 text-blue-400 border border-blue-500/30 uppercase">
                                        Step {activeStepData.step} • {activeStepData.phase}
                                      </span>
                                      <span className="text-xs font-semibold text-white">
                                        {activeStepData.title}
                                      </span>
                                    </div>

                                    <div className="space-y-1.5">
                                      <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                                        Instructions
                                      </div>
                                      <p className="text-xs text-slate-300 leading-relaxed">
                                        {activeStepData.desc}
                                      </p>
                                    </div>

                                    {activeStepData.examplePrompt && (
                                      <div className="space-y-1.5">
                                        <div className="flex items-center justify-between">
                                          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                                            Example Prompt
                                          </span>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              navigator.clipboard.writeText(activeStepData.examplePrompt || "");
                                              setCopiedGuidanceStepPrompt(true);
                                              setTimeout(() => setCopiedGuidanceStepPrompt(false), 2000);
                                            }}
                                            className="text-[11px] font-mono text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer transition-colors"
                                          >
                                            {copiedGuidanceStepPrompt ? (
                                              <Check className="w-3 h-3 text-emerald-400" />
                                            ) : (
                                              <Copy className="w-3 h-3" />
                                            )}
                                            <span>{copiedGuidanceStepPrompt ? "Copied" : "Copy"}</span>
                                          </button>
                                        </div>
                                        <div className="p-3 rounded-xl bg-[#07080d] border border-white/10 font-mono text-[11px] text-slate-300 leading-relaxed break-words select-all">
                                          {activeStepData.examplePrompt}
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                  {/* Right Image Showcase */}
                                  <div className="md:col-span-5">
                                    <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black/60 group shadow-md">
                                      <img
                                        src={activeStepData.imgUrl || "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800&auto=format&fit=crop"}
                                        alt={activeStepData.title}
                                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                                      />
                                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                                        <span className="text-[10px] font-mono text-slate-300 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded border border-white/10">
                                          Sample Output • Midjourney v6
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* ========================================================= */}
                          {/* RIGHT COLUMN (COL-SPAN-4): INFO, STATS, DANGER ZONE */}
                          {/* ========================================================= */}
                          <div className="lg:col-span-4 space-y-5">
                            {/* 1. Category Information Card */}
                            <div className="p-5 rounded-2xl bg-[#0c0e18] border border-white/10 space-y-4 shadow-lg shadow-black/30">
                              <h3 className="text-sm font-bold text-white">Category Information</h3>

                              <div className="space-y-1.5">
                                <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                                  Category Slug
                                </label>
                                <div className="px-3 py-2 rounded-xl bg-[#07080d] border border-white/10 font-mono text-xs text-blue-400 font-bold flex items-center justify-between">
                                  <span>/{activeCategoryObj.slug}</span>
                                  <span className="text-[10px] font-mono text-slate-500">Read-only</span>
                                </div>
                              </div>

                              <div className="space-y-1.5">
                                <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                                  Display Name
                                </label>
                                <div className="px-3 py-2 rounded-xl bg-[#07080d] border border-white/10 text-xs text-white font-medium">
                                  {currentDisplayName}
                                </div>
                              </div>

                              <div className="space-y-1.5">
                                <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                                  Description
                                </label>
                                <div className="p-3 rounded-xl bg-[#07080d] border border-white/10 text-xs text-slate-300 leading-relaxed">
                                  {currentDescription}
                                </div>
                              </div>

                              <div className="space-y-1.5">
                                <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                                  Icon & Visual
                                </label>
                                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#07080d] border border-white/10">
                                  <div className="flex items-center gap-3">
                                    <img
                                      src={currentThumbnail}
                                      alt=""
                                      className="w-10 h-10 rounded-lg object-cover border border-white/10"
                                    />
                                    <div className="text-xs font-semibold text-white">
                                      {activeCategoryObj.name} Cover
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingCategory(activeCategoryObj);
                                      setShowCategoryModal(true);
                                    }}
                                    className="px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white bg-white/[0.05] hover:bg-white/10 border border-white/10 rounded-lg transition-colors cursor-pointer"
                                  >
                                    Change
                                  </button>
                                </div>
                              </div>

                              <div className="flex items-center justify-between pt-1">
                                <div>
                                  <div className="text-xs font-bold text-white">Active Category</div>
                                  <div className="text-[10px] text-slate-400">Enable in user catalog</div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setCategoryStatusMap((prev) => ({
                                      ...prev,
                                      [activeSlug]: !isCategoryActive,
                                    }));
                                    showToast(`Category status set to ${!isCategoryActive ? "active" : "inactive"}`);
                                  }}
                                  className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${isCategoryActive ? "bg-blue-600" : "bg-slate-700"
                                    }`}
                                >
                                  <div
                                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${isCategoryActive ? "translate-x-5" : "translate-x-0"
                                      }`}
                                  />
                                </button>
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  showToast(`Saved settings for ${activeCategoryObj.name}!`);
                                }}
                                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs text-center shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
                              >
                                Save Changes
                              </button>
                            </div>

                            {/* 2. Category Stats Card */}
                            <div className="p-5 rounded-2xl bg-[#0c0e18] border border-white/10 space-y-3 shadow-lg shadow-black/30">
                              <h3 className="text-sm font-bold text-white">Category Stats</h3>
                              <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 rounded-xl bg-[#07080d] border border-white/10">
                                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                                    Templates
                                  </div>
                                  <div className="text-xl font-black text-white mt-1">
                                    {catBlueprints.length}
                                  </div>
                                </div>
                                <div className="p-3 rounded-xl bg-[#07080d] border border-white/10">
                                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                                    Total Steps
                                  </div>
                                  <div className="text-xl font-black text-white mt-1">
                                    {currentGuidancePreset.length}
                                  </div>
                                </div>
                                <div className="p-3 rounded-xl bg-[#07080d] border border-white/10">
                                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                                    Subcategories
                                  </div>
                                  <div className="text-xl font-black text-white mt-1">
                                    {activeSubcategories.length}
                                  </div>
                                </div>
                                <div className="p-3 rounded-xl bg-[#07080d] border border-white/10">
                                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                                    Last Updated
                                  </div>
                                  <div className="text-xs font-semibold text-white mt-2">
                                    Today, 2:40 PM
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* 3. Danger Zone */}
                            <button
                              type="button"
                              onClick={() => handleDeleteCategory(activeCategoryObj.id, activeCategoryObj.name)}
                              className="w-full py-2.5 rounded-xl border border-red-500/30 hover:border-red-500/50 hover:bg-red-500/10 text-red-400 font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete Category</span>
                            </button>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Category Blueprints Datagrid Header & Filter */}
                    <div className="space-y-4 pt-4 border-t border-white/10">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <h4 className="text-base font-bold text-white flex items-center gap-2">
                            <span>Blueprints in Category</span>
                            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-blue-600/20 text-blue-400 font-semibold border border-blue-500/30">
                              {catBlueprints.length}
                            </span>
                          </h4>
                        </div>

                        <div className="relative max-w-sm w-full">
                          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                          <input
                            type="text"
                            placeholder="Filter blueprints in this category..."
                            value={catWiseSearch}
                            onChange={(e) => setCatWiseSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#0c0e18] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>

                      {/* Blueprints Table */}
                      {catBlueprints.length > 0 ? (
                        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#0c0e18] shadow-lg shadow-black/30">
                          <table className="w-full text-left text-xs">
                            <thead>
                              <tr className="border-b border-white/10 bg-[#07080d] text-slate-400 font-mono uppercase tracking-wider text-[10px]">
                                <th className="py-3.5 px-4 font-bold">Blueprint</th>
                                <th className="py-3.5 px-4 font-bold">Category / Sub</th>
                                <th className="py-3.5 px-4 font-bold">Recommended Tool</th>
                                <th className="py-3.5 px-4 font-bold">Tier</th>
                                <th className="py-3.5 px-4 font-bold">Copies</th>
                                <th className="py-3.5 px-4 text-right font-bold">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                              {catBlueprints.map((t) => (
                                <tr key={t.id} className="hover:bg-white/[0.02] transition-colors">
                                  <td className="py-3 px-4">
                                    <div
                                      onClick={() => setPreviewTemplate(t)}
                                      className="flex items-center gap-3 cursor-pointer group"
                                      title="Inspect blueprint"
                                    >
                                      <img
                                        src={t.image_url || t.img || "/cyber_dashboard.jpg"}
                                        alt=""
                                        className="w-10 h-10 rounded-xl object-cover shrink-0 bg-black/40 border border-white/10 group-hover:scale-105 transition-transform"
                                      />
                                      <div>
                                        <div className="font-bold text-white group-hover:text-blue-400 transition-colors">
                                          {t.title}
                                        </div>
                                        <div className="text-[11px] text-slate-400 line-clamp-1 max-w-sm">
                                          {t.desc || t.description}
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="py-3 px-4 font-mono text-slate-300">
                                    <div className="font-medium capitalize">{t.category_id || t.category}</div>
                                    {t.subcategory && (
                                      <span className="inline-block mt-1 text-[10px] font-sans px-2 py-0.5 rounded-full bg-blue-600/15 text-blue-400 font-semibold border border-blue-500/25">
                                        {t.subcategory}
                                      </span>
                                    )}
                                  </td>
                                  <td className="py-3 px-4 text-slate-300 font-medium">
                                    {t.tool || "Midjourney v6.1"}
                                  </td>
                                  <td className="py-3 px-4">
                                    <span
                                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${t.featured || t.isPro
                                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                          : "bg-white/10 text-slate-300 border border-white/10"
                                        }`}
                                    >
                                      {t.featured || t.isPro ? "PRO" : "FREE"}
                                    </span>
                                  </td>
                                  <td className="py-3 px-4 font-mono text-slate-400">{t.copy_count || t.copies || 0}</td>
                                  <td className="py-3 px-4 text-right">
                                    <div className="flex items-center justify-end gap-1.5">
                                      <Link
                                        href={`/admin/templates/create?edit=${t.id}`}
                                        title="Open in Visual Builder"
                                        className="p-1.5 rounded-lg hover:bg-blue-600/15 text-blue-400 cursor-pointer transition-colors"
                                      >
                                        <Sparkles className="w-3.5 h-3.5" />
                                      </Link>
                                      <button
                                        type="button"
                                        onClick={() => setPreviewTemplate(t)}
                                        title="Admin Inspector"
                                        className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer transition-colors"
                                      >
                                        <Eye className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleOpenEditTemplate(t)}
                                        title="Quick Edit"
                                        className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer transition-colors"
                                      >
                                        <Edit3 className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteTemplate(t.id, t.title)}
                                        title="Delete"
                                        className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-400 cursor-pointer transition-colors"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="p-12 rounded-2xl border border-dashed border-white/10 text-center space-y-3 bg-[#0c0e18]">
                          <FolderTree className="w-10 h-10 text-slate-500 mx-auto" />
                          <div className="text-sm font-bold text-white">
                            No blueprints found in this category
                          </div>
                          <p className="text-xs text-slate-400 max-w-sm mx-auto">
                            Publish the first prompt blueprint for {activeCategoryObj.name} to populate this section.
                          </p>
                          <Link
                            href={`/admin/templates/create?category=${activeCategoryObj.slug || activeCategoryObj.id}`}
                            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs cursor-pointer inline-flex items-center gap-2 shadow-lg shadow-blue-500/25"
                          >
                            <Sparkles className="w-4 h-4 text-amber-300" />
                            <span>Launch Visual Builder for {activeCategoryObj.name} ↗</span>
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* VIEW 2: HIERARCHY CARDS GRID */}
                {categoryEditorViewMode === "hierarchy_cards" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {categories.map((c) => {
                      const count = getCategoryCount(c.id, c.slug);
                      return (
                        <div
                          key={c.id}
                          className="p-6 rounded-3xl bg-white/80 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 flex flex-col justify-between hover:border-indigo-500/50 transition-all shadow-sm"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <span className="font-mono text-[11px] px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold">
                                /{c.slug}
                              </span>
                              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-500">
                                {count} {count === 1 ? "Blueprint" : "Blueprints"}
                              </span>
                            </div>
                            <h4 className="font-bold text-base mb-1.5">{c.name}</h4>
                            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                              {c.description || "Active production catalog category."}
                            </p>

                            {/* Subcategories list & quick-add */}
                            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 space-y-2">
                              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                                Subcategories ({(subcategoriesMap[c.id] || subcategoriesMap[c.slug] || []).length})
                              </div>
                              <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto pr-1">
                                {(subcategoriesMap[c.id] || subcategoriesMap[c.slug] || []).map((sub: any) => (
                                  <span
                                    key={sub.id || sub.slug || sub.name}
                                    className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/[0.06] text-slate-700 dark:text-slate-300 text-[10px] font-medium border border-slate-200/60 dark:border-white/5"
                                  >
                                    {sub.name}
                                  </span>
                                ))}
                                {(subcategoriesMap[c.id] || subcategoriesMap[c.slug] || []).length === 0 && (
                                  <span className="text-[10px] text-slate-400 italic">No subcategories defined</span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="pt-4 mt-5 border-t border-slate-100 dark:border-white/5 space-y-3">
                            <div className="flex items-center justify-between text-xs">
                              <Link
                                href={`/?category=${c.slug}`}
                                target="_blank"
                                className="flex items-center gap-1 text-[11px] font-medium text-cyan-600 dark:text-cyan-400 hover:underline"
                              >
                                <span>View on Site</span>
                                <ExternalLink className="w-3 h-3" />
                              </Link>

                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedCategoryTab(c.id);
                                  setCategoryEditorViewMode("category_wise");
                                }}
                                className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer font-medium"
                              >
                                Open in Category Editor →
                              </button>
                            </div>

                            <div className="flex items-center justify-between pt-1">
                              <Link
                                href={`/admin/templates/create?category=${c.slug || c.id}`}
                                className="text-[10px] font-medium px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500 hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1"
                              >
                                <Sparkles className="w-3 h-3" />
                                <span>Visual Builder</span>
                              </Link>

                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => {
                                    setEditingCategory(c);
                                    setCatForm({
                                      name: c.name || "",
                                      slug: c.slug || "",
                                      description: c.description || "",
                                      icon: c.icon || "Layout",
                                      sort_order: c.sort_order || 1,
                                    });
                                    setShowCategoryModal(true);
                                  }}
                                  className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 cursor-pointer"
                                  title="Edit Category"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteCategory(c.id, c.name)}
                                  className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-500 cursor-pointer"
                                  title="Delete Category"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })()}

          {/* ========================================================================= */}
          {/* TAB: WORKFLOW STUDIO MANAGEMENT CONSOLE */}
          {/* ========================================================================= */}
          {activeTab === "workflow" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Workflow Header & Direct Studio Launcher */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 mb-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    <span>SYNTHESIS PIPELINE CONTROL</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    Workflow Studio &amp; Multi-Modal Node Pipelines
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Configure inference node routing, model weights, sampling steps, and launch the interactive Cyberpunk Workflow Studio.
                  </p>
                </div>

                <Link
                  href="/workflow"
                  target="_blank"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all cursor-pointer shrink-0"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>Launch Workflow Studio Canvas ↗</span>
                </Link>
              </div>

              {/* Cluster Telemetry Stats Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-white/80 dark:bg-[#11131c] border border-slate-200 dark:border-white/10 space-y-1">
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">GPU Cluster Status</div>
                  <div className="text-lg font-black text-emerald-500 flex items-center gap-1.5">
                    <Activity className="w-4 h-4" />
                    <span>Online (14% Load)</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">H100 SXM5 80GB Cluster</div>
                </div>

                <div className="p-4 rounded-2xl bg-white/80 dark:bg-[#11131c] border border-slate-200 dark:border-white/10 space-y-1">
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">VRAM Allocation</div>
                  <div className="text-lg font-black text-cyan-400 font-mono">
                    3.8 GB / 24.0 GB
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">Dynamic Paged Attention</div>
                </div>

                <div className="p-4 rounded-2xl bg-white/80 dark:bg-[#11131c] border border-slate-200 dark:border-white/10 space-y-1">
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Inference Latency</div>
                  <div className="text-lg font-black text-slate-900 dark:text-white font-mono">
                    320ms avg
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">Turbo 4-Step Diffusion</div>
                </div>

                <div className="p-4 rounded-2xl bg-white/80 dark:bg-[#11131c] border border-slate-200 dark:border-white/10 space-y-1">
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Pipeline Health</div>
                  <div className="text-lg font-black text-indigo-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>4 Nodes Ready</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">All Pipeline Hooks Live</div>
                </div>
              </div>

              {/* The 4 Pipeline Stage Nodes Architecture Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white font-mono flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-cyan-500" />
                    <span>Pipeline Architecture &amp; Node Routing</span>
                  </h3>
                  <span className="text-[11px] text-slate-400 font-mono">Synchronized with /workflow runtime</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Stage 1 */}
                  <div className="p-5 rounded-3xl bg-white/80 dark:bg-[#11131c] border border-cyan-500/20 space-y-3 relative overflow-hidden group hover:border-cyan-500/50 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-bold border border-cyan-500/20">
                        STAGE 01
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        READY
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-black text-slate-900 dark:text-white">Conditioning Node</div>
                      <div className="text-[11px] text-slate-400">text-1 Node Identifier</div>
                    </div>
                    <div className="space-y-1.5 text-[11px] font-mono text-slate-300 pt-2 border-t border-slate-100 dark:border-white/5">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Model:</span>
                        <span className="text-cyan-400">{workflowConfig.conditioningModel}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Role:</span>
                        <span>Prompt Vectorization</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">LoRA Weights:</span>
                        <span>0.85 Auto-injected</span>
                      </div>
                    </div>
                  </div>

                  {/* Stage 2 */}
                  <div className="p-5 rounded-3xl bg-white/80 dark:bg-[#11131c] border border-cyan-500/20 space-y-3 relative overflow-hidden group hover:border-cyan-500/50 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-bold border border-cyan-500/20">
                        STAGE 02
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        READY
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-black text-slate-900 dark:text-white">Image Gen Node</div>
                      <div className="text-[11px] text-slate-400">gen4-image Node Identifier</div>
                    </div>
                    <div className="space-y-1.5 text-[11px] font-mono text-slate-300 pt-2 border-t border-slate-100 dark:border-white/5">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Engine:</span>
                        <span className="text-cyan-400">{workflowConfig.imageGenModel}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Steps / CFG:</span>
                        <span>{workflowConfig.defaultSteps} steps • {workflowConfig.defaultCfg} CFG</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Resolution:</span>
                        <span>1024x1024 UHD</span>
                      </div>
                    </div>
                  </div>

                  {/* Stage 3 */}
                  <div className="p-5 rounded-3xl bg-white/80 dark:bg-[#11131c] border border-cyan-500/20 space-y-3 relative overflow-hidden group hover:border-cyan-500/50 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-bold border border-cyan-500/20">
                        STAGE 03
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        READY
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-black text-slate-900 dark:text-white">Video Synth Node</div>
                      <div className="text-[11px] text-slate-400">gen4-video Node Identifier</div>
                    </div>
                    <div className="space-y-1.5 text-[11px] font-mono text-slate-300 pt-2 border-t border-slate-100 dark:border-white/5">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Model:</span>
                        <span className="text-cyan-400">{workflowConfig.videoSynthModel}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Frame Rate:</span>
                        <span>24 FPS Temporal Vector</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Motion Speed:</span>
                        <span>{workflowConfig.defaultMotionSpeed} Smooth Pan</span>
                      </div>
                    </div>
                  </div>

                  {/* Stage 4 */}
                  <div className="p-5 rounded-3xl bg-white/80 dark:bg-[#11131c] border border-pink-500/20 space-y-3 relative overflow-hidden group hover:border-pink-500/50 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-400 font-bold border border-pink-500/20">
                        STAGE 04
                      </span>
                      <span className="text-[10px] font-mono text-pink-400 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        ALEPH FUSION
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-black text-slate-900 dark:text-white">Aleph Fusion Node</div>
                      <div className="text-[11px] text-slate-400">aleph Node Identifier</div>
                    </div>
                    <div className="space-y-1.5 text-[11px] font-mono text-slate-300 pt-2 border-t border-slate-100 dark:border-white/5">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Engine:</span>
                        <span className="text-pink-400">{workflowConfig.fusionModel}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Operation:</span>
                        <span>Latent Blend + 8K Upscale</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Output:</span>
                        <span>ProRes &amp; UHD PNG</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactive Pipeline Diagnostic & Test Simulator */}
              <div className="p-6 sm:p-7 rounded-3xl bg-white/80 dark:bg-[#11131c] border border-slate-200 dark:border-white/10 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-cyan-500" />
                      <span>Inference Pipeline Simulator &amp; Diagnostic Runner</span>
                    </h3>
                    <p className="text-xs text-slate-500">
                      Simulate end-to-end prompt inference through the 4-node pipeline to test latency and tensor passing.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleRunPipelineSimulation}
                    disabled={simulatingPipeline}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-semibold text-xs shadow-md shadow-cyan-500/20 cursor-pointer transition-all shrink-0"
                  >
                    <Play className={`w-3.5 h-3.5 fill-white ${simulatingPipeline ? "animate-spin" : ""}`} />
                    <span>{simulatingPipeline ? "Synthesizing Pipeline..." : "Execute Pipeline Test"}</span>
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-medium text-slate-500">
                    Test Prompt Vector (Stage 01 Input)
                  </label>
                  <input
                    type="text"
                    value={workflowTestPrompt}
                    onChange={(e) => setWorkflowTestPrompt(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Progress Bar */}
                {simulatingPipeline && (
                  <div className="space-y-2 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-cyan-400">
                        {simActiveStep === 1 && "Executing Stage 1: Conditioning Node..."}
                        {simActiveStep === 2 && "Executing Stage 2: Image Gen (FLUX.1 Schnell)..."}
                        {simActiveStep === 3 && "Executing Stage 3: Video Synth (Runway Gen-3)..."}
                        {simActiveStep === 4 && "Executing Stage 4: Aleph Fusion Latent Blend..."}
                      </span>
                      <span className="text-slate-400 font-bold">{simProgress}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-pink-500 transition-all duration-300"
                        style={{ width: `${simProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Live Console Output */}
                {simLogs.length > 0 && (
                  <div className="p-4 rounded-2xl bg-black/90 border border-white/10 font-mono text-[11px] text-cyan-300 space-y-1 max-h-44 overflow-y-auto">
                    <div className="text-slate-500 text-[10px] pb-1 border-b border-white/10 font-bold">
                      PIPELINE EXECUTION LOG BUFFER
                    </div>
                    {simLogs.map((log, i) => (
                      <div key={i} className="leading-relaxed">
                        {log}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Workflow Pipeline Settings & Defaults Form */}
              <div className="p-6 rounded-3xl bg-white/80 dark:bg-[#11131c] border border-slate-200 dark:border-white/10 space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-indigo-500" />
                    <span>Global Workflow Parameter Defaults</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => showToast("Workflow studio configuration saved to production!")}
                    className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 font-semibold text-xs cursor-pointer transition-colors shadow-xs"
                  >
                    Save Pipeline Defaults
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-500 mb-1 font-medium">Default Image Engine</label>
                    <select
                      value={workflowConfig.imageGenModel}
                      onChange={(e) => setWorkflowConfig({ ...workflowConfig, imageGenModel: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs"
                    >
                      <option value="FLUX.1 Schnell">FLUX.1 Schnell (4 Turbo Steps)</option>
                      <option value="Midjourney v6.1">Midjourney v6.1 API</option>
                      <option value="SDXL Turbo">Stable Diffusion XL Turbo</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-500 mb-1 font-medium">Default Video Engine</label>
                    <select
                      value={workflowConfig.videoSynthModel}
                      onChange={(e) => setWorkflowConfig({ ...workflowConfig, videoSynthModel: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs"
                    >
                      <option value="Runway Gen-3 Alpha">Runway Gen-3 Alpha</option>
                      <option value="Kling 1.5">Kling 1.5 Pro</option>
                      <option value="Luma Dream Machine">Luma Dream Machine</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-500 mb-1 font-medium">Sampling Steps</label>
                    <input
                      type="number"
                      value={workflowConfig.defaultSteps}
                      onChange={(e) => setWorkflowConfig({ ...workflowConfig, defaultSteps: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 mb-1 font-medium">CFG Guidance Scale</label>
                    <input
                      type="number"
                      step="0.5"
                      value={workflowConfig.defaultCfg}
                      onChange={(e) => setWorkflowConfig({ ...workflowConfig, defaultCfg: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: AI TOOL MASTER LIST (FEAT-031 & FEAT-032) */}
          {/* ========================================================================= */}
          {activeTab === "tools" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold">AI Tool / Model Master List (FEAT-032)</h3>
                  <p className="text-xs text-slate-500">Source list of external models for tagging, recommendations, and status toggles.</p>
                </div>
                <button
                  onClick={() => {
                    setEditingTool(null);
                    setToolForm({ name: "", category: "image", website_url: "", description: "" });
                    setShowToolModal(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-md transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Register AI Tool</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {tools.map((t) => (
                  <div
                    key={t.id}
                    className="p-6 rounded-3xl bg-white/80 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono uppercase bg-indigo-500/10 text-indigo-500 font-semibold">
                          {t.category || "General"}
                        </span>
                        {t.website_url && (
                          <a
                            href={t.website_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-slate-400 hover:text-slate-200"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                      <h4 className="font-bold text-base mb-1">{t.name}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">{t.description || "Active generative model."}</p>
                    </div>

                    <div className="flex items-center justify-between pt-4 mt-5 border-t border-slate-100 dark:border-white/5">
                      <span className="text-[11px] text-emerald-500 font-medium flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span>Status: Active</span>
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setEditingTool(t);
                            setToolForm({
                              name: t.name || "",
                              category: t.category || "image",
                              website_url: t.website_url || "",
                              description: t.description || "",
                            });
                            setShowToolModal(true);
                          }}
                          className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 cursor-pointer"
                          title="Edit AI Tool"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteTool(t.id, t.name)}
                          className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-500 cursor-pointer"
                          title="Retire Tool"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: INSIGHTS & FEEDBACK (FEAT-035) */}
          {/* ========================================================================= */}
          {activeTab === "feedback" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <h3 className="text-base font-bold">Customization Insights &amp; Reviews (FEAT-035)</h3>
                <p className="text-xs text-slate-500">Live reviews and ratings recorded directly in Supabase Cloud database.</p>
              </div>

              <div className="space-y-3">
                {feedback.map((f) => (
                  <div
                    key={f.id}
                    className="p-5 rounded-3xl bg-white/80 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2.5">
                        <div className="flex text-amber-400 text-xs">
                          {"★".repeat(f.rating || 5)}
                          {"☆".repeat(5 - (f.rating || 5))}
                        </div>
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          Blueprint ID: <span className="font-mono text-indigo-500">{f.template_id || "ai-studio"}</span>
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">"{f.comment || "High fidelity generation output."}"</p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-[11px] font-mono text-slate-500">Tool: {f.tool_used || "Midjourney v6.1"}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {new Date(f.created_at || Date.now()).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB: SUBSCRIPTIONS & USER PLANS */}
          {/* ========================================================================= */}
          {activeTab === "subscriptions" && (() => {
            const filteredSubs = subscriptions.filter((sub) => {
              const query = subSearchQuery.toLowerCase().trim();
              const userObj = sub.user || adminUsers.find((u) => u.id === sub.user_id) || null;
              const email = (sub.user_email || userObj?.email || "").toLowerCase();
              const name = (sub.user_name || userObj?.name || "").toLowerCase();
              const payId = (sub.payment_id || "").toLowerCase();
              const matchesSearch = !query || email.includes(query) || name.includes(query) || payId.includes(query);
              const matchesPlan = subPlanFilter === "all" || (sub.plan || "").toLowerCase() === subPlanFilter.toLowerCase();
              const matchesStatus = subStatusFilter === "all" || (sub.status || "").toLowerCase() === subStatusFilter.toLowerCase();
              return matchesSearch && matchesPlan && matchesStatus;
            });

            return (
              <div className="space-y-8 animate-in fade-in duration-300">
                {/* Header Title & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Subscriptions &amp; User Plans
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                        LIVE SUPABASE SYNC
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Monitor live subscriber statuses, adjust user credits, modify plan tiers, and grant manual PRO access.
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={loadSubscriptionsData}
                      className="p-2.5 rounded-2xl bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors shadow-sm cursor-pointer"
                      title="Refresh Subscriptions"
                    >
                      <RefreshCw className={`w-4 h-4 ${isLoadingSubscriptions ? "animate-spin" : ""}`} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenAddSubForUser()}
                      className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-indigo-500/25 transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Grant / Add Subscription</span>
                    </button>
                  </div>
                </div>

                {/* 4 Metric Bento Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Card 1: Revenue */}
                  <div className="p-5 rounded-3xl bg-white/80 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Total Revenue
                      </span>
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-sm">
                        ₹
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                        {subscriptionStats?.totalRevenue || stats?.totalRevenue || "₹0"}
                      </div>
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1 font-medium">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                        <span>Live payment settlements</span>
                      </p>
                    </div>
                  </div>

                  {/* Card 2: Active Subscriptions */}
                  <div className="p-5 rounded-3xl bg-white/80 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Active Subscriptions
                      </span>
                      <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                        <CreditCard className="w-4 h-4" />
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                        {subscriptionStats?.activeSubscriptions ?? subscriptions.filter(s => s.status === "active").length}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        Out of {subscriptions.length} registered subs
                      </p>
                    </div>
                  </div>

                  {/* Card 3: Pro Users */}
                  <div className="p-5 rounded-3xl bg-white/80 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Active PRO Creators
                      </span>
                      <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                        <Crown className="w-4 h-4" />
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl sm:text-3xl font-extrabold text-purple-600 dark:text-purple-400">
                        {subscriptionStats?.proUsersCount ?? adminUsers.filter(u => u.is_pro).length}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        Full access to all prompt flags
                      </p>
                    </div>
                  </div>

                  {/* Card 4: Total Accounts */}
                  <div className="p-5 rounded-3xl bg-white/80 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Registered Accounts
                      </span>
                      <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
                        <Users className="w-4 h-4" />
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                        {subscriptionStats?.totalUsers ?? adminUsers.length}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        Creators, subscribers &amp; admins
                      </p>
                    </div>
                  </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white/80 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 shadow-sm">
                  <div className="relative w-full sm:w-96">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search email, name, or payment ID..."
                      value={subSearchQuery}
                      onChange={(e) => setSubSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs sm:text-sm outline-none focus:border-indigo-500 transition-all"
                    />
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <select
                      value={subPlanFilter}
                      onChange={(e) => setSubPlanFilter(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-medium text-slate-700 dark:text-slate-300 outline-none cursor-pointer"
                    >
                      <option value="all">All Plans</option>
                      <option value="yearly">Yearly (₹199)</option>
                      <option value="lifetime">Lifetime (₹999)</option>
                      <option value="free">Free Starter</option>
                    </select>

                    <select
                      value={subStatusFilter}
                      onChange={(e) => setSubStatusFilter(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-medium text-slate-700 dark:text-slate-300 outline-none cursor-pointer"
                    >
                      <option value="all">All Statuses</option>
                      <option value="active">Active</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="expired">Expired</option>
                    </select>

                    <span className="text-xs text-slate-500 whitespace-nowrap hidden sm:inline">
                      {filteredSubs.length} found
                    </span>
                  </div>
                </div>

                {/* Subscriptions List / Table */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase font-mono tracking-wider text-slate-500 dark:text-slate-400">
                      Active Subscription Records
                    </h4>
                    <span className="text-[11px] font-mono text-slate-400">
                      Auto-synced with Supabase
                    </span>
                  </div>

                  {filteredSubs.length === 0 ? (
                    <div className="p-12 text-center rounded-3xl bg-white/80 dark:bg-white/[0.03] border border-dashed border-slate-200 dark:border-white/10 space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mx-auto">
                        <CreditCard className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">No matching subscriptions found</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                          You can grant a PRO subscription to any registered user directly using the button below.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleOpenAddSubForUser()}
                        className="px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-all cursor-pointer"
                      >
                        Grant First Subscription
                      </button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-3xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-white/[0.03] shadow-sm">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02] text-slate-500 dark:text-slate-400 font-mono uppercase text-[10px] tracking-wider">
                            <th className="py-3.5 px-4 font-bold">User / Creator</th>
                            <th className="py-3.5 px-4 font-bold">Plan Tier</th>
                            <th className="py-3.5 px-4 font-bold">Billed Amount</th>
                            <th className="py-3.5 px-4 font-bold">Status</th>
                            <th className="py-3.5 px-4 font-bold">Credits</th>
                            <th className="py-3.5 px-4 font-bold">Payment ID</th>
                            <th className="py-3.5 px-4 font-bold">Date Created</th>
                            <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/[0.05]">
                          {filteredSubs.map((sub) => {
                            const userObj = sub.user || adminUsers.find((u) => u.id === sub.user_id) || null;
                            const email = sub.user_email || userObj?.email || "Unknown";
                            const name = sub.user_name || userObj?.name || email.split("@")[0];
                            const credits = sub.user_credits ?? userObj?.credits ?? 25;

                            return (
                              <tr key={sub.id} className="hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition-colors">
                                <td className="py-3.5 px-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                                      {name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="truncate max-w-[180px]">
                                      <div className="font-semibold text-slate-900 dark:text-white truncate">
                                        {name}
                                      </div>
                                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                                        {email}
                                      </div>
                                    </div>
                                  </div>
                                </td>

                                <td className="py-3.5 px-4">
                                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase font-mono border ${
                                    sub.plan === "lifetime"
                                      ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
                                      : sub.plan === "yearly"
                                      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                                      : "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20"
                                  }`}>
                                    {sub.plan === "lifetime" ? <Crown className="w-3 h-3 text-purple-500" /> : <Sparkles className="w-3 h-3 text-amber-500" />}
                                    <span>{sub.plan || "yearly"}</span>
                                  </span>
                                </td>

                                <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                                  {sub.amount || (sub.plan === "lifetime" ? "₹999" : "₹199")}
                                </td>

                                <td className="py-3.5 px-4">
                                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase font-mono border ${
                                    sub.status === "active"
                                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                      : sub.status === "cancelled"
                                      ? "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20"
                                      : "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
                                  }`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${
                                      sub.status === "active" ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                                    }`} />
                                    <span>{sub.status || "active"}</span>
                                  </span>
                                </td>

                                <td className="py-3.5 px-4">
                                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded-lg border border-indigo-500/10">
                                    {credits} cr
                                  </span>
                                </td>

                                <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500 truncate max-w-[120px]" title={sub.payment_id}>
                                  {sub.payment_id || "admin_grant"}
                                </td>

                                <td className="py-3.5 px-4 text-[11px] text-slate-500 font-mono whitespace-nowrap">
                                  {sub.created_at ? new Date(sub.created_at).toLocaleDateString() : "Recent"}
                                </td>

                                <td className="py-3.5 px-4 text-right">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => handleOpenEditSub(sub)}
                                      className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                                      title="Edit Subscription & Plan"
                                    >
                                      <Edit3 className="w-3.5 h-3.5" />
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => handleDeleteSub(sub.id)}
                                      className="p-1.5 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 transition-colors cursor-pointer"
                                      title="Revoke Subscription"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Registered Users & Quick PRO Grant Directory */}
                <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        User Directory &amp; 1-Click PRO Grant
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        All registered user accounts in Supabase. You can immediately grant, upgrade, or modify privileges for any user.
                      </p>
                    </div>
                    <span className="text-xs font-mono text-slate-400">
                      {adminUsers.length} Users
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {adminUsers.map((u) => {
                      const userSub = subscriptions.find((s) => s.user_id === u.id);
                      return (
                        <div
                          key={u.id}
                          className="p-4 rounded-2xl bg-white/80 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 flex items-center justify-between gap-3 shadow-sm"
                        >
                          <div className="truncate min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                {u.name || u.email?.split("@")[0]}
                              </span>
                              {u.is_pro ? (
                                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 shrink-0">
                                  PRO
                                </span>
                              ) : (
                                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-slate-500/10 text-slate-500 shrink-0">
                                  FREE
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                              {u.email}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono mt-1">
                              Credits: <span className="font-bold text-slate-600 dark:text-slate-300">{u.credits ?? 5}</span> • Plan: {u.subscription_plan || "free"}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              if (userSub) {
                                handleOpenEditSub(userSub);
                              } else {
                                handleOpenAddSubForUser(u);
                              }
                            }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 cursor-pointer transition-all ${
                              u.is_pro
                                ? "bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-slate-200 hover:bg-slate-200"
                                : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm"
                            }`}
                          >
                            {u.is_pro ? "Edit Plan" : "Grant PRO"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            );
          })()}

          {/* ========================================================================= */}
          {/* TAB 6: PLATFORM CONTROLS (FEAT-036, FEAT-037, FEAT-038, FEAT-039) */}
          {/* ========================================================================= */}
          {activeTab === "settings" && (
            <form onSubmit={handleSaveSettings} className="space-y-8 max-w-3xl animate-in fade-in duration-300">
              <div>
                <h3 className="text-base font-bold">Platform-Level Controls &amp; Configuration</h3>
                <p className="text-xs text-slate-500">Manage paywall rules, AI spending limits, and payment providers.</p>
              </div>

              {/* FEAT-039: Non-Subscriber Visibility */}
              <div className="p-6 rounded-3xl bg-white/80 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 space-y-4">
                <div>
                  <h4 className="text-sm font-bold flex items-center gap-2">
                    <Eye className="w-4 h-4 text-indigo-500" />
                    <span>Non-Subscriber Prompt Visibility (FEAT-039)</span>
                  </h4>
                  <p className="text-xs text-slate-500">Define what users without an active subscription see when viewing paywalled prompts.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${settings.non_subscriber_visibility === "blurred_preview"
                      ? "border-indigo-500 bg-indigo-500/10"
                      : "border-slate-200 dark:border-white/10"
                      }`}
                  >
                    <input
                      type="radio"
                      name="visibility"
                      value="blurred_preview"
                      checked={settings.non_subscriber_visibility === "blurred_preview"}
                      onChange={(e) => setSettings({ ...settings, non_subscriber_visibility: e.target.value })}
                      className="mt-1"
                    />
                    <div>
                      <div className="text-xs font-bold">Blurred Preview (FEAT-007)</div>
                      <div className="text-[11px] text-slate-500">Displays first few words followed by a blurred interactive blur overlay.</div>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${settings.non_subscriber_visibility === "hard_block"
                      ? "border-indigo-500 bg-indigo-500/10"
                      : "border-slate-200 dark:border-white/10"
                      }`}
                  >
                    <input
                      type="radio"
                      name="visibility"
                      value="hard_block"
                      checked={settings.non_subscriber_visibility === "hard_block"}
                      onChange={(e) => setSettings({ ...settings, non_subscriber_visibility: e.target.value })}
                      className="mt-1"
                    />
                    <div>
                      <div className="text-xs font-bold">Hard Paywall Block</div>
                      <div className="text-[11px] text-slate-500">Completely hides prompt text with a direct subscription CTA card.</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* FEAT-036: Standing Rewrite Instruction */}
              <div className="p-6 rounded-3xl bg-white/80 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 space-y-3">
                <div>
                  <h4 className="text-sm font-bold flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-purple-500" />
                    <span>AI Rewriting Standing Instruction (FEAT-036)</span>
                  </h4>
                  <p className="text-xs text-slate-500">System instruction sent to external AI service for prompt customization requests.</p>
                </div>

                <textarea
                  rows={3}
                  value={settings.standing_rewrite_instruction || ""}
                  onChange={(e) => setSettings({ ...settings, standing_rewrite_instruction: e.target.value })}
                  className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-xs font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* FEAT-037: Customization Engine Controls */}
              <div className="p-6 rounded-3xl bg-white/80 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 space-y-4">
                <div>
                  <h4 className="text-sm font-bold flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-cyan-500" />
                    <span>Customization Engine Controls (FEAT-037)</span>
                  </h4>
                  <p className="text-xs text-slate-500">Cost control, free tier quotas, and voice inputs.</p>
                </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Monthly AI Spending Cap ($ USD)</label>
                    <input
                      type="number"
                      value={settings.ai_monthly_spending_cap || "500"}
                      onChange={(e) => setSettings({ ...settings, ai_monthly_spending_cap: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Free Customizations Allotment</label>
                    <input
                      type="number"
                      value={settings.free_customization_count || "3"}
                      onChange={(e) => setSettings({ ...settings, free_customization_count: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* FEAT-038: Payment Provider */}
              <div className="p-6 rounded-3xl bg-white/80 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 space-y-4">
                <div>
                  <h4 className="text-sm font-bold flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>Payment Gateway Provider (FEAT-038)</span>
                  </h4>
                  <p className="text-xs text-slate-500">Configure transaction routing for subscriptions.</p>
                </div>

                <select
                  value={settings.payment_provider || "razorpay"}
                  onChange={(e) => setSettings({ ...settings, payment_provider: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-xs"
                >
                  <option value="razorpay">Razorpay (Default MVP Gateway)</option>
                  <option value="stripe">Stripe Payments (International)</option>
                  <option value="crypto">Solana / Crypto Telemetry</option>
                </select>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={savingSettings}
                  className="px-6 py-2.5 rounded-full bg-slate-900 text-white dark:bg-white dark:text-black font-semibold text-xs shadow-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-all flex items-center gap-2 cursor-pointer"
                >
                  {savingSettings && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Platform Configurations</span>
                </button>
              </div>
            </form>
          )}
        </main>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: ADMIN BLUEPRINT INSPECTOR PREVIEW (MASTER ADMIN) */}
      {/* ========================================================================= */}
      {previewTemplate && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-white dark:bg-[#0c0c12] border border-slate-200 dark:border-white/10 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[92vh] my-auto overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Top Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-white/10 shrink-0 bg-white dark:bg-[#0c0c12]">
              <div className="flex items-center gap-3">
                <div className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                  <span>Admin Inspector</span>
                </div>
                <span className="text-xs text-slate-400 font-mono">ID: {previewTemplate.id?.slice(0, 12)}</span>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/templates/create?edit=${previewTemplate.id}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer transition-colors shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Visual Builder ↗</span>
                </Link>
                <button
                  type="button"
                  onClick={() => handleOpenEditTemplate(previewTemplate)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Quick Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTemplate(null)}
                  className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 cursor-pointer text-sm"
                  title="Close Inspector"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrollable Inspector Content */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Visual / Media Column */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 bg-black aspect-video flex items-center justify-center group shadow-md">
                    {previewTemplate.mediaType === "video" || previewTemplate.videoUrl || previewTemplate.image_url?.endsWith(".mp4") || previewTemplate.img?.endsWith(".mp4") ? (
                      <video
                        src={previewTemplate.videoUrl || previewTemplate.image_url || previewTemplate.img}
                        controls
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={previewTemplate.image_url || previewTemplate.img || "/cyber_dashboard.jpg"}
                        alt={previewTemplate.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute top-2.5 left-2.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${previewTemplate.featured || previewTemplate.isPro
                          ? "bg-amber-500/90 text-black shadow-sm"
                          : "bg-black/60 text-white border border-white/20"
                        }`}>
                        {previewTemplate.featured || previewTemplate.isPro ? "PRO" : "FREE"}
                      </span>
                    </div>
                  </div>

                  {/* Metadata Chips */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5">
                      <div className="text-[10px] text-slate-400 uppercase font-mono">Category / Subcategory</div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 truncate flex items-center gap-1.5 flex-wrap">
                        <span className="capitalize">{previewTemplate.category_id || previewTemplate.category}</span>
                        {previewTemplate.subcategory && (
                          <span className="text-[10px] font-sans px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-medium border border-indigo-500/20">
                            {previewTemplate.subcategory}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5">
                      <div className="text-[10px] text-slate-400 uppercase font-mono">Recommended Tool</div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 truncate">
                        {previewTemplate.tool || "Midjourney v6.1"}
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5">
                      <div className="text-[10px] text-slate-400 uppercase font-mono">Complexity</div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 capitalize">
                        {previewTemplate.complexity || "Intermediate"}
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5">
                      <div className="text-[10px] text-slate-400 uppercase font-mono">Total Copies</div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                        {previewTemplate.copy_count || previewTemplate.copies || 0}
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  {previewTemplate.tags && (
                    <div className="flex flex-wrap gap-1.5">
                      {(Array.isArray(previewTemplate.tags) ? previewTemplate.tags : String(previewTemplate.tags).split(",")).map((tag: string, i: number) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/5">
                          #{tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Details & Prompt Column */}
                <div className="lg:col-span-7 space-y-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{previewTemplate.title}</h2>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {previewTemplate.description || previewTemplate.desc || "Hand-authored blueprint deliverable."}
                    </p>
                  </div>

                  {/* Verbatim Prompt Box */}
                  <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#07070a] overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/[0.03]">
                      <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 font-mono">
                        VERBATIM PROMPT
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const p = previewTemplate.prompt || previewTemplate.prompt_text || "";
                          navigator.clipboard.writeText(p);
                          setCopiedPreviewPrompt(true);
                          setTimeout(() => setCopiedPreviewPrompt(false), 2000);
                        }}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-600 text-white text-[11px] font-semibold hover:bg-indigo-500 cursor-pointer transition-colors shadow-xs"
                      >
                        {copiedPreviewPrompt ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedPreviewPrompt ? "Copied Prompt!" : "Copy Prompt"}</span>
                      </button>
                    </div>
                    <div className="p-4 font-mono text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap select-all leading-relaxed max-h-48 overflow-y-auto">
                      {previewTemplate.prompt || previewTemplate.prompt_text || "No prompt text recorded."}
                    </div>
                  </div>

                  {/* Pro Tip Directive */}
                  {previewTemplate.tip && (
                    <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2.5">
                      <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <div className="leading-relaxed">
                        <span className="font-bold">Authoring Directive: </span>
                        <span>{previewTemplate.tip}</span>
                      </div>
                    </div>
                  )}

                  {/* Execution Guidance Steps */}
                  {previewTemplate.steps && Array.isArray(previewTemplate.steps) && previewTemplate.steps.length > 0 && (
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                          <span>7-Step Guidance Stepper Blueprint ({previewTemplate.steps.length} Steps)</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">Live Node Workflow</span>
                      </div>
                      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                        {previewTemplate.steps.map((st: any, idx: number) => (
                          <div key={idx} className="p-3 rounded-xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 space-y-1.5 text-xs">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                                  0{idx + 1}
                                </span>
                                <span className="font-bold text-slate-900 dark:text-white">
                                  {st.title || `Step 0${idx + 1}`}
                                </span>
                              </div>
                              {st.phase && (
                                <span className="text-[9px] font-mono font-semibold uppercase px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-500">
                                  {st.phase}
                                </span>
                              )}
                            </div>

                            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed pl-7">
                              {st.instruction || st.description || st.desc}
                            </p>

                            {st.examplePrompt && (
                              <div className="ml-7 p-2 rounded-lg bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/5 font-mono text-[10px] text-slate-700 dark:text-slate-300">
                                <span className="text-slate-400 select-none">Prompt: </span>
                                {st.examplePrompt}
                              </div>
                            )}

                            {st.imgUrl && (
                              <div className="ml-7 flex items-center gap-2 pt-0.5">
                                <img
                                  src={st.imgUrl}
                                  alt=""
                                  className="w-10 h-7 rounded-md object-cover border border-slate-200 dark:border-white/10"
                                />
                                <span className="text-[10px] font-mono text-slate-400 truncate max-w-xs">{st.imgUrl}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Bottom Action Bar */}
            <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#07070a] shrink-0">
              <button
                type="button"
                onClick={() => {
                  const id = previewTemplate.id;
                  const title = previewTemplate.title;
                  setPreviewTemplate(null);
                  handleDeleteTemplate(id, title);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-red-500/10 text-red-500 font-semibold text-xs cursor-pointer transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Blueprint</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewTemplate(null)}
                  className="px-4 py-2 rounded-full border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 text-xs font-semibold cursor-pointer"
                >
                  Close Inspector
                </button>
                <Link
                  href={`/admin/templates/create?edit=${previewTemplate.id}`}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-500/20 cursor-pointer transition-all"
                >
                  <span>Full Visual Builder</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FULLSCREEN STUDIO: AUTHOR / EDIT PROMPT BLUEPRINT (FEAT-030 REDESIGN) */}
      {/* ========================================================================= */}
      {showAddTemplateModal && (
        <div className="fixed inset-0 z-[200] bg-[#06070c] text-slate-100 flex flex-col overflow-hidden animate-in fade-in duration-200">
          {/* TOP STUDIO NAVIGATION BAR */}
          <header className="h-16 shrink-0 border-b border-white/10 bg-[#080912]/95 backdrop-blur-xl px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 z-30">
            {/* Left: Exit button & Brand Badge */}
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <button
                type="button"
                onClick={() => {
                  setShowAddTemplateModal(false);
                  setFormValidationError(null);
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer shrink-0"
                title="Exit Studio"
              >
                <ArrowLeft className="w-4 h-4 text-slate-400" />
                <span className="hidden sm:inline">Exit Studio</span>
              </button>

              <div className="h-5 w-px bg-white/10 hidden sm:block shrink-0" />

              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 p-0.5 shadow-lg shadow-indigo-500/25 flex items-center justify-center shrink-0">
                  <Wand2 className="w-4 h-4 text-white" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold text-white tracking-tight truncate">
                      {editingTemplate ? "Blueprint Studio • Edit Mode" : "Blueprint Studio • Direct Author"}
                    </h2>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 hidden md:inline">
                      Studio v2.5 Fullscreen
                    </span>
                    {editingTemplate && (
                      <span className="text-[10px] font-mono text-slate-500 hidden xl:inline">
                        ID: {editingTemplate.id?.slice(0, 8)}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 truncate hidden sm:block">
                    {editingTemplate ? `Modifying "${editingTemplate.title}"` : "Author and publish high-converting AI prompts directly to the catalog"}
                  </p>
                </div>
              </div>
            </div>

            {/* Center: Quick Category Switcher */}
            <div className="hidden xl:flex items-center gap-1 p-1 bg-white/[0.03] border border-white/10 rounded-2xl shrink-0">
              {(categories && categories.length > 0
                ? categories
                : [
                    { id: "image", name: "Image" },
                    { id: "video", name: "Video" },
                    { id: "website", name: "Website" },
                    { id: "slides", name: "Slides" },
                  ]
              ).map((c) => {
                const isSelected = tplForm.category === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setTplForm({ ...tplForm, category: c.id, subcategory: "" });
                    }}
                    className={`px-3 py-1 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      isSelected
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {c.name}
                  </button>
                );
              })}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2.5 shrink-0">
              <Link
                href={editingTemplate ? `/admin/templates/create?edit=${editingTemplate.id}` : `/admin/templates/create`}
                className="hidden lg:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 hover:text-white text-xs font-medium transition-all"
                title="Open in Visual Node Graph Builder"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Visual Node Builder</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
              </Link>

              <button
                type="button"
                onClick={() => handleSaveTemplate()}
                disabled={savingTemplate}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-indigo-500/30 transition-all cursor-pointer"
              >
                {savingTemplate ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                <span>{savingTemplate ? "Publishing..." : editingTemplate ? "Save Changes" : "Publish to Catalog"}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowAddTemplateModal(false);
                  setFormValidationError(null);
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Close Studio"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </header>

          {/* MAIN WORKSPACE BODY: 2-COLUMN SPLIT VIEW */}
          <div className="flex-1 flex flex-col xl:flex-row min-h-0 overflow-hidden">
            {/* LEFT MAIN CANVAS (PRIMARY AUTHORING SURFACE) */}
            <main className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 lg:p-8 space-y-6">
              {/* Validation Alert Banner */}
              {formValidationError && (
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-rose-400 text-xs flex items-center justify-between gap-3 animate-in slide-in-from-top-2">
                  <div className="flex items-center gap-2.5">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                    <span className="font-semibold">{formValidationError}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormValidationError(null)}
                    className="text-rose-400/80 hover:text-rose-200 text-xs font-mono"
                  >
                    Dismiss
                  </button>
                </div>
              )}

              {/* SECTION 1: CORE BLUEPRINT IDENTITY & METADATA */}
              <div className="p-5 sm:p-6 rounded-3xl bg-[#0b0c16] border border-white/10 space-y-5 shadow-sm">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                      Core Blueprint Identity
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">Step 1 of 3 • General Info</span>
                </div>

                <div className="space-y-4">
                  {/* Title Input */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1">
                        <span>Blueprint Title</span>
                        <span className="text-rose-500">*</span>
                      </label>
                      <span className="text-[11px] font-mono text-slate-500">{tplForm.title.length} / 90 chars</span>
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. Neo-Obsidian Cyber Hero Concept Visual"
                      value={tplForm.title}
                      onChange={(e) => {
                        setTplForm({ ...tplForm, title: e.target.value });
                        if (formValidationError) setFormValidationError(null);
                      }}
                      className="w-full px-4 py-3 rounded-2xl bg-[#121422] border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-white font-semibold text-sm transition-all outline-none placeholder:text-slate-600"
                    />
                  </div>

                  {/* Description Input */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 block">
                      Summary / Subtitle
                    </label>
                    <input
                      type="text"
                      placeholder="A short, compelling summary for users browsing the template catalog..."
                      value={tplForm.desc}
                      onChange={(e) => setTplForm({ ...tplForm, desc: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-2xl bg-[#121422] border border-white/10 focus:border-indigo-500 text-white text-xs transition-all outline-none placeholder:text-slate-600"
                    />
                  </div>

                  {/* Category & Subcategory 2-Column Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    {/* Category Select */}
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 block">
                        Category
                      </label>
                      <select
                        value={tplForm.category}
                        onChange={(e) => {
                          const newCat = e.target.value;
                          setTplForm({ ...tplForm, category: newCat, subcategory: "" });
                        }}
                        className="w-full px-3.5 py-2.5 rounded-2xl bg-[#121422] border border-white/10 text-xs text-white focus:border-indigo-500 outline-none"
                      >
                        {(categories && categories.length > 0
                          ? categories
                          : [
                              { id: "image", name: "Image" },
                              { id: "video", name: "Video" },
                              { id: "website", name: "Website" },
                              { id: "slides", name: "Slides" },
                            ]
                        ).map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Subcategory Selector & Inline Adder */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                          Subcategory
                        </label>
                        {!isCustomSubcatMode && (
                          <button
                            type="button"
                            onClick={() => setIsCustomSubcatMode(true)}
                            className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer transition-colors"
                          >
                            + New Subcategory
                          </button>
                        )}
                      </div>

                      {isCustomSubcatMode ? (
                        <div className="flex items-center gap-2 animate-in fade-in duration-150">
                          <input
                            type="text"
                            placeholder={`e.g. 3D Renders, Character Design...`}
                            value={customSubcatInput}
                            onChange={(e) => setCustomSubcatInput(e.target.value)}
                            onKeyDown={async (e) => {
                              if (e.key === "Enter" && customSubcatInput.trim()) {
                                e.preventDefault();
                                await handleAddSubcategory(tplForm.category, customSubcatInput.trim());
                                setTplForm({ ...tplForm, subcategory: customSubcatInput.trim() });
                                setCustomSubcatInput("");
                                setIsCustomSubcatMode(false);
                              }
                            }}
                            className="flex-1 px-3 py-2 rounded-2xl bg-[#121422] border border-indigo-500 text-xs text-white outline-none"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={async () => {
                              if (customSubcatInput.trim()) {
                                await handleAddSubcategory(tplForm.category, customSubcatInput.trim());
                                setTplForm({ ...tplForm, subcategory: customSubcatInput.trim() });
                                setCustomSubcatInput("");
                                setIsCustomSubcatMode(false);
                              }
                            }}
                            className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer shadow-sm"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsCustomSubcatMode(false)}
                            className="px-2.5 py-2 rounded-xl border border-white/10 text-xs text-slate-400 hover:text-white cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <select
                          value={tplForm.subcategory || ""}
                          onChange={(e) => {
                            if (e.target.value === "__add_new__") {
                              setIsCustomSubcatMode(true);
                            } else {
                              setTplForm({ ...tplForm, subcategory: e.target.value });
                            }
                          }}
                          className="w-full px-3.5 py-2.5 rounded-2xl bg-[#121422] border border-white/10 text-xs text-white focus:border-indigo-500 outline-none"
                        >
                          <option value="">Select Subcategory (Optional)...</option>
                          {(subcategoriesMap[tplForm.category] || subcategoriesMap[tplForm.category?.toLowerCase()] || []).map((sub: any) => (
                            <option key={sub.id || sub.slug || sub.name} value={sub.name}>
                              {sub.name}
                            </option>
                          ))}
                          <option value="__add_new__">+ Create New Subcategory...</option>
                        </select>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: DELIVERABLE FORMAT SELECTOR */}
              <div className="p-5 sm:p-6 rounded-3xl bg-[#0b0c16] border border-white/10 space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                      Deliverable Media Format
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">Step 2 of 3 • Output Target</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: "image", label: "Visual Image", desc: "Midjourney / FLUX / SDXL", icon: ImageIcon, badge: "Static UHD" },
                    { id: "video", label: "Motion Video", desc: "Runway Gen-3 / Kling / Sora", icon: Video, badge: "Cinematic" },
                    { id: "code", label: "Web Component", desc: "Claude / Next.js / Three.js", icon: FileCode, badge: "Interactive" },
                  ].map((m) => {
                    const isSelected = tplForm.mediaType === m.id;
                    const Icon = m.icon;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => autoFillInstructions(m.id as any)}
                        className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden group ${
                          isSelected
                            ? "bg-indigo-600/15 border-indigo-500 text-white shadow-md shadow-indigo-600/10 ring-1 ring-indigo-500/30"
                            : "bg-[#121422] hover:bg-[#16192b] border-white/10 text-slate-400 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className={`p-2 rounded-xl ${isSelected ? "bg-indigo-500 text-white" : "bg-white/5 text-slate-400"}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full font-bold ${
                            isSelected ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30" : "bg-white/5 text-slate-500"
                          }`}>
                            {m.badge}
                          </span>
                        </div>
                        <div className="font-bold text-xs text-white">{m.label}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{m.desc}</div>
                      </button>
                    );
                  })}
                </div>

                {/* If Video: Dedicated Stream Input */}
                {tplForm.mediaType === "video" && (
                  <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 space-y-2 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-indigo-400 flex items-center gap-2">
                        <Video className="w-4 h-4" />
                        <span>Motion Stream URL (Direct MP4 / WebM / ImageKit CDN)</span>
                      </label>
                      <span className="text-[10px] font-mono text-indigo-400/80">Auto-looping preview enabled</span>
                    </div>
                    <input
                      type="text"
                      placeholder="https://ik.imagekit.io/.../cinematic_preview.mp4"
                      value={tplForm.videoUrl}
                      onChange={(e) => setTplForm({ ...tplForm, videoUrl: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0d0f1c] border border-indigo-500/30 text-white text-xs font-mono outline-none focus:border-indigo-400"
                    />
                    <p className="text-[11px] text-slate-400">
                      Provide a direct video link. The catalog will display an animated 4K motion loop preview instead of a static image.
                    </p>
                  </div>
                )}
              </div>

              {/* SECTION 3: PRODUCTION PROMPT DIRECTIVE (COMMAND CENTER) */}
              <div className="p-5 sm:p-6 rounded-3xl bg-[#0b0c16] border border-white/10 space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                      Final Production Prompt Directive
                    </span>
                    <span className="text-rose-500 font-bold">*</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-[11px] font-mono text-slate-400">
                      <span className="text-white font-bold">{tplForm.prompt.length}</span> chars • ~{Math.round(tplForm.prompt.length / 4)} tokens
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (tplForm.prompt) {
                          navigator.clipboard.writeText(tplForm.prompt);
                          showToast("Copied prompt to clipboard!");
                        }
                      }}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-medium transition-colors cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </button>
                  </div>
                </div>

                {/* Prompt Textarea */}
                <div className="relative">
                  <textarea
                    rows={6}
                    placeholder="Enter production-ready prompt directive here... (e.g. Ultra high definition portrait of a cyber warrior in Tokyo rain alley, neon teal and crimson rim lighting, 35mm anamorphic lens, 8k resolution --ar 16:9 --v 6.1 --style raw)"
                    value={tplForm.prompt}
                    onChange={(e) => {
                      setTplForm({ ...tplForm, prompt: e.target.value });
                      if (formValidationError) setFormValidationError(null);
                    }}
                    className={`w-full p-4 rounded-2xl bg-[#0e101d] border text-xs font-mono leading-relaxed transition-all outline-none resize-y custom-scrollbar ${
                      !tplForm.prompt.trim() && formValidationError
                        ? "border-rose-500 text-rose-300"
                        : "border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-200"
                    }`}
                  />
                </div>

                {/* Quick Insert Parameter Pills */}
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-indigo-400" />
                    <span>Quick Parameter Flags (Click to insert)</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {["--ar 16:9", "--ar 9:16", "--ar 1:1", "--ar 21:9", "--style raw", "--v 6.1", "--s 250", "--chaos 10", "--no text, blurry"].map((flag) => (
                      <button
                        key={flag}
                        type="button"
                        onClick={() => {
                          if (!tplForm.prompt.includes(flag)) {
                            setTplForm({
                              ...tplForm,
                              prompt: tplForm.prompt.trim() ? `${tplForm.prompt.trim()} ${flag}` : flag,
                            });
                            showToast(`Appended flag: ${flag}`);
                          }
                        }}
                        className={`text-[11px] font-mono px-2.5 py-1 rounded-xl border transition-all cursor-pointer ${
                          tplForm.prompt.includes(flag)
                            ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/40 font-bold"
                            : "bg-white/[0.03] text-slate-400 border-white/5 hover:border-white/20 hover:text-white"
                        }`}
                      >
                        + {flag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* SECTION 4: 7-STEP INTERACTIVE NODE GUIDANCE BLUEPRINT */}
              <div className="p-5 sm:p-6 rounded-3xl bg-[#0b0c16] border border-white/10 space-y-5 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                      7-Step Execution Stepper Blueprint
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const preset = getCategoryGuidancePreset(tplForm.category || "image");
                      setTplForm((prev) => ({
                        ...prev,
                        guidance_steps: preset,
                        step1_title: preset[0]?.title || prev.step1_title,
                        step1_desc: preset[0]?.desc || prev.step1_desc,
                        step2_title: preset[1]?.title || prev.step2_title,
                        step2_desc: preset[1]?.desc || prev.step2_desc,
                        step3_title: preset[2]?.title || prev.step3_title,
                        step3_desc: preset[2]?.desc || prev.step3_desc,
                      }));
                      showToast(`Reset guidance steps to ${tplForm.category.toUpperCase()} preset!`);
                    }}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 hover:underline font-semibold cursor-pointer self-start sm:self-auto"
                  >
                    Reset to {(tplForm.category || "image").toUpperCase()} Default Steps
                  </button>
                </div>

                {/* 7-Step Pill Track */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                  {(tplForm.guidance_steps || getCategoryGuidancePreset(tplForm.category || "image")).map((st: any, idx: number) => {
                    const isSelected = activeGuidanceStepIndex === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveGuidanceStepIndex(idx)}
                        className={`p-2.5 rounded-2xl text-left border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/25 ring-1 ring-indigo-400/40"
                            : "bg-[#121422] text-slate-300 border-white/5 hover:border-white/20 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                            isSelected ? "bg-white/20 text-white" : "bg-white/5 text-slate-500"
                          }`}>
                            0{idx + 1}
                          </span>
                        </div>
                        <div className="text-[11px] font-bold truncate">
                          {st.phase || ["Concept", "Subject", "Composition", "Style", "Lighting", "Parameters", "Generate"][idx]}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Active Step Detailed Form Fields */}
                {(() => {
                  const currentSteps = tplForm.guidance_steps || getCategoryGuidancePreset(tplForm.category || "image");
                  const cur = currentSteps[activeGuidanceStepIndex] || currentSteps[0];

                  const updateCurrentStep = (field: string, val: string) => {
                    const updated = [...currentSteps];
                    updated[activeGuidanceStepIndex] = {
                      ...updated[activeGuidanceStepIndex],
                      [field]: val,
                    };
                    setTplForm((prev) => ({
                      ...prev,
                      guidance_steps: updated,
                      step1_title: updated[0]?.title || prev.step1_title,
                      step1_desc: updated[0]?.desc || prev.step1_desc,
                      step2_title: updated[1]?.title || prev.step2_title,
                      step2_desc: updated[1]?.desc || prev.step2_desc,
                      step3_title: updated[2]?.title || prev.step3_title,
                      step3_desc: updated[2]?.desc || prev.step3_desc,
                    }));
                  };

                  return (
                    <div className="p-4 sm:p-5 rounded-2xl bg-[#0f111e] border border-white/10 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-indigo-600 text-white font-mono text-[10px] flex items-center justify-center font-bold">
                            0{activeGuidanceStepIndex + 1}
                          </span>
                          <span>Editing Step 0{activeGuidanceStepIndex + 1}: {cur.phase || "Configuration"}</span>
                        </span>
                        <div className="flex items-center gap-1.5 text-xs">
                          <button
                            type="button"
                            disabled={activeGuidanceStepIndex === 0}
                            onClick={() => setActiveGuidanceStepIndex((p) => Math.max(0, p - 1))}
                            className="px-2.5 py-1 rounded-xl border border-white/10 hover:bg-white/5 disabled:opacity-30 cursor-pointer text-[11px]"
                          >
                            ← Prev
                          </button>
                          <button
                            type="button"
                            disabled={activeGuidanceStepIndex === 6}
                            onClick={() => setActiveGuidanceStepIndex((p) => Math.min(6, p + 1))}
                            className="px-2.5 py-1 rounded-xl border border-white/10 hover:bg-white/5 disabled:opacity-30 cursor-pointer text-[11px]"
                          >
                            Next →
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                            Phase Tag
                          </label>
                          <input
                            type="text"
                            value={cur.phase || ""}
                            onChange={(e) => updateCurrentStep("phase", e.target.value)}
                            placeholder="e.g. Concept, Subject, Style"
                            className="w-full px-3 py-2 rounded-xl bg-[#151728] border border-white/10 text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                            Step Title
                          </label>
                          <input
                            type="text"
                            value={cur.title || ""}
                            onChange={(e) => updateCurrentStep("title", e.target.value)}
                            placeholder="e.g. Define the Concept"
                            className="w-full px-3 py-2 rounded-xl bg-[#151728] border border-white/10 text-xs text-white font-semibold"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                          Step Instructions / Description
                        </label>
                        <textarea
                          rows={2}
                          value={cur.desc || cur.instruction || ""}
                          onChange={(e) => updateCurrentStep("desc", e.target.value)}
                          placeholder="Detailed instructions for the user when executing this step..."
                          className="w-full p-3 rounded-xl bg-[#151728] border border-white/10 text-xs text-slate-200 leading-relaxed outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                            Example Prompt Directive
                          </label>
                          <input
                            type="text"
                            value={cur.examplePrompt || ""}
                            onChange={(e) => updateCurrentStep("examplePrompt", e.target.value)}
                            placeholder="e.g. --ar 16:9 --style raw --v 6.1"
                            className="w-full px-3 py-2 rounded-xl bg-[#151728] border border-white/10 text-xs text-slate-300 font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                            Step Reference Image URL
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={cur.imgUrl || ""}
                              onChange={(e) => updateCurrentStep("imgUrl", e.target.value)}
                              placeholder="/cyber_dashboard.jpg"
                              className="flex-1 px-3 py-2 rounded-xl bg-[#151728] border border-white/10 text-xs font-mono text-slate-300"
                            />
                            {cur.imgUrl && (
                              <img
                                src={cur.imgUrl}
                                alt=""
                                className="w-8 h-8 rounded-lg object-cover border border-white/10 shrink-0"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* SECTION 5: PRO TIP & ENGINEERING DIRECTIVE */}
              <div className="p-5 sm:p-6 rounded-3xl bg-amber-500/[0.04] border border-amber-500/20 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                  <Lightbulb className="w-4 h-4" />
                  <span>Blueprint Pro Tip &amp; Best Practice Note</span>
                </div>
                <input
                  type="text"
                  placeholder="e.g. For Video: Set motion speed to 4 and camera pan left. For Image: Use 85mm f/1.8 lens."
                  value={tplForm.tip}
                  onChange={(e) => setTplForm({ ...tplForm, tip: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#13131c] border border-amber-500/30 text-xs text-amber-200 font-medium outline-none focus:border-amber-400"
                />
              </div>
            </main>

            {/* RIGHT SIDEBAR INSPECTOR & ASSET STUDIO */}
            <aside className="w-full xl:w-[460px] shrink-0 border-t xl:border-t-0 xl:border-l border-white/10 bg-[#080912]/90 backdrop-blur-xl p-6 overflow-y-auto custom-scrollbar space-y-6">
              {/* INSPECTOR HEADER */}
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Live Preview &amp; Asset Studio
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  ● Realtime Sync
                </span>
              </div>

              {/* LIVE MARKETPLACE CARD PREVIEW */}
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Catalog Card Simulation
                </div>
                <div className="rounded-2xl border border-white/10 bg-[#0e101d] overflow-hidden shadow-xl group">
                  <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
                    {tplForm.mediaType === "video" && tplForm.videoUrl ? (
                      <video
                        src={tplForm.videoUrl}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={tplForm.img || "/cyber_dashboard.jpg"}
                        alt={tplForm.title || "Preview"}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${
                        tplForm.isPro ? "bg-amber-500/90 text-black shadow-sm" : "bg-black/60 text-white border border-white/20"
                      }`}>
                        {tplForm.isPro ? "PRO" : "FREE"}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-black/60 text-slate-200 border border-white/20 capitalize">
                        {tplForm.category || "Image"}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="font-bold text-xs text-white truncate">
                      {tplForm.title || "Untitled Blueprint"}
                    </h3>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {tplForm.desc || "Author production-grade AI visual deliverables with guaranteed high fidelity."}
                    </p>
                    <div className="pt-2 flex items-center justify-between text-[11px] border-t border-white/5 text-slate-400">
                      <span>{tplForm.tool || "Midjourney v6.1"}</span>
                      <span className="capitalize text-slate-500">{tplForm.complexity || "Intermediate"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* THUMBNAIL ASSET STUDIO */}
              <div className="p-4 rounded-2xl bg-[#0e101d] border border-white/10 space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <UploadCloud className="w-4 h-4 text-indigo-400" />
                    <span>Thumbnail Image Asset</span>
                  </span>
                  {uploadingImage && <span className="text-xs text-indigo-400 animate-pulse">Uploading...</span>}
                </div>

                {/* Upload & AI Generation Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage || isAiGeneratingImage}
                    className="px-3 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 text-white font-medium text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Browse Files</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleAiGenerateImage}
                    disabled={uploadingImage || isAiGeneratingImage}
                    className="px-3 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-indigo-600/20 disabled:opacity-50 transition-all"
                  >
                    <Sparkles className={`w-3.5 h-3.5 ${isAiGeneratingImage ? "animate-spin" : ""}`} />
                    <span>{isAiGeneratingImage ? "Generating..." : "⚡ Generate AI"}</span>
                  </button>
                </div>

                {/* Direct Image URL input */}
                <div>
                  <input
                    type="text"
                    placeholder="https://... or /uploads/image.jpg"
                    value={tplForm.img}
                    onChange={(e) => setTplForm({ ...tplForm, img: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#141728] border border-white/10 text-xs font-mono text-slate-200 outline-none"
                  />
                </div>

                {/* Media Library Quick Pick */}
                {mediaAssets.length > 0 && (
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block mb-1.5 font-bold">
                      Pick from Media Assets ({mediaAssets.length}):
                    </span>
                    <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
                      {mediaAssets.slice(0, 10).map((asset) => (
                        <button
                          key={asset.id}
                          type="button"
                          onClick={() => setTplForm({ ...tplForm, img: asset.url })}
                          className={`w-12 h-12 rounded-xl overflow-hidden border shrink-0 transition-all cursor-pointer ${
                            tplForm.img === asset.url ? "ring-2 ring-emerald-500 border-emerald-500" : "border-white/10 opacity-70 hover:opacity-100"
                          }`}
                        >
                          <img src={asset.url} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* High-res Curated Presets Bar */}
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">
                    Curated Presets:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {PRESET_IMAGES.map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => setTplForm({ ...tplForm, img: preset.url })}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-mono border transition-all cursor-pointer ${
                          tplForm.img === preset.url
                            ? "bg-indigo-500/20 border-indigo-500 text-indigo-300 font-bold"
                            : "bg-white/[0.03] border-white/5 text-slate-400 hover:text-white"
                        }`}
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* ENGINE & PUBLISHING CONFIGURATIONS */}
              <div className="p-4 rounded-2xl bg-[#0e101d] border border-white/10 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-200 block border-b border-white/5 pb-2">
                  Engine &amp; Access Controls
                </span>

                {/* Recommended Tool */}
                <div>
                  <label className="text-xs font-medium text-slate-300 mb-1 block">Recommended AI Tool</label>
                  <input
                    type="text"
                    value={tplForm.tool}
                    onChange={(e) => setTplForm({ ...tplForm, tool: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#141728] border border-white/10 text-xs text-white"
                  />
                </div>

                {/* Access Tier & Complexity 2-Column */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-slate-300 mb-1 block">Access Tier</label>
                    <select
                      value={tplForm.isPro ? "pro" : "free"}
                      onChange={(e) => setTplForm({ ...tplForm, isPro: e.target.value === "pro" })}
                      className="w-full px-3 py-2 rounded-xl bg-[#141728] border border-white/10 text-xs text-white"
                    >
                      <option value="pro">PRO Only</option>
                      <option value="free">Free Access</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-300 mb-1 block">Complexity</label>
                    <select
                      value={tplForm.complexity}
                      onChange={(e) => setTplForm({ ...tplForm, complexity: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#141728] border border-white/10 text-xs text-white"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="text-xs font-medium text-slate-300 mb-1 block">Tags (Comma-separated)</label>
                  <input
                    type="text"
                    placeholder="Cyberpunk, Hero, Midjourney, 8K"
                    value={tplForm.tags}
                    onChange={(e) => setTplForm({ ...tplForm, tags: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#141728] border border-white/10 text-xs text-white"
                  />
                  {tplForm.tags && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {String(tplForm.tags).split(",").map((t, idx) => (
                        t.trim() && (
                          <span key={idx} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] text-slate-400">
                            #{t.trim()}
                          </span>
                        )
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* READINESS AUDIT CHECKLIST */}
              <div className="p-4 rounded-2xl bg-[#0e101d] border border-white/10 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Publication Audit
                </span>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`w-3.5 h-3.5 ${tplForm.title.trim() ? "text-emerald-400" : "text-slate-600"}`} />
                    <span className={tplForm.title.trim() ? "text-slate-200" : "text-slate-500"}>Blueprint Title Defined</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`w-3.5 h-3.5 ${tplForm.prompt.trim() ? "text-emerald-400" : "text-slate-600"}`} />
                    <span className={tplForm.prompt.trim() ? "text-slate-200" : "text-slate-500"}>Production Prompt Provided</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`w-3.5 h-3.5 ${tplForm.img ? "text-emerald-400" : "text-slate-600"}`} />
                    <span className={tplForm.img ? "text-slate-200" : "text-slate-500"}>Thumbnail Asset Attached</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`w-3.5 h-3.5 ${tplForm.category ? "text-emerald-400" : "text-slate-600"}`} />
                    <span className={tplForm.category ? "text-slate-200" : "text-slate-500"}>Category &amp; Guidance Steps Configured</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>

          {/* STICKY BOTTOM STUDIO STATUS & ACTIONS BAR */}
          <footer className="h-16 shrink-0 border-t border-white/10 bg-[#080912]/95 backdrop-blur-xl px-6 sm:px-8 flex items-center justify-between z-30">
            <div className="text-xs">
              {!tplForm.title.trim() && !tplForm.desc.trim() ? (
                <span className="text-amber-400 font-medium flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Title or description required before publishing</span>
                </span>
              ) : !tplForm.prompt.trim() ? (
                <span className="text-amber-400 font-medium flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Prompt directive required</span>
                </span>
              ) : (
                <span className="text-emerald-400 font-medium flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  <span>All checks passed • Ready to publish to catalog</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowAddTemplateModal(false);
                  setFormValidationError(null);
                }}
                className="px-4 py-2 rounded-xl border border-white/10 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                Discard &amp; Close
              </button>
              <button
                type="button"
                onClick={() => handleSaveTemplate()}
                disabled={savingTemplate}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-indigo-500/30 transition-all cursor-pointer"
              >
                {savingTemplate && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>
                  {savingTemplate
                    ? "Publishing..."
                    : editingTemplate
                      ? "Update Blueprint"
                      : "Publish Blueprint"}
                </span>
              </button>
            </div>
          </footer>
        </div>
      )}


      {/* ========================================================================= */}
      {/* MODAL: ADD / EDIT CATEGORY (FEAT-029) */}
      {/* ========================================================================= */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-[#0c0c12] border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold">
              {editingCategory ? "Edit Category Hierarchy" : "Create New Category"}
            </h3>
            <form onSubmit={handleSaveCategory} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 3D Generative Mockups"
                  value={catForm.name}
                  onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Slug (URL coordinate)</label>
                <input
                  type="text"
                  placeholder="3d-generative"
                  value={catForm.slug}
                  onChange={(e) => setCatForm({ ...catForm, slug: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Description</label>
                <input
                  type="text"
                  placeholder="Short category description for users"
                  value={catForm.description}
                  onChange={(e) => setCatForm({ ...catForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Icon Style</label>
                  <select
                    value={catForm.icon}
                    onChange={(e) => setCatForm({ ...catForm, icon: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-xs"
                  >
                    <option value="Layout">Layout (Hero)</option>
                    <option value="Cpu">Cpu (Cyber)</option>
                    <option value="ShoppingBag">ShoppingBag (Ecommerce)</option>
                    <option value="Palette">Palette (Portfolio)</option>
                    <option value="Smartphone">Smartphone (Mobile)</option>
                    <option value="BarChart3">BarChart3 (SaaS)</option>
                    <option value="Film">Film (Video)</option>
                    <option value="Sparkles">Sparkles (Creative)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Display Sort Order</label>
                  <input
                    type="number"
                    value={catForm.sort_order}
                    onChange={(e) => setCatForm({ ...catForm, sort_order: parseInt(e.target.value, 10) || 1 })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="px-4 py-2 rounded-full border border-slate-200 dark:border-white/10 text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md cursor-pointer"
                >
                  {editingCategory ? "Update Category" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD / EDIT AI TOOL (FEAT-032) */}
      {/* ========================================================================= */}
      {showToolModal && (
        <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-[#0c0c12] border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold">
              {editingTool ? "Edit AI Tool / Model" : "Register AI Tool / Model"}
            </h3>
            <form onSubmit={handleSaveTool} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Tool Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Runway Gen-3 Alpha"
                  value={toolForm.name}
                  onChange={(e) => setToolForm({ ...toolForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Category</label>
                <select
                  value={toolForm.category}
                  onChange={(e) => setToolForm({ ...toolForm, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-xs"
                >
                  <option value="image">Image (Midjourney, FLUX)</option>
                  <option value="code">Code (Claude, v0)</option>
                  <option value="video">Video (Runway, Sora, Luma)</option>
                  <option value="ide">IDE (Cursor, Windsurf)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Official Website URL</label>
                <input
                  type="url"
                  placeholder="https://runwayml.com"
                  value={toolForm.website_url}
                  onChange={(e) => setToolForm({ ...toolForm, website_url: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Description</label>
                <input
                  type="text"
                  placeholder="Short note on recommendation reason"
                  value={toolForm.description}
                  onChange={(e) => setToolForm({ ...toolForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowToolModal(false)}
                  className="px-4 py-2 rounded-full border border-slate-200 dark:border-white/10 text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md cursor-pointer"
                >
                  {editingTool ? "Update Tool" : "Register"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EDIT SUBSCRIPTION */}
      {/* ========================================================================= */}
      {editingSub && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#0c0e18] border border-slate-200 dark:border-white/10 shadow-2xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Edit Subscription &amp; User Access
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Modifying {editingSub.user_email || subForm.email}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setEditingSub(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSubEdit} className="space-y-4">
              {/* User Email & ID Info */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-xs space-y-1">
                <div className="text-[11px] font-mono font-bold text-slate-400 uppercase">Target User</div>
                <div className="font-semibold text-slate-900 dark:text-white flex items-center justify-between">
                  <span>{subForm.email}</span>
                  <span className="text-[10px] font-mono text-slate-400">ID: {editingSub.id}</span>
                </div>
              </div>

              {/* Plan Tier Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Membership Tier
                </label>
                <select
                  value={subForm.plan}
                  onChange={(e) => {
                    const newPlan = e.target.value;
                    let newAmount = subForm.amount;
                    if (newPlan === "lifetime") newAmount = "₹999";
                    else if (newPlan === "yearly") newAmount = "₹199";
                    else if (newPlan === "free") newAmount = "₹0";
                    setSubForm({ ...subForm, plan: newPlan, amount: newAmount });
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-medium outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="yearly">AWA Pro Creator (Yearly - ₹199)</option>
                  <option value="lifetime">AWA Pro Lifetime Founder (₹999)</option>
                  <option value="free">Free Starter Account (₹0)</option>
                  <option value="custom">Custom Enterprise Tier</option>
                </select>
              </div>

              {/* Amount and Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Billed Amount
                  </label>
                  <input
                    type="text"
                    value={subForm.amount}
                    onChange={(e) => setSubForm({ ...subForm, amount: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-medium outline-none focus:border-indigo-500"
                    placeholder="₹199"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Subscription Status
                  </label>
                  <select
                    value={subForm.status}
                    onChange={(e) => {
                      const newStatus = e.target.value;
                      setSubForm({
                        ...subForm,
                        status: newStatus,
                        is_pro: newStatus === "active",
                      });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-medium outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="active">Active (Granted Access)</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="expired">Expired / Lapsed</option>
                  </select>
                </div>
              </div>

              {/* Pro Access Toggle & Credits */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">PRO Privileges</div>
                    <div className="text-[10px] text-slate-500">Unlocks all blueprints</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={Boolean(subForm.is_pro)}
                    onChange={(e) => setSubForm({ ...subForm, is_pro: e.target.checked })}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Allocated Credits
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={subForm.credits}
                    onChange={(e) => setSubForm({ ...subForm, credits: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-medium outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Payment / Reference ID */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Payment Reference / Transaction ID
                </label>
                <input
                  type="text"
                  value={subForm.paymentId}
                  onChange={(e) => setSubForm({ ...subForm, paymentId: e.target.value })}
                  placeholder="e.g. pay_N239840293 or admin_grant"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-medium outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingSub(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingSub}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-500/25 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  {savingSub ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save &amp; Sync to Supabase</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: GRANT / ADD SUBSCRIPTION */}
      {/* ========================================================================= */}
      {showAddSubModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#0c0e18] border border-slate-200 dark:border-white/10 shadow-2xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                  <Crown className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Grant PRO Subscription
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Manually assign a paid membership to any user
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowAddSubModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSub} className="space-y-4">
              {/* Select from existing users or enter custom email */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Select User Account
                </label>
                <select
                  value={subForm.email}
                  onChange={(e) => setSubForm({ ...subForm, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-medium outline-none focus:border-indigo-500 cursor-pointer mb-2"
                >
                  <option value="">-- Choose existing user or type email below --</option>
                  {adminUsers.map((u) => (
                    <option key={u.id} value={u.email}>
                      {u.name ? `${u.name} (${u.email})` : u.email} {u.is_pro ? "★ PRO" : ""}
                    </option>
                  ))}
                </select>

                <input
                  type="email"
                  placeholder="Or enter user email directly: user@example.com"
                  value={subForm.email}
                  onChange={(e) => setSubForm({ ...subForm, email: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-medium outline-none focus:border-indigo-500"
                />
              </div>

              {/* Plan Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Target Plan Tier
                </label>
                <select
                  value={subForm.plan}
                  onChange={(e) => {
                    const newPlan = e.target.value;
                    const newAmount = newPlan === "lifetime" ? "₹999" : newPlan === "yearly" ? "₹199" : "₹0";
                    setSubForm({ ...subForm, plan: newPlan, amount: newAmount });
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-medium outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="yearly">AWA Pro Creator (Yearly - ₹199)</option>
                  <option value="lifetime">AWA Pro Lifetime Founder (₹999)</option>
                  <option value="custom">Custom Enterprise Tier</option>
                </select>
              </div>

              {/* Amount and Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Plan Amount
                  </label>
                  <input
                    type="text"
                    value={subForm.amount}
                    onChange={(e) => setSubForm({ ...subForm, amount: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-medium outline-none focus:border-indigo-500"
                    placeholder="₹199"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Initial Credits
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={subForm.credits}
                    onChange={(e) => setSubForm({ ...subForm, credits: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-medium outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Payment / Grant Reference */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Payment / Reference Note
                </label>
                <input
                  type="text"
                  value={subForm.paymentId}
                  onChange={(e) => setSubForm({ ...subForm, paymentId: e.target.value })}
                  placeholder="e.g. bank_transfer_123 or admin_grant"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-medium outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddSubModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingSub}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-500/25 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  {savingSub ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Granting...</span>
                    </>
                  ) : (
                    <>
                      <Crown className="w-3.5 h-3.5" />
                      <span>Grant PRO Subscription</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
