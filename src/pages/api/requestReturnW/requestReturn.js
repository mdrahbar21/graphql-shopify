import {shopifyMutate1}  from "@/utilities/shopifyMutate1";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
      return res.status(405).end('Method Not Allowed');
  }

  const { orderId,returnLineItems, fulfillmentLineItemId, quantity, returnReason, customerNote } = req.body;

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
        returnLineItems(first: 20) {
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
          orderId,
          returnLineItems
          // [
              // {
              //     fulfillmentLineItemId,
              //     quantity,
              //     returnReason,
              //     customerNote
              // }
          // ]
      }
  };

  try {
      const data = await shopifyMutate1(mutation, variables);
      res.status(200).json(data);
  } catch (error) {
      console.error("Return request failed:", error);
      res.status(500).json({ message: error.message });
  }
}

/** Payload
{
    "orderId": "gid://shopify/Order/5281251557472",
    "fulfillmentLineItemId": "gid://shopify/FulfillmentLineItem/11309781188704",
    "quantity": 1,
    "returnReason": "WRONG_ITEM", 
    "customerNote": "Sorry, I ordered the wrong item. Could I get a refund or store credit?"
}
 
returnReason (enum)
SIZE_TOO_SMALL, SIZE_TOO_LARGE, UNWANTED, NOT_AS_DESCRIBED, WRONG_ITEM, DEFECTIVE, STYLE, COLOR, OTHER, UNKNOWN
**/