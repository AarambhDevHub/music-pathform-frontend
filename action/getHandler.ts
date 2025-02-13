"use server";

import { withActionHandler } from "@/components/utils/ActionUtils";
import { GlobalApiCall } from "@/components/utils/GlobalApiCall";
import { revalidatePath } from "next/cache";

const API_BASE_URL = process.env.API_BASE_URL;

export async function getIncompleteUploads() {
    return withActionHandler(async() => {
        const response = await GlobalApiCall({
          url: `${API_BASE_URL}/get/incomplete`,
          options: {
            method: "get",
            cache: 'no-cache'
          },
        });
      revalidatePath("/");
        return response;
    })
}


export async function getTacksUploads() {
  return withActionHandler(async() => {
      const response = await GlobalApiCall({
        url: `${API_BASE_URL}/get/track`,
        options: {
          method: "get",
          cache: 'no-cache'
        },
      });
    revalidatePath("/");

      return response;
  })
}

export async function getPlaybackHistory() {
  return withActionHandler(async() => {
      const response = await GlobalApiCall({
        url: `${API_BASE_URL}/history`,
        options: {
          method: "get",
          cache: 'no-cache'
        },
      });
    revalidatePath("/");

      return response;
  })
}