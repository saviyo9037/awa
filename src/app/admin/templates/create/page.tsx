"use client";

import React, { useState, useEffect, useRef, useMemo, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Send,
  Eye,
  Sparkles,
  UploadCloud,
  Check,
  AlertCircle,
  Copy,
  Layers,
  Image as ImageIcon,
  Video,
  Globe,
  Presentation,
  Palette,
  Plus,
  Trash2,
  Copy as DuplicateIcon,
  ChevronDown,
  ChevronUp,
  MoveUp,
  MoveDown,
  Info,
  BookOpen,
  Cpu,
  CheckCircle2,
  Sliders,
  Type,
  Code,
  Lightbulb,
  ExternalLink,
  Shield,
  HelpCircle,
  FolderTree,
  Zap,
  RefreshCw,
  SlidersHorizontal,
  X
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

// ── Types ────────────────────────────────────────────────────────────────────
export type TemplateCategory = "image" | "video" | "website" | "slides" | "poster";

export interface SlideItem {
  id: string;
  slideNumber: number;
  title: string;
  purpose: string;
  prompt: string;
  visualDirection: string;
  notes: string;
}

export interface WorkflowStep {
  step: string;
  phase: string;
  title: string;
  desc: string;
  instruction: string;
  examplePrompt: string;
  imgUrl?: string;
}

// ── Category Presets & Variables ─────────────────────────────────────────────
const CATEGORY_DEFINITIONS: {
  id: TemplateCategory;
  name: string;
  subtitle: string;
  icon: any;
  color: string;
  badgeColor: string;
  variables: string[];
}[] = [
  {
    id: "image",
    name: "Image Generation",
    subtitle: "Create AI photorealistic, conceptual, and illustrative art.",
    icon: ImageIcon,
    color: "from-blue-600 to-indigo-600",
    badgeColor: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    variables: ["[SUBJECT]", "[STYLE]", "[ENVIRONMENT]", "[LIGHTING]", "[CAMERA]", "[ASPECT_RATIO]"],
  },
  {
    id: "video",
    name: "Video Generation",
    subtitle: "Direct cinematic motion vectors, camera pans, and AI video clips.",
    icon: Video,
    color: "from-violet-600 to-purple-600",
    badgeColor: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    variables: ["[SUBJECT]", "[SCENE]", "[ACTION]", "[CAMERA_MOVEMENT]", "[LIGHTING]", "[DURATION]"],
  },
  {
    id: "website",
    name: "Website Generation",
    subtitle: "Scaffold responsive landing pages, components, and SaaS apps.",
    icon: Globe,
    color: "from-emerald-600 to-teal-600",
    badgeColor: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    variables: ["[PROJECT_NAME]", "[TARGET_AUDIENCE]", "[TECH_STACK]", "[HERO_SECTION]", "[COLOR_PALETTE]"],
  },
  {
    id: "slides",
    name: "Slides & Presentations",
    subtitle: "Author pitch decks, keynote flows, and multi-slide narrative decks.",
    icon: Presentation,
    color: "from-amber-600 to-orange-600",
    badgeColor: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    variables: ["[TOPIC]", "[AUDIENCE]", "[TONE]", "[SLIDE_COUNT]", "[MAIN_THESIS]"],
  },
  {
    id: "poster",
    name: "Posters & Graphic Design",
    subtitle: "Create event graphics, marketing banners, and editorial layouts.",
    icon: Palette,
    color: "from-pink-600 to-rose-600",
    badgeColor: "bg-pink-500/10 text-pink-500 border-pink-500/20",
    variables: ["[HEADLINE]", "[SUBTITLE]", "[CALL_TO_ACTION]", "[DIMENSIONS]", "[BRAND_COLORS]"],
  },
];

const PRESET_IMAGES = [
  { name: "Cyber Dashboard", url: "/cyber_dashboard.jpg" },
  { name: "Cyber Portrait", url: "/cyber_portrait.jpg" },
  { name: "Holographic 3D", url: "/holographic_3d.jpg" },
  { name: "SaaS Analytics", url: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?q=80&w=800&auto=format&fit=crop" },
  { name: "Arch Cantilever", url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop" },
  { name: "Crypto Terminal", url: "https://images.unsplash.com/photo-1621504450181-5d156f8946db?q=80&w=800&auto=format&fit=crop" },
];

function TemplateBuilderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const initialCategoryParam = searchParams.get("category") as TemplateCategory | null;

  const { user } = useAuth();
  const { theme } = useTheme();

  // ── Builder Core State ───────────────────────────────────────────────────────
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory>(
    initialCategoryParam && ["image", "video", "website", "slides", "poster"].includes(initialCategoryParam)
      ? initialCategoryParam
      : "image"
  );

  const [status, setStatus] = useState<"draft" | "published">("published");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingThumb, setIsUploadingThumb] = useState(false);
  const [isAiGeneratingThumb, setIsAiGeneratingThumb] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [copiedPromptPreview, setCopiedPromptPreview] = useState(false);

  // Simulator Interactive State for [Use Template] and [Customize]
  const [simCopied, setSimCopied] = useState(false);
  const [isSimCustomizeOpen, setIsSimCustomizeOpen] = useState(false);
  const [simCustomAddon, setSimCustomAddon] = useState("");
  const [simCustomizedPrompt, setSimCustomizedPrompt] = useState<string | null>(null);
  const [simAspectRatio, setSimAspectRatio] = useState("16:9");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Step 01: Basic Information ──────────────────────────────────────────────
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [thumbnail, setThumbnail] = useState("/cyber_dashboard.jpg");
  const [tags, setTags] = useState<string[]>(["AI", "Blueprint", "Creative"]);
  const [newTagInput, setNewTagInput] = useState("");
  const [showAdvancedMetadata, setShowAdvancedMetadata] = useState(false);

  // Optional Metadata
  const [recommendedTool, setRecommendedTool] = useState("Midjourney v6.1");
  const [toolUrl, setToolUrl] = useState("https://midjourney.com");
  const [complexity, setComplexity] = useState<"beginner" | "intermediate" | "advanced">("intermediate");
  const [isPro, setIsPro] = useState(true);
  const [author, setAuthor] = useState("AWA Curators");
  const [proTip, setProTip] = useState("Use --style raw and --s 250 for realistic photographic finishes.");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");

  // ── Step 02: Category Specific Data ─────────────────────────────────────────

  // 1. IMAGE CONFIG
  const [imagePrompt, setImagePrompt] = useState(
    "Cinematic cyber layout featuring an obsidian flagship device, neon teal accents, dramatic lighting, 8k resolution --ar 16:9 --style raw"
  );
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [imageStyle, setImageStyle] = useState("Hyperrealistic Advertising Photography");
  const [imageLighting, setImageLighting] = useState("Dramatic Studio Dual Rim Light");
  const [imageCamera, setImageCamera] = useState("85mm Prime Lens f/1.8 Low Angle");
  const [imageQuality, setImageQuality] = useState("8K UHD Octane 3D Specular");
  const [negativePrompt, setNegativePrompt] = useState("blurry, low quality, oversaturated, deformed hands, watermark");

  // 2. VIDEO CONFIG
  const [videoPrompt, setVideoPrompt] = useState(
    "Cinematic camera tracking shot past obsidian futuristic vehicle accelerating into rainy neon Tokyo underpass, reflections on asphalt, 24fps"
  );
  const [videoDuration, setVideoDuration] = useState("5s");
  const [videoMotionSpeed, setVideoMotionSpeed] = useState("4.5");
  const [videoCameraMovement, setVideoCameraMovement] = useState("Smooth Low-Angle Pan Left");
  const [videoFps, setVideoFps] = useState("24 FPS");
  const [videoAudio, setVideoAudio] = useState("Atmospheric electronic drone with muffled city rain soundscape");

  // 3. WEBSITE CONFIG
  const [webProjectName, setWebProjectName] = useState("Aura SaaS Telemetry");
  const [webTargetAudience, setWebTargetAudience] = useState("AI Researchers, Engineers, and Product Founders");
  const [webPurpose, setWebPurpose] = useState("High-contrast dark mode dashboard for inspecting model inference tokens");
  const [webUiPrompt, setWebUiPrompt] = useState(
    "Build a responsive obsidian dark-mode dashboard with Next.js 15, Tailwind CSS, Lucide icons, glassmorphism cards, and Framer Motion spring physics."
  );
  const [webContextPrompt, setWebContextPrompt] = useState(
    "Product context: Enterprise platform measuring real-time VRAM allocation, GPU latency, and multi-modal pipeline runs. Strict TypeScript types and zero layout shifts required."
  );
  const [webTechStack, setWebTechStack] = useState<string[]>([
    "Next.js 15 (App Router)",
    "Tailwind CSS 4",
    "Lucide React",
    "Framer Motion",
    "TypeScript Strict",
  ]);

  // 4. SLIDES & PRESENTATIONS CONFIG
  const [presentationTopic, setPresentationTopic] = useState("Series A Pitch Deck: Autonomous Multi-Modal AI");
  const [presentationAudience, setPresentationAudience] = useState("Venture Capitalists & Angel Investors");
  const [presentationTone, setPresentationTone] = useState("High-Conviction, Bold, Metric-Driven");
  const [presentationGlobalPrompt, setPresentationGlobalPrompt] = useState(
    "10-slide widescreen presentation deck with stark obsidian backdrop, Plus Jakarta Sans typography, high-impact traction charts, and asymmetrical layout balance."
  );
  const [slides, setSlides] = useState<SlideItem[]>([
    {
      id: "slide-1",
      slideNumber: 1,
      title: "Title / Cover Slide",
      purpose: "Hook the room with bold vision statement and logo lockup.",
      prompt: "Slide 01 (Cover): Bold title 'AWA: The Multi-Modal Synthesis Engine'. Obsidian dark mode, neon teal highlight, subtitle 'Unifying Image, Video, Code and Presentation Blueprints'. 16:9 widescreen.",
      visualDirection: "Minimalist asymmetrical hero statement with glowing cyan horizon light.",
      notes: "Spend 30 seconds setting the ambitious thesis.",
    },
    {
      id: "slide-2",
      slideNumber: 2,
      title: "The Core Problem",
      purpose: "Illustrate fragmentation in current AI generation workflows.",
      prompt: "Slide 02 (Problem): Contrast fragmented, disjointed AI workflows with high latency vs unified pipelines. Three distinct pain-point cards with metric callouts in red/coral.",
      visualDirection: "Split 50/50 comparison layout with dark cards and subtle warning border.",
      notes: "Anchor the audience on how painful prompt switching is today.",
    },
    {
      id: "slide-3",
      slideNumber: 3,
      title: "The Solution & Flywheel",
      purpose: "Demonstrate AWA's unified prompt orchestration architecture.",
      prompt: "Slide 03 (Solution): Clean visual flywheel diagram showing 4 stages: Conditioning -> Synthesis -> Verification -> Deployment. Glowing nodes with connected arrows.",
      visualDirection: "Central circular architectural flywheel graphic with subtle cyan glow.",
      notes: "Walk through each quadrant of the flywheel.",
    },
    {
      id: "slide-4",
      slideNumber: 4,
      title: "Traction & Unit Economics",
      purpose: "Show 14x MoM user adoption and healthy gross margins.",
      prompt: "Slide 04 (Traction): Large bold stat '+420% MoM ARR Growth' in emerald green, paired with bar chart showing monthly active builders and 88% retention rate.",
      visualDirection: "Hero metric panel on left, clean line/bar chart on right with emerald accents.",
      notes: "Highlight the net revenue retention rate.",
    },
  ]);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  // 5. POSTER & DESIGN CONFIG
  const [posterDimensions, setPosterDimensions] = useState("1080 x 1350 (Instagram Portrait)");
  const [posterHeadline, setPosterHeadline] = useState("THE SYNTHETIC REVOLUTION");
  const [posterSupportingText, setPosterSupportingText] = useState("Join the next era of generative multi-modal design. Live keynote September 24.");
  const [posterCta, setPosterCta] = useState("CLAIM ACCESS → awa.design");
  const [posterTypography, setPosterTypography] = useState("Heavy Condensed Sans-Serif + Monospace Metadata");
  const [posterPrompt, setPosterPrompt] = useState(
    "High-contrast editorial graphic design poster. Bold typographic headline 'THE SYNTHETIC REVOLUTION' in metallic silver, glowing cyan geometric vector lines, obsidian paper texture, minimalist Swiss layout --ar 4:5"
  );

  // ── Step 03: Universal Workflow Steps (7 Steps) ──────────────────────────────
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([
    {
      step: "01",
      phase: "Concept",
      title: "Define App Scope & Purpose",
      desc: "Clarify user objective, responsive layout, and visual direction before generation.",
      instruction: "Clarify user objective, responsive layout, and visual direction before generation.",
      examplePrompt: "A cinematic luxury product advertisement in a dark futuristic studio environment with dramatic lighting and realistic reflections.",
      imgUrl: "/cyber_dashboard.jpg",
    },
    {
      step: "02",
      phase: "Subject",
      title: "Identify Primary Subject & Assets",
      desc: "Specify tactile surfaces, hero elements, and focal objects in detail.",
      instruction: "Specify tactile surfaces, hero elements, and focal objects in detail.",
      examplePrompt: "Hero subject: ultra-slim flagship phone, obsidian ceramic chassis, triple camera array with anti-reflective glass lenses.",
      imgUrl: "/cyber_portrait.jpg",
    },
    {
      step: "03",
      phase: "Composition",
      title: "Establish Framing & Negative Space",
      desc: "Set isometric low-angle perspective, focal length, and grid hierarchy.",
      instruction: "Set isometric low-angle perspective, focal length, and grid hierarchy.",
      examplePrompt: "Shot on 85mm prime lens, dynamic low-angle perspective, centered composition, shallow depth of field.",
      imgUrl: "/holographic_3d.jpg",
    },
    {
      step: "04",
      phase: "Style",
      title: "Select Visual Style & Aesthetics",
      desc: "Direct rendering realism, Octane specular finish, or editorial photography.",
      instruction: "Direct rendering realism, Octane specular finish, or editorial photography.",
      examplePrompt: "Commercial luxury advertising style, hyper-realistic studio photography, Octane 3D render precision, 8K photorealism.",
      imgUrl: "/cyber_portrait.jpg",
    },
    {
      step: "05",
      phase: "Lighting",
      title: "Direct Lighting Mood & Atmosphere",
      desc: "Sculpt scene with key lights, rim lights, and soft specular edge reflections.",
      instruction: "Sculpt scene with key lights, rim lights, and soft specular edge reflections.",
      examplePrompt: "Dramatic studio lighting, dual soft blue and cool white rim lights, clean specular highlights along edges.",
      imgUrl: "/holographic_3d.jpg",
    },
    {
      step: "06",
      phase: "Parameters",
      title: "Tune Model Parameters",
      desc: "Set aspect ratio, stylize strength, and raw mode flags for maximum fidelity.",
      instruction: "Set aspect ratio, stylize strength, and raw mode flags for maximum fidelity.",
      examplePrompt: "--ar 16:9 --style raw --s 250 --v 6.1",
      imgUrl: "/cyber_dashboard.jpg",
    },
    {
      step: "07",
      phase: "Generate",
      title: "Synthesize & Upscale Live",
      desc: "Execute finalized prompt directive, inspect variation grid, and upscale to 8K finish.",
      instruction: "Execute finalized prompt directive, inspect variation grid, and upscale to 8K finish.",
      examplePrompt: "Execute prompt in Midjourney /imagine console, select variation, and upscale to 8K UHD finish.",
      imgUrl: "/workflow-mockup.jpg",
    },
  ]);

  const [activeWorkflowStepIndex, setActiveWorkflowStepIndex] = useState(0);

  // ── Subcategories by Category ───────────────────────────────────────────────
  const [subcategoriesMap, setSubcategoriesMap] = useState<Record<string, string[]>>({
    image: ["Cinematic", "Portrait", "Product", "Architecture", "Concept Art", "Wallpapers"],
    video: ["Drone Hyperlapse", "Cinematic Trailer", "Product Reel", "Motion Graphics", "Parallax"],
    website: ["SaaS Landing", "Portfolio", "E-Commerce", "Dashboard", "Documentation"],
    slides: ["Pitch Deck", "Executive Summary", "Keynote", "Product Launch", "Quarterly Review"],
    poster: ["Event Poster", "Social Graphic", "Billboard", "Magazine Editorial", "Brand Ad"],
  });
  const [customSubcatInput, setCustomSubcatInput] = useState("");
  const [isAddingSubcat, setIsAddingSubcat] = useState(false);

  // ── Show Toast Helper ───────────────────────────────────────────────────────
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // ── Fetch Template If Editing ───────────────────────────────────────────────
  useEffect(() => {
    if (editId) {
      fetch(`/api/admin/templates`)
        .then((r) => r.json())
        .then((data) => {
          if (data.success && Array.isArray(data.data)) {
            const found = data.data.find((t: any) => t.id === editId || t.slug === editId);
            if (found) {
              setTitle(found.title || "");
              setDescription(found.desc || found.description || "");
              const catKey = (found.category_id || found.category || "image").toLowerCase();
              if (["image", "video", "website", "slides", "poster"].includes(catKey)) {
                setSelectedCategory(catKey as TemplateCategory);
              }
              setSubcategory(found.subcategory || "");
              setThumbnail(found.image_url || found.img || "/cyber_dashboard.jpg");
              setRecommendedTool(found.tool || "Midjourney v6.1");
              setToolUrl(found.toolUrl || "https://midjourney.com");
              setIsPro(Boolean(found.featured || found.isPro));
              setComplexity(found.complexity || "intermediate");
              setProTip(found.tip || "");
              if (found.prompt || found.prompt_text) {
                setImagePrompt(found.prompt || found.prompt_text);
                setVideoPrompt(found.prompt || found.prompt_text);
                setWebUiPrompt(found.prompt || found.prompt_text);
                setPosterPrompt(found.prompt || found.prompt_text);
              }
              if (found.steps && Array.isArray(found.steps) && found.steps.length > 0) {
                setWorkflowSteps(
                  found.steps.map((st: any, idx: number) => ({
                    step: String(idx + 1).padStart(2, "0"),
                    phase: st.phase || st.label || `Step 0${idx + 1}`,
                    title: st.title || `Step 0${idx + 1}`,
                    desc: st.desc || st.instruction || "",
                    instruction: st.instruction || st.desc || "",
                    examplePrompt: st.examplePrompt || st.prompt || "",
                    imgUrl: st.imgUrl || found.image_url || "/cyber_dashboard.jpg",
                  }))
                );
              }
              showToast(`Loaded blueprint "${found.title}" for editing.`);
            }
          }
        })
        .catch((err) => console.error("Error loading template for edit:", err));
    }
  }, [editId]);

  // ── Dynamic Finished Prompt Calculation ─────────────────────────────────────
  const effectivePrompt = useMemo(() => {
    switch (selectedCategory) {
      case "image":
        return imagePrompt;
      case "video":
        return videoPrompt;
      case "website":
        return `// [UI DIRECTIVE]\n${webUiPrompt}\n\n// [PROJECT CONTEXT]\n${webContextPrompt}\n\n// [STACK & SPECS]\n${webTechStack.join(", ")}`;
      case "slides":
        return `// [PRESENTATION CONTEXT: ${presentationTopic}]\n${presentationGlobalPrompt}\n\n// [SLIDE 01 DECK PROMPT]\n${slides[0]?.prompt || ""}`;
      case "poster":
        return `${posterPrompt}\n\nHeadline: "${posterHeadline}" • Dimensions: ${posterDimensions} • CTA: "${posterCta}"`;
      default:
        return imagePrompt;
    }
  }, [
    selectedCategory,
    imagePrompt,
    videoPrompt,
    webUiPrompt,
    webContextPrompt,
    webTechStack,
    presentationTopic,
    presentationGlobalPrompt,
    slides,
    posterPrompt,
    posterHeadline,
    posterDimensions,
    posterCta,
  ]);

  // ── Auto-Fill Workflow Steps by Category ────────────────────────────────────
  const handleLoadCategoryWorkflowPreset = (cat: TemplateCategory) => {
    if (cat === "video") {
      setWorkflowSteps([
        { step: "01", phase: "Scene", title: "Define Motion Narrative & Pacing", desc: "Outline scene action, pacing, duration, and emotional mood.", instruction: "Outline scene action, pacing, duration, and emotional mood.", examplePrompt: "Cinematic drone hyperlapse moving across neon city streets at midnight, rain reflections, anamorphic lens flare.", imgUrl: "/cyber_dashboard.jpg" },
        { step: "02", phase: "Subject", title: "Detail Moving Elements & Actors", desc: "Specify primary focal actor, vehicles, and dynamic interactions.", instruction: "Specify primary focal actor, vehicles, and dynamic interactions.", examplePrompt: "Futuristic sports car accelerating through neon underpass with red taillight trails.", imgUrl: "/cyber_portrait.jpg" },
        { step: "03", phase: "Camera", title: "Establish Camera Speed & Angle", desc: "Define camera speed, tracking angle, pan, and focal length.", instruction: "Define camera speed, tracking angle, pan, and focal length.", examplePrompt: "Tracking shot at wheel level, 24mm wide angle, 24fps smooth motion.", imgUrl: "/holographic_3d.jpg" },
        { step: "04", phase: "Style", title: "Color Grade & Cinema Stock", desc: "Choose cinema film stock, color tone, and shutter angle.", instruction: "Choose cinema film stock, color tone, and shutter angle.", examplePrompt: "Kodak Vision3 500T, teal and orange cinema grade, subtle 35mm grain.", imgUrl: "/flower_night_street.jpg" },
        { step: "05", phase: "Lighting", title: "Lighting & Atmosphere", desc: "Direct key lights, headlights, and atmospheric volumetric fog.", instruction: "Direct key lights, headlights, and atmospheric volumetric fog.", examplePrompt: "Volumetric fog illuminated by halogen streetlights and pulsing neon signs.", imgUrl: "/flower_snow_winter.jpg" },
        { step: "06", phase: "Parameters", title: "Motion & Seed Flags", desc: "Tune motion amplitude, FPS, and consistency seeds.", instruction: "Tune motion amplitude, FPS, and consistency seeds.", examplePrompt: "--motion 5 --fps 24 --camera pan-right --seed 48920194", imgUrl: "/cyber_dashboard.jpg" },
        { step: "07", phase: "Generate", title: "Render & Upscale 4K", desc: "Synthesize in Runway Gen-3 / Kling 1.5, upscale to 4K 60fps.", instruction: "Synthesize in Runway Gen-3 / Kling 1.5, upscale to 4K 60fps.", examplePrompt: "Execute prompt in Runway Gen-3 Alpha, interpolate with Topaz Video AI to 4K 60fps.", imgUrl: "/workflow-mockup.jpg" },
      ]);
      setRecommendedTool("Runway Gen-3 Alpha");
      setToolUrl("https://runwayml.com");
      setProTip("Motion Tip: Set motion speed to 4-5 and camera pan left for fluid cinematic parallax.");
    } else if (cat === "website") {
      setWorkflowSteps([
        { step: "01", phase: "Scope", title: "Define App Scope & UX", desc: "Clarify user objective, responsive layout, and key micro-interactions.", instruction: "Clarify user objective, responsive layout, and key micro-interactions.", examplePrompt: "Dark mode SaaS dashboard for real-time AI inference telemetry and prompt experimentation.", imgUrl: "/cyber_dashboard.jpg" },
        { step: "02", phase: "Entities", title: "Core Data Entities & Cards", desc: "Specify metrics panels, charts, activity feeds, and action triggers.", instruction: "Specify metrics panels, charts, activity feeds, and action triggers.", examplePrompt: "Hero metric cards with mini sparklines, latency gauge, and active node status tags.", imgUrl: "/cyber_portrait.jpg" },
        { step: "03", phase: "Layout", title: "Grid & Responsive Hierarchy", desc: "Structure 12-column responsive layout with collapsible sidebar and breadcrumbs.", instruction: "Structure 12-column responsive layout with collapsible sidebar and breadcrumbs.", examplePrompt: "Collapsible navigation rail, sticky filter bar, and 3-column responsive flex grid.", imgUrl: "/holographic_3d.jpg" },
        { step: "04", phase: "Tokens", title: "Design System & Tokens", desc: "Define obsidian color palette (#090a0f), cyan accents, and typography.", instruction: "Define obsidian color palette (#090a0f), cyan accents, and typography.", examplePrompt: "Tailwind CSS dark mode, bg-[#0a0b10], text-cyan-400 accents, Inter and JetBrains Mono.", imgUrl: "/flower_night_street.jpg" },
        { step: "05", phase: "Surfaces", title: "Glow & Surface Borders", desc: "Add subtle border highlights, glassmorphism, and hover lift effects.", instruction: "Add subtle border highlights, glassmorphism, and hover lift effects.", examplePrompt: "border-white/10, backdrop-blur-xl, subtle radial gradient glow behind cards.", imgUrl: "/flower_snow_winter.jpg" },
        { step: "06", phase: "Stack", title: "Tech Stack & Libs", desc: "Lock framework version, icon library, and animation springs.", instruction: "Lock framework version, icon library, and animation springs.", examplePrompt: "Next.js 15 App Router, Tailwind CSS 4, Lucide React, Framer Motion springs.", imgUrl: "/cyber_dashboard.jpg" },
        { step: "07", phase: "Deploy", title: "Build & Deploy to Vercel", desc: "Run typecheck, compile bundle, and verify zero layout shifts.", instruction: "Run typecheck, compile bundle, and verify zero layout shifts.", examplePrompt: "Run `npm run build`, test accessibility, and push to production on Vercel.", imgUrl: "/workflow-mockup.jpg" },
      ]);
      setRecommendedTool("Claude 3.7 Sonnet & Cursor");
      setToolUrl("https://cursor.com");
      setProTip("Web Tip: Use React 19 server components and Tailwind CSS for zero layout shift.");
    } else if (cat === "slides") {
      setWorkflowSteps([
        { step: "01", phase: "Narrative", title: "Core Thesis & Narrative", desc: "Define pitch deck flow, problem statement, and key takeaway.", instruction: "Define pitch deck flow, problem statement, and key takeaway.", examplePrompt: "10-slide Seed-stage AI platform pitch deck with high-impact bold typography.", imgUrl: "/cyber_dashboard.jpg" },
        { step: "02", phase: "Visual", title: "Hero Diagram / Metric", desc: "Identify key data visualization, architecture map, or traction chart.", instruction: "Identify key data visualization, architecture map, or traction chart.", examplePrompt: "Visual flywheel diagram showing data flywheel, model tuning, and recurring revenue.", imgUrl: "/cyber_portrait.jpg" },
        { step: "03", phase: "Layout", title: "Slide Grid & Negative Space", desc: "16:9 widescreen layout with ample margins and clear focal anchors.", instruction: "16:9 widescreen layout with ample margins and clear focal anchors.", examplePrompt: "16:9 aspect ratio, 60/40 asymmetrical split between bold statement and visual artifact.", imgUrl: "/holographic_3d.jpg" },
        { step: "04", phase: "Type", title: "Typography & Colorway", desc: "Bold sans-serif headlines, high-contrast monochrome with single neon accent.", instruction: "Bold sans-serif headlines, high-contrast monochrome with single neon accent.", examplePrompt: "Deep charcoal background, stark white headlines in Plus Jakarta Sans, emerald traction tags.", imgUrl: "/flower_night_street.jpg" },
        { step: "05", phase: "Punch", title: "Contrast & Visual Punch", desc: "Highlight pivotal metrics with soft spotlight gradients.", instruction: "Highlight pivotal metrics with soft spotlight gradients.", examplePrompt: "Subtle linear gradient card backdrops, glowing metric highlight pill.", imgUrl: "/flower_snow_winter.jpg" },
        { step: "06", phase: "Export", title: "Export & Aspect Formats", desc: "Ensure 1920x1080 resolution, vector asset exports, and printable PDF.", instruction: "Ensure 1920x1080 resolution, vector asset exports, and printable PDF.", examplePrompt: "--ar 16:9 --dpi 300 vector-ready SVG exports.", imgUrl: "/cyber_dashboard.jpg" },
        { step: "07", phase: "Deliver", title: "Deliver Keynote / Deck", desc: "Export high-resolution PDF and interactive Figma / Keynote presentation.", instruction: "Export high-resolution PDF and interactive Figma / Keynote presentation.", examplePrompt: "Export vector deck to Pitch / Figma, verify slide transitions, and present.", imgUrl: "/workflow-mockup.jpg" },
      ]);
      setRecommendedTool("Pitch & Gamma AI");
      setToolUrl("https://gamma.app");
      setProTip("Deck Tip: Keep maximum 1 focal idea per slide with strong 60/40 visual contrast.");
    } else {
      // Default image
      setWorkflowSteps([
        { step: "01", phase: "Concept", title: "Define Creative Concept", desc: "Clearly define the main idea, purpose, and visual direction of the image.", instruction: "Clearly define the main idea, purpose, and visual direction of the image.", examplePrompt: "A cinematic luxury product advertisement in a dark futuristic studio environment with dramatic lighting and realistic reflections.", imgUrl: "/cyber_dashboard.jpg" },
        { step: "02", phase: "Subject", title: "Identify Primary Subject", desc: "Specify the exact physical properties, tactile surfaces, and precise placement.", instruction: "Specify the exact physical properties, tactile surfaces, and precise placement.", examplePrompt: "Hero subject: ultra-slim flagship phone, obsidian ceramic chassis, triple camera array with anti-reflective glass lenses.", imgUrl: "/cyber_portrait.jpg" },
        { step: "03", phase: "Composition", title: "Establish Framing & Lens", desc: "Position camera angle, focal length, depth of field, and negative space.", instruction: "Position camera angle, focal length, depth of field, and negative space.", examplePrompt: "Shot on 85mm prime lens, dynamic low-angle perspective, centered composition, shallow depth of field.", imgUrl: "/holographic_3d.jpg" },
        { step: "04", phase: "Style", title: "Select Aesthetics & Finish", desc: "Choose rendering realism, Octane 3D precision, or editorial photography.", instruction: "Choose rendering realism, Octane 3D precision, or editorial photography.", examplePrompt: "Commercial luxury advertising style, hyper-realistic studio photography, Octane 3D render precision, 8K photorealism.", imgUrl: "/flower_night_street.jpg" },
        { step: "05", phase: "Lighting", title: "Direct Lighting & Mood", desc: "Sculpt scene with key lights, rim lights, and soft specular highlights.", instruction: "Sculpt scene with key lights, rim lights, and soft specular highlights.", examplePrompt: "Dramatic studio lighting, dual soft blue and cool white rim lights, clean specular highlights along edges.", imgUrl: "/flower_snow_winter.jpg" },
        { step: "06", phase: "Parameters", title: "Tune Engine Parameters", desc: "Set aspect ratio, stylize strength, and raw mode flags for maximum fidelity.", instruction: "Set aspect ratio, stylize strength, and raw mode flags for maximum fidelity.", examplePrompt: "--ar 16:9 --style raw --s 250 --v 6.1", imgUrl: "/cyber_dashboard.jpg" },
        { step: "07", phase: "Generate", title: "Synthesize & Upscale 8K", desc: "Execute prompt in AI engine, inspect variations, and upscale to 8K.", instruction: "Execute prompt in AI engine, inspect variations, and upscale to 8K.", examplePrompt: "Execute prompt in Midjourney /imagine console, select variation, and upscale to 8K UHD finish.", imgUrl: "/workflow-mockup.jpg" },
      ]);
      setRecommendedTool("Midjourney v6.1");
      setToolUrl("https://midjourney.com");
      setProTip("Image Tip: Use --style raw and --s 250 for realistic photographic finishes.");
    }
  };

  // ── Category Switch Confirmation ────────────────────────────────────────────
  const handleSelectCategory = (newCat: TemplateCategory) => {
    if (newCat === selectedCategory) return;
    if (title.trim() && !confirm(`Switch builder to ${newCat.toUpperCase()}? Dynamic prompt fields will adapt.`)) {
      return;
    }
    setSelectedCategory(newCat);
    setSubcategory("");
    handleLoadCategoryWorkflowPreset(newCat);
    showToast(`Switched builder mode to ${newCat.toUpperCase()}`);
  };

  // ── ImageKit File Upload ────────────────────────────────────────────────────
  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingThumb(true);
    try {
      // 1. Direct ImageKit Upload via Client Auth
      let uploadedUrl: string | null = null;
      try {
        const authRes = await fetch("/api/imagekit/auth");
        if (authRes.ok) {
          const authData = await authRes.json();
          if (authData.success && authData.signature) {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("fileName", file.name);
            formData.append("publicKey", authData.publicKey);
            formData.append("signature", authData.signature);
            formData.append("expire", String(authData.expire));
            formData.append("token", authData.token);
            formData.append("useUniqueFileName", "true");
            formData.append("folder", "/blueprints");

            const ikRes = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
              method: "POST",
              body: formData,
            });
            const ikData = await ikRes.json();
            if (ikRes.ok && ikData.url) {
              uploadedUrl = ikData.url;
            }
          }
        }
      } catch (err) {
        console.warn("Direct ImageKit upload failed, falling back to server route", err);
      }

      // 2. Fallback to /api/admin/upload
      if (!uploadedUrl) {
        const fbFormData = new FormData();
        fbFormData.append("file", file);
        const fbRes = await fetch("/api/admin/upload", { method: "POST", body: fbFormData });
        const fbData = await fbRes.json();
        if (fbData.success && fbData.url) {
          uploadedUrl = fbData.url;
        }
      }

      if (uploadedUrl) {
        setThumbnail(uploadedUrl);
        showToast("Thumbnail uploaded to production CDN!");
      } else {
        showToast("Failed to upload thumbnail image");
      }
    } catch (err) {
      console.error("Upload error:", err);
      showToast("Error uploading thumbnail file");
    } finally {
      setIsUploadingThumb(false);
    }
  };

  // ── AI Thumbnail Generator ──────────────────────────────────────────────────
  const handleAiGenerateThumb = async () => {
    const promptSeed = title.trim() || description.trim() || `${selectedCategory} AI masterclass showcase`;
    setIsAiGeneratingThumb(true);
    try {
      const generated = `https://image.pollinations.ai/prompt/${encodeURIComponent(
        promptSeed + ", cinematic lighting, 8k resolution, ultra detailed render"
      )}?width=1280&height=720&nologo=true`;
      setThumbnail(generated);
      showToast("AI thumbnail generated!");
    } catch {
      showToast("Could not generate AI thumbnail");
    } finally {
      setIsAiGeneratingThumb(false);
    }
  };

  // ── Tag Management ──────────────────────────────────────────────────────────
  const handleAddTag = () => {
    if (!newTagInput.trim()) return;
    const clean = newTagInput.trim().replace(/^#/, "");
    if (!tags.includes(clean)) {
      setTags([...tags, clean]);
    }
    setNewTagInput("");
  };

  const handleRemoveTag = (t: string) => {
    setTags(tags.filter((x) => x !== t));
  };

  // ── Insert Variable into Prompt ─────────────────────────────────────────────
  const insertVariable = (variable: string) => {
    switch (selectedCategory) {
      case "image":
        setImagePrompt((p) => `${p} ${variable}`);
        break;
      case "video":
        setVideoPrompt((p) => `${p} ${variable}`);
        break;
      case "website":
        setWebUiPrompt((p) => `${p} ${variable}`);
        break;
      case "slides":
        if (slides[activeSlideIndex]) {
          const updated = [...slides];
          updated[activeSlideIndex].prompt = `${updated[activeSlideIndex].prompt} ${variable}`;
          setSlides(updated);
        } else {
          setPresentationGlobalPrompt((p) => `${p} ${variable}`);
        }
        break;
      case "poster":
        setPosterPrompt((p) => `${p} ${variable}`);
        break;
    }
    showToast(`Inserted variable ${variable}`);
  };

  // ── Slide Manager Actions ───────────────────────────────────────────────────
  const handleAddSlide = () => {
    const newNum = slides.length + 1;
    const newSlide: SlideItem = {
      id: `slide-${Date.now()}`,
      slideNumber: newNum,
      title: `Slide 0${newNum}: New Section`,
      purpose: "Define section purpose and core takeaway.",
      prompt: `Slide 0${newNum}: Key architectural point with bold headline and supporting data points. 16:9 widescreen.`,
      visualDirection: "Clean 2-column layout with high visual contrast.",
      notes: "Speaker talking points for this slide.",
    };
    setSlides([...slides, newSlide]);
    setActiveSlideIndex(slides.length);
    showToast(`Added Slide 0${newNum}`);
  };

  const handleDeleteSlide = (idx: number) => {
    if (slides.length <= 1) {
      showToast("At least one slide is required in a slide deck.");
      return;
    }
    const updated = slides.filter((_, i) => i !== idx).map((s, i) => ({ ...s, slideNumber: i + 1 }));
    setSlides(updated);
    setActiveSlideIndex(Math.max(0, idx - 1));
    showToast("Slide removed");
  };

  const handleDuplicateSlide = (idx: number) => {
    const target = slides[idx];
    const newSlide: SlideItem = {
      ...target,
      id: `slide-${Date.now()}`,
      slideNumber: slides.length + 1,
      title: `${target.title} (Copy)`,
    };
    const updated = [...slides.slice(0, idx + 1), newSlide, ...slides.slice(idx + 1)].map((s, i) => ({
      ...s,
      slideNumber: i + 1,
    }));
    setSlides(updated);
    setActiveSlideIndex(idx + 1);
    showToast("Slide duplicated");
  };

  // ── Validation Logic ────────────────────────────────────────────────────────
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!title.trim()) {
      errors.title = "Template Name is required";
    }

    if (selectedCategory === "image" && !imagePrompt.trim()) {
      errors.prompt = "Main Generation Prompt is required for Image templates";
    }

    if (selectedCategory === "video" && !videoPrompt.trim()) {
      errors.prompt = "Video Generation Prompt is required for Video templates";
    }

    if (selectedCategory === "website") {
      if (!webUiPrompt.trim()) errors.webUiPrompt = "UI Design Prompt is required";
      if (!webContextPrompt.trim()) errors.webContextPrompt = "Project Context is required";
    }

    if (selectedCategory === "slides") {
      if (slides.length === 0) {
        errors.slides = "At least one slide prompt is required";
      }
      if (!slides[0]?.prompt?.trim()) {
        errors.slides = "Slide 01 must have a prompt";
      }
    }

    if (selectedCategory === "poster" && !posterPrompt.trim()) {
      errors.prompt = "Poster Design Prompt is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ── Publish / Save Handler ──────────────────────────────────────────────────
  const handleSaveTemplate = async (targetStatus: "draft" | "published" = "published") => {
    if (!validateForm()) {
      showToast("⚠️ Please fill in all required fields marked in red.");
      return;
    }

    setIsSubmitting(true);
    try {
      const mediaType = selectedCategory === "video" ? "video" : selectedCategory === "website" ? "code" : "image";

      const payload = {
        title: title.trim(),
        desc: description.trim() || `${selectedCategory.toUpperCase()} prompt blueprint authored in AWA Builder.`,
        prompt: effectivePrompt.trim(),
        category: selectedCategory,
        subcategory: subcategory.trim() || undefined,
        tool: recommendedTool,
        toolUrl,
        img: thumbnail,
        tags: tags.join(","),
        isPro,
        complexity,
        mediaType,
        videoUrl: selectedCategory === "video" ? thumbnail : "",
        tip: proTip,
        steps: workflowSteps.map((st, i) => ({
          step: String(i + 1).padStart(2, "0"),
          phase: st.phase,
          title: st.title,
          desc: st.desc,
          instruction: st.desc,
          examplePrompt: st.examplePrompt,
          imgUrl: st.imgUrl || thumbnail,
        })),
        status: targetStatus,
      };

      let res;
      if (editId) {
        res = await fetch(`/api/admin/templates/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`/api/admin/templates`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (data.success) {
        showToast(
          targetStatus === "published"
            ? `🎉 Blueprint "${title}" published live to catalog!`
            : `Draft saved for "${title}".`
        );
        setTimeout(() => {
          router.push("/admin");
        }, 1200);
      } else {
        showToast(data.error || "Failed to save template blueprint.");
      }
    } catch (err) {
      console.error("Save error:", err);
      showToast("Error connecting to server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeCategoryMeta = CATEGORY_DEFINITIONS.find((c) => c.id === selectedCategory)!;

  return (
    <div className="min-h-screen bg-[#07080d] text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-[500] px-4 py-2.5 rounded-2xl bg-slate-900/95 border border-indigo-500/40 text-white text-xs font-semibold shadow-2xl backdrop-blur-md animate-in slide-in-from-top-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── Sticky Top Action Bar ────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 h-16 bg-[#0a0c13]/90 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 hover:bg-white/5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Back to Admin</span>
          </Link>

          <div className="h-5 w-[1px] bg-white/10 hidden sm:block" />

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-white tracking-tight">
                {editId ? "Edit Blueprint" : "Visual Template Builder"}
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-semibold">
                {selectedCategory.toUpperCase()}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono hidden md:block">
              Authoring production-grade prompt architectures for AWA
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => handleSaveTemplate("draft")}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 font-medium text-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            Save Draft
          </button>

          <button
            type="button"
            onClick={() => handleSaveTemplate("published")}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
          >
            {isSubmitting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            <span>{isSubmitting ? "Publishing..." : editId ? "Update Blueprint" : "Publish to Catalog"}</span>
          </button>
        </div>
      </header>

      {/* ── Main Two-Column Layout ───────────────────────────────────────────── */}
      <main className="flex-1 max-w-[1700px] w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ── LEFT COLUMN: BUILDER WORKSPACE (70% - 8 Cols) ──────────────────── */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-8">
          {/* SECTION 01: BASIC INFORMATION */}
          <section className="p-6 sm:p-8 rounded-3xl bg-[#0e1019] border border-white/10 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-indigo-500/10 text-indigo-400 font-mono text-xs flex items-center justify-center font-bold">
                  01
                </span>
                <div>
                  <h2 className="text-base font-bold text-white">Basic Information</h2>
                  <p className="text-xs text-slate-400">Core deliverable metadata and category classification</p>
                </div>
              </div>
            </div>

            {/* Template Name & Short Description */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Template Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Neo-Obsidian Cyber Hero Landing"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border text-xs text-white focus:outline-none transition-colors ${
                    validationErrors.title ? "border-rose-500 ring-1 ring-rose-500/30" : "border-white/10 focus:border-indigo-500"
                  }`}
                />
                {validationErrors.title && (
                  <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {validationErrors.title}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Concise overview explaining what this prompt generates and the visual finish it achieves..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 leading-relaxed"
                />
              </div>
            </div>

            {/* Visual Category Selector Cards */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Template Category <span className="text-slate-400 font-normal">(Determines builder structure)</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {CATEGORY_DEFINITIONS.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleSelectCategory(cat.id)}
                      className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer group ${
                        isSelected
                          ? "bg-indigo-600/15 border-indigo-500 shadow-md shadow-indigo-500/10 ring-1 ring-indigo-500/30"
                          : "bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                            isSelected ? "bg-indigo-600 text-white" : "bg-white/5 text-slate-400 group-hover:text-white"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                      </div>
                      <div>
                        <div className={`text-xs font-bold ${isSelected ? "text-white" : "text-slate-300"}`}>
                          {cat.name}
                        </div>
                        <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{cat.subtitle}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Subcategory Selection & Inline Adder */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Subcategory Focus
                </label>
                <div className="flex gap-2">
                  <select
                    value={subcategory}
                    onChange={(e) => setSubcategory(e.target.value)}
                    className="flex-1 px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="">General (No Subcategory)</option>
                    {(subcategoriesMap[selectedCategory] || []).map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setIsAddingSubcat(!isAddingSubcat)}
                    className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 cursor-pointer"
                  >
                    + New
                  </button>
                </div>

                {isAddingSubcat && (
                  <div className="flex items-center gap-2 mt-2 animate-in fade-in">
                    <input
                      type="text"
                      placeholder="Add subcategory name..."
                      value={customSubcatInput}
                      onChange={(e) => setCustomSubcatInput(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-white/5 border border-white/10 text-white"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (customSubcatInput.trim()) {
                          const clean = customSubcatInput.trim();
                          setSubcategoriesMap((prev) => ({
                            ...prev,
                            [selectedCategory]: [...(prev[selectedCategory] || []), clean],
                          }));
                          setSubcategory(clean);
                          setCustomSubcatInput("");
                          setIsAddingSubcat(false);
                          showToast(`Added subcategory: ${clean}`);
                        }
                      }}
                      className="px-3 py-1.5 text-xs bg-indigo-600 rounded-lg text-white font-medium"
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>

              {/* Tags Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Tags</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type tag & press enter..."
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    className="flex-1 px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 cursor-pointer"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-2">
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-[11px] text-slate-300"
                    >
                      #{t}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(t)}
                        className="text-slate-500 hover:text-rose-400 cursor-pointer ml-0.5"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Thumbnail Asset Uploader & Presets */}
            <div className="p-4 rounded-2xl border border-dashed border-white/15 bg-white/[0.01] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                  <UploadCloud className="w-4 h-4 text-indigo-400" />
                  <span>Thumbnail / Cover Image Asset</span>
                </span>
                {isUploadingThumb && <span className="text-xs text-indigo-400 animate-pulse font-mono">Uploading CDN...</span>}
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleThumbnailUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingThumb || isAiGeneratingThumb}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Upload Image File</span>
                </button>

                <button
                  type="button"
                  onClick={handleAiGenerateThumb}
                  disabled={isUploadingThumb || isAiGeneratingThumb}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isAiGeneratingThumb ? "animate-spin" : ""}`} />
                  <span>{isAiGeneratingThumb ? "Generating..." : "⚡ Generate AI Image"}</span>
                </button>

                <input
                  type="text"
                  placeholder="Or paste image URL directly..."
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                  className="flex-1 min-w-[200px] px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-slate-300"
                />
              </div>

              {/* Preset Selector */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase mr-1">High-Res Presets:</span>
                {PRESET_IMAGES.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => setThumbnail(p.url)}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-mono border transition-all cursor-pointer ${
                      thumbnail === p.url
                        ? "bg-indigo-500/20 text-indigo-400 border-indigo-500"
                        : "bg-white/[0.02] border-white/10 text-slate-400 hover:text-white"
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Expandable Advanced Metadata & SEO */}
            <div className="border-t border-white/5 pt-3">
              <button
                type="button"
                onClick={() => setShowAdvancedMetadata(!showAdvancedMetadata)}
                className="flex items-center justify-between w-full text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer py-1"
              >
                <span className="flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Advanced Settings, SEO &amp; Authoring Directives</span>
                </span>
                {showAdvancedMetadata ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showAdvancedMetadata && (
                <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 animate-in fade-in">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Recommended AI Tool</label>
                    <input
                      type="text"
                      value={recommendedTool}
                      onChange={(e) => setRecommendedTool(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Tool Official URL</label>
                    <input
                      type="text"
                      value={toolUrl}
                      onChange={(e) => setToolUrl(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-slate-300"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Complexity</label>
                    <select
                      value={complexity}
                      onChange={(e: any) => setComplexity(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white"
                    >
                      <option value="beginner">Beginner Friendly</option>
                      <option value="intermediate">Intermediate Master</option>
                      <option value="advanced">Advanced Specialist</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Access Tier</label>
                    <select
                      value={isPro ? "pro" : "free"}
                      onChange={(e) => setIsPro(e.target.value === "pro")}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white"
                    >
                      <option value="pro">PRO Subscriber Tier</option>
                      <option value="free">Free Public Tier</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Curator / Author</label>
                    <input
                      type="text"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Authoring Pro Tip</label>
                    <input
                      type="text"
                      value={proTip}
                      onChange={(e) => setProTip(e.target.value)}
                      placeholder="e.g. Set motion to 4 and camera pan left"
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-amber-300"
                    />
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* SECTION 02: DYNAMIC CATEGORY BUILDER */}
          <section className="p-6 sm:p-8 rounded-3xl bg-[#0e1019] border border-white/10 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-indigo-500/10 text-indigo-400 font-mono text-xs flex items-center justify-center font-bold">
                  02
                </span>
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <span>{activeCategoryMeta.name} Builder</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/10 text-slate-300">
                      Dynamic Architecture
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400">Tailored fields and prompt engineering for {selectedCategory}</p>
                </div>
              </div>

              {/* Quick Variable Insertion Pill Bar */}
              <div className="hidden sm:flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-mono text-slate-500 uppercase mr-1">+ Variables:</span>
                {activeCategoryMeta.variables.map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => insertVariable(v)}
                    className="px-2 py-0.5 rounded-md bg-white/5 hover:bg-indigo-500/20 hover:text-indigo-300 border border-white/10 text-[10px] font-mono transition-colors cursor-pointer text-slate-300"
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* ── CASE 1: IMAGE BUILDER ────────────────────────────────────────── */}
            {selectedCategory === "image" && (
              <div className="space-y-5 animate-in fade-in">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <span>Main Generation Prompt</span>
                      <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[10px] text-slate-500 font-mono">100% finished prompt directive</span>
                  </div>
                  <textarea
                    rows={4}
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    className="w-full p-4 rounded-2xl bg-white/[0.04] border border-white/10 text-xs font-mono text-white leading-relaxed focus:outline-none focus:border-indigo-500"
                  />
                  {validationErrors.prompt && (
                    <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {validationErrors.prompt}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Aspect Ratio</label>
                    <select
                      value={aspectRatio}
                      onChange={(e) => setAspectRatio(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white"
                    >
                      <option value="16:9">16:9 Widescreen Landscape</option>
                      <option value="1:1">1:1 Square Feed</option>
                      <option value="9:16">9:16 Vertical Story</option>
                      <option value="4:3">4:3 Standard</option>
                      <option value="21:9">21:9 Ultrawide Cinema</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Visual Style</label>
                    <input
                      type="text"
                      value={imageStyle}
                      onChange={(e) => setImageStyle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Lighting Direction</label>
                    <input
                      type="text"
                      value={imageLighting}
                      onChange={(e) => setImageLighting(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Camera / Lens</label>
                    <input
                      type="text"
                      value={imageCamera}
                      onChange={(e) => setImageCamera(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Quality &amp; Engine Finish</label>
                    <input
                      type="text"
                      value={imageQuality}
                      onChange={(e) => setImageQuality(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Negative Prompt</label>
                    <input
                      type="text"
                      value={negativePrompt}
                      onChange={(e) => setNegativePrompt(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-slate-400 font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ── CASE 2: VIDEO BUILDER ────────────────────────────────────────── */}
            {selectedCategory === "video" && (
              <div className="space-y-5 animate-in fade-in">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <span>Video Generation Prompt</span>
                      <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[10px] text-purple-400 font-mono">Runway Gen-3 / Kling 1.5 format</span>
                  </div>
                  <textarea
                    rows={4}
                    value={videoPrompt}
                    onChange={(e) => setVideoPrompt(e.target.value)}
                    className="w-full p-4 rounded-2xl bg-white/[0.04] border border-white/10 text-xs font-mono text-white leading-relaxed focus:outline-none focus:border-purple-500"
                  />
                  {validationErrors.prompt && (
                    <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {validationErrors.prompt}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Camera Movement</label>
                    <select
                      value={videoCameraMovement}
                      onChange={(e) => setVideoCameraMovement(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white"
                    >
                      <option value="Smooth Low-Angle Pan Left">Smooth Low-Angle Pan Left</option>
                      <option value="Slow Push In (Forward Dolly)">Slow Push In (Forward Dolly)</option>
                      <option value="Orbital 360 Rotation">Orbital 360 Rotation</option>
                      <option value="Drone Crane Up">Drone Crane Up</option>
                      <option value="Static Lock-off with Internal Motion">Static Lock-off with Internal Motion</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">
                      Motion Amplitude: <span className="text-purple-400 font-bold">{videoMotionSpeed}</span>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      step="0.5"
                      value={videoMotionSpeed}
                      onChange={(e) => setVideoMotionSpeed(e.target.value)}
                      className="w-full accent-purple-500 mt-2"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Target Duration</label>
                    <select
                      value={videoDuration}
                      onChange={(e) => setVideoDuration(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white"
                    >
                      <option value="5s">5 Seconds (Short Form)</option>
                      <option value="10s">10 Seconds (Standard Cut)</option>
                      <option value="16s">16 Seconds (Extended Sequence)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Frame Rate</label>
                    <select
                      value={videoFps}
                      onChange={(e) => setVideoFps(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white"
                    >
                      <option value="24 FPS">24 FPS (Cinematic Cinema)</option>
                      <option value="30 FPS">30 FPS (Commercial Clean)</option>
                      <option value="60 FPS">60 FPS (Ultra Smooth)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Audio / Dialogue Directive</label>
                  <input
                    type="text"
                    value={videoAudio}
                    onChange={(e) => setVideoAudio(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-slate-300 font-mono"
                  />
                </div>
              </div>
            )}

            {/* ── CASE 3: WEBSITE BUILDER ──────────────────────────────────────── */}
            {selectedCategory === "website" && (
              <div className="space-y-5 animate-in fade-in">
                {/* Project Context Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Project Name</label>
                    <input
                      type="text"
                      value={webProjectName}
                      onChange={(e) => setWebProjectName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Target Audience</label>
                    <input
                      type="text"
                      value={webTargetAudience}
                      onChange={(e) => setWebTargetAudience(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Core Purpose</label>
                    <input
                      type="text"
                      value={webPurpose}
                      onChange={(e) => setWebPurpose(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white"
                    />
                  </div>
                </div>

                {/* Two Distinct Prompts: UI vs Context */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                        <Code className="w-3.5 h-3.5" />
                        <span>UI Prompt (Interface &amp; Visual Design)</span>
                        <span className="text-rose-500">*</span>
                      </label>
                      <span className="text-[10px] text-slate-500 font-mono">Tailwind / React specs</span>
                    </div>
                    <textarea
                      rows={5}
                      value={webUiPrompt}
                      onChange={(e) => setWebUiPrompt(e.target.value)}
                      className="w-full p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 text-xs font-mono text-white leading-relaxed focus:outline-none focus:border-emerald-500"
                    />
                    {validationErrors.webUiPrompt && (
                      <p className="text-[11px] text-rose-400 mt-1">{validationErrors.webUiPrompt}</p>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-cyan-400 flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5" />
                        <span>Context Prompt (Domain Logic &amp; Features)</span>
                        <span className="text-rose-500">*</span>
                      </label>
                      <span className="text-[10px] text-slate-500 font-mono">Business requirements</span>
                    </div>
                    <textarea
                      rows={5}
                      value={webContextPrompt}
                      onChange={(e) => setWebContextPrompt(e.target.value)}
                      className="w-full p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 text-xs font-mono text-white leading-relaxed focus:outline-none focus:border-cyan-500"
                    />
                    {validationErrors.webContextPrompt && (
                      <p className="text-[11px] text-rose-400 mt-1">{validationErrors.webContextPrompt}</p>
                    )}
                  </div>
                </div>

                {/* Tech Stack Pills */}
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1.5">
                    Locked Technical Stack Directives
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {webTechStack.map((tech, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-medium"
                      >
                        ✓ {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── CASE 4: SLIDES & PRESENTATION BUILDER ────────────────────────── */}
            {selectedCategory === "slides" && (
              <div className="space-y-5 animate-in fade-in">
                {/* Global Presentation Meta */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Presentation Topic</label>
                    <input
                      type="text"
                      value={presentationTopic}
                      onChange={(e) => setPresentationTopic(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Target Audience</label>
                    <input
                      type="text"
                      value={presentationAudience}
                      onChange={(e) => setPresentationAudience(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Keynote Tone</label>
                    <input
                      type="text"
                      value={presentationTone}
                      onChange={(e) => setPresentationTone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white"
                    />
                  </div>
                </div>

                {/* Global Deck Prompt */}
                <div>
                  <label className="block text-xs font-semibold text-amber-400 mb-1">
                    Global Deck Aesthetic &amp; Architecture Directive
                  </label>
                  <textarea
                    rows={2}
                    value={presentationGlobalPrompt}
                    onChange={(e) => setPresentationGlobalPrompt(e.target.value)}
                    className="w-full p-3 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-white leading-relaxed focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Slide-by-Slide Manager Header */}
                <div className="pt-2 border-t border-white/5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-1.5">
                        <Presentation className="w-4 h-4 text-amber-400" />
                        <span>Slide-by-Slide Prompt Architecture ({slides.length} Slides)</span>
                      </h3>
                      <p className="text-[11px] text-slate-400">Each slide maintains its own dedicated generation prompt</p>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddSlide}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Slide</span>
                    </button>
                  </div>

                  {/* Horizontal Slide Deck Navigator */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
                    {slides.map((s, idx) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setActiveSlideIndex(idx)}
                        className={`px-3 py-2 rounded-xl border text-left shrink-0 transition-all cursor-pointer ${
                          activeSlideIndex === idx
                            ? "bg-amber-500/20 text-white border-amber-500 shadow-sm"
                            : "bg-white/[0.03] text-slate-400 border-white/10 hover:text-white"
                        }`}
                      >
                        <div className="text-[10px] font-mono text-amber-400 font-bold">SLIDE 0{s.slideNumber}</div>
                        <div className="text-xs font-bold truncate max-w-[130px]">{s.title.replace(/^Slide \d+:\s*/, "")}</div>
                      </button>
                    ))}
                  </div>

                  {/* Active Slide Form Card */}
                  {slides[activeSlideIndex] && (
                    <div className="p-5 rounded-2xl bg-white/[0.02] border border-amber-500/30 space-y-3 animate-in fade-in">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-amber-500 text-slate-900 font-mono text-xs flex items-center justify-center font-bold">
                            0{slides[activeSlideIndex].slideNumber}
                          </span>
                          <span className="font-bold text-xs text-white">Editing Slide 0{slides[activeSlideIndex].slideNumber}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleDuplicateSlide(activeSlideIndex)}
                            className="p-1.5 rounded-lg border border-white/10 hover:bg-white/5 text-slate-400 hover:text-white text-xs flex items-center gap-1"
                            title="Duplicate Slide"
                          >
                            <DuplicateIcon className="w-3 h-3" />
                            <span>Duplicate</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteSlide(activeSlideIndex)}
                            className="p-1.5 rounded-lg border border-rose-500/20 hover:bg-rose-500/10 text-rose-400 text-xs flex items-center gap-1"
                            title="Delete Slide"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-medium text-slate-400 mb-1">Slide Title / Heading</label>
                          <input
                            type="text"
                            value={slides[activeSlideIndex].title}
                            onChange={(e) => {
                              const updated = [...slides];
                              updated[activeSlideIndex].title = e.target.value;
                              setSlides(updated);
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-white font-semibold"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-medium text-slate-400 mb-1">Slide Purpose &amp; Takeaway</label>
                          <input
                            type="text"
                            value={slides[activeSlideIndex].purpose}
                            onChange={(e) => {
                              const updated = [...slides];
                              updated[activeSlideIndex].purpose = e.target.value;
                              setSlides(updated);
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-slate-300"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-amber-400 mb-1">
                          Slide Dedicated Prompt Text <span className="text-rose-500">*</span>
                        </label>
                        <textarea
                          rows={3}
                          value={slides[activeSlideIndex].prompt}
                          onChange={(e) => {
                            const updated = [...slides];
                            updated[activeSlideIndex].prompt = e.target.value;
                            setSlides(updated);
                          }}
                          className="w-full p-3 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-white leading-relaxed focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-medium text-slate-400 mb-1">Visual Direction / Layout</label>
                          <input
                            type="text"
                            value={slides[activeSlideIndex].visualDirection}
                            onChange={(e) => {
                              const updated = [...slides];
                              updated[activeSlideIndex].visualDirection = e.target.value;
                              setSlides(updated);
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-slate-300"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-medium text-slate-400 mb-1">Speaker Notes</label>
                          <input
                            type="text"
                            value={slides[activeSlideIndex].notes}
                            onChange={(e) => {
                              const updated = [...slides];
                              updated[activeSlideIndex].notes = e.target.value;
                              setSlides(updated);
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-slate-400 font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── CASE 5: POSTER BUILDER ───────────────────────────────────────── */}
            {selectedCategory === "poster" && (
              <div className="space-y-5 animate-in fade-in">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-rose-400 flex items-center gap-1.5">
                      <span>Graphic Design &amp; Poster Prompt</span>
                      <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[10px] text-slate-500 font-mono">Print &amp; Editorial directive</span>
                  </div>
                  <textarea
                    rows={4}
                    value={posterPrompt}
                    onChange={(e) => setPosterPrompt(e.target.value)}
                    className="w-full p-4 rounded-2xl bg-white/[0.04] border border-white/10 text-xs font-mono text-white leading-relaxed focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Canvas Dimensions</label>
                    <input
                      type="text"
                      value={posterDimensions}
                      onChange={(e) => setPosterDimensions(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Headline Text</label>
                    <input
                      type="text"
                      value={posterHeadline}
                      onChange={(e) => setPosterHeadline(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Call to Action (CTA)</label>
                    <input
                      type="text"
                      value={posterCta}
                      onChange={(e) => setPosterCta(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* SECTION 03: UNIVERSAL PROMPT WORKFLOW (7 STEPS) */}
          <section className="p-6 sm:p-8 rounded-3xl bg-[#0e1019] border border-white/10 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-indigo-500/10 text-indigo-400 font-mono text-xs flex items-center justify-center font-bold">
                  03
                </span>
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <span>Execution Guidance Workflow (7 Steps)</span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Powers the step-by-step guidance and animated node graph on the template detail page
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleLoadCategoryWorkflowPreset(selectedCategory)}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer underline self-start sm:self-auto"
              >
                Reset to {selectedCategory.toUpperCase()} Guidance Preset
              </button>
            </div>

            {/* Stepper Pill Selector */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {workflowSteps.map((st, idx) => {
                const isSelected = activeWorkflowStepIndex === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveWorkflowStepIndex(idx)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                        : "bg-white/[0.03] text-slate-400 border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        isSelected ? "bg-white/20 text-white" : "bg-white/5 text-slate-500"
                      }`}>
                        {st.step}
                      </span>
                    </div>
                    <div className="text-xs font-bold truncate">{st.phase}</div>
                  </button>
                );
              })}
            </div>

            {/* Active Workflow Step Detailed Form */}
            {workflowSteps[activeWorkflowStepIndex] && (
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-indigo-500 text-white font-mono text-[10px] flex items-center justify-center font-bold">
                      {workflowSteps[activeWorkflowStepIndex].step}
                    </span>
                    <span>Editing Step {workflowSteps[activeWorkflowStepIndex].step}: {workflowSteps[activeWorkflowStepIndex].phase}</span>
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={activeWorkflowStepIndex === 0}
                      onClick={() => setActiveWorkflowStepIndex((p) => Math.max(0, p - 1))}
                      className="px-2.5 py-1 text-xs rounded-lg border border-white/10 hover:bg-white/5 disabled:opacity-30 cursor-pointer"
                    >
                      ← Prev
                    </button>
                    <button
                      type="button"
                      disabled={activeWorkflowStepIndex === workflowSteps.length - 1}
                      onClick={() => setActiveWorkflowStepIndex((p) => Math.min(workflowSteps.length - 1, p + 1))}
                      className="px-2.5 py-1 text-xs rounded-lg border border-white/10 hover:bg-white/5 disabled:opacity-30 cursor-pointer"
                    >
                      Next →
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Phase Tag</label>
                    <input
                      type="text"
                      value={workflowSteps[activeWorkflowStepIndex].phase}
                      onChange={(e) => {
                        const updated = [...workflowSteps];
                        updated[activeWorkflowStepIndex].phase = e.target.value;
                        setWorkflowSteps(updated);
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Step Title</label>
                    <input
                      type="text"
                      value={workflowSteps[activeWorkflowStepIndex].title}
                      onChange={(e) => {
                        const updated = [...workflowSteps];
                        updated[activeWorkflowStepIndex].title = e.target.value;
                        setWorkflowSteps(updated);
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-white font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Detailed Execution Instructions</label>
                  <textarea
                    rows={2}
                    value={workflowSteps[activeWorkflowStepIndex].desc}
                    onChange={(e) => {
                      const updated = [...workflowSteps];
                      updated[activeWorkflowStepIndex].desc = e.target.value;
                      updated[activeWorkflowStepIndex].instruction = e.target.value;
                      setWorkflowSteps(updated);
                    }}
                    className="w-full p-2.5 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-slate-300 leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Step Prompt Snippet</label>
                    <input
                      type="text"
                      value={workflowSteps[activeWorkflowStepIndex].examplePrompt}
                      onChange={(e) => {
                        const updated = [...workflowSteps];
                        updated[activeWorkflowStepIndex].examplePrompt = e.target.value;
                        setWorkflowSteps(updated);
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-xs font-mono text-slate-300"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Reference Image Asset</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={workflowSteps[activeWorkflowStepIndex].imgUrl || ""}
                        onChange={(e) => {
                          const updated = [...workflowSteps];
                          updated[activeWorkflowStepIndex].imgUrl = e.target.value;
                          setWorkflowSteps(updated);
                        }}
                        className="flex-1 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-xs font-mono text-slate-300"
                      />
                      {workflowSteps[activeWorkflowStepIndex].imgUrl && (
                        <img
                          src={workflowSteps[activeWorkflowStepIndex].imgUrl}
                          alt=""
                          className="w-8 h-8 rounded-lg object-cover border border-white/10 shrink-0"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* ── RIGHT COLUMN: STICKY LIVE PUBLIC PREVIEW (30% - 4 Cols) ────────── */}
        <div className="lg:col-span-5 xl:col-span-4 sticky top-20 space-y-4">
          <div className="p-4 rounded-3xl bg-[#0e1019] border border-white/10 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-indigo-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                  Live Public Page Simulator
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                /template/[id]
              </span>
            </div>

            {/* Simulated Hero Thumbnail Box */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-white/10 shadow-lg group">
              <img
                src={thumbnail}
                alt="Thumbnail Preview"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-black/70 text-white backdrop-blur-md border border-white/15">
                  {selectedCategory}
                </span>
                {subcategory && (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-600/90 text-white backdrop-blur-md">
                    {subcategory}
                  </span>
                )}
              </div>
              <div className="absolute top-2.5 right-2.5">
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    isPro ? "bg-amber-400 text-black font-extrabold" : "bg-white/20 text-white backdrop-blur-md"
                  }`}
                >
                  {isPro ? "PRO" : "FREE"}
                </span>
              </div>
            </div>

            {/* Simulated Title & Metadata */}
            <div className="space-y-1">
              <h4 className="text-base font-bold text-white line-clamp-1">
                {title.trim() || "Untitled Blueprint"}
              </h4>
              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                {description.trim() || "Hand-authored AI deliverable ready for instant deployment."}
              </p>
            </div>

            {/* Metadata Stats Row */}
            <div className="grid grid-cols-3 gap-2 text-center p-2 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] font-mono">
              <div>
                <div className="text-[9px] text-slate-500 uppercase">Tool</div>
                <div className="font-bold text-slate-200 truncate">{recommendedTool}</div>
              </div>
              <div>
                <div className="text-[9px] text-slate-500 uppercase">Format</div>
                <div className="font-bold text-slate-200 uppercase">{selectedCategory}</div>
              </div>
              <div>
                <div className="text-[9px] text-slate-500 uppercase">Tier</div>
                <div className={`font-bold ${isPro ? "text-amber-400" : "text-emerald-400"}`}>
                  {isPro ? "PRO" : "FREE"}
                </div>
              </div>
            </div>

            {/* Finished Verbatim Prompt Box with Copy */}
            <div className="rounded-2xl border border-white/10 bg-black/60 overflow-hidden">
              <div className="flex items-center justify-between px-3.5 py-1.5 border-b border-white/10 bg-white/[0.03]">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                    VERBATIM PROMPT
                  </span>
                  {simCustomizedPrompt && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] bg-amber-500/20 text-amber-300 font-sans font-semibold">
                      Customized
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {simCustomizedPrompt && (
                    <button
                      type="button"
                      onClick={() => setSimCustomizedPrompt(null)}
                      className="text-[10px] text-slate-400 hover:text-white cursor-pointer underline"
                    >
                      Reset
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(simCustomizedPrompt || effectivePrompt);
                      setCopiedPromptPreview(true);
                      setTimeout(() => setCopiedPromptPreview(false), 2000);
                    }}
                    className="flex items-center gap-1 text-[10px] font-semibold text-indigo-400 hover:text-indigo-300 cursor-pointer"
                  >
                    {copiedPromptPreview ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedPromptPreview ? "Copied!" : "Copy"}</span>
                  </button>
                </div>
              </div>
              <div className="p-3 font-mono text-[11px] text-slate-300 max-h-36 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                {simCustomizedPrompt || effectivePrompt}
              </div>
            </div>

            {/* Stepper Flow Mini Preview */}
            <div className="space-y-1.5 pt-1">
              <div className="text-[10px] font-mono font-bold text-slate-400 uppercase flex items-center justify-between">
                <span>Execution Steps ({workflowSteps.length})</span>
                <span className="text-indigo-400 font-normal">7-Step Guide</span>
              </div>
              <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                {workflowSteps.map((st, i) => (
                  <div
                    key={i}
                    className="p-2 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded bg-white/10 text-[9px] font-mono flex items-center justify-center font-bold text-slate-400">
                        {st.step}
                      </span>
                      <span className="font-semibold text-slate-200 text-[11px] truncate max-w-[160px]">{st.title}</span>
                    </div>
                    <span className="text-[9px] font-mono text-slate-500 uppercase">{st.phase}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Simulated Action Buttons */}
            <div className="pt-2 border-t border-white/5 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const textToCopy = simCustomizedPrompt || effectivePrompt;
                  navigator.clipboard.writeText(textToCopy);
                  setSimCopied(true);
                  showToast("Copied blueprint prompt to clipboard!");
                  setTimeout(() => setSimCopied(false), 2200);
                }}
                className={`flex-1 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 ${
                  simCopied
                    ? "bg-emerald-600 text-white shadow-emerald-500/20"
                    : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20"
                }`}
              >
                {simCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Prompt Copied! ✓</span>
                  </>
                ) : (
                  <span>Use Template →</span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setIsSimCustomizeOpen(true)}
                className="px-3.5 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5"
              >
                <SlidersHorizontal className="w-3 h-3 text-indigo-400" />
                <span>Customize</span>
              </button>
            </div>

            {/* Interactive Prompt Customizer Modal (Simulates End-User Experience) */}
            {isSimCustomizeOpen && (
              <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-[#0e101a] border border-white/15 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
                      <h4 className="text-sm font-bold text-white">Prompt Customizer</h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsSimCustomizeOpen(false)}
                      className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    This simulates the interactive drawer visitors see when clicking <strong className="text-white">[Customize]</strong> on the live template page. Try tweaking parameters or adding instructions:
                  </p>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 uppercase font-semibold mb-1.5">
                      Aspect Ratio Override (--ar)
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {["16:9", "1:1", "9:16", "21:9"].map((ar) => (
                        <button
                          key={ar}
                          type="button"
                          onClick={() => setSimAspectRatio(ar)}
                          className={`py-1.5 rounded-xl text-xs font-mono font-semibold transition-all border cursor-pointer ${
                            simAspectRatio === ar
                              ? "bg-indigo-600 text-white border-indigo-500 shadow-sm"
                              : "bg-white/[0.03] text-slate-400 border-white/10 hover:border-white/20"
                          }`}
                        >
                          {ar}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 uppercase font-semibold mb-1.5">
                      Custom Prompt Instruction (AI Modifier)
                    </label>
                    <textarea
                      rows={3}
                      value={simCustomAddon}
                      onChange={(e) => setSimCustomAddon(e.target.value)}
                      placeholder="e.g. Add heavy rain reflections on asphalt, volumetric cyber fog, 35mm film grain..."
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/60"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (!simCustomAddon.trim()) {
                          showToast("Please enter an instruction or tweak.");
                          return;
                        }
                        const cleanBase = effectivePrompt.replace(/--ar\s+[0-9:]+/g, "").trim();
                        const tweaked = `${cleanBase}, customized with ${simCustomAddon.trim()}, 8k resolution, cinematic finish --ar ${simAspectRatio}`;
                        setSimCustomizedPrompt(tweaked);
                        showToast("AI Customization applied to preview!");
                        setIsSimCustomizeOpen(false);
                      }}
                      className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs transition-all shadow-md cursor-pointer"
                    >
                      Apply Customization
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (simCustomAddon.trim()) {
                          const cleanBase = effectivePrompt.replace(/--ar\s+[0-9:]+/g, "").trim();
                          const tweaked = `${cleanBase}, customized with ${simCustomAddon.trim()}, 8k resolution, cinematic finish --ar ${simAspectRatio}`;
                          navigator.clipboard.writeText(tweaked);
                          setSimCustomizedPrompt(tweaked);
                        } else {
                          navigator.clipboard.writeText(effectivePrompt);
                        }
                        showToast("Customized prompt copied to clipboard!");
                        setIsSimCustomizeOpen(false);
                      }}
                      className="px-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/10 text-white font-semibold text-xs cursor-pointer"
                    >
                      Copy &amp; Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function AdminTemplateCreatePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#07080d] flex items-center justify-center text-slate-400 font-mono text-xs">
          Loading AWA Visual Template Builder...
        </div>
      }
    >
      <TemplateBuilderContent />
    </Suspense>
  );
}
