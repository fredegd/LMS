import Markdown from "react-markdown";
import Image from "next/image";
import React from "react";
import { Chapter as ChapterType } from "../../../../../../types/hygraph";

interface ChapterProps {
  content: ChapterType;
}

export default function Chapter({ content }: ChapterProps) {
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
          <div className="prose max-w-none">
            <Markdown>{content.chapterSnippet}</Markdown>
          </div>
        )}
      </div>
    </article>
  );
}
