import { shopifyMutate1 } from '@/utilities/shopifyMutate1';

export async function requestReturn(){
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
        returnLineItems(first: 1) {
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
          returnLineItems: [
              {
                  fulfillmentLineItemId,
                  quantity,
                  returnReason,
                  customerNote
              }
          ]
      }
  };

  try {
      const data = await shopifyMutate1(mutation, variables);
      res.status(200).json(data);
  } catch (error) {
      console.error("Return request failed:", error);
      res.status(500).json({ message: error.message });
  }


shopifyMutate1({ mutation, variables })
    .then(data => console.log("Return request processed:", data))
    .catch(error => console.error("Return request failed:", error));
}