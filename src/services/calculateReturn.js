import {shopifyMutate1} from '@/utilities/shopifyMutate1';

export async function calculateReturnFinancials(input) {
  const mutation = `
    mutation CalculateReturn($input: ReturnCalculateInput!) {
      returnCalculate(input: $input) {
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

  const variables = { input };
  return await shopifyMutate1({ mutation, variables });
}

