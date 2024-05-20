import { ShopifyFetchOptions, shopifyFetch } from '../utilities/shopifyFetch';

interface ApproveReturnResponse {
    returnApproveRequest: {
      return: { id: string; status: string };
      userErrors: Array<{ field: string[]; message: string }>;
    };
  }
  
  export async function approveReturn(returnId: string): Promise<ApproveReturnResponse> {
    const mutation = `
      mutation ApproveReturnRequestMutation($id: ID!) {
        returnApproveRequest(input: { id: $id }) {
          return {
            id
            status
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
      const data: ApproveReturnResponse = await shopifyFetch<ApproveReturnResponse>(options);
      if (data.returnApproveRequest.userErrors && data.returnApproveRequest.userErrors.length > 0) {
        throw new Error(data.returnApproveRequest.userErrors.map(error => error.message).join(', '));
      }
      return {returnApproveRequest: data.returnApproveRequest};
    } catch (error:any) {
      console.error('GraphQL Error:', error);
      throw new Error(`Failed to approve return with ID ${returnId}: ${error.message}`);
    }
  }
  