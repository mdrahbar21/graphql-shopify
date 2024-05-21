import { shopifyFetch1 } from '../utilities/shopifyFetch1';

export async function querySuggestedRefund(returnId) {
    const query = `
        query suggestedReturnRefundQuery($id: ID!) {
            return(id: $id) {
                suggestedRefund {
                    amount {
                        shopMoney {
                            amount
                            currencyCode
                        }
                    }
                    shipping {
                        maximumRefundableSet {
                            shopMoney {
                                amount
                                currencyCode
                            }
                        }
                    }
                    refundDuties {
                        amountSet {
                            shopMoney {
                                amount
                                currencyCode
                            }
                        }
                    }
                    subtotal {
                        shopMoney {
                            amount
                            currencyCode
                        }
                    }
                    suggestedTransactions {
                        amountSet {
                            shopMoney {
                                amount
                                currencyCode
                            }
                        }
                        gateway
                        parentTransaction {
                            kind
                            id
                        }
                    }
                }
            }
        }
    `;

    const variables = {
        id: `gid://shopify/Return/${returnId}`,
    };

    try {
        const data = await shopifyFetch1({ query, variables });
        return data;
    } catch (error) {
        console.error('GraphQL Error:', error);
        throw new Error(`Failed to query suggested refund for return ${returnId}: ${error.message}`);
    }
}

