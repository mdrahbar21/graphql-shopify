export async function shopifyFetch1({ query, variables }) {
  console.log('called ShopifyFetch1');
    const endpoint = process.env.SHOPIFY_STORE_DOMAIN;
    const headers = {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_ACCESS_TOKEN || ''
    };
  
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ query, variables }),
    });
  
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  
    return response.json();
  }
  
  