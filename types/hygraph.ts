export interface Asset {
  id?: string;
  url: string;
}

export interface Chapter {
  id: string;
  title: string;
  chapterDescription: string;
  chapterSnippet: string;
  banner: Asset | null;
}

export interface SnippetCollection {
  id: string;
  title: string;
  description: string;
  tags: string[];
  level: string;
  banner: Asset | null;
  chapterSection: Chapter[];
}

export interface SnippetPreview {
  id: string;
  title: string;
  description: string;
  tags: string[];
  level: string;
  banner: Asset | null;
  chapterSection?: { id: string }[];
}
