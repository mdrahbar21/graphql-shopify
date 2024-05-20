
export interface ShopifyFetchOptions {
    query: string;
    variables?: { [key: string]: any };
}
  
export interface ShopifyFetchResponse<T> {
    data: T;
    errors?: Array<{
      message: string;
      locations?: Array<{ line: number, column: number }>;
      path?: Array<string | number>;
    }>;
}

  
  
export async function shopifyFetch<T>(options: ShopifyFetchOptions): Promise<T> {
  const endpoint = process.env.SHOPIFY_STORE_DOMAIN as string;
  const accessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN as string;

  const { query, variables } = options;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': accessToken,
      },
      body: JSON.stringify({
        query,
        variables,
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const jsonResponse: ShopifyFetchResponse<T> = await response.json();

    if (jsonResponse.errors) {
      console.error('GraphQL errors:', jsonResponse.errors);
      throw new Error('Errors returned from GraphQL');
    }

    return jsonResponse.data;
  } catch (error) {
    console.error('Error fetching data from Shopify:', error);
    throw new Error('Failed to fetch data from Shopify');
  }
}

