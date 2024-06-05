import { shopifyMutate1 } from '@/utilities/shopifyMutate1';
import { getReturnableFulfillments} from '@/services/returnableFulfillment';


export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  const { orderId, returnReason, customerNote } = req.body;

  try {
    // Fetch returnable fulfillments based on order ID
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
    res.status(200).json(data);
  } catch (error) {
    console.error("Return request failed:", error);
    res.status(500).json({ message: error.message });
  }
}
