import { ShopifyFetchOptions, shopifyFetch } from '../utilities/shopifyFetch';

interface Product {
  id: string;
  title: string;
  handle: string;
  descriptionHtml: string;
}

interface ProductsData {
  products: {
    edges: Array<{
      node: Product;
    }>;
  };
}

export async function getAllProducts(): Promise<Array<Product>> {
  const query = `
    {
      products(first: 25) {
        edges {
          node {
            id
            title
            handle
            descriptionHtml
          }
        }
      }
    }
  `;

  const options: ShopifyFetchOptions = { query };

  try {
    const data: ProductsData = await shopifyFetch<ProductsData>(options);
    return data.products.edges.map(edge => edge.node);
  } catch (error) {
    console.error('Failed to fetch products:', error);
    throw error;
  }
}
