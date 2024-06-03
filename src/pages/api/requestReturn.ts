import { shopifyMutate1 } from '@/utilities/shopifyMutate1';
import { getReturnableFulfillments } from '@/services/returnableFulfillment';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function processReturnRequest(req:NextApiRequest, res: NextApiResponse) {
  try {
        const {orderId, returnReason, customerNote}: {orderId: any, returnReason: any, customerNote?: string} = req.body;
        const fulfillmentsData = await getReturnableFulfillments(orderId);
        const returnLineItems:any = [];

        fulfillmentsData.data.returnableFulfillments.edges.forEach((fulfillment:any) => {
            fulfillment.node.returnableFulfillmentLineItems.edges.forEach((item:any) => {
                returnLineItems.push({
                    fulfillmentLineItemId: item.node.fulfillmentLineItem.id,
                    quantity: item.node.quantity,
                    returnReason,
                    customerNote
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
        return res.status(200).json({ success: true, ans });
    } catch (error:any) {
        console.error("Return request failed:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
}

