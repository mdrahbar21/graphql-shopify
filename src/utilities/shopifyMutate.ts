
export interface ShopifyMutateOptions {
    mutation: string;
    variables: { [key: string]: any };
  }
  
  export interface GraphQLResponse<T> {
    data: T;
    errors?: Array<{
      message: string;
      locations?: Array<{
        line: number;
        column: number;
      }>;
      path?: Array<string | number>;
      extensions?: {
        code: string;
        [key: string]: any;
      };
    }>;
  }
  
export async function shopifyMutate<T>(options: ShopifyMutateOptions): Promise<T> {
    const endpoint = process.env.SHOPIFY_STORE_DOMAIN; 
  
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('X-Shopify-Access-Token', process.env.SHOPIFY_ADMIN_ACCESS_TOKEN || '');
  
    try {
      const response = await fetch(endpoint!, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          query: options.mutation,
          variables: options.variables,
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
  
      return jsonResponse.data; // Returns only the data part of the response
    } catch (error:any) {
      console.error('Error fetching data from Shopify:', error);
      throw new Error(`Failed to execute mutation: ${error.message}`);
    }
  }
  
  