import { shopifyMutate1 } from '@/utilities/shopifyMutate1';

export async function approveReturn(returnId) {
  const mutation = `
    mutation ApproveReturnRequestMutation($id: ID!) {
      returnApproveRequest(input: { id: $id }) {
        return {
          id
          status
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    id: `gid://shopify/Return/${returnId}`,
  };

  return shopifyMutate1(mutation, variables)
    .then(data => {
      if (data.returnApproveRequest.userErrors && data.returnApproveRequest.userErrors.length > 0) {
        throw new Error(data.returnApproveRequest.userErrors.map(error => error.message).join(', '));
      }
      return data.returnApproveRequest;
    })
    .catch(error => {
      console.error('GraphQL Error:', error);
      throw new Error(`Failed to approve return with ID ${returnId}: ${error.message}`);
    });
}

