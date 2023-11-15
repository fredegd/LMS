import {gql,request} from "graphql-request";

const MASTER_URL = "https://api-eu-central-1-shared-euc1-02.hygraph.com/v2/"+process.env.NEXT_PUBLIC_HYGRAPH_API_URL+"/master"

export const getList = async() => {
const query = gql` 
query lessons {
  snippets {
      banner {
        url
      }
      id
      tag
      title
      description
      sourceCode
    }
  }
  
`

const result = await request(MASTER_URL, query)
  return result;
}