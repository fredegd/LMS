import { GraphQLClient } from 'graphql-request';
import { readFile } from 'node:fs/promises';
import { File } from 'node:buffer';

const url = "https://api-eu-central-1-shared-euc1-02.hygraph.com/v2/clon6on7tdkp301uqdvuj9zj7/master";
const token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImdjbXMtbWFpbi1wcm9kdWN0aW9uIn0.eyJ2ZXJzaW9uIjozLCJpYXQiOjE3NzM5NTU1MjksImF1ZCI6WyJodHRwczovL2FwaS1ldS1jZW50cmFsLTEtc2hhcmVkLWV1YzEtMDIuaHlncmFwaC5jb20vdjIvY2xvbjZvbjd0ZGtwMzAxdXFkdnVqOXpqNy9tYXN0ZXIiLCJtYW5hZ2VtZW50LW5leHQuZ3JhcGhjbXMuY29tIl0sImlzcyI6Imh0dHBzOi8vbWFuYWdlbWVudC1ldS1jZW50cmFsLTEtc2hhcmVkLWV1YzEtMDIuaHlncmFwaC5jb20vIiwic3ViIjoiOTIzZTNiNWItZWIwNy00OTJiLWE2ZWMtZDhjODcwYmE1OTg2IiwianRpIjoiY21teHpiajVsMDNhcTA2dzAxaWJ2NWI2aCJ9.zBgePOUy_2lk92ryN7r0-iEOJcZsJzaxfBV6TdF6pJYei5i9p4pBCTlZEa9EbaMLC12e_S2ERgil8fzEZj4f6xmJLMF1huTAmtQbY-PmXTfHF6bwVwofs4QYlCcw5pVwYaIGgPnDHlFSx_eaaJbbpkPPMxKMd-pfg9zto08LtEvy3NOlQzw0OQCj6MaddWcvq5kJyE1iY0bOTH46V4a5ti1ihhhxmfzxegXc_kaIYTrk36hk1ctI15JP-etU9D7moIIE9ZUZz_dDOTOirgiTiTOw98TIHVYzGlFJOgVgBo9IVkuOxr2kMqYEDqW1YCdDBkTqfPdHbl4yTWGKfLhlzD9VzdBLOhgyLSaHTQlzwjTYUr9QBdOHc2GZqyHdplZ3Bw_xmOl_EmBRQy4h-Ceyaau8w-87HJD8KqTbXAE9C5U8MM5kTcQUta8UimjhOt0Wm-2pPRkhJGpu9D-FFQGE1KOlMuQMeLN2lF7zCF3i33iwpA-O5qo6DBXGHvuQS00noOc2R97SdX_xTEs8SVYCmo5Pl-iWwlbgRihWTgU3Z8wskStXt0B1GAcEo5bYU9yTc_o2CjiB7XWdfpEWKhf-ByncgR_3KrR-U-hUA6u5GhkY-nwkKq8x5KfcxGni5aMA5lPfWiUJYULvGaRT-7U0Y6eIRcJNuvaoC5D-jL1uuDc";

async function main() {
  const client = new GraphQLClient(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const content = await readFile('/Users/fe/Documents/WEB-PROJECTS/Snippets/LMS/app/icon.svg');
  // Use native File if available, otherwise from node:buffer
  const file = new File([content], 'icon.svg', { type: 'image/svg+xml' });

  const mutation = `
    mutation CreateAsset($file: Upload!) {
      createAsset(data: { fileUpload: $file }) {
        id
        url
      }
    }
  `;

  try {
    const data = await client.request(mutation, { file });
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    process.exit(1);
  }
}

main();
