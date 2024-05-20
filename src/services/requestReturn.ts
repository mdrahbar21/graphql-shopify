import { ShopifyFetchOptions, shopifyFetch } from '../utilities/shopifyFetch';

interface ReturnRequestResponse {
    returnRequest: {
      return: { id: string; status: string };
      userErrors: Array<{ field: string[]; message: string }>;
    };
  }
  
  export async function requestReturn(orderId: string, returnLineItems: Array<{ fulfillmentLineItemId: string; quantity: number; returnReason: string; customerNote: string }>, returnShippingFee?: { amount: number; currencyCode: string }): Promise<ReturnRequestResponse> {
    const mutation = `
      mutation ReturnRequestMutation($orderId: ID!, $returnLineItems: [ReturnLineItemInput!]!, $returnShippingFee: ReturnShippingFeeInput) {
        returnRequest(input: { orderId: $orderId, returnLineItems: $returnLineItems, returnShippingFee: $returnShippingFee }) {
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
      orderId: `gid://shopify/Order/${orderId}`,
      returnLineItems,
      returnShippingFee: returnShippingFee || null,
    };
  
    const options: ShopifyFetchOptions = {
        query: mutation,
        variables,
    };

    try {
        const data: ReturnRequestResponse = await shopifyFetch<ReturnRequestResponse>(options);
        if (data.returnRequest.userErrors && data.returnRequest.userErrors.length > 0) {
            throw new Error(data.returnRequest.userErrors.map(error => error.message).join(', '));
        }
        return { returnRequest: data.returnRequest }; 
    } catch (error:any) {
        console.error('GraphQL Error:', error);
        throw new Error(`Failed to request return for order ${orderId}: ${error.message}`);
    }
  }
  