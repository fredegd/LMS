"use client";

import React, { useState, useEffect, use } from "react";
import { ArrowLeft, ArrowUp, Book, Tag, BarChart3, List, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { getItemById } from "../../../../_services/index";
import CoverPage from "./_components/CoverPage";
import ItemDetails from "./_components/ItemDetails";
import { SnippetCollection, Chapter } from "../../../../../types/hygraph";

interface ChapterTOCProps {
  chapters: Chapter[];
  className?: string;
}

function ChapterTOC({ chapters, className = "" }: ChapterTOCProps) {
  return (
    <nav className={className}>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
        On this page
      </h3>
      <ul className="space-y-1">
        {chapters.map((ch, i) => (
          <li key={ch.id}>
            <a
              href={`#chapter-${ch.id}`}
              className="flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm text-gray-600 hover:text-orange-600 hover:bg-orange-50/60 transition-colors"
            >
              <span className="shrink-0 w-5 text-center text-xs text-gray-400 font-mono">
                {i + 1}
              </span>
              <span className="truncate">{ch.title}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

interface MobileTOCProps {
  chapters: Chapter[];
}

function MobileTOC({ chapters }: MobileTOCProps) {
  const [open, setOpen] = useState(false);

  if (!chapters?.length) return null;

  return (
    <div className="xl:hidden mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <span className="flex items-center gap-2">
          <List className="h-4 w-4 text-gray-400" />
          Chapters ({chapters.length})
        </span>
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="mt-1 rounded-lg border border-gray-200 bg-white p-2">
          <ChapterTOC chapters={chapters} />
        </div>
      )}
    </div>
  );
}

function ItemSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="skeleton h-56 w-full rounded-xl" />
      <div className="skeleton h-8 w-2/3 rounded" />
      <div className="skeleton h-4 w-1/3 rounded" />
      <div className="skeleton h-24 w-full rounded" />
    </div>
  );
}

interface ItemPreviewProps {
  params: Promise<{ itemId: string }>;
}

export default function ItemPreview({ params }: ItemPreviewProps) {
  const router = useRouter();
  const { itemId } = use(params);
  const [item, setItem] = useState<SnippetCollection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    let active = true;

    const loadItem = async () => {
      setIsLoading(true);
      setError("");

      const response = await getItemById(itemId);

      if (!active) return;

      if (!response?.snippetCollection) {
        setError("Snippet not found.");
        setItem(null);
        setIsLoading(false);
        return;
      }

      setItem(response.snippetCollection);
      setIsLoading(false);
    };

    loadItem().catch((requestError) => {
      console.error("Failed to load snippet details.", requestError);
      if (!active) return;

      setError("Could not load this snippet right now.");
      setItem(null);
      setIsLoading(false);
    });

    return () => {
      active = false;
    };
  }, [itemId]);

  if (error) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-gray-500">{error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl">
        <ItemSkeleton />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-gray-500">Snippet not found.</p>
      </div>
    );
  }

  const chapters = item.chapterSection || [];

  return (
    <div className="relative">
      {/* Back Button - Fixed but offset from sidebar */}
      <div className="fixed top-16 left-[calc(var(--sidebar-w)+1.5rem)] z-50 transition-[left] duration-300 ease-in-out">
        <button
          onClick={() => router.back()}
          className="group flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md border border-gray-100 hover:shadow-lg hover:border-orange-200 transition-all duration-300"
          title="Go Back"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600 group-hover:text-orange-600 transition-colors" />
        </button>
      </div>

      {/* Scroll to Top Button - Fixed bottom right */}
      <div className="fixed bottom-8 right-8 z-50">
        <button
          onClick={scrollToTop}
          className={`group flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg border border-gray-100 hover:shadow-xl hover:border-orange-200 transition-all duration-300 ${showScrollTop ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-90 pointer-events-none"
            }`}
          title="Scroll to Top"
        >
          <ArrowUp className="h-6 w-6 text-gray-600 group-hover:text-orange-600 transition-colors" />
        </button>
      </div>

      {/* Hero Section: Banner + Overlay Title Card */}
      <div className="relative -mx-4 md:-mx-6 lg:-mx-8 mb-12">
        <CoverPage data={item} />

        {/* Responsive Header Card: Overlay on desktop (lg+), stacked on mobile/tablet */}
        <div
          className="relative lg:absolute lg:top-12 lg:left-4 m-auto xl:left-12 z-30 
                     p-6 lg:p-10 rounded-[1.5rem] lg:rounded-[2.5rem] 
                     bg-white/20 lg:bg-white/25 backdrop-blur-md lg:backdrop-blur-lg 
                     border border-white/50 shadow-xl lg:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] 
                     w-full xl:w-5/6 xl:max-w-4xl lg:max-w-3xl
                     mt-6 lg:mt-0 mx-4 lg:mx-0"
        >
          <div className="relative">
            <h1
              className="font-extrabold tracking-tight text-gray-900 mb-4 lg:mb-6 leading-tight drop-shadow-sm"
              style={{ fontSize: "clamp(1.25rem, 3.5vw, 2.75rem)" }}
            >
              {item.title}
            </h1>

            <div className="flex flex-wrap items-center gap-2 lg:gap-3">
              <div className="flex items-center gap-1.5 rounded-full bg-white/40 border border-white/60 px-3 py-1.5 lg:px-4 lg:py-2 text-[10px] lg:text-xs font-semibold text-gray-700 shadow-sm">
                <Book className="h-3 w-3 lg:h-4 lg:w-4 text-orange-600" />
                <span>{chapters.length} chapters</span>
              </div>

              {item.tags?.map((tag, i) => (
                <span
                  key={i}
                  className="rounded-full bg-orange-50/60 backdrop-blur-sm border border-orange-200/40 px-3 py-1.5 lg:px-4 lg:py-2 text-[9px] lg:text-xs font-bold uppercase tracking-wider text-orange-600 shadow-sm"
                >
                  {tag}
                </span>
              ))}
            </div>

            {item.description && (
              <p
                className="mt-6 lg:mt-8 leading-relaxed text-gray-800 font-medium opacity-90"
                style={{ fontSize: "clamp(0.85rem, 1.25vw + 0.4rem, 1.125rem)" }}
              >
                {item.description}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Main content */}
        <div className="min-w-0 flex-1 max-w-6xl">
          {/* Mobile TOC dropdown */}
          <MobileTOC chapters={chapters} />

          <ItemDetails item={item} />
        </div>

        {/* Right sidebar -- chapter TOC + metadata */}
        {chapters.length > 0 && (
          <aside className="hidden xl:block w-56 shrink-0">
            <div className="sticky top-16 space-y-6">


              {/* Chapter links */}
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <ChapterTOC chapters={chapters} />
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
