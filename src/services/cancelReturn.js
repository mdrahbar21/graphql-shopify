import { shopifyMutate1 } from '@/utilities/shopifyMutate1';  

export async function cancelReturn(returnId, notifyCustomer = false) {
    const mutation = `
        mutation returnCancel($id: ID!, $notifyCustomer: Boolean!) {
            returnCancel(id: $id, notifyCustomer: $notifyCustomer) {
                return {
                    id
                    name
                    status
                    decline{
                        note
                        reason
                    }
                    order {
                        cancellation{
                            staffNote
                        }
                        cancelReason
                        cancelledAt
                        billingAddress{  
                            address1
                            address2
                            city
                            company
                            country
                            countryCode
                            firstName
                            lastName
                            phone
                            province
                            zip
                        }

                    }
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
        notifyCustomer: notifyCustomer
    };
    const data = await shopifyMutate1(mutation, variables);
    return data.returnCancel;


    try {
        const data = await shopifyMutate1(mutation, variables);
        if (data.returnCancel.userErrors && data.returnCancel.userErrors.length > 0) {
            throw new Error(data.returnCancel.userErrors.map(error => error.message).join(', '));
        }
        return data.returnCancel;
    } catch (error) {
        console.error('GraphQL Error:', error);
        throw new Error(`Failed to cancel return with ID ${returnId}: ${error.message}`);
    }
}

