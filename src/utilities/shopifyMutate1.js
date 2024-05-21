export async function shopifyMutate1(mutation, variables) {
    const endpoint = process.env.SHOPIFY_STORE_DOMAIN; 
    const headers = {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_ACCESS_TOKEN
    };
  
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
            query: mutation,
            variables: variables,
        }),
    });
  
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
  
    const jsonResponse = await response.json();
    if (jsonResponse.errors) {
        console.error('GraphQL errors:', jsonResponse.errors);
        throw new Error(`Errors returned from GraphQL: ${JSON.stringify(jsonResponse.errors)}`);
    }
  
    return jsonResponse.data;
  }
  