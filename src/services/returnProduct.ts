import { ShopifyFetchOptions, shopifyFetch} from '../utilities/shopifyFetch';

export interface RefundLineItemInput {
    lineItemId: string;
    quantity: number;
}
  
export interface RefundResponse {
    refundCreate: {
      refund: {
        id: string;
        order: {
          id: string;
        };
      };
      userErrors: Array<{
        field: string[];
        message: string;
      }>;
    };
}

export async function returnProductAndInitiateRefund(orderId: string, lineItems: RefundLineItemInput[]): Promise<RefundResponse['refundCreate']['refund']> {
  const mutation = `
    mutation refundCreate($orderId: ID!, $refundLineItems: [RefundLineItemInput!]!) {
      refundCreate(input: { orderId: $orderId, refundLineItems: $refundLineItems }) {
        refund {
          id
          order {
            id
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
    orderId: `gid://shopify/Order/${orderId}`,
    refundLineItems: lineItems.map(item => ({
      lineItemId: `gid://shopify/LineItem/${item.lineItemId}`,
      quantity: item.quantity
    }))
  };

  const options: ShopifyFetchOptions = {
    query: mutation,
    variables
  };

  try {
    const data: RefundResponse = await shopifyFetch<RefundResponse>(options);
    if (data.refundCreate.userErrors && data.refundCreate.userErrors.length > 0) {
      throw new Error(data.refundCreate.userErrors.map((error:any) => error.message).join(', '));
    }
    return data.refundCreate.refund;
  } catch (error:any) {
    console.error('GraphQL Error:', error.message);
    if (error.response) {
      console.error('GraphQL Response:', error.response);
    }
    if (error.request) {
      console.error('GraphQL Request:', error.request);
    }
    throw new Error(`Failed to initiate refund for order ${orderId}: ${error.message}`);
  }
}
