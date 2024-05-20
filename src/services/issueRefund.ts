import {shopifyFetch, ShopifyFetchOptions} from '../utilities/shopifyFetch';

interface IssueRefundResponse {
    returnRefund: {
      refund: { id: string };
      userErrors: Array<{ field: string[]; message: string }>;
    };
  }
  
  export async function issueRefund(
    returnId: string,
    returnRefundLineItems: Array<{ returnLineItemId: string; quantity: number }>,
    refundShipping?: { shippingRefundAmount: { amount: number; currencyCode: string }; fullRefund: boolean },
    refundDuties?: Array<{ dutyId: string; refundType: string }>,
    orderTransactions?: Array<{ transactionAmount: { amount: number; currencyCode: string }; parentId: string }>
  ): Promise<IssueRefundResponse> {
    const mutation = `
      mutation returnRefundMutation(
        $returnId: ID!,
        $returnRefundLineItems: [ReturnLineItemInput!]!,
        $refundShipping: RefundShippingInput,
        $refundDuties: [RefundDutyInput!],
        $orderTransactions: [OrderTransactionInput!]
      ) {
        returnRefund(input: {
          returnId: $returnId,
          returnRefundLineItems: $returnRefundLineItems,
          refundShipping: $refundShipping,
          refundDuties: $refundDuties,
          orderTransactions: $orderTransactions
        }) {
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
      returnId: `gid://shopify/Return/${returnId}`,
      returnRefundLineItems,
      refundShipping: refundShipping || null,
      refundDuties: refundDuties || [],
      orderTransactions: orderTransactions || []
    };
  
    const options: ShopifyFetchOptions = {
      query: mutation,
      variables
    };
  
    try {
      const data: IssueRefundResponse = await shopifyFetch<IssueRefundResponse>(options);
      if (data.returnRefund.userErrors && data.returnRefund.userErrors.length > 0) {
        throw new Error(data.returnRefund.userErrors.map(error => error.message).join(', '));
      }
      return {returnRefund:data.returnRefund};
    } catch (error:any) {
      console.error('GraphQL Error:', error);
      throw new Error(`Failed to issue refund for return ${returnId}: ${error.message}`);
    }
  }
  