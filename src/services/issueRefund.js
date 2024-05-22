import { shopifyMutate1 } from '@/utilities/shopifyMutate1';

export async function issueRefund(returnId, returnRefundLineItems, refundShipping, refundDuties, orderTransactions) {
  const mutation = `
      mutation returnRefundMutation($returnRefundInput: ReturnRefundInput!) {
          returnRefund(returnRefundInput: $returnRefundInput) {
              refund {
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
      returnRefundInput: {
          returnId: returnId,
          returnRefundLineItems: returnRefundLineItems,
          refundShipping: refundShipping,
          refundDuties: refundDuties,
          orderTransactions: orderTransactions
      }
  };

  return shopifyMutate1(mutation, variables);
}
