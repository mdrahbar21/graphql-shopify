import { shopifyMutate1 } from '@/utilities/shopifyMutate1';

export async function createReturn(orderId, returnLineItems, notifyCustomer = false, requestedAt) {
  const mutation = `
    mutation returnCreateMutation($returnInput: ReturnInput!) {
      returnCreate(returnInput: $returnInput) {
        return {
          id
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    returnInput: {
      orderId: `gid://shopify/Order/${orderId}`,
      notifyCustomer,
      requestedAt,
      returnLineItems: returnLineItems.map(item => ({
        fulfillmentLineItemId: item.fulfillmentLineItemId,
        quantity: item.quantity,
        returnReason: item.returnReason,
        returnReasonNote: item.returnReasonNote || ""
      }))
    }
  };

  return shopifyMutate1(mutation, variables)
    .then(data => {
      if (data.returnCreate && data.returnCreate.userErrors && data.returnCreate.userErrors.length > 0) {
        throw new Error(data.returnCreate.userErrors.map(error => error.message).join(', '));
      }
      return data.returnCreate;
    })
    .catch(error => {
      console.error('GraphQL Error:', error);
      throw new Error(`Failed to create return for order ${orderId}: ${error.message}`);
    });
}


