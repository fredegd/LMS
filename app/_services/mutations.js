import { GraphQLClient, gql } from "graphql-request";

const contentApiUrl = process.env.HYGRAPH_CONTENT_API_URL;
const apiToken = process.env.HYGRAPH_API_TOKEN;

const mutationClient =
  contentApiUrl && apiToken
    ? new GraphQLClient(contentApiUrl, {
        headers: { Authorization: `Bearer ${apiToken}` },
      })
    : null;

const getMutationClient = () => {
  if (!mutationClient) {
    throw new Error(
      "Hygraph mutation client not configured. Set HYGRAPH_CONTENT_API_URL and HYGRAPH_API_TOKEN.",
    );
  }
  return mutationClient;
};

// ---------------------------------------------------------------------------
// Snippet Collection mutations
// ---------------------------------------------------------------------------

const CREATE_SNIPPET = gql`
  mutation CreateSnippetCollection($data: SnippetCollectionCreateInput!) {
    createSnippetCollection(data: $data) {
      id
    }
  }
`;

const UPDATE_SNIPPET = gql`
  mutation UpdateSnippetCollection(
    $where: SnippetCollectionWhereUniqueInput!
    $data: SnippetCollectionUpdateInput!
  ) {
    updateSnippetCollection(where: $where, data: $data) {
      id
    }
  }
`;

const DELETE_SNIPPET = gql`
  mutation DeleteSnippetCollection(
    $where: SnippetCollectionWhereUniqueInput!
  ) {
    deleteSnippetCollection(where: $where) {
      id
    }
  }
`;

const UNPUBLISH_SNIPPET = gql`
  mutation UnpublishSnippetCollection(
    $where: SnippetCollectionWhereUniqueInput!
  ) {
    unpublishSnippetCollection(where: $where) {
      id
    }
  }
`;

const PUBLISH_SNIPPET = gql`
  mutation PublishSnippetCollection(
    $where: SnippetCollectionWhereUniqueInput!
  ) {
    publishSnippetCollection(where: $where) {
      id
    }
  }
`;

// ---------------------------------------------------------------------------
// Chapter mutations (Chapter is a Hygraph component, not a standalone model,
// so all operations go through the parent's updateSnippetCollection)
// ---------------------------------------------------------------------------

const CREATE_CHAPTER_VIA_PARENT = gql`
  mutation CreateChapterInCollection(
    $parentId: ID!
    $title: String!
    $chapterDescription: String
    $chapterSnippet: String
  ) {
    updateSnippetCollection(
      where: { id: $parentId }
      data: {
        chapterSection: {
          create: {
            Chapter: {
              title: $title
              chapterDescription: $chapterDescription
              chapterSnippet: $chapterSnippet
            }
          }
        }
      }
    ) {
      id
    }
  }
`;

const UPDATE_CHAPTER_VIA_PARENT = gql`
  mutation UpdateChapterInCollection(
    $parentId: ID!
    $chapterId: ID!
    $title: String!
    $chapterDescription: String
    $chapterSnippet: String
  ) {
    updateSnippetCollection(
      where: { id: $parentId }
      data: {
        chapterSection: {
          update: {
            Chapter: {
              where: { id: $chapterId }
              data: {
                title: $title
                chapterDescription: $chapterDescription
                chapterSnippet: $chapterSnippet
              }
            }
          }
        }
      }
    ) {
      id
    }
  }
`;

const DELETE_CHAPTER_VIA_PARENT = gql`
  mutation DeleteChapterFromCollection(
    $parentId: ID!
    $chapterId: ID!
  ) {
    updateSnippetCollection(
      where: { id: $parentId }
      data: {
        chapterSection: {
          delete: {
            Chapter: {
              where: { id: $chapterId }
            }
          }
        }
      }
    ) {
      id
    }
  }
`;

// ---------------------------------------------------------------------------
// Exported mutation functions (server-only)
// ---------------------------------------------------------------------------

export async function createSnippetCollection({ title, description, tags, level }) {
  const client = getMutationClient();
  const result = await client.request(CREATE_SNIPPET, {
    data: { title, description, tags, level },
  });
  const id = result.createSnippetCollection.id;
  await client.request(PUBLISH_SNIPPET, { where: { id } });
  return { id };
}

export async function updateSnippetCollection(id, { title, description, tags, level }) {
  const client = getMutationClient();
  await client.request(UPDATE_SNIPPET, {
    where: { id },
    data: { title, description, tags, level },
  });
  await client.request(PUBLISH_SNIPPET, { where: { id } });
  return { id };
}

export async function deleteSnippetCollection(id) {
  const client = getMutationClient();
  try {
    await client.request(UNPUBLISH_SNIPPET, { where: { id } });
  } catch {
    // may already be in DRAFT stage
  }
  await client.request(DELETE_SNIPPET, { where: { id } });
  return { id };
}

export async function createChapter(parentId, { title, chapterDescription, chapterSnippet }) {
  const client = getMutationClient();
  await client.request(CREATE_CHAPTER_VIA_PARENT, {
    parentId,
    title,
    chapterDescription: chapterDescription || "",
    chapterSnippet: chapterSnippet || "",
  });
  await client.request(PUBLISH_SNIPPET, { where: { id: parentId } });
  return { parentId };
}

export async function updateChapter(parentId, chapterId, { title, chapterDescription, chapterSnippet }) {
  const client = getMutationClient();
  await client.request(UPDATE_CHAPTER_VIA_PARENT, {
    parentId,
    chapterId,
    title,
    chapterDescription: chapterDescription || "",
    chapterSnippet: chapterSnippet || "",
  });
  await client.request(PUBLISH_SNIPPET, { where: { id: parentId } });
  return { parentId, chapterId };
}

export async function deleteChapter(parentId, chapterId) {
  const client = getMutationClient();
  await client.request(DELETE_CHAPTER_VIA_PARENT, { parentId, chapterId });
  await client.request(PUBLISH_SNIPPET, { where: { id: parentId } });
  return { parentId, chapterId };
}
