//import axios from "axios"
import qs from "qs";

export function getStrapiURL(path = "") {
    return `${
      process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337"
    }${path}`;
  }

export async function strapiHandler(path, urlParamsObject = {}, options = {}) {
    const mergedOptions = {
        headers: {
          "Content-Type": "application/json",
        },
        ...options,
      };
    
      // Build request URL
      const queryString = qs.stringify(urlParamsObject);
      const requestUrl = `${getStrapiURL(
        `/api${path}${queryString ? `?${queryString}` : ""}`
      )}`;
      console.log(requestUrl)
      // Trigger API call
      const response = await fetch(requestUrl, mergedOptions);
    
      // Handle response
      if (!response.ok) {
        console.error(response.statusText);
        throw new Error(`An error occured please try again`);
      }
      const data = await response.json();
      return data;
}