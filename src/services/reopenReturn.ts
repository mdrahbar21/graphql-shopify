import {shopifyFetch, ShopifyFetchOptions} from '../utilities/shopifyFetch';

interface ReopenReturnResponse {
    returnReopen: {
      return: { id: string };
      userErrors: Array<{ field: string[]; message: string }>;
    };
  }
  
  export async function reopenReturn(returnId: string): Promise<ReopenReturnResponse> {
    const mutation = `
      mutation returnReopenMutation($id: ID!) {
        returnReopen(id: $id) {
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
      const data: ReopenReturnResponse = await shopifyFetch<ReopenReturnResponse>(options);
      if (data.returnReopen.userErrors && data.returnReopen.userErrors.length > 0) {
        throw new Error(data.returnReopen.userErrors.map(error => error.message).join(', '));
      }
      return {returnReopen:data.returnReopen};
    } catch (error:any) {
      console.error('GraphQL Error:', error);
      throw new Error(`Failed to reopen return with ID ${returnId}: ${error.message}`);
    }
  }
  