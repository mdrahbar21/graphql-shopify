import { ShopifyFetchOptions, shopifyFetch } from '../utilities/shopifyFetch';

interface CreateReturnResponse {
    returnCreate: {
      return: { id: string };
      userErrors: Array<{ field: string[]; message: string }>;
    };
  }
  
  export async function createReturn(orderId: string, returnLineItems: Array<{ fulfillmentLineItemId: string; quantity: number; returnReason: string; returnReasonNote?: string }>, exchangeLineItems?: Array<{ variantId: string; quantity: number }>, returnShippingFee?: { amount: number; currencyCode: string }): Promise<CreateReturnResponse> {
    const mutation = `
      mutation returnCreateMutation($orderId: ID!, $returnLineItems: [ReturnLineItemInput!]!, $exchangeLineItems: [ExchangeLineItemInput!], $returnShippingFee: ReturnShippingFeeInput) {
        returnCreate(input: { orderId: $orderId, returnLineItems: $returnLineItems, exchangeLineItems: $exchangeLineItems, returnShippingFee: $returnShippingFee }) {
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
      orderId: `gid://shopify/Order/${orderId}`,
      returnLineItems,
      exchangeLineItems: exchangeLineItems || [],
      returnShippingFee: returnShippingFee || null,
    };
  
    const options: ShopifyFetchOptions = {
      query: mutation,
      variables,
    };
  
    try {
      const data: CreateReturnResponse = await shopifyFetch<CreateReturnResponse>(options);
      if (data.returnCreate.userErrors && data.returnCreate.userErrors.length > 0) {
        throw new Error(data.returnCreate.userErrors.map(error => error.message).join(', '));
      }
      return {returnCreate:data.returnCreate};
    } catch (error:any) {
      console.error('GraphQL Error:', error);
      throw new Error(`Failed to create return for order ${orderId}: ${error.message}`);
    }
  }
  