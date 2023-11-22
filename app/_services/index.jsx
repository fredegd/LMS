import {gql,request} from "graphql-request";

const MASTER_URL = "https://api-eu-central-1-shared-euc1-02.hygraph.com/v2/"+process.env.NEXT_PUBLIC_HYGRAPH_API_URL+"/master"

export const getList = async() => {
const query = gql` 
query itemPreview {
  snippetCollections {
    id
    title
    tag
    banner {
      url
    }
    description
  }
}

`

const result = await request(MASTER_URL, query)
  return result;
}

export const getItemById = async(id) => {
  const query = gql` 
  query tutorial {
    snippetCollection(where: {id: "${id}"}) {
      chapterSection {
        ... on Chapter {
          id
          title
          descriptionMd
          banner {
            url
          }
        }
      }
      description
      title
      tag
      id
      banner {
        url
      }
    }
  }
 
    
  `
  
  const result = await request(MASTER_URL, query)
    return result;
  }