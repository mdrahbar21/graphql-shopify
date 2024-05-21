import {shopifyFetch, ShopifyFetchOptions} from '../utilities/shopifyFetch';

interface ProductDetails {
  id: string;
  title: string;
  handle: string;
  descriptionHtml: string;
  images: {
    edges: Array<{
      node: {
        originalSrc: string;
        altText?: string;
      };
    }>;
  };
}

interface ProductResponse {
  product: ProductDetails;
}
// Convert a numeric product ID to Shopify's expected format
function formatShopifyGID(productId: string): string {
  return `gid://shopify/Product/${productId}`;
}

export async function getProductById(productId: string): Promise<ProductDetails> {
  const formattedProductId = formatShopifyGID(productId);

  const query = `
    query getProductById($id: ID!) {
      product(id: $id) {
        id
        title
        handle
        descriptionHtml
        images(first: 1) {
          edges {
            node {
              originalSrc
              altText
            }
          }
        }
      }
    }
  `;

  const options: ShopifyFetchOptions = {
    query,
    variables: { id: formattedProductId }
  };

  try {
    const { product }: ProductResponse = await shopifyFetch<ProductResponse>(options);
    return product;
  } catch (error) {
    console.error('GraphQL Error:', error);
    throw error;
  }
}

// export async function getProductById(productId: string): Promise<ProductDetails> {
//   console.log("Fetching product with ID:", productId);
//   const query = `
//   query getProductById($id: ID!) {
//     product(id: $id) {
//       id
//       title
//       handle
//       descriptionHtml
//       images(first: 4) {
//         edges {
//           node {
//             originalSrc
//             altText
//           }
//         }
//       }
//     }
//   }
  
//   `;

//   const options: ShopifyFetchOptions = { 
//     query,
//     variables: { id: productId }
//   };

//   try {
//     const { product }: ProductResponse = await shopifyFetch<ProductResponse>({ query, variables: { id: productId } });
//     return product;
//   } catch (error) {
//     console.error('GraphQL Error:', error);
//     throw error;
//   }
// }
