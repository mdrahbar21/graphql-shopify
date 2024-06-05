import { shopifyMutate1 } from '@/utilities/shopifyMutate1';
import { getReturnableFulfillments } from '@/services/returnableFulfillment';

export default async function POST(req,res){
    const { orderId, reason, custNote } = req.body;
    const data = await processReturnRequest(orderId, reason, custNote);
    return res.status(200).json({success: true,  message: data});
}
export async function processReturnRequest(orderId, returnReason, customerNote) {
    try {
        const fulfillmentsData = await getReturnableFulfillments(orderId);
        const returnLineItems = [];
        console.log(orderId+' '+returnReason+' '+customerNote+' '+JSON.stringify(fulfillmentsData));

        fulfillmentsData.data.returnableFulfillments.edges.forEach(fulfillment => {
            fulfillment.node.returnableFulfillmentLineItems.edges.forEach(item => {
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
                        returnLineItems(first: 25) {
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
        const ans=JSON.stringify(data)
        return ans;
    } catch (error) {
        console.error("Return request failed:", error);
        return error;
        return res.status(500).json({ success: false, message: error.message });
    }
}

