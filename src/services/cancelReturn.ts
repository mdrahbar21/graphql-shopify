import { ShopifyFetchOptions, shopifyFetch } from '../utilities/shopifyFetch';

interface CancelReturnResponse {
    returnCancel: {
      return: { id: string };
      userErrors: Array<{ field: string[]; message: string }>;
    };
  }
  
  export async function cancelReturn(returnId: string): Promise<CancelReturnResponse> {
    const mutation = `
      mutation returnCancelMutation($id: ID!) {
        returnCancel(id: $id) {
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
      id: `gid://shopify/Return/${returnId}`,
    };
  
    const options: ShopifyFetchOptions = {
      query: mutation,
      variables,
    };
  
    try {
      const data: CancelReturnResponse = await shopifyFetch<CancelReturnResponse>(options);
      if (data.returnCancel.userErrors && data.returnCancel.userErrors.length > 0) {
        throw new Error(data.returnCancel.userErrors.map(error => error.message).join(', '));
      }
      return {returnCancel:data.returnCancel};
    } catch (error:any) {
      console.error('GraphQL Error:', error);
      throw new Error(`Failed to cancel return with ID ${returnId}: ${error.message}`);
    }
  }
  