import {shopifyFetch, ShopifyFetchOptions} from '../utilities/shopifyFetch';

interface RemoveReturnLineItemResponse {
    returnLineItemRemoveFromReturn: {
      return: { id: string };
      userErrors: Array<{ field: string[]; message: string }>;
    };
  }
  
  export async function removeReturnLineItems(returnId: string, returnLineItems: Array<{ returnLineItemId: string; quantity: number }>): Promise<RemoveReturnLineItemResponse> {
    const mutation = `
      mutation RemoveReturnLineMutation($returnId: ID!, $returnLineItems: [ReturnLineItemInput!]!) {
        returnLineItemRemoveFromReturn(returnId: $returnId, returnLineItems: $returnLineItems) {
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
      returnId: `gid://shopify/Return/${returnId}`,
      returnLineItems,
    };
  
    const options: ShopifyFetchOptions = {
      query: mutation,
      variables,
    };
  
    try {
      const data: RemoveReturnLineItemResponse = await shopifyFetch<RemoveReturnLineItemResponse>(options);
      if (data.returnLineItemRemoveFromReturn.userErrors && data.returnLineItemRemoveFromReturn.userErrors.length > 0) {
        throw new Error(data.returnLineItemRemoveFromReturn.userErrors.map(error => error.message).join(', '));
      }
      return {returnLineItemRemoveFromReturn:data.returnLineItemRemoveFromReturn};
    } catch (error:any) {
      console.error('GraphQL Error:', error);
      throw new Error(`Failed to remove return line items for return ${returnId}: ${error.message}`);
    }
  }
  