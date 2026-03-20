"use client";

import Markdown from "react-markdown";
import Image from "next/image";
import React, { useState } from "react";
import { Chapter as ChapterType } from "../../../../../../types/hygraph";
import { Copy, Check } from "lucide-react";

interface ChapterProps {
  content: ChapterType;
}

export default function Chapter({ content }: ChapterProps) {
  const [copied, setCopied] = useState(false);

  const onCopy = () => {
    if (content.chapterSnippet) {
      // More robust way to extract content between the first and last triple-backticks
      const raw = content.chapterSnippet.trim();
      const firstBacktick = raw.indexOf("```");
      const lastBacktick = raw.lastIndexOf("```");

      let cleanSnippet = raw;

      if (firstBacktick !== -1 && lastBacktick !== -1 && firstBacktick !== lastBacktick) {
        // Find the end of the first line (where the ```language occurs)
        const firstLineEnd = raw.indexOf("\n", firstBacktick);
        
        if (firstLineEnd !== -1 && firstLineEnd < lastBacktick) {
          // Extract everything from after the first line until the last backticks
          cleanSnippet = raw.slice(firstLineEnd + 1, lastBacktick);
        } else {
          // Fallback: just remove the backticks themselves if it's all on one line
          cleanSnippet = raw.slice(firstBacktick + 3, lastBacktick);
          // If the remaining part starts with a language identifier (e.g. "javascript code"), trim it
          cleanSnippet = cleanSnippet.replace(/^[a-zA-Z+%-]+\s+/, "");
        }
      }

      navigator.clipboard.writeText(cleanSnippet.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <article
      id={`chapter-${content.id}`}
      className="scroll-mt-20 rounded-xl border border-gray-200 bg-white overflow-hidden"
    >
      {/* Chapter header */}
      <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
        <h2 className="text-xl font-semibold text-gray-900">
          {content.title}
        </h2>
      </div>

      <div className="p-5 space-y-5">
        {content?.banner && (
          <Image
            src={content.banner.url}
            alt={content.title}
            width={1400}
            height={788}
            className="w-full h-auto rounded-lg"
          />
        )}

        {content?.chapterDescription && (
          <div className="prose max-w-none">
            <Markdown>{content.chapterDescription}</Markdown>
          </div>
        )}

        {content.chapterSnippet && (
          <div className="relative group p-4 bg-gray-50/80 rounded-xl border border-gray-100">
            <button
              onClick={onCopy}
              className="absolute right-3 top-3 p-2 rounded-lg bg-white border border-gray-200 shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-gray-50 hover:scale-105 active:scale-95"
              title="Copy Snippet"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4 text-gray-500" />
              )}
            </button>
            <div className="prose max-w-none">
              <Markdown>{content.chapterSnippet}</Markdown>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
