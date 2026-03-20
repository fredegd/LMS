import Image from "next/image";
import React from "react";
import { SnippetCollection } from "../../../../../../types/hygraph";

interface CoverPageProps {
  data: SnippetCollection;
}

export default function CoverPage({ data }: CoverPageProps) {
  return (
    <div className="group">
      {data?.banner?.url ? (
        <div className="relative aspect-video w-full overflow-hidden shadow-lg border border-gray-100/50">
          <Image
            src={data.banner.url}
            alt={data.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        </div>
      ) : (
        <div className="flex items-center justify-center h-48 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 text-sm text-gray-400">
          No banner provided
        </div>
      )}
    </div>
  );
}
