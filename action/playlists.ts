"use server";

import { withActionHandler } from "@/components/utils/ActionUtils";
import { GlobalApiCall } from "@/components/utils/GlobalApiCall";
import { revalidatePath } from "next/cache";

const API_BASE_URL = process.env.API_BASE_URL;

export async function getPlaylists() {
  return withActionHandler(async () => {
    const response = await GlobalApiCall({
      url: `${API_BASE_URL}/playlist`,
      options: {
        method: "get",
        cache: "no-cache",
      },
    });
    revalidatePath("/");

    return response;
  });
}

export async function addTrackPlaylists({
  playlist_id,
  track_id,
}: {
  playlist_id: string;
  track_id: string;
}) {
  return withActionHandler(async () => {
    const response = await GlobalApiCall({
      url: `${API_BASE_URL}/playlist/add`,
      options: {
        method: "post",
        cache: "no-cache",
        body: JSON.stringify({ playlist_id, track_id }),
      },
    });
    revalidatePath("/");
    return response;
  });
}

export async function getPlaylistsTracks({
    playlist_id,
}: {
    playlist_id: string;
}) {
  return withActionHandler(async () => {
    const response = await GlobalApiCall({
      url: `${API_BASE_URL}/playlist/${playlist_id}`,
      options: {
        method: "get",
        cache: "no-cache",
      },
    });
    revalidatePath("/");
    return response;
  });
}
