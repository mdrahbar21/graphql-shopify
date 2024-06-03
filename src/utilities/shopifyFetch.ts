
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

export async function shopifyFetch({ query, variables }: ShopifyFetchOptions) {
  const endpoint=process.env.SHOPIFY_STORE_DOMAIN;
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('X-Shopify-Access-Token', process.env.SHOPIFY_ADMIN_ACCESS_TOKEN || '');

  const response = await fetch(endpoint!, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return response.json();
}
