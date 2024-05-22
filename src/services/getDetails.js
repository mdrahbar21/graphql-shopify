import {shopifyFetch1} from '@/utilities/shopifyFetch1'

export async function getDetails(orderId) {
    const query=`
        query getOrderDetails($id: ID!) {
            order(id: $id) {
              id
              transactions {
                id
                kind
                status
                createdAt
                processedAt
                amountSet{
                  shopMoney{
                    amount
                  }
                }
              }
                returns(first:10 reverse:true){
                edges{
                  node{
                    id
                    name
                    status
                    name
                    decline{
                      reason
                    }
                    returnLineItems(first:10){
                      edges{
                        node{
                          id
                          quantity
                          fulfillmentLineItem{
                            id
                            quantity
                            lineItem{
                              id
                              name
                              quantity
                            }
                          }
                        }

                      }
                    }
                  }
                }
              }
              refunds {
                id
                refundLineItems(first:25) {
                  edges{
                    node{
                      lineItem{
                        id
                      }
                      quantity
                      restockType
                    }
                  }

                }
                duties {
                  originalDuty{
                    id
                  }
                  amountSet {
                    shopMoney {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
    `
const variables = {
    id: `gid://shopify/Order/${orderId}`
}
return shopifyFetch1({query, variables});


// try {
//     const data = shopifyFetch1({ query, variables });
//     console.log("hello");
//     res.status(200).json(data);
// } catch (error) {
//     console.error('Error fetching order details:', error);
//     res.status(500).json({ message: 'Failed to fetch order details', error: error.message });
// }

}
