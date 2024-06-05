import { shopifyMutate1 } from '@/utilities/shopifyMutate1';
// import { getReturnableFulfillments } from '@/services/returnableFulfillment';
import { NextApiRequest, NextApiResponse } from 'next';
import { shopifyFetch } from '@/utilities/shopifyFetch';


export default async function POST(req:NextApiRequest, res: NextApiResponse) {
  try {
        const body = req.body || {};
        const {orderId}: {orderId: any} = body.orderId;
        const {reason}: {reason: any} = body.reason? body.reason.toString(): '';
        const {custNote}: {custNote: any} = body.custNote? body.custNote.toString(): '';
        const fulfillmentsData = await getReturnableFulfillments(orderId);
        const returnLineItems:any = [];
        console.log(orderId+' '+reason+' '+custNote+' '+JSON.stringify(fulfillmentsData));

        fulfillmentsData.data.returnableFulfillments.edges.forEach((fulfillment:any) => {
            fulfillment.node.returnableFulfillmentLineItems.edges.forEach((item:any) => {
                returnLineItems.push({
                    fulfillmentLineItemId: item.node.fulfillmentLineItem.id,
                    quantity: item.node.quantity,
                    reason,
                    custNote
                });
            });
        });

        const mutation = `
            mutation ReturnRequest($input: ReturnRequestInput!) {
                returnRequest(input: $input) {
                    userErrors {
                        field
                        message
                    }
                    return {
                        id
                        status
                        returnLineItems(first: 5) {
                            edges {
                                node {
                                    id
                                    returnReason
                                    customerNote
                                }
                            }
                        }
                        order {
                            id
                        }
                    }
                }
            }`;
        const variables = {
            input: {
                orderId: `gid://shopify/Order/${orderId}`,
                returnLineItems
            }
        };

        const data = await shopifyMutate1(mutation, variables);
        const ans=JSON.stringify(data);
        // console.log(ans);
        return res.status(200).json({ success: true, message: ans });
    } catch (error:any) {
        console.error("Return request failed:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

async function getReturnableFulfillments(orderId: any) {
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

