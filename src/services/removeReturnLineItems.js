import { shopifyMutate1 } from '@/utilities/shopifyMutate1';

export async function removeReturnLineItems(returnId, returnLineItems) {
  const mutation = `
      mutation RemoveReturnLineMutation($returnId: ID!, $returnLineItems: [ReturnLineItemInput!]!) {
          returnLineItemRemoveFromReturn(returnId: $returnId, returnLineItems: $returnLineItems) {
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
      returnId: `gid://shopify/Return/${returnId}`,
      returnLineItems,
  };

  return shopifyMutate1(mutation, variables)
      .then(data => {
          if (data.returnLineItemRemoveFromReturn.userErrors && data.returnLineItemRemoveFromReturn.userErrors.length > 0) {
              throw new Error(data.returnLineItemRemoveFromReturn.userErrors.map(error => error.message).join(', '));
          }
          return data.returnLineItemRemoveFromReturn;
      })
      .catch(error => {
          console.error('GraphQL Error:', error);
          throw new Error(`Failed to remove return line items for return ${returnId}: ${error.message}`);
      });
}