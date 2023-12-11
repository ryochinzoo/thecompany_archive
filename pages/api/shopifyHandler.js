const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STORE_FRONT_ACCESS_TOKEN

async function ShopifyData(query) {
  const URL = `https://${domain}/api/2023-10/graphql.json`
  const options = {
    endpoint: URL,
    method: "POST",
    headers: {
      "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query })
  }

  try {
    const data = await fetch(URL, options).then(response => {
      return response.json()
    })
    return data
  } catch (error) {
    throw new Error("Products not fetched")
  }
}

export async function getAllProducts() {
  const query = `
  {
    products(first: 30) {
      edges {
        node {
          title
          descriptionHtml
          handle
          onlineStoreUrl
          variants(first: 10) {
            edges {
              node {
                id
                title
                price  {
                  amount
                  currencyCode
                }
                image {
                  id
                  url
                }
              }
            }
          }
          images(first: 2) {
            edges {
              node {
                originalSrc
                altText
              }
            }
          }
        }
      }
    }
  }
`

  const response = await ShopifyData(query)
  const allProducts = response.data.products.edges ? response.data.products.edges : []

  return allProducts
}

//Cart handling
export async function getCartData(cachedCartId) {
  const query = `
    query {
      cart(
        id: "` +cachedCartId + `"
      ) {
        id
        createdAt
        updatedAt
        lines(first: 10) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                }
              }
              attributes {
                key
                value
              }
            }
          }
        }
        attributes {
          key
          value
        }
        cost {
          totalAmount {
            amount
            currencyCode
          }
          subtotalAmount {
            amount
            currencyCode
          }
          totalTaxAmount {
            amount
            currencyCode
          }
          totalDutyAmount {
            amount
            currencyCode
          }
        }
      }
    }
  `
  const response = await ShopifyData(query)
}

export async function createCart(data) {
  const query = `
  mutation {
    cartCreate(
      input: {
        lines: [
          {
            quantity: ` + data.quantity + `
            merchandiseId: "` + data.variantId + `"
          }
        ],
        # The information about the buyer that's interacting with the cart.
        attributes: {
          key: "cart_attribute",
          value: "This is a cart attribute"
        }
      }
    ) {
      cart {
        id
        createdAt
        updatedAt
        lines(first: 10) {
          edges {
            node {
              id
              merchandise {
                ... on ProductVariant {
                  id
                }
              }
            }
          }
        }
        buyerIdentity {
          deliveryAddressPreferences {
            __typename
          }
        }
        attributes {
          key
          value
        }
        # The estimated total cost of all merchandise that the customer will pay at checkout.
        cost {
          totalAmount {
            amount
            currencyCode
          }
          # The estimated amount, before taxes and discounts, for the customer to pay at checkout.
          subtotalAmount {
            amount
            currencyCode
          }
          # The estimated tax amount for the customer to pay at checkout.
          totalTaxAmount {
            amount
            currencyCode
          }
          # The estimated duty amount for the customer to pay at checkout.
          totalDutyAmount {
            amount
            currencyCode
          }
        }
      }
    }
  }
  `
  const response = await ShopifyData(query)
  //cart id を取得, return
  console.log(response)
  //const createdCartDetails = 
  return response
}

export async function updateCart(cartId, data) {
  const query = `
    
  `
  const response = await ShopifyData(query)
}

export async function addProduct(cartId, data) {
  const query = `
    
  `
  const response = await ShopifyData(query)
}