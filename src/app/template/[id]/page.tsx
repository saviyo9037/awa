"use client";

import { useState, useEffect, use, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  ReactFlow,
  Background,
  Controls,
  Handle,
  Position,
  MarkerType,
  type Edge,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  Copy,
  Check,
  Share2,
  MoreVertical,
  Bookmark,
  Sparkles,
  SlidersHorizontal,
  Layers,
  Terminal,
  ChevronRight,
  ChevronLeft,
  Play,
  Pause,
  Maximize2,
  X,
  Lock,
  Crown,
  ArrowRight,
  Edit3,
  Monitor,
  Compass,
  Cpu,
  RefreshCw,
  Zap,
} from "lucide-react";

// ============================================================================
// Custom Interactive Node Component for ReactFlow Canvas
// ============================================================================
const CustomWorkflowNode = ({ data }: any) => {
  const { step, title, description, phase, active, completed } = data;

  return (
    <div
      className={`relative w-[280px] sm:w-[320px] rounded-2xl p-4 transition-all duration-300 ${
        active
          ? "bg-blue-50 dark:bg-[#111426]/95 border-2 border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.3)] ring-2 ring-blue-500/20 text-slate-900 dark:text-white"
          : completed
          ? "bg-emerald-50/90 dark:bg-[#0c0d18]/90 border border-emerald-500/30 dark:border-emerald-500/40 text-slate-700 dark:text-slate-300 shadow-sm"
          : "bg-white dark:bg-[#0c0d18]/70 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 shadow-sm opacity-90 hover:opacity-100"
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className={`!w-3 !h-3 !border-2 !border-white dark:!border-[#07090e] transition-colors ${
          active ? "!bg-blue-500" : completed ? "!bg-emerald-500" : "!bg-slate-400 dark:!bg-slate-700"
        }`}
      />

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span
            className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold font-mono ${
              active
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/40"
                : completed
                ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40"
                : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10"
            }`}
          >
            {completed ? <Check className="w-3 h-3" /> : String(step).padStart(2, "0")}
          </span>
          {phase && (
            <span className="text-[9px] uppercase tracking-wider font-mono font-semibold text-slate-500 dark:text-slate-400 truncate max-w-[150px]">
              {phase}
            </span>
          )}
        </div>

        {active && (
          <span className="flex items-center gap-1 text-[9px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300 border border-blue-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
            ACTIVE
          </span>
        )}
      </div>

      <h4
        className={`text-xs font-bold leading-snug mb-1 transition-colors ${
          active ? "text-blue-900 dark:text-white" : completed ? "text-slate-800 dark:text-slate-200" : "text-slate-800 dark:text-slate-300"
        }`}
      >
        {title}
      </h4>

      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
        {description}
      </p>

      <Handle
        type="source"
        position={Position.Right}
        className={`!w-3 !h-3 !border-2 !border-white dark:!border-[#07090e] transition-colors ${
          active ? "!bg-blue-500" : completed ? "!bg-emerald-500" : "!bg-slate-400 dark:!bg-slate-700"
        }`}
      />
    </div>
  );
};

