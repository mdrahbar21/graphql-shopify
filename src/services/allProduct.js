import {  shopifyFetch1 } from '../utilities/shopifyFetch1';

export async function getAllProducts() {
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

  return shopifyFetch1({query})
}
//     .then(data => data.products.edges.map(edge => edge.node))
//     .catch(error => {
//       console.error('Failed to fetch products:', error);
//       throw error;
//     });
// }
