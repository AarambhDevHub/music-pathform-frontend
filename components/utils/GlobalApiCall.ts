import { RedirectError } from "./ErrorUtils";
import { cookies } from "next/headers";
// import fetch, { RequestInit as NodeFetchRequestInit } from "node-fetch";
// import https from "https";

// interface RequestInit extends NodeFetchRequestInit {
//   credentials?: RequestCredentials;
// }

interface GlobalAPICallProps {
  url: string;
  options?: RequestInit;
}

// const agent = new https.Agent({
//   rejectUnauthorized: false,
// });

export const GlobalApiCall = async ({
  url,
  options = {},
}: GlobalAPICallProps) => {
  try {
    const cookieStore = cookies();

    const token = cookieStore.get("token") ?? null;

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token?.value ? { Authorization: `Bearer ${token.value}` } : {}),
        ...options.headers,
      },
      credentials: "include",
    });

    if (response.status === 401) {
      throw new RedirectError(302, "/api/logout", "session expired");
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("fetch Error:", error);
    throw error;
  }
};
