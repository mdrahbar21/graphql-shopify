// import { shopifyMutate } from '@/utilities/shopifyMutate';

// export interface ReturnRequestInput {
//   // orderId: string;
//   // returnLineItems: returnLineItems[];
//       orderId: string,
//       returnLineItems: [
//         {
//           fulfillmentLineItemId: string,
//           quantity: number,
//           returnReason: string,
//           customerNote?: string 
//         }
//       ]
//     }

// export interface ReturnRequestResponse {
//   returnRequest: {
//     userErrors: UserError[];
//     return: ReturnDetails;
//   }
// }

// interface UserError {
//   code?: string;
//   message?: string;
//   field?: string[];
// }

// interface ReturnDetails {
//   id: string;
//   status: ReturnStatus;
//   returnLineItems: ReturnLineItemList;
//   order: OrderReference;
// }

// type ReturnStatus = 'REQUESTED' | 'OPEN' | 'DECLINED' | 'CLOSED'| 'CANCELED'; 

// interface ReturnLineItemList {
//   edges: ReturnLineItemEdge[];
// }

// interface ReturnLineItemEdge {
//   node: ReturnLineItem;
// }

// interface ReturnLineItem {
//   id: string;
//   returnReason: ReturnReason;
//   customerNote: string;
// }

// type ReturnReason = 'WRONG_ITEM' | 'DAMAGED_ITEM' | 'NOT_AS_DESCRIBED'; 

// interface OrderReference {
//   id: string;
// }


// export async function requestReturn(input: ReturnRequestInput) {
//   const mutation = `
// mutation ReturnRequest($input: ReturnRequestInput!) {
//   returnRequest(input: $input) {
//     userErrors {
//       field
//       message
//     }
//     return {
//       id
//       status
//       returnLineItems(first: 10) {
//         edges {
//           node {
//             id
//             returnReason
//             customerNote
//           }
//         }
//       }
//       order {
//         id
//       }
//     }
//   }
// }
// `;

// const variables = { input };


//   return await shopifyMutate<ReturnRequestResponse>({ mutation, variables });
// }

import { shopifyMutate1 } from '@/utilities/shopifyMutate1';


const mutation = `
mutation ReturnRequest($input: ReturnRequestInput!) {
  returnRequest(input: $input) {
    userErrors {
      field
      message
    }
    return {
      id
      status
      returnLineItems(first: 1) {
        edges {
          node {
            id
            returnReason
            customerNote
          }
        }
      }
      order {
        id
      }
    }
  }
}`;

const variables = {
  input: {
    orderId: "gid://shopify/Order/5281251557472",
    returnLineItems: [
      {
        fulfillmentLineItemId: "gid://shopify/FulfillmentLineItem/11309781155936",
        quantity: 1,
        returnReason: "WRONG_ITEM",
        customerNote: "Sorry, I ordered the wrong item. Could I get a refund or store credit?"
      }
    ]
  }
};

shopifyMutate1({ mutation, variables })
    .then(data => console.log("Return request processed:", data))
    .catch(error => console.error("Return request failed:", error));
