import { shopifyMutate1 } from '@/utilities/shopifyMutate1';
import { getReturnableFulfillments } from '@/services/returnableFulfillment';

export async function processReturnRequest(orderId, returnReason, customerNote) {
    try {
        const fulfillmentsData = await getReturnableFulfillments(orderId);
        const returnLineItems = [];

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
        return { success: true, data };
    } catch (error) {
        console.error("Return request failed:", error);
        return { success: false, error: error.message };
    }
}