export default function TemplateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const rawId = resolvedParams.id;
  const router = useRouter();
  const { user, isLoggedIn, isPro, isAdmin } = useAuth();
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [liveTemplate, setLiveTemplate] = useState<any | null>(null);
  const [isLoadingTemplate, setIsLoadingTemplate] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);

  // Fetch Template
  useEffect(() => {
    setIsLoadingTemplate(true);
    fetch(`/api/templates/${rawId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data) {
          setLiveTemplate(data.data);
          setIsNotFound(false);
        } else {
          setIsNotFound(true);
        }
      })
      .catch(() => setIsNotFound(true))
      .finally(() => setIsLoadingTemplate(false));
  }, [rawId]);

  const template = liveTemplate;
  const isProBlueprint = Boolean(template?.isPro);
  const hasPrivilegedAccess = Boolean(isAdmin || isPro);

  const isVideo = Boolean(
    template?.mediaType === "video" ||
    template?.videoUrl ||
    template?.img?.endsWith(".mp4") ||
    template?.img?.endsWith(".webm") ||
    template?.desc?.toLowerCase().includes("video") ||
    template?.tool?.toLowerCase().includes("runway") ||
    template?.tool?.toLowerCase().includes("kling") ||
    template?.tool?.toLowerCase().includes("sora") ||
    template?.tool?.toLowerCase().includes("luma")
  );

  // Interactive UI States
  const [selectedThumbIndex, setSelectedThumbIndex] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [promptCopied, setPromptCopied] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [isFullscreenPreview, setIsFullscreenPreview] = useState(false);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);

  // Guidance View Mode: 'steps' (Reference UI) vs 'node' (Animated ReactFlow Canvas)
  const [guidanceViewMode, setGuidanceViewMode] = useState<"steps" | "node">("steps");

  // Parameter Tuner States
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [lighting, setLighting] = useState("Cyber Obsidian");
  const [stylize, setStylize] = useState("250");
  const [isRawStyle, setIsRawStyle] = useState(true);
  const [customAddon, setCustomAddon] = useState("");
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [customizedPrompt, setCustomizedPrompt] = useState<string | null>(null);

  // Server-verified Prompt Security State
  const [serverPrompt, setServerPrompt] = useState<string | null>(null);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [isLoadingPrompt, setIsLoadingPrompt] = useState<boolean>(true);

  useEffect(() => {
    if (!template?.id) return;

    if (!isProBlueprint || hasPrivilegedAccess) {
      setServerPrompt(template.prompt);
      setIsUnlocked(true);
      setIsLoadingPrompt(false);
      return;
    }

    let active = true;
    setIsLoadingPrompt(true);

    fetch(`/api/templates/${template.id}/prompt`)
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;
        if (data.success && data.unlocked && data.prompt) {
          setServerPrompt(data.prompt);
          setIsUnlocked(true);
        } else {
          setServerPrompt(null);
          setIsUnlocked(false);
        }
      })
      .catch(() => {
        if (!active) return;
        setIsUnlocked(false);
      })
      .finally(() => {
        if (active) setIsLoadingPrompt(false);
      });

    return () => {
      active = false;
    };
  }, [template?.id, template?.prompt, isProBlueprint, isLoggedIn, isPro, isAdmin, hasPrivilegedAccess]);

  // Dynamic Prompt Construction
  const dynamicPrompt = useMemo(() => {
    if (isProBlueprint && !isUnlocked && !hasPrivilegedAccess) {
      return "🔒 PRO Blueprint Locked — Unlock finished prompt and parameters with AWA Pro (₹199)";
    }

    let base = serverPrompt || template?.prompt || "";
    
    // Remove existing flags
    base = base.replace(/--ar\s+\d+:\d+/g, "");
    base = base.replace(/--s\s+\d+/g, "");
    base = base.replace(/--style\s+\w+/g, "");

    let result = base.trim();

    if (customizedPrompt) {
      return customizedPrompt;
    }

    if (lighting === "Cyber Obsidian") {
      result += ", dark obsidian background #060507, glowing cyan and magenta accents";
    } else if (lighting === "Golden Hour") {
      result += ", warm golden hour illumination, cinematic lens flare";
    } else if (lighting === "Studio Softbox") {
      result += ", ultra clean studio lighting, soft diffused shadow, crisp highlights";
    } else if (lighting === "Volumetric Neon") {
      result += ", moody atmospheric haze, cinematic volumetric neon light shafts";
    }

    result += ` --ar ${aspectRatio}`;
    result += ` --s ${stylize}`;
    if (isRawStyle) {
      result += " --style raw";
    }

    return result;
  }, [serverPrompt, template?.prompt, customizedPrompt, lighting, aspectRatio, stylize, isRawStyle, isProBlueprint, isUnlocked, hasPrivilegedAccess]);

  const handleCopy = () => {
    if (isProBlueprint && !isUnlocked && !hasPrivilegedAccess) {
      if (!isLoggedIn) {
        router.push(`/login?redirect=${encodeURIComponent(`/template/${template.id}`)}`);
      } else {
        router.push("/checkout?plan=yearly");
      }
      return;
    }

    navigator.clipboard.writeText(dynamicPrompt);
    setCopied(true);
    setPromptCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setTimeout(() => setPromptCopied(false), 2000);

    // Track copy on backend
    if (template?.id) {
      fetch(`/api/templates/${template.id}/copy`, { method: "POST" }).catch(() => {});
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    }
  };

  const handleMutatePrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customAddon.trim()) return;

    setIsCustomizing(true);
    try {
      const res = await fetch("/api/prompts/mutate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          basePrompt: template?.prompt || "",
          tweak: customAddon,
          aspectRatio,
          stylize,
        }),
      });
      const json = await res.json();
      if (json.success && json.data?.customizedPrompt) {
        setCustomizedPrompt(json.data.customizedPrompt);
      }
    } catch {
      // Fallback local mutation
      setCustomizedPrompt(`${template?.prompt || ""}, ${customAddon} --ar ${aspectRatio} --s ${stylize}`);
    } finally {
      setIsCustomizing(false);
      setCustomAddon("");
    }
  };

  // Thumbnail list construction (4 items)
  const thumbnails = useMemo(() => {
    const baseImg = template?.img || "/placeholder.jpg";
    return [
      { id: "thumb-1", src: baseImg, label: "Hero View" },
      { id: "thumb-2", src: template?.secondaryImg || "/cyber_portrait.jpg", label: "Angled Studio" },
      { id: "thumb-3", src: "/holographic_3d.jpg", label: "Macro Detail" },
      { id: "thumb-4", src: "/cyber_dashboard.jpg", label: "Atmosphere" },
    ];
  }, [template]);

  const activeMediaSrc = thumbnails[selectedThumbIndex]?.src || template?.img || "/placeholder.jpg";

  // Guidance Interactive Stepper Data
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [referenceImgIndex, setReferenceImgIndex] = useState(0);
  const [isPlayingGuide, setIsPlayingGuide] = useState(false);

  // Dynamic Stepper steps configured per category / blueprint
  const guidanceSteps = useMemo(() => {
    // If template has DB-driven usage steps, map them seamlessly
    if (Array.isArray(template?.steps) && template.steps.length > 0) {
      return template.steps.map((st: any, i: number) => ({
        id: String(i + 1),
        stepNumber: String(i + 1).padStart(2, "0"),
        label: st.phase || (i === 0 ? "Subject" : i === 1 ? "Style" : i === 2 ? "Lighting" : i === 3 ? "Composition" : "Parameters"),
        title: st.title || `Phase ${i + 1}`,
        subtitle: st.subtitle || "Targeted aesthetic tuning",
        description: st.desc || st.description || "Refine and calibrate this step for optimal synthesis.",
        examplePrompt: st.examplePrompt || `${template.title} -- focus on ${st.title}`,
        referenceImages: [st.imgUrl, template?.img, "/cyber_dashboard.jpg"].filter(Boolean) as string[],
        referenceCaption: st.referenceCaption || `${st.title} reference rendering`,
        tip: st.tip || "Maintain consistent seed and aspect ratio across iterative variations.",
      }));
    }

    // Default High-Fidelity 5-Step Workflow
    return [
      {
        id: "1",
        stepNumber: "01",
        label: "Subject",
        title: "Define Primary Subject & Core Concept",
        subtitle: "Establish the visual anchor, key character, or product silhouette",
        description: "Specify the exact entity with sharp physical definitions. Focus on material properties, surface reflections, textures, and hero silhouette before adding styling modifiers.",
        examplePrompt: `${template?.title || "Modern product shot"}, matte black ceramic texture, minimalist contours, studio pedestal`,
        referenceImages: [template?.img, "/cyber_dashboard.jpg", "/holographic_3d.jpg"].filter(Boolean),
        referenceCaption: "Isolated subject structure and silhouette test",
        tip: "Avoid vague adjectives like 'photorealistic'; specify the exact material, camera distance, and lens angle instead.",
      },
      {
        id: "2",
        stepNumber: "02",
        label: "Style",
        title: "Select Art Style & Rendering Engine",
        subtitle: "Direct aesthetic direction, realism, grain, and color palette",
        description: "Layer the art direction—whether hyper-clean commercial CGI, 35mm cinematic film grain, raw editorial photography, or liquid glassmorphism UI.",
        examplePrompt: "Cinematic commercial photography, Hasselblad H6D-100c, 80mm f/2.8 lens, color graded in warm neutral tones",
        referenceImages: ["/cyber_dashboard.jpg", template?.img].filter(Boolean),
        referenceCaption: "Style calibration and medium simulation",
        tip: "Using '--style raw' in Midjourney v6 reduces the AI's default bias and creates more authentic, less plastic images.",
      },
      {
        id: "3",
        stepNumber: "03",
        label: "Lighting",
        title: "Calibrate Light Rays & Atmosphere",
        subtitle: "Harness illumination, shadow depth, and ambient mood",
        description: "Lighting dictates 80% of perceived visual luxury. Specify key lights, rim lights, volumetric fog, neon reflections, or natural diffused morning window spill.",
        examplePrompt: "Dramatic studio rim lighting, dual-tone softbox illumination, subtle volumetric haze, high contrast deep shadows",
        referenceImages: ["/holographic_3d.jpg", template?.img].filter(Boolean),
        referenceCaption: "Volumetric light interaction and specular reflection test",
        tip: "Soft directional rim lighting helps separate the subject from dark background planes, preventing muddy visuals.",
      },
      {
        id: "4",
        stepNumber: "04",
        label: "Composition",
        title: "Framing, Aspect Ratio & Camera Optics",
        subtitle: "Rule of thirds, negative space, wide panoramic angles",
        description: "Compose the final frame. Designate wide-angle perspective, dynamic diagonal lines, macro focal depth (f/1.8), or clean editorial negative space for typography overlay.",
        examplePrompt: "Centered symmetrical framing, expansive negative space at top for typography, clean horizon line, 24mm wide angle",
        referenceImages: [template?.img, "/cyber_portrait.jpg"].filter(Boolean),
        referenceCaption: "Optics, framing, and negative space validation",
        tip: "Ensure your target model supports the chosen aspect ratio natively to avoid distorted framing.",
      },
      {
        id: "5",
        stepNumber: "05",
        label: "Parameters",
        title: "Tune Model Syntax & Execution Flags",
        subtitle: "Aspect flags (--ar), stylize weights (--s), seeds, quality knobs",
        description: "Append final execution parameters. Calibrate the stylize strength (--s 50 to --s 1000) depending on whether you want photographic literalism or creative flair.",
        examplePrompt: `${dynamicPrompt}`,
        referenceImages: ["/holographic_3d.jpg", "/cyber_dashboard.jpg"].filter(Boolean),
        referenceCaption: "Final synthesis with calibrated parameters",
        tip: "Save your favorite seeds (--seed <number>) to generate harmonious character or product continuity across a full sequence.",
      },
    ];
  }, [template, dynamicPrompt, aspectRatio, stylize]);

  const activeStep = guidanceSteps[activeStepIndex] || guidanceSteps[0];
  const refImages = activeStep.referenceImages || [template?.img];
  const activeRefImage = refImages[referenceImgIndex % refImages.length] || template?.img;

  // ReactFlow Node Canvas Setup
  const nodeTypes = useMemo(() => ({ workflowStep: CustomWorkflowNode }), []);

  const flowNodes: Node[] = useMemo(() => {
    return guidanceSteps.map((s: any, index: number) => {
      const col = index % 2;
      const row = Math.floor(index / 2);

      return {
        id: `step-${s.id}`,
        type: "workflowStep",
        position: {
          x: col * 370 + 40,
          y: row * 190 + 30,
        },
        data: {
          step: s.id,
          title: s.title,
          description: s.description,
          phase: s.label,
          active: index === activeStepIndex,
          completed: index < activeStepIndex,
        },
        draggable: true,
      };
    });
  }, [guidanceSteps, activeStepIndex]);

  const flowEdges: Edge[] = useMemo(() => {
    return guidanceSteps.slice(0, -1).map((s: any, index: number) => {
      const isPast = index < activeStepIndex;
      const isCurrent = index === activeStepIndex - 1;
      const inactiveStroke = isLight ? "#94a3b8" : "#334155";
      const inactiveArrow = isLight ? "#94a3b8" : "#475569";

      return {
        id: `e-step-${s.id}-step-${guidanceSteps[index + 1].id}`,
        source: `step-${s.id}`,
        target: `step-${guidanceSteps[index + 1].id}`,
        type: "smoothstep",
        animated: isCurrent || isPast,
        style: {
          stroke: isPast ? "#10b981" : isCurrent ? "#3b82f6" : inactiveStroke,
          strokeWidth: isCurrent ? 3 : 2,
          opacity: isPast || isCurrent ? 1 : 0.5,
          transition: "all 0.4s ease",
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: isPast ? "#10b981" : isCurrent ? "#3b82f6" : inactiveArrow,
        },
      };
    });
  }, [guidanceSteps, activeStepIndex, isLight]);

  // Auto-play Guide Tour
  useEffect(() => {
    if (!isPlayingGuide) return;
    const timer = setInterval(() => {
      setActiveStepIndex((prev) => {
        if (prev >= guidanceSteps.length - 1) {
          setIsPlayingGuide(false);
          return prev;
        }
        return prev + 1;
      });
      setReferenceImgIndex(0);
    }, 4000);
    return () => clearInterval(timer);
  }, [isPlayingGuide, guidanceSteps.length]);

  // Related Templates for "More from this category" (5 items)
  const [relatedTemplates, setRelatedTemplates] = useState<any[]>([]);
  useEffect(() => {
    fetch(`/api/templates?limit=10`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          const filtered = json.data.filter((t: any) => t.id !== template?.id);
          const sameCat = filtered.filter((t: any) => t.category === template?.category);
          const others = filtered.filter((t: any) => t.category !== template?.category);
          const combined = [...sameCat, ...others].slice(0, 5);
          setRelatedTemplates(combined);
        }
      })
      .catch(() => {});
  }, [template?.id, template?.category]);

  if (isLoadingTemplate) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-white pt-24 pb-24 transition-colors duration-300">
        <div className="max-w-[1450px] mx-auto px-4 sm:px-8 space-y-8 animate-pulse">
          <div className="h-5 w-64 bg-slate-200 dark:bg-white/10 rounded-full" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 aspect-[16/10] rounded-3xl bg-slate-200 dark:bg-white/5 border border-slate-300 dark:border-white/10" />
            <div className="lg:col-span-5 space-y-4">
              <div className="h-8 w-3/4 bg-slate-200 dark:bg-white/10 rounded-xl" />
              <div className="h-28 bg-slate-200 dark:bg-white/5 rounded-2xl" />
              <div className="h-44 bg-slate-200 dark:bg-white/5 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isNotFound || !template) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-4 bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-white transition-colors duration-300">
        <div className="w-16 h-16 rounded-3xl bg-blue-500/10 text-blue-500 dark:text-blue-400 flex items-center justify-center mb-4 border border-blue-500/20 shadow-lg shadow-blue-500/10">
          <Sparkles className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Blueprint Not Found</h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-md text-sm mb-6">
          The requested blueprint could not be found in the catalog.
        </p>
        <Link
          href="/"
          className="px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-xs transition-opacity hover:opacity-90 shadow-md"
        >
          Explore All Blueprints
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-slate-100 transition-colors duration-300 pb-12 sm:pb-16 font-sans selection:bg-blue-500/30 selection:text-white">
      
      {/* Master Admin Return Banner */}
      {isAdmin && (
        <div className="bg-emerald-950/90 border-b border-emerald-500/30 px-4 py-2 text-xs flex items-center justify-between text-emerald-200 sticky top-0 z-50 backdrop-blur-md">
          <div className="flex items-center gap-2 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Master Admin Mode • Viewing Live User Template Page</span>
          </div>
          <Link
            href="/admin"
            className="px-3 py-1 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1.5 transition-colors shadow-sm text-[11px]"
          >
            <span>← Return to Admin Console</span>
          </Link>
        </div>
      )}

      {/* =========================================================================
          1. TOP BREADCRUMB & TOOLBAR (Matching Reference UI)
          ========================================================================= */}
      <div className="border-b border-slate-200 dark:border-white/[0.06] bg-white/80 dark:bg-[#07090e]/80 backdrop-blur-xl sticky top-[64px] z-40 transition-colors duration-300">
        <div className="max-w-[1450px] mx-auto px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          
          {/* Breadcrumbs: Library > Category > Title */}
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Library
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600" />
            <Link
              href={`/?category=${encodeURIComponent(template.category)}`}
              className="capitalize hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              {template.category}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600" />
            <span className="text-slate-900 dark:text-white font-semibold truncate max-w-[200px] sm:max-w-md">
              {template.title}
            </span>
          </div>

          {/* Right Toolbar: Model Pill Dropdown, Share, More Options */}
          <div className="flex items-center gap-2.5">
            {/* Model Pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs font-medium text-slate-700 dark:text-slate-200 shadow-sm">
              <span className="w-4 h-4 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-[10px] font-bold">
                {template.tool?.[0] || "M"}
              </span>
              <span>{template.tool || "Midjourney"}</span>
              <ChevronRight className="w-3 h-3 text-slate-400 dark:text-slate-500 rotate-90" />
            </div>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] border border-slate-200 dark:border-white/10 text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors cursor-pointer shadow-sm"
            >
              {shareCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  <span>Share</span>
                </>
              )}
            </button>

            {/* More Options Button */}
            <button
              onClick={() => setIsCustomizeOpen(true)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] border border-slate-200 dark:border-white/10 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer shadow-sm"
              title="More options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1450px] mx-auto px-4 sm:px-8 pt-8">
        
        {/* =========================================================================
            2. HERO SECTION: 2-COLUMN DETAIL VIEW (Matching Reference 1:1)
            ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start mb-16">
          
          {/* =====================================================================
              LEFT: VERTICAL THUMBNAIL STRIP + LARGE MEDIA PREVIEW
              ===================================================================== */}
          <div className="lg:col-span-7 flex flex-col sm:flex-row gap-4 items-start">
            
            {/* Vertical Thumbnail Strip (4 Items) */}
            <div className="flex sm:flex-col gap-2.5 order-2 sm:order-1 overflow-x-auto sm:overflow-visible w-full sm:w-20 shrink-0 pb-2 sm:pb-0">
              {thumbnails.map((thumb, idx) => {
                const isSelected = selectedThumbIndex === idx;
                return (
                  <button
                    key={thumb.id}
                    onClick={() => setSelectedThumbIndex(idx)}
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border transition-all cursor-pointer shrink-0 bg-slate-100 dark:bg-[#0c0d16] ${
                      isSelected
                        ? "border-blue-500 ring-2 ring-blue-500/40 shadow-lg shadow-blue-500/25 scale-[1.02]"
                        : "border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/30 opacity-70 hover:opacity-100"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={thumb.src}
                      alt={thumb.label}
                      className="w-full h-full object-cover"
                    />
                  </button>
                );
              })}
            </div>

            {/* Main Large Image Card */}
            <div className="flex-1 w-full order-1 sm:order-2">
              <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-[#0c0d16] shadow-xl dark:shadow-2xl group flex items-center justify-center">
                {isVideo && selectedThumbIndex === 0 ? (
                  <video
                    src={template.videoUrl || template.img}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={activeMediaSrc}
                    alt={template.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                )}

                {/* PRO Badge overlay if applicable */}
                {isProBlueprint && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md flex items-center gap-1.5">
                      <Crown className="w-3.5 h-3.5" />
                      <span>PRO</span>
                    </span>
                  </div>
                )}

                {/* Bottom Right Fullscreen Expand Icon */}
                <button
                  onClick={() => setIsFullscreenPreview(true)}
                  className="absolute bottom-4 right-4 p-2.5 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/15 text-white/80 hover:text-white transition-all cursor-pointer shadow-lg"
                  title="Fullscreen preview"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

          {/* =====================================================================
              RIGHT: METADATA, PROMPT BOX, ACTIONS & STATS
              ===================================================================== */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Category Tag & Title Header */}
            <div>
              <div className="flex items-center gap-2 mb-2 text-sky-600 dark:text-sky-400 font-mono font-bold text-xs uppercase tracking-wider">
                <span className="w-4 h-4 flex items-center justify-center rounded bg-sky-500/10 text-sky-600 dark:text-sky-400">
                  ❖
                </span>
                <span>{template.subcategory || template.category || "IMAGE GENERATION"}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mb-3">
                {template.title}
              </h1>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                {template.desc || "Create a cinematic luxury product advertisement featuring a premium smartphone in a dark studio environment."}
              </p>
            </div>

            {/* Prompt Specification Card */}
            <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#0c0e18] p-5 relative shadow-sm dark:shadow-lg">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-white/[0.06]">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <Terminal className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
                  <span>PROMPT</span>
                </div>
                
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white text-xs font-medium cursor-pointer transition-colors border border-slate-200 dark:border-white/5 shadow-sm"
                >
                  {promptCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Monospace Prompt Content */}
              <div className="relative min-h-[90px] rounded-xl overflow-hidden">
                <div className={`font-mono text-xs sm:text-[13px] leading-relaxed text-slate-800 dark:text-slate-300 whitespace-pre-wrap select-all ${
                  isProBlueprint && !isUnlocked && !hasPrivilegedAccess ? "blur-md select-none opacity-30 pointer-events-none" : ""
                }`}>
                  {isProBlueprint && !isUnlocked && !hasPrivilegedAccess
                    ? "A cinematic luxury product advertisement featuring a premium black smartphone standing on a glossy pedestal in a dark futuristic studio, with dramatic lighting, soft blue and white rim lights, realistic reflections, ultra-detailed, photorealistic, 8K --ar 16:9 --style raw (LOCKED PRO DELIVERABLE)"
                    : dynamicPrompt
                  }
                </div>

                {/* Locked Paywall Overlay */}
                {isProBlueprint && !isUnlocked && !hasPrivilegedAccess && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-slate-900/80 dark:bg-black/70 backdrop-blur-sm text-center z-10 rounded-xl">
                    <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center mb-2">
                      <Lock className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-white mb-1">PRO Blueprint Locked</span>
                    <Link
                      href={isLoggedIn ? "/checkout?plan=yearly" : `/login?redirect=${encodeURIComponent("/checkout?plan=yearly")}`}
                      className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold text-xs shadow-md mt-1"
                    >
                      Unlock with PRO (₹199)
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons Row: Use Template, Customize, Bookmark */}
            <div className="flex items-center gap-3">
              {/* Primary CTA: Use Template */}
              <button
                onClick={handleCopy}
                className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-xl shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02]"
              >
                <span>{copied ? "Prompt Copied! ✓" : "Use Template"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Secondary CTA: Customize */}
              <button
                onClick={() => setIsCustomizeOpen(true)}
                className="py-3.5 px-5 rounded-2xl bg-white hover:bg-slate-100 dark:bg-white/[0.05] dark:hover:bg-white/[0.09] text-slate-800 dark:text-white border border-slate-200 dark:border-white/10 font-medium text-sm transition-all flex items-center gap-2 cursor-pointer shadow-sm dark:shadow-none"
              >
                <Edit3 className="w-4 h-4 text-slate-500 dark:text-slate-300" />
                <span>Customize</span>
              </button>

              {/* Bookmark Button */}
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  isBookmarked
                    ? "bg-blue-50 border-blue-500 text-blue-600 dark:bg-blue-600/20 dark:border-blue-500 dark:text-blue-400 shadow-md shadow-blue-500/20"
                    : "bg-white hover:bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-800 dark:bg-white/[0.05] dark:hover:bg-white/[0.09] dark:border-white/10 dark:text-slate-400 dark:hover:text-white shadow-sm dark:shadow-none"
                }`}
                title={isBookmarked ? "Remove Bookmark" : "Save Bookmark"}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
              </button>
            </div>

            {/* Metadata Stats Row (3 Items Matching Reference) */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-white dark:bg-[#0c0e18] border border-slate-200 dark:border-white/[0.06] flex items-center gap-3 shadow-sm dark:shadow-none">
                <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/5 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0">
                  <Monitor className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">{aspectRatio}</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono block">Aspect Ratio</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white dark:bg-[#0c0e18] border border-slate-200 dark:border-white/[0.06] flex items-center gap-3 shadow-sm dark:shadow-none">
                <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/5 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0">
                  <Compass className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-slate-900 dark:text-white block truncate capitalize">{template.category}</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono block">Category</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white dark:bg-[#0c0e18] border border-slate-200 dark:border-white/[0.06] flex items-center gap-3 shadow-sm dark:shadow-none">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                  <Cpu className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">{template.tool || "Midjourney"}</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono block">AI Tool</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* =========================================================================
            3. "GUIDANCE" SECTION: INTERACTIVE STEPPER & NODE GRAPH CANVAS
            ========================================================================= */}
        <div className="rounded-3xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-[#0b0d14] p-6 sm:p-9 shadow-xl dark:shadow-2xl mb-16 transition-colors duration-300">
          
          {/* Header: Title + Subtitle & Mode Switcher + Play Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-white/[0.06]">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                Guidance
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Build the perfect result step by step
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Guidance View Mode Toggle: Step Guide vs Node Graph */}
              <div className="flex items-center bg-slate-100 dark:bg-white/[0.04] p-1 rounded-xl border border-slate-200 dark:border-white/10 text-xs shadow-inner">
                <button
                  type="button"
                  onClick={() => setGuidanceViewMode("steps")}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                    guidanceViewMode === "steps"
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Step Guide</span>
                </button>
                <button
                  type="button"
                  onClick={() => setGuidanceViewMode("node")}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                    guidanceViewMode === "node"
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Node Graph</span>
                </button>
              </div>

              {/* Play Guide Tour Button */}
              <button
                type="button"
                onClick={() => setIsPlayingGuide(!isPlayingGuide)}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] text-slate-700 hover:text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 text-xs font-semibold transition-all cursor-pointer shadow-sm"
              >
                {isPlayingGuide ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current text-blue-600 dark:text-blue-400" />}
                <span>{isPlayingGuide ? "Pause" : "Play"}</span>
              </button>
            </div>
          </div>

          {/* ===================================================================
              VIEW 1: REFERENCE UI STEPPER (Matching Reference Image 1:1)
              =================================================================== */}
          {guidanceViewMode === "steps" ? (
            <div>
              {/* Connected Horizontal Stepper Bar */}
              <div className="py-6 overflow-x-auto scrollbar-none">
                <div className="flex items-center min-w-[650px] justify-between relative px-2">
                  {/* Stepper Connecting Background Line */}
                  <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-[1px] bg-slate-200 dark:bg-white/10 -z-0" />

                  {guidanceSteps.map((stepItem: any, idx: number) => {
                    const isActive = idx === activeStepIndex;
                    const isPast = idx < activeStepIndex;

                    return (
                      <button
                        key={stepItem.id}
                        onClick={() => {
                          setActiveStepIndex(idx);
                          setIsPlayingGuide(false);
                          setReferenceImgIndex(0);
                        }}
                        className="flex items-center gap-2 z-10 px-2 py-1 rounded-full cursor-pointer transition-all bg-white dark:bg-[#0b0d14]"
                      >
                        <span
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                            isActive
                              ? "bg-blue-600 text-white ring-4 ring-blue-500/20 shadow-lg shadow-blue-500/30 scale-105"
                              : isPast
                              ? "bg-emerald-600 text-white"
                              : "bg-slate-100 dark:bg-[#131624] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/30"
                          }`}
                        >
                          {isPast ? "✓" : stepItem.stepNumber}
                        </span>
                        <span
                          className={`text-xs font-medium ${
                            isActive ? "text-blue-600 dark:text-blue-400 font-semibold" : "text-slate-500 dark:text-slate-400"
                          }`}
                        >
                          {stepItem.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Stepper Content Body (2 Columns: Left Instructions, Right Reference Preview) */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2 pb-6"
                >
                  {/* Left Column: Vertical Step & Description */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="border-r border-slate-200 dark:border-white/10 pr-4 shrink-0">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                          STEP
                        </span>
                        <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white block">
                          {activeStep.stepNumber}
                        </span>
                      </div>

                      <div className="min-w-0">
                        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-1">
                          {activeStep.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                          {activeStep.subtitle}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal pt-1">
                      {activeStep.description}
                    </p>

                    {/* Example Prompt Box */}
                    <div className="rounded-2xl bg-slate-50 dark:bg-[#07080e] border border-slate-200 dark:border-white/[0.06] p-4 relative shadow-inner">
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 dark:border-white/[0.04]">
                        <div className="flex items-center gap-2 text-xs font-mono font-semibold text-slate-500 dark:text-slate-400">
                          <Terminal className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
                          <span>Example Prompt</span>
                        </div>

                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(activeStep.examplePrompt);
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                          }}
                          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </button>
                      </div>

                      <p className="font-mono text-xs text-slate-800 dark:text-slate-300 leading-relaxed select-all">
                        {activeStep.examplePrompt}
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Reference Example Image Preview */}
                  <div className="lg:col-span-5">
                    <div className="relative rounded-2xl overflow-hidden aspect-[16/10] bg-slate-100 dark:bg-black/60 border border-slate-200 dark:border-white/10 shadow-lg dark:shadow-xl group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={activeRefImage}
                        alt={activeStep.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* Carousel Cycle Arrow Overlay */}
                      {refImages.length > 1 && (
                        <button
                          onClick={() => setReferenceImgIndex((prev) => (prev + 1) % refImages.length)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md border border-white/15 transition-all cursor-pointer shadow-md"
                          title="Next reference image"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Reference Example Caption */}
                    <div className="flex items-center justify-between pt-3 px-1 text-xs">
                      <div>
                        <span className="font-semibold text-slate-900 dark:text-white block">Reference Example</span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 block">{activeStep.referenceCaption}</span>
                      </div>
                      <span className="font-mono text-slate-400 dark:text-slate-500 font-semibold shrink-0">
                        {((referenceImgIndex % refImages.length) + 1)} / {refImages.length}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Stepper Navigation Bottom Bar */}
              <div className="pt-6 border-t border-slate-200 dark:border-white/[0.06] flex items-center justify-between gap-4">
                <button
                  onClick={() => {
                    setActiveStepIndex((prev) => Math.max(0, prev - 1));
                    setIsPlayingGuide(false);
                    setReferenceImgIndex(0);
                  }}
                  disabled={activeStepIndex === 0}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all ${
                    activeStepIndex === 0
                      ? "opacity-30 cursor-not-allowed border-slate-200 dark:border-white/5 text-slate-400 dark:text-slate-500"
                      : "border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.05] cursor-pointer shadow-sm"
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                {/* Middle Progress Track */}
                <div className="flex items-center gap-3">
                  <div className="hidden sm:block w-32 h-1.5 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-300"
                      style={{ width: `${((activeStepIndex + 1) / guidanceSteps.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400 font-semibold">
                    Step {activeStep.stepNumber} / 0{guidanceSteps.length}
                  </span>
                </div>

                {/* Next Step / Complete Button */}
                {activeStepIndex < guidanceSteps.length - 1 ? (
                  <button
                    onClick={() => {
                      setActiveStepIndex((prev) => Math.min(guidanceSteps.length - 1, prev + 1));
                      setIsPlayingGuide(false);
                      setReferenceImgIndex(0);
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-blue-500/25 transition-all cursor-pointer hover:scale-[1.02]"
                  >
                    <span>Next Step</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setActiveStepIndex(0);
                      setIsPlayingGuide(false);
                      setReferenceImgIndex(0);
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-emerald-500/25 transition-all cursor-pointer"
                  >
                    <span>Completed • Restart</span>
                    <RefreshCw className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* ===================================================================
                VIEW 2: ANIMATED REACT FLOW NODE CANVAS
                =================================================================== */
            <div className="pt-4">
              <div className="relative w-full h-[520px] rounded-2xl overflow-hidden bg-slate-100 dark:bg-[#07080e] border border-slate-200 dark:border-white/10 shadow-lg dark:shadow-2xl">
                <ReactFlow
                  nodes={flowNodes}
                  edges={flowEdges}
                  nodeTypes={nodeTypes}
                  fitView
                  fitViewOptions={{ padding: 0.2, minZoom: 0.45, maxZoom: 1.1 }}
                  proOptions={{ hideAttribution: true }}
                  nodesConnectable={false}
                  elementsSelectable={false}
                  zoomOnScroll={false}
                  panOnScroll={true}
                  onNodeClick={(_, node) => {
                    const stepIdx = guidanceSteps.findIndex((s: any) => `step-${s.id}` === node.id);
                    if (stepIdx !== -1) {
                      setActiveStepIndex(stepIdx);
                    }
                  }}
                  className="touch-pan-y"
                >
                  <Background color={isLight ? "rgba(100, 116, 139, 0.2)" : "rgba(255,255,255,0.06)"} gap={24} size={1} />
                  <Controls className="!bg-white dark:!bg-[#0c0d18] !border-slate-200 dark:!border-white/10 !fill-slate-700 dark:!fill-white !shadow-md" />
                </ReactFlow>

                <div className="absolute bottom-4 left-4 z-10 px-3.5 py-1.5 rounded-xl bg-white/90 dark:bg-black/75 backdrop-blur-md border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-700 dark:text-slate-300 flex items-center gap-2 shadow-sm">
                  <Compass className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
                  <span>Interactive Node Canvas • Click any node to select • Drag nodes to reposition</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* =========================================================================
            4. "MORE FROM THIS CATEGORY": 5-CARD GRID (Matching Reference UI 1:1)
            ========================================================================= */}
        <div className="pt-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                More from this category
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Explore more {template.category || "image generation"} templates
              </p>
            </div>
            
            <Link
              href={`/?category=${encodeURIComponent(template.category)}`}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 flex items-center gap-1.5 transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Responsive 5-Column Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {relatedTemplates.map((item) => (
              <Link
                href={`/template/${item.id}`}
                key={item.id}
                className="group flex flex-col rounded-2xl overflow-hidden border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#0c0e18] shadow-sm hover:shadow-xl dark:shadow-md dark:hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative w-full aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {item.isPro && (
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-pink-500 text-white shadow-sm">
                      PRO
                    </div>
                  )}
                </div>

                <div className="p-3.5 flex-1 flex flex-col justify-between">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1 mb-2">
                    {item.title}
                  </h3>

                  <div className="flex items-center justify-between text-[10px]">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/[0.04] text-slate-600 dark:text-slate-400 font-mono capitalize truncate max-w-[100px]">
                      {item.category}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                      className="text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-white transition-colors"
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>

      {/* =========================================================================
          5. CUSTOMIZE MODAL / DRAWER (Triggered by [✏ Customize] Button)
          ========================================================================= */}
      <AnimatePresence>
        {isCustomizeOpen && (
          <div className="fixed inset-0 z-[250] flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCustomizeOpen(false)}
              className="absolute inset-0 bg-black/60 dark:bg-black/70 backdrop-blur-sm"
            />

            {/* Slide-over Drawer Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative w-full max-w-md bg-white dark:bg-[#0c0e18] border-l border-slate-200 dark:border-white/10 h-full p-6 sm:p-8 overflow-y-auto flex flex-col justify-between shadow-2xl z-10 text-slate-900 dark:text-white"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Prompt Customizer</h3>
                  </div>
                  <button
                    onClick={() => setIsCustomizeOpen(false)}
                    className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 dark:bg-white/5 dark:hover:bg-white/10 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Aspect Ratio */}
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                    Aspect Ratio (--ar)
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {["16:9", "9:16", "1:1", "21:9"].map((ar) => (
                      <button
                        key={ar}
                        onClick={() => setAspectRatio(ar)}
                        className={`py-2 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer border ${
                          aspectRatio === ar
                            ? "bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 dark:bg-white/[0.03] dark:text-slate-400 dark:border-white/10 dark:hover:border-white/20"
                        }`}
                      >
                        {ar}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Lighting Atmosphere */}
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                    Lighting Atmosphere
                  </label>
                  <select
                    value={lighting}
                    onChange={(e) => setLighting(e.target.value)}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-900 dark:text-white outline-none focus:border-blue-500"
                  >
                    <option value="Cyber Obsidian" className="bg-white dark:bg-[#0c0e18] text-slate-900 dark:text-white">Cyber Obsidian (Default)</option>
                    <option value="Golden Hour" className="bg-white dark:bg-[#0c0e18] text-slate-900 dark:text-white">Warm Golden Hour</option>
                    <option value="Studio Softbox" className="bg-white dark:bg-[#0c0e18] text-slate-900 dark:text-white">Minimal Studio Softbox</option>
                    <option value="Volumetric Neon" className="bg-white dark:bg-[#0c0e18] text-slate-900 dark:text-white">Volumetric Fog & Neon</option>
                  </select>
                </div>

                {/* Stylize Parameter */}
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                    Stylize Strength (--s)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {["100", "250", "750"].map((s) => (
                      <button
                        key={s}
                        onClick={() => setStylize(s)}
                        className={`py-2 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer border ${
                          stylize === s
                            ? "bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 dark:bg-white/[0.03] dark:text-slate-400 dark:border-white/10"
                        }`}
                      >
                        --s {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Engine Mode */}
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                    Engine Mode
                  </label>
                  <button
                    onClick={() => setIsRawStyle(!isRawStyle)}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer border flex items-center justify-between ${
                      isRawStyle
                        ? "bg-blue-50 border-blue-300 text-blue-600 dark:bg-blue-500/10 dark:border-blue-500/30 dark:text-blue-400"
                        : "bg-slate-100 border-slate-200 text-slate-700 dark:bg-white/[0.03] dark:border-white/10 dark:text-slate-400"
                    }`}
                  >
                    <span>--style raw</span>
                    <span>{isRawStyle ? "ENABLED ✓" : "OFF"}</span>
                  </button>
                </div>

                {/* Inject Custom Directive */}
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                    Inject Custom Tweak Directives
                  </label>
                  <form onSubmit={handleMutatePrompt} className="space-y-2">
                    <input
                      type="text"
                      value={customAddon}
                      onChange={(e) => setCustomAddon(e.target.value)}
                      placeholder="E.g. Sapphire metallic reflections..."
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-blue-500"
                    />
                    <button
                      type="submit"
                      disabled={isCustomizing}
                      className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-transform cursor-pointer shadow-md shadow-blue-500/25"
                    >
                      {isCustomizing ? "Applying..." : "Apply Custom Directive"}
                    </button>
                  </form>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-6 border-t border-slate-200 dark:border-white/10">
                <button
                  onClick={() => {
                    handleCopy();
                    setIsCustomizeOpen(false);
                  }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-xs shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Customized Prompt & Close</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          6. FULLSCREEN PREVIEW MODAL
          ========================================================================= */}
      {isFullscreenPreview && (
        <div className="fixed inset-0 z-[300] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4">
          <button
            onClick={() => setIsFullscreenPreview(false)}
            className="absolute top-6 right-6 p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="max-w-5xl w-full aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl border border-white/20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={activeMediaSrc} alt={template.title} className="w-full h-full object-cover" />
          </div>
        </div>
      )}

    </div>
  );
}
