import { ShopifyFetchOptions, shopifyFetch } from '../utilities/shopifyFetch';

interface DeclineReturnResponse {
    returnDeclineRequest: {
      return: { id: string; status: string; decline: { reason: string } };
      userErrors: Array<{ field: string[]; message: string }>;
    };
  }
  
  export async function declineReturn(returnId: string, declineReason: string): Promise<DeclineReturnResponse> {
    const mutation = `
      mutation DeclineReturnRequestMutation($id: ID!, $declineReason: ReturnDeclineReason!) {
        returnDeclineRequest(input: { id: $id, declineReason: $declineReason }) {
          return {
            id
            status
            decline {
              reason
            }
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
      declineReason,
    };
  
    const options: ShopifyFetchOptions = {
      query: mutation,
      variables,
    };
  
    try {
      const data: DeclineReturnResponse = await shopifyFetch<DeclineReturnResponse>(options);
      if (data.returnDeclineRequest.userErrors && data.returnDeclineRequest.userErrors.length > 0) {
        throw new Error(data.returnDeclineRequest.userErrors.map(error => error.message).join(', '));
      }
      return {returnDeclineRequest: data.returnDeclineRequest};
    } catch (error:any) {
      console.error('GraphQL Error:', error);
      throw new Error(`Failed to decline return with ID ${returnId}: ${error.message}`);
    }
  }
  