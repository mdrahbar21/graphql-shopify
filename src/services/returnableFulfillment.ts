import { shopifyFetch } from '@/utilities/shopifyFetch';

export async function getReturnableFulfillments(orderId: string) {
  const query = `
    query returnableFulfillmentsQuery($orderId: ID!) {
      returnableFulfillments(orderId: $orderId, first: 10) {
        edges {
          node {
            id
            fulfillment {
              totalQuantity
              id
              status
            }
            returnableFulfillmentLineItems(first: 10) {
              edges {
                node {
                  fulfillmentLineItem {
                    lineItem{
                      name
                      id
                      vendor
                      product{
                        id
                        isGiftCard
                      }
                    }
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

  const variables = { orderId: `gid://shopify/Order/${orderId}` };
  return await shopifyFetch({ query, variables });
}
