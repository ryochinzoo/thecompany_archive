const domain = process.env.SHOPIFY_STORE_DOMAIN
const storefrontAccessToken = process.env.SHOPIFY_STORE_FRONT_ACCESS_TOKEN

async function ShopifyData(query) {
  const URL = `https://${domain}/api/graphql.json`

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
                price
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
  console.log(response.data)
  const allProducts = response.data.products.edges ? response.data.products.edges : []

  return allProducts
}