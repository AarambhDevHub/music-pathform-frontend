"use server";

import { withActionHandler } from "@/components/utils/ActionUtils";
import { GlobalApiCall } from "@/components/utils/GlobalApiCall";
import { revalidatePath } from "next/cache";

const API_BASE_URL = process.env.API_BASE_URL;

export async function savefavorite({ track_id }: { track_id: string }) {
  return withActionHandler(async () => {
    const response = await GlobalApiCall({
      url: `${API_BASE_URL}/favorite`,
      options: {
        method: "post",
        cache: "no-cache",
        body: JSON.stringify({ track_id }),
      },
    });
   
    return response;
  });
}

export async function deletefavorite({ track_id, pathName }: { track_id: string, pathName: string }) {
  return withActionHandler(async () => {
    const response = await GlobalApiCall({
      url: `${API_BASE_URL}/favorite`,
      options: {
        method: "delete",
        cache: "no-cache",
        body: JSON.stringify({ track_id }),
      },
    });

    if (pathName == "/favorites") {
      revalidatePath("/favorites")
    }
    return response;
  });
}

export async function getfavorite() {
  return withActionHandler(async () => {
    const response = await GlobalApiCall({
      url: `${API_BASE_URL}/favorite`,
      options: {
        method: "get",
        cache: "no-cache",
      },
    });

    revalidatePath("/");
    return response;
  });
}
