import axios from "axios";

export const get = async <TResponse>(url: string): Promise<TResponse> => {
  try {
    const baseURL = "https://api.github.com";
    const { data } = await axios.get(`${baseURL + url}`);
    return data;
  } catch (err) {
    console.error(`API error during get request to ${url}:`, err);
    throw err;
  }
};
