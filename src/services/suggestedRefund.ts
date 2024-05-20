import { ShopifyFetchOptions, shopifyFetch } from '../utilities/shopifyFetch';

interface SuggestedRefundResponse {
    return: {
      suggestedRefund: {
        amount: { shopMoney: { amount: string; currencyCode: string } };
        shipping: { maximumRefundableSet: { shopMoney: { amount: string; currencyCode: string } } };
        refundDuties: Array<{ amountSet: { shopMoney: { amount: string; currencyCode: string } } }>;
        subtotal: { shopMoney: { amount: string; currencyCode: string } };
        suggestedTransactions: Array<{
          amountSet: { shopMoney: { amount: string; currencyCode: string } };
          gateway: string;
          parentTransaction: { kind: string; id: string };
        }>;
      };
    };
  }
  
  export async function querySuggestedRefund(returnId: string, returnLineItems: Array<{ returnLineItemId: string; quantity: number }>): Promise<SuggestedRefundResponse> {
    const query = `
      query suggestedReturnRefundQuery($id: ID!, $returnRefundLineItems: [ReturnLineItemInput!]!) {
        return(id: $id) {
          suggestedRefund(returnRefundLineItems: $returnRefundLineItems) {
            amount {
              shopMoney {
                amount
                currencyCode
              }
            }
            shipping {
              maximumRefundableSet {
                shopMoney {
                  amount
                  currencyCode
                }
              }
            }
            refundDuties {
              amountSet {
                shopMoney {
                  amount
                  currencyCode
                }
              }
            }
            subtotal {
              shopMoney {
                amount
                currencyCode
              }
            }
            suggestedTransactions {
              amountSet {
                shopMoney {
                  amount
                  currencyCode
                }
              }
              gateway
              parentTransaction {
                kind
                id
              }
            }
          }
        }
      }
    `;
  
    const variables = {
      id: `gid://shopify/Return/${returnId}`,
      returnRefundLineItems: returnLineItems,
    };
  
    const options: ShopifyFetchOptions = {
      query,
      variables,
    };
  
    try {
      const data: SuggestedRefundResponse = await shopifyFetch<SuggestedRefundResponse>(options);
      return data;
    } catch (error:any) {
      console.error('GraphQL Error:', error);
      throw new Error(`Failed to query suggested refund for return ${returnId}: ${error.message}`);
    }
  }
  