import { ShopifyFetchOptions, shopifyFetch } from '../utilities/shopifyFetch';

interface CalculateReturnResponse {
    returnCalculate: {
      id: string;
      returnLineItems: Array<{
        id: string;
        fulfillmentLineItem: { id: string };
        subtotalSet: { shopMoney: { amount: string; currencyCode: string } };
        totalTaxSet: { shopMoney: { amount: string; currencyCode: string } };
      }>;
      exchangeLineItems: Array<{
        id: string;
        variant: { id: string };
        subtotalSet: { shopMoney: { amount: string; currencyCode: string } };
        totalTaxSet: { shopMoney: { amount: string; currencyCode: string } };
      }>;
    };
  }
  
  export async function calculateReturn(orderId: string, returnLineItems: Array<{ fulfillmentLineItemId: string; quantity: number }>): Promise<CalculateReturnResponse> {
    const query = `
      query CalculateReturn($orderId: ID!, $returnLineItems: [ReturnLineItemInput!]!) {
        returnCalculate(input: { orderId: $orderId, returnLineItems: $returnLineItems }) {
          id
          returnLineItems {
            id
            fulfillmentLineItem {
              id
            }
            subtotalSet {
              shopMoney {
                amount
                currencyCode
              }
            }
            totalTaxSet {
              shopMoney {
                amount
                currencyCode
              }
            }
          }
          exchangeLineItems {
            id
            variant {
              id
            }
            subtotalSet {
              shopMoney {
                amount
                currencyCode
              }
            }
            totalTaxSet {
              shopMoney {
                amount
                currencyCode
              }
            }
          }
        }
      }
    `;
  
    const variables = {
      orderId: `gid://shopify/Order/${orderId}`,
      returnLineItems,
    };
  
    const options: ShopifyFetchOptions = {
      query,
      variables,
    };
  
    try {
      const data: CalculateReturnResponse = await shopifyFetch<CalculateReturnResponse>(options);
      return data;
    } catch (error:any) {
      console.error('GraphQL Error:', error);
      throw new Error(`Failed to calculate return for order ${orderId}: ${error.message}`);
    }
  }
  