import { ShopifyFetchOptions, shopifyFetch } from '../utilities/shopifyFetch';

interface RetrieveReturnResponse {
    return: {
      id: string;
      order: { id: string };
      status: string;
    };
  }
  
  export async function retrieveReturn(returnId: string): Promise<RetrieveReturnResponse> {
    const query = `
      query returnQuery($id: ID!) {
        return(id: $id) {
          id
          order {
            id
          }
          status
        }
      }
    `;
  
    const variables = {
      id: `gid://shopify/Return/${returnId}`,
    };
  
    const options: ShopifyFetchOptions = {
      query,
      variables,
    };
  
    try {
      const data: RetrieveReturnResponse = await shopifyFetch<RetrieveReturnResponse>(options);
      return data;
    } catch (error:any) {
      console.error('GraphQL Error:', error);
      throw new Error(`Failed to retrieve return with ID ${returnId}: ${error.message}`);
    }
  }
  