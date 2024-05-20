// services/shopifyService.ts
import {shopifyFetch, ShopifyFetchOptions} from '../utilities/shopifyFetch';


interface ReturnableFulfillmentResponse {
  returnableFulfillments: {
    edges: Array<{
      node: {
        id: string;
        fulfillment: { id: string };
        returnableFulfillmentLineItems: {
          edges: Array<{
            node: {
              fulfillmentLineItem: { id: string };
              quantity: number;
            };
          }>;
        };
      };
    }>;
  };
}

export async function getReturnableFulfillments(orderId: string): Promise<ReturnableFulfillmentResponse> {
  const query = `
    query returnableFulfillmentsQuery($orderId: ID!) {
      returnableFulfillments(orderId: $orderId, first: 10) {
        edges {
          node {
            id
            fulfillment {
              id
            }
            returnableFulfillmentLineItems(first: 10) {
              edges {
                node {
                  fulfillmentLineItem {
                    id
                  }
                  quantity
                }
              }
            }
          }
        }
      }
    }
  `;

  const variables = {
    orderId: `gid://shopify/Order/${orderId}`,
  };

  const options: ShopifyFetchOptions = {
    query,
    variables,
  };

  try {
    const data: ReturnableFulfillmentResponse = await shopifyFetch<ReturnableFulfillmentResponse>(options);
    return data;
  } catch (error:any) {
    console.error('GraphQL Error:', error);
    throw new Error(`Failed to fetch returnable fulfillments for order ${orderId}: ${error.message}`);
  }
}
