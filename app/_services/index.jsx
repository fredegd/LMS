import { GraphQLClient, gql } from "graphql-request";

const endpoint = process.env.NEXT_PUBLIC_HYGRAPH_API_URL_HIGH_PERFORMANCE;

const client =
  endpoint &&
  new GraphQLClient(endpoint, {
    headers: process.env.HYGRAPH_API_TOKEN
      ? { Authorization: `Bearer ${process.env.HYGRAPH_API_TOKEN}` }
      : {},
  });

const ITEM_PREVIEW_QUERY = gql`
  query ItemPreview {
    snippetCollections(orderBy: updatedAt_DESC) {
      id
      title
      tags
      description
      banner {
        url
      }
    }
  }
`;

const ITEM_BY_ID_QUERY = gql`
  query ItemById($id: ID!) {
    snippetCollection(where: { id: $id }) {
      id
      title
      description
      level
      tags
      banner {
        url
      }
      chapterSection {
        ... on Chapter {
          id
          title
          chapterDescription
          chapterSnippet
          banner {
            url
          }
        }
      }
    }
  }
`;

const mapChapter = (chapter = {}) => ({
  id: chapter.id || "",
  title: chapter.title || "Untitled chapter",
  chapterDescription: chapter.chapterDescription || "",
  chapterSnippet: chapter.chapterSnippet || "",
  banner: chapter.banner?.url ? { url: chapter.banner.url } : null,
});

const mapSnippetPreview = (snippet = {}) => ({
  id: snippet.id || "",
  title: snippet.title || "Untitled item",
  description: snippet.description || "",
  tags: Array.isArray(snippet.tags) ? snippet.tags : [],
  banner: snippet.banner?.url ? { url: snippet.banner.url } : null,
});

const mapSnippetDetails = (snippet = {}) => ({
  ...mapSnippetPreview(snippet),
  level: snippet.level || "unspecified",
  chapterSection: Array.isArray(snippet.chapterSection)
    ? snippet.chapterSection.map(mapChapter)
    : [],
});

const getClient = () => {
  if (!client) {
    console.warn(
      "Missing Hygraph project id. Set NEXT_PUBLIC_HYGRAPH_PROJECT_ID (or NEXT_PUBLIC_HYGRAPH_API_URL).",
    );
    return null;
  }

  return client;
};

export const getList = async () => {
  const currentClient = getClient();
  if (!currentClient) return { snippetCollections: [] };

  try {
    const result = await currentClient.request(ITEM_PREVIEW_QUERY);
    return {
      snippetCollections: (result?.snippetCollections || []).map(
        mapSnippetPreview,
      ),
    };
  } catch (error) {
    console.error("Failed to load snippet collections from Hygraph.", error);
    return { snippetCollections: [] };
  }
};

export const getItemById = async (id) => {
  const currentClient = getClient();
  if (!currentClient || !id) return { snippetCollection: null };

  try {
    const result = await currentClient.request(ITEM_BY_ID_QUERY, { id });
    return {
      snippetCollection: result?.snippetCollection
        ? mapSnippetDetails(result.snippetCollection)
        : null,
    };
  } catch (error) {
    console.error(`Failed to load snippet collection "${id}".`, error);
    return { snippetCollection: null };
  }
};
