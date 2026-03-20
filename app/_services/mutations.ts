import { GraphQLClient, gql } from "graphql-request";

const contentApiUrl = process.env.HYGRAPH_CONTENT_API_URL;
const apiToken = process.env.HYGRAPH_API_TOKEN;

const mutationClient =
  contentApiUrl && apiToken
    ? new GraphQLClient(contentApiUrl, {
        headers: { Authorization: `Bearer ${apiToken}` },
      })
    : null;

const getMutationClient = (): GraphQLClient => {
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
// Chapter mutations
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

interface SnippetCollectionInput {
  title: string;
  description: string;
  tags: string[];
  level: string;
}

export async function createSnippetCollection({ title, description, tags, level }: SnippetCollectionInput): Promise<{ id: string }> {
  const client = getMutationClient();
  const result = await client.request<{ createSnippetCollection: { id: string } }>(CREATE_SNIPPET, {
    data: { title, description, tags, level },
  });
  const id = result.createSnippetCollection.id;
  await client.request(PUBLISH_SNIPPET, { where: { id } });
  return { id };
}

export async function updateSnippetCollection(id: string, { title, description, tags, level }: SnippetCollectionInput): Promise<{ id: string }> {
  const client = getMutationClient();
  await client.request(UPDATE_SNIPPET, {
    where: { id },
    data: { title, description, tags, level },
  });
  await client.request(PUBLISH_SNIPPET, { where: { id } });
  return { id };
}

export async function deleteSnippetCollection(id: string): Promise<{ id: string }> {
  const client = getMutationClient();
  try {
    await client.request(UNPUBLISH_SNIPPET, { where: { id } });
  } catch {
    // may already be in DRAFT stage
  }
  await client.request(DELETE_SNIPPET, { where: { id } });
  return { id };
}

interface ChapterInput {
  title: string;
  chapterDescription?: string;
  chapterSnippet?: string;
}

export async function createChapter(parentId: string, { title, chapterDescription, chapterSnippet }: ChapterInput): Promise<{ parentId: string }> {
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

export async function updateChapter(parentId: string, chapterId: string, { title, chapterDescription, chapterSnippet }: ChapterInput): Promise<{ parentId: string, chapterId: string }> {
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

export async function deleteChapter(parentId: string, chapterId: string): Promise<{ parentId: string, chapterId: string }> {
  const client = getMutationClient();
  await client.request(DELETE_CHAPTER_VIA_PARENT, { parentId, chapterId });
  await client.request(PUBLISH_SNIPPET, { where: { id: parentId } });
  return { parentId, chapterId };
}

// ---------------------------------------------------------------------------
// Asset upload & banner mutations
// ---------------------------------------------------------------------------

const PUBLISH_ASSET = gql`
  mutation PublishAsset($where: AssetWhereUniqueInput!) {
    publishAsset(where: $where, to: [PUBLISHED]) {
      id
      url
    }
  }
`;

const UPDATE_COLLECTION_BANNER = gql`
  mutation UpdateCollectionBanner(
    $where: SnippetCollectionWhereUniqueInput!
    $data: SnippetCollectionUpdateInput!
  ) {
    updateSnippetCollection(where: $where, data: $data) {
      id
    }
  }
`;

const UPDATE_CHAPTER_BANNER_VIA_PARENT = gql`
  mutation UpdateChapterBanner(
    $parentId: ID!
    $chapterId: ID!
    $assetId: ID!
  ) {
    updateSnippetCollection(
      where: { id: $parentId }
      data: {
        chapterSection: {
          update: {
            Chapter: {
              where: { id: $chapterId }
              data: { banner: { connect: { id: $assetId } } }
            }
          }
        }
      }
    ) {
      id
    }
  }
`;

export async function uploadAsset(file: File): Promise<{ id: string, url: string }> {
  if (!apiToken || !contentApiUrl) {
    throw new Error("Hygraph upload not configured. Set HYGRAPH_API_TOKEN and HYGRAPH_CONTENT_API_URL.");
  }

  const client = getMutationClient();

  // Step 1: Create Asset and get S3 upload details
  const CREATE_ASSET_MUTATION = gql`
    mutation CreateAsset($fileName: String!) {
      createAsset(data: { fileName: $fileName }) {
        id
        url
        upload {
          requestPostData {
            url
            key
            signature
            algorithm
            policy
            date
            credential
            securityToken
          }
        }
      }
    }
  `;

  try {
    const createResult = await client.request<any>(CREATE_ASSET_MUTATION, {
      fileName: file.name || "upload",
    });

    if (!createResult?.createAsset?.upload?.requestPostData) {
      throw new Error("Hygraph upload initiation failed: No S3 metadata returned.");
    }

    const { id: assetId, upload, url: initialUrl } = createResult.createAsset;
    const { url: s3Url, ...metadata } = upload.requestPostData;

    // Step 2: Upload to S3 (Multipart/form-data)
    const formData = new FormData();
    formData.append("key", metadata.key);
    formData.append("X-Amz-Algorithm", metadata.algorithm);
    formData.append("X-Amz-Credential", metadata.credential);
    formData.append("X-Amz-Date", metadata.date);
    formData.append("Policy", metadata.policy);
    formData.append("X-Amz-Signature", metadata.signature);
    if (metadata.securityToken) {
      formData.append("X-Amz-Security-Token", metadata.securityToken);
    }
    formData.append("file", file);

    const s3Response = await fetch(s3Url, {
      method: "POST",
      body: formData,
    });

    if (!s3Response.ok) {
      const errorText = await s3Response.text();
      throw new Error(`S3 upload failed (${s3Response.status}): ${errorText}`);
    }

    // Step 3: Poll for completion
    const STATUS_QUERY = gql`
      query GetAssetStatus($id: ID!) {
        asset(where: { id: $id }, stage: DRAFT) {
          id
          url
          upload {
            status
          }
        }
      }
    `;

    let attempts = 0;
    const maxAttempts = 10;
    while (attempts < maxAttempts) {
      const statusResult = await client.request<any>(STATUS_QUERY, { id: assetId });
      const status = statusResult?.asset?.upload?.status;
      const currentUrl = statusResult?.asset?.url || initialUrl;

      console.log(`Hygraph Status Poll #${attempts + 1}: ${status || "null"}`);

      if (status === "ASSET_CREATE_COMPLETE") {
        return { id: assetId, url: currentUrl };
      }

      if (status === "ASSET_CREATE_FAILED") {
        throw new Error("Asset processing failed on Hygraph servers.");
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
      attempts++;
    }

    // If still pending after 10s, return anyway so linking can proceed
    console.log(`Asset ${assetId} still pending but returning for linking.`);
    return { id: assetId, url: initialUrl };
  } catch (error: any) {
    if (error.response?.errors) {
      throw new Error(`Hygraph upload failed: ${error.response.errors[0].message}`);
    }
    throw new Error(`Hygraph upload failed: ${error.message}`);
  }
}

export async function publishAsset(assetId: string): Promise<any> {
  const client = getMutationClient();
  const result = await client.request<any>(PUBLISH_ASSET, { where: { id: assetId } });
  return result.publishAsset;
}

export async function updateSnippetCollectionBanner(collectionId: string, assetId: string): Promise<{ id: string }> {
  const client = getMutationClient();
  await client.request(UPDATE_COLLECTION_BANNER, {
    where: { id: collectionId },
    data: { banner: { connect: { id: assetId } } },
  });
  await client.request(PUBLISH_SNIPPET, { where: { id: collectionId } });
  return { id: collectionId };
}

export async function updateChapterBanner(parentId: string, chapterId: string, assetId: string): Promise<{ parentId: string, chapterId: string }> {
  const client = getMutationClient();
  await client.request(UPDATE_CHAPTER_BANNER_VIA_PARENT, {
    parentId,
    chapterId,
    assetId,
  });
  await client.request(PUBLISH_SNIPPET, { where: { id: parentId } });
  return { parentId, chapterId };
}
