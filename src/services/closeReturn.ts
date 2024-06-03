import { ShopifyFetchOptions, shopifyFetch } from '../utilities/shopifyFetch';

interface CloseReturnResponse {
    returnClose: {
      return: { id: string };
      userErrors: Array<{ field: string[]; message: string }>;
    };
  }
  
  export async function closeReturn(returnId: string): Promise<CloseReturnResponse> {
    const mutation = `
      mutation returnCloseMutation($id: ID!) {
        returnClose(id: $id) {
          return {
            id
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
  
    const variables = {
      id: `gid://shopify/Return/${returnId}`
    };
  
    const options: ShopifyFetchOptions = {
      query: mutation,
      variables
    };
  
    try {
      const data: CloseReturnResponse = await shopifyFetch(options);
      if (data.returnClose.userErrors && data.returnClose.userErrors.length > 0) {
        throw new Error(data.returnClose.userErrors.map(error => error.message).join(', '));
      }
      return {returnClose:data.returnClose};
    } catch (error:any) {
      console.error('GraphQL Error:', error);
      throw new Error(`Failed to close return with ID ${returnId}: ${error.message}`);
    }
  }
  